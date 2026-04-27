// models/ChatHistory.js - Chat conversation history with AI
const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    aiModel: {
      type: String,
      default: 'gemini-pro'
    },
    metadata: {
      symptoms: [String],
      urgencyLevel: String,
      suggestedActions: [String]
    }
  }],
  conversationType: {
    type: String,
    enum: ['general', 'symptoms', 'emergency', 'medication', 'followup'],
    default: 'general'
  },
  summary: {
    type: String
  },
  tags: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update lastMessageAt when new message is added
chatHistorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.messages && this.messages.length > 0) {
    this.lastMessageAt = this.messages[this.messages.length - 1].timestamp;
  }
  next();
});

// Method to add a message
chatHistorySchema.methods.addMessage = function(role, content, metadata = {}) {
  this.messages.push({
    role,
    content,
    timestamp: new Date(),
    metadata
  });
  this.lastMessageAt = new Date();
  return this.save();
};

// Method to get conversation summary
chatHistorySchema.methods.getConversationSummary = function() {
  const messageCount = this.messages.length;
  const userMessages = this.messages.filter(m => m.role === 'user').length;
  const duration = this.lastMessageAt - this.createdAt;
  
  return {
    sessionId: this.sessionId,
    messageCount,
    userMessages,
    duration: Math.floor(duration / 60000), // minutes
    type: this.conversationType,
    lastMessage: this.messages[messageCount - 1]?.content.substring(0, 100)
  };
};

// Index for faster queries
chatHistorySchema.index({ userId: 1, createdAt: -1 });
chatHistorySchema.index({ sessionId: 1 });
chatHistorySchema.index({ isActive: 1, lastMessageAt: -1 });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
