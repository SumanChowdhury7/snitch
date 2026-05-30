import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../hook/useCart";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";

const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  INR: "₹",
};

const CartItems = () => {
  const {
    cart,
    loading,
    error,
    handleGetCart,
    handleUpdateItemQuantity,
    handleRemoveItem,
  } = useCart();

  const navigate = useNavigate();
  const {error: razorpayError, isLoading, Razorpay} = useRazorpay();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");

  const cartData = Array.isArray(cart) ? cart[0] : cart;
  const cartItems = cartData?.items || [];

  useEffect(() => {
    handleGetCart();
  }, []);

    const handlePayment = () => {
    const options = {
      key: "YOUR_RAZORPAY_KEY",
      amount: 50000, // Amount in paise
      currency: "INR",
      name: "Test Company",
      description: "Test Transaction",
      order_id: "order_9A33XWu170gUtm", // Generate order_id on server
      handler: (response) => {
        console.log(response);
        alert("Payment Successful!");
      },
      prefill: {
        name: "John Doe",
        email: "john.doe@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  };

      

  const formatPrice = (priceObj) => {
    const symbol = currencySymbols[priceObj?.currency] || "₹";

    return `${symbol}${Number(priceObj?.amount || 0).toLocaleString("en-IN")}`;
  };

  const getVariantDetails = (item) => {
    const variants = item?.product?.variants;
    if (!variants) return null;

    if (Array.isArray(variants)) {
      return variants.find((v) => v._id?.toString() === item.variant?.toString());
    }

    return variants;
  };

  const getTotals = () => {
    if (!cartItems.length)
      return {
        subtotal: 0,
        discount: 0,
        priceDrop: 0,
        total: 0,
        currency: "INR",
      };

    let priceDrop = 0;

    const subtotal = cartItems.reduce((sum, item) => {
      const variantObj = getVariantDetails(item);
      const currentPrice =
        variantObj?.price?.amount ?? item.price?.amount ?? item.product?.price?.amount ?? 0;
      const originalPrice = item.price?.amount || 0;

      if (originalPrice > 0 && currentPrice < originalPrice) {
        priceDrop += (originalPrice - currentPrice) * item.quantity;
      }

      return sum + currentPrice * item.quantity;
    }, 0);

    let discount = 0;

    if (appliedPromo === "SNITCH10") {
      discount = subtotal * 0.1;
    } else if (appliedPromo === "PREMIUM") {
      discount = subtotal * 0.15;
    }

    const total = cartData?.totalPrice;
    const currency =
      cartData?.currency || cartItems[0]?.price?.currency || "INR";

    return {
      subtotal,
      discount,
      priceDrop,
      total,
      currency,
    };
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();

    setPromoError("");

    const code = promoCode.trim().toUpperCase();

    if (code === "SNITCH10") {
      setAppliedPromo("SNITCH10");
      setPromoCode("");
    } else if (code === "PREMIUM") {
      setAppliedPromo("PREMIUM");
      setPromoCode("");
    } else {
      setPromoError("Invalid promo code");
    }
  };

  const handleQuantityDecrease = async (item) => {
    if (item.quantity > 1) {
      await handleUpdateItemQuantity({
        productId: item.product._id,
        variantId: item.variant,
        quantity: item.quantity - 1,
      });
    } else {
      await handleRemoveItem({
        productId: item.product._id,
        variantId: item.variant,
      });
    }
  };

  const handleQuantityIncrease = async (item) => {
    const variantObj = getVariantDetails(item);

    const stock = variantObj?.stock || item.product?.stock || 99;

    if (item.quantity >= stock) {
      alert(`Only ${stock} items available in stock.`);
      return;
    }

    await handleUpdateItemQuantity({
      productId: item.product._id,
      variantId: item.variant,
      quantity: item.quantity + 1,
    });
  };

  const totals = getTotals();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* MAIN */}
      <main className="flex-1 max-w-[1500px] mx-auto w-full px-6 lg:px-10 py-10">
        {/* TOP */}
        <div className="flex items-end justify-between border-b border-white/5 pb-8 mb-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-600 mb-3">
              Shopping Bag
            </p>

            <h1 className="text-4xl font-black tracking-tight">Your Cart</h1>
          </div>

          <p className="text-sm text-zinc-500">
            {cartItems.length} items
          </p>
        </div>

        {/* LOADING */}
        {loading && !cart && (
          <div className="h-[400px] flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border border-zinc-800 border-t-[#FFD000] animate-spin" />
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-900/40 bg-red-950/20 p-4 text-red-400 text-sm flex items-center justify-between">
            <span>{error}</span>

            <button onClick={() => handleGetCart()} className="underline">
              Retry
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading && cartItems.length === 0 ? (
          <div className="h-[500px] rounded-[32px] border border-white/5 bg-[#0b0b0b] flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center text-4xl mb-8">
              👜
            </div>

            <h2 className="text-3xl font-black">YOUR BAG IS EMPTY</h2>

            <p className="mt-4 text-zinc-500 max-w-md leading-relaxed">
              Explore premium fashion pieces curated for modern street luxury.
            </p>

            <Link
              to="/"
              className="mt-8 h-14 px-8 rounded-2xl bg-[#FFD000] text-black font-bold text-sm flex items-center justify-center hover:scale-[1.02] transition-all"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_0.75fr] gap-8 items-start">
            {/* LEFT */}
            <div className="space-y-4">
              {cartItems.map((item) => {
                const variantObj = getVariantDetails(item);

                const itemImage =
                  variantObj?.images?.[0]?.url ||
                  item.product?.images?.[0]?.url ||
                  "/placeholder.png";

                const itemPrice =
                  variantObj?.price || item.price || item.product?.price;

                // Savings: if the current variant price is lower than what was stored
                const originalAmount = item.price?.amount || 0;
                const currentAmount = variantObj?.price?.amount ?? originalAmount;
                const savingsPerUnit = originalAmount > 0 && currentAmount < originalAmount
                  ? originalAmount - currentAmount
                  : 0;
                const currency = itemPrice?.currency || item.price?.currency || "INR";

                const attributes = Object.entries(variantObj?.attributes || {});

                return (
                  <div
                    key={`${item.product?._id}-${item.variant}`}
                    className="group rounded-[26px] border border-white/8 bg-[#0b0b0b] hover:border-white/15 transition-all duration-500 px-5 py-5"
                  >
                    <div className="flex gap-5 items-start">
                      {/* IMAGE */}
                      <div
                        onClick={() =>
                          navigate(`/product/${item.product?._id}`)
                        }
                        className="w-[110px] h-[135px] rounded-2xl overflow-hidden bg-[#111] flex-shrink-0 cursor-pointer"
                      >
                        <img
                          src={itemImage}
                          alt={item.product?.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                        />
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        {/* TOP */}
                        <div>
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <h2
                                onClick={() =>
                                  navigate(`/product/${item.product?._id}`)
                                }
                                className="text-[17px] md:text-[18px] font-semibold tracking-tight cursor-pointer hover:text-[#FFD000] transition truncate"
                              >
                                {item.product?.title}
                              </h2>

                              <p className="mt-1 text-sm text-zinc-500 line-clamp-1">
                                {item.product?.description}
                              </p>
                            </div>

                            <button
                              onClick={() =>
                                handleRemoveItem({
                                  productId: item.product._id,
                                  variantId: item.variant,
                                })
                              }
                              className="w-9 h-9 rounded-full border border-white/8 bg-[#111] flex items-center justify-center text-zinc-500 hover:text-red-400 hover:border-red-400/30 transition-all duration-300 flex-shrink-0"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.8}
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 0v11a1 1 0 001 1h6a1 1 0 001-1V7M10 11v6M14 11v6"
                                />
                              </svg>
                            </button>
                          </div>

                          {/* ATTRIBUTES */}
                          {attributes.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {attributes.map(([key, value]) => (
                                <div
                                  key={key}
                                  className="h-8 px-3 rounded-full bg-[#111] border border-white/6 flex items-center gap-2"
                                >
                                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                                    {key}
                                  </span>

                                  <span className="text-xs font-medium text-white">
                                    {value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* BOTTOM */}
                        <div className="mt-5 flex items-center justify-between gap-5">
                          {/* QUANTITY */}
                          <div className="flex items-center h-11 rounded-full border border-white/8 bg-[#111] px-1">
                            <button
                              onClick={() => handleQuantityDecrease(item)}
                              className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition"
                            >
                              −
                            </button>

                            <span className="w-8 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => handleQuantityIncrease(item)}
                              className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition"
                            >
                              +
                            </button>
                          </div>

                          {/* PRICE */}
                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-600 mb-1">
                              Price per unit
                            </p>

                            <div className="flex flex-col items-end gap-1">
                              {savingsPerUnit > 0 && (
                                <span className="text-[11px] text-zinc-500 line-through">
                                  {formatPrice({ amount: originalAmount, currency })}
                                </span>
                              )}
                              <h3 className="text-[22px] font-black tracking-tight text-white">
                                {currentAmount > 0 ? formatPrice({ amount: currentAmount, currency }) : "Free"}
                              </h3>
                              {savingsPerUnit > 0 && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2.5 py-0.5">
                                  🏷 You're saving {formatPrice({ amount: savingsPerUnit, currency })}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT */}
            <div className="sticky top-24 rounded-[28px] border border-white/8 bg-[#0b0b0b] p-7">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p
                  onclick={handlePayment}
                  className="text-[11px] uppercase tracking-[0.3em] text-zinc-600 mb-2">
                    Checkout
                  </p>

                  <h2 className="text-2xl font-black">Summary</h2>
                </div>

                <div className="w-11 h-11 rounded-2xl border border-white/10 flex items-center justify-center text-[#FFD000]">
                  ✦
                </div>
              </div>

              {/* TOTALS */}
              <div className="space-y-5 border-b border-white/5 pb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Subtotal</span>

                  <span className="font-semibold">
                    {formatPrice({
                      amount: totals.subtotal,
                      currency: totals.currency,
                    })}
                  </span>
                </div>

                {/* {totals.priceDrop > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span>🏷</span> Price Drop Savings
                    </span>
                    <span className="font-semibold text-emerald-400">
                      -{formatPrice({
                        amount: totals.priceDrop,
                        currency: totals.currency,
                      })}
                    </span>
                  </div>
                )} */}

                {totals.discount > 0 && (
                  <div className="flex items-center justify-between text-sm text-emerald-400">
                    <span>
                      Discount ({appliedPromo === "SNITCH10" ? "10%" : "15%"})
                    </span>

                    <span>
                      -
                      {formatPrice({
                        amount: totals.discount,
                        currency: totals.currency,
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* PROMO */}
              <form
                onSubmit={handleApplyPromo}
                className="py-6 border-b border-white/5"
              >
                <label className="text-[11px] uppercase tracking-[0.25em] text-zinc-600">
                  Promo Code
                </label>

                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="SNITCH10"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 h-12 rounded-2xl bg-[#111] border border-white/8 px-4 text-sm outline-none focus:border-[#FFD000] transition"
                  />

                  <button
                    type="submit"
                    className="h-12 px-5 rounded-2xl border border-white/10 hover:border-[#FFD000] hover:text-[#FFD000] transition text-xs font-bold"
                  >
                    APPLY
                  </button>
                </div>

                {appliedPromo && (
                  <p className="mt-3 text-xs text-emerald-400">
                    Promo code applied successfully.
                  </p>
                )}

                {promoError && (
                  <p className="mt-3 text-xs text-red-400">{promoError}</p>
                )}
              </form>

              {/* TOTAL */}
              <div className="py-7 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-600 mb-2">
                    Total
                  </p>

                  <h2 className="text-4xl font-black tracking-tight">
                    {formatPrice({
                      amount: totals.total,
                      currency: totals.currency,
                    })}
                  </h2>
                </div>
              </div>

              {/* BUTTON */}
              <button
                onClick={handlePayment}
                className="w-full h-14 rounded-2xl bg-[#FFD000] text-black font-black tracking-[0.2em] text-sm hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                CHECKOUT
              </button>

              <p className="mt-5 text-center text-xs text-zinc-600 leading-relaxed">
                Secure payments • Fast delivery • Premium support
              </p>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-7 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} SNITCH Premium Retail
      </footer>
    </div>
  );
};

export default CartItems;
