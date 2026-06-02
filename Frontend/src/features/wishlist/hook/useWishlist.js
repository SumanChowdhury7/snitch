import {addToWishlist} from "../service/wishlist.api.js";

import {setWishlist, setLoading, setError} from "../state/wishlist.slice.js";
import {useDispatch, useSelector} from "react-redux";

export const useWishlist = () => {
    const dispatch = useDispatch();
    const {wishlist, loading, error} = useSelector((state) => state.wishlist);

    async function handleAddToWishlist({productId, variantId}) {
        dispatch(setLoading(true));
        try {
            const data = await addToWishlist({productId, variantId});
            dispatch(setWishlist(data.wishList));
            return data.wishList;
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetWishlist() {
        dispatch(setLoading(true));
        try {
            const data = await getWishlist();
            dispatch(setWishlist(data.wishlist));
            return data.wishlist;
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    return { wishlist, loading, error, handleAddToWishlist, handleGetWishlist };
};
