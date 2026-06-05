import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useAddress } from '../hook/useAddress';
import CreateAddress from './CreateAddress';
import { MapPin, Phone, User, Plus, ArrowRight, X, ShieldCheck, Check } from 'lucide-react';

const Addresses = ({ isModal = false, onClose, onSelectAddress }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  
  const { addresses, loading, error, handleGetAddresses } = useAddress();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    if (user) {
      handleGetAddresses();
    }
  }, [user]);

  // Set default selected address once addresses are loaded
  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0]._id);
    }
  }, [addresses]);

  const handleAddressSuccess = () => {
    setShowAddForm(false);
    handleGetAddresses();
  };

  const handleProceedToPayment = () => {
    if (!selectedAddressId) return;
    const selected = addresses.find((addr) => addr._id === selectedAddressId);
    if (selected && onSelectAddress) {
      onSelectAddress(selected);
    }
  };

  // Safe checks for empty addresses list
  const addressesList = Array.isArray(addresses) ? addresses : [];
  const isNoAddressesFound = error === 'No addresses found for this user.' || addressesList.length === 0;

  // Render Login Required if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-[70vh] bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 bg-[#FFD000]/10 border border-[#FFD000]/20 text-[#FFD000] rounded-full flex items-center justify-center mb-8 animate-scale-in">
          <MapPin size={36} />
        </div>
        <h2 className="text-3xl font-black tracking-widest uppercase mb-4">
          SHIPPING ADDRESS
        </h2>
        <p className="text-[#8b8b8b] text-[15px] max-w-md leading-relaxed mb-8">
          Please log in to manage your premium shipping destinations and complete your order.
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

  // Loading spinner
  if (loading && addressesList.length === 0 && !showAddForm) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-transparent">
        <div className="w-12 h-12 rounded-full border-2 border-[#1f1f1f] border-t-[#FFD000] animate-spin" />
      </div>
    );
  }

  // Wrapper layout depending on modal vs page mode
  const renderContent = () => {
    if (showAddForm) {
      return (
        <CreateAddress
          onSuccess={handleAddressSuccess}
          onCancel={() => setShowAddForm(false)}
        />
      );
    }

    if (isNoAddressesFound) {
      return (
        <div className="py-16 flex flex-col items-center text-center max-w-md mx-auto animate-scale-in">
          <div className="w-20 h-20 bg-[#111] border border-white/5 rounded-full flex items-center justify-center mb-8 text-[#8b8b8b]">
            <MapPin size={32} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-wider mb-3">
            No Addresses Saved
          </h2>
          <p className="text-[#777] text-sm leading-relaxed mb-10">
            Please add a shipping address where your premium selection will be delivered.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-10 h-14 bg-[#FFD000] text-black font-bold rounded-2xl hover:opacity-90 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-xs tracking-widest uppercase"
          >
            <Plus size={16} /> ADD ADDRESS
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-scale-in">
        {/* Addresses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {addressesList.map((addr) => {
            const isSelected = selectedAddressId === addr._id;
            return (
              <div
                key={addr._id}
                onClick={() => setSelectedAddressId(addr._id)}
                className={`relative p-6 rounded-[24px] border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#FFD000] bg-[#FFD000]/5 shadow-lg shadow-[#FFD000]/5'
                    : 'border-white/5 bg-[#111] hover:border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-zinc-500" />
                      <h3 className="font-bold text-white text-sm">{addr.name}</h3>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#FFD000] flex items-center justify-center text-black">
                        <Check size={12} className="stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                    {addr.addressLine1}
                    {addr.addressLine2 && `, ${addr.addressLine2}`}
                  </p>

                  <p className="text-xs text-zinc-500 font-semibold tracking-wide">
                    {addr.city}, {addr.state} - {addr.postalCode}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-zinc-500 text-xs">
                  <Phone size={12} />
                  <span>{addr.phone}</span>
                </div>
              </div>
            );
          })}

          {/* Add New Address Card */}
          <div
            onClick={() => setShowAddForm(true)}
            className="p-6 rounded-[24px] border border-dashed border-white/10 bg-[#0a0a0a] hover:bg-[#111] hover:border-[#FFD000]/30 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-3 text-center min-h-[160px] group"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#FFD000]/10 group-hover:text-[#FFD000] transition-colors">
              <Plus size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 group-hover:text-white transition-colors">
              Add New Address
            </span>
          </div>
        </div>

        {/* Modal-only checkout button */}
        {isModal && (
          <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
            <button
              onClick={handleProceedToPayment}
              disabled={!selectedAddressId}
              className="w-full h-14 bg-[#FFD000] text-black font-black text-xs tracking-widest rounded-2xl hover:opacity-90 active:scale-95 disabled:opacity-50 transition flex items-center justify-center gap-2 cursor-pointer uppercase shadow-lg shadow-[#FFD000]/10"
            >
              <ShieldCheck size={16} /> PROCEED TO PAY
            </button>
            <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest leading-relaxed">
              Secure payment via Razorpay • 100% Encrypted Checkout
            </p>
          </div>
        )}
      </div>
    );
  };

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        />

        {/* Modal container */}
        <div className="relative w-full max-w-[650px] bg-[#0d0d0d] border border-white/5 rounded-[32px] p-6 lg:p-8 shadow-2xl z-10 max-h-[85vh] overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <div>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#FFD000] font-black">
                CHECKOUT STEP 1 OF 2
              </span>
              <h2 className="text-xl font-black uppercase tracking-wider mt-1 text-white">
                SHIPPING ADDRESS
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Error Message */}
          {error && !isNoAddressesFound && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              ⚠️ {error}
            </div>
          )}

          {/* Content */}
          {renderContent()}

        </div>
      </div>
    );
  }

  // Standalone Page Layout
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-10 pt-8">
        
        {/* Breadcrumbs / Header */}
        <div className="mb-12 border-b border-white/5 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#FFD000]">
              YOUR ADDRESSES
            </h1>
            <p className="text-xs text-zinc-500 uppercase tracking-[0.25em] mt-3">
              {addressesList.length} SHIPPING {addressesList.length === 1 ? 'DESTINATION' : 'DESTINATIONS'} SAVED
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

        {/* Errors */}
        {error && !isNoAddressesFound && (
          <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            ⚠️ {error}
          </div>
        )}

        {/* Content */}
        <div className="max-w-5xl">
          {renderContent()}
        </div>

      </div>
    </div>
  );
};

export default Addresses;
