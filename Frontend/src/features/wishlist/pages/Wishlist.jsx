import React from 'react'
import {useWishlist} from "../hook/useWishlist.js";

const Wishlist = () => {
    const {handleGetWishlist} = useWishlist();
  return (
    <div>Wishlist</div>
  )
}

export default Wishlist