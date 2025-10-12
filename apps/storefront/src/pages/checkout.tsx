import { Link, useNavigate } from "react-router-dom";
import { useCart, useCartTotal } from "../lib/store";
import { useState } from "react";

export function CheckoutPage() {
  const { items, clear } = useCart();
  const total = useCartTotal();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const placeOrder = () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      const orderId = Math.random().toString(36).substring(2, 10).toUpperCase();
      clear();
      navigate(`/order/${orderId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {/* Header */}
      <header className="p-6 bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20 flex justify-between items-center sticky top-0 z-10 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight drop-shadow-lg">
            Checkout
          </h1>
          <p className="text-black text-opacity-90 text-sm mt-1">
            Review and complete your order
          </p>
        </div>
        <Link
          to="/cart"
          className="bg-white text-purple-600 font-bold px-6 py-3 rounded-xl hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
        >
          ← Back to Cart
        </Link>
      </header>

      <main className="p-10 max-w-5xl mx-auto">
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
            <div className="text-8xl mb-6">📦</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              No Items to Checkout
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Your cart is empty. Add some items before checking out.
            </p>
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-4 rounded-xl hover:scale-105 transition-all shadow-lg text-lg"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Summary - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                  <h2 className="text-2xl font-bold text-white">
                    Order Items ({items.length})
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {items.map((item, index) => {
                    const gradients = [
                      "from-purple-500 to-indigo-600",
                      "from-pink-500 to-rose-600",
                      "from-cyan-400 to-blue-600",
                      "from-emerald-400 to-teal-600",
                      "from-amber-400 to-orange-600",
                      "from-indigo-500 to-purple-700",
                    ];
                    const gradient = gradients[index % gradients.length];

                    return (
                      <div key={item.id} className="p-6 flex items-center gap-6">
                        <div className={`bg-gradient-to-br ${gradient} rounded-xl p-4 w-20 h-20 flex items-center justify-center shadow-lg flex-shrink-0`}>
                          <div className="text-white text-3xl font-bold">
                            {item.title.charAt(0)}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-bold text-gray-800">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.qty}
                          </p>
                          <p className="text-lg font-semibold text-purple-600">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Subtotal</p>
                          <p className="text-2xl font-bold text-gray-800">
                            ${(item.price * item.qty).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      placeholder="123 Main Street"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="New York"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      placeholder="10001"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary - Right Side */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-2xl p-8 sticky top-28">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Order Summary
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span className="font-semibold">${(total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Total</span>
                      <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                        ${(total * 1.1).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={isProcessing}
                  className={`w-full font-bold py-4 px-6 rounded-xl transition-all shadow-lg text-lg ${
                    isProcessing
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 hover:shadow-xl"
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Place Order →"
                  )}
                </button>

                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🔒</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Secure Checkout
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Your payment information is encrypted and secure
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}