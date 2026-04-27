// routes/appointments.js - Doctor appointment routes
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// @route   POST /api/appointments/create
// @desc    Create new appointment
// @access  Private
router.post('/create', async (req, res) => {
  try {
    const appointmentData = req.body;

    // Validate required fields
    if (!appointmentData.patientId || !appointmentData.doctorId || 
        !appointmentData.appointmentDate || !appointmentData.chiefComplaint) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: error.message
    });
  }
});

// @route   GET /api/appointments/patient/:patientId
// @desc    Get all appointments for a patient
// @access  Private
router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { status, upcoming } = req.query;

    let query = { patientId };
    
    if (status) {
      query.status = status;
    }
    
    if (upcoming === 'true') {
      query.appointmentDate = { $gte: new Date() };
      query.status = { $in: ['scheduled', 'confirmed'] };
    }

    const appointments = await Appointment.find(query)
      .populate('doctorId', 'personalDetails professionalInfo contactInfo')
      .sort({ appointmentDate: -1 });

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Get patient appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve appointments',
      error: error.message
    });
  }
});

// @route   GET /api/appointments/doctor/:doctorId
// @desc    Get all appointments for a doctor
// @access  Private
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { status, date } = req.query;

    let query = { doctorId };
    
    if (status) {
      query.status = status;
    }
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      query.appointmentDate = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'personalDetails contactInfo medicalDetails')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve appointments',
      error: error.message
    });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get specific appointment
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'personalDetails contactInfo medicalDetails')
      .populate('doctorId', 'personalDetails professionalInfo contactInfo');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve appointment',
      error: error.message
    });
  }
});

// @route   PUT /api/appointments/:id/confirm
// @desc    Confirm appointment
// @access  Private
router.put('/:id/confirm', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    appointment.status = 'confirmed';
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment confirmed',
      data: appointment
    });
  } catch (error) {
    console.error('Confirm appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm appointment',
      error: error.message
    });
  }
});

// @route   PUT /api/appointments/:id/cancel
// @desc    Cancel appointment
// @access  Private
router.put('/:id/cancel', async (req, res) => {
  try {
    const { cancelledBy, reason } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (!appointment.canCancel()) {
      return res.status(400).json({
        success: false,
        message: 'Appointment cannot be cancelled (less than 2 hours before scheduled time)'
      });
    }

    await appointment.cancel(cancelledBy, reason);

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: error.message
    });
  }
});

// @route   PUT /api/appointments/:id/complete
// @desc    Complete appointment with consultation details
// @access  Private
router.put('/:id/complete', async (req, res) => {
  try {
    const consultationData = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    await appointment.complete(consultationData);

    res.json({
      success: true,
      message: 'Appointment completed successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Complete appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete appointment',
      error: error.message
    });
  }
});

// @route   PUT /api/appointments/:id/start
// @desc    Start appointment consultation
// @access  Private
router.put('/:id/start', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    appointment.status = 'in_progress';
    appointment.consultation.startTime = new Date();
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment started',
      data: appointment
    });
  } catch (error) {
    console.error('Start appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start appointment',
      error: error.message
    });
  }
});

// @route   PUT /api/appointments/:id/rate
// @desc    Rate appointment
// @access  Private
router.put('/:id/rate', async (req, res) => {
  try {
    const { score, feedback } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed appointments'
      });
    }

    appointment.rating = {
      score,
      feedback,
      ratedAt: new Date()
    };
    
    await appointment.save();

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Rate appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit rating',
      error: error.message
    });
  }
});

// @route   GET /api/appointments/upcoming/count
// @desc    Get count of upcoming appointments
// @access  Private
router.get('/upcoming/count', async (req, res) => {
  try {
    const { userId, userType } = req.query;

    const query = {
      appointmentDate: { $gte: new Date() },
      status: { $in: ['scheduled', 'confirmed'] }
    };

    if (userType === 'patient') {
      query.patientId = userId;
    } else if (userType === 'doctor') {
      query.doctorId = userId;
    }

    const count = await Appointment.countDocuments(query);

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Get upcoming count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get count',
      error: error.message
    });
  }
});

module.exports = router;
