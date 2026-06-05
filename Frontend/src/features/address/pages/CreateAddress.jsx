import React, { useState } from 'react';
import { useAddress } from '../hook/useAddress';
import { MapPin, Phone, User, Landmark, Building, Navigation } from 'lucide-react';

const CreateAddress = ({ onSuccess, onCancel }) => {
  const { handleCreateAddress, loading, error } = useAddress();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.addressLine1.trim()) errors.addressLine1 = 'Address line 1 is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.postalCode.trim()) {
      errors.postalCode = 'Postal code is required';
    } else if (!/^\d{6}$/.test(formData.postalCode.trim())) {
      errors.postalCode = 'Please enter a valid 6-digit postal code';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await handleCreateAddress(formData);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Failed to create address:', err);
    }
  };

  return (
    <div className="bg-[#0b0b0b] border border-white/5 rounded-[28px] p-6 lg:p-8 max-w-2xl w-full mx-auto animate-scale-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#FFD000]/10 border border-[#FFD000]/20 flex items-center justify-center text-[#FFD000]">
          <MapPin size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider">ADD NEW ADDRESS</h2>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Premium Shipping Destination</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs tracking-wide">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 flex items-center gap-1.5">
              <User size={12} /> Contact Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className={`w-full h-12 bg-[#111] border rounded-xl px-4 text-sm outline-none transition ${
                formErrors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-[#FFD000]'
              }`}
            />
            {formErrors.name && <p className="text-[11px] text-red-400">{formErrors.name}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 flex items-center gap-1.5">
              <Phone size={12} /> Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              maxLength={10}
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit number"
              className={`w-full h-12 bg-[#111] border rounded-xl px-4 text-sm outline-none transition ${
                formErrors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-[#FFD000]'
              }`}
            />
            {formErrors.phone && <p className="text-[11px] text-red-400">{formErrors.phone}</p>}
          </div>
        </div>

        {/* Address Line 1 */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 flex items-center gap-1.5">
            <Landmark size={12} /> Address Line 1
          </label>
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            placeholder="Flat / House No. / Building / Street"
            className={`w-full h-12 bg-[#111] border rounded-xl px-4 text-sm outline-none transition ${
              formErrors.addressLine1 ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-[#FFD000]'
            }`}
          />
          {formErrors.addressLine1 && <p className="text-[11px] text-red-400">{formErrors.addressLine1}</p>}
        </div>

        {/* Address Line 2 */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 flex items-center gap-1.5">
            <Landmark size={12} /> Address Line 2 (Optional)
          </label>
          <input
            type="text"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            placeholder="Landmark / Area / Colony"
            className="w-full h-12 bg-[#111] border border-white/5 rounded-xl px-4 text-sm outline-none focus:border-[#FFD000] transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* City */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 flex items-center gap-1.5">
              <Building size={12} /> City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Mumbai"
              className={`w-full h-12 bg-[#111] border rounded-xl px-4 text-sm outline-none transition ${
                formErrors.city ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-[#FFD000]'
              }`}
            />
            {formErrors.city && <p className="text-[11px] text-red-400">{formErrors.city}</p>}
          </div>

          {/* State */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 flex items-center gap-1.5">
              <Navigation size={12} /> State
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g. Maharashtra"
              className={`w-full h-12 bg-[#111] border rounded-xl px-4 text-sm outline-none transition ${
                formErrors.state ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-[#FFD000]'
              }`}
            />
            {formErrors.state && <p className="text-[11px] text-red-400">{formErrors.state}</p>}
          </div>

          {/* Postal Code */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 flex items-center gap-1.5">
              <Navigation size={12} /> Pincode
            </label>
            <input
              type="text"
              name="postalCode"
              maxLength={6}
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="6-digit code"
              className={`w-full h-12 bg-[#111] border rounded-xl px-4 text-sm outline-none transition ${
                formErrors.postalCode ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-[#FFD000]'
              }`}
            />
            {formErrors.postalCode && <p className="text-[11px] text-red-400">{formErrors.postalCode}</p>}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 h-12 bg-[#FFD000] text-black font-bold text-xs tracking-widest rounded-xl hover:opacity-90 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 uppercase"
          >
            {loading ? 'Saving...' : 'Save Address'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="h-12 px-8 border border-white/10 hover:border-[#FFD000] hover:text-[#FFD000] text-xs font-bold tracking-widest rounded-xl active:scale-95 transition cursor-pointer uppercase text-zinc-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateAddress;