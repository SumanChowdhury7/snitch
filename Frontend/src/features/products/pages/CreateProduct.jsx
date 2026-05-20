import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { useProduct } from '../hook/useProduct';
import { useSelector } from 'react-redux';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR'];
const MAX_IMAGES = 7;

const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
};

const inputCls =
  'w-full bg-[#181818]/90 border border-[#2d2d2d] rounded-2xl px-4 py-3 text-[#f5f1e8] placeholder-[#666] ' +
  'focus:border-[#FFD700] focus:ring-4 focus:ring-[#FFD700]/10 outline-none transition-all duration-300 text-sm';

const labelCls =
  'block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d0c6ab] mb-2';

const glassStyle = {
  background:
    'linear-gradient(180deg, rgba(22,22,22,0.92) 0%, rgba(14,14,14,0.95) 100%)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.06)',
  boxShadow:
    '0 10px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03)',
};

const CreateProduct = () => {
  const navigate = useNavigate();
  const { handleCreateProduct } = useProduct();
  const { loading } = useSelector((state) => state.product);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR',
  });

  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addFiles = (files) => {
    const slots = MAX_IMAGES - images.length;

    if (slots <= 0) return;

    const valid = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, slots);

    setImages((prev) => [
      ...prev,
      ...valid.map((f) => ({
        file: f,
        url: URL.createObjectURL(f),
      })),
    ]);
  };

  const handleFileChange = (e) => addFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const removeImage = (idx) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].url);

      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      alert('Please upload at least one image.');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('priceAmount', formData.priceAmount);
    data.append('priceCurrency', formData.priceCurrency);

    images.forEach((img) => {
      data.append('images', img.file);
    });

    const result = await handleCreateProduct(data);
    if (result) {
      alert('Product listing published successfully!');
      setFormData({
        title: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'INR',
      });
      setImages([]);
      navigate('/');
    } else {
      alert('Failed to publish product listing. Please check the details and try again.');
    }
  };

  const atMax = images.length >= MAX_IMAGES;

  return (
    <div className="h-screen overflow-hidden bg-[#0c0c0c] text-[#f5f1e8] font-sans relative">

      {/* Background Glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-[#FFD700]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] bg-[#FFD700]/5 blur-[120px] rounded-full" />

      {/* Top Line */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-[#1f1f1f] z-[200]">
        <div className="h-full w-[60%] bg-[#FFD700] shadow-[0_0_15px_#FFD700]" />
      </div>

      {/* NAVBAR */}
      <header className="h-16 border-b border-white/[0.05] bg-[#0f0f0f]/80 backdrop-blur-xl relative z-50">
        <nav className="h-full max-w-[1500px] mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-between">

          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-[#d0c6ab] hover:text-[#FFD700] hover:border-[#FFD700]/40 hover:bg-[#FFD700]/5 transition-all duration-300 active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="leading-none">
              <h1 className="text-[22px] font-black tracking-[0.25em]">
                SNITCH
              </h1>

              <p className="text-[9px] uppercase tracking-[0.25em] text-[#6f6a5f] mt-1">
                Creator Studio
              </p>
            </div>
          </div>

          {/* Center */}
          <div className="hidden md:flex items-center gap-8">
            {['Collections', 'New Arrivals', 'Studio'].map((item) => (
              <a
                key={item}
                href="#"
                className="relative text-[12px] font-medium tracking-wide text-[#c8bea5] hover:text-[#FFD700] transition-colors after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-[#FFD700] hover:after:w-full after:transition-all"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Right */}
          <Link
            to="/"
            className="hidden md:flex items-center justify-center rounded-full border border-[#39342a] bg-[#171717] px-4 py-2 text-[12px] font-medium text-[#e6dcc3] hover:border-[#FFD700]/40 hover:text-[#FFD700] transition-all duration-300"
          >
            My Shop
          </Link>

          <div className="md:hidden w-9" />
        </nav>
      </header>

      {/* MAIN */}
      <main className="h-[calc(100vh-64px)] overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 relative z-10">

        <div className="w-full max-w-[1350px] h-full">

          <div
            className="h-full rounded-[30px] overflow-hidden grid lg:grid-cols-[420px_1fr]"
            style={glassStyle}
          >

            {/* LEFT SIDE */}
            <div className="hidden lg:flex flex-col justify-between border-r border-white/[0.05] p-8 relative overflow-hidden">

              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-transparent pointer-events-none" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FFD700]/20 bg-[#FFD700]/5 text-[#FFD700] text-[10px] font-semibold tracking-[0.2em] uppercase">
                  Product Upload
                </div>

                <h2 className="mt-6 text-[42px] font-bold leading-[1.1] tracking-tight text-[#fffbea]">
                  Create Your
                  <br />
                  Premium
                  <br />
                  Listing
                </h2>

                <p className="mt-5 text-[14px] leading-relaxed text-[#9f988c] max-w-[280px]">
                  Upload your product details, showcase visuals and publish
                  your listing with a luxury modern experience.
                </p>
              </div>

              {/* Bottom Preview */}
              <div className="relative z-10 mt-auto">
  <div className="relative overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#141414] h-[220px]">
    
    <img
      src="https://plus.unsplash.com/premium_photo-1675253290701-a7b7b2c6c9f6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      alt="fashion"
      className="w-full h-full object-cover opacity-70"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

    <div className="absolute bottom-5 left-5">
      <p className="text-[11px] tracking-[0.2em] uppercase text-[#FFD700] font-semibold">
        Creator Studio
      </p>

      <h3 className="mt-2 text-[22px] font-bold text-white leading-tight">
        Premium Fashion
        <br />
        Marketplace
      </h3>
    </div>
  </div>
</div>
            </div>

            {/* RIGHT SIDE */}
            <div className="h-full overflow-hidden flex flex-col">

              {/* Mobile Header */}
              <div className="lg:hidden px-5 pt-5 pb-3 border-b border-white/[0.05]">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FFD700]/20 bg-[#FFD700]/5 text-[#FFD700] text-[10px] font-semibold tracking-[0.2em] uppercase">
                  Product Upload
                </div>

                <h2 className="mt-4 text-[28px] font-bold text-[#fffbea]">
                  Create Listing
                </h2>
              </div>

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="flex-1 overflow-y-auto px-5 sm:px-7 md:px-8 py-5"
              >

                <div className="grid xl:grid-cols-2 gap-5">

                  {/* LEFT FORM */}
                  <div className="space-y-5">

                    {/* Title */}
                    <div>
                      <label htmlFor="title" className={labelCls}>
                        Product Title
                      </label>

                      <input
                        id="title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className={inputCls}
                        placeholder="Oversized Streetwear Jacket"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className={labelCls}>
                        Description
                      </label>

                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={6}
                        className={`${inputCls} resize-none`}
                        placeholder="Describe your product — fit, material, quality, styling notes..."
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className={labelCls}>
                        Pricing
                      </label>

                      <div className="grid grid-cols-[1fr_120px] gap-3">

                        {/* Amount */}
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFD700] font-semibold text-sm">
                            {currencySymbols[formData.priceCurrency]}
                          </span>

                          <input
                            id="priceAmount"
                            type="number"
                            name="priceAmount"
                            value={formData.priceAmount}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className={`${inputCls} pl-10`}
                            placeholder="0.00"
                          />
                        </div>

                        {/* Currency */}
                        <div className="relative">
                          <select
                            id="priceCurrency"
                            name="priceCurrency"
                            value={formData.priceCurrency}
                            onChange={handleChange}
                            className={`${inputCls} appearance-none pr-9 cursor-pointer`}
                          >
                            {CURRENCIES.map((c) => (
                              <option
                                key={c}
                                value={c}
                                className="bg-[#181818]"
                              >
                                {c}
                              </option>
                            ))}
                          </select>

                          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#c8bea5]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT FORM */}
                  <div className="flex flex-col">

                    {/* Images */}
                    <div className="flex items-center justify-between mb-3">
                      <label className={labelCls}>
                        Product Images
                      </label>

                      <div
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                          atMax
                            ? 'bg-[#FFD700]/15 text-[#FFD700]'
                            : 'bg-white/[0.05] text-[#c8bea5]'
                        }`}
                      >
                        {images.length}/{MAX_IMAGES}
                      </div>
                    </div>

                    {/* Dropzone */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() =>
                        !atMax && fileInputRef.current?.click()
                      }
                      className={[
                        'group relative overflow-hidden border rounded-[28px] px-5 py-8 transition-all duration-300',
                        atMax
                          ? 'opacity-40 pointer-events-none'
                          : 'cursor-pointer',
                        isDragging
                          ? 'border-[#FFD700] bg-[#FFD700]/5 shadow-[0_0_40px_rgba(255,215,0,0.08)]'
                          : 'border-[#2d2d2d] bg-[#141414]/80 hover:border-[#FFD700]/40',
                      ].join(' ')}
                    >

                      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="relative z-10 flex flex-col items-center text-center">

                        <div
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                            isDragging
                              ? 'border-[#FFD700]/40 bg-[#FFD700]/10 text-[#FFD700]'
                              : 'border-white/[0.06] bg-white/[0.03] text-[#666] group-hover:text-[#FFD700]'
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>

                        <h3 className="mt-4 text-[16px] font-semibold text-[#f5f1e8]">
                          Upload Images
                        </h3>

                        <p className="mt-1 text-[13px] text-[#9b9487]">
                          Drag & drop or click to browse
                        </p>

                        <p className="mt-2 text-[11px] text-[#5d5d5d]">
                          PNG, JPG, WEBP • Max {MAX_IMAGES} files
                        </p>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>

                    {/* Images Grid */}
                    {images.length > 0 && (
                      <div className="mt-5 grid grid-cols-3 sm:grid-cols-4 gap-3">

                        {images.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-2xl overflow-hidden border border-[#2d2d2d] bg-[#141414] group"
                          >
                            <img
                              src={img.url}
                              alt={`preview-${idx}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center text-[#ffb4ab] opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>

                            {idx === 0 && (
                              <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-[#FFD700] text-[#3d3200] text-[9px] font-black tracking-wide">
                                COVER
                              </div>
                            )}
                          </div>
                        ))}

                        {!atMax && (
                          <button
                            type="button"
                            onClick={() =>
                              fileInputRef.current?.click()
                            }
                            className="aspect-square rounded-2xl border-2 border-dashed border-[#353535] hover:border-[#FFD700]/50 bg-[#141414]/70 hover:bg-[#181818] flex items-center justify-center text-[#666] hover:text-[#FFD700] transition-all duration-300"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-auto relative overflow-hidden w-full rounded-2xl bg-[#FFD700] py-4 text-[14px] font-bold tracking-[0.15em] uppercase text-[#2d2400] shadow-[0_10px_40px_rgba(255,215,0,0.22)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Publishing...' : 'Publish Listing'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <style>{`
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

        ::-webkit-scrollbar {
          width: 0;
          height: 0;
        }

        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
    </div>
  );
};

export default CreateProduct;