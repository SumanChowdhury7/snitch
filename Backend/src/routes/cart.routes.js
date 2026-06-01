import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validateAddToCart, validateUpdateCart } from "../validator/cart.validator.js";
import { addToCart, getCart, updateItemQuantity, removeItem, createOrderController, verifyOrderController, getOrderDetailsController } from "../controllers/cart.controller.js";

const router = express.Router();


router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart, addToCart)
router.get('/', authenticateUser, getCart);
router.put('/update/:productId/:variantId', authenticateUser, validateUpdateCart, updateItemQuantity);
router.delete('/remove/:productId/:variantId', authenticateUser, removeItem);

router.post('/payment/create/order', authenticateUser, createOrderController);
router.post('/payment/verify/order', authenticateUser, verifyOrderController);
router.get('/payment/order/:orderId', authenticateUser, getOrderDetailsController);

export default router;