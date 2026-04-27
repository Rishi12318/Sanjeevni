// routes/healthMetrics.js - Health tracking routes
const express = require('express');
const router = express.Router();
const HealthMetrics = require('../models/HealthMetrics');

// @route   POST /api/health/metrics
// @desc    Save health metrics
// @access  Private
router.post('/metrics', async (req, res) => {
  try {
    const metricsData = req.body;

    if (!metricsData.userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    const healthMetrics = new HealthMetrics(metricsData);
    
    // Calculate scores
    healthMetrics.calculatePhysicalScore();
    healthMetrics.calculateMentalScore();
    
    await healthMetrics.save();

    const summary = healthMetrics.getHealthSummary();

    res.status(201).json({
      success: true,
      message: 'Health metrics saved successfully',
      data: healthMetrics,
      summary
    });
  } catch (error) {
    console.error('Save health metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save health metrics',
      error: error.message
    });
  }
});

// @route   GET /api/health/metrics/user/:userId
// @desc    Get health metrics for a user
// @access  Private
router.get('/metrics/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, limit = 30 } = req.query;

    let query = { userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const metrics = await HealthMetrics.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Get health metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve health metrics',
      error: error.message
    });
  }
});

// @route   GET /api/health/metrics/:id
// @desc    Get specific health metric entry
// @access  Private
router.get('/metrics/:id', async (req, res) => {
  try {
    const metric = await HealthMetrics.findById(req.params.id);

    if (!metric) {
      return res.status(404).json({
        success: false,
        message: 'Health metric not found'
      });
    }

    res.json({
      success: true,
      data: metric
    });
  } catch (error) {
    console.error('Get health metric error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve health metric',
      error: error.message
    });
  }
});

// @route   GET /api/health/summary/:userId
// @desc    Get health summary for a user
// @access  Private
router.get('/summary/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 7 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const metrics = await HealthMetrics.find({
      userId,
      date: { $gte: startDate }
    }).sort({ date: -1 });

    if (metrics.length === 0) {
      return res.json({
        success: true,
        data: {
          message: 'No health data recorded',
          period: `Last ${days} days`
        }
      });
    }

    // Calculate averages
    const physicalScores = metrics
      .filter(m => m.physical?.overallScore)
      .map(m => m.physical.overallScore);
    
    const mentalScores = metrics
      .filter(m => m.mental?.overallScore)
      .map(m => m.mental.overallScore);

    const avgPhysical = physicalScores.length > 0
      ? Math.round(physicalScores.reduce((a, b) => a + b, 0) / physicalScores.length)
      : null;

    const avgMental = mentalScores.length > 0
      ? Math.round(mentalScores.reduce((a, b) => a + b, 0) / mentalScores.length)
      : null;

    const latestMetric = metrics[0];
    const latestSummary = latestMetric.getHealthSummary();

    res.json({
      success: true,
      data: {
        period: `Last ${days} days`,
        entriesCount: metrics.length,
        latest: latestSummary,
        averages: {
          physical: avgPhysical,
          mental: avgMental,
          overall: avgPhysical && avgMental 
            ? Math.round((avgPhysical + avgMental) / 2)
            : null
        },
        trend: {
          physical: physicalScores,
          mental: mentalScores
        }
      }
    });
  } catch (error) {
    console.error('Get health summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve health summary',
      error: error.message
    });
  }
});

// @route   GET /api/health/trends/:userId
// @desc    Get health trends for charts
// @access  Private
router.get('/trends/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 30, metric } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const metrics = await HealthMetrics.find({
      userId,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    let trendData = [];

    if (metric === 'physical') {
      trendData = metrics.map(m => ({
        date: m.date,
        score: m.physical?.overallScore || 0,
        bmi: m.physical?.bodyMetrics?.bmi,
        steps: m.physical?.activity?.steps,
        sleep: m.physical?.sleep?.hoursSlept
      }));
    } else if (metric === 'mental') {
      trendData = metrics.map(m => ({
        date: m.date,
        score: m.mental?.overallScore || 0,
        mood: m.mental?.mood?.primary,
        stress: m.mental?.stressLevel,
        anxiety: m.mental?.anxietyLevel,
        energy: m.mental?.energyLevel
      }));
    } else {
      trendData = metrics.map(m => ({
        date: m.date,
        physical: m.physical?.overallScore || 0,
        mental: m.mental?.overallScore || 0,
        overall: Math.round(
          ((m.physical?.overallScore || 0) + (m.mental?.overallScore || 0)) / 2
        )
      }));
    }

    res.json({
      success: true,
      data: trendData
    });
  } catch (error) {
    console.error('Get health trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve health trends',
      error: error.message
    });
  }
});

// @route   PUT /api/health/metrics/:id
// @desc    Update health metrics
// @access  Private
router.put('/metrics/:id', async (req, res) => {
  try {
    const metric = await HealthMetrics.findById(req.params.id);

    if (!metric) {
      return res.status(404).json({
        success: false,
        message: 'Health metric not found'
      });
    }

    Object.assign(metric, req.body);
    
    metric.calculatePhysicalScore();
    metric.calculateMentalScore();
    
    await metric.save();

    res.json({
      success: true,
      message: 'Health metrics updated successfully',
      data: metric
    });
  } catch (error) {
    console.error('Update health metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update health metrics',
      error: error.message
    });
  }
});

// @route   DELETE /api/health/metrics/:id
// @desc    Delete health metric entry
// @access  Private
router.delete('/metrics/:id', async (req, res) => {
  try {
    const metric = await HealthMetrics.findByIdAndDelete(req.params.id);

    if (!metric) {
      return res.status(404).json({
        success: false,
        message: 'Health metric not found'
      });
    }

    res.json({
      success: true,
      message: 'Health metric deleted successfully'
    });
  } catch (error) {
    console.error('Delete health metric error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete health metric',
      error: error.message
    });
  }
});

// @route   GET /api/health/alerts/:userId
// @desc    Get health alerts for a user
// @access  Private
router.get('/alerts/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const recentMetrics = await HealthMetrics.find({
      userId,
      'aiAssessment.alertsTriggered': { $exists: true, $ne: [] }
    })
      .sort({ date: -1 })
      .limit(10);

    const alerts = [];
    recentMetrics.forEach(metric => {
      if (metric.aiAssessment?.alertsTriggered) {
        alerts.push(...metric.aiAssessment.alertsTriggered.map(alert => ({
          ...alert,
          date: metric.date,
          metricId: metric._id
        })));
      }
    });

    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Get health alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve health alerts',
      error: error.message
    });
  }
});

module.exports = router;
