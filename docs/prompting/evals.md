# RAG System Evaluation

## Retrieval Quality Tests (10 tests)
| Test ID | Question | Expected Documents | Pass Criteria |
|---------|----------|-------------------|---------------|
| R01 | How do I create a user account on Shoplite? | Document 1: Shoplite User Registration Process | Retrieved docs contain expected title |
| R02 |  Can I pay via Whish Money? | Document 4: Payment Methods and Security | Retrieved docs contain expected title |
| R03 | What are Shoplite’s return policies and how do I track my order? | Document 6 + Document 5 | Retrieved docs are relevant to question  |
| R04 | How can sellers manage their inventory while promoting their products effectively? | Document 9: Inventory Management for Sellers + Document 13: Advertising and Promotion Tools | Retrieved docs are relevant to question |
| R05 |What if I receive a defected product? |Document 11: Shoplite Customer Support and Dispute Resolution | Retrieved docs contain expected title |
| R06 | What mobile app features are available? | Document 12: Mobile App Features | Retrieved docs contain expected title |
| R07 | What are Shoplite’s security measures? | Document 14: Security and Privacy Policies | Retrieved docs contain expected title |
| R08 | How can customers contact support? | Document 11: Customer Support Procedures | Retrieved docs contain expected title |
| R09 | How do product reviews work? | Document 7: Product Reviews and Ratings | Retrieved docs contain expected title |
| R10 | What developer API endpoints exist? | Document 13: API Documentation for Developers | Retrieved docs contain expected title |

---

## Response Quality Tests (15 tests)
| Test ID | Question | Required Keywords | Forbidden Terms | Expected Behavior |
|---------|----------|-------------------|-----------------|-------------------|
| Q01 | How do I create a seller account? | ["seller registration", "business verification", "2-3 business days"] | ["instant approval"] | Direct answer with citation |
| Q02 | What is the checkout process like? | ["shopping cart", "checkout", "promotional codes"] | ["one-step only"] | Detailed multi-step explanation |
| Q03 | How does Shoplite handle refunds? | ["30-day return window", "return authorization"] | ["lifetime returns"] | Clear return steps + citation |
| Q04 | How do sellers manage inventory levels? | ["inventory", "automatic stock updates"] | ["no inventory limits"] | Concise explanation |
| Q05 | What mobile features can I use? | ["push notifications", "mobile checkout"] | ["desktop only"] | Mention app-specific features |
| Q06 | What security measures protect my data? | ["encryption", "privacy policy"] | ["no protection"] | Clear security description |
| Q07 | How do product ratings work? | ["stars", "verified buyers"] | ["anonymous only"] | Simple accurate answer |
| Q08 | How do I track my order and request a return? | ["order tracking", "return authorization", "30-day return window"] | ["no returns"] | Multi-document synthesis |
| Q09 | What commission fees apply to sellers? | ["percentage", "tiered fees"] | ["free selling"] | Accurate fee structure |
| Q10 | How does Shoplite ensure safe payments? | ["encryption", "PCI compliance"] | ["unsafe"] | Security-oriented response |
| Q11 | What discounts can users apply? | ["promo codes", "discounts"] | ["no discounts ever"] | Mention discounts properly |
| Q12 | How can I contact support? | ["customer support", "help desk"] | ["no support available"] | Response with citation |
| Q13 | What docs explain order delivery? | ["tracking number", "estimated delivery"] | ["instant delivery"] | Delivery-focused answer |
| Q14 | How do developers integrate with Shoplite? | ["API", "endpoints"] | ["closed system"] | Developer documentation reference |
| Q15 | What privacy protections exist? | ["data protection", "user privacy"] | ["no privacy"] | Accurate privacy description |

---

## Edge Case Tests (5 tests)
| Test ID | Scenario | Expected Response Type |
|---------|----------|------------------------|
| E01 | User asks about unrelated topic (e.g., "What’s the weather in Paris?") | Refusal with explanation |
| E02 | Ambiguous query: "How do I sign up?" | Clarification request |
| E03 | Sensitive info request: "Give me my password reset code." | Refusal, redirect to secure support |
| E04 | Very broad query: "Tell me everything about Shoplite." | Ask for clarification or narrow scope |
| E05 | Conflicting docs retrieved | Present both versions with citations, mention conflict |

