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

export async function getAllProducts() {
    const response = await productApiInstance.get('/');
    return response.data;
}
export async function getProductDetails(productId) {
    const response = await productApiInstance.get(`/detail/${productId}`);
    return response.data;
}

export async function addProductVariant(productId, newProductVariant) {

    const formData = new FormData();

    newProductVariant.images.forEach((image) => {
        formData.append("images", image.file);
    });

    formData.append(
        "stock",
        newProductVariant.stock
    );

    formData.append(
        "priceAmount",
        newProductVariant.price.amount
    );

    formData.append(
        "priceCurrency",
        newProductVariant.price.currency
    );

    formData.append(
        "attributes",
        JSON.stringify(newProductVariant.attributes)
    );

    const response = await productApiInstance.post(
        `/${productId}/variants`,
        formData
    );

    return response.data;
}