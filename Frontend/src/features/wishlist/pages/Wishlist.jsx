import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useWishlist } from '../hook/useWishlist.js';
import { useCart } from '../../cart/hook/useCart';
import { Heart, ShoppingCart, Trash2, ArrowRight, X } from 'lucide-react';

const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
};

const Wishlist = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  
  const { wishlist, loading, handleGetWishlist, handleRemoveFromWishlist } = useWishlist();
  const { handleAddItem } = useCart();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [addedItemDetails, setAddedItemDetails] = useState(null);

  useEffect(() => {
    if (user) {
      handleGetWishlist();
    }
  }, [user]);

  const formatPrice = (price) => {
    const symbol = currencySymbols[price?.currency] || '₹';
    return `${symbol}${Number(price?.amount || 0).toLocaleString('en-IN')}`;
  };

  const handleAddToCart = async (item) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const product = item.product;
      const variantId = item.variant;
      
      await handleAddItem({
        productId: product._id,
        variantId: variantId,
      });

      // Find matching variant details
      const matchedVariant = variantId && product.variants?.find(
        (v) => v._id.toString() === variantId.toString()
      );

      // Save for success modal display
      setAddedItemDetails({
        title: product.title,
        price: matchedVariant?.price || product.price,
        image: matchedVariant?.images?.[0]?.url || product.images?.[0]?.url,
        attributes: matchedVariant?.attributes || null,
      });
      
      // Remove from wishlist (move to cart behavior)
      await handleRemoveFromWishlist({
        productId: product._id,
        variantId: variantId,
      });

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to move item to cart:', error);
    }
  };

  const handleRemoveItem = async (item) => {
    try {
      await handleRemoveFromWishlist({
        productId: item.product._id,
        variantId: item.variant,
      });
    } catch (error) {
      console.error('Failed to remove item from wishlist:', error);
    }
  };

  // If user is not logged in, render a luxury login required state
  if (!user) {
    return (
      <div className="min-h-[70vh] bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 bg-[#FFD000]/10 border border-[#FFD000]/20 text-[#FFD000] rounded-full flex items-center justify-center mb-8 animate-scale-in">
          <Heart size={36} className="fill-[#FFD000]" />
        </div>
        <h2 className="text-3xl font-black tracking-widest uppercase mb-4">
          YOUR WISHLIST
        </h2>
        <p className="text-[#8b8b8b] text-[15px] max-w-md leading-relaxed mb-8">
          Login to view your saved items, curate your collections, and purchase your luxury essentials.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-10 h-14 bg-[#FFD000] text-black font-bold rounded-2xl hover:opacity-90 active:scale-95 transition-all duration-300 cursor-pointer text-sm tracking-widest uppercase shadow-lg shadow-[#FFD000]/10"
        >
          LOG IN TO CONTINUE
        </button>
      </div>
    );
  }

  // If loading and wishlist isn't fetched yet, show elegant spinner
  if (loading && !wishlist) {
    return (
      <div className="min-h-[70vh] bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#1f1f1f] border-t-[#FFD000] animate-spin" />
      </div>
    );
  }

  const wishlistItems = wishlist?.items?.filter(item => item && item.product) || [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden pb-24">
      <main className="max-w-[1500px] mx-auto px-6 lg:px-10 pt-8">
        
        {/* Header */}
        <div className="mb-12 border-b border-[#1b1b1b] pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#FFD000]">
              YOUR WISHLIST
            </h1>
            <p className="text-xs text-[#777] uppercase tracking-[0.25em] mt-3">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'ITEM' : 'ITEMS'} STORED
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[#8b8b8b] hover:text-[#FFD000] transition group font-medium"
          >
            Continue Shopping
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Wishlist Items Grid / Empty State */}
        {wishlistItems.length === 0 ? (
          <section className="py-20 flex flex-col items-center text-center max-w-md mx-auto animate-scale-in">
            <div className="w-20 h-20 bg-[#161616] border border-[#2a2a2a] rounded-full flex items-center justify-center mb-8 text-[#8b8b8b]">
              <Heart size={32} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-wider mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-[#777] text-sm leading-relaxed mb-10">
              Explore our latest drops and curate your perfect wardrobe with our premium collection.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-10 h-14 bg-[#FFD000] text-black font-bold rounded-2xl hover:opacity-90 active:scale-95 transition-all duration-300 cursor-pointer text-xs tracking-widest uppercase"
            >
              EXPLORE LATEST DROPS
            </button>
          </section>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistItems.map((item) => {
              const product = item.product;
              const variantId = item.variant;
              
              // Find matching variant details
              const matchedVariant = variantId && product.variants?.find(
                (v) => v._id.toString() === variantId.toString()
              );

              // Extract values with variant fallbacks
              const displayTitle = product.title;
              const displayPrice = matchedVariant?.price || product.price;
              const displayImage = matchedVariant?.images?.[0]?.url || product.images?.[0]?.url || 'https://via.placeholder.com/400x533?text=Product';

              return (
                <div
                  key={item._id}
                  className="group relative flex flex-col bg-[#111111] border border-[#1a1a1a] rounded-[28px] overflow-hidden transition-all duration-300 hover:border-[#2a2a2a] hover:shadow-xl hover:shadow-black/50"
                >
                  {/* Image wrapper */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#151515]">
                    <img
                      alt={displayTitle}
                      src={displayImage}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Remove button */}
                    <button
                      onClick={() => handleRemoveItem(item)}
                      aria-label="Remove item"
                      className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/60 backdrop-blur-md border border-[#2a2a2a] rounded-full flex items-center justify-center text-[#8b8b8b] hover:text-red-400 transition-colors active:scale-90 cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Body content */}
                  <div className="p-6 flex flex-col flex-grow gap-4">
                    <div className="flex justify-between items-start gap-3">
                      <h3 className="font-bold text-[15px] text-white tracking-wide truncate flex-1">
                        {displayTitle}
                      </h3>
                      <span className="font-black text-[#FFD000] text-[15px] shrink-0">
                        {formatPrice(displayPrice)}
                      </span>
                    </div>

                    {/* Variant attributes (e.g., Size, Color) */}
                    {matchedVariant && Object.entries(matchedVariant.attributes || {}).length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(matchedVariant.attributes).map(([key, value]) => (
                          <span
                            key={key}
                            className="text-[10px] uppercase tracking-wider text-[#777] bg-[#1a1a1a] border border-[#222] px-2.5 py-1 rounded-lg"
                          >
                            {key}: <strong className="text-white font-semibold">{value}</strong>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="h-6" /> // Placeholder spacing
                    )}

                    {/* Add to cart button */}
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="mt-auto w-full h-12 bg-[#FFD000] text-black font-bold text-xs tracking-widest rounded-xl hover:opacity-90 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer uppercase"
                    >
                      <ShoppingCart size={14} className="stroke-[2.5]" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </section>
        )}

      </main>

      {/* SUCCESS MODAL (ADDED TO BAG) */}
      {showSuccessModal && addedItemDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setShowSuccessModal(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-[460px] bg-[#101010] border border-[#1f1f1f] rounded-[28px] p-8 text-center shadow-2xl z-10 animate-scale-in">
            
            {/* Close Button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-6 right-6 text-[#7d7d7d] hover:text-white transition duration-300 cursor-pointer"
            >
              <X size={18} />
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
              This item has been successfully moved to your shopping cart.
            </p>

            {/* Item details card */}
            <div className="mt-8 flex items-center gap-5 p-4 rounded-2xl bg-[#151515] border border-[#222222] text-left">
              <div className="w-[60px] aspect-[3/4] rounded-xl overflow-hidden bg-[#1f1f1f] border border-[#2a2a2a] flex-shrink-0">
                <img
                  src={addedItemDetails.image}
                  alt={addedItemDetails.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-white tracking-wide truncate">
                  {addedItemDetails.title}
                </h4>
                
                {/* Attributes */}
                {addedItemDetails.attributes && Object.entries(addedItemDetails.attributes).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {Object.entries(addedItemDetails.attributes).map(([key, value]) => (
                      <span key={key} className="text-[9px] uppercase tracking-wider text-[#888] bg-black/40 border border-[#222] px-2 py-0.5 rounded-md">
                        {key}: <strong className="text-white font-semibold">{value}</strong>
                      </span>
                    ))}
                  </div>
                )}
                
                <p className="mt-2 text-[#FFD000] font-bold text-sm">
                  {formatPrice(addedItemDetails.price)}
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
    </div>
  );
};

export default Wishlist;