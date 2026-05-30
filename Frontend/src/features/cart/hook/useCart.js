import { addItem, getCart, updateItemQuantity, removeItem } from "../service/cart.api";
import { useDispatch, useSelector } from "react-redux";
import { setCart, setLoading, setError } from "../state/cart.slice";

export const useCart = () => {
    const dispatch = useDispatch();
    const { cart, loading, error } = useSelector((state) => state.cart);

    async function handleAddItem({ productId, variantId, quantity = 1 }) {
        dispatch(setLoading(true));
        try {
            const data = await addItem({ productId, variantId, quantity });
            // Fetch updated and fully populated cart
            await handleGetCart();
            return data;
        } catch (error) {
            dispatch(setError(error.message));
            console.error("Error adding item to cart:", error);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetCart() {
        dispatch(setLoading(true));
        try {
            const data = await getCart();
            // data.cart is the cart object returned from server
            dispatch(setCart(data.cart));
            return data.cart;
        } catch (error) {
            dispatch(setError(error.message));
            console.error("Error fetching cart:", error);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleUpdateItemQuantity({ productId, variantId, quantity }) {
        dispatch(setLoading(true));
        try {
            const data = await updateItemQuantity({ productId, variantId, quantity });
            // Fetch updated and fully populated cart
            await handleGetCart();
            return data;
        } catch (error) {
            dispatch(setError(error.message));
            console.error("Error updating item quantity:", error);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleRemoveItem({ productId, variantId }) {
        dispatch(setLoading(true));
        try {
            const data = await removeItem({ productId, variantId });
            // Fetch updated and fully populated cart
            await handleGetCart();
            return data;
        } catch (error) {
            dispatch(setError(error.message));
            console.error("Error removing item from cart:", error);
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    return { 
        cart, 
        loading, 
        error, 
        handleAddItem, 
        handleGetCart, 
        handleUpdateItemQuantity, 
        handleRemoveItem 
    };
}
