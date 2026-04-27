// routes/chat.js - Chat history routes
const express = require('express');
const router = express.Router();
const ChatHistory = require('../models/ChatHistory');

// @route   POST /api/chat/save
// @desc    Save chat conversation
// @access  Private
router.post('/save', async (req, res) => {
  try {
    const { userId, sessionId, messages, conversationType, summary, tags } = req.body;

    if (!userId || !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'userId and sessionId are required'
      });
    }

    // Check if session already exists
    let chatHistory = await ChatHistory.findOne({ userId, sessionId });

    if (chatHistory) {
      // Update existing conversation
      if (messages && messages.length > 0) {
        chatHistory.messages.push(...messages);
      }
      if (summary) chatHistory.summary = summary;
      if (tags) chatHistory.tags = tags;
      if (conversationType) chatHistory.conversationType = conversationType;
      
      await chatHistory.save();
    } else {
      // Create new conversation
      chatHistory = new ChatHistory({
        userId,
        sessionId,
        messages: messages || [],
        conversationType: conversationType || 'general',
        summary,
        tags
      });
      
      await chatHistory.save();
    }

    res.json({
      success: true,
      message: 'Chat history saved successfully',
      data: chatHistory
    });
  } catch (error) {
    console.error('Save chat history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save chat history',
      error: error.message
    });
  }
});

// @route   POST /api/chat/:sessionId/message
// @desc    Add a message to existing conversation
// @access  Private
router.post('/:sessionId/message', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId, role, content, metadata } = req.body;

    const chatHistory = await ChatHistory.findOne({ userId, sessionId });

    if (!chatHistory) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    await chatHistory.addMessage(role, content, metadata);

    res.json({
      success: true,
      message: 'Message added successfully',
      data: chatHistory
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add message',
      error: error.message
    });
  }
});

// @route   GET /api/chat/user/:userId
// @desc    Get all chat sessions for a user
// @access  Private
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, skip = 0, type } = req.query;

    const query = { userId, isActive: true };
    if (type) query.conversationType = type;

    const chatHistories = await ChatHistory.find(query)
      .sort({ lastMessageAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('sessionId conversationType summary tags lastMessageAt createdAt');

    const total = await ChatHistory.countDocuments(query);

    res.json({
      success: true,
      data: {
        chats: chatHistories,
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    });
  } catch (error) {
    console.error('Get chat histories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chat histories',
      error: error.message
    });
  }
});

// @route   GET /api/chat/session/:sessionId
// @desc    Get specific chat session
// @access  Private
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.query;

    const chatHistory = await ChatHistory.findOne({ sessionId, userId });

    if (!chatHistory) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    res.json({
      success: true,
      data: chatHistory
    });
  } catch (error) {
    console.error('Get chat session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chat session',
      error: error.message
    });
  }
});

// @route   DELETE /api/chat/session/:sessionId
// @desc    Delete/archive a chat session
// @access  Private
router.delete('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.body;

    const chatHistory = await ChatHistory.findOne({ sessionId, userId });

    if (!chatHistory) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    chatHistory.isActive = false;
    await chatHistory.save();

    res.json({
      success: true,
      message: 'Chat session archived successfully'
    });
  } catch (error) {
    console.error('Delete chat session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete chat session',
      error: error.message
    });
  }
});

// @route   GET /api/chat/user/:userId/summary
// @desc    Get conversation summaries for a user
// @access  Private
router.get('/user/:userId/summary', async (req, res) => {
  try {
    const { userId } = req.params;

    const chatHistories = await ChatHistory.find({ userId, isActive: true })
      .sort({ lastMessageAt: -1 })
      .limit(10);

    const summaries = chatHistories.map(chat => chat.getConversationSummary());

    res.json({
      success: true,
      data: summaries
    });
  } catch (error) {
    console.error('Get summaries error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve summaries',
      error: error.message
    });
  }
});

module.exports = router;
