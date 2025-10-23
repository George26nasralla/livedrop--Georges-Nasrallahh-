import IntentClassifier from '../src/assistant/intent-classifier.js';

describe('Intent Detection Tests', () => {
  const classifier = new IntentClassifier();

  describe('policy_question', () => {
    test('return policy', () => {
      expect(classifier.classify("What's your return policy?")).toBe('policy_question');
    });
    test('shipping question', () => {
      expect(classifier.classify("How long does shipping take?")).toBe('policy_question');
    });
    test('warranty question', () => {
      expect(classifier.classify("Do you offer warranties?")).toBe('policy_question');
    });
    test('payment question', () => {
      expect(classifier.classify("What payment methods?")).toBe('policy_question');
    });
    test('privacy question', () => {
      expect(classifier.classify("How do you protect my data?")).toBe('policy_question');
    });
  });

  describe('order_status', () => {
    test('track order', () => {
      expect(classifier.classify("Where is my order?")).toBe('order_status');
    });
    test('order status', () => {
      expect(classifier.classify("Track order 12345")).toBe('order_status');
    });
    test('delivery question', () => {
      expect(classifier.classify("When will it arrive?")).toBe('order_status');
    });
  });

  describe('product_search', () => {
    test('find product', () => {
      expect(classifier.classify("Do you have headphones?")).toBe('product_search');
    });
    test('product availability', () => {
      expect(classifier.classify("Do you sell laptops?")).toBe('product_search');
    });
    test('search request', () => {
      expect(classifier.classify("Show me keyboards")).toBe('product_search');
    });
  });

  describe('complaint', () => {
    test('damaged product', () => {
      expect(classifier.classify("My package arrived damaged")).toBe('complaint');
    });
    test('bad service', () => {
      expect(classifier.classify("Terrible service")).toBe('complaint');
    });
    test('disappointed', () => {
      expect(classifier.classify("I'm very disappointed")).toBe('complaint');
    });
  });

  describe('chitchat', () => {
    test('greeting', () => {
      expect(classifier.classify("Hello")).toBe('chitchat');
    });
    test('how are you', () => {
      expect(classifier.classify("How are you?")).toBe('chitchat');
    });
    test('thanks', () => {
      expect(classifier.classify("Thank you")).toBe('chitchat');
    });
  });

  describe('off_topic', () => {
    test('weather', () => {
      expect(classifier.classify("What's the weather?")).toBe('off_topic');
    });
    test('sports', () => {
      expect(classifier.classify("Who won the game?")).toBe('off_topic');
    });
    test('joke', () => {
      expect(classifier.classify("Tell me a joke")).toBe('off_topic');
    });
  });

  describe('violation', () => {
    test('insult', () => {
      expect(classifier.classify("You're terrible")).toBe('violation');
    });
    test('abusive', () => {
      expect(classifier.classify("You're an idiot")).toBe('violation');
    });
    test('negative', () => {
      expect(classifier.classify("You suck")).toBe('violation');
    });
  });
});