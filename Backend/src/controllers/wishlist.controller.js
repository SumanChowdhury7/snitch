import wishlistModel from "../models/wishlist.model.js";
import productModel from "../models/product.model.js";

export const addToWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, variantId } = req.params;

        const productExists = await productModel.findById(productId);

        if (!productExists) {
            return res.status(404).json({
                message: "Product not found",
                success: false,
            });
        }

        if (variantId) {
            const variantExists = productExists.variants?.some(
                (variant) => variant._id.toString() === variantId,
            );

            if (!variantExists) {
                return res.status(404).json({
                    message: "Variant not found",
                    success: false,
                });
            }
        }

        const wishlist = await wishlistModel.findOne({ user: userId });
        const newItem = { product: productId };
        if (variantId) newItem.variant = variantId;

        const isAlreadyInWishlist = wishlist?.items?.some((item) => {
            const sameProduct = item.product.toString() === productId;
            const sameVariant = variantId
                ? item.variant?.toString() === variantId
                : !item.variant;
            return sameProduct && sameVariant;
        });

        if (isAlreadyInWishlist) {
            return res.status(400).json({
                message: "Item already in wishlist",
                success: false,
            });
        }

        let wishList;
        if (wishlist) {
            wishlist.items.push(newItem);
            wishList = await wishlist.save();
        } else {
            wishList = await wishlistModel.create({
                user: userId,
                items: [newItem],
            });
        }

        await wishList.populate({
            path: 'items.product',
            select: 'title description price images variants',
        });

        return res.status(201).json({
            message: "Item added to wishlist",
            success: true,
            wishList,
        });
    } catch (error) {
        console.error("Wishlist add error:", error);
        return res.status(500).json({
            message: "Unable to add item to wishlist",
            success: false,
            error: error.message,
        });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const wishlist = await wishlistModel
            .findOne({ user: userId })
            .populate({
                path: 'items.product',
                select: 'title description price images variants',
            });

        if (!wishlist) {
            return res.status(404).json({
                message: "Wishlist not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Wishlist retrieved successfully",
            success: true,
            wishlist,
        });
    } catch (error) {
        console.error("Wishlist get error:", error);
        return res.status(500).json({
            message: "Unable to retrieve wishlist",
            success: false,
            error: error.message,
        });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, variantId } = req.params;

        const wishlist = await wishlistModel.findOne({ user: userId });
        if (!wishlist) {
            return res.status(404).json({
                message: "Wishlist not found",
                success: false,
            });
        }

        wishlist.items = wishlist.items.filter((item) => {
            const sameProduct = item.product.toString() === productId;
            const sameVariant = variantId
                ? item.variant?.toString() === variantId
                : !item.variant;
            return !(sameProduct && sameVariant);
        });

        const wishList = await wishlist.save();

        await wishList.populate({
            path: 'items.product',
            select: 'title description price images variants',
        });

        return res.status(200).json({
            message: "Item removed from wishlist",
            success: true,
            wishList,
        });
    } catch (error) {
        console.error("Wishlist remove error:", error);
        return res.status(500).json({
            message: "Unable to remove item from wishlist",
            success: false,
            error: error.message,
        });
    }
};
