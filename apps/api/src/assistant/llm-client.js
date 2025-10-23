/**
 * LLM Client - Groq Cloud API (Llama 3.1-8B)
 */
class LLMClient {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.baseUrl = 'https://api.groq.com/openai/v1';
    this.model = 'llama-3.1-8b-instant';
    
    if (!this.apiKey) {
      console.warn('⚠️  GROQ_API_KEY not found in environment variables');
    }
  }

  async generate(prompt, options = {}) {
    const { temperature = 0.7, maxTokens = 500 } = options;

    if (!this.apiKey) {
      throw new Error('GROQ_API_KEY is required');
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Groq API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('❌ LLM Error:', error.message);
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }

  async chat(systemPrompt, userMessage, options = {}) {
    const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`;
    return this.generate(fullPrompt, options);
  }

  async isAvailable() {
    if (!this.apiKey) {
      return false;
    }

    try {
      // Test with minimal request
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 1,
        }),
      });
      
      return response.ok;
    } catch {
      return false;
    }
  }
}

const llmClient = new LLMClient();
export default llmClient;