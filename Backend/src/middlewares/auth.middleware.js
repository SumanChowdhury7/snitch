import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

import userModel from "../models/user.model.js";

export const authenticateUser = async (req, res, next) => {
    const token = req.cookies.token ;
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: 'Unauthorized.' });
    }
};

export const authenticateSeller = async (req, res, next) => {
    const token = req.cookies.token ;

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }
        if (user.role !== 'seller') {
            return res.status(403).json({ message: 'Access denied. Not a seller.' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: 'Unauthorized.' });
    }
};