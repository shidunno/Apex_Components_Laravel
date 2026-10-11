import { usePage, router } from '@inertiajs/react';
import { LayoutDashboard, ShoppingBag, MessageSquare, Package, LogOut } from 'lucide-react';

export default function AdminSidebar({ ordersCount = 0, supportCount = 0 }) {
  const { url } = usePage();

  const adminUser = JSON.parse(localStorage.getItem('apex_user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('apex_user');
    localStorage.removeItem('user_email');
    router.post('/logout');
  };

  return (
    <aside className="w-full md:w-64 bg-[#121215] border-r border-neutral-800 p-6 flex flex-col justify-between shrink-0 min-h-screen">
      <div className="space-y-8">
        {/* Brand Header */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-black tracking-wider bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            APEX ADMIN
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {/* Overview / Dashboard */}
          <button
            onClick={() => router.visit('/admin/dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              url === '/admin/dashboard'
                ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-900/40'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          {/* Customer Orders */}
          <button
            onClick={() => router.visit('/admin/orders')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              url === '/admin/orders'
                ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-900/40'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-4 h-4" />
              <span>Customer Orders</span>
            </div>
            <span className="bg-neutral-800 px-2 py-0.5 rounded-full text-[10px] text-purple-300 font-mono">
              {ordersCount}
            </span>
          </button>

          {/* Catalog & Products */}
          <button
            onClick={() => router.visit('/admin/products')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              url === '/admin/products'
                ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-900/40'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Package className="w-4 h-4" />
              <span>Catalog Products</span>
            </div>
          </button>

          {/* Support Inquiries */}
          <button
            onClick={() => router.visit('/admin/support')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              url === '/admin/support'
                ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-900/40'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-4 h-4" />
              <span>Support Inquiries</span>
            </div>
            <span className="bg-neutral-800 px-2 py-0.5 rounded-full text-[10px] text-amber-300 font-mono">
              {supportCount}
            </span>
          </button>
        </nav>
      </div>

      {/* Admin Profile & Logout Section */}
      <div className="pt-6 border-t border-neutral-800 space-y-4">
        <div className="px-2">
          <span className="text-[10px] uppercase font-bold text-neutral-500 block">Logged in as Admin</span>
          <span className="text-xs font-bold text-neutral-200 truncate block">{adminUser?.email || 'admin@gmail.com'}</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}