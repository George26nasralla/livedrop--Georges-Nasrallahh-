import express from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/order.js';
import Customer from '../models/customers.js';
import Product from '../models/products.js';
import { streamOrderStatus } from '../sse/order-status.js';

const router = express.Router();

/**
 * POST /api/orders
 * Create a new order
 */
router.post(
  '/',
  [
    body('customerId').notEmpty().withMessage('Customer ID is required'),
    body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
    body('items.*.productId').notEmpty().withMessage('Product ID is required for each item'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation Error',
          details: errors.array(),
        });
      }

      const { customerId, items } = req.body;

      // Verify customer exists
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Customer not found',
        });
      }

      // Fetch product details and calculate total
      const orderItems = [];
      let total = 0;

      for (const item of items) {
        const product = await Product.findById(item.productId);
        
        if (!product) {
          return res.status(404).json({
            error: 'Not Found',
            message: `Product not found: ${item.productId}`,
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            error: 'Insufficient Stock',
            message: `Not enough stock for ${product.name}. Available: ${product.stock}`,
          });
        }

        orderItems.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
        });

        total += product.price * item.quantity;

        // Update product stock
        product.stock -= item.quantity;
        await product.save();
      }

      // Create order
      const order = new Order({
        customerId,
        items: orderItems,
        total: Math.round(total * 100) / 100, // Round to 2 decimals
        status: 'PENDING',
      });

      await order.save();

      // Populate customer details for response
      await order.populate('customerId', 'name email');

      res.status(201).json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          error: 'Validation Error',
          message: error.message,
        });
      }

      if (error.name === 'CastError') {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid ID format',
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create order',
      });
    }
  }
);
/**
 * GET /api/orders/:id/stream
 * SSE endpoint for real-time order tracking
 */
router.get('/:id/stream', streamOrderStatus);

/**
 * GET /api/orders/:id
 * Get single order by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('customerId', 'name email phone address')
      .populate('items.productId', 'name imageUrl');

    if (!order) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Order not found',
      });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid order ID format',
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch order',
    });
  }
});

/**
 * GET /api/orders?customerId=:customerId
 * Get all orders for a specific customer
 */
router.get('/', async (req, res) => {
  try {
    const { customerId } = req.query;

    if (!customerId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Customer ID query parameter is required',
      });
    }

    const orders = await Order.find({ customerId })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'name imageUrl');

    res.json(orders);
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid customer ID format',
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch orders',
    });
  }
});

export default router;