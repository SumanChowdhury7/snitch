import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';
import {useWishlist} from "../../wishlist/hook/useWishlist.js";

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
  const { handleAddToWishlist } = useWishlist();
  const navigate = useNavigate();

  const { allProducts = [], loading } = useSelector(
    (state) => state.product
  );

  const [search, setSearch] = useState('');
  const [currentImages, setCurrentImages] = useState({});

  const handleWishlistClick = async (event, product) => {
    event.stopPropagation();

    const variantId = product?.variants?.[0]?._id;

    await handleAddToWishlist({
      productId: product._id,
      variantId,
    });
  };

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  // FILTER
  const filteredProducts = allProducts.filter((product) =>
    product.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // PRICE FORMAT
  const formatPrice = (price) => {
    const symbol =
      currencySymbols[price?.currency] || '₹';

    return `${symbol}${Number(
      price?.amount || 0
    ).toLocaleString('en-IN')}`;
  };

  // PREV IMAGE
  const handlePrevImage = (product) => {
    setCurrentImages((prev) => ({
      ...prev,
      [product._id]:
        (prev[product._id] || 0) === 0
          ? product.images.length - 1
          : (prev[product._id] || 0) - 1,
    }));
  };

  // NEXT IMAGE
  const handleNextImage = (product) => {
    setCurrentImages((prev) => ({
      ...prev,
      [product._id]:
        (prev[product._id] || 0) ===
        product.images.length - 1
          ? 0
          : (prev[product._id] || 0) + 1,
    }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">


      {/* HERO */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-10 pt-10 pb-8">

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

          {/* LEFT */}
          <div className="max-w-[650px]">

            <p className="text-[#FFD000] text-xs uppercase tracking-[0.3em] font-semibold">
              New Collection
            </p>

            <h1 className="mt-4 text-4xl md:text-5xl font-black leading-[1]">
              Modern Fashion
            </h1>

            <p className="mt-5 text-[#7d7d7d] leading-[1.9] text-sm md:text-base">
              Minimal essentials crafted for contemporary
              streetwear and luxury fashion lovers.
            </p>

          </div>

          {/* SEARCH */}
          <div className="w-full lg:w-[380px]">

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full h-14 rounded-2xl bg-[#111111] border border-[#1b1b1b] px-5 text-sm outline-none focus:border-[#FFD000] transition-all duration-300"
            />

          </div>

        </div>

      </section>

      {/* PRODUCTS */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-10 pb-20">

        {/* TOP */}
        <div className="flex items-center justify-between mb-8">

          <h2 className="text-2xl font-bold">
            Products
          </h2>

          <p className="text-sm text-[#666]">
            {filteredProducts.length} Items
          </p>

        </div>

        {/* LOADING */}
        {loading ? (

          <div className="h-[400px] flex items-center justify-center">

            <div className="w-10 h-10 rounded-full border-2 border-[#222] border-t-[#FFD000] animate-spin" />

          </div>

        ) : filteredProducts.length === 0 ? (

          <div className="h-[350px] rounded-[32px] border border-[#181818] bg-[#101010] flex flex-col items-center justify-center text-center">

            <h3 className="text-3xl font-bold">
              No Products Found
            </h3>

            <p className="mt-3 text-sm text-[#777]">
              Try searching another keyword.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">

            {filteredProducts.map((product) => (

              <div
                key={product._id}
                onClick={() =>
                  navigate(`/product/${product._id}`)
                }
                className="group cursor-pointer"
              >

                {/* CARD */}
                <div className="rounded-[28px] border border-[#181818] bg-[#101010] overflow-hidden hover:border-[#2c2c2c] transition-all duration-300">

                  {/* IMAGE */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#151515]">

                    {/* IMAGE SLIDER */}
                    <div
                      className="flex h-full w-full transition-transform duration-500"
                      style={{
                        transform: `translateX(-${
                          (currentImages[product._id] || 0) *
                          100
                        }%)`,
                      }}
                    >

                      {product.images?.map((img) => (
                        <img
                          key={img._id}
                          src={img.url}
                          alt={product.title}
                          className="min-w-full h-full object-cover flex-shrink-0 group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      ))}

                    </div>

                    {/* PRICE */}
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xl border border-[#2a2a2a] px-3 py-1.5 rounded-xl">

                      <p className="text-[#FFD000] text-xs font-semibold">
                        {formatPrice(product.price)}
                      </p>

                    </div>

                    {/* PREV */}
                    {product.images?.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevImage(product);
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 backdrop-blur-xl border border-[#2a2a2a] flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 hover:border-[#FFD000] hover:text-[#FFD000] transition-all duration-300"
                      >
                        ←
                      </button>
                    )}

                    {/* NEXT */}
                    {product.images?.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextImage(product);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 backdrop-blur-xl border border-[#2a2a2a] flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 hover:border-[#FFD000] hover:text-[#FFD000] transition-all duration-300"
                      >
                        →
                      </button>
                    )}

                  </div>

                  {/* CONTENT */}
                  <div className="p-4">

                    {/* TITLE + HEART */}
                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <h3 className="text-[15px] md:text-base font-semibold leading-snug line-clamp-1">
                          {product.title}
                        </h3>

                        <p className="mt-1 text-xs text-[#666] uppercase tracking-[0.2em]">
                          Premium Fashion
                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleWishlistClick(e, product)}
                        className="w-9 h-9 rounded-full border border-[#242424] flex items-center justify-center text-sm hover:border-[#FFD000] hover:text-[#FFD000] transition-all duration-300"
                      >
                        ♥
                      </button>

                    </div>

                    {/* DESCRIPTION */}
                    <p className="mt-4 text-sm text-[#8b8b8b] leading-relaxed line-clamp-2">
                      {product.description}
                    </p>

                    {/* FOOTER */}
                    <div className="mt-5 flex items-center justify-between">

                      {/* DOTS */}
                      {product.images?.length > 1 ? (
                        <div className="flex items-center gap-1.5">

                          {product.images.map((_, idx) => (
                            <div
                              key={idx}
                              className={`rounded-full transition-all duration-300 ${
                                (currentImages[
                                  product._id
                                ] || 0) === idx
                                  ? 'w-5 h-1.5 bg-[#FFD000]'
                                  : 'w-1.5 h-1.5 bg-[#555]'
                              }`}
                            />
                          ))}

                        </div>
                      ) : (
                        <div />
                      )}

                      {/* BUTTON */}
                      <button className="h-10 px-4 rounded-xl bg-[#FFD000] text-black text-xs font-bold hover:opacity-90 transition-all duration-300">
                        View
                      </button>

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