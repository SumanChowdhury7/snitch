import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";


export async function createProduct(req, res) {

    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user;

    const images = await Promise.all(req.files.map(async (file) => {
        return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
        })
    }))


    const product = await productModel.create({
        title,
        description,
        price: {
            amount: priceAmount,
            currency: priceCurrency || "INR"
        },
        images,
        seller: seller._id
    })


    res.status(201).json({
        message: "Product created successfully",
        success: true,
        product
    })
}

export async function getSellerProducts(req, res) {
    const seller = req.user;

    if(!seller) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false
        })
    }

    const products = await productModel.find({ seller: seller._id });

    res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    })
}

export async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const seller = req.user;
        const { title, description, priceAmount, priceCurrency, existingImages } = req.body;

        if (!seller) {
            return res.status(401).json({
                message: "Unauthorized",
                success: false
            });
        }

        const product = await productModel.findOne({ _id: id, seller: seller._id });
        if (!product) {
            return res.status(404).json({
                message: "Product not found or unauthorized",
                success: false
            });
        }

        let updatedImages = [];
        if (existingImages) {
            try {
                updatedImages = JSON.parse(existingImages);
            } catch (err) {
                updatedImages = product.images;
            }
        } else {
            updatedImages = product.images;
        }

        // Upload new files if provided
        if (req.files && req.files.length > 0) {
            const newImages = await Promise.all(req.files.map(async (file) => {
                return await uploadFile({
                    buffer: file.buffer,
                    fileName: file.originalname
                });
            }));
            updatedImages = [...updatedImages, ...newImages];
        }

        product.title = title || product.title;
        product.description = description || product.description;
        if (priceAmount !== undefined) {
            product.price = {
                amount: Number(priceAmount),
                currency: priceCurrency || product.price.currency || "INR"
            };
        }
        product.images = updatedImages;

        await product.save();

        res.status(200).json({
            message: "Product updated successfully",
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal server error during update",
            success: false
        });
    }
}

export async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const seller = req.user;

        if (!seller) {
            return res.status(401).json({
                message: "Unauthorized",
                success: false
            });
        }

        const product = await productModel.findOneAndDelete({ _id: id, seller: seller._id });
        if (!product) {
            return res.status(404).json({
                message: "Product not found or unauthorized",
                success: false
            });
        }

        res.status(200).json({
            message: "Product deleted successfully",
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal server error during delete",
            success: false
        });
    }
}