import express from 'express';
import assistantEngine from '../assistant/engine.js';
import { trackIntent, trackFunctionCall, trackConversation } from './dashboard.js';

const router = express.Router();

router.post('/chat', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { message, context } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    const result = await assistantEngine.processMessage(message, context || {});

    // ✅ TRACK METRICS FOR DASHBOARD
    trackIntent(result.intent);
    trackConversation();
    if (result.functionCalled) {
      trackFunctionCall(result.functionCalled);
    }

    res.json({
      success: true,
      message: result.response,
      intent: result.intent,
      citations: result.citations || [],
      metadata: {
        functionCalled: result.functionCalled,
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Assistant error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process message',
      message: "I'm having trouble right now. Please try again."
    });
  }
});

router.get('/health', async (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    assistant: {
      name: 'Alex',
      role: 'Customer Support Specialist at GEORGEous store'
    }
  });
});

export default router;