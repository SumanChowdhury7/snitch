import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { createAddress, getAddresses } from '../controllers/address.controller.js';

const router = express.Router();

router.post('/create-address', authenticateUser, createAddress);
router.get('/get-addresses', authenticateUser, getAddresses);

export default router;