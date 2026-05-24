import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { useProduct } from '../hook/useProduct';

const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
};

const ProductDetail = () => {
  const { ProductId } = useParams();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  const { handleGetProductDetails } = useProduct();

  async function fetchProductDetails() {
    try {
      const data = await handleGetProductDetails(ProductId);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  }

  useEffect(() => {
    fetchProductDetails();
  }, [ProductId]);

  const formatPrice = (price) => {
    const symbol =
      currencySymbols[price?.currency] || '₹';

    return `${symbol}${Number(
      price?.amount || 0
    ).toLocaleString('en-IN')}`;
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#2a2a2a] border-t-[#FFD000] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-[#1a1a1a] bg-[#0a0a0a]/90 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto h-16 px-6 lg:px-10 flex items-center justify-between">

          <Link
            to="/"
            className="text-[22px] font-black tracking-[0.35em]"
          >
            SNITCH
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm text-[#8d8d8d] hover:text-[#FFD000] transition"
            >
              Home
            </Link>

            <Link
              to="/wishlist"
              className="text-sm text-[#8d8d8d] hover:text-[#FFD000] transition"
            >
              Wishlist
            </Link>

            <Link
              to="/cart"
              className="text-sm text-[#8d8d8d] hover:text-[#FFD000] transition"
            >
              Cart
            </Link>
          </div>

        </div>
      </header>

      {/* MAIN SECTION */}
      <section className="max-w-[1500px] mx-auto px-6 lg:px-10 pt-5 pb-10">

        {/* BACK */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[#7d7d7d] hover:text-[#FFD000] transition mb-6"
        >
          ← Back To Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-14 xl:gap-24">

          {/* LEFT SIDE */}
          <div className="flex gap-5 items-start">

            {/* THUMBNAILS */}
            <div className="flex flex-col gap-4">

              {product.images?.map((img, idx) => (
                <button
                  key={img._id}
                  onClick={() => setActiveImage(idx)}
                  className={`w-[90px] h-[110px] rounded-2xl overflow-hidden border transition-all duration-300 flex-shrink-0 ${
                    activeImage === idx
                      ? 'border-[#FFD000]'
                      : 'border-[#1f1f1f]'
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}

            </div>

            {/* MAIN IMAGE */}
            <div className="relative flex-1 overflow-hidden rounded-[34px] border border-[#1c1c1c] bg-[#111111] group">

              <img
                src={product.images?.[activeImage]?.url}
                alt={product.title}
                className="w-full h-[420px] md:h-[520px] xl:h-[580px] object-cover"
              />

              {/* PREV BUTTON */}
              {product.images?.length > 1 && (
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === 0
                        ? product.images.length - 1
                        : prev - 1
                    )
                  }
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 backdrop-blur-xl border border-[#2a2a2a] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:border-[#FFD000] hover:text-[#FFD000] transition-all duration-300"
                >
                  ←
                </button>
              )}

              {/* NEXT BUTTON */}
              {product.images?.length > 1 && (
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === product.images.length - 1
                        ? 0
                        : prev + 1
                    )
                  }
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 backdrop-blur-xl border border-[#2a2a2a] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:border-[#FFD000] hover:text-[#FFD000] transition-all duration-300"
                >
                  →
                </button>
              )}

              {/* PRICE TAG */}
              <div className="absolute top-5 left-5 bg-black/70 backdrop-blur-xl border border-[#2a2a2a] rounded-2xl px-5 py-3">
                <p className="text-[#FFD000] font-bold text-lg">
                  {formatPrice(product.price)}
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="lg:pt-6">

            {/* CATEGORY */}
            <p className="uppercase tracking-[0.35em] text-xs font-semibold text-[#FFD000]">
              Premium Collection
            </p>

            {/* TITLE */}
            <h1 className="mt-5 text-4xl md:text-5xl xl:text-6xl font-black leading-[1]">
              {product.title}
            </h1>

            {/* DESCRIPTION */}
            <p className="mt-8 text-[#8b8b8b] text-[15px] md:text-base leading-[1.9] max-w-[650px]">
              {product.description}
            </p>

            {/* DIVIDER */}
            <div className="mt-10 border-t border-[#1a1a1a]" />

            {/* SIZE */}
            <div className="mt-10">

              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm uppercase tracking-[0.2em] text-[#777]">
                  Select Size
                </h3>

                <button className="text-sm text-[#8d8d8d] hover:text-[#FFD000] transition">
                  Size Guide
                </button>
              </div>

              <div className="flex flex-wrap gap-4">

                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    className="w-16 h-16 rounded-2xl border border-[#1f1f1f] bg-[#111111] hover:border-[#FFD000] hover:text-[#FFD000] transition-all duration-300"
                  >
                    {size}
                  </button>
                ))}

              </div>

            </div>

            {/* BUTTONS */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4">

              <button className="flex-1 h-14 rounded-2xl bg-[#FFD000] text-black font-bold hover:opacity-90 transition-all duration-300">
                Add To Cart
              </button>

              <button className="h-14 px-8 rounded-2xl border border-[#2a2a2a] hover:border-[#FFD000] hover:text-[#FFD000] transition-all duration-300">
                ♥ Wishlist
              </button>

            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-14">

              <div className="rounded-[28px] border border-[#1f1f1f] bg-[#111111] p-6">
                <p className="text-2xl">🚚</p>

                <h4 className="mt-5 font-semibold">
                  Fast Delivery
                </h4>

                <p className="mt-2 text-sm text-[#777] leading-relaxed">
                  Delivery within 3-5 working days.
                </p>
              </div>

              <div className="rounded-[28px] border border-[#1f1f1f] bg-[#111111] p-6">
                <p className="text-2xl">🔒</p>

                <h4 className="mt-5 font-semibold">
                  Secure Payment
                </h4>

                <p className="mt-2 text-sm text-[#777] leading-relaxed">
                  Encrypted and safe checkout process.
                </p>
              </div>

              <div className="rounded-[28px] border border-[#1f1f1f] bg-[#111111] p-6">
                <p className="text-2xl">↩</p>

                <h4 className="mt-5 font-semibold">
                  Easy Returns
                </h4>

                <p className="mt-2 text-sm text-[#777] leading-relaxed">
                  Hassle free replacement available.
                </p>
              </div>

            </div>

            {/* PRODUCT META */}
            <div className="mt-14 rounded-[32px] border border-[#1f1f1f] bg-[#101010] p-7">

              <h3 className="text-2xl font-bold">
                Product Details
              </h3>

              <div className="mt-7 space-y-6">

                <div className="flex items-center justify-between border-b border-[#1b1b1b] pb-5">
                  <span className="text-[#777]">
                    Product ID
                  </span>

                  <span className="font-medium text-sm">
                    {product._id}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#1b1b1b] pb-5">
                  <span className="text-[#777]">
                    Uploaded
                  </span>

                  <span className="font-medium text-sm">
                    {new Date(
                      product.createdAt
                    ).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#777]">
                    Images
                  </span>

                  <span className="font-medium text-sm">
                    {product.images?.length}
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>
    </div>
  );
};

export default ProductDetail;