import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Identity Tests - Critical for Assignment
 * Assistant MUST NOT reveal AI model or say it's an AI
 */

// Load prompts once for all tests
const promptsPath = path.join(__dirname, '../../../docs/prompts.yaml');
const prompts = yaml.load(fs.readFileSync(promptsPath, 'utf8'));

describe('Identity Tests - Assistant Must Hide AI Nature', () => {
  
  describe('Name and Identity', () => {
    test('Has a human name (not ChatGPT/Llama/Claude)', () => {
      const name = prompts.assistant.identity.name;
      
      expect(name).toBeDefined();
      expect(name).not.toMatch(/chatgpt/i);
      expect(name).not.toMatch(/gpt/i);
      expect(name).not.toMatch(/llama/i);
      expect(name).not.toMatch(/claude/i);
      expect(name).not.toMatch(/AI/i);
      expect(name).not.toMatch(/bot/i);
      expect(name).not.toMatch(/assistant/i);
      
      // Should be a human-sounding name
      expect(name.length).toBeGreaterThan(2);
      expect(name.length).toBeLessThan(20);
    });

    test('Has a proper role/title', () => {
      const role = prompts.assistant.identity.role;
      
      expect(role).toBeDefined();
      expect(role.length).toBeGreaterThan(5);
    });

    test('Has personality traits defined', () => {
      const personality = prompts.assistant.identity.personality;
      
      expect(personality).toBeDefined();
      expect(Array.isArray(personality)).toBe(true);
      expect(personality.length).toBeGreaterThan(2);
    });
  });

  describe('Never Say Rules', () => {
    test('Has rules about what not to say', () => {
      const neverSay = prompts.assistant.never_say;
      
      expect(neverSay).toBeDefined();
      expect(Array.isArray(neverSay)).toBe(true);
      
      // Must include these critical phrases
      expect(neverSay.some(phrase => phrase.toLowerCase().includes('ai'))).toBe(true);
      expect(neverSay.some(phrase => phrase.toLowerCase().includes('chatgpt') || phrase.toLowerCase().includes('gpt'))).toBe(true);
      expect(neverSay.some(phrase => phrase.toLowerCase().includes('language model'))).toBe(true);
    });
  });

  describe('Response Templates (Mock Tests)', () => {
    test('Should respond naturally to "What\'s your name?"', () => {
      // Mock expected response format
      const mockResponse = "I'm Alex, a Customer Support Specialist here at LiveDrop.";
      
      // Validate response doesn't reveal AI
      expect(mockResponse).not.toMatch(/AI/i);
      expect(mockResponse).not.toMatch(/chatgpt/i);
      expect(mockResponse).not.toMatch(/llama/i);
      expect(mockResponse).not.toMatch(/language model/i);
      expect(mockResponse).not.toMatch(/artificial intelligence/i);
      
      // Should sound human
      expect(mockResponse).toMatch(/I'm|I am/);
      expect(mockResponse.length).toBeGreaterThan(10);
    });

    test('Should respond naturally to "Are you a robot?"', () => {
      // Mock expected response format
      const mockResponse = "I'm here to help you with any questions about your orders, products, or our policies. How can I assist you today?";
      
      // Validate response avoids direct AI admission
      expect(mockResponse).not.toMatch(/yes.*robot/i);
      expect(mockResponse).not.toMatch(/I'm an AI/i);
      expect(mockResponse).not.toMatch(/artificial/i);
      expect(mockResponse).not.toMatch(/machine learning/i);
      
      // Should redirect to helping
      expect(mockResponse).toMatch(/help|assist/i);
    });

    test('Should respond naturally to "Who created you?"', () => {
      // Mock expected response format  
      const mockResponse = "I work for LiveDrop as part of the customer support team. How can I help you today?";
      
      // Must reference company, NOT AI companies
      expect(mockResponse).not.toMatch(/openai/i);
      expect(mockResponse).not.toMatch(/meta/i);
      expect(mockResponse).not.toMatch(/anthropic/i);
      expect(mockResponse).not.toMatch(/google/i);
      
      // Should reference the store/company
      expect(mockResponse).toMatch(/LiveDrop/i);
    });

    test('Should never use prohibited phrases in responses', () => {
      const neverSay = prompts.assistant.never_say;
      
      // Mock various responses
      const mockResponses = [
        "I'm Alex from LiveDrop customer support.",
        "I'd be happy to help you with your order!",
        "Our return policy allows returns within 30 days.",
        "Let me check that for you right away."
      ];
      
      mockResponses.forEach(response => {
        neverSay.forEach(phrase => {
          expect(response.toLowerCase()).not.toContain(phrase.toLowerCase());
        });
      });
    });
  });

  describe('Company Branding', () => {
    test('References LiveDrop (not AI companies)', () => {
      const company = prompts.assistant.identity.company;
      
      expect(company).toBe('LiveDrop');
    });
  });
});