import { setSellerProducts, setError, setLoading, setAllProducts } from "../state/product.slice";
import { getSellerProducts, createProduct, updateProduct, deleteProduct, getAllProducts } from "../services/product.api";
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

    async function handleUpdateProduct(id, formData) {
        dispatch(setLoading(true));
        try {
            const data = await updateProduct(id, formData);
            await handleGetSellerProducts();
            return data;
        } catch (error) {
            dispatch(setError(error?.response?.data?.message || error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleDeleteProduct(id) {
        dispatch(setLoading(true));
        try {
            const data = await deleteProduct(id);
            await handleGetSellerProducts();
            return data;
        } catch (error) {
            dispatch(setError(error?.response?.data?.message || error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetAllProducts() {
    dispatch(setLoading(true));

    try {
        const data = await getAllProducts();

        dispatch(setAllProducts(data.products));

        return data.products;

    } catch (error) {
        dispatch(setError(error.message));

    } finally {
        dispatch(setLoading(false));
    }
}

    return { handleGetSellerProducts, handleGetAllProducts, handleCreateProduct, handleUpdateProduct, handleDeleteProduct };
};