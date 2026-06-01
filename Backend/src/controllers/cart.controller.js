import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";

import { createOrder } from "../services/payment.service.js";
import { getCartDetails } from "../dao/cart.dao.js";
import paymentModel from "../models/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";



export const addToCart = async (req, res) => {
    const userId = req.user._id;
    const { productId, variantId } = req.params;
    const { quantity = 1 } = req.body;

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    });

    if (!product) {
        return res.status(404).json({ 
            message: "Product or variant not found", 
            success: false 
        });
    }

    const stock = await stockOfVariant(productId, variantId);

    const cart = (  await cartModel.findOne({ user: userId })) || await cartModel.create({ user: userId});

    const isProductAlreadyInCart = cart.items.some((item) => item.product.toString() === productId && item.variant?.toString() === variantId);

    if (isProductAlreadyInCart) {
       const quantityInCart = cart.items.find((item) => item.product.toString() === productId && item.variant?.toString() === variantId)?.quantity || 0;
         if (quantityInCart + quantity > stock) {
            return res.status(400).json({ 
                message: `Only ${stock} items left in stock. And you already have ${quantityInCart} in your cart.`, 
                success: false 
            });
         }

         await cartModel.findOneAndUpdate(
            { user: userId, "items.product": productId, "items.variant": variantId },
            { $inc: { "items.$.quantity": quantity } },
            { new: true }
        );

        return res.status(200).json({ 
            message: "Cart updated successfully", 
            success: true 
        });

    }
    if (quantity > stock) {
        return res.status(400).json({ 
            message: `Only ${stock} items left in stock.`, 
            success: false 
        });
    }

    const variant = product.variants.id(variantId);

    cart.items.push({
        product: productId,
        variant: variantId,
        quantity,
        price: variant.price,
    });
    await cart.save();

    return res.status(200).json({ 
        message: "Product added to cart successfully", 
        success: true 
    });
};

export const getCart = async (req, res) => {
    const user = req.user;

    let cart = await getCartDetails(user._id);
    
if (!cart) {
    cart = await cartModel.create({ user: user._id});
}

    return res.status(200).json({ 
        message: "Cart retrieved successfully", 
        success: true,
        cart
    });
};

export const updateItemQuantity = async (req, res) => {
    const userId = req.user._id;
    const { productId, variantId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
        return res.status(400).json({ 
            message: "Quantity must be greater than 0", 
            success: false 
        });
    }

    const stock = await stockOfVariant(productId, variantId);
    if (quantity > stock) {
        return res.status(400).json({ 
            message: `Only ${stock} items left in stock.`, 
            success: false 
        });
    }

    const updatedCart = await cartModel.findOneAndUpdate(
        { user: userId, "items.product": productId, "items.variant": variantId },
        { $set: { "items.$.quantity": quantity } },
        { new: true }
    );

    if (!updatedCart) {
        return res.status(404).json({ 
            message: "Item not found in cart", 
            success: false 
        });
    }

    return res.status(200).json({ 
        message: "Cart updated successfully", 
        success: true,
        cart: updatedCart
    });
};

export const removeItem = async (req, res) => {
    const userId = req.user._id;
    const { productId, variantId } = req.params;

    const updatedCart = await cartModel.findOneAndUpdate(
        { user: userId },
        { $pull: { items: { product: productId, variant: variantId } } },
        { new: true }
    );

    if (!updatedCart) {
        return res.status(404).json({ 
            message: "Cart not found", 
            success: false 
        });
    }

    return res.status(200).json({ 
        message: "Item removed from cart successfully", 
        success: true,
        cart: updatedCart
    });
};

export const createOrderController = async (req, res) => {

const cart = await getCartDetails(req.user._id);

if (!cart || cart[0].items.length === 0) {
    return res.status(400).json({
        message: "Cart is empty",
        success: false
    });
}


const order = await createOrder({amount: cart[0].totalPrice, currency: cart[0].currency});

const payment = await paymentModel.create({
    user: req.user._id,
    razorpay:{
      orderId: order.id,
    },
    price: {
      amount: cart[0].totalPrice,
      currency: cart[0].currency
    },
    orderItems: cart[0].items.map(item => ({
      title: item.product.title,
      productId: item.product._id,
      variantId: item.variant,
      quantity: item.quantity,
      price: {
        amount: item.product.variants.price.amount || item.product.price.amount,
        currency: item.product.variants.price.currency || item.product.price.currency
      },
      images: item.product.variants.images,
      description: item.product.description

    }))
});

return res.status(200).json({
    message: "Order created successfully",
    success: true,
    order
});
}

export const verifyOrderController = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const payment = await paymentModel.findOne({ 
    "razorpay.orderId": razorpay_order_id,
    status: "pending" 
  });
   
  if(!payment) {
    return res.status(400).json({
      message: "Payment not found",
      success: false
    });
  }

  const isPaymentValid = await validatePaymentVerification({
    order_id: razorpay_order_id,
    payment_id: razorpay_payment_id,

  }, razorpay_signature, process.env.RAZORPAY_KEY_SECRET);

  if (!isPaymentValid) {
    payment.status = "failed";
    await payment.save();
    return res.status(400).json({
      message: "Payment verification failed",
      success: false
    });
  }

  payment.status = "paid";
  payment.razorpay.paymentId = razorpay_payment_id;
  payment.razorpay.signature = razorpay_signature;
  await payment.save();

  return res.status(200).json({
    message: "Payment verified successfully",
    success: true
  });
}

export const getOrderDetailsController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const payment = await paymentModel.findOne({ 
      "razorpay.orderId": orderId,
      user: req.user._id
    });
    
    if (!payment) {
      return res.status(404).json({
        message: "Order not found",
        success: false
      });
    }

    return res.status(200).json({
      message: "Order details retrieved successfully",
      success: true,
      order: payment
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to retrieve order details",
      success: false
    });
  }
};