import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import mongoose from "mongoose";

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
    let cart = await cartModel.aggregate(
  [
    {
      $match: {
        user: new mongoose.Types.ObjectId(user._id)
      }
    },
    { $unwind: { path: '$items' } },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'items.product'
      }
    },
    { $unwind: { path: '$items.product' } },
    {
      $unwind: { path: '$items.product.variants' }
    },
    {
      $match: {
        $expr: {
          $eq: [
            '$items.variant',
            '$items.product.variants._id'
          ]
        }
      }
    },
    {
      $addFields: {
        itemprice: {
          price: {
            $multiply: [
              '$items.quantity',
              '$items.product.variants.price.amount'
            ]
          },
          currency:
            '$items.product.variants.price.currency'
        }
      }
    },
    {
      $group: {
        _id: '$_id',
        totalPrice: { $sum: '$itemprice.price' },
        currency: {
          $first: '$itemprice.currency'
        },
        items: { $push: '$items' }
      }
    }
  ])
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