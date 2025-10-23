import express from 'express';
import Order from '../models/order.js';
import Customer from '../models/customers.js';
import Product from '../models/products.js';

const router = express.Router();

// In-memory storage for performance metrics
// In production, you'd use Redis or a time-series database
const performanceMetrics = {
  apiCalls: [],
  sseConnections: 0,
  errors: 0,
};

// In-memory storage for assistant stats
// In production, you'd store this in the database
const assistantMetrics = {
  intents: {},
  functionCalls: {},
  totalConversations: 0,
};

/**
 * GET /api/dashboard/business-metrics
 * Get revenue, orders, and average order value
 */
router.get('/business-metrics', async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Use aggregation for efficient metrics calculation
    const [metrics] = await Order.aggregate([
      {
        $facet: {
          // All-time metrics
          allTime: [
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: '$total' },
                totalOrders: { $sum: 1 },
                avgOrderValue: { $avg: '$total' },
              },
            },
          ],
          // Last 30 days
          last30Days: [
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
              $group: {
                _id: null,
                revenue: { $sum: '$total' },
                orders: { $sum: 1 },
              },
            },
          ],
          // Last 7 days
          last7Days: [
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
              $group: {
                _id: null,
                revenue: { $sum: '$total' },
                orders: { $sum: 1 },
              },
            },
          ],
          // Orders by status
          byStatus: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
              },
            },
          ],
          // Top customers (by order count)
          topCustomers: [
            {
              $group: {
                _id: '$customerId',
                orderCount: { $sum: 1 },
                totalSpent: { $sum: '$total' },
              },
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 5 },
          ],
        },
      },
    ]);

    // Calculate growth rates
    const last30Revenue = metrics.last30Days[0]?.revenue || 0;
    const last7Revenue = metrics.last7Days[0]?.revenue || 0;
    const dailyAvgLast30 = last30Revenue / 30;
    const dailyAvgLast7 = last7Revenue / 7;
    const revenueGrowth = dailyAvgLast30 > 0 
      ? ((dailyAvgLast7 - dailyAvgLast30) / dailyAvgLast30) * 100 
      : 0;

    // Get customer count
    const totalCustomers = await Customer.countDocuments();

    // Get low stock products
    const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 } });

    res.json({
      revenue: {
        total: Math.round((metrics.allTime[0]?.totalRevenue || 0) * 100) / 100,
        last30Days: Math.round(last30Revenue * 100) / 100,
        last7Days: Math.round(last7Revenue * 100) / 100,
        growth: Math.round(revenueGrowth * 100) / 100, // percentage
      },
      orders: {
        total: metrics.allTime[0]?.totalOrders || 0,
        last30Days: metrics.last30Days[0]?.orders || 0,
        last7Days: metrics.last7Days[0]?.orders || 0,
        byStatus: metrics.byStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      },
      avgOrderValue: Math.round((metrics.allTime[0]?.avgOrderValue || 0) * 100) / 100,
      customers: {
        total: totalCustomers,
      },
      inventory: {
        lowStockProducts,
      },
      topCustomers: metrics.topCustomers,
    });
  } catch (error) {
    console.error('Error fetching business metrics:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch business metrics',
    });
  }
});

/**
 * GET /api/dashboard/performance
 * Get API latency and SSE connection metrics
 */
router.get('/performance', async (req, res) => {
  try {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;

    // Filter recent API calls
    const recentCalls = performanceMetrics.apiCalls.filter(
      call => call.timestamp > fiveMinutesAgo
    );

    // Calculate average latency
    const avgLatency = recentCalls.length > 0
      ? recentCalls.reduce((sum, call) => sum + call.duration, 0) / recentCalls.length
      : 0;

    // Calculate requests per minute
    const requestsPerMinute = (recentCalls.length / 5).toFixed(2);

    res.json({
      apiLatency: {
        avg: Math.round(avgLatency),
        min: recentCalls.length > 0 ? Math.min(...recentCalls.map(c => c.duration)) : 0,
        max: recentCalls.length > 0 ? Math.max(...recentCalls.map(c => c.duration)) : 0,
      },
      requestsPerMinute: parseFloat(requestsPerMinute),
      activeSSEConnections: performanceMetrics.sseConnections,
      errors: {
        last5Minutes: performanceMetrics.errors,
      },
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024), // MB
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024), // MB
      },
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch performance metrics',
    });
  }
});

/**
 * GET /api/dashboard/assistant-stats
 * Get intent distribution and function call statistics
 */
router.get('/assistant-stats', async (req, res) => {
  try {
    // Calculate percentages for intents
    const totalIntents = Object.values(assistantMetrics.intents).reduce((a, b) => a + b, 0);
    const intentDistribution = Object.entries(assistantMetrics.intents).map(([intent, count]) => ({
      intent,
      count,
      percentage: totalIntents > 0 ? Math.round((count / totalIntents) * 100) : 0,
    }));

    // Calculate percentages for function calls
    const totalFunctionCalls = Object.values(assistantMetrics.functionCalls).reduce((a, b) => a + b, 0);
    const functionCallDistribution = Object.entries(assistantMetrics.functionCalls).map(([func, count]) => ({
      function: func,
      count,
      percentage: totalFunctionCalls > 0 ? Math.round((count / totalFunctionCalls) * 100) : 0,
    }));

    res.json({
      totalConversations: assistantMetrics.totalConversations,
      intents: {
        total: totalIntents,
        distribution: intentDistribution.sort((a, b) => b.count - a.count),
      },
      functionCalls: {
        total: totalFunctionCalls,
        distribution: functionCallDistribution.sort((a, b) => b.count - a.count),
      },
    });
  } catch (error) {
    console.error('Error fetching assistant stats:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch assistant statistics',
    });
  }
});

/**
 * Helper functions to track metrics (exported for use in middleware)
 */
export const trackApiCall = (duration) => {
  performanceMetrics.apiCalls.push({
    timestamp: Date.now(),
    duration,
  });

  // Keep only last 5 minutes of data
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  performanceMetrics.apiCalls = performanceMetrics.apiCalls.filter(
    call => call.timestamp > fiveMinutesAgo
  );
};

export const trackSSEConnection = (increment = true) => {
  if (increment) {
    performanceMetrics.sseConnections++;
  } else {
    performanceMetrics.sseConnections--;
  }
};

export const trackError = () => {
  performanceMetrics.errors++;
};

export const trackIntent = (intent) => {
  if (!assistantMetrics.intents[intent]) {
    assistantMetrics.intents[intent] = 0;
  }
  assistantMetrics.intents[intent]++;
};

export const trackFunctionCall = (functionName) => {
  if (!assistantMetrics.functionCalls[functionName]) {
    assistantMetrics.functionCalls[functionName] = 0;
  }
  assistantMetrics.functionCalls[functionName]++;
};

export const trackConversation = () => {
  assistantMetrics.totalConversations++;
};

export default router;