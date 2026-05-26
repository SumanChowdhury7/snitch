import axios from "axios";

const cartApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true,
});

export const addItem = async ({productId, variantId}) => {
    try {
        const response = await cartApiInstance.post(`/add/${productId}/${variantId}`,{quantity : 1});
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to add item to cart");
    }
}
    