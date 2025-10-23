/**
 * Assistant Engine - Orchestrates the entire assistant workflow
 * Routes by intent, grounds on KB, calls functions, validates citations
 */
import IntentClassifier from './intent-classifier.js';
import functionRegistry from './function-registry.js';
import knowledgeBase from './knowledge-base.js';
import citationValidator from './citation-validator.js';
import llmClient from './llm-client.js';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AssistantEngine {
  constructor() {
    this.classifier = new IntentClassifier();
    
    // Load assistant identity from prompts.yaml
   const promptsPath = path.join(__dirname, '../../../../docs/prompts.yaml');
    this.config = yaml.load(fs.readFileSync(promptsPath, 'utf8'));
    this.identity = this.config.assistant.identity;
    this.neverSay = this.config.assistant.never_say;
    
    console.log(`✅ Assistant Engine initialized: ${this.identity.name}`);
  }

  /**
   * Main entry point - processes user message
   */
  async processMessage(userMessage, context = {}) {
    try {
      // Step 1: Classify intent
      const intent = this.classifier.classify(userMessage);
      console.log(`🎯 Intent: ${intent}`);

      // Step 2: Route based on intent
      switch (intent) {
        case 'policy_question':
          return await this.handlePolicyQuestion(userMessage, context);
        
        case 'order_status':
          return await this.handleOrderStatus(userMessage, context);
        
        case 'product_search':
          return await this.handleProductSearch(userMessage, context);
        
        case 'complaint':
          return await this.handleComplaint(userMessage, context);
        
        case 'chitchat':
          return await this.handleChitchat(userMessage, context);
        
        case 'off_topic':
          return await this.handleOffTopic(userMessage, context);
        
        case 'violation':
          return await this.handleViolation(userMessage, context);
        
        default:
          return await this.handleUnknown(userMessage, context);
      }
    } catch (error) {
      console.error('❌ Engine error:', error);
      return {
        success: false,
        error: error.message,
        response: "I apologize, but I'm having trouble processing your request right now. Please try again."
      };
    }
  }

  /**
   * Handle policy questions - uses knowledge base
   */
  async handlePolicyQuestion(userMessage, context) {
    console.log('📚 Handling policy question with KB grounding...');

    // Step 1: Find relevant policies
    const policies = knowledgeBase.findRelevantPolicies(userMessage, 3);
    
    if (policies.length === 0) {
      return {
        success: true,
        intent: 'policy_question',
        response: "I don't have specific information about that policy. Could you rephrase your question or contact our support team for more details?",
        citations: []
      };
    }

    // Step 2: Format policies for context
    const policiesContext = knowledgeBase.formatPoliciesForContext(policies);

    // Step 3: Build grounded prompt
    const systemPrompt = this.buildSystemPrompt('policy_question');
    const groundedPrompt = `${systemPrompt}

RELEVANT POLICIES:
${policiesContext}

USER QUESTION: ${userMessage}

INSTRUCTIONS:
- Answer based ONLY on the provided policies
- Use citation tags exactly as shown (e.g., [Return1.1])
- Be concise and professional
- If the policies don't fully answer the question, say so politely

YOUR RESPONSE:`;

    // Step 4: Generate response
    const response = await llmClient.generate(groundedPrompt, {
      temperature: 0.3, // Lower temperature for factual responses
      maxTokens: 300
    });

    // Step 5: Validate citations
    const validation = citationValidator.validate(response);

    return {
      success: true,
      intent: 'policy_question',
      response: response.trim(),
      citations: validation.validCitations,
      invalidCitations: validation.invalidCitations,
      policies: policies.map(p => ({ id: p.id, category: p.category }))
    };
  }

  /**
   * Handle order status - calls function
   */
  async handleOrderStatus(userMessage, context) {
    console.log('📦 Handling order status with function call...');

    // Extract order ID if provided
    const orderIdMatch = userMessage.match(/\b([A-Z0-9]{10,})\b/);
    const orderId = orderIdMatch ? orderIdMatch[1] : context.orderId;

    if (!orderId) {
      return {
        success: true,
        intent: 'order_status',
        response: "I'd be happy to check your order status! Could you please provide your order ID? It's usually a 10-12 character code like ORD12345ABC.",
        needsInput: 'orderId'
      };
    }

    // Call function
    const result = await functionRegistry.execute('getOrderStatus', { orderId });

    if (!result.success) {
      return {
        success: true,
        intent: 'order_status',
        response: `I couldn't find an order with ID ${orderId}. Please double-check the order number and try again.`,
        functionCalled: 'getOrderStatus',
        functionResult: result
      };
    }

    // Build response with order data
    const systemPrompt = this.buildSystemPrompt('order_status');
    const prompt = `${systemPrompt}

ORDER DATA:
Order ID: ${result.order.orderId}
Status: ${result.order.status}
Items: ${result.order.items.length} item(s)
Total: $${result.order.total}

USER QUESTION: ${userMessage}

Provide a friendly update about this order. Be specific and helpful.

YOUR RESPONSE:`;

    const response = await llmClient.generate(prompt, {
      temperature: 0.5,
      maxTokens: 200
    });

    return {
      success: true,
      intent: 'order_status',
      response: response.trim(),
      functionCalled: 'getOrderStatus',
      orderData: result.order
    };
  }

  /**
   * Handle product search - calls function
   */
  async handleProductSearch(userMessage, context) {
    console.log('🔍 Handling product search with function call...');

    // Extract search query
    const query = userMessage
      .replace(/do you (have|sell|carry)/i, '')
      .replace(/show me|find me/i, '')
      .trim();

    // Call function
    const result = await functionRegistry.execute('searchProducts', {
      query,
      limit: 5
    });

    if (!result.success || result.products.length === 0) {
      return {
        success: true,
        intent: 'product_search',
        response: `I couldn't find any products matching "${query}". Could you try a different search term or browse our categories?`,
        functionCalled: 'searchProducts',
        products: []
      };
    }

    // Build response
    const systemPrompt = this.buildSystemPrompt('product_search');
    const productsContext = result.products
      .map(p => `- ${p.name}: $${p.price} (${p.category})`)
      .join('\n');

    const prompt = `${systemPrompt}

SEARCH RESULTS for "${query}":
${productsContext}

USER QUESTION: ${userMessage}

Present these products in a helpful, conversational way. Mention 2-3 highlights.

YOUR RESPONSE:`;

    const response = await llmClient.generate(prompt, {
      temperature: 0.6,
      maxTokens: 250
    });

    return {
      success: true,
      intent: 'product_search',
      response: response.trim(),
      functionCalled: 'searchProducts',
      products: result.products,
      count: result.count
    };
  }

  /**
   * Handle complaints - empathetic response
   */
  async handleComplaint(userMessage, context) {
    console.log('😔 Handling complaint with empathy...');

    const systemPrompt = this.buildSystemPrompt('complaint');
    const prompt = `${systemPrompt}

USER COMPLAINT: ${userMessage}

INSTRUCTIONS:
- Acknowledge their frustration empathetically
- Apologize sincerely
- Offer to help resolve the issue
- Be professional but warm

YOUR RESPONSE:`;

    const response = await llmClient.generate(prompt, {
      temperature: 0.7,
      maxTokens: 200
    });

    return {
      success: true,
      intent: 'complaint',
      response: response.trim(),
      requiresEscalation: true
    };
  }

  /**
   * Handle chitchat - friendly responses
   */
  async handleChitchat(userMessage, context) {
    console.log('💬 Handling chitchat...');

    const systemPrompt = this.buildSystemPrompt('chitchat');
    const prompt = `${systemPrompt}

USER MESSAGE: ${userMessage}

Respond naturally and briefly. Then ask how you can help with LiveDrop.

YOUR RESPONSE:`;

    const response = await llmClient.generate(prompt, {
      temperature: 0.8,
      maxTokens: 100
    });

    return {
      success: true,
      intent: 'chitchat',
      response: response.trim()
    };
  }

  /**
   * Handle off-topic - redirect politely
   */
  async handleOffTopic(userMessage, context) {
    return {
      success: true,
      intent: 'off_topic',
      response: "I'm here to help with LiveDrop orders, products, and policies. Is there something I can assist you with regarding your shopping experience?"
    };
  }

  /**
   * Handle violations - firm but polite
   */
  async handleViolation(userMessage, context) {
    return {
      success: true,
      intent: 'violation',
      response: "I'm here to provide helpful customer support. Let's keep our conversation respectful. How can I assist you with LiveDrop today?"
    };
  }

  /**
   * Handle unknown intents
   */
  async handleUnknown(userMessage, context) {
    return {
      success: true,
      intent: 'unknown',
      response: "I'm not sure I understand. I can help you with orders, products, returns, shipping, and other LiveDrop policies. What would you like to know?"
    };
  }

  /**
   * Build system prompt with identity
   */
  buildSystemPrompt(intent) {
    const intentConfig = this.config.assistant.intents[intent] || {};
    
    return `You are ${this.identity.name}, a ${this.identity.role} at ${this.identity.company}.

PERSONALITY: ${this.identity.personality.join(', ')}

TONE: ${intentConfig.tone || 'professional and helpful'}

CRITICAL RULES - NEVER SAY:
${this.neverSay.map(phrase => `- "${phrase}"`).join('\n')}

ALWAYS:
- Sound human and natural
- Be concise
- Stay in character as ${this.identity.name}
- Reference LiveDrop, not AI companies`;
  }
}

// Export singleton
const assistantEngine = new AssistantEngine();
export default assistantEngine;