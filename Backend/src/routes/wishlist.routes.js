import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlist.controller.js';


const router = express.Router();

router.post('/add/:productId/:variantId', authenticateUser, addToWishlist);
router.post('/add/:productId', authenticateUser, addToWishlist);
router.delete('/remove/:productId/:variantId', authenticateUser, removeFromWishlist);
router.delete('/remove/:productId', authenticateUser, removeFromWishlist);
router.get('/', authenticateUser, getWishlist);

export default router;