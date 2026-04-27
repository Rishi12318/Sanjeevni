// routes/auth.js - Authentication routes for all user types
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const NGO = require('../models/NGO');

const router = express.Router();

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

// ============= USER ROUTES =============

// User Signup
router.post('/signup/user', async (req, res) => {
  try {
    let userData = req.body;
    
    // Handle simple format OR complex format
    if (!userData.personalDetails) {
      // Simple format - convert to complex
      const nameParts = (userData.name || 'Test User').split(' ');
      userData = {
        personalDetails: {
          firstName: nameParts[0] || 'Test',
          lastName: nameParts.slice(1).join(' ') || 'User',
          dateOfBirth: new Date('2000-01-01'),
          gender: 'other'
        },
        contactInfo: {
          email: userData.email || 'test@test.com',
          phoneNumber: {
            primary: userData.phone || '1234567890'
          }
        },
        address: {
          village: userData.address || 'Test City',
          district: 'Test District',
          state: 'Test State',
          pincode: '123456'
        },
        password: userData.password || '12345678'  // Password at root level, not in authentication
      };
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 'contactInfo.email': userData.contactInfo.email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // Create new user
    const user = await User.create(userData);

    // Generate token
    const token = generateToken(user._id, 'user');

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.personalDetails.firstName + ' ' + user.personalDetails.lastName,
          email: user.contactInfo.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// User Login
router.post('/login/user', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id, 'user');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// ============= DOCTOR ROUTES =============

// Doctor Signup
router.post('/signup/doctor', async (req, res) => {
  try {
    const { 
      name, email, password, phone, specialization, 
      licenseNumber, yearsOfExperience, hospital, 
      qualifications, consultationFee, availableHours 
    } = req.body;

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ 
      $or: [{ email }, { licenseNumber }] 
    });
    if (existingDoctor) {
      return res.status(400).json({ 
        success: false, 
        message: 'Doctor with this email or license number already exists' 
      });
    }

    // Create new doctor
    const doctor = await Doctor.create({
      name,
      email,
      password,
      phone,
      specialization,
      licenseNumber,
      yearsOfExperience,
      hospital,
      qualifications,
      consultationFee,
      availableHours
    });

    // Generate token
    const token = generateToken(doctor._id, 'doctor');

    res.status(201).json({
      success: true,
      message: 'Doctor registered successfully. Verification pending.',
      data: {
        doctor: {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          specialization: doctor.specialization,
          role: doctor.role,
          isVerified: doctor.isVerified
        },
        token
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Doctor Login
router.post('/login/doctor', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if doctor exists
    const doctor = await Doctor.findOne({ email }).select('+password');
    if (!doctor || !(await doctor.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(doctor._id, 'doctor');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        doctor: {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          specialization: doctor.specialization,
          role: doctor.role,
          isVerified: doctor.isVerified
        },
        token
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// ============= NGO ROUTES =============

// NGO Signup
router.post('/signup/ngo', async (req, res) => {
  try {
    const { 
      organizationName, email, password, phone, registrationNumber,
      founderName, address, focusAreas, yearEstablished, 
      description, website, socialMedia 
    } = req.body;

    // Check if NGO already exists
    const existingNGO = await NGO.findOne({ 
      $or: [{ email }, { registrationNumber }] 
    });
    if (existingNGO) {
      return res.status(400).json({ 
        success: false, 
        message: 'NGO with this email or registration number already exists' 
      });
    }

    // Create new NGO
    const ngo = await NGO.create({
      organizationName,
      email,
      password,
      phone,
      registrationNumber,
      founderName,
      address,
      focusAreas,
      yearEstablished,
      description,
      website,
      socialMedia
    });

    // Generate token
    const token = generateToken(ngo._id, 'ngo');

    res.status(201).json({
      success: true,
      message: 'NGO registered successfully. Verification pending.',
      data: {
        ngo: {
          id: ngo._id,
          organizationName: ngo.organizationName,
          email: ngo.email,
          founderName: ngo.founderName,
          role: ngo.role,
          isVerified: ngo.isVerified
        },
        token
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// NGO Login
router.post('/login/ngo', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if NGO exists
    const ngo = await NGO.findOne({ email }).select('+password');
    if (!ngo || !(await ngo.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(ngo._id, 'ngo');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        ngo: {
          id: ngo._id,
          organizationName: ngo.organizationName,
          email: ngo.email,
          founderName: ngo.founderName,
          role: ngo.role,
          isVerified: ngo.isVerified
        },
        token
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
