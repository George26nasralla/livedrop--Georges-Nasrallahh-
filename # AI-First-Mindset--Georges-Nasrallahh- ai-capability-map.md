# AI-First-Mindset--Georges-Nasrallahh-

| Capability            | Intent (user)                      | Inputs (this sprint)        | Risk 1–5 (tag) | p95 ms | Est. cost/action | Fallback             | Selected |
|---------------------- |------------------------------------|-----------------------------|----------------|--------|------------------|----------------------|:--------:|
| Search Typeahead      | Find products faster               | SKU titles, categories      | 2              | 300    | $0.002           | Default search       | ✅       |
| Product Recommender   | Discover relevant products         | SKU metadata,order history  | 4              | 800    | $0.010           | Popular items list   |  ✅        |
| Support Assistant     | Get help with orders,track my order|FAQ markdown,`order-status`API| 3              | 1200   | $0.015           | Escalate to human    |        |
| Prod desc summarizer  | Quickly skim long descriptions     | Product text                | 2              | 800    | $0.01            | Show original text   |          |
| Review Summarizer     | Understand product feedback        | SKU reviews                 | 3              | 900    | $0.008           | Raw review list      |          |
| Policy Q&A only       | Asks about returns/shipping policy | Policies/FAQ markdown       | 1              | 800    | $0.005           | Link to FAQ page     |          |

    
 **Typeahead** and **Product Recommender** were selected because they both directly improve product discovery and conversion. 
 Typeahead reduces friction in search and drives conversion by making it easier for users to find products, noting that it is latency-critical but with low-risk using sku data and caching.
 Product Recommender is more complexe but feasible with existing metadata and existing metadata and session logs.
 
 