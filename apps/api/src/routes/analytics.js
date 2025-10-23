import express from 'express';
import Order from '../models/order.js';

const router = express.Router();

/**
 * GET /api/analytics/daily-revenue?from=YYYY-MM-DD&to=YYYY-MM-DD
 * Calculate daily revenue using DATABASE AGGREGATION (MongoDB aggregate)
 * 
 * CRITICAL REQUIREMENT: Must use native database aggregation
 * NO JavaScript .reduce() or loops allowed
 */
router.get('/daily-revenue', async (req, res) => {
  try {
    const { from, to } = req.query;

    // Validate date parameters
    if (!from || !to) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Both "from" and "to" date parameters are required (format: YYYY-MM-DD)',
      });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999); // Include entire end date

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid date format. Use YYYY-MM-DD',
      });
    }

    if (fromDate > toDate) {
      return res.status(400).json({
        error: 'Bad Request',
        message: '"from" date must be before or equal to "to" date',
      });
    }

    /**
     * NATIVE DATABASE AGGREGATION PIPELINE
     * This runs entirely in MongoDB - no JavaScript processing
     */
    const dailyRevenue = await Order.aggregate([
      // Filter orders by date range
      {
        $match: {
          createdAt: {
            $gte: fromDate,
            $lte: toDate,
          },
        },
      },

      {
        $group: {
          _id: {
            // Extract date parts (year, month, day) for grouping
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
            },
          },
          revenue: { $sum: '$total' }, // Sum total revenue
          orderCount: { $sum: 1 },      // Count orders
        },
      },
      // Reshape the output
      {
        $project: {
          _id: 0,
          date: '$_id',
          revenue: { $round: ['$revenue', 2] }, // Round to 2 decimals
          orderCount: 1,
        },
      },
      // Sort by date ascending
      {
        $sort: { date: 1 },
      },
    ]);

    // Fill in missing dates with zero revenue
    const result = fillMissingDates(dailyRevenue, fromDate, toDate);

    res.json({
      from,
      to,
      data: result,
      total: {
        revenue: result.reduce((sum, day) => sum + day.revenue, 0),
        orders: result.reduce((sum, day) => sum + day.orderCount, 0),
      },
    });
  } catch (error) {
    console.error('Error calculating daily revenue:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to calculate daily revenue',
    });
  }
});

/**
 * GET /api/analytics/dashboard-metrics
 * Get key metrics for dashboard
 */
router.get('/dashboard-metrics', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Use aggregation to get multiple metrics in one query
    const [metrics] = await Order.aggregate([
      {
        $facet: {
          // Total revenue (all time)
          totalRevenue: [
            { $group: { _id: null, total: { $sum: '$total' } } },
          ],
          // Total orders (all time)
          totalOrders: [
            { $count: 'count' },
          ],
          // Revenue last 30 days
          recentRevenue: [
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            { $group: { _id: null, total: { $sum: '$total' } } },
          ],
          // Orders last 30 days
          recentOrders: [
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            { $count: 'count' },
          ],
          // Average order value
          avgOrderValue: [
            { $group: { _id: null, avg: { $avg: '$total' } } },
          ],
          // Orders by status
          ordersByStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
          ],
        },
      },
    ]);

    res.json({
      totalRevenue: metrics.totalRevenue[0]?.total || 0,
      totalOrders: metrics.totalOrders[0]?.count || 0,
      revenueLastMonth: metrics.recentRevenue[0]?.total || 0,
      ordersLastMonth: metrics.recentOrders[0]?.count || 0,
      avgOrderValue: Math.round((metrics.avgOrderValue[0]?.avg || 0) * 100) / 100,
      ordersByStatus: metrics.ordersByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch dashboard metrics',
    });
  }
});

/**
 * Helper function to fill missing dates with zero values
 * (This is just for better UX - the aggregation is the key part)
 */
function fillMissingDates(data, fromDate, toDate) {
  const result = [];
  const dataMap = new Map(data.map(d => [d.date, d]));

  const currentDate = new Date(fromDate);
  while (currentDate <= toDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    
    if (dataMap.has(dateStr)) {
      result.push(dataMap.get(dateStr));
    } else {
      result.push({
        date: dateStr,
        revenue: 0,
        orderCount: 0,
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}

export default router;