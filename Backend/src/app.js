import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import cors from 'cors';
import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import { config } from './config/config.js';
import cartRoutes from './routes/cart.routes.js';

dotenv.config();

const app = express();
// app.use(cors({
//   origin: 'http://localhost:5173', 
//   methiods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true, 
// }));

app.use(passport.initialize());

passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

export default app;