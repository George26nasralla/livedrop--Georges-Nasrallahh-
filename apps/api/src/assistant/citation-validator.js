import knowledgeBase from './knowledge-base.js';

/**
 * Citation Validator - Validates policy citations in assistant responses
 * Ensures assistant doesn't hallucinate policy IDs
 */
class CitationValidator {
  /**
   * Extract citation IDs from text
   * Looks for [PolicyID] format
   * @param {string} text - Response text with citations
   * @returns {Array} - Array of citation IDs
   */
  extractCitations(text) {
    // Match [PolicyID] or [Return1.1] format
    const citationRegex = /\[([A-Za-z0-9.]+)\]/g;
    const matches = [];
    let match;

    while ((match = citationRegex.exec(text)) !== null) {
      matches.push(match[1]);
    }

    return [...new Set(matches)]; // Remove duplicates
  }

  /**
   * Validate citations against knowledge base
   * @param {string} text - Response text with citations
   * @returns {Object} - Validation report
   */
  validate(text) {
    const citations = this.extractCitations(text);

    if (citations.length === 0) {
      return {
        isValid: true,
        validCitations: [],
        invalidCitations: [],
        hasCitations: false,
        message: 'No citations found in response',
      };
    }

    const validCitations = [];
    const invalidCitations = [];

    // Check each citation
    for (const citationId of citations) {
      const policy = knowledgeBase.getPolicyById(citationId);
      if (policy) {
        validCitations.push(citationId);
      } else {
        invalidCitations.push(citationId);
      }
    }

    const isValid = invalidCitations.length === 0;

    return {
      isValid,
      validCitations,
      invalidCitations,
      hasCitations: true,
      totalCitations: citations.length,
      message: isValid
        ? `All ${citations.length} citation(s) are valid`
        : `Found ${invalidCitations.length} invalid citation(s)`,
    };
  }

  /**
   * Get citation details
   * @param {string} citationId - Policy ID
   * @returns {Object|null} - Policy details or null
   */
  getCitationDetails(citationId) {
    return knowledgeBase.getPolicyById(citationId);
  }

  /**
   * Validate and get details for all citations
   * @param {string} text - Response text
   * @returns {Object} - Validation with policy details
   */
  validateWithDetails(text) {
    const validation = this.validate(text);

    if (!validation.hasCitations) {
      return validation;
    }

    // Add policy details for valid citations
    validation.citationDetails = validation.validCitations.map(id => {
      const policy = this.getCitationDetails(id);
      return {
        id,
        question: policy.question,
        category: policy.category,
      };
    });

    return validation;
  }

  /**
   * Check if text has valid citations
   * @param {string} text - Response text
   * @returns {boolean}
   */
  hasValidCitations(text) {
    const validation = this.validate(text);
    return validation.hasCitations && validation.isValid;
  }

  /**
   * Get all valid policy IDs from knowledge base
   * @returns {Array} - Array of valid policy IDs
   */
  getAllValidPolicyIds() {
    return knowledgeBase.policies.map(p => p.id);
  }
}

// Export singleton instance
const citationValidator = new CitationValidator();
export default citationValidator;