import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useCart } from '../hook/useCart';
import { 
  CheckCircle, 
  Copy, 
  Check, 
  Truck, 
  Calendar, 
  CreditCard, 
  ArrowRight, 
  ShoppingBag, 
  Download, 
  Sparkles,
  MapPin,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { handleGetOrderDetails } = useCart();

  const [orderId, setOrderId] = useState(searchParams.get('order_id') || '');
  const [orderData, setOrderData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch live order details if orderId exists
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const details = await handleGetOrderDetails(orderId);
        if (details) {
          setOrderData(details);
        }
      } catch (err) {
        console.error("Failed to retrieve order details:", err);
        setError("Unable to retrieve live order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Fallback / Mock Data if backend order is not available (for a premium preview or checkout flow fallback)
  const mockOrder = {
    razorpay: {
      orderId: orderId || 'rzp_test_529104Aura',
    },
    status: 'paid',
    price: {
      amount: 51300, // in cents/paise or direct rupees
      currency: 'INR',
    },
    orderItems: [
      {
        title: 'Onyx Shadow Bomber Jacket',
        description: 'Premium heavyweight water-resistant bomber with custom silver luxury zip hardware.',
        quantity: 1,
        price: { amount: 45000, currency: 'INR' },
        images: [{ url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60' }],
        variantAttribute: 'Size: L'
      },
      {
        title: 'Aura Signature Tee',
        description: 'Heavyweight organic cotton tee featuring gold-threaded brand embroidery.',
        quantity: 2,
        price: { amount: 6300, currency: 'INR' },
        images: [{ url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60' }],
        variantAttribute: 'Size: M'
      }
    ]
  };

  const activeOrder = orderData || mockOrder;

  // Format date helper
  const getDeliveryDateRange = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() + 3);
    const end = new Date(today);
    end.setDate(today.getDate() + 5);

    const options = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };

  // Copy order ID to clipboard
  const handleCopyId = () => {
    navigator.clipboard.writeText(activeOrder.razorpay.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatPrice = (priceObj) => {
    const symbol = priceObj?.currency === 'USD' ? '$' : '₹';
    // If the price is stored as paise (e.g. 51300 paise = 513 rupees), divide by 100
    let amount = priceObj?.amount || 0;
    if (amount > 10000 && !orderData) {
      amount = amount / 100; // Mock data normalization
    }
    return `${symbol}${Number(amount).toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-zinc-800 border-t-[#FFD000] animate-spin mb-4" />
        <p className="text-sm tracking-[0.2em] text-zinc-500 uppercase">Verifying Order...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white flex flex-col antialiased">
      <main className="flex-grow max-w-[1400px] mx-auto w-full px-5 md:px-8 py-8 md:py-16">
        
        {/* SUCCESS CHECKMARK AND TITLE */}
        <section className="flex flex-col items-center text-center w-full gap-5 mb-12">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#131313] border border-white/5 flex items-center justify-center mb-2 animate-scale-in animate-pulse-gold relative z-10">
              <CheckCircle size={48} className="text-[#FFD000] fill-[#FFD000]/10" />
            </div>
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#FFD000]/20 to-transparent blur-md opacity-70"></div>
          </div>
          
          <div className="space-y-2">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#FFD000]">Payment Verified</p>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              Order Confirmed
            </h1>
            <p className="text-zinc-500 max-w-md mx-auto text-sm md:text-base leading-relaxed">
              Your transaction is complete. We've sent a detailed confirmation invoice to your registered email.
            </p>
          </div>

          {/* ORDER ID BADGE */}
          <div className="flex items-center gap-3 bg-[#131313] hover:bg-[#1a1a1a] border border-white/5 px-4 py-2.5 rounded-full mt-2 transition duration-300">
            <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">Order ID:</span>
            <span className="text-xs md:text-sm text-white font-bold tracking-wider">{activeOrder.razorpay.orderId}</span>
            <button 
              onClick={handleCopyId}
              className="text-zinc-500 hover:text-[#FFD000] transition ml-1 flex items-center justify-center"
              title="Copy Order ID"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>
        </section>

        {/* TIMELINE PROGRESS & ESTIMATED DELIVERY */}
        <section className="max-w-3xl mx-auto w-full bg-[#131313]/50 border border-white/5 rounded-3xl p-6 md:p-8 mb-8 backdrop-blur-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-white/5 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFD000]/10 flex items-center justify-center text-[#FFD000]">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">Estimated Arrival</p>
                <p className="text-sm md:text-base font-black text-white mt-0.5">{getDeliveryDateRange()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">Delivery Protection</p>
                <p className="text-sm md:text-base font-black text-emerald-400 mt-0.5">Guaranteed Carrier</p>
              </div>
            </div>
          </div>

          {/* Minimalist Progress Bar */}
          <div className="relative px-2 py-4">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-zinc-800 -translate-y-1/2 rounded-full"></div>
            <div className="absolute top-1/2 left-0 w-1/3 h-[2px] bg-[#FFD000] -translate-y-1/2 rounded-full shadow-[0_0_8px_1px_rgba(255,208,0,0.5)]"></div>
            
            <div className="relative flex justify-between w-full">
              {/* Node 1 */}
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#FFD000] ring-4 ring-[#0e0e0e] flex items-center justify-center"></div>
                <span className="text-[10px] md:text-xs font-bold text-[#FFD000] tracking-wider uppercase">Placed</span>
              </div>
              {/* Node 2 */}
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#FFD000] ring-4 ring-[#0e0e0e] flex items-center justify-center"></div>
                <span className="text-[10px] md:text-xs font-bold text-[#FFD000] tracking-wider uppercase">Processing</span>
              </div>
              {/* Node 3 */}
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-4 h-4 rounded-full bg-zinc-800 ring-4 ring-[#0e0e0e] flex items-center justify-center"></div>
                <span className="text-[10px] md:text-xs font-semibold text-zinc-600 tracking-wider uppercase">Shipped</span>
              </div>
              {/* Node 4 */}
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-4 h-4 rounded-full bg-zinc-800 ring-4 ring-[#0e0e0e] flex items-center justify-center"></div>
                <span className="text-[10px] md:text-xs font-semibold text-zinc-600 tracking-wider uppercase">Delivered</span>
              </div>
            </div>
          </div>
        </section>

        {/* TWO COLUMN GRID FOR CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 items-start">
          
          {/* LEFT COLUMN: ORDER ITEMS */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-white flex items-center gap-3">
                <span>Items Ordered</span>
                <span className="text-xs bg-zinc-800 text-zinc-400 font-bold px-2 py-0.5 rounded-full">
                  {activeOrder.orderItems.length}
                </span>
              </h2>
            </div>

            <div className="space-y-4">
              {activeOrder.orderItems.map((item, idx) => (
                <div 
                  key={idx}
                  className="group relative bg-[#131313] border border-white/5 hover:border-white/10 p-4 md:p-5 rounded-2xl flex items-center gap-5 transition duration-500 ease-out hover:translate-y-[-2px]"
                >
                  {/* Item Image */}
                  <div className="w-20 h-24 bg-zinc-900 rounded-xl overflow-hidden flex-shrink-0 border border-white/5 relative">
                    <img 
                      src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60'} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                  </div>

                  {/* Item Info */}
                  <div className="flex-grow min-w-0">
                    <h3 className="text-sm md:text-base font-bold text-white tracking-tight truncate group-hover:text-[#FFD000] transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-500 line-clamp-1 mt-1 font-medium">
                      {item.description || 'Premium Snitch high-fashion streetwear item.'}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.variantAttribute && (
                        <span className="text-[10px] bg-zinc-800 text-zinc-300 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {item.variantAttribute}
                        </span>
                      )}
                      <span className="text-[10px] bg-zinc-800 text-zinc-300 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Item Price */}
                  <div className="text-right flex-shrink-0 pl-3">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-semibold mb-0.5">Item price</p>
                    <p className="text-sm md:text-base font-black text-white">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT COLUMN: SHIPPING AND PAYMENT DETAIL CARDS */}
          <section className="space-y-6 lg:sticky lg:top-24">
            
            {/* Shipping Info */}
            <div className="bg-[#131313] border border-white/5 p-6 rounded-3xl space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#FFD000] border-b border-white/5 pb-3">
                Shipping Address
              </h3>
              <div className="flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 mt-0.5">
                  <MapPin size={16} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">{user?.fullname || 'Alex Mercer'}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                    1234 Neon Avenue, Suite 4B<br />
                    Cyber City, California 90210<br />
                    United States
                  </p>
                </div>
              </div>
            </div>

            {/* Payment & Summary */}
            <div className="bg-[#131313] border border-white/5 p-6 rounded-3xl space-y-5">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#FFD000] border-b border-white/5 pb-3">
                Payment Breakdown
              </h3>
              
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-xs md:text-sm font-medium">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="text-white font-bold">{formatPrice({ amount: activeOrder.price.amount, currency: activeOrder.price.currency })}</span>
                </div>
                <div className="flex justify-between items-center text-xs md:text-sm font-medium">
                  <span className="text-zinc-500">Shipping</span>
                  <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">Free</span>
                </div>
                
                {/* Simulated promo code discount for mock data matching Stitch screenshot */}
                {!orderData && (
                  <div className="flex justify-between items-center text-xs md:text-sm font-medium">
                    <span className="text-[#FFD000] flex items-center gap-1.5">
                      <Sparkles size={13} /> Discount (SNITCH10)
                    </span>
                    <span className="text-[#FFD000] font-bold">-{formatPrice({ amount: 5700, currency: 'INR' })}</span>
                  </div>
                )}
                
                <div className="border-t border-white/5 pt-4 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold block mb-0.5">Grand Total</span>
                    <span className="text-2xl md:text-3xl font-black tracking-tight text-[#FFD000]">
                      {orderData 
                        ? formatPrice(activeOrder.price)
                        : formatPrice({ amount: activeOrder.price.amount - 5700, currency: 'INR' })
                      }
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold block mb-1">Paid Via</span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 font-bold bg-zinc-800 px-3 py-1 rounded-full border border-white/5">
                      <CreditCard size={12} className="text-[#FFD000]" />
                      Razorpay
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs BUTTONS */}
            <div className="space-y-3 pt-2">
              <button 
                onClick={() => navigate('/seller/dashboard')} // Simulated Order Tracking page
                className="w-full h-14 rounded-2xl bg-[#FFD000] text-black font-black tracking-[0.2em] uppercase text-xs flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] hover:bg-[#ffe16d] transition duration-300 shadow-[0_4px_20px_rgba(255,208,0,0.15)]"
              >
                Track Order <Truck size={14} />
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigate('/')}
                  className="h-12 rounded-2xl bg-transparent border border-white/10 text-white font-black tracking-[0.1em] uppercase text-[10px] flex items-center justify-center gap-1.5 hover:bg-white/5 hover:border-white/20 transition duration-300"
                >
                  <ShoppingBag size={13} /> Continue
                </button>
                <button 
                  onClick={() => alert("Invoice download initialized.")}
                  className="h-12 rounded-2xl bg-transparent border border-white/10 text-white font-black tracking-[0.1em] uppercase text-[10px] flex items-center justify-center gap-1.5 hover:bg-white/5 hover:border-white/20 transition duration-300"
                >
                  <Download size={13} /> Invoice
                </button>
              </div>
            </div>

          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 text-center text-[10px] text-zinc-600 uppercase tracking-[0.2em]">
        © {new Date().getFullYear()} SNITCH Premium Retail • Secure Payment Gateway
      </footer>
    </div>
  );
};

export default OrderSuccess;