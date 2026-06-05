import axios from 'axios';

const addressApiInstance = axios.create({
    baseURL: "/api/addresses",
    withCredentials: true,
});

export const createAddress = async ({name, phone, addressLine1, addressLine2, city, state, postalCode }) => {
    try {
        const response = await addressApiInstance.post('/create-address', {
            name,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to create address");
    }
}

export const getAddresses = async () => {
    try {
        const response = await addressApiInstance.get('/get-addresses');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch addresses");
    }
}