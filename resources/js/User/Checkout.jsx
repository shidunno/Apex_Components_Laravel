import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, CreditCard, Truck, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form state with user info preloaded and other fields blank
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('pc_cart') || '[]');
    setCartItems(savedCart);

    // Retrieve logged-in session data or registered users to auto-populate name and email
    const sessionEmail = localStorage.getItem('user_email');
    const registeredUsers = JSON.parse(localStorage.getItem('apex_registered_users') || '[]');
    const savedAddress = JSON.parse(localStorage.getItem('apex_user_address') || 'null');
    
    let matchedName = '';
    let matchedEmail = sessionEmail || '';

    if (sessionEmail) {
      const found = registeredUsers.find(u => u.email.trim().toLowerCase() === sessionEmail.trim().toLowerCase());
      if (found) {
        matchedName = found.name;
      } else if (sessionEmail === 'user@gmail.com') {
        matchedName = 'Default User';
      } else if (sessionEmail === 'admin@gmail.com') {
        matchedName = 'System Administrator';
      }
    }

    setFormData(prev => ({
      ...prev,
      fullName: matchedName || '',
      email: matchedEmail || '',
      address: savedAddress?.street || '',
      city: savedAddress?.city || '',
      zipCode: savedAddress?.postalCode || ''
    }));
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const shipping = subtotal > 0 ? 49.00 : 0;
  const grandTotal = subtotal + shipping;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    // Build the final order object
    const newOrder = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: cartItems,
      totalPrice: grandTotal,
      status: 'Processing',
      shippingAddress: `${formData.address}, ${formData.city} ${formData.zipCode}`
    };

    // Save to order history list
    const existingOrders = JSON.parse(localStorage.getItem('pc_orders') || '[]');
    localStorage.setItem('pc_orders', JSON.stringify([newOrder, ...existingOrders]));

    // Clear cart storage
    localStorage.removeItem('pc_cart');
    setCartItems([]);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col selection:bg-purple-600">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 bg-[#0d0d0f]">
          <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-10 max-w-md w-full text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-950">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Order Placed Successfully!</h2>
              <p className="text-xs text-neutral-400">
                Your high-performance gear is now being assembled and tested by our technicians.
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-900/40 transition-all cursor-pointer"
            >
              Return to Dashboard
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col selection:bg-purple-600">
      <Navbar />

      <main className="flex-1 flex flex-col min-w-0 bg-[#0d0d0f] max-w-6xl mx-auto w-full p-6 md:p-10 pt-8 space-y-8">
        
        {/* Page Title & Back Header */}
        <div className="flex items-center space-x-3 pb-2 border-b border-neutral-800">
          <button 
            onClick={() => navigate('/')}
            className="p-2 text-neutral-400 hover:text-white bg-[#161619] border border-neutral-800 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Secure Checkout</h1>
            <p className="text-xs text-neutral-400 mt-0.5">Complete your hardware order.</p>
          </div>
        </div>

        {/* Form & Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Checkout Form */}
          <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-6">
            
            {/* Shipping Info */}
            <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center space-x-2 text-purple-400 pb-2 border-b border-neutral-800">
                <Truck className="w-4 h-4" />
                <h3 className="text-sm font-bold text-white">Shipping Information</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-400">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 placeholder:text-neutral-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-400">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    required
                    className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 placeholder:text-neutral-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400">Street Address</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g. 123 Main Street"
                  required
                  className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 placeholder:text-neutral-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-400">City</label>
                  <input 
                    type="text" 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. San Jose"
                    required
                    className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 placeholder:text-neutral-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-400">Zip / Postal Code</label>
                  <input 
                    type="text" 
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="e.g. 3130"
                    required
                    className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 placeholder:text-neutral-600"
                  />
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center space-x-2 text-purple-400 pb-2 border-b border-neutral-800">
                <CreditCard className="w-4 h-4" />
                <h3 className="text-sm font-bold text-white">Payment Method</h3>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400">Card Number</label>
                <input 
                  type="text" 
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="xxxx xxxx xxxx xxxx"
                  required
                  className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 placeholder:text-neutral-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-400">Expiration Date</label>
                  <input 
                    type="text" 
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    required
                    className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 placeholder:text-neutral-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-neutral-400">CVV Code</label>
                  <input 
                    type="password" 
                    name="cvv"
                    maxLength="4"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    required
                    className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 placeholder:text-neutral-600"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={cartItems.length === 0}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-xl shadow-purple-900/40 transition-all cursor-pointer"
            >
              Place Order (${grandTotal.toFixed(2)})
            </button>
          </form>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-6 space-y-6 shadow-xl sticky top-24">
              <div className="flex items-center space-x-2 text-purple-400 pb-2 border-b border-neutral-800">
                <ShoppingBag className="w-4 h-4" />
                <h3 className="text-sm font-bold text-white">Order Summary ({cartItems.length})</h3>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-10 text-neutral-500 text-xs">
                  Your cart is currently empty.
                </div>
              ) : (
                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-[#121215] p-3 rounded-2xl border border-neutral-800/60">
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.name}</h4>
                      </div>
                      <span className="text-xs font-bold text-white">${item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-neutral-800 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Insured Shipping & Handling</span>
                  <span className="text-white font-semibold">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-neutral-800">
                  <span>Total</span>
                  <span className="text-purple-400">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-purple-950/20 border border-purple-500/20 rounded-2xl p-4 flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Backed by Apex 3-Year Hardware Warranty, stress-tested thermal benchmarks, and secure transit insurance.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}