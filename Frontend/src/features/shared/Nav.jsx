import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { User, LogOut } from 'lucide-react';
import { useCart } from '../cart/hook/useCart';
import { useAuth } from '../auth/hook/useAuth';


const Navbar = () => {

  const navigate = useNavigate();
  

  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const cart = useSelector(
    (state) => state.cart?.cart
  );
  const cartData = Array.isArray(cart) ? cart[0] : cart;
  const cartItems = cartData?.items || [];

  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const [openMenu, setOpenMenu] = useState(false);

  const menuRef = useRef(null);

  const { handleGetCart } = useCart();

  /* FETCH CART AGAIN AFTER RELOAD */
  useEffect(() => {

    if (user) {
      handleGetCart();
    }

  }, [user]);

  /* CLOSE MENU */
  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpenMenu(false);
      }

    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };

  }, []);
  const { handleLogout } = useAuth();

  /* LOGOUT */
  const handleLogoutBtn = () => {

      handleLogout();
      navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/90 backdrop-blur-xl">

      <div className="max-w-[1500px] mx-auto h-[72px] px-5 lg:px-8 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="text-[18px] md:text-[22px] font-black tracking-[0.45em] text-white"
        >
          SNITCH
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">

          {/* HOME */}
          <Link
            to="/"
            className="hidden md:block text-[15px] text-[#7a7a7a] hover:text-[#FFD000] transition"
          >
            Home
          </Link>

          {/* WISHLIST */}
          <Link
            to="/wishlist"
            className="hidden md:block text-[15px] text-[#7a7a7a] hover:text-[#FFD000] transition"
          >
            Wishlist
          </Link>

          {/* SELLER DASHBOARD */}
          {user?.role === 'seller' && (
            <Link
              to="/seller/dashboard"
              className="hidden md:block text-[15px] text-[#7a7a7a] hover:text-[#FFD000] transition"
            >
              Dashboard
            </Link>
          )}

          {user?.role === 'seller' && (
            <Link
              to="/seller/create-product"
              className="hidden md:block text-[15px] text-[#7a7a7a] hover:text-[#FFD000] transition"
            >
              Create Product
            </Link>
          )}

          {/* CART */}
          {user && (
            <Link
              to="/cart"
              className="relative w-10 h-10 flex items-center justify-center text-[#8a8a8a] hover:text-[#FFD000] transition"
            >

              {/* COUNT */}
              {totalCartItems > 0 && (
                <span className="absolute -top-0.5 -right-1 text-[10px] font-black text-[#FFD000]">
                  {totalCartItems}
                </span>
              )}

              {/* CART ICON */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-[20px] h-[20px]"
              >
                <path d="M2.25 3a.75.75 0 000 1.5h1.386c.17 0 .32.11.37.272l2.558 8.953a2.25 2.25 0 002.163 1.635h7.543a2.25 2.25 0 002.163-1.635l1.2-4.2A1.5 1.5 0 0018.19 7.5H6.16l-.347-1.214A1.875 1.875 0 004.136 3H2.25z" />
              </svg>

            </Link>
          )}

          {/* PROFILE */}
          {user && (
            <div
              className="relative"
              ref={menuRef}
            >

              <button
                onClick={() =>
                  setOpenMenu(!openMenu)
                }
                className="w-10 h-10 flex items-center justify-center text-[#8a8a8a] hover:text-[#FFD000] transition"
              >
                <User size={18} />
              </button>

              {/* DROPDOWN */}
              {openMenu && (
                <div className="absolute right-0 top-12 w-[220px] bg-[#0d0d0d] border border-white/5 rounded-2xl p-2 shadow-2xl">

                  {/* USER INFO */}
                  <div className="px-4 py-3 border-b border-white/5">

                    <p className="text-[11px] text-[#666] uppercase tracking-[0.18em]">
                      Logged In As
                    </p>

                    <h3 className="mt-2 text-sm font-medium text-white truncate">
                      {user?.fullname}
                    </h3>

                  </div>

                  {/* SELLER DASHBOARD */}
                  {user?.role === 'seller' && (
                    <Link
                      to="/seller/dashboard"
                      onClick={() =>
                        setOpenMenu(false)
                      }
                      className="mt-2 h-11 px-4 rounded-xl flex items-center text-sm text-[#9a9a9a] hover:bg-white/5 hover:text-white transition"
                    >
                      Dashboard
                    </Link>
                  )}

                  {/* LOGOUT */}
                  <button
                    onClick={handleLogoutBtn}
                    className="w-full mt-1 h-11 px-4 rounded-xl flex items-center gap-3 text-sm text-[#9a9a9a] hover:bg-white/5 hover:text-red-400 transition"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </header>
  );
};

export default Navbar;