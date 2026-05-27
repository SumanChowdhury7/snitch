import React from 'react';
import { Link } from 'react-router';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-[#1a1a1a] bg-[#0a0a0a]/90 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto h-16 px-4 sm:px-6 lg:px-10 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="text-[18px] sm:text-[22px] font-black tracking-[0.28em] sm:tracking-[0.35em]"
        >
          SNITCH
        </Link>

        {/* NAV LINKS */}
        <div className="flex items-center gap-3 sm:gap-6">

          <Link
            to="/"
            className="text-[12px] sm:text-sm text-[#8d8d8d] hover:text-[#FFD000] transition"
          >
            Home
          </Link>

          <Link
            to="/wishlist"
            className="text-[12px] sm:text-sm text-[#8d8d8d] hover:text-[#FFD000] transition"
          >
            Wishlist
          </Link>

          <Link
            to="/cart"
            className="text-[12px] sm:text-sm text-[#8d8d8d] hover:text-[#FFD000] transition"
          >
            Cart
          </Link>

        </div>

      </div>
    </header>
  );
};

export default Navbar;