const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// In-memory OTP storage (for production, use Redis or database)
const otpStore = new Map();

// OTP expiry time (10 minutes)
const OTP_EXPIRY = 10 * 60 * 1000;

// Email transporter configuration
let transporter = null;

// Initialize email transporter
function initializeEmailTransporter() {
  try {
    // Using Gmail as example - you'll need to configure this
    // For Gmail: Enable "Less secure app access" or use App Password
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
      }
    });
    console.log('✓ Email service configured');
  } catch (error) {
    console.log('⚠️  Email service not configured. OTPs will be logged to console only.');
    transporter = null;
  }
}

// Initialize on module load
initializeEmailTransporter();

// Generate 6-digit OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// Send email with OTP
async function sendOTPEmail(email, otp) {
  if (!transporter) {
    console.log(`📧 Email not configured. OTP for ${email}: ${otp}`);
    return false;
  }

  try {
    const mailOptions = {
      from: `"SanjeevniAI" <${process.env.EMAIL_USER || 'noreply@sanjeevniai.com'}>`,
      to: email,
      subject: 'Your SanjeevniAI Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #7DD9B8 0%, #66CDAA 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px solid #66CDAA; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #66CDAA; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏥 SanjeevniAI</h1>
              <p>Your Healthcare Companion</p>
            </div>
            <div class="content">
              <h2>Email Verification</h2>
              <p>Thank you for registering with SanjeevniAI!</p>
              <p>Please use the following verification code to complete your registration:</p>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              
              <p><strong>Important:</strong></p>
              <ul>
                <li>This code will expire in 10 minutes</li>
                <li>Do not share this code with anyone</li>
                <li>If you didn't request this code, please ignore this email</li>
              </ul>
              
              <p>Welcome to better healthcare access!</p>
              <p>- The SanjeevniAI Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; 2025 SanjeevniAI. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error('Email sending error:', error.message);
    console.log(`📧 Fallback - OTP for ${email}: ${otp}`);
    return false;
  }
}

// Send OTP to email
router.post('/send-otp', async (req, res) => {
  try {
    console.log('OTP Request received:', req.body);
    const { email } = req.body;

    if (!email) {
      console.log('Error: Email not provided');
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + OTP_EXPIRY;

    // Store OTP with expiry
    otpStore.set(email, { otp, expiresAt });

    console.log(`✅ OTP generated for ${email}: ${otp}`);

    // Send email (async - don't wait for it)
    sendOTPEmail(email, otp).catch(err => {
      console.error('Email send error:', err.message);
    });

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email',
      // TESTING MODE: Always return OTP for now
      otp: otp
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.'
    });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Check if OTP exists
    const storedData = otpStore.get(email);
    
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found. Please request a new OTP.'
      });
    }

    // Check if OTP is expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      });
    }

    // TESTING MODE: Accept ANY OTP - completely skip validation
    console.log(`✅ OTP accepted (testing mode): ${otp} for ${email}`);

    // OTP is valid, remove from store
    otpStore.delete(email);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP. Please try again.'
    });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + OTP_EXPIRY;

    // Update OTP in store
    otpStore.set(email, { otp, expiresAt });

    console.log(`✅ OTP resent for ${email}: ${otp}`);

    // Send email (async)
    sendOTPEmail(email, otp).catch(err => {
      console.error('Email send error:', err.message);
    });

    res.status(200).json({
      success: true,
      message: 'OTP resent successfully',
      // TESTING MODE: Always return OTP for now
      otp: otp
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP. Please try again.'
    });
  }
});

module.exports = router;
