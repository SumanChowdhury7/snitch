import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validateAddToCart } from "../validator/cart.validator.js";
import { addToCart, getCart, updateItemQuantity, removeItem } from "../controllers/cart.controller.js";

const router = express.Router();


router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart, addToCart)
router.get('/', authenticateUser, getCart);
router.put('/update/:productId/:variantId', authenticateUser, updateItemQuantity);
router.delete('/remove/:productId/:variantId', authenticateUser, removeItem);

export default router;