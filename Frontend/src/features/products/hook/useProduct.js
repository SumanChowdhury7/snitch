import { setSellerProducts, setError, setLoading } from "../state/product.slice";
import { getSellerProducts, createProduct } from "../services/product.api";
import { useDispatch } from "react-redux";

export const useProduct = () => {
    const dispatch = useDispatch();

    async function handleCreateProduct(formData) {
        dispatch(setLoading(true));
        try {
            const data = await createProduct(formData);
            return data;
        } catch (error) {
            dispatch(setError(error?.response?.data?.message || error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetSellerProducts() {
        dispatch(setLoading(true));
        try {
            const data = await getSellerProducts();
            dispatch(setSellerProducts(data.products));
            return data.products;
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    return { handleGetSellerProducts, handleCreateProduct };
};