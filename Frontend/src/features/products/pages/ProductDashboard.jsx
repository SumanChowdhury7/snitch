import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';

const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
};

const ProductsDashboard = () => {
  const { handleGetAllProducts } = useProduct();

  // REDUX STATE
  const { allProducts = [], loading } = useSelector(
    (state) => state.product
  );

  // LOCAL UI STATE
  const [search, setSearch] = useState('');
  const [currentImages, setCurrentImages] = useState({});

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  // SEARCH FILTER
  const filteredProducts = allProducts.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  // PRICE FORMATTER
  const formatPrice = (price) => {
    const symbol = currencySymbols[price?.currency] || '₹';

    return `${symbol}${Number(price?.amount || 0).toLocaleString(
      'en-IN'
    )}`;
  };

  // IMAGE PREV
  const handlePrevImage = (product) => {
    setCurrentImages((prev) => ({
      ...prev,
      [product._id]:
        (prev[product._id] || 0) === 0
          ? product.images.length - 1
          : (prev[product._id] || 0) - 1,
    }));
  };

  // IMAGE NEXT
  const handleNextImage = (product) => {
    setCurrentImages((prev) => ({
      ...prev,
      [product._id]:
        (prev[product._id] || 0) === product.images.length - 1
          ? 0
          : (prev[product._id] || 0) + 1,
    }));
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-[#1f1f1f] bg-[#0b0b0b]/95 backdrop-blur">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          
          <Link
            to="/"
            className="text-[22px] font-black tracking-[0.3em]"
          >
            SNITCH
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm text-[#a1a1a1] hover:text-[#FFD000] transition"
            >
              Home
            </Link>

            <Link
              to="/wishlist"
              className="text-sm text-[#a1a1a1] hover:text-[#FFD000] transition"
            >
              Wishlist
            </Link>

            <Link
              to="/cart"
              className="text-sm text-[#a1a1a1] hover:text-[#FFD000] transition"
            >
              Cart
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-10 pt-12 pb-4">
        
        <div className="max-w-[700px]">
          <p className="text-[#FFD000] uppercase tracking-[0.3em] text-xs font-semibold">
            New Collection
          </p>

          <h1 className="mt-4 text-4xl md:text-5xl font-black leading-[0.95]">
            Discover Premium Fashion
          </h1>

          <p className="mt-6 text-[#8d8d8d] text-sm md:text-base leading-relaxed">
            Explore curated streetwear, luxury essentials,
            and modern fits crafted for contemporary fashion lovers.
          </p>
        </div>

        {/* SEARCH */}
        <div className="mt-8 max-w-[420px]">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 bg-[#111111] border border-[#1f1f1f] rounded-2xl px-5 text-sm outline-none focus:border-[#FFD000] transition"
          />
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-10 pb-20">
        
        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold">
            Products
          </h2>

          <p className="text-sm text-[#7d7d7d]">
            {filteredProducts.length} Items
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-[#2a2a2a] border-t-[#FFD000] rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (

          <div className="h-[400px] border border-[#1f1f1f] rounded-[32px] flex flex-col items-center justify-center text-center">
            <h3 className="text-2xl font-bold">
              No Products Found
            </h3>

            <p className="mt-3 text-sm text-[#7d7d7d]">
              Try searching something else.
            </p>
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-7">
            
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="group border border-[#1f1f1f] rounded-[28px] overflow-hidden bg-[#101010] hover:border-[#2d2d2d] hover:-translate-y-1 transition-all duration-300"
              >

                {/* IMAGE SLIDER */}
                <div className="aspect-[3/4] overflow-hidden bg-[#151515] relative">

                  <div
                    className="flex h-full w-full transition-transform duration-500"
                    style={{
                      transform: `translateX(-${
                        (currentImages[product._id] || 0) * 100
                      }%)`,
                    }}
                  >
                    {product.images?.map((img) => (
                      <img
                        key={img._id}
                        src={img.url}
                        alt={product.title}
                        className="min-w-full h-full object-cover flex-shrink-0"
                      />
                    ))}
                  </div>

                  {/* LEFT */}
                  {product.images?.length > 1 && (
                    <button
                      onClick={() => handlePrevImage(product)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur border border-[#2a2a2a] flex items-center justify-center text-white hover:border-[#FFD000] hover:text-[#FFD000] transition"
                    >
                      ←
                    </button>
                  )}

                  {/* RIGHT */}
                  {product.images?.length > 1 && (
                    <button
                      onClick={() => handleNextImage(product)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur border border-[#2a2a2a] flex items-center justify-center text-white hover:border-[#FFD000] hover:text-[#FFD000] transition"
                    >
                      →
                    </button>
                  )}

                  {/* DOTS */}
                  {product.images?.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                      {product.images.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-2 rounded-full transition-all ${
                            (currentImages[product._id] || 0) === idx
                              ? 'w-6 bg-[#FFD000]'
                              : 'w-2 bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* PRICE */}
                  <div className="absolute top-4 left-4 bg-[#0d0d0d]/90 border border-[#2a2a2a] backdrop-blur px-4 py-2 rounded-xl">
                    <p className="text-[#FFD000] text-sm font-bold">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-5">

                  {/* TITLE */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold">
                        {product.title}
                      </h3>
                    </div>

                    <button className="w-10 h-10 rounded-full border border-[#2a2a2a] flex items-center justify-center hover:border-[#FFD000] hover:text-[#FFD000] transition">
                      ♥
                    </button>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="mt-4 text-sm text-[#8d8d8d] leading-relaxed line-clamp-2">
                    {product.description}
                  </p>

                  {/* BUTTONS */}
                  <div className="mt-6 flex items-center gap-3">
                    
                    <button className="flex-1 h-12 rounded-2xl bg-[#FFD000] text-black text-sm font-bold hover:opacity-90 transition">
                      Add to Cart
                    </button>

                    <button className="h-12 px-5 rounded-2xl border border-[#2a2a2a] text-sm hover:border-[#FFD000] hover:text-[#FFD000] transition">
                      View
                    </button>
                  </div>

                  {/* FOOTER */}
                  <div className="mt-5 pt-5 border-t border-[#1a1a1a] flex items-center justify-between">

                    <p className="text-[11px] uppercase tracking-wider text-[#666]">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </p>

                    <div className="flex items-center gap-2">
                      {product.images?.slice(0, 3).map((img) => (
                        <img
                          key={img._id}
                          src={img.url}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover border border-[#2a2a2a]"
                        />
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            ))}

          </div>
        )}
      </section>
    </div>
  );
};

export default ProductsDashboard;