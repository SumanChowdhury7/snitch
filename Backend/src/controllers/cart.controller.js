import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";

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

    cart.items.push({
        product: productId,
        variant: variantId,
        quantity,
        price: product.price,
    });
    await cart.save();

    return res.status(200).json({ 
        message: "Product added to cart successfully", 
        success: true 
    });
};

export const getCart = async (req, res) => {
    const user = req.user;
    let cart = await cartModel.findOne({ user: user._id }).populate('items.product')
if (!cart) {
    cart = await cartModel.create({ user: user._id});
}

    return res.status(200).json({ 
        message: "Cart retrieved successfully", 
        success: true,
        cart
    });
};