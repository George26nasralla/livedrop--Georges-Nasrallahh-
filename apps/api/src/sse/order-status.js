import Order from '../models/order.js';
import { trackSSEConnection } from '../routes/dashboard.js';


/**
 * SSE endpoint for real-time order tracking
 * GET /api/orders/:id/stream
 * 
 * Auto-simulates order progression:
 * PENDING → PROCESSING → SHIPPED → DELIVERED
 */
export const streamOrderStatus = async (req, res) => {
  const { id } = req.params;

  try {
    // Verify order exists
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Order not found',
      });
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

    // Track SSE connection
    trackSSEConnection(true);

    console.log(`📡 SSE connection opened for order ${id}`);

    // Send initial status immediately
    const sendEvent = (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Send current status
    sendEvent({
      status: order.status,
      carrier: order.carrier,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      updatedAt: order.updatedAt,
      timestamp: new Date().toISOString(),
    });

    // If already delivered, close immediately
    if (order.status === 'DELIVERED') {
      console.log(`✅ Order ${id} already delivered, closing stream`);
      trackSSEConnection(false);
      return res.end();
    }

    // Auto-simulation: Progress order through statuses
    const statusFlow = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentIndex = statusFlow.indexOf(order.status);
    
    if (currentIndex === -1 || currentIndex === statusFlow.length - 1) {
      // Invalid status or already delivered
      trackSSEConnection(false);
      return res.end();
    }

    // Function to advance to next status
    const advanceStatus = async () => {
      try {
        // Get current order from DB
        const currentOrder = await Order.findById(id);
        if (!currentOrder) {
          clearTimeout(intervalId);
          trackSSEConnection(false);
          return res.end();
        }

        const currentStatusIndex = statusFlow.indexOf(currentOrder.status);
        const nextStatusIndex = currentStatusIndex + 1;

        // Check if we've reached the end
        if (nextStatusIndex >= statusFlow.length) {
          clearTimeout(intervalId);
          trackSSEConnection(false);
          return res.end();
        }

        const nextStatus = statusFlow[nextStatusIndex];

        // Update order in database
        currentOrder.status = nextStatus;
        currentOrder.updatedAt = new Date();

        // Add carrier and tracking info when processing
        if (nextStatus === 'PROCESSING') {
          currentOrder.carrier = 'DHL Express';
          currentOrder.trackingNumber = `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        }

        // Set estimated delivery when shipped
        if (nextStatus === 'SHIPPED') {
          const eta = new Date();
          eta.setDate(eta.getDate() + Math.floor(Math.random() * 3) + 3); // 3-5 days
          currentOrder.estimatedDelivery = eta;
        }

        await currentOrder.save();

        console.log(`📦 Order ${id} status updated: ${nextStatus}`);

        // Send SSE event
        sendEvent({
          status: currentOrder.status,
          carrier: currentOrder.carrier,
          trackingNumber: currentOrder.trackingNumber,
          estimatedDelivery: currentOrder.estimatedDelivery,
          updatedAt: currentOrder.updatedAt,
          timestamp: new Date().toISOString(),
        });

        // Close stream if delivered
        if (nextStatus === 'DELIVERED') {
          console.log(`✅ Order ${id} delivered, closing stream`);
          clearTimeout(intervalId);
          trackSSEConnection(false);
          res.end();
        }
      } catch (error) {
        console.error('Error advancing order status:', error);
        clearTimeout(intervalId);
        trackSSEConnection(false);
        res.end();
      }
    };

    // Random interval between 3-7 seconds for status changes
    const getRandomInterval = () => Math.floor(Math.random() * 4000) + 3000; // 3-7 seconds

    let intervalId;
    const scheduleNext = () => {
      intervalId = setTimeout(async () => {
        await advanceStatus();
        // Schedule next update if not delivered
        const currentOrder = await Order.findById(id);
        if (currentOrder && currentOrder.status !== 'DELIVERED') {
          scheduleNext();
        }
      }, getRandomInterval());
    };

    // Start the simulation
    scheduleNext();

    // Handle client disconnect
    req.on('close', () => {
      console.log(`🔌 SSE connection closed for order ${id}`);
      if (intervalId) {
        clearTimeout(intervalId);
      }
      trackSSEConnection(false);
      res.end();
    });

  } catch (error) {
    console.error('SSE Error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid order ID format',
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to stream order status',
    });
  }
};