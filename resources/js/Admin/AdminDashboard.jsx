import { useState, useEffect } from 'react';
import { ShoppingBag, Users } from 'lucide-react';
import AdminSidebar from '../Components/Adminsidebar';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0
  });

  useEffect(() => {
    // 1. Fetch actual customer orders from localStorage (synced with Checkout_2.jsx)
    const storedOrders = JSON.parse(localStorage.getItem('pc_orders') || '[]');
    setOrders(storedOrders);

    // 2. Fetch registered users from localStorage (synced with Register.jsx & Login.jsx)
    const storedUsers = JSON.parse(localStorage.getItem('apex_registered_users') || '[]');
    setRegisteredUsers(storedUsers);

    // 3. Calculate real-time metrics
    const revenue = storedOrders.reduce((acc, order) => acc + (Number(order.totalPrice) || 0), 0);
    
    setStats({
      totalOrders: storedOrders.length,
      totalRevenue: revenue,
      totalUsers: storedUsers.length + 1 // +1 to account for default/admin accounts
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col md:flex-row selection:bg-purple-600 selection:text-white">
      
      {/* Modular Admin Sidebar */}
      <AdminSidebar ordersCount={orders.length} usersCount={registeredUsers.length} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Live Store Control Panel</h1>
            <p className="text-xs text-neutral-400 mt-0.5">Real-time telemetry tracking live user checkouts and registrations.</p>
          </div>
        </div>

        {/* Stats Grid - Reflects Live Data */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-6 space-y-2 shadow-xl">
            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Total Revenue (Live)</span>
            <div className="text-2xl font-black text-emerald-400">${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-6 space-y-2 shadow-xl">
            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Completed Orders</span>
            <div className="text-2xl font-black text-white">{stats.totalOrders}</div>
          </div>
          <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-6 space-y-2 shadow-xl">
            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Registered Accounts</span>
            <div className="text-2xl font-black text-white">{stats.totalUsers}</div>
          </div>
        </div>

        {/* Live Customer Orders Section */}
        <div id="orders" className="bg-[#161619] border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              <span>Recent User Checkouts & Orders</span>
            </h2>
            <span className="text-xs text-neutral-400">{orders.length} total orders found</span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-xs border border-dashed border-neutral-800 rounded-2xl space-y-2">
              <p>No customer orders placed yet.</p>
              <p className="text-neutral-600">Go through your store catalog and complete a checkout to see live records here!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Order ID / Date</th>
                    <th className="py-3 px-4">Shipping Destination</th>
                    <th className="py-3 px-4">Items Count</th>
                    <th className="py-3 px-4">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                  {orders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-purple-300">
                        #{order.id}
                        <span className="block text-[10px] text-neutral-500">{order.date}</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-white">{order.shippingAddress}</td>
                      <td className="py-3.5 px-4">{order.items?.length || 0} component(s)</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">${Number(order.totalPrice || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Registered Users Section */}
        <div id="users" className="bg-[#161619] border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Registered User Base</span>
            </h2>
            <span className="text-xs text-neutral-400">{registeredUsers.length} sign-ups</span>
          </div>

          {registeredUsers.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-xs border border-dashed border-neutral-800 rounded-2xl">
              No new registrations recorded yet via the Register page.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {registeredUsers.map((u, idx) => (
                <div key={idx} className="bg-[#121215] border border-neutral-800/80 p-4 rounded-2xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-purple-400">Customer Account</span>
                  <p className="text-xs font-bold text-white truncate">{u.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}