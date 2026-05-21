import axios from "axios";

const productApiInstance = axios.create({
    baseURL: "/api/products",
    withCredentials: true
})

export async function createProduct(formData) {
    const response = await productApiInstance.post('/', formData);
    return response.data;
}


export async function getSellerProducts() {
    const response = await productApiInstance.get('/seller');
    return response.data;
}

export async function updateProduct(id, formData) {
    const response = await productApiInstance.put(`/${id}`, formData);
    return response.data;
}

export async function deleteProduct(id) {
    const response = await productApiInstance.delete(`/${id}`);
    return response.data;
}
