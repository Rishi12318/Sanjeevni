// Multi-step signup with OTP verification
let selectedRole = '';
let currentStep = 1;
let formData = {};
let otpTimerInterval;

// Role selection
function selectRole(role) {
    selectedRole = role;
    document.getElementById('roleSelection').classList.add('hidden');
    document.getElementById('registrationForm').classList.remove('hidden');
    
    const roleTitle = role === 'user' ? 'Patient' : role.charAt(0).toUpperCase() + role.slice(1);
    document.getElementById('roleTitle').textContent = roleTitle;
    
    // Show appropriate fields for step 2 based on role
    if (role === 'user') {
        document.getElementById('patientFields').classList.remove('hidden');
        document.getElementById('doctorFields').classList.add('hidden');
        document.getElementById('ngoFields').classList.add('hidden');
    } else if (role === 'doctor') {
        document.getElementById('patientFields').classList.add('hidden');
        document.getElementById('doctorFields').classList.remove('hidden');
        document.getElementById('ngoFields').classList.add('hidden');
    } else if (role === 'ngo') {
        document.getElementById('patientFields').classList.add('hidden');
        document.getElementById('doctorFields').classList.add('hidden');
        document.getElementById('ngoFields').classList.remove('hidden');
    }
}

function backToRoles() {
    document.getElementById('roleSelection').classList.remove('hidden');
    document.getElementById('registrationForm').classList.add('hidden');
    resetForm();
}

function resetForm() {
    currentStep = 1;
    formData = {};
    document.getElementById('step1Form').reset();
    document.getElementById('step2Form').reset();
    document.getElementById('otpInput').value = '';
    hideMessage();
    updateStepIndicators();
}

function updateStepIndicators() {
    // Update step indicators
    const steps = ['step1Indicator', 'step2Indicator', 'step3Indicator'];
    const lines = ['line1', 'line2'];
    
    steps.forEach((stepId, index) => {
        const step = document.getElementById(stepId);
        if (index + 1 < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (index + 1 === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
    
    // Update connecting lines
    lines.forEach((lineId, index) => {
        const line = document.getElementById(lineId);
        if (index + 1 < currentStep) {
            line.classList.add('bg-olive');
            line.classList.remove('bg-gray-300');
        } else {
            line.classList.add('bg-gray-300');
            line.classList.remove('bg-olive');
        }
    });
}

function showMessage(text, isError = false) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `mb-6 p-4 rounded-lg ${isError ? 'bg-red-100 text-red-700 border-2 border-red-300' : 'bg-green-100 text-green-700 border-2 border-green-300'}`;
    messageEl.classList.remove('hidden');
    messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideMessage() {
    document.getElementById('message').classList.add('hidden');
}

// Step 1: Basic Information
document.getElementById('step1Form').addEventListener('submit', (e) => {
    e.preventDefault();
    hideMessage();
    
    // Collect basic data
    formData.name = document.getElementById('name').value.trim();
    formData.email = document.getElementById('email').value.trim();
    formData.phone = document.getElementById('phone').value.trim();
    formData.password = document.getElementById('password').value;
    formData.address = document.getElementById('address').value.trim();
    
    // Validate
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.address) {
        showMessage('Please fill in all required fields', true);
        return;
    }
    
    // Move to step 2
    document.getElementById('step1Form').classList.add('hidden');
    document.getElementById('step2Form').classList.remove('hidden');
    currentStep = 2;
    updateStepIndicators();
});

// Step 2: Role-specific details
document.getElementById('step2Form').addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessage();
    
    // Collect role-specific data (optional fields for testing)
    if (selectedRole === 'doctor') {
        formData.specialization = document.getElementById('specialization')?.value.trim() || 'General';
        formData.licenseNumber = document.getElementById('licenseNumber')?.value.trim() || 'TEST123';
        formData.yearsOfExperience = parseInt(document.getElementById('yearsOfExperience')?.value) || 5;
        formData.hospital = document.getElementById('hospital')?.value.trim() || 'Test Hospital';
        formData.qualifications = document.getElementById('qualifications')?.value.trim() || 'MBBS';
        formData.consultationFee = parseInt(document.getElementById('consultationFee')?.value) || 500;
        formData.availableHours = document.getElementById('availableHours')?.value.trim() || '9-5';
    } else if (selectedRole === 'ngo') {
        formData.organizationName = document.getElementById('organizationName')?.value.trim() || 'Test NGO';
        formData.registrationNumber = document.getElementById('registrationNumber')?.value.trim() || 'NGO123';
        formData.founderName = document.getElementById('founderName')?.value.trim() || 'Test Founder';
        formData.yearEstablished = parseInt(document.getElementById('yearEstablished')?.value) || 2020;
        formData.focusAreas = document.getElementById('focusAreas')?.value.split(',').map(a => a.trim()) || ['Health'];
        formData.description = document.getElementById('description')?.value.trim() || 'Test Description';
        formData.website = document.getElementById('website')?.value.trim() || '';
        formData.socialMedia = document.getElementById('socialMedia')?.value.trim() || '';
    }
    
    // Send OTP
    try {
        showMessage('Sending verification code...');
        const response = await fetch('/api/otp/send-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: formData.email })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Show OTP in a prominent alert for testing
            if (data.otp) {
                console.log('OTP for testing:', data.otp);
                alert(`✅ Your OTP Code: ${data.otp}\n\n(This is for testing - in production, check your email)`);
                showMessage(`✅ OTP Generated: ${data.otp} - Enter this code below`);
            } else {
                showMessage('Verification code sent to your email!');
            }
            
            // Move to step 3
            setTimeout(() => {
                document.getElementById('step2Form').classList.add('hidden');
                document.getElementById('step3Form').classList.remove('hidden');
                document.getElementById('otpEmail').textContent = formData.email;
                currentStep = 3;
                updateStepIndicators();
                startOTPTimer();
                hideMessage();
            }, data.otp ? 2000 : 2000);
        } else {
            showMessage(data.message || 'Failed to send OTP', true);
        }
    } catch (error) {
        console.error('Send OTP error:', error);
        showMessage('Error sending verification code. Please try again.', true);
    }
});

// OTP Timer
function startOTPTimer() {
    let timeLeft = 600; // 10 minutes
    const timerEl = document.getElementById('otpTimer');
    
    otpTimerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(otpTimerInterval);
            timerEl.textContent = 'Expired';
            showMessage('OTP has expired. Please resend.', true);
        }
        timeLeft--;
    }, 1000);
}

// Resend OTP
async function resendOTP() {
    hideMessage();
    showMessage('Resending verification code...');
    
    try {
        const response = await fetch('/api/otp/resend-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: formData.email })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Show OTP in a prominent alert for testing
            if (data.otp) {
                console.log('New OTP for testing:', data.otp);
                alert(`🔔 NEW VERIFICATION CODE\n\nYour OTP is: ${data.otp}\n\nPlease enter this code to verify your account.`);
                showMessage('New verification code sent!');
            } else {
                showMessage('New verification code sent!');
            }
            clearInterval(otpTimerInterval);
            startOTPTimer();
        } else {
            showMessage(data.message || 'Failed to resend OTP', true);
        }
    } catch (error) {
        console.error('Resend OTP error:', error);
        showMessage('Error resending code. Please try again.', true);
    }
}

// Verify OTP and create account
async function verifyOTP() {
    const otp = document.getElementById('otpInput').value.trim();
    
    if (!otp) {
        showMessage('Please enter a code', true);
        return;
    }
    
    hideMessage();
    showMessage('Verifying code...');
    const verifyBtn = document.getElementById('verifyBtn');
    verifyBtn.disabled = true;
    verifyBtn.textContent = 'Verifying...';
    
    try {
        // First verify OTP
        const otpResponse = await fetch('/api/otp/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: formData.email,
                otp: otp
            })
        });
        
        const otpData = await otpResponse.json();
        
        if (!otpData.success) {
            showMessage(otpData.message || 'Invalid verification code', true);
            verifyBtn.disabled = false;
            verifyBtn.textContent = 'Verify & Create Account';
            return;
        }
        
        // OTP verified, now create account
        showMessage('Code verified! Creating your account...');
        
        // Send simple format - backend will handle conversion
        let signupPayload = formData;
        
        const signupResponse = await fetch(`/api/auth/signup/${selectedRole}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupPayload)
        });
        
        const signupData = await signupResponse.json();
        
        if (signupData.success && signupData.data && signupData.data.token) {
            // Store auth data
            localStorage.setItem('token', signupData.data.token);
            localStorage.setItem('userRole', selectedRole);
            
            // Store user data for dashboard
            if (selectedRole === 'user') {
                localStorage.setItem('userId', signupData.data.user.id);
                localStorage.setItem('userData', JSON.stringify({
                    ...formData,
                    id: signupData.data.user.id,
                    role: 'patient'
                }));
            } else if (selectedRole === 'doctor') {
                localStorage.setItem('userId', signupData.data.doctor.id);
                localStorage.setItem('userData', JSON.stringify({
                    ...formData,
                    id: signupData.data.doctor.id,
                    role: 'doctor'
                }));
            } else if (selectedRole === 'ngo') {
                localStorage.setItem('userId', signupData.data.ngo.id);
                localStorage.setItem('userData', JSON.stringify({
                    ...formData,
                    id: signupData.data.ngo.id,
                    role: 'ngo'
                }));
            }
            
            showMessage('✓ Account created successfully! Redirecting to dashboard...');
            clearInterval(otpTimerInterval);
            
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 2000);
        } else {
            showMessage(signupData.message || 'Failed to create account. Please try again.', true);
            verifyBtn.disabled = false;
            verifyBtn.textContent = 'Verify & Create Account';
        }
    } catch (error) {
        console.error('Verification error:', error);
        showMessage('Error creating account. Please try again.', true);
        verifyBtn.disabled = false;
        verifyBtn.textContent = 'Verify & Create Account';
    }
}

// Previous step navigation
function previousStep() {
    hideMessage();
    
    if (currentStep === 2) {
        document.getElementById('step2Form').classList.add('hidden');
        document.getElementById('step1Form').classList.remove('hidden');
        currentStep = 1;
    } else if (currentStep === 3) {
        clearInterval(otpTimerInterval);
        document.getElementById('step3Form').classList.add('hidden');
        document.getElementById('step2Form').classList.remove('hidden');
        currentStep = 2;
    }
    
    updateStepIndicators();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateStepIndicators();
});
