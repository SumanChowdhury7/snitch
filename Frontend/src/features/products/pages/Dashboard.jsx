import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";
import EditProduct from "./EditProduct";

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CNY", "INR"];
const MAX_IMAGES = 7;

const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  INR: "₹",
};

const inputCls =
  "w-full bg-[#181818]/90 border border-[#2d2d2d] rounded-2xl px-4 py-3 text-[#f5f1e8] placeholder-[#666] " +
  "focus:border-[#FFD700] focus:ring-4 focus:ring-[#FFD700]/10 outline-none transition-all duration-300 text-sm";

const labelCls =
  "block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d0c6ab] mb-2";

const glassStyle = {
  background:
    "linear-gradient(180deg, rgba(22,22,22,0.92) 0%, rgba(14,14,14,0.95) 100%)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow:
    "0 10px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03)",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { handleGetSellerProducts, handleUpdateProduct, handleDeleteProduct } =
    useProduct();
  const { sellerProducts = [], loading } = useSelector(
    (state) => state.product,
  );
  const { user } = useSelector((state) => state.auth);

  // Modal and Interactive States
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });
  const [editExistingImages, setEditExistingImages] = useState([]);
  const [editNewImages, setEditNewImages] = useState([]);

  useEffect(() => {
    handleGetSellerProducts();
  }, []);

  // Format Currency Utility
  const formatPrice = (priceObj) => {
    if (!priceObj) return "₹0.00";
    const symbol = currencySymbols[priceObj.currency] || "₹";
    const amount = Number(priceObj.amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${symbol} ${amount}`;
  };

  // Open Edit Modal
  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditFormData({
      title: product.title,
      description: product.description,
      priceAmount: product.price?.amount || "",
      priceCurrency: product.price?.currency || "INR",
    });
    setEditExistingImages(product.images || []);
    setEditNewImages([]);
  };

  // Confirm Product Deletion
  const confirmDelete = async () => {
    if (!deletingProduct) return;
    const result = await handleDeleteProduct(deletingProduct._id);
    if (result) {
      alert("Listing removed successfully!");
      setDeletingProduct(null);
    } else {
      alert("Failed to delete listing. Please try again.");
    }
  };

  // Aggregate Stats
  const totalValue = sellerProducts.reduce(
    (sum, p) => sum + (p.price?.amount || 0),
    0,
  );
  const atMaxImages =
    editExistingImages.length + editNewImages.length >= MAX_IMAGES;

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#f5f1e8] font-sans relative overflow-x-hidden pb-16">
      {/* Background Ambient Glow */}
      <div className="absolute top-[-150px] left-[-150px] w-[350px] h-[350px] bg-[#FFD700]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-100px] w-[350px] h-[350px] bg-[#FFD700]/5 blur-[130px] rounded-full pointer-events-none" />

      {/* Top Brand Tracker Line */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-[#1f1f1f] z-[200]">
        <div className="h-full w-[80%] bg-[#FFD700] shadow-[0_0_15px_#FFD700] transition-all duration-700" />
      </div>


      {/* MAIN CONTAINER */}
      <main className="max-w-[1500px] mx-auto px-6 md:px-10 mt-10 relative z-10">
        {/* HERO TITLE HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-white/[0.04]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FFD700]/20 bg-[#FFD700]/5 text-[#FFD700] text-[10px] font-semibold tracking-[0.2em] uppercase mb-4">
              Overview
            </div>
            <h2 className="text-[36px] sm:text-[46px] font-black tracking-tight text-white leading-none">
              Seller Dashboard
            </h2>
            <p className="mt-2.5 text-[14px] text-[#9f988c] max-w-[500px]">
              Manage and showcase your high-fashion collection. Upload designs,
              update listings, and track your boutique stats.
            </p>
          </div>
        </div>

        {/* HERO STATS OVERVIEW BAR */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Stat 1: Total Listings */}
          <div
            style={glassStyle}
            className="rounded-[24px] p-6 hover:border-[#FFD700]/20 transition-all duration-300 group"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d0c6ab]">
              Showcase Listings
            </p>
            <div className="flex items-baseline justify-between mt-3">
              <span className="text-[42px] font-black text-white leading-none">
                {sellerProducts.length}
              </span>
              <span className="text-[12px] text-[#FFD700] bg-[#FFD700]/10 px-3 py-1 rounded-full border border-[#FFD700]/10 font-bold uppercase tracking-wider">
                Active
              </span>
            </div>
            <p className="mt-3 text-[12px] text-[#7a7367]">
              Total custom fashion pieces listed online
            </p>
          </div>

          {/* Stat 2: Total Inventory Value */}
          <div
            style={glassStyle}
            className="rounded-[24px] p-6 hover:border-[#FFD700]/20 transition-all duration-300 group"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d0c6ab]">
              Boutique Valuation
            </p>
            <div className="flex items-baseline justify-between mt-3">
              <span className="text-[34px] font-black text-white leading-none">
                {currencySymbols.INR} {totalValue.toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] text-[#c8bea5] font-semibold uppercase tracking-widest">
                INR
              </span>
            </div>
            <p className="mt-4.5 text-[12px] text-[#7a7367]">
              Aggregate value of all active product listings
            </p>
          </div>

          {/* Stat 3: Boutique Status */}
          <div
            style={glassStyle}
            className="rounded-[24px] p-6 hover:border-[#FFD700]/20 transition-all duration-300 sm:col-span-2 lg:col-span-1 group"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d0c6ab]">
              Studio Showcase Status
            </p>
            <div className="flex items-center gap-3.5 mt-4">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
              <span className="text-[18px] font-bold text-emerald-400 uppercase tracking-widest">
                Showcase Live
              </span>
            </div>
            <p className="mt-5.5 text-[12px] text-[#7a7367]">
              Your Snitch Creator shopfront is fully discoverable by buyers
            </p>
          </div>
        </section>

        {/* PRODUCTS SECTION CONTAINER */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[20px] font-bold tracking-wide text-white">
              Your Collection
            </h3>
            <span className="text-[12px] text-[#c8bea5] font-semibold tracking-wider bg-white/[0.04] px-4.5 py-1.5 rounded-full border border-white/[0.06]">
              {sellerProducts.length} Items Listed
            </span>
          </div>

          {/* LOADING STATE */}
          {loading && sellerProducts.length === 0 ? (
            <div className="h-[350px] rounded-[30px] border border-white/[0.06] bg-white/[0.01] flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 border-2 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin mb-4" />
              <p className="text-[13px] text-[#9f988c] uppercase tracking-[0.2em]">
                Synchronizing Showcase...
              </p>
            </div>
          ) : sellerProducts.length === 0 ? (
            /* GORGEOUS EMPTY STATE */
            <div
              style={glassStyle}
              className="rounded-[30px] py-16 px-8 text-center flex flex-col items-center justify-center max-w-[700px] mx-auto mt-6 group hover:border-[#FFD700]/20 transition-all duration-500"
            >
              <div className="w-20 h-20 rounded-3xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-[#666] mb-6 group-hover:text-[#FFD700] group-hover:border-[#FFD700]/20 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h4 className="text-[22px] font-bold text-white tracking-wide">
                No Listings Found
              </h4>
              <p className="mt-2.5 text-[14px] text-[#9f988c] max-w-[360px] mx-auto leading-relaxed">
                Your portfolio is currently blank. Take your place in our
                premium designer marketplace by listing your first apparel
                masterpiece.
              </p>
              <Link
                to="/seller/create-product"
                className="mt-8 rounded-full bg-[#FFD700] px-8 py-3.5 text-[12px] font-bold uppercase tracking-[0.18em] text-[#2d2400] shadow-[0_10px_30px_rgba(255,215,0,0.18)] hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Publish First Listing
              </Link>
            </div>
          ) : (
            /* PRODUCTS SHOWCASE GRID */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sellerProducts.map((product) => {
                const coverImg =
                  product.images && product.images[0]
                    ? product.images[0].url
                    : "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop";

                return (
                  <div
                    
                    key={product._id}
                    style={glassStyle}
                    className="rounded-[28px] overflow-hidden group hover:border-[#FFD700]/30 transition-all duration-500 flex flex-col h-full hover:shadow-[0_15px_35px_rgba(0,0,0,0.55)] relative"
                  >
                    {/* Product Image Frame */}
                    <div className="aspect-[3/4] relative overflow-hidden bg-[#141414] border-b border-white/[0.04]">
                      <img
                        src={coverImg}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-[600ms]"
                        loading="lazy"
                      />

                      {/* Price Badge */}
                      <div className="absolute bottom-4 left-4 rounded-xl bg-black/75 backdrop-blur-md px-3.5 py-2 border border-white/[0.08] text-[13px] font-black text-[#FFD700] tracking-wide shadow-lg">
                        {formatPrice(product.price)}
                      </div>

                      {/* Studio Creator Accent Tag */}
                      <div className="absolute top-4 left-4 rounded-md bg-white/[0.04] backdrop-blur-md px-2.5 py-1 border border-white/[0.08] text-[8px] font-semibold text-[#c8bea5] uppercase tracking-[0.2em]">
                        Designer Piece
                      </div>
                    </div>

                    {/* Product Content Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 
                        onClick={() => {
                      navigate(`/seller/product/${product?._id || ""}`);
                    }}
                        className="text-[17px] cursor-pointer font-extrabold text-white tracking-wide truncate group-hover:text-[#FFD700] transition-colors duration-300">
                          {product.title}
                        </h4>

                        <p className="mt-2 text-[12.5px] leading-relaxed text-[#9b9487] line-clamp-3">
                          {product.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4.5 border-t border-white/[0.04] flex items-center justify-between">
                        {/* Creation Date */}
                        <div className="text-[10px] uppercase tracking-wider text-[#666]">
                          Listed:{" "}
                          {new Date(product.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </div>

                        {/* EDIT AND DELETE ACTIONS */}
                        <div className="flex items-center gap-2">
                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => openEditModal(product)}
                            className="w-8.5 h-8.5 rounded-full border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-[#c8bea5] hover:text-[#FFD700] hover:border-[#FFD700]/30 hover:bg-[#FFD700]/5 transition-all duration-300"
                            title="Edit Product Details"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.8}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setDeletingProduct(product)}
                            className="w-8.5 h-8.5 rounded-full border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-[#c8bea5] hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-300"
                            title="Remove Product Listing"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.8}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* ============================================================== */}
      {/* 1. EDIT PRODUCT GLASS MODAL */}
      {/* ============================================================== */}
      <EditProduct
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        editExistingImages={editExistingImages}
        setEditExistingImages={setEditExistingImages}
        editNewImages={editNewImages}
        setEditNewImages={setEditNewImages}
        handleUpdateProduct={handleUpdateProduct}
        loading={loading}
      />

      {/* ============================================================== */}
      {/* 2. DELETE CONFIRMATION GLASS MODAL */}
      {/* ============================================================== */}
      {deletingProduct && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div
            style={glassStyle}
            className="w-full max-w-[500px] rounded-[28px] overflow-hidden p-6 md:p-8 relative shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-red-500/20"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500" />

            {/* Warning Icon Banner */}
            <div className="w-12 h-12 rounded-2xl border border-red-500/25 bg-red-500/5 flex items-center justify-center text-red-400 mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h3 className="text-[20px] font-black text-white tracking-wide leading-tight">
              Remove Product Showcase?
            </h3>

            <p className="mt-3 text-[14px] leading-relaxed text-[#9b9487]">
              Are you sure you want to permanently delete{" "}
              <strong className="text-white">"{deletingProduct.title}"</strong>?
              This listing will be completely removed from your Snitch boutique
              store. This process is irreversible.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-end gap-3.5">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-white/[0.08] text-[12.5px] font-semibold text-[#c8bea5] hover:bg-white/[0.03] transition-all"
              >
                Keep Listing
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-500/15 hover:bg-red-500 border border-red-500/30 hover:border-red-500 text-red-200 hover:text-white font-bold text-[12.5px] tracking-wide transition-all"
              >
                Remove Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mini Style Helper */}
      <style>{`
        ::-webkit-scrollbar {
          width: 0px;
          height: 0px;
        }
        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        select option {
          background-color: #181818;
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
