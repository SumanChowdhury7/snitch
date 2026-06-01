import axios from "axios";

const cartApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true,
});

export const addItem = async ({productId, variantId, quantity = 1}) => {
    try {
        const response = await cartApiInstance.post(`/add/${productId}/${variantId}`, { quantity });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to add item to cart");
    }
}

export const getCart = async () => {
    try {
        const response = await cartApiInstance.get('/');
        return response.data;
        console.log(response.data);
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch cart");
    }
}

export const updateItemQuantity = async ({productId, variantId, quantity}) => {
    try {
        const response = await cartApiInstance.put(`/update/${productId}/${variantId}`, { quantity });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to update item quantity");
    }
}

export const removeItem = async ({productId, variantId}) => {
    try {
        const response = await cartApiInstance.delete(`/remove/${productId}/${variantId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to remove item from cart");
    }
}

export const createCartOrder = async () => {
    try {
        const response = await cartApiInstance.post('/payment/create/order');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to create order");
    }
}

export const verifyCartOrder = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    try {
        const response = await cartApiInstance.post('/payment/verify/order', {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to verify order");
    }                   
}

export const getOrderDetails = async (orderId) => {
    try {
        const response = await cartApiInstance.get(`/payment/order/${orderId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch order details");
    }
}