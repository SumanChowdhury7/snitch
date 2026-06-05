import addressModel from '../models/address.model.js';

export const createAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, phone, addressLine1, addressLine2, city, state, postalCode } = req.body;

        const existingAddress = await addressModel.findOne({ user: userId, addressLine1, city, state, postalCode });
        if (existingAddress) {
            return res.status(400).json({ message: "Address already exists for this user." });
        }

        const newAddress = new addressModel({
            user: userId,
            name,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode
        });

        const savedAddress = await newAddress.save();
        res.status(201).json(savedAddress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAddresses = async (req, res) => {
    try {
        const userId = req.user._id;
        const addresses = await addressModel.find({ user: userId });
        if (addresses.length === 0 || !addresses) {
            return res.status(404).json({ message: "No addresses found for this user." });
        }
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
