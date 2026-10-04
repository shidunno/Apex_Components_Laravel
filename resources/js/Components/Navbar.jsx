import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  // Check login state on component mount
  useEffect(() => {
    const email = localStorage.getItem('user_email');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_email');
    setUserEmail(null);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#121215]/95 backdrop-blur-md border-b border-neutral-800 shadow-[0_12px_30px_-20px_rgba(168,85,247,0.7)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Brand Name */}
          <div className="flex items-center space-x-3">
            <div className="w-3.5 h-3.5 bg-gradient-to-tr from-purple-600 to-indigo-500 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.6)]"></div>
            <Link to="/" className="text-xl font-black tracking-widest text-white">
              APEX
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#0f0f12]/80 border border-neutral-800 rounded-2xl p-1 text-xs font-medium text-neutral-300">
            <Link to="/dashboard" className="px-3 py-2 rounded-xl hover:bg-purple-500/10 hover:text-purple-300 transition-colors">Overview</Link>
            <Link to="/catalog" className="px-3 py-2 rounded-xl hover:bg-purple-500/10 hover:text-purple-300 transition-colors">Products</Link>
            <Link to="/builder" className="px-3 py-2 rounded-xl hover:bg-purple-500/10 hover:text-purple-300 transition-colors">PC Builder</Link>
            <Link to="/order" className="px-3 py-2 rounded-xl hover:bg-purple-500/10 hover:text-purple-300 transition-colors">Order</Link>
            <Link to="/support" className="px-3 py-2 rounded-xl hover:bg-purple-500/10 hover:text-purple-300 transition-colors">Contact</Link>
          </nav>

          {/* Right Action Buttons & Profile / Auth State */}
          <div className="hidden md:flex items-center space-x-3">
            <Link 
              to="/profile" 
              className="p-2 bg-[#161619] border border-neutral-800 hover:border-purple-500/50 text-neutral-300 hover:text-white rounded-xl transition-all flex items-center justify-center"
              title="User Profile"
            >
              <User className="w-4 h-4 text-purple-400" />
            </Link>

            {userEmail ? (
              <div className="flex items-center space-x-3">
                <span className="text-xs text-purple-300 font-semibold bg-purple-950/60 px-3 py-2 rounded-xl border border-purple-500/30">
                  {userEmail}
                </span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 text-xs font-semibold text-neutral-300 hover:text-rose-400 bg-[#161619] hover:bg-rose-500/10 border border-neutral-800 px-3 py-2 rounded-xl transition-all cursor-pointer"
                  title="Log Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-xs font-semibold text-neutral-300 hover:text-white transition-colors px-3 py-2"
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-4 py-2.5 rounded-xl shadow-lg shadow-purple-900/30 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle & Profile Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Link 
              to="/profile" 
              className="p-2 bg-[#161619] border border-neutral-800 text-neutral-300 rounded-xl flex items-center justify-center"
              title="User Profile"
            >
              <User className="w-4 h-4 text-purple-400" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-neutral-400 hover:text-white focus:outline-none p-2"
              aria-label="Toggle Menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#161619] border-b border-neutral-800 px-4 pt-4 pb-6 space-y-2">
          <Link 
            to="/dashboard" 
            onClick={() => setIsOpen(false)} 
            className="block text-neutral-300 hover:text-purple-400 font-medium py-2 text-xs"
          >
            Overview
          </Link>
          <Link 
            to="/catalog" 
            onClick={() => setIsOpen(false)} 
            className="block text-neutral-300 hover:text-purple-400 font-medium py-2 text-xs"
          >
            Products & Services
          </Link>
          <Link 
            to="/builder" 
            onClick={() => setIsOpen(false)} 
            className="block text-neutral-300 hover:text-purple-400 font-medium py-2 text-xs"
          >
            PC Builder
          </Link>
          <Link 
            to="/order" 
            onClick={() => setIsOpen(false)} 
            className="block text-neutral-300 hover:text-purple-400 font-medium py-2 text-xs"
          >
            Order
          </Link>
          <Link 
            to="/profile" 
            onClick={() => setIsOpen(false)} 
            className="flex items-center gap-2 text-neutral-300 hover:text-purple-400 font-medium py-2 text-xs"
          >
            <User className="w-4 h-4 text-purple-400" />
            <span>Profile</span>
          </Link>
          <Link 
            to="/support" 
            onClick={() => setIsOpen(false)} 
            className="block text-neutral-300 hover:text-purple-400 font-medium py-2 text-xs"
          >
            Contact
          </Link>

          <div className="pt-4 flex flex-col space-y-2 border-t border-neutral-800">
            {userEmail ? (
              <button 
                onClick={() => { setIsOpen(false); handleLogout(); }}
                className="w-full text-center text-xs font-semibold text-rose-400 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl"
              >
                Log Out ({userEmail})
              </button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)} 
                  className="text-center text-xs font-semibold text-neutral-300 py-2.5 bg-neutral-800 rounded-xl"
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsOpen(false)} 
                  className="text-center text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 py-2.5 rounded-xl shadow-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}