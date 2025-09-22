**Search Typeahead**

**Problem Statement**
Users often abandon search swhen suggestions are slow or irrelevant. AI typeahead can improve search and product discovery using relevant SKUs.


**Happy path**
1-user types into the search bar
2-Frontend sends partial query to backend
3-backend checks cache
4-if miss, model generates suggestions
5-model returns Top 5 suggestions
6-Backend formats and send results
7-Frontend displays suggestions
8-search results page loads


**Grounding & guardrails**  
- Source: SKU titles, categories  
- Scope: 10k SKUs, indexed weekly  
- Max context: 300 tokens  
- Refuse: unsafe or irrelevant queries

**Human-in-the-loop**  
Not applicable for typeahead. Monitoring is automated (latency & CTR).



**Latency budget**  
- Input: 20ms  
- Cache lookup: 30 ms  
- Model inference: 200 ms  
- Post-filtering: 50 ms    
**Total: ≤300 ms**  
Cache: 70% hit rate

**Error & fallback behavior**  
- If AI fails: return default keyword autocomplete  
- If cache fails: retry once, then fallback

**PII handling**  
- No PII sent  
- Logs store only query fragment,  anonymized  
- No user data stored in model context

**Success metrics**  
- Suggestion CTR = clicks / suggestions shown  
- Search conversion = purchases / search sessions 
- Product: % of queries served within 300 ms  
- Business: Conversion lift from searches with suggestions
- Conversion uplift = (post - pre) / pre

**Feasibility note**  
SKU metadata is available. Redis cache exists. Next step: prototype with Llama 3.1 8B and measure latency vs baseline.

---

## Product Recommender

**Problem statement**  
Users often browse without finding relevant products. An AI recommender can surface personalized suggestions based on session behavior and SKU metadata, increasing conversion and average order value.

**Happy path**  
1. User lands on homepage or product page  
2. Backend checks session history  
3. Sends context + SKU metadata to AI model  
4. Model returns 5 recommended SKUs  
5. Backend formats response  
6. Frontend displays recommendations  
7. User clicks a product  
8. Product page loads  
9. Session logs click  
10. Purchase tracked if completed

**Grounding & guardrails**  
- Source: SKU metadata, session history  
- Scope: 10k SKUs, last 5 session events  
- Max context: 600 tokens  
- Refuse: irrelevant or out-of-stock items

**Human-in-the-loop**  
- Trigger: low engagement or flagged suggestions  
- Surface: analytics dashboard  
- Reviewer: merch team, SLA 48h

**Latency budget**  
- Input: 50ms  
- Session fetch: 100ms  
- AI call: 500ms  
- Response formatting: 150ms  
- Total: 800ms  
- Cache: optional for cold-start users

**Error & fallback behavior**  
- If AI fails: show popular items list  
- If session data missing: use category-based fallback

**PII handling**  
- No PII sent  
- Session ID only  
- Logs stored for 7 days, encrypted

**Success metrics**  
- Recommendation CTR = clicks / views  
- Conversion rate = purchases / sessions with recommendations  
- AOV uplift = (post - pre AOV) / pre AOV

**Feasibility note**  
SKU metadata and session logs are available. Next step: prototype with GPT-4o-mini and test relevance vs baseline.
