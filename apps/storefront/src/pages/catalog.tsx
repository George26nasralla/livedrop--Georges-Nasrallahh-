import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart, useCartTotal } from "../lib/store";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  tags: string[];
  stockQty: number;
}

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"none" | "price-asc" | "price-desc">("none");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const add = useCart((s) => s.add);
  const total = useCartTotal();

  useEffect(() => {
    fetch("/mock-catalog.json")
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
        setProducts(data);
      })
      .catch((err) => console.error("Error loading catalog:", err));
  }, []);

  // Get all unique tags
  const allTags = Array.from(
    new Set(allProducts.flatMap((p) => p.tags))
  ).sort();

  // Filter and sort products
  useEffect(() => {
    let filtered = [...allProducts];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(query);
        const tagMatch = p.tags.some((tag) => tag.toLowerCase().includes(query));
        return titleMatch || tagMatch;
      });
    }

    // Tag filter
    if (selectedTag) {
      filtered = filtered.filter((p) => p.tags.includes(selectedTag));
    }

    // Sort
    if (sortBy === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setProducts(filtered);
  }, [searchQuery, sortBy, selectedTag, allProducts]);

  const bgGradients = [
    "bg-gradient-to-br from-purple-500 to-purple-700",
    "bg-gradient-to-br from-pink-500 to-rose-600",
    "bg-gradient-to-br from-cyan-400 to-blue-500",
    "bg-gradient-to-br from-emerald-400 to-teal-500",
    "bg-gradient-to-br from-amber-400 to-orange-500",
    "bg-gradient-to-br from-indigo-500 to-purple-600",
  ];

  const buttonColors = [
    "bg-white text-purple-600 hover:bg-purple-50",
    "bg-white text-rose-600 hover:bg-rose-50",
    "bg-white text-blue-600 hover:bg-blue-50",
    "bg-white text-teal-600 hover:bg-teal-50",
    "bg-white text-orange-600 hover:bg-orange-50",
    "bg-white text-indigo-600 hover:bg-indigo-50",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {/* Header */}
      <header className="p-6 bg-white/10 backdrop-blur-md border-b border-white/20 flex justify-between items-center sticky top-0 z-10 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">
            GEORGEous store
          </h1>
          <p className="text-white/90 text-sm mt-1">Discover our exclusive range</p>
        </div>
        <Link
          to="/cart"
          className="bg-white text-purple-600 font-bold px-6 py-3 rounded-xl hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
        >
          🛒 Cart ${total.toFixed(2)}
        </Link>
      </header>

      {/* Catalog Grid */}
      <main className="p-10 max-w-7xl mx-auto">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products by name or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-white/30 bg-white/20 backdrop-blur-md text-white placeholder-white placeholder:opacity-70 focus:outline-none focus:border-white/50 focus:bg-white/30 transition-all shadow-lg"
            />
            <svg
              className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white opacity-70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-white font-semibold border-2 border-white/30 focus:outline-none focus:border-white/50 cursor-pointer"
              >
                <option value="none" className="text-gray-800">Default</option>
                <option value="price-asc" className="text-gray-800">Price: Low to High</option>
                <option value="price-desc" className="text-gray-800">Price: High to Low</option>
              </select>
            </div>

            {/* Tag Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-semibold">Filter by tag:</span>
              <button
                onClick={() => setSelectedTag("")}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  selectedTag === ""
                    ? "bg-white text-purple-600 shadow-lg"
                    : "bg-white/20 text-white border-2 border-white/30 hover:bg-white/30"
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    selectedTag === tag
                      ? "bg-white text-purple-600 shadow-lg"
                      : "bg-white/20 text-white border-2 border-white/30 hover:bg-white/30"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="text-white/90">
            Showing <span className="font-bold">{products.length}</span> {products.length === 1 ? "product" : "products"}
            {searchQuery && ` for "${searchQuery}"`}
            {selectedTag && ` in "${selectedTag}"`}
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h2>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedTag("");
                setSortBy("none");
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-6 py-3 rounded-xl hover:scale-105 transition-all shadow-lg"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p, index) => {
              const colorIndex = index % bgGradients.length;
              return (
                <div
                  key={p.id}
                  className={`group ${bgGradients[colorIndex]} rounded-2xl p-6 shadow-xl border border-white/10 hover:shadow-2xl hover:-translate-y-3 hover:scale-105 transition-all duration-500 flex flex-col text-white`}
                >
                  {/* Product Image */}
                  <div className="w-full h-36 flex items-center justify-center overflow-hidden rounded-xl bg-white/20 backdrop-blur-sm shadow-lg mb-4">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="object-contain h-28 transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow">
                    <h2 className="font-bold text-xl mb-2 drop-shadow-md">
                      {p.title}
                    </h2>
                    <p className="text-sm opacity-90 mb-3 line-clamp-2">
                      {p.tags.join(" • ")}
                    </p>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-3xl font-extrabold">
                        ${p.price.toFixed(2)}
                      </span>
                      <span className="text-xs opacity-75">
                        Stock: {p.stockQty}
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => add(p)}
                      className={`flex-1 ${buttonColors[colorIndex]} font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg uppercase tracking-wide text-sm`}
                    >
                      Add to Cart
                    </button>
                    <Link
                      to={`/p/${p.id}`}
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      View
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}