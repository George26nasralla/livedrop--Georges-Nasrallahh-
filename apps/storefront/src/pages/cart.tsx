import { Link } from "react-router-dom";
import { useCart, useCartTotal } from "../lib/store";

export function CartPage() {
  const { items, remove, setQty, clear } = useCart();
  const total = useCartTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {/* Header */}
      <header className="p-6 bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20 flex justify-between items-center sticky top-0 z-10 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight drop-shadow-lg">
            Shopping Cart
          </h1>
          <p className="text-white text-opacity-90 text-sm mt-1">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <Link
          to="/"
          className="bg-white text-purple-600 font-bold px-6 py-3 rounded-xl hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
        >
          ← Continue Shopping
        </Link>
      </header>

      <main className="p-10 max-w-6xl mx-auto">
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-4 rounded-xl hover:scale-105 transition-all shadow-lg text-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
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
                    <div
                      key={item.id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-6">
                        {/* Product Image */}
                        <div className={`bg-gradient-to-br ${gradient} rounded-xl p-4 w-28 h-28 flex items-center justify-center shadow-lg flex-shrink-0`}>
                          <div className="text-white text-4xl font-bold">
                            {item.title.charAt(0)}
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex-grow">
                          <h2 className="text-xl font-bold text-gray-800 mb-2">
                            {item.title}
                          </h2>
                          <p className="text-2xl font-extrabold text-purple-600">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden shadow-md">
                            <button
                              onClick={() => setQty(item.id, item.qty - 1)}
                              disabled={item.qty <= 1}
                              className="px-4 py-2 text-purple-600 font-bold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                              −
                            </button>
                            <span className="px-6 py-2 bg-white text-purple-600 font-bold text-lg min-w-12 text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => setQty(item.id, item.qty + 1)}
                              className="px-4 py-2 text-purple-600 font-bold hover:bg-gray-200 transition-all"
                            >
                              +
                            </button>
                          </div>

                          {/* Subtotal */}
                          <div className="text-right min-w-24">
                            <p className="text-sm text-gray-500">Subtotal</p>
                            <p className="text-xl font-bold text-gray-800">
                              ${(item.price * item.qty).toFixed(2)}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => remove(item.id)}
                            className="ml-4 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all hover:scale-110"
                            title="Remove item"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Order Summary
                  </h3>
                  <p className="text-gray-600">
                    {items.reduce((acc, item) => acc + item.qty, 0)} items total
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                  <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                    ${total.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={clear}
                  className="flex-1 bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl hover:bg-gray-300 transition-all hover:scale-105 shadow-md"
                >
                  Clear Cart
                </button>
                <Link
                  to="/checkout"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:scale-105 transition-all shadow-lg text-center"
                >
                  Proceed to Checkout →
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}