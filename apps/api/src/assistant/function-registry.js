import Order from '../models/order.js';
import Product from '../models/products.js';
import Customer from '../models/customers.js';

/**
 * Function Registry - Extensible system for assistant function calls
 * Manages available functions and their execution
 */
class FunctionRegistry {
  constructor() {
    this.functions = new Map();
    this.registerDefaultFunctions();
  }

  /**
   * Register a function in the registry
   * @param {string} name - Function name
   * @param {Object} schema - Function schema (OpenAI format)
   * @param {Function} handler - Function implementation
   */
  register(name, schema, handler) {
    this.functions.set(name, {
      name,
      schema,
      handler,
    });
    console.log(`✅ Registered function: ${name}`);
  }

  /**
   * Get all function schemas (for LLM)
   * @returns {Array} - Array of function schemas
   */
  getAllSchemas() {
    return Array.from(this.functions.values()).map(fn => fn.schema);
  }

  /**
   * Execute a function by name
   * @param {string} name - Function name
   * @param {Object} args - Function arguments
   * @returns {Promise<any>} - Function result
   */
  async execute(name, args) {
    const func = this.functions.get(name);
    
    if (!func) {
      throw new Error(`Function '${name}' not found in registry`);
    }

    try {
      console.log(`🔧 Executing function: ${name} with args:`, args);
      const result = await func.handler(args);
      console.log(`✅ Function ${name} completed successfully`);
      return result;
    } catch (error) {
      console.error(`❌ Error executing function ${name}:`, error);
      throw error;
    }
  }

  /**
   * Check if a function exists
   */
  has(name) {
    return this.functions.has(name);
  }

  /**
   * Get function details
   */
  get(name) {
    return this.functions.get(name);
  }

  /**
   * Register default functions
   */
  registerDefaultFunctions() {
    // Function 1: Get Order Status
    this.register(
      'getOrderStatus',
      {
        name: 'getOrderStatus',
        description: 'Get the current status of an order by order ID',
        parameters: {
          type: 'object',
          properties: {
            orderId: {
              type: 'string',
              description: 'The order ID to look up',
            },
          },
          required: ['orderId'],
        },
      },
      async ({ orderId }) => {
        const order = await Order.findById(orderId)
          .populate('customerId', 'name email')
          .populate('items.productId', 'name price');

        if (!order) {
          return {
            success: false,
            error: 'Order not found',
            message: `No order found with ID: ${orderId}`,
          };
        }

        return {
          success: true,
          order: {
            id: order._id,
            status: order.status,
            carrier: order.carrier,
            trackingNumber: order.trackingNumber,
            estimatedDelivery: order.estimatedDelivery,
            total: order.total,
            createdAt: order.createdAt,
            customer: order.customerId,
            items: order.items,
          },
        };
      }
    );

    // Function 2: Search Products
    this.register(
      'searchProducts',
      {
        name: 'searchProducts',
        description: 'Search for products by name, category, or description',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query (product name, category, or keyword)',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results to return (default: 5)',
              default: 5,
            },
          },
          required: ['query'],
        },
      },
      async ({ query, limit = 5 }) => {
        // Search by name or category (case-insensitive)
        const products = await Product.find({
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } },
          ],
        })
          .limit(limit)
          .select('name price category imageUrl stock');

        return {
          success: true,
          count: products.length,
          products: products.map(p => ({
            id: p._id,
            name: p.name,
            price: p.price,
            category: p.category,
            imageUrl: p.imageUrl,
            inStock: p.stock > 0,
          })),
        };
      }
    );

    // Function 3: Get Customer Orders
    this.register(
      'getCustomerOrders',
      {
        name: 'getCustomerOrders',
        description: 'Get all orders for a customer by email address',
        parameters: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'Customer email address',
            },
          },
          required: ['email'],
        },
      },
      async ({ email }) => {
        // Find customer
        const customer = await Customer.findOne({ 
          email: email.toLowerCase() 
        });

        if (!customer) {
          return {
            success: false,
            error: 'Customer not found',
            message: `No customer found with email: ${email}`,
          };
        }

        // Get their orders
        const orders = await Order.find({ customerId: customer._id })
          .sort({ createdAt: -1 })
          .limit(10)
          .select('_id status total createdAt carrier trackingNumber');

        return {
          success: true,
          customer: {
            name: customer.name,
            email: customer.email,
          },
          orderCount: orders.length,
          orders: orders.map(o => ({
            id: o._id,
            status: o.status,
            total: o.total,
            createdAt: o.createdAt,
            carrier: o.carrier,
            trackingNumber: o.trackingNumber,
          })),
        };
      }
    );
  }
}

// Export singleton instance
const registry = new FunctionRegistry();
export default registry;