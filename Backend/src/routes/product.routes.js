import {Router} from 'express';
import { authenticateSeller } from '../middlewares/auth.middleware.js';
import { createProduct, getSellerProducts, updateProduct, deleteProduct, getAllProducts, getProductDetails } from '../controllers/product.controller.js';
import { validatePost } from '../validator/product.validator.js';
import multer from 'multer';


const upload = multer({
    storage: multer.memoryStorage(),
    limits: { 
        fileSize: 5 * 1024 * 1024 
    },
})

const router = Router();

router.post('/', authenticateSeller, upload.array('images', 7), validatePost, createProduct);
router.get('/seller', authenticateSeller, getSellerProducts);
router.put('/:id', authenticateSeller, upload.array('images', 7), validatePost, updateProduct);
router.delete('/:id', authenticateSeller, deleteProduct);

router.get('/', getAllProducts);
router.get('/detail/:id',getProductDetails)

export default router;