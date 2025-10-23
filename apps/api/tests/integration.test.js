import request from 'supertest';
import IntentClassifier from '../src/assistant/intent-classifier.js';
import functionRegistry from '../src/assistant/function-registry.js';
import knowledgeBase from '../src/assistant/knowledge-base.js';
import citationValidator from '../src/assistant/citation-validator.js';
import connectDB from '../src/db.js';
import mongoose from 'mongoose';

const API_URL = 'http://localhost:5000';

describe('Integration Tests - End-to-End Workflows', () => {
  
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  /**
   * Integration Test 1: Support Interaction Flow
   * Tests: Intent → Knowledge Base → Citation Validation
   */
  describe('Test 1: Support Interaction Flow', () => {
    test('Policy question gets grounded response with valid citations', async () => {
      const classifier = new IntentClassifier();
      
      // Step 1: Classify intent
      const userQuery = "What is your return policy?";
      const intent = classifier.classify(userQuery);
      
      expect(intent).toBe('policy_question');
      
      // Step 2: Get relevant policies from knowledge base
      const policies = knowledgeBase.findRelevantPolicies(userQuery, 3);
      
      expect(policies.length).toBeGreaterThan(0);
      expect(policies[0].category).toBe('returns');
      
      // Step 3: Simulate response with citation
      const mockResponse = `You can return items within 30 days of purchase [Return1.1]. Items must be in original condition [Return1.2].`;
      
      // Step 4: Validate citations
      const validation = citationValidator.validate(mockResponse);
      
      expect(validation.isValid).toBe(true);
      expect(validation.validCitations).toContain('Return1.1');
      expect(validation.validCitations).toContain('Return1.2');
      expect(validation.invalidCitations.length).toBe(0);
    });

    test('Order status query calls correct function', async () => {
      const classifier = new IntentClassifier();
      
      // Step 1: Classify intent
      const userQuery = "Where is my order?";
      const intent = classifier.classify(userQuery);
      
      expect(intent).toBe('order_status');
      
      // Step 2: Verify function exists
      expect(functionRegistry.has('getOrderStatus')).toBe(true);
      
      // Step 3: Get function schema
      const func = functionRegistry.get('getOrderStatus');
      expect(func.schema.name).toBe('getOrderStatus');
      expect(func.schema.parameters.required).toContain('orderId');
    });

    test('Complaint intent triggers empathetic behavior', () => {
      const classifier = new IntentClassifier();
      
      // Classify complaint
      const userQuery = "My package arrived damaged!";
      const intent = classifier.classify(userQuery);
      
      expect(intent).toBe('complaint');
      
      // Get intent config
      const intentConfig = classifier.getIntentConfig(intent);
      
      expect(intentConfig).toBeDefined();
      expect(intentConfig.tone).toMatch(/empathetic/i);
      expect(intentConfig.behavior).toMatch(/acknowledge|solution|escalate/i);
    });
  });

  /**
   * Integration Test 2: Multi-Intent Conversation
   * Tests: Multiple intents in sequence
   */
  describe('Test 2: Multi-Intent Conversation Flow', () => {
    test('Handles greeting → product search → policy → order status', async () => {
      const classifier = new IntentClassifier();
      
      // Turn 1: Greeting
      const greeting = classifier.classify("Hello");
      expect(greeting).toBe('chitchat');
      
      // Turn 2: Product search
      const productQuery = classifier.classify("Do you have wireless headphones?");
      expect(productQuery).toBe('product_search');
      
      // Verify function exists
      expect(functionRegistry.has('searchProducts')).toBe(true);
      
      // Turn 3: Policy question
      const policyQuery = classifier.classify("What's your shipping policy?");
      expect(policyQuery).toBe('policy_question');
      
      // Verify KB has shipping policies
      const shippingPolicies = knowledgeBase.findRelevantPolicies("shipping", 2);
      expect(shippingPolicies.length).toBeGreaterThan(0);
      expect(shippingPolicies[0].category).toBe('shipping');
      
      // Turn 4: Order status
      const orderQuery = classifier.classify("Track my order");
      expect(orderQuery).toBe('order_status');
    });
  });

  /**
   * Integration Test 3: Function Calling with API Integration
   * Tests: Function registry → Database → API response
   */
  describe('Test 3: Function Calling Integration', () => {
    test('searchProducts function integrates with database', async () => {
      // Call function through registry
      const result = await functionRegistry.execute('searchProducts', {
        query: 'headphones',
        limit: 3
      });
      
      expect(result.success).toBe(true);
      expect(Array.isArray(result.products)).toBe(true);
      expect(result.count).toBeDefined();
      
      // Verify products have required fields
      if (result.products.length > 0) {
        const product = result.products[0];
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('category');
      }
    });

    test('Policy question does NOT call functions', () => {
      const classifier = new IntentClassifier();
      
      const policyQuery = "What is your return policy?";
      const intent = classifier.classify(policyQuery);
      
      expect(intent).toBe('policy_question');
      
      // Policy questions should use KB, not function calls
      const policies = knowledgeBase.findRelevantPolicies(policyQuery, 3);
      expect(policies.length).toBeGreaterThan(0);
      
      // Should NOT trigger order status or product search functions
      expect(intent).not.toBe('order_status');
      expect(intent).not.toBe('product_search');
    });

    test('Citation validator catches hallucinated citations', () => {
      // Response with fake citation
      const fakeResponse = "Our policy is very generous [FakePolicy999].";
      
      const validation = citationValidator.validate(fakeResponse);
      
      expect(validation.isValid).toBe(false);
      expect(validation.invalidCitations).toContain('FakePolicy999');
      expect(validation.validCitations.length).toBe(0);
    });
  });

  /**
   * Integration Test 4: Complete Purchase Flow (API-based)
   * Tests: Products API → Orders API → Real database
   */
  describe('Test 4: API Integration Flow', () => {
    test('Can browse products and get order data', async () => {
      // Step 1: Browse products
      const productsResponse = await request(API_URL)
        .get('/api/products')
        .query({ limit: 5 });
      
      expect(productsResponse.status).toBe(200);
      expect(productsResponse.body.products.length).toBeGreaterThan(0);
      
      // Step 2: Get orders (endpoint exists)
      const ordersResponse = await request(API_URL).get('/api/orders');
      
      // Accept either 200 or 400 (may need auth)
      expect([200, 400]).toContain(ordersResponse.status);
    });
  });

  /**
   * Integration Test 5: Knowledge Base + Citation System
   * Tests: Complete grounding workflow
   */
  describe('Test 5: Knowledge Base Integration', () => {
    test('KB search → Format for context → Validate citations', () => {
      // Step 1: Search KB
      const query = "How do I return an item?";
      const policies = knowledgeBase.findRelevantPolicies(query, 3);
      
      expect(policies.length).toBeGreaterThan(0);
      
      // Step 2: Format for LLM context
      const formatted = knowledgeBase.formatPoliciesForContext(policies);
      
      expect(formatted).toContain('[Return1.1]');
      expect(formatted.length).toBeGreaterThan(50);
      
      // Step 3: Simulate response with citations from KB
      const policyIds = policies.map(p => p.id);
      const mockResponse = `You can return items within 30 days [${policyIds[0]}].`;
      
      // Step 4: Validate
      const validation = citationValidator.validate(mockResponse);
      
      expect(validation.isValid).toBe(true);
      expect(validation.validCitations.length).toBeGreaterThan(0);
    });

    test('All KB categories are accessible', () => {
      const categories = knowledgeBase.getCategories();
      
      expect(categories).toContain('returns');
      expect(categories).toContain('shipping');
      expect(categories).toContain('warranty');
      expect(categories).toContain('payment');
      expect(categories.length).toBeGreaterThan(4);
    });
  });
});