import { useEffect, useState } from 'react';
import { OrderSSEClient, OrderStatusUpdate } from '../lib/sse-client';

interface OrderTrackingProps {
  orderId: string;
}

export default function OrderTracking({ orderId }: OrderTrackingProps) {
  const [orderStatus, setOrderStatus] = useState<OrderStatusUpdate | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create SSE client
    const client = new OrderSSEClient(orderId);

    // Connect and listen for updates
    client.connect(
      // On update
      (data) => {
        setOrderStatus(data);
        setIsConnected(true);
        setError(null);
        
        // Close connection if delivered
        if (data.status === 'DELIVERED') {
          setIsConnected(false);
        }
      },
      // On error
      (error) => {
        console.error('Connection error:', error);
        setError('Failed to connect to order tracking');
        setIsConnected(false);
      },
      // On complete (delivered)
      () => {
        setIsConnected(false);
      }
    );

    // Cleanup on unmount
    return () => {
      client.disconnect();
    };
  }, [orderId]);

  // Loading state
  if (!orderStatus && !error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-600">Connecting to live tracking...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Connection Error</h3>
        <p className="text-red-600">{error}</p>
        <p className="text-sm text-gray-600 mt-2">
          Make sure your backend is running on http://localhost:5000
        </p>
      </div>
    );
  }

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Order Tracking</h2>
        {isConnected && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">Live Updates</span>
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="mb-6">
        <span
          className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(
            orderStatus!.status
          )}`}
        >
          {orderStatus!.status}
        </span>
      </div>

      {/* Order Details */}
      <div className="space-y-4 mb-6">
        {orderStatus!.carrier && (
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-gray-600 font-medium">Carrier</span>
            <span className="text-gray-900 font-semibold">{orderStatus!.carrier}</span>
          </div>
        )}

        {orderStatus!.trackingNumber && (
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-gray-600 font-medium">Tracking Number</span>
            <span className="text-gray-900 font-mono text-sm">{orderStatus!.trackingNumber}</span>
          </div>
        )}

        {orderStatus!.estimatedDelivery && (
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-gray-600 font-medium">Estimated Delivery</span>
            <span className="text-gray-900 font-semibold">
              {formatDate(orderStatus!.estimatedDelivery)}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Last Updated</span>
          <span className="text-gray-900 text-sm">{formatDate(orderStatus!.updatedAt)}</span>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Progress</h3>
        <div className="relative">
          {/* Progress line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          {/* Timeline items */}
          <div className="space-y-6">
            {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((status, index) => {
              const isActive = orderStatus!.status === status;
              const isPast =
                ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].indexOf(orderStatus!.status) >
                index;
              const isCompleted = isPast || isActive;

              return (
                <div key={status} className="relative flex items-center">
                  {/* Circle indicator */}
                  <div
                    className={`z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      isCompleted
                        ? 'bg-blue-600 border-blue-600'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    {isCompleted && (
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Status label */}
                  <div className="ml-4">
                    <p
                      className={`font-semibold ${
                        isActive ? 'text-blue-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {status}
                    </p>
                    {isActive && status !== 'DELIVERED' && (
                      <p className="text-sm text-gray-500 animate-pulse">In progress...</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}