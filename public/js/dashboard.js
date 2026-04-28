// Get user data from localStorage
const userData = JSON.parse(localStorage.getItem('userData') || '{}');

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadUserInfo();
    calculateHealthScores();
    generateSuggestions();
});

// Load user information
function loadUserInfo() {
    const welcomeText = document.getElementById('welcomeText');
    const userName = userData.name || userData.organizationName || 'User';
    welcomeText.textContent = `Welcome back, ${userName}! 🎉`;
}

// Calculate health scores (mock calculation - in production, this would come from actual health data)
function calculateHealthScores() {
    // Generate random scores for demo (60-95 range)
    const mentalScore = Math.floor(Math.random() * 35) + 60;
    const physicalScore = Math.floor(Math.random() * 35) + 60;

    // Update UI
    document.getElementById('mentalScore').textContent = mentalScore;
    document.getElementById('physicalScore').textContent = physicalScore;

    // Update labels
    document.getElementById('mentalLabel').textContent = getScoreLabel(mentalScore);
    document.getElementById('physicalLabel').textContent = getScoreLabel(physicalScore);

    // Animate circular progress
    animateProgress('mentalProgress', mentalScore);
    animateProgress('physicalProgress', physicalScore);

    // Store scores for suggestions
    localStorage.setItem('healthScores', JSON.stringify({ mentalScore, physicalScore }));
}

// Animate circular progress meter
function animateProgress(elementId, score) {
    const progressEl = document.getElementById(elementId);
    const circle = progressEl.querySelector('.progress-circle');
    const circumference = 534; // 2 * PI * 85
    const offset = circumference - (score / 100) * circumference;
    
    setTimeout(() => {
        circle.style.strokeDashoffset = offset;
    }, 100);
}

// Get score label based on value
function getScoreLabel(score) {
    if (score >= 85) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 65) return 'Fair';
    return 'Needs Improvement';
}

// Generate personalized suggestions
function generateSuggestions() {
    const scores = JSON.parse(localStorage.getItem('healthScores') || '{"mentalScore": 75, "physicalScore": 75}');
    const suggestionsGrid = document.getElementById('suggestionsGrid');
    
    const suggestions = [];

    // Mental health suggestions
    if (scores.mentalScore < 75) {
        suggestions.push({
            emoji: '🧘‍♀️',
            title: 'Practice Meditation',
            description: 'Try 10 minutes of daily meditation to reduce stress and improve mental clarity.'
        });
        suggestions.push({
            emoji: '😴',
            title: 'Improve Sleep Quality',
            description: 'Aim for 7-9 hours of quality sleep. Establish a consistent bedtime routine.'
        });
    } else {
        suggestions.push({
            emoji: '🎯',
            title: 'Set Mental Goals',
            description: 'Keep your mind sharp with daily challenges and learning new skills.'
        });
    }

    // Physical health suggestions
    if (scores.physicalScore < 75) {
        suggestions.push({
            emoji: '🏃‍♂️',
            title: 'Increase Physical Activity',
            description: 'Aim for 30 minutes of moderate exercise daily. Start with a brisk walk!'
        });
        suggestions.push({
            emoji: '🥗',
            title: 'Balanced Nutrition',
            description: 'Include more fruits, vegetables, and whole grains in your diet.'
        });
    } else {
        suggestions.push({
            emoji: '💪',
            title: 'Maintain Your Routine',
            description: 'Great job! Keep up your excellent exercise and nutrition habits.'
        });
    }

    // General suggestions
    suggestions.push({
        emoji: '💧',
        title: 'Stay Hydrated',
        description: 'Drink at least 8 glasses of water daily to keep your body functioning optimally.'
    });

    suggestions.push({
        emoji: '🤝',
        title: 'Social Connection',
        description: 'Spend quality time with friends and family. Social bonds boost mental health.'
    });

    suggestions.push({
        emoji: '📱',
        title: 'Digital Detox',
        description: 'Take regular breaks from screens. Your eyes and mind will thank you!'
    });

    // Render suggestions
    suggestionsGrid.innerHTML = suggestions.map(suggestion => `
        <div class="suggestion-card">
            <h4><span class="emoji">${suggestion.emoji}</span>${suggestion.title}</h4>
            <p>${suggestion.description}</p>
        </div>
    `).join('');
}

// AI Chat Functions
function openAIChat() {
    document.getElementById('chatModal').classList.add('active');
    document.getElementById('chatInput').focus();
}

function closeAIChat() {
    document.getElementById('chatModal').classList.remove('active');
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function formatTriageReply(triageData) {
    if (!triageData) {
        return '';
    }

    const severity = String(triageData.severity || 'unknown');
    const conditions = Array.isArray(triageData.possible_conditions) ? triageData.possible_conditions : [];
    const advice = String(triageData.advice || '').trim();

    const lines = [];
    lines.push('Triage Summary');
    lines.push(`Severity: ${severity}`);
    lines.push(`Possible conditions: ${conditions.length ? conditions.join(', ') : 'Not enough data'}`);
    if (advice) {
        lines.push(`Triage advice: ${advice}`);
    }

    return lines.join('\n');
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;

    // Add user message to chat
    addMessageToChat('user', message);
    input.value = '';

    // Show typing indicator
    const typingIndicator = document.getElementById('typingIndicator');
    typingIndicator.classList.add('active');

    try {
        // Call triage endpoint so chatbot replies include severity and likely conditions.
        let triageReply = '';
        try {
            const triageResp = await fetch('/api/triage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: message })
            });

            if (triageResp.ok) {
                const triageData = await triageResp.json();
                triageReply = formatTriageReply(triageData);
            }
        } catch (triageError) {
            console.error('Triage fetch error:', triageError);
        }

        // Existing AI API call (if available in this deployment)
        const healthScores = JSON.parse(localStorage.getItem('healthScores') || '{}');
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                context: {
                    userName: userData.name || 'User',
                    role: userData.role || 'patient',
                    mentalHealth: healthScores.mentalScore,
                    physicalHealth: healthScores.physicalScore
                }
            })
        });

        const data = await response.json();
        
        // Hide typing indicator
        typingIndicator.classList.remove('active');

        if (data.success && data.data) {
            const aiText = data.data.response || String(data.data);
            const finalReply = triageReply ? `${triageReply}\n\nAI Assistant:\n${aiText}` : aiText;
            addMessageToChat('ai', finalReply);
        } else {
            if (triageReply) {
                addMessageToChat('ai', triageReply);
            } else {
                addMessageToChat('ai', 'Sorry, I encountered an error. Please try again.');
            }
        }
    } catch (error) {
        console.error('Chat error:', error);
        typingIndicator.classList.remove('active');

        // If chat endpoint is unavailable, still provide triage-guided reply.
        try {
            const triageResp = await fetch('/api/triage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: message })
            });

            if (triageResp.ok) {
                const triageData = await triageResp.json();
                const triageReply = formatTriageReply(triageData);
                addMessageToChat('ai', triageReply || 'Sorry, I\'m having trouble connecting. Please try again later.');
                return;
            }
        } catch (triageError) {
            console.error('Fallback triage error:', triageError);
        }

        addMessageToChat('ai', 'Sorry, I\'m having trouble connecting. Please try again later.');
    }
}

function addMessageToChat(sender, message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = message;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
