## Assumptions
- Model: Llama 3.1 8B Instruct at $0.05/1K prompt tokens, $0.20/1K completion tokens
- Avg tokens in: 100   Avg tokens out: 50
- Requests/day: 50,000
- Cache hit rate: 70%

## Calculation
Cost/action = (100/1000 * 0.05) + (50/1000 * 0.20) = $0.005 + $0.01 = $0.015  
Daily cost = $0.015 * 50,000 * (1 - 0.7) = $225.00

## Results
- Search Typeahead: Cost/action = $0.015, Daily = $225.00

---

## Assumptions
- Model: GPT-4o-mini at $0.15/1K prompt tokens, $0.60/1K completion tokens
- Avg tokens in: 300   Avg tokens out: 100
- Requests/day: 20,000
- Cache hit rate: 50%

## Calculation
Cost/action = (300/1000 * 0.15) + (100/1000 * 0.60) = $0.045 + $0.06 = $0.105  
Daily cost = $0.105 * 20,000 * (1 - 0.5) = $1,050.00

## Results
- Product Recommender: Cost/action = $0.105, Daily = $1,050.00

## Cost lever if over budget
- Typeahead: increase cache hit rate to 85%  
- Recommender: shorten context to 150 tokens or downgrade model for cold-start users
