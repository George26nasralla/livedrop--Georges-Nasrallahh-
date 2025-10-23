import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load prompts configuration
const promptsPath = path.join(__dirname, '../../../../docs/prompts.yaml');
const prompts = yaml.load(fs.readFileSync(promptsPath, 'utf8'));

/**
 * Intent Classifier using keyword matching + patterns
 * Classifies user input into one of 7 intents
 */
class IntentClassifier {
  constructor() {
    this.intents = {
      policy_question: {
        keywords: [
          'return', 'refund', 'exchange', 'policy', 'shipping', 'delivery',
          'warranty', 'guarantee', 'payment', 'pay', 'privacy', 'data',
          'secure', 'account', 'discount', 'coupon', 'promo', 'offer'
        ],
        patterns: [
          /what.*policy/i,
          /how.*return/i,
          /how.*ship/i,
          /do you.*warranty/i,
          /payment.*method/i,
        ]
      },
      
      order_status: {
        keywords: [
          'order', 'track', 'tracking', 'status', 'where', 'delivery',
          'package', 'shipment', 'arrived', 'delivered'
        ],
        patterns: [
          /where.*order/i,
          /track.*order/i,
          /order.*status/i,
          /when.*arrive/i,
          /order.*#?\w+/i,
        ]
      },
      
      product_search: {
        keywords: [
          'find', 'search', 'looking for', 'need', 'want', 'buy',
          'purchase', 'available', 'stock', 'sell', 'have'
        ],
        patterns: [
          /do you (have|sell)/i,
          /looking for/i,
          /need.*product/i,
          /show me/i,
          /find.*product/i,
        ]
      },
      
      complaint: {
        keywords: [
          'complaint', 'problem', 'issue', 'wrong', 'damaged', 'broken',
          'terrible', 'awful', 'bad', 'disappointed', 'angry', 'upset',
          'manager', 'supervisor', 'escalate', 'defective', 'arrived damaged'
        ],
        patterns: [
          /terrible.*service/i,
          /speak.*manager/i,
          /file.*complaint/i,
          /not.*happy/i,
          /very.*disappointed/i,
          /arrived.*damaged/i,
          /package.*damaged/i,
        ]
      },
      
      chitchat: {
        keywords: [
          'hello', 'hi', 'hey', 'good morning', 'good afternoon',
          'how are you', 'what\'s up', 'your name', 'who are you',
          'thank you', 'thanks', 'bye', 'goodbye'
        ],
        patterns: [
          /^(hi|hello|hey)$/i,
          /how are you/i,
          /what.*your name/i,
          /who are you/i,
          /thank you|thanks/i,
        ]
      },
      
      off_topic: {
        keywords: [
          'weather', 'news', 'politics', 'sports', 'movie', 'music',
          'recipe', 'game', 'joke', 'story'
        ],
        patterns: [
          /what.*weather/i,
          /who won/i,
          /tell me.*joke/i,
          /what.*news/i,
        ]
      },
      
      violation: {
        keywords: [
          'idiot', 'stupid', 'dumb', 'hate you', 'scam', 'fraud',
          'terrible', 'suck', 'worst'
        ],
        patterns: [
          /you.*idiot/i,
          /this.*scam/i,
          /you.*suck/i,
          /you.*terrible/i,
          /you.*worst/i,
        ]
      },
    };
  }

  /**
   * Classify user input into an intent
   * @param {string} input - User's message
   * @returns {string} - Detected intent
   */
  classify(input) {
    const normalizedInput = input.toLowerCase().trim();
    
    // Check for violations first (directed at support/company)
    if (this.isViolation(normalizedInput)) {
      return 'violation';
    }
    
    // Check each intent
    const scores = {};
    
    for (const [intent, config] of Object.entries(this.intents)) {
      scores[intent] = this.calculateScore(normalizedInput, config);
    }
    
    // Get intent with highest score
    const bestIntent = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)[0];
    
    // If score is too low, default to chitchat or off_topic
    if (bestIntent[1] < 1) {
      return this.isGreeting(normalizedInput) ? 'chitchat' : 'off_topic';
    }
    
    return bestIntent[0];
  }

  /**
   * Check if input is a violation (abusive/inappropriate)
   * @param {string} input - Normalized user input
   * @returns {boolean}
   */
  isViolation(input) {
    const violationPhrases = [
      /you.*terrible/i,
      /you.*suck/i,
      /you.*idiot/i,
      /you.*stupid/i,
      /hate you/i,
      /you.*worst/i,
    ];
    
    return violationPhrases.some(pattern => pattern.test(input));
  }

  /**
   * Calculate matching score for an intent
   */
  calculateScore(input, config) {
    let score = 0;
    
    // Keyword matching
    for (const keyword of config.keywords) {
      if (input.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }
    
    // Pattern matching (worth more)
    for (const pattern of config.patterns) {
      if (pattern.test(input)) {
        score += 2;
      }
    }
    
    return score;
  }

  /**
   * Check if input matches a specific intent
   */
  matchesIntent(input, intentName) {
    const config = this.intents[intentName];
    return this.calculateScore(input, config) > 0;
  }

  /**
   * Check if input is a simple greeting
   */
  isGreeting(input) {
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
    return greetings.some(g => input.startsWith(g));
  }

  /**
   * Get intent configuration from YAML
   */
  getIntentConfig(intent) {
    return prompts.intents[intent] || null;
  }
}

export default IntentClassifier;