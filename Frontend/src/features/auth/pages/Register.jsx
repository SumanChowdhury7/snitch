import React, { useState } from 'react';
import {useAuth} from '../hook/useAuth.js';
import { useNavigate } from 'react-router';

const Register = () => {

const { handleRegister } = useAuth();
const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    password: '',
    isSeller: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({
      email: formData.email,
      contact: formData.contactNumber,
      password: formData.password,
      fullname: formData.fullName,
      isSeller: formData.isSeller
    });
    navigate('/');
  };

  return (
    <div className="bg-[#131313] text-[#e5e2e1] font-sans h-screen w-full overflow-hidden flex flex-col relative">
      {/* Progress Indicator */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-[#353534] z-[100]">
        <div className="h-[2px] w-[30%] bg-[#FFD700]"></div>
      </div>

      {/* TopAppBar */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm">
        <nav className="flex justify-between items-center w-full px-6 md:px-10 h-16 max-w-7xl mx-auto">
          <div className="text-[24px] md:text-[28px] leading-[1.2] font-bold tracking-widest text-[#e5e2e1]">SNITCH</div>
          <div className="hidden md:flex gap-4 items-center">
            <a className="text-[14px] font-medium text-[#d0c6ab] hover:text-[#e5e2e1] transition-colors" href="#">Collections</a>
            <a className="text-[14px] font-medium text-[#d0c6ab] hover:text-[#e5e2e1] transition-colors" href="#">New Arrivals</a>
            <a className="text-[14px] font-medium text-[#d0c6ab] hover:text-[#e5e2e1] transition-colors" href="#">Studio</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-[14px] font-medium text-[#d0c6ab] hover:text-[#e5e2e1] transition-all active:scale-95">Login</button>
            <button className="bg-[#FFD700] text-[#705e00] px-5 py-1.5 rounded-full text-[14px] font-semibold active:scale-95 transition-transform">Sign Up</button>
          </div>
        </nav>
      </header>

      {/* Main Registration Section */}
      <main className="relative h-full w-full flex items-center justify-center pt-8 pb-12">
        {/* Background Hero Image */}
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover object-center scale-105" 
            alt="Premium Streetwear Hero" 
            src="/snitch_fashion_clothing.png"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Registration Card with Internal Scroll */}
        <div 
          className="relative z-10 w-full max-w-md mx-6 rounded-xl p-6 md:p-8 shadow-2xl mt-8 max-h-[80vh] overflow-y-auto no-scrollbar"
          style={{
            background: 'rgba(30, 30, 30, 0.55)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="text-center mb-6">
            <h1 className="text-[28px] font-semibold text-[#e5e2e1] mb-1">Join the Studio</h1>
            <p className="text-[14px] text-[#d0c6ab]">Experience the new standard of digital commerce.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#d0c6ab] ml-1">Full Name</label>
              <input 
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full bg-[#1c1b1b] border border-[#353534] rounded-lg px-4 py-2.5 text-[#e5e2e1] placeholder-[#454747] focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none transition-all text-sm" 
                placeholder="Enter your full name" 
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#d0c6ab] ml-1">Email Address</label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#1c1b1b] border border-[#353534] rounded-lg px-4 py-2.5 text-[#e5e2e1] placeholder-[#454747] focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none transition-all text-sm" 
                placeholder="name@example.com" 
              />
            </div>

            {/* Contact Number */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#d0c6ab] ml-1">Contact Number</label>
              <input 
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                className="w-full bg-[#1c1b1b] border border-[#353534] rounded-lg px-4 py-2.5 text-[#e5e2e1] placeholder-[#454747] focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none transition-all text-sm" 
                placeholder="9845625647" 
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5 relative">
              <label className="text-[13px] font-medium text-[#d0c6ab] ml-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#1c1b1b] border border-[#353534] rounded-lg px-4 py-2.5 text-[#e5e2e1] placeholder-[#454747] focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none transition-all pr-12 text-sm" 
                  placeholder="Min. 8 characters" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d0c6ab] hover:text-[#e5e2e1]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    {showPassword ? (
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    ) : (
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    )}
                    {!showPassword && (
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-3 py-1">
              <input 
                type="checkbox" 
                id="seller" 
                name="isSeller"
                checked={formData.isSeller}
                onChange={handleChange}
                className="w-4 h-4 rounded border-[#353534] bg-[#1c1b1b] text-[#FFD700] focus:ring-[#FFD700] focus:ring-offset-0" 
              />
              <label htmlFor="seller" className="text-[13px] font-medium text-[#d0c6ab]">I want to sell</label>
            </div>

            {/* Primary CTA */}
            <button 
              type="submit"
              className="w-full bg-[#FFD700] text-[#705e00] font-semibold text-[15px] py-3 rounded-lg shadow-lg active:scale-[0.98] transition-all hover:opacity-90 duration-300"
            >
              Sign Up
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-1">
              <div className="h-[1px] flex-grow bg-[#353534]"></div>
              <span className="text-[12px] font-medium text-[#454747]">OR</span>
              <div className="h-[1px] flex-grow bg-[#353534]"></div>
            </div>

            {/* Social Login */}
            <button 
              type="button"
              className="w-full bg-transparent border-[1.5px] border-[#e5e2e1]/20 text-[#e5e2e1] font-semibold text-[14px] py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-white/5 active:scale-[0.98] transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              Continue with Google
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/login" className="text-[13px] font-medium text-[#d0c6ab] hover:text-[#FFD700] transition-colors">
              Already have an account? <span className="text-[#FFD700] font-semibold">Login</span>
            </a>
          </div>
        </div>
      </main>

      {/* Compact Footer */}
      <footer className="absolute bottom-0 w-full z-10 bg-[#131313]/80 backdrop-blur-md py-3 border-t border-[#353534]">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-10 max-w-7xl mx-auto gap-2">
          <div className="text-[12px] font-medium text-[#454747]">
            © 2024 SNITCH PREMIUM APPAREL.
          </div>
          <div className="flex flex-wrap justify-center gap-4 hidden sm:flex">
            <a className="text-[12px] font-medium text-[#d0c6ab] hover:text-[#FFD700] transition-colors" href="#">Privacy</a>
            <a className="text-[12px] font-medium text-[#d0c6ab] hover:text-[#FFD700] transition-colors" href="#">Terms</a>
            <a className="text-[12px] font-medium text-[#d0c6ab] hover:text-[#FFD700] transition-colors" href="#">Contact</a>
          </div>
        </div>
      </footer>

      <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default Register;