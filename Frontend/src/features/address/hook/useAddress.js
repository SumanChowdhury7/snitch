import {setAddresses, setLoading, setError} from "../state/address.slice";
import { createAddress, getAddresses } from "../service/address.api";
import { useDispatch, useSelector } from "react-redux";

export const useAddress = () => {
    const dispatch = useDispatch();
    const { addresses, loading, error } = useSelector((state) => state.address);

    async function handleCreateAddress({name, phone, addressLine1, addressLine2, city, state, postalCode }) {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const newAddress = await createAddress({name, phone, addressLine1, addressLine2, city, state, postalCode });
            
            dispatch(setAddresses([...addresses, newAddress]));
        } catch (err) {
            dispatch(setError(err.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetAddresses() {
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const fetchedAddresses = await getAddresses();
            console.log(fetchedAddresses)
            dispatch(setAddresses(fetchedAddresses));
        } catch (err) {
            dispatch(setError(err.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    return { addresses, loading, error, handleCreateAddress, handleGetAddresses };
};
