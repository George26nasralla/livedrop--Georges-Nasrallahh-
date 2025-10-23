import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './db.js';
import Customer from './models/customers.js';
import Product from './models/products.js';
import Order from './models/order.js';

dotenv.config();

// Realistic customer data
const customers = [
  {
    name: 'John Demo',
    email: 'demo@example.com', // TEST USER FOR EVALUATION
    phone: '+961-3-123-456',
    address: {
      street: '123 Hamra Street',
      city: 'Beirut',
      country: 'Lebanon',
      postalCode: '1103-2080',
    },
  },
  {
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@gmail.com',
    phone: '+961-1-456-789',
    address: {
      street: '45 Verdun Avenue',
      city: 'Beirut',
      country: 'Lebanon',
      postalCode: '1103-2090',
    },
  },
  {
    name: 'Michael Chen',
    email: 'mchen@outlook.com',
    phone: '+961-3-987-654',
    address: {
      street: '78 Achrafieh Road',
      city: 'Beirut',
      country: 'Lebanon',
      postalCode: '1100-2050',
    },
  },
  {
    name: 'Emma Johnson',
    email: 'emma.j@yahoo.com',
    phone: '+961-1-234-567',
    address: {
      street: '12 Jnah Street',
      city: 'Beirut',
      country: 'Lebanon',
      postalCode: '1107-2020',
    },
  },
  {
    name: 'David Rodriguez',
    email: 'david.rod@protonmail.com',
    phone: '+961-3-345-678',
    address: {
      street: '89 Raouche Boulevard',
      city: 'Beirut',
      country: 'Lebanon',
      postalCode: '1103-2060',
    },
  },
  {
    name: 'Layla Hassan',
    email: 'layla.hassan@gmail.com',
    phone: '+961-1-567-890',
    address: {
      street: '34 Mar Mikhael',
      city: 'Beirut',
      country: 'Lebanon',
      postalCode: '1100-2040',
    },
  },
  {
    name: 'James Wilson',
    email: 'jwilson@gmail.com',
    phone: '+961-3-678-901',
    address: {
      street: '56 Dbayeh Highway',
      city: 'Jounieh',
      country: 'Lebanon',
      postalCode: '1200-3010',
    },
  },
  {
    name: 'Sophie Laurent',
    email: 'sophie.l@hotmail.com',
    phone: '+961-1-789-012',
    address: {
      street: '90 Gemmayze Street',
      city: 'Beirut',
      country: 'Lebanon',
      postalCode: '1100-2030',
    },
  },
  {
    name: 'Omar Khoury',
    email: 'omar.khoury@live.com',
    phone: '+961-3-890-123',
    address: {
      street: '23 Saifi Village',
      city: 'Beirut',
      country: 'Lebanon',
      postalCode: '1100-2010',
    },
  },
  {
    name: 'Isabella Martinez',
    email: 'bella.martinez@icloud.com',
    phone: '+961-1-901-234',
    address: {
      street: '67 ABC Mall Road',
      city: 'Dbayeh',
      country: 'Lebanon',
      postalCode: '1200-3020',
    },
  },
  {
    name: 'Rami Sleiman',
    email: 'rami.sleiman@gmail.com',
    phone: '+961-3-012-345',
    address: {
      street: '101 Ain Mreisseh',
      city: 'Beirut',
      country: 'Lebanon',
      postalCode: '1103-2070',
    },
  },
  {
    name: 'Chloe Anderson',
    email: 'chloe.a@outlook.com',
    phone: '+961-1-123-890',
    address: {
      street: '15 Bliss Street',
      city: 'Beirut',
      country: 'Lebanon',
      postalCode: '1103-2100',
    },
  },
];

// Realistic product data (30 products across categories)
const products = [
  // Electronics
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling wireless headphones with premium sound quality and 30-hour battery life.',
    price: 399.99,
    category: 'Electronics',
    tags: ['audio', 'wireless', 'noise-canceling'],
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b',
    stock: 45,
  },
  {
    name: 'Apple iPad Air (2024)',
    description: '10.9-inch Liquid Retina display, M1 chip, 256GB storage. Perfect for work and entertainment.',
    price: 749.00,
    category: 'Electronics',
    tags: ['tablet', 'apple', 'productivity'],
    imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764',
    stock: 28,
  },
  {
    name: 'Logitech MX Master 3S Mouse',
    description: 'Wireless performance mouse with ultra-fast scrolling and ergonomic design for professionals.',
    price: 99.99,
    category: 'Electronics',
    tags: ['accessories', 'productivity', 'wireless'],
    imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db',
    stock: 67,
  },
  {
    name: 'Samsung 27" 4K Monitor',
    description: 'UHD monitor with HDR10 support, perfect for gaming and content creation. 144Hz refresh rate.',
    price: 449.00,
    category: 'Electronics',
    tags: ['monitor', '4k', 'gaming'],
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf',
    stock: 34,
  },
  {
    name: 'Anker PowerCore 20000mAh',
    description: 'High-capacity portable charger with fast charging for smartphones and tablets.',
    price: 54.99,
    category: 'Electronics',
    tags: ['charging', 'portable', 'accessories'],
    imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5',
    stock: 120,
  },
  
  // Clothing
  {
    name: 'Levi\'s 501 Original Jeans',
    description: 'Classic straight fit denim jeans in vintage wash. Timeless style and comfort.',
    price: 89.99,
    category: 'Clothing',
    tags: ['denim', 'casual', 'menswear'],
    imageUrl: 'https://images.unsplash.com/photo-1542272454315-7f6f3d9c89d2',
    stock: 88,
  },
  {
    name: 'Patagonia Down Jacket',
    description: 'Lightweight, packable down jacket with 800-fill recycled down. Perfect for cold weather.',
    price: 279.00,
    category: 'Clothing',
    tags: ['outerwear', 'winter', 'sustainable'],
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
    stock: 42,
  },
  {
    name: 'Nike Air Max Sneakers',
    description: 'Iconic sneakers with visible Air cushioning and breathable mesh upper. Available in multiple colors.',
    price: 129.99,
    category: 'Clothing',
    tags: ['footwear', 'athletic', 'streetwear'],
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    stock: 95,
  },
  {
    name: 'Cashmere Crew Neck Sweater',
    description: 'Premium 100% cashmere sweater in navy blue. Soft, warm, and elegant.',
    price: 159.00,
    category: 'Clothing',
    tags: ['luxury', 'knitwear', 'winter'],
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27',
    stock: 56,
  },
  {
    name: 'Adidas Performance Hoodie',
    description: 'Comfortable cotton-blend hoodie with kangaroo pocket. Perfect for workouts and casual wear.',
    price: 64.99,
    category: 'Clothing',
    tags: ['athletic', 'casual', 'sportswear'],
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
    stock: 110,
  },

  // Books
  {
    name: 'Atomic Habits by James Clear',
    description: 'An easy and proven way to build good habits and break bad ones. #1 New York Times bestseller.',
    price: 16.99,
    category: 'Books',
    tags: ['self-help', 'bestseller', 'productivity'],
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
    stock: 200,
  },
  {
    name: 'The Psychology of Money',
    description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel.',
    price: 18.50,
    category: 'Books',
    tags: ['finance', 'bestseller', 'business'],
    imageUrl: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666',
    stock: 150,
  },
  {
    name: 'Project Hail Mary',
    description: 'A lone astronaut must save the earth in this gripping sci-fi thriller by Andy Weir.',
    price: 14.99,
    category: 'Books',
    tags: ['fiction', 'sci-fi', 'bestseller'],
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794',
    stock: 175,
  },

  // Home & Garden
  {
    name: 'Dyson V15 Detect Vacuum',
    description: 'Cordless vacuum with laser detection and intelligent cleaning. Up to 60 minutes runtime.',
    price: 649.99,
    category: 'Home & Garden',
    tags: ['appliances', 'cleaning', 'cordless'],
    imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001',
    stock: 22,
  },
  {
    name: 'Nespresso Vertuo Coffee Maker',
    description: 'Single-serve coffee and espresso machine with Centrifusion technology. Includes milk frother.',
    price: 189.00,
    category: 'Home & Garden',
    tags: ['coffee', 'appliances', 'kitchen'],
    imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6',
    stock: 48,
  },
  {
    name: 'Fiddle Leaf Fig Plant',
    description: 'Large indoor plant in decorative pot. Adds natural beauty to any room. Low maintenance.',
    price: 45.00,
    category: 'Home & Garden',
    tags: ['plants', 'decor', 'indoor'],
    imageUrl: 'https://images.unsplash.com/photo-1463320726281-696a485928c7',
    stock: 30,
  },
  {
    name: 'Le Creuset Cast Iron Dutch Oven',
    description: '5.5-quart enameled cast iron pot in cherry red. Perfect for braising, roasting, and baking.',
    price: 379.99,
    category: 'Home & Garden',
    tags: ['cookware', 'kitchen', 'premium'],
    imageUrl: 'https://images.unsplash.com/photo-1584990347449-39b4aa357ba7',
    stock: 38,
  },

  // Sports
  {
    name: 'Manduka PRO Yoga Mat',
    description: 'Professional-grade yoga mat with superior cushioning and grip. Lifetime guarantee.',
    price: 132.00,
    category: 'Sports',
    tags: ['yoga', 'fitness', 'equipment'],
    imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f',
    stock: 75,
  },
  {
    name: 'Wilson Evolution Basketball',
    description: 'Official size composite leather basketball used in high school and college games.',
    price: 64.99,
    category: 'Sports',
    tags: ['basketball', 'equipment', 'team-sports'],
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc',
    stock: 60,
  },
  {
    name: 'TRX Suspension Training Kit',
    description: 'Complete bodyweight training system for strength, flexibility, and core stability.',
    price: 179.95,
    category: 'Sports',
    tags: ['fitness', 'home-gym', 'training'],
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
    stock: 52,
  },

  // Toys
  {
    name: 'LEGO Star Wars Millennium Falcon',
    description: 'Ultimate collector\'s edition with 7,541 pieces. Includes 8 minifigures.',
    price: 849.99,
    category: 'Toys',
    tags: ['lego', 'collectible', 'star-wars'],
    imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b',
    stock: 15,
  },
  {
    name: 'Nintendo Switch OLED',
    description: 'Handheld gaming console with vibrant OLED screen and enhanced audio.',
    price: 349.99,
    category: 'Toys',
    tags: ['gaming', 'console', 'portable'],
    imageUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e',
    stock: 40,
  },
  {
    name: 'Ravensburger 3D Puzzle Globe',
    description: '540-piece illuminated 3D puzzle of Earth. Perfect for kids and adults.',
    price: 39.99,
    category: 'Toys',
    tags: ['puzzle', 'educational', 'family'],
    imageUrl: 'https://images.unsplash.com/photo-1588421207478-f7abb0bfe9d9',
    stock: 85,
  },

  // Beauty
  {
    name: 'Dyson Airwrap Hair Styler',
    description: 'Multi-styler that curls, waves, smooths, and dries with no extreme heat.',
    price: 599.00,
    category: 'Beauty',
    tags: ['hair-care', 'styling', 'premium'],
    imageUrl: 'https://images.unsplash.com/photo-1522338140262-f46f5913618a',
    stock: 28,
  },
  {
    name: 'Glossier Skincare Set',
    description: 'Complete 5-piece skincare routine including cleanser, serum, moisturizer, and masks.',
    price: 85.00,
    category: 'Beauty',
    tags: ['skincare', 'set', 'natural'],
    imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571',
    stock: 92,
  },
  {
    name: 'Jo Malone London Cologne',
    description: 'Lime Basil & Mandarin cologne 100ml. Fresh and sophisticated fragrance.',
    price: 145.00,
    category: 'Beauty',
    tags: ['fragrance', 'luxury', 'unisex'],
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601',
    stock: 65,
  },

  // Food
  {
    name: 'Lavazza Espresso Coffee Beans',
    description: '1kg bag of premium Italian espresso beans. Rich, full-bodied flavor.',
    price: 24.99,
    category: 'Food',
    tags: ['coffee', 'beans', 'italian'],
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e',
    stock: 140,
  },
  {
    name: 'Ghirardelli Premium Hot Chocolate',
    description: 'Set of 6 gourmet hot chocolate flavors. Made with real cocoa and chocolate.',
    price: 32.50,
    category: 'Food',
    tags: ['chocolate', 'beverages', 'gift-set'],
    imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
    stock: 105,
  },
  {
    name: 'Mediterranean Olive Oil Gift Set',
    description: 'Collection of 3 extra virgin olive oils from Greece, Italy, and Spain (250ml each).',
    price: 48.00,
    category: 'Food',
    tags: ['gourmet', 'gift-set', 'cooking'],
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5',
    stock: 72,
  },
];


const createOrders = (customers, products) => {
  const orders = [];
  const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const carriers = ['DHL Express', 'FedEx', 'Aramex', 'LibanPost'];

  // Helper to get random items
  const getRandomItems = () => {
    const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items
    const items = [];
    const selectedProducts = [];

    for (let i = 0; i < numItems; i++) {
      let product;
      do {
        product = products[Math.floor(Math.random() * products.length)];
      } while (selectedProducts.includes(product._id));

      selectedProducts.push(product._id);
      const quantity = Math.floor(Math.random() * 2) + 1; // 1-2 quantity

      items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
      });
    }

    return items;
  };

  // Create 18 orders
  for (let i = 0; i < 18; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const items = getRandomItems();
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const carrier = status === 'PENDING' ? null : carriers[Math.floor(Math.random() * carriers.length)];
    
    // Create dates in last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    // Estimated delivery 3-7 days from creation
    const estimatedDelivery = new Date(createdAt);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + Math.floor(Math.random() * 5) + 3);

    orders.push({
      customerId: customer._id,
      items,
      total: Math.round(total * 100) / 100, // Round to 2 decimals
      status,
      carrier,
      trackingNumber: status === 'PENDING' ? null : `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      estimatedDelivery: status === 'PENDING' ? null : estimatedDelivery,
      createdAt,
      updatedAt: createdAt,
    });
  }

  // Ensure demo@example.com has 2-3 orders
  const demoCustomer = customers.find(c => c.email === 'demo@example.com');
  orders.push({
    customerId: demoCustomer._id,
    items: [
      {
        productId: products[0]._id,
        name: products[0].name,
        price: products[0].price,
        quantity: 1,
      },
    ],
    total: products[0].price,
    status: 'DELIVERED',
    carrier: 'DHL Express',
    trackingNumber: 'TRKDEMO123456',
    estimatedDelivery: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
  });

  orders.push({
    customerId: demoCustomer._id,
    items: [
      {
        productId: products[5]._id,
        name: products[5].name,
        price: products[5].price,
        quantity: 2,
      },
      {
        productId: products[10]._id,
        name: products[10].name,
        price: products[10].price,
        quantity: 1,
      },
    ],
    total: products[5].price * 2 + products[10].price,
    status: 'SHIPPED',
    carrier: 'Aramex',
    trackingNumber: 'TRKDEMO789012',
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  });

  return orders;
};

// Main seed function
const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('  Clearing existing data...');
    await Customer.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    console.log(' Creating customers...');
    const createdCustomers = await Customer.insertMany(customers);
    console.log(`✅ Created ${createdCustomers.length} customers`);

    console.log(' Creating products...');
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log(' Creating orders...');
    const orders = createOrders(createdCustomers, createdProducts);
    const createdOrders = await Order.insertMany(orders);
    console.log(`✅ Created ${createdOrders.length} orders`);

    console.log('\n Database seeded successfully!');
    console.log('\n Test User for Evaluation:');
    console.log('   Email: demo@example.com');
    console.log('   Name: John Demo');
    console.log(`   Orders: ${createdOrders.filter(o => o.customerId.equals(createdCustomers.find(c => c.email === 'demo@example.com')._id)).length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();