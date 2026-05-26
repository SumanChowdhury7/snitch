import {addItem} from "../service/cart.api";
import {useDispatch} from "react-redux";
import {addItem as addItemToCart} from "../state/cart.slice";


export const useCart = () => {
    const dispatch = useDispatch();
    async function handleAddItem({productId, variantId}) {
        try {
            const data = await addItem({productId, variantId});
            dispatch(addItemToCart(data));
            return data;
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
    }
    return { handleAddItem };
}