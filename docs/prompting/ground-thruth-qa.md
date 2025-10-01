### Q01: How do I create a user account on Shoplite?
**Expected retrieval context:** Document 1: Shoplite User Registration Process
**Authoritative answer:** To create a Shoplite accounts, users must visit the registration page and provide their valid email or phone number, create a strong password, enter basic profile information.
**Required keyworsd in LLM response:** ["registration page", "valid Email or phone number", "strong password", "profile information"]
**Forbidden content:** ["no verification required", "businness docs"]

### Q02: What criterias are my search result filtering based on for my product search?
**Expected retrieval context:** Document 2: Shoplite Product Search and Filtering Features
**Authoritative answer:** Users can filter products by **price range, brand, customer rating, seller type (individual or verified business), and estimated delivery time**
**Required keyworsd in LLM response:** ["filter products", "price range", "customer rating", "estimated delivery time"]
**Forbidden content:** ["random filtering", "no search match results"]

### Q03: Can I narrow down product choices?
**Expected retrieval context:** Document 2: Shoplite Product Search and Filtering Features
**Authoritative answer:** Filters can be combined to narrow down choices, ensuring customers see the most relevant products
**Required keyworsd in LLM response:** ["filters can be combined", "narrow down choices", "relevant products"]
**Forbidden content:** ["random filtering", "no search match results"]

### Q04: Can I add multiple items from different sellers into a single cart?
**Expected retrieval context:** Document 3: Shoplite Shopping Cart and Checkout Process
**Authoritative answer:** Buyers are allowed to add multiple items from different sellers into a single cart, making it easier to complete transactions without switching between pages.
**Required keyworsd in LLM response:** ["add multiple items", "different sellers", "single cart"]
**Forbidden content:** ["multiple cards are required", "add only a single item"]

### Q05: Can I pay via Whish Money?
**Expected retrieval context:** Document 4: Shoplite Payment Methods and Security
**Authoritative answer:** Supported methods include major **credit and debit cards, PayPal, and digital wallets** such as Apple Pay,Whish Money and Google Pay.
**Required keyworsd in LLM response:** ["credit and debit cards", "Whish Money"]
**Forbidden content:** ["Cash payment", "Insufficient balance", "payment upon delivery"]

### Q06: Is the payment on Shoplite secure?
**Expected retrieval context:** Document 4: Shoplite Payment Methods and Security
**Authoritative answer:** Shoplite employs **end-to-end encryption** and complies with PCI-DSS standards to safeguard sensitive financial data.
**Required keyworsd in LLM response:** ["end-to-end encryption", "PCI-DSS standadrds"]
**Forbidden content:** ["low level security", "unsupervised transaction"]

### Q07:How much time does it take to get a refund??
**Expected retrieval context:** Document 6: Shoplite Return and Refund Policies
**Authoritative answer:** Refunds are typically issued to the original payment method within **5–7 business days** after the return is approved by the dispute resolution comitee.
**Required keyworsd in LLM response:** ["Refunds", "5–7 business days"]
**Forbidden content:** ["No specific time", "No refund possibility available"]

### Q08:What if I receive a defected product?
**Expected retrieval context:** Document 11:Shoplite Customer Support and Dispute Resolution
**Authoritative answer:** When issues arise between buyers and sellers—such as undelivered items, defective products, or mismatched descriptions,Shoplite’s **dispute resolution process** comes into play to so;ve the problem
**Required keyworsd in LLM response:** ["undelivered items", "defective products", "mismatched descriptions", "dispute resolution process"]
**Forbidden content:** ["Shoplite is not responsible for defective product", "Seller is not responsible for any damage"]

### Q09: What are Shoplite’s return policies and how can customers track their orders?
**Expected retrieval context:** Document 6: Return and Refund Policies + Document 5: Order Tracking and Delivery  
**Authoritative answer:** Shoplite provides a 30-day return window, requiring a return authorization through the user dashboard. Refunds are processed within 5–7 business days after inspection. Customers can track order status via the tracking dashboard, which provides real-time shipment updates and estimated delivery dates.  
**Required keywords in LLM response:** ["30-day return window", "return authorization", "order tracking", "estimated delivery"]  
**Forbidden content:** ["no returns", "lifetime returns", "untracked shipping"]  

### Q10: How can sellers manage their inventory while promoting their products effectively?
**Expected retrieval context:** Document 9: Inventory Management for Sellers + Document 13: Advertising and Promotion Tools  
**Authoritative answer:** Sellers can manage stock levels, set alerts for low inventory, and use bulk upload tools through the Seller Dashboard. To promote products, they can run sponsored ads, homepage banners, and discount campaigns scheduled in advance. Analytics in Ads Manager allow sellers to optimize based on stock availability and campaign performance.  
**Required keywords in LLM response:** ["Seller Dashboard", "bulk upload", "sponsored ads", "discount campaigns"]  
**Forbidden content:** ["unlimited inventory without tracking", "no advertising tools"]  

### Q11: What options do sellers have to withdraw earnings, and how are commission fees applied?
**Expected retrieval context:** Document 10: Commission and Fee Structure + Document 8: Seller Account Setup and Management  
**Authoritative answer:** Sellers earn revenue from the product sales.Every sell is followed by Shoplite’s commission, which varies by category but is transparently shown in the Seller Dashboard. Funds can be withdrawn through linked bank accounts or PayPal once the balance reaches the minimum payout threshold.  
**Required keywords in LLM response:** ["commission rates", "Seller Dashboard", "minimum payout", "bank account or PayPal"]  
**Forbidden content:** ["hidden fees", "cash-only withdrawals", "instant payout without threshold"]  

### Q12: How does Shoplite help buyers discover products through search and recommendations?
**Expected retrieval context:** Document 2: Product Search and Filtering Features + Document 15: Future Expansion and Scalability Plans  
**Authoritative answer:** Buyers can filter by category, price, ratings, and seller location to refine searches. Shoplite also invests in AI-driven personalization, including recommendation engines that adapt to buyer behavior in real time, with plans to expand into voice search and AR previews.  
**Required keywords in LLM response:** ["search filters", "AI-driven recommendations", "voice search", "AR previews"]  
**Forbidden content:** ["no filters available", "random recommendations only"]  

### Q13: How are promotional codes applied during checkout, and what discounts are available to sellers for campaigns?
**Expected retrieval context:** Document 3: Shopping Cart and Checkout Process + Document 13: Advertising and Promotion Tools  
**Authoritative answer:** Buyers can apply promotional codes directly at checkout, reducing the order total instantly. Sellers can create their own discount campaigns, including percentage-based promotions, BOGO deals, and flash sales. Campaigns can be scheduled and highlighted with promotional badges.  
**Required keywords in LLM response:** ["promotional codes", "checkout", "BOGO deals", "flash sales"]  
**Forbidden content:** ["manual refunds", "no discount support"]  

### Q14: What customer support options are available if an order delivery fails?
**Expected retrieval context:** Document 5: Order Tracking and Delivery + Document 11: Customer Support Procedures  
**Authoritative answer:** Customers have the access for real time shippement updated tracking at first by using the  tracking dashboard. If delivery fails, they can complain to the customer support via live chat, email, or phone. Support agents can initiate return authorization or re-shipment depending on the issue.  
**Required keywords in LLM response:** ["tracking dashboard", "customer support", "live chat", "return authorization"]  
**Forbidden content:** ["no customer support", "buyer must solve delivery alone"]  

### Q15: How do sellers ensure compliance with Shoplite’s security policies during account setup?
**Expected retrieval context:** Document 8: Seller Account Setup and Management + Document 14: Security and Privacy Policies  
**Authoritative answer:** Sellers must verify their business with valid documentation such as a tax ID, which is reviewed within 2–3 business days. To comply with security, they must enable 2FA, agree to GDPR/CCPA data handling policies, and use secure payment methods.  
**Required keywords in LLM response:** ["business verification", "2–3 business days", "2FA", "GDPR/CCPA"]  
**Forbidden content:** ["instant approval", "no verification required"]  

### Q16: How does the mobile app enhance the shopping experience while maintaining account security?
**Expected retrieval context:** Document 12: Mobile App Features + Document 14: Security and Privacy Policies  
**Authoritative answer:** The Shoplite mobile app supports features like personalized recommendations, push notifications for deals, and barcode scanning for quick product search with extra features for product search. Security is reinforced with biometric authentication, encrypted transactions, and activity alerts for suspicious logins.  
**Required keywords in LLM response:** ["push notifications", "barcode scanning", "biometric authentication", "encrypted transactions"]  
**Forbidden content:** ["no mobile features", "app has no security"]  

### Q17: How do refunds and commission fees interact when a customer returns a product?
**Expected retrieval context:** Document 6: Return and Refund Policies + Document 10: Commission and Fee Structure  
**Authoritative answer:** When a customer returns a product within the 30-day return window and the refund is approved, Shoplite reverses the commission fee for that transaction. The seller does not incur permanent charges for refunded items, ensuring fairness.  
**Required keywords in LLM response:** ["30-day return window", "commission reversal", "refund approved"]  
**Forbidden content:** ["non-refundable commission", "no refunds allowed"]  

### Q18: How does Shoplite plan to expand globally while competing with Amazon, eBay, and Shopify?
**Expected retrieval context:** Document 15: Future Expansion and Scalability Plans + Document 16: Competitor Comparison and Differentiation  
**Authoritative answer:** Shoplite’s expansion strategy includes multi-currency support, regional payment gateways, and international logistics. Unlike Amazon and eBay, Shoplite emphasizes fairness for small sellers and transparent commissions. Unlike Shopify, it combines storefront tools with a shared marketplace.  
**Required keywords in LLM response:** ["multi-currency", "international logistics", "transparent commission", "shared marketplace"]  
**Forbidden content:** ["no global plans", "hidden fees", "Amazon-like dominance only"]  


### Q19: How does Shoplite balance product recommendation accuracy, data privacy, and future AI-driven personalization?
**Expected retrieval context:**  
- Document 2: Shoplite Product Search and Filtering Features
- Document 14: Shoplite Security and Privacy Policies  
- Document 15: Future Expansion and Scalability Plans  

**Authoritative answer:**  
Shoplite’s recommendation system uses collaborative filtering and purchase history to suggest relevant products. To protect user privacy, data is anonymized, encrypted, and processed under GDPR and CCPA regulations. In its future roadmap, Shoplite plans to expand personalization with AI-driven features such as predictive shopping lists and real-time preference adaptation while continuing to comply with global data protection standards.  

**Required keywords in LLM response:** ["collaborative filtering", "purchase history", "GDPR", "predictive shopping lists", "AI-driven personalization"]  
**Forbidden content:** ["no privacy protections", "Shoplite sells personal data", "no plans for personalization"]  


### Q20: How do Shoplite’s logistics partners, commission policies, and customer communication channels work together during delayed deliveries?
**Expected retrieval context:**  
- Document 5: Shoplite Order Tracking and Delivery  
- Document 10: Commission and Fee Structure  
- Document 11: Customer Support and dispute resolution  
**Authoritative answer:**  
If a delivery is delayed, Shoplite’s logistics partners provide real-time tracking updates and escalation paths. While sellers are typically charged commission on completed sales, commission adjustments may be applied when delays significantly impact customer satisfaction. Throughout this process, customer support agents notify buyers through live chat, email, and phone to ensure transparency and maintain trust.  
**Required keywords in LLM response:** ["real-time tracking", "commission adjustments", "customer support agents", "delivery delays"]  
**Forbidden content:** ["Shoplite hides delays", "no commission rules", "no support available during delays"]  
