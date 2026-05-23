import React, { useRef, useState } from 'react';

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

const EditProduct = ({
  editingProduct,
  setEditingProduct,
  editFormData,
  setEditFormData,
  editExistingImages,
  setEditExistingImages,
  editNewImages,
  setEditNewImages,
  handleUpdateProduct,
  loading,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  if (!editingProduct) return null;

  const atMaxImages =
    editExistingImages.length + editNewImages.length >= MAX_IMAGES;

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addEditFiles = (files) => {
    const slots =
      MAX_IMAGES - (editExistingImages.length + editNewImages.length);

    if (slots <= 0) return;

    const valid = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, slots);

    setEditNewImages((prev) => [
      ...prev,
      ...valid.map((f) => ({
        file: f,
        url: URL.createObjectURL(f),
      })),
    ]);
  };

  const handleEditFileChange = (e) => {
    addEditFiles(e.target.files);
  };

  const handleEditDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addEditFiles(e.dataTransfer.files);
  };

  const removeExistingImage = (idx) => {
    setEditExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeNewImage = (idx) => {
    setEditNewImages((prev) => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editExistingImages.length + editNewImages.length === 0) {
      alert('Please keep or upload at least one image.');
      return;
    }

    const data = new FormData();

    data.append('title', editFormData.title);
    data.append('description', editFormData.description);
    data.append('priceAmount', editFormData.priceAmount);
    data.append('priceCurrency', editFormData.priceCurrency);

    data.append(
      'existingImages',
      JSON.stringify(editExistingImages)
    );

    editNewImages.forEach((img) => {
      data.append('images', img.file);
    });

    const result = await handleUpdateProduct(
      editingProduct._id,
      data
    );

    if (result) {
      alert('Product updated successfully!');

      setEditingProduct(null);

      editNewImages.forEach((img) =>
        URL.revokeObjectURL(img.url)
      );

      setEditNewImages([]);
    } else {
      alert('Failed to update product.');
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        style={glassStyle}
        className="w-full max-w-[1100px] max-h-[90vh] rounded-[30px] overflow-hidden flex flex-col relative animate-fade-in shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#FFD700]" />

        {/* Header */}
        <div className="px-6 py-5 border-b border-white/[0.05] bg-[#0c0c0c] flex items-center justify-between">
          <div>
            <h3 className="text-[19px] font-black tracking-wide text-white">
              Edit Product Showcase
            </h3>

            <p className="text-[11px] text-[#9f988c] uppercase tracking-wider mt-1">
              Editing: {editingProduct.title}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setEditingProduct(null)}
            className="w-8 h-8 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] flex items-center justify-center text-[#c8bea5]"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 md:p-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT */}
            <div className="space-y-6">
              <div>
                <label className={labelCls}>
                  Product Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  className={inputCls}
                  required
                />
              </div>

              <div>
                <label className={labelCls}>
                  Description
                </label>

                <textarea
                  rows={5}
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  className={`${inputCls} resize-none`}
                  required
                />
              </div>

              <div>
                <label className={labelCls}>
                  Pricing
                </label>

                <div className="grid grid-cols-[1fr_120px] gap-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFD700]">
                      {
                        currencySymbols[
                          editFormData.priceCurrency
                        ]
                      }
                    </span>

                    <input
                      type="number"
                      name="priceAmount"
                      value={editFormData.priceAmount}
                      onChange={handleEditChange}
                      className={`${inputCls} pl-10`}
                    />
                  </div>

                  <select
                    name="priceCurrency"
                    value={editFormData.priceCurrency}
                    onChange={handleEditChange}
                    className={inputCls}
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
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleEditDrop}
                onClick={() =>
                  !atMaxImages &&
                  fileInputRef.current?.click()
                }
                className={`border rounded-[24px] px-5 py-6 text-center transition-all duration-300 ${
                  isDragging
                    ? 'border-[#FFD700] bg-[#FFD700]/5'
                    : 'border-[#2d2d2d] bg-[#141414]'
                } ${
                  atMaxImages
                    ? 'opacity-40 pointer-events-none'
                    : 'cursor-pointer'
                }`}
              >
                <h4 className="text-white font-bold">
                  Upload Images
                </h4>

                <p className="text-[#9b9487] text-sm mt-1">
                  Drag & drop or click
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleEditFileChange}
                />
              </div>

              <div className="grid grid-cols-4 gap-3 mt-5">
                {editExistingImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden"
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeExistingImage(idx)
                      }
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-6 h-6"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {editNewImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden border border-[#FFD700]/30"
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-6 h-6"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-white/[0.05] flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="px-7 py-3 rounded-2xl border border-white/[0.08] text-[#c8bea5]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-9 py-3 rounded-2xl bg-[#FFD700] text-[#2d2400] font-bold"
            >
              {loading
                ? 'Saving...'
                : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;