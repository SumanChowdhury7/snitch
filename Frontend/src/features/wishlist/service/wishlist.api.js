import axios from "axios";

const wishlistApiInstance = axios.create({
    baseURL: "/api/wishlist",
    withCredentials: true,
});

export const addToWishlist = async ({productId, variantId}) => {
    try {
        const path = variantId
            ? `/add/${productId}/${variantId}`
            : `/add/${productId}`;
        const response = await wishlistApiInstance.post(path);
        return response.data;
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        throw error;
    }
};

export const getWishlist = async () => {
    try {
        const response = await wishlistApiInstance.get('/');
        return response.data;
    } catch (error) {
        console.error("Error retrieving wishlist:", error);
        throw error;
    }
};

export const removeFromWishlist = async ({productId, variantId}) => {
    try {
        const path = variantId
            ? `/remove/${productId}/${variantId}`
            : `/remove/${productId}`;
        const response = await wishlistApiInstance.delete(path);
        return response.data;
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        throw error;
    }
};
