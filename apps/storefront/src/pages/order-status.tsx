import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const statuses = ["Placed", "Packed", "Shipped", "Delivered"] as const;
type StatusType = typeof statuses[number];

export function OrderStatusPage() {
  const { id } = useParams();
  const [currentStatus] = useState<StatusType>(statuses[Math.floor(Math.random() * statuses.length)]);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const currentStatusIndex = statuses.indexOf(currentStatus);

  const statusIcons = {
    Placed: "📋",
    Packed: "📦",
    Shipped: "🚚",
    Delivered: "✅"
  };

  const statusColors = {
    Placed: "from-blue-500 to-cyan-500",
    Packed: "from-amber-500 to-orange-500",
    Shipped: "from-purple-500 to-indigo-600",
    Delivered: "from-emerald-500 to-teal-600"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {/* Header */}
      <header className="p-6 bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20 flex justify-between items-center sticky top-0 z-10 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text- tracking-tight drop-shadow-lg">
            Order Confirmation
          </h1>
          <p className="text-white text-opacity-90 text-sm mt-1">
            Thank you for your purchase!
          </p>
        </div>
        <Link
          to="/"
          className="bg-white text-purple-600 font-bold px-6 py-3 rounded-xl hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
        >
          ← Back to Catalog
        </Link>
      </header>

      <main className="p-10 max-w-4xl mx-auto">
        {/* Success Message */}
        <div className={`bg-white rounded-3xl shadow-2xl p-12 text-center mb-8 relative overflow-hidden ${showConfetti ? 'animate-pulse' : ''}`}>
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 text-4xl animate-bounce">🎉</div>
              <div className="absolute top-0 right-1/4 text-4xl animate-bounce delay-100">🎊</div>
              <div className="absolute top-10 left-1/3 text-3xl animate-bounce delay-200">✨</div>
              <div className="absolute top-10 right-1/3 text-3xl animate-bounce delay-300">🎈</div>
            </div>
          )}
          
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Your order has been confirmed and is being processed
          </p>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 inline-block">
            <p className="text-sm text-gray-600 mb-2">Order ID</p>
            <p className="text-3xl font-bold text-purple-600 tracking-wider">
              {id}
            </p>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Order Status Timeline
          </h3>
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-12 left-0 right-0 h-2 bg-gray-200 rounded-full">
              <div 
                className={`h-full bg-gradient-to-r ${statusColors[currentStatus]} rounded-full transition-all duration-1000`}
                style={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
              ></div>
            </div>

            {/* Status Steps */}
            <div className="relative grid grid-cols-4 gap-4">
              {statuses.map((status, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                
                return (
                  <div key={status} className="flex flex-col items-center">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-4 shadow-lg transition-all duration-500 ${
                      isCompleted 
                        ? `bg-gradient-to-br ${statusColors[status]} scale-110` 
                        : 'bg-gray-200'
                    } ${isCurrent ? 'ring-4 ring-purple-300 animate-pulse' : ''}`}>
                      {statusIcons[status]}
                    </div>
                    <p className={`font-bold text-sm transition-all ${
                      isCompleted ? 'text-gray-800 scale-110' : 'text-gray-400'
                    }`}>
                      {status}
                    </p>
                    {isCurrent && (
                      <span className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Shipping Details */}
        {["Shipped", "Delivered"].includes(currentStatus) && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Shipping Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🚚</span>
                  <div>
                    <p className="text-sm text-gray-600">Carrier</p>
                    <p className="text-xl font-bold text-gray-800">ShopLite Express</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">📅</span>
                  <div>
                    <p className="text-sm text-gray-600">Estimated Delivery</p>
                    <p className="text-xl font-bold text-gray-800">3–5 Business Days</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📦</span>
                  <div>
                    <p className="text-sm text-gray-600">Tracking Number</p>
                    <p className="text-lg font-bold text-gray-800 tracking-wider">
                      SLE-{id}-2025
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/"
            className="bg-white text-purple-600 font-bold py-4 px-6 rounded-xl hover:scale-105 transition-all shadow-lg text-center border-2 border-purple-200"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => window.print()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:scale-105 transition-all shadow-lg"
          >
            Print Receipt
          </button>
        </div>
      </main>
    </div>
  );
}