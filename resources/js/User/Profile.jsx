import { useState, useRef, useEffect } from 'react';
import { 
  Award, User, Mail, ShieldCheck, Key, Save, CheckCircle2, Lock, MapPin, Camera 
} from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

export default function Profile() {
  const [formData, setFormData] = useState({
    name: 'Justine Salcedo',
    email: 'justine.salcedo@example.com',
  });

  const [addressData, setAddressData] = useState({
    street: 'San Jose City',
    city: 'San Jose City',
    state: 'Nueva Ecija',
    postalCode: '3121',
    country: 'Philippines',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [saved, setSaved] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Load user profile and address data from localStorage on mount
  useEffect(() => {
    const sessionEmail = localStorage.getItem('user_email');
    const registeredUsers = JSON.parse(localStorage.getItem('apex_registered_users') || '[]');
    const savedAddress = JSON.parse(localStorage.getItem('apex_user_address') || 'null');
    const savedAvatar = localStorage.getItem('apex_user_avatar');

    if (sessionEmail) {
      const foundUser = registeredUsers.find(u => u.email.trim().toLowerCase() === sessionEmail.trim().toLowerCase());
      if (foundUser) {
        setFormData({
          name: foundUser.name || 'Justine Salcedo',
          email: foundUser.email || sessionEmail
        });
      } else {
        setFormData(prev => ({ ...prev, email: sessionEmail }));
      }
    }

    if (savedAddress) {
      setAddressData(savedAddress);
    }

    if (savedAvatar) {
      setAvatarPreview(savedAvatar);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setAvatarPreview(result);
        localStorage.setItem('apex_user_avatar', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    
    localStorage.setItem('user_email', formData.email);
    const registeredUsers = JSON.parse(localStorage.getItem('apex_registered_users') || '[]');
    const sessionEmail = localStorage.getItem('user_email');

    const updatedUsers = registeredUsers.map(u => {
      if (u.email === sessionEmail || u.name === formData.name) {
        return { ...u, name: formData.name, email: formData.email };
      }
      return u;
    });

    if (!updatedUsers.some(u => u.email === formData.email)) {
      updatedUsers.push({ name: formData.name, email: formData.email });
    }

    localStorage.setItem('apex_registered_users', JSON.stringify(updatedUsers));

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('apex_user_address', JSON.stringify(addressData));
    setAddressSaved(true);
    setTimeout(() => setAddressSaved(false), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');

    // Retrieve stored password or default to a standard placeholder if none exists
    const sessionEmail = localStorage.getItem('user_email');
    const registeredUsers = JSON.parse(localStorage.getItem('apex_registered_users') || '[]');
    const currentUser = registeredUsers.find(u => u.email.trim().toLowerCase() === (sessionEmail || '').trim().toLowerCase());
    
    const storedPassword = currentUser?.password || localStorage.getItem('apex_user_password') || 'password123';

    // Validate current password
    if (passwordData.currentPassword !== storedPassword) {
      setPasswordError('Incorrect current password entered.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    // Save new password to localStorage
    localStorage.setItem('apex_user_password', passwordData.newPassword);
    if (currentUser) {
      currentUser.password = passwordData.newPassword;
      localStorage.setItem('apex_registered_users', JSON.stringify(registeredUsers));
    }

    setPasswordSaved(true);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col selection:bg-purple-600 selection:text-white relative font-sans">
      <Navbar />

      <main className="flex-1 flex flex-col min-w-0 bg-[#0d0d0f] max-w-4xl mx-auto w-full p-6 md:p-10 pt-8 space-y-8">
        
        {/* Page Title & Intro Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Account Profile</h1>
            <p className="text-xs text-neutral-400 mt-0.5">Manage your personal information, delivery addresses, and security settings.</p>
          </div>

          <div className="flex items-center space-x-2 bg-[#161619] px-3.5 py-2 rounded-xl border border-neutral-800 shadow-inner w-fit">
            <Award className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-white">APEX PORTAL</span>
          </div>
        </div>

        {saved && (
          <div className="flex items-center space-x-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-2xl text-emerald-300 text-sm font-medium shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Profile updated successfully!</span>
          </div>
        )}

        {/* MAIN PROFILE INFO CARD */}
        <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center space-x-4 pb-6 border-b border-neutral-800">
            
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-extrabold text-xl text-white shadow-lg overflow-hidden border border-neutral-700">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  formData.name ? formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'JS'
                )}
              </div>
              <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
                <span className="text-[9px] font-bold text-white mt-0.5">Change</span>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {formData.name || 'User Profile'} <ShieldCheck className="w-5 h-5 text-purple-400" />
              </h2>
              <span className="text-xs text-neutral-400 block mt-0.5">Click your avatar icon to upload a custom profile picture</span>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Full Name</label>
                <div className="relative">
                  <User className="w-5 h-5 text-neutral-500 absolute left-3.5 top-3.5" />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-4 py-3 pl-11 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all shadow-inner"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-neutral-500 absolute left-3.5 top-3.5" />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-4 py-3 pl-11 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all shadow-inner"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="submit"
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs px-6 py-3.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-purple-900/30"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* BILLING & DELIVERY ADDRESS CARD */}
        <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Billing & Delivery Address</h2>
                <p className="text-xs text-neutral-400">Default address for hardware shipments and checkouts.</p>
              </div>
            </div>
          </div>

          {addressSaved && (
            <div className="flex items-center space-x-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-2xl text-emerald-300 text-sm font-medium shadow-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Address updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Street Address</label>
              <input 
                type="text" 
                value={addressData.street}
                onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                placeholder="Street name, house/building number"
                className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all shadow-inner"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">City</label>
                <input 
                  type="text" 
                  value={addressData.city}
                  onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                  className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all shadow-inner"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">State / Province</label>
                <input 
                  type="text" 
                  value={addressData.state}
                  onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                  className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Postal / Zip Code</label>
                <input 
                  type="text" 
                  value={addressData.postalCode}
                  onChange={(e) => setAddressData({ ...addressData, postalCode: e.target.value })}
                  className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all shadow-inner"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Country</label>
                <input 
                  type="text" 
                  value={addressData.country}
                  onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}
                  className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="submit"
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs px-6 py-3.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-purple-900/30"
              >
                <Save className="w-4 h-4" />
                <span>Save Address</span>
              </button>
            </div>
          </form>
        </div>

        {/* SECURITY / PASSWORD UPDATE CARD */}
        <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center space-x-3 pb-6 border-b border-neutral-800">
            <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
              <Key className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Change Password</h2>
          </div>

          {passwordSaved && (
            <div className="flex items-center space-x-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-2xl text-emerald-300 text-sm font-medium shadow-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Password updated successfully!</span>
            </div>
          )}

          {passwordError && (
            <div className="bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-2xl text-rose-300 text-xs font-medium">
              {passwordError}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Current Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-neutral-500 absolute left-3.5 top-3.5" />
                <input 
                  type="password" 
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-4 py-3 pl-11 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">New Password</label>
                <input 
                  type="password" 
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all shadow-inner"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Confirm New Password</label>
                <input 
                  type="password" 
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="submit"
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs px-6 py-3.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-purple-900/30"
              >
                <Save className="w-4 h-4" />
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>

      </main>
      <Footer />
    </div>
  );
}