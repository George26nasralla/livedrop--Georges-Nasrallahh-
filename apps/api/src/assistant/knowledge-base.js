import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Knowledge Base - Policy search and retrieval
 * Uses simple keyword matching for grounding assistant responses
 */
class KnowledgeBase {
  constructor() {
    this.policies = [];
    this.loadPolicies();
  }

  /**
   * Load policies from ground-truth.json
   */
  loadPolicies() {
    try {
      const policiesPath = path.join(__dirname, '../../../../docs/ground-truth.json');
      const data = fs.readFileSync(policiesPath, 'utf8');
      this.policies = JSON.parse(data);
      console.log(` Loaded ${this.policies.length} policies from knowledge base`);
    } catch (error) {
      console.error(' Error loading knowledge base:', error);
      this.policies = [];
    }
  }

  /**
   * Find relevant policies based on user query
   * Uses keyword matching by category
   * @param {string} query - User's question
   * @param {number} limit - Max policies to return
   * @returns {Array} - Relevant policies
   */
  findRelevantPolicies(query, limit = 3) {
    const queryLower = query.toLowerCase();

    // Category keyword mapping
    const categoryKeywords = {
      returns: ['return', 'refund', 'exchange', 'money back', 'send back'],
      shipping: ['ship', 'delivery', 'deliver', 'track', 'carrier', 'fedex', 'ups', 'dhl'],
      warranty: ['warranty', 'guarantee', 'defect', 'broken', 'repair', 'replace'],
      payment: ['pay', 'payment', 'card', 'paypal', 'credit', 'debit', 'checkout'],
      privacy: ['privacy', 'data', 'personal', 'information', 'secure', 'safe', 'gdpr'],
      account: ['account', 'login', 'password', 'sign up', 'register', 'profile'],
      discounts: ['discount', 'coupon', 'promo', 'code', 'sale', 'offer'],
    };

    // Find matching category
    let matchedCategory = null;
    let maxMatches = 0;

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      const matches = keywords.filter(keyword => queryLower.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        matchedCategory = category;
      }
    }

    // If category matched, return policies from that category
    if (matchedCategory && maxMatches > 0) {
      const categoryPolicies = this.policies.filter(p => p.category === matchedCategory);
      return categoryPolicies.slice(0, limit);
    }

    // Fallback: search by direct keyword match in question/answer
    const keywordMatches = this.policies.filter(policy => {
      const searchText = `${policy.question} ${policy.answer}`.toLowerCase();
      return queryLower.split(' ').some(word => {
        // Skip common words
        if (word.length < 4) return false;
        return searchText.includes(word);
      });
    });

    return keywordMatches.slice(0, limit);
  }

  /**
   * Get policy by ID
   * @param {string} policyId - Policy ID (e.g., "Return1.1")
   * @returns {Object|null} - Policy object or null
   */
  getPolicyById(policyId) {
    return this.policies.find(p => p.id === policyId) || null;
  }

  /**
   * Get all policies in a category
   * @param {string} category - Category name
   * @returns {Array} - Policies in category
   */
  getPoliciesByCategory(category) {
    return this.policies.filter(p => p.category === category.toLowerCase());
  }

  /**
   * Get all categories
   * @returns {Array} - Unique category names
   */
  getCategories() {
    return [...new Set(this.policies.map(p => p.category))];
  }

  /**
   * Get total policy count
   */
  getPolicyCount() {
    return this.policies.length;
  }

  /**
   * Format policies for LLM context
   * @param {Array} policies - Array of policy objects
   * @returns {string} - Formatted text
   */
  formatPoliciesForContext(policies) {
    if (policies.length === 0) {
      return 'No relevant policies found.';
    }

    return policies
      .map(p => {
        return `[${p.id}] ${p.question}\n${p.answer}`;
      })
      .join('\n\n');
  }
}

// Export singleton instance
const knowledgeBase = new KnowledgeBase();
export default knowledgeBase;