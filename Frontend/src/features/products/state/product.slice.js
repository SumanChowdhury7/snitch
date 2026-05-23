import { createSlice } from "@reduxjs/toolkit";
import { getSellerProducts, getAllProducts } from "../services/product.api";

const productSlice = createSlice({
    name: "product",
    initialState: {
        sellerProducts: [],
        allProducts: [],
        loading: false,
        error: null
    },
    reducers: {
        setSellerProducts: (state, action) => {
            state.sellerProducts = action.payload;
        },
        setAllProducts: (state, action) => {
            state.allProducts = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const { setSellerProducts, setAllProducts, setLoading, setError } = productSlice.actions;
export default productSlice.reducer;