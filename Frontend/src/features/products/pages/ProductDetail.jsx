import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';
import { useCart } from '../../cart/hook/useCart';
import { useWishlist } from '../../wishlist/hook/useWishlist.js';

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
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  const [selectedVariant, setSelectedVariant] =
    useState(null);

  const [selectedAttributes, setSelectedAttributes] =
    useState({});

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { handleGetProductDetails } = useProduct();
  const { handleAddItem } = useCart();
  const { wishlist, handleAddToWishlist, handleGetWishlist, handleRemoveFromWishlist } = useWishlist();

  const isInWishlist = () => {
    return wishlist?.items?.some(
      (item) =>
        item.product?._id?.toString() === product?._id?.toString() ||
        item.product?.toString() === product?._id?.toString()
    );
  };

  const handleWishlistClick = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    try {
      const inWishlist = isInWishlist();
      const itemInWishlist = wishlist?.items?.find(
        (item) =>
          item.product?._id?.toString() === product._id.toString() ||
          item.product?.toString() === product._id.toString()
      );

      if (inWishlist) {
        await handleRemoveFromWishlist({
          productId: product._id,
          variantId: itemInWishlist?.variant,
        });
      } else {
        await handleAddToWishlist({
          productId: product._id,
          variantId: selectedVariant?._id,
        });
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    try {
      await handleAddItem({
        productId: product._id,
        variantId: selectedVariant?._id,
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };
  async function fetchProductDetails() {
    try {
      const data = await handleGetProductDetails(
        ProductId
      );

      setProduct(data);
    } catch (error) {
      console.error(
        'Error fetching product details:',
        error
      );
    }
  }

  useEffect(() => {
    fetchProductDetails();
  }, [ProductId]);

  useEffect(() => {
    if (user) {
      handleGetWishlist();
    }
  }, [user]);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);

      setSelectedAttributes(
        product.variants[0].attributes || {}
      );
    }
  }, [product]);

  const formatPrice = (price) => {
    const symbol =
      currencySymbols[price?.currency] || '₹';

    return `${symbol}${Number(
      price?.amount || 0
    ).toLocaleString('en-IN')}`;
  };

  const currentData = selectedVariant || product;

  const displayImages =
    currentData?.images?.length > 0
      ? currentData.images
      : product?.images || [];

  const displayPrice =
    currentData?.price?.amount
      ? currentData.price
      : product?.price;

  const displayTitle =
    currentData?.title || product?.title;

  const displayDescription =
    currentData?.description ||
    product?.description;

  const allAttributes = {};

  product?.variants?.forEach((variant) => {
    Object.entries(
      variant.attributes || {}
    ).forEach(([key, value]) => {
      if (!allAttributes[key]) {
        allAttributes[key] = new Set();
      }

      allAttributes[key].add(value);
    });
  });

  const handleSelectAttribute = (
    attributeKey,
    attributeValue
  ) => {
    const updatedAttributes = {
      ...selectedAttributes,
      [attributeKey]: attributeValue,
    };

    setSelectedAttributes(updatedAttributes);

    const matchedVariant =
      product?.variants?.find((variant) => {
        return Object.entries(
          updatedAttributes
        ).every(
          ([key, value]) =>
            variant.attributes?.[key] === value
        );
      });

    if (matchedVariant) {
      setSelectedVariant(matchedVariant);
      setActiveImage(0);
    }
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

              {displayImages?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-[90px] h-[110px] rounded-2xl overflow-hidden border transition-all duration-300 flex-shrink-0 cursor-pointer ${
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
                src={
                  displayImages?.[activeImage]?.url
                }
                alt={displayTitle}
                className="w-full h-[420px] md:h-[520px] xl:h-[580px] object-cover"
              />

              {/* PREV BUTTON */}
              {displayImages?.length > 1 && (
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === 0
                        ? displayImages.length - 1
                        : prev - 1
                    )
                  }
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 backdrop-blur-xl border border-[#2a2a2a] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:border-[#FFD000] hover:text-[#FFD000] transition-all duration-300 cursor-pointer"
                >
                  ←
                </button>
              )}

              {/* NEXT BUTTON */}
              {displayImages?.length > 1 && (
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev ===
                      displayImages.length - 1
                        ? 0
                        : prev + 1
                    )
                  }
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 backdrop-blur-xl border border-[#2a2a2a] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:border-[#FFD000] hover:text-[#FFD000] transition-all duration-300 cursor-pointer"
                >
                  →
                </button>
              )}

              {/* PRICE TAG */}
              <div className="absolute top-5 left-5 bg-black/70 backdrop-blur-xl border border-[#2a2a2a] rounded-2xl px-5 py-3">
                <p className="text-[#FFD000] font-bold text-lg">
                  {formatPrice(displayPrice)}
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
              {displayTitle}
            </h1>

            {/* DESCRIPTION */}
            <p className="mt-8 text-[#8b8b8b] text-[15px] md:text-base leading-[1.9] max-w-[650px]">
              {displayDescription}
            </p>

            {/* DIVIDER */}
            <div className="mt-10 border-t border-[#1a1a1a]" />

            {/* VARIANT ATTRIBUTES */}
            <div className="mt-10 space-y-8">

              {Object.entries(allAttributes).map(
                ([attributeKey, values]) => (
                  <div key={attributeKey}>

                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-sm uppercase tracking-[0.2em] text-[#777]">
                        Select {attributeKey}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-4">

                      {[...values].map((value) => {
                        const isActive =
                          selectedAttributes?.[
                            attributeKey
                          ] === value;

                        return (
                          <button
                            key={value}
                            onClick={() =>
                              handleSelectAttribute(
                                attributeKey,
                                value
                              )
                            }
                            className={`px-6 h-14 rounded-2xl border transition-all duration-300 capitalize cursor-pointer ${
                              isActive
                                ? 'border-[#FFD000] bg-[#FFD000] text-black'
                                : 'border-[#1f1f1f] bg-[#111111] hover:border-[#FFD000] hover:text-[#FFD000]'
                            }`}
                          >
                            {value}
                          </button>
                        );
                      })}

                    </div>

                  </div>
                )
              )}

            </div>

            {/* SELECTED VARIANT INFO */}
            {selectedVariant && (
              <div className="mt-10 rounded-[28px] border border-[#1f1f1f] bg-[#111111] p-6">

                <div className="flex items-center justify-between flex-wrap gap-4">

                  <div>
                    <p className="text-[#777] text-sm">
                      Selected Variant
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">

                      {Object.entries(
                        selectedVariant.attributes || {}
                      ).map(([key, value]) => (
                        <div
                          key={key}
                          className="px-4 py-2 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-sm capitalize"
                        >
                          {key}: {value}
                        </div>
                      ))}

                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[#777] text-sm">
                      Available Stock
                    </p>

                    <h3 className="text-3xl font-black text-[#FFD000] mt-1">
                      {selectedVariant.stock || 0}
                    </h3>
                  </div>

                </div>

              </div>
            )}

            {/* BUTTONS */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4">

              <button
              onClick={handleAddToCart}
              className="flex-1 h-14 rounded-2xl bg-[#FFD000] text-black font-bold hover:opacity-90 transition-all duration-300 cursor-pointer">
                Add To Cart
              </button>

              <button
                onClick={handleWishlistClick}
                className={`h-14 px-8 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
                  isInWishlist()
                    ? 'border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/20'
                    : 'border-[#2a2a2a] hover:border-[#FFD000] hover:text-[#FFD000]'
                }`}
              >
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
                    {displayImages?.length}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => setShowSuccessModal(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-[460px] bg-[#101010] border border-[#1f1f1f] rounded-[28px] p-8 text-center shadow-2xl z-10 transition-all duration-300 scale-100">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-6 right-6 text-[#7d7d7d] hover:text-white transition duration-300 cursor-pointer text-lg"
            >
              ✕
            </button>

            {/* Checkmark Icon */}
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-[#FFD000] rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
              ✓
            </div>

            {/* Title */}
            <h2 className="text-2xl font-black tracking-widest uppercase">
              ADDED TO BAG
            </h2>
            <p className="text-xs text-[#7d7d7d] tracking-wider mt-2">
              This item is now saved in your premium shopping selection.
            </p>

            {/* Item details card */}
            <div className="mt-8 flex items-center gap-5 p-4 rounded-2xl bg-[#151515] border border-[#222222] text-left">
              <div className="w-[60px] aspect-[3/4] rounded-xl overflow-hidden bg-[#1f1f1f] border border-[#2a2a2a] flex-shrink-0">
                <img 
                  src={displayImages?.[activeImage]?.url} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-white tracking-wide truncate">
                  {displayTitle}
                </h4>
                
                {/* Attributes */}
                {selectedVariant && Object.entries(selectedVariant.attributes || {}).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {Object.entries(selectedVariant.attributes || {}).map(([key, value]) => (
                      <span key={key} className="text-[9px] uppercase tracking-wider text-[#888] bg-black/40 border border-[#222] px-2 py-0.5 rounded-md">
                        {key}: <strong className="text-white font-semibold">{value}</strong>
                      </span>
                    ))}
                  </div>
                )}
                
                <p className="mt-2 text-[#FFD000] font-bold text-sm">
                  {formatPrice(displayPrice)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/cart');
                }}
                className="w-full h-14 rounded-2xl bg-[#FFD000] text-black font-black text-xs tracking-widest hover:opacity-90 transition-all duration-300 cursor-pointer flex items-center justify-center"
              >
                VIEW BAG & CHECKOUT
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full h-14 rounded-2xl border border-[#222222] hover:border-white text-xs font-bold tracking-widest transition-all duration-300 cursor-pointer text-[#8d8d8d] hover:text-white uppercase"
              >
                CONTINUE SHOPPING
              </button>
            </div>

          </div>
        </div>
      )}

      {/* LOGIN REQUIRED MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => setShowLoginModal(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-[420px] bg-[#101010] border border-[#1f1f1f] rounded-[28px] p-8 text-center shadow-2xl z-10 transition-all duration-300 scale-100">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-6 right-6 text-[#7d7d7d] hover:text-white transition duration-300 cursor-pointer text-lg"
            >
              ✕
            </button>

            {/* Lock Icon */}
            <div className="w-16 h-16 bg-[#FFD000]/10 border border-[#FFD000]/20 text-[#FFD000] rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
              🔑
            </div>

            {/* Title */}
            <h2 className="text-xl font-black tracking-widest uppercase">
              LOGIN REQUIRED
            </h2>
            <p className="text-xs text-[#7d7d7d] tracking-wider mt-2.5 leading-relaxed">
              Please login to access your shopping bag and add luxury pieces to your cart.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  navigate('/login');
                }}
                className="w-full h-14 rounded-2xl bg-[#FFD000] text-black font-black text-xs tracking-widest hover:opacity-90 transition-all duration-300 cursor-pointer flex items-center justify-center"
              >
                LOG IN TO CONTINUE
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full h-14 rounded-2xl border border-[#222222] hover:border-white text-xs font-bold tracking-widest transition-all duration-300 cursor-pointer text-[#8d8d8d] hover:text-white uppercase"
              >
                BACK TO SHOP
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;