import {Router} from 'express';
import { validateRegisterUser, validateLoginUser } from '../validator/auth.validator.js';
import { register, login, googleCallback, getMe } from '../controllers/auth.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import passport from 'passport';

const router = Router();

router.post('/register', validateRegisterUser, register);
router.post('/login', validateLoginUser, login);
router.get('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:5173  /login' }),googleCallback);
router.get('/me',authenticateUser, getMe);

export default router