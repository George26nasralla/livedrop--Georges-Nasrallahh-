import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart, useCartTotal } from "../lib/store";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  tags: string[];
  stockQty: number;
}

export function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);
  const total = useCartTotal();

  useEffect(() => {
    fetch("/mock-catalog.json")
      .then((res) => res.json())
      .then((data: Product[]) => {
        const found = data.find((p) => p.id === id);
        setProduct(found || null);
        
        // Find related products by shared tags
        if (found) {
          const related = data
            .filter((p) => {
              // Exclude current product
              if (p.id === found.id) return false;
              // Check if any tags match
              return p.tags.some((tag) => found.tags.includes(tag));
            })
            .slice(0, 3); // Take only 3
          setRelatedProducts(related);
        }
      });
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            Sorry, we couldn't find the product you're looking for.
          </p>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-3 rounded-xl hover:scale-105 transition-all shadow-lg"
          >
            ← Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      add(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const increaseQty = () => {
    if (quantity < product.stockQty) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {/* Header */}
      <header className="p-6 bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20 flex justify-between items-center sticky top-0 z-10 shadow-lg">
        <Link
          to="/"
          className="flex items-center gap-2 text-black font-semibold hover:scale-105 transition-all"
        >
          <span className="text-2xl">←</span>
          <span>Back to Catalog</span>
        </Link>
        <Link
          to="/cart"
          className="bg-white text-purple-600 font-bold px-6 py-3 rounded-xl hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
        >
          🛒 Cart ${total.toFixed(2)}
        </Link>
      </header>

      {/* Product Details */}
      <main className="p-10 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-12 flex items-center justify-center relative">
              <div className="absolute top-6 right-6">
                {product.stockQty > 0 ? (
                  <span className="bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                    In Stock
                  </span>
                ) : (
                  <span className="bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                    Out of Stock
                  </span>
                )}
              </div>
              <img
                src={product.image}
                alt={product.title}
                className="object-contain w-full max-h-96 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Info Section */}
            <div className="p-12 flex flex-col justify-between bg-gradient-to-br from-purple-500 to-indigo-700 text-white">
              <div>
                <h1 className="text-4xl font-extrabold mb-4 drop-shadow-lg">
                  {product.title}
                </h1>

                <div className="flex flex-wrap gap-2 mb-6">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="border-2 border-white border-opacity-40 text-white text-sm px-4 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="border-2 border-white border-opacity-40 rounded-2xl p-6 mb-6">
                  <p className="text-sm opacity-90 mb-2">Price</p>
                  <p className="text-5xl font-extrabold">
                    ${product.price.toFixed(2)}
                  </p>
                </div>

                <div className="border-2 border-white border-opacity-40 rounded-2xl p-6 mb-8">
                  <p className="text-sm opacity-90 mb-2">Available Stock</p>
                  <p className="text-2xl font-bold">{product.stockQty} units</p>
                </div>
              </div>

              {/* Quantity Selector & Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold">Quantity:</span>
                  <div className="flex items-center bg-white rounded-xl overflow-hidden shadow-lg">
                    <button
                      onClick={decreaseQty}
                      disabled={quantity === 1}
                      className="px-6 py-3 bg-gray-100 text-purple-600 font-bold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      −
                    </button>
                    <span className="px-8 py-3 bg-white text-purple-600 font-bold text-xl">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQty}
                      disabled={quantity >= product.stockQty}
                      className="px-6 py-3 bg-gray-100 text-purple-600 font-bold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stockQty === 0}
                  className={`w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wide shadow-xl transition-all duration-300 ${
                    product.stockQty === 0
                      ? "bg-gray-400 cursor-not-allowed opacity-50"
                      : "bg-white text-purple-600 hover:bg-purple-50 hover:scale-105 hover:shadow-2xl"
                  }`}
                >
                  {product.stockQty === 0 ? "Out of Stock" : "Add to Cart"}
                </button>

                {added && (
                  <div className="bg-green-500 text-white text-center py-3 rounded-xl font-bold animate-pulse shadow-lg">
                    ✅ Added {quantity} {quantity === 1 ? "item" : "items"} to cart!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct, index) => {
                const gradients = [
                  "from-purple-500 to-indigo-600",
                  "from-pink-500 to-rose-600",
                  "from-cyan-400 to-blue-600",
                ];
                const gradient = gradients[index % gradients.length];
                
                return (
                  <Link
                    key={relatedProduct.id}
                    to={`/p/${relatedProduct.id}`}
                    className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 text-white`}
                  >
                    <div className="w-full h-32 flex items-center justify-center overflow-hidden rounded-xl bg-white bg-opacity-20 backdrop-blur-sm shadow-lg mb-4">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.title}
                        className="object-contain h-24"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{relatedProduct.title}</h3>
                    <p className="text-sm opacity-90 mb-3">
                      {relatedProduct.tags.slice(0, 2).join(" • ")}
                    </p>
                    <p className="text-2xl font-extrabold">${relatedProduct.price.toFixed(2)}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}