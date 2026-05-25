import React, { useEffect, useMemo, useState } from "react";
import { useProduct } from "../hook/useProduct";
import { useParams } from "react-router";
import {
  Package,
  Boxes,
  Plus,
  Minus,
  IndianRupee,
  Layers3,
  Image as ImageIcon,
  Upload,
  AlertTriangle,
  X,
} from "lucide-react";

const currencySymbols = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
};

const SellerProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [variantForm, setVariantForm] = useState({
    images: [],
    stock: "",
    price: "",
    currency: "INR",
    attributes: {},
  });

  const handleAddAttribute = () => {
    setVariantForm((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [`attribute_${Object.keys(prev.attributes).length + 1}`]: "",
      },
    }));
  };

  const handleRemoveAttribute = (keyToRemove) => {
    setVariantForm((prev) => {
      const updatedAttributes = { ...prev.attributes };
      delete updatedAttributes[keyToRemove];
      return {
        ...prev,
        attributes: updatedAttributes,
      };
    });
  };

  const handleAttributeKeyChange = (oldKey, newKey) => {
    setVariantForm((prev) => {
      const updatedAttributes = {};
      Object.keys(prev.attributes).forEach((k) => {
        if (k === oldKey) {
          updatedAttributes[newKey] = prev.attributes[oldKey];
        } else {
          updatedAttributes[k] = prev.attributes[k];
        }
      });
      return {
        ...prev,
        attributes: updatedAttributes,
      };
    });
  };

  const handleAttributeValueChange = (key, value) => {
    setVariantForm((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [key]: value,
      },
    }));
  };

  const { ProductId } = useParams();

  const {
    handleGetProductDetails,
    handleAddProductVariant
  } = useProduct();

  async function fetchProductDetails() {
    try {
      const data = await handleGetProductDetails(ProductId);
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  }

  useEffect(() => {
    fetchProductDetails();
  }, [ProductId]);

  const totalStock = useMemo(() => {
    if (!product?.variants) return 0;

    return product.variants.reduce(
      (acc, variant) => acc + (variant.stock || 0),
      0
    );
  }, [product]);

  function handleVariantInput(e) {
    const { name, value } = e.target;

    setVariantForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  

  async function handleCreateVariant(e) {
    e.preventDefault();

    try {
      const formData = new FormData();

      if (variantForm.images && variantForm.images.length > 0) {
        variantForm.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      formData.append("stock", variantForm.stock);

      const attributesObj = {};
      Object.entries(variantForm.attributes).forEach(([key, val]) => {
        if (key.trim()) {
          attributesObj[key.trim().toLowerCase()] = val;
        }
      });

      formData.append("attributes", JSON.stringify(attributesObj));

      formData.append("priceAmount", variantForm.price);
formData.append("priceCurrency", variantForm.currency);

      // =========================
      // YOUR API CALL HERE
      // =========================

      // await handleCreateVariant(ProductId, formData);

      const newVariant = {
  images: variantForm.images.map((file) => ({
    url: URL.createObjectURL(file),
    file: file,
  })),
  stock: Number(variantForm.stock),
  attributes: attributesObj,
  price: {
    amount: Number(variantForm.price),
    currency: variantForm.currency,
  },
};

      setProduct((prev) => ({
        ...prev,
        variants: [...prev.variants, newVariant],
      }));
      console.log(variantForm);

      await handleAddProductVariant(ProductId, newVariant);

      setVariantForm({
        images: [],
        stock: "",
        price: "",
        currency: "INR",
        attributes: {},
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  function increaseStock(index) {
    const updatedVariants = [...product.variants];

    updatedVariants[index].stock += 1;

    setProduct((prev) => ({
      ...prev,
      variants: updatedVariants,
    }));
  }

  function decreaseStock(index) {
    const updatedVariants = [...product.variants];

    if (updatedVariants[index].stock > 0) {
      updatedVariants[index].stock -= 1;
    }

    setProduct((prev) => ({
      ...prev,
      variants: updatedVariants,
    }));
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 md:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ================= PRODUCT HEADER ================= */}

        <div className="bg-[#171717] border border-yellow-500/10 rounded-[32px] p-6 md:p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* IMAGE */}

            <div className="w-full lg:w-[420px]">
              <div className="aspect-square rounded-[28px] overflow-hidden border border-yellow-500/10 bg-[#101010]">
                <img
                  src={
                    product?.images?.[0]?.url ||
                    "https://placehold.co/600x600/111/FFF?text=Product"
                  }
                  alt={product?.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* DETAILS */}

            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-full text-sm w-fit">
                  <Package size={16} />
                  Seller Product
                </div>

                <div>
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                    {product?.title}
                  </h1>

                  <p className="text-zinc-400 mt-4 leading-relaxed max-w-3xl">
                    {product?.description}
                  </p>
                </div>

                {/* STATS */}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard
                    label="Base Price"
                    value={`${currencySymbols[product?.price?.currency]}${product?.price?.amount}`}
                  />

                  <StatCard
                    label="Variants"
                    value={product?.variants?.length}
                  />

                  <StatCard
                    label="Total Stock"
                    value={totalStock}
                  />
                </div>
              </div>

              <div className="mt-8 text-sm text-zinc-500">
                Created:{" "}
                {new Date(product?.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* ================= VARIANTS ================= */}

        <div className="space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center">
                <Layers3 />
              </div>

              <div>
                <h2 className="text-2xl font-semibold">
                  Product Variants
                </h2>

                <p className="text-zinc-500 text-sm mt-1">
                  Manage stock of every variant.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="h-[52px] px-6 rounded-2xl bg-yellow-400 text-black font-semibold hover:scale-[1.02] transition-all flex items-center gap-2 shadow-lg shadow-yellow-400/10"
            >
              <Plus size={20} />
              Create Variant
            </button>
          </div>

          {product?.variants?.length === 0 ? (
            <div className="bg-[#171717] border border-dashed border-yellow-500/10 rounded-[32px] p-16 text-center">
              <div className="w-20 h-20 rounded-full bg-yellow-500/10 mx-auto flex items-center justify-center mb-5 text-yellow-400">
                <Boxes size={36} />
              </div>

              <h3 className="text-xl font-semibold">
                No Variants Available
              </h3>

              <p className="text-zinc-500 mt-2">
                Create your first product variant.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {product?.variants?.map((variant, index) => (
                <div
                  key={index}
                  className="bg-[#171717] border border-yellow-500/10 rounded-[30px] p-5"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* IMAGE */}

                    <div className="w-full sm:w-[160px]">
                      <div className="aspect-square rounded-2xl overflow-hidden bg-[#101010] border border-yellow-500/10">
                        {variant?.images?.[0]?.url ? (
                          <img
                            src={variant?.images?.[0]?.url}
                            alt="variant"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-600">
                            <ImageIcon size={36} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* DETAILS */}

                    <div className="flex-1 flex flex-col justify-between gap-6">
                      <div className="space-y-4">
                        {/* ATTRIBUTES */}

                        <div className="flex flex-wrap gap-2">
                          {Object.entries(
                            variant?.attributes || {}
                          ).map(([key, value]) => (
                            <div
                              key={key}
                              className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-300 text-sm"
                            >
                              {key}: {value}
                            </div>
                          ))}
                        </div>

                        {/* PRICE + STOCK */}

                        <div className="flex flex-wrap gap-5 text-sm">
                          <div className="text-zinc-400">
                            Price:
                            <span className="text-white ml-2 font-medium">
                              {
                                currencySymbols[
                                  variant?.price?.currency
                                ]
                              }
                              {variant?.price?.amount}
                            </span>
                          </div>

                          <div className="text-zinc-400">
                            Stock:
                            <span className="text-white ml-2 font-medium">
                              {variant?.stock}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}

                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => decreaseStock(index)}
                            className="w-11 h-11 rounded-2xl bg-[#101010] border border-yellow-500/10 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all"
                          >
                            <Minus size={18} />
                          </button>

                          <div className="min-w-[50px] text-center font-semibold text-lg">
                            {variant?.stock}
                          </div>

                          <button
                            onClick={() => increaseStock(index)}
                            className="w-11 h-11 rounded-2xl bg-yellow-400 text-black flex items-center justify-center hover:scale-105 transition-all"
                          >
                            <Plus size={18} />
                          </button>
                        </div>

                        {variant?.stock < 5 && (
                          <div className="flex items-center gap-2 text-yellow-400 text-sm">
                            <AlertTriangle size={16} />
                            Low Stock
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= CREATE VARIANT MODAL ================= */}
        {isModalOpen && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setIsModalOpen(false)}
          >
            <div 
              className="bg-[#171717] border border-yellow-500/10 rounded-[32px] w-full max-w-3xl p-6 md:p-8 relative my-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* CLOSE BUTTON */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#101010] border border-yellow-500/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-yellow-400 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-8 pr-12">
                <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center shrink-0">
                  <Plus />
                </div>

                <div>
                  <h2 className="text-2xl font-semibold">
                    Create Product Variant
                  </h2>

                  <p className="text-zinc-500 text-sm mt-1">
                    Add new sizes, colors, stock and dynamic attributes.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleCreateVariant}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* IMAGE PICKER */}

                <div className="md:col-span-2">
                  <div className="space-y-3">
                    <label className="text-sm text-zinc-400 font-medium">
                      Variant Images
                    </label>

                    {variantForm.images && variantForm.images.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {variantForm.images.map((img, idx) => (
                          <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-yellow-500/10 bg-[#101010] relative group">
                            <img
                              src={URL.createObjectURL(img)}
                              alt={`preview-${idx}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setVariantForm((prev) => ({
                                  ...prev,
                                  images: prev.images.filter((_, i) => i !== idx),
                                }));
                              }}
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500/80 transition-all cursor-pointer"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}

                        {/* Add More card */}
                        <label className="aspect-square rounded-2xl border border-dashed border-yellow-500/20 bg-[#101010]/30 hover:border-yellow-400/40 transition-all flex flex-col items-center justify-center cursor-pointer text-zinc-500 gap-2">
                          <Upload size={20} className="text-yellow-400" />
                          <span className="text-xs">Add More</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                              const files = Array.from(e.target.files);
                              setVariantForm((prev) => ({
                                ...prev,
                                images: [...prev.images, ...files],
                              }));
                            }}
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="w-full min-h-[220px] rounded-[28px] border border-dashed border-yellow-500/20 bg-[#101010] hover:border-yellow-400/40 transition-all flex items-center justify-center overflow-hidden cursor-pointer">
                        <div className="flex flex-col items-center gap-3 text-zinc-500">
                          <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                            <Upload size={28} />
                          </div>

                          <div className="text-center">
                            <p className="font-medium text-white text-sm">
                              Choose Variant Images
                            </p>

                            <p className="text-xs mt-0.5">
                              PNG, JPG, WEBP (Multiple allowed)
                            </p>
                          </div>
                        </div>

                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            setVariantForm((prev) => ({
                              ...prev,
                              images: files,
                            }));
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* DYNAMIC ATTRIBUTES */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between border-b border-yellow-500/10 pb-2">
                    <label className="text-sm text-zinc-400 font-medium">
                      Product Attributes
                    </label>
                    <button
                      type="button"
                      onClick={handleAddAttribute}
                      className="text-yellow-400 hover:text-yellow-300 text-xs font-semibold flex items-center gap-1 bg-yellow-500/10 px-3 py-1.5 rounded-xl transition-all"
                    >
                      <Plus size={14} /> Add Attribute
                    </button>
                  </div>

                  <div className="space-y-3">
                    {Object.keys(variantForm.attributes).length === 0 ? (
                      <div className="bg-[#101010]/30 border border-dashed border-yellow-500/10 rounded-2xl p-6 text-center text-zinc-500 text-sm">
                        No attributes added yet. Click "Add Attribute" to customize variant specifications (e.g. color, size, fit).
                      </div>
                    ) : (
                      Object.entries(variantForm.attributes).map(([key, val], index) => (
                        <div 
                          key={index} 
                          className="flex items-end gap-3 bg-[#101010]/50 p-4 rounded-2xl border border-yellow-500/5"
                        >
                          <div className="flex-1">
                            <Input
                              label="Key"
                              placeholder="e.g. color"
                              value={key}
                              onChange={(e) => handleAttributeKeyChange(key, e.target.value)}
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              label="Value"
                              placeholder="e.g. Black"
                              value={val}
                              onChange={(e) => handleAttributeValueChange(key, e.target.value)}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttribute(key)}
                            className="h-[56px] w-[56px] min-w-[56px] rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-all border border-red-500/10 cursor-pointer"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <Input
                  label="Stock"
                  type="number"
                  name="stock"
                  value={variantForm.stock}
                  onChange={handleVariantInput}
                  placeholder="10"
                />

                <Input
                  label="Price"
                  type="number"
                  name="price"
                  value={variantForm.price}
                  onChange={handleVariantInput}
                  placeholder="2999"
                />

                {/* CURRENCY */}

                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">
                    Currency
                  </label>

                  <select
                    name="currency"
                    value={variantForm.currency}
                    onChange={handleVariantInput}
                    className="w-full h-[56px] rounded-2xl bg-[#101010] border border-yellow-500/10 px-4 outline-none focus:border-yellow-400 transition-all text-white"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                    <option value="CNY">CNY</option>
                  </select>
                </div>

                {/* BUTTONS */}

                <div className="md:col-span-2 pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 h-[58px] rounded-2xl bg-[#101010] border border-yellow-500/10 text-white font-semibold hover:bg-zinc-900 transition-all duration-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-[58px] rounded-2xl bg-yellow-400 text-black font-semibold hover:scale-[1.01] hover:bg-yellow-300 transition-all duration-300 cursor-pointer"
                  >
                    Create Variant
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-zinc-400">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-[56px] rounded-2xl bg-[#101010] border border-yellow-500/10 px-4 outline-none focus:border-yellow-400 transition-all"
      />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-[#101010] border border-yellow-500/10 rounded-2xl p-5">
      <p className="text-zinc-500 text-sm mb-2">
        {label}
      </p>

      <h3 className="text-2xl font-semibold">
        {value}
      </h3>
    </div>
  );
}

export default SellerProductDetails;