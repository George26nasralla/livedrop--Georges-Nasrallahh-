import groundTruth from './ground-truth.json';
import { getOrderStatus as getOrderStatusAPI } from '../lib/api';

interface QAPair {
  qid: string;
  category: string;
  question: string;
  answer: string;
}

interface MatchResult {
  answer: string;
  citation: string;
  confidence: number;
  orderStatus?: {
    id: string;
    status: string;
    carrier?: string;
    eta?: string;
  };
}

// Simple keyword-based scoring with out-of-scope detection
function scoreMatch(userQuery: string, qaItem: QAPair): number {
  const queryLower = userQuery.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  const questionLower = qaItem.question.toLowerCase();
  const questionWords = questionLower.split(/\s+/);
  const answerWords = qaItem.answer.toLowerCase().split(/\s+/);
  
  // Check if query is completely unrelated (out of scope keywords)
  const outOfScopeKeywords = ['weather', 'joke', 'news', 'sports', 'movie', 'game', 'recipe', 'president', 'celebrity'];
  if (outOfScopeKeywords.some(keyword => queryLower.includes(keyword))) {
    return 0; // Immediately reject out-of-scope queries
  }
  
  let score = 0;
  let questionMatches = 0;
  
  // First check: do key question words appear in the query?
  for (const word of queryWords) {
    if (questionWords.some(qw => qw === word || (qw.length > 4 && word.length > 4 && (qw.includes(word) || word.includes(qw))))) {
      score += 10;
      questionMatches++;
    }
    // Lower weight for answer matches
    if (answerWords.some(aw => aw === word)) {
      score += 1;
    }
  }
  
  // Boost score if query directly contains question keywords
  if (questionLower.includes("account") && queryLower.includes("account")) score += 5;
  if (questionLower.includes("refund") && queryLower.includes("refund")) score += 5;
  if (questionLower.includes("payment") && queryLower.includes("payment")) score += 5;
  if (questionLower.includes("return") && queryLower.includes("return")) score += 5;
  if (questionLower.includes("defective") && queryLower.includes("defective")) score += 5;
  if (questionLower.includes("track") && queryLower.includes("track")) score += 5;
  
  // Category bonus
  if (queryLower.includes(qaItem.category.toLowerCase())) {
    score += 5;
  }
  
  // Penalty if very few question words matched
  if (questionMatches < 1) {
    score = 0;
  }
  
  return score;
}

// Detect order ID in query 
function extractOrderId(query: string) {
  const match = query.match(/\b[A-Z0-9]{8,}\b/);
  return match ? match[0] : null;
}

// Main engine function
export async function getAssistantResponse(userQuery: string): Promise<MatchResult> {
  const orderId = extractOrderId(userQuery);
  
  // If order ID detected, fetch status from API and return ONLY order info
  if (orderId) {
    const apiStatus = await getOrderStatusAPI(orderId);
    if (apiStatus) {
      return {
        answer: `Your order ...${apiStatus.id.slice(-4)} is currently: **${apiStatus.status}**.\n\nETA: ${apiStatus.eta}${apiStatus.status === "Shipped" || apiStatus.status === "Delivered" ? `\nCarrier: ShopLite Express` : ''}`,
        citation: "Order Tracking System",
        confidence: 1.0,
        orderStatus: {
          id: apiStatus.id,
          status: apiStatus.status,
          carrier: apiStatus.status === "Shipped" || apiStatus.status === "Delivered" ? "ShopLite Express" : undefined,
          eta: apiStatus.eta
        }
      };
    }
  }
  
  // Type assertion for ground truth data
  const qaList = groundTruth as QAPair[];
  
  // Score all Q&As
  const scored = qaList.map((qa) => ({
    qa,
    score: scoreMatch(userQuery, qa)
  }));
  
  // Sort by score
  scored.sort((a, b) => b.score - a.score);
  
  const best = scored[0];
  const threshold = 10; // Strict matching threshold
  
  // Use best Q&A match if score is high enough
  if (best.score >= threshold) {
    return {
      answer: best.qa.answer,
      citation: best.qa.qid,
      confidence: Math.min(best.score / 15, 1.0)
    };
  }
  
  // No good match found - refuse politely
  return {
    answer: "I apologize, but I don't have specific information about that topic in my knowledge base. Please contact our support team via live chat, email, or phone for assistance.",
    citation: "N/A",
    confidence: 0
  };
}

// Optional: OpenAI API integration (if OPENAI_API_KEY is set)
export async function getAssistantResponseWithAI(userQuery: string): Promise<MatchResult> {
  const apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    // Fallback to local matcher
    return getAssistantResponse(userQuery);
  }
  
  try {
    // First check for order ID
    const orderId = extractOrderId(userQuery);
    let orderStatus;
    if (orderId) {
      const apiStatus = await getOrderStatusAPI(orderId);
      if (apiStatus) {
        orderStatus = {
          id: apiStatus.id,
          status: apiStatus.status,
          carrier: apiStatus.status === "Shipped" || apiStatus.status === "Delivered" ? "ShopLite Express" : undefined,
          eta: apiStatus.eta
        };
      }
    }
    
    // Type assertion for ground truth data
    const qaList = groundTruth as QAPair[];
    
    // Build context from ground truth
    const context = qaList.map(qa => 
      `[${qa.qid}] ${qa.question}\n${qa.answer}`
    ).join('\n\n');
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful customer support assistant for Shoplite, an e-commerce marketplace. Use ONLY the information provided in the knowledge base below. Always cite the question ID (e.g., [Q01]) for information you use. If the answer isn't in the knowledge base, politely say you don't have that information.\n\nKnowledge Base:\n${context}`
          },
          {
            role: 'user',
            content: orderStatus 
              ? `Order ${orderStatus.id} status: ${orderStatus.status}, ETA: ${orderStatus.eta}${orderStatus.carrier ? `, Carrier: ${orderStatus.carrier}` : ''}.\n\nUser question: ${userQuery}`
              : userQuery
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });
    
    const data = await response.json();
    const answer = data.choices[0].message.content;
    
    // Extract citation from response
    const citationMatch = answer.match(/\[Q\d+\]/g);
    const citation = citationMatch ? citationMatch.join(', ') : 'AI Generated';
    
    return {
      answer,
      citation,
      confidence: 0.9,
      orderStatus
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback to local matcher
    return getAssistantResponse(userQuery);
  }
}