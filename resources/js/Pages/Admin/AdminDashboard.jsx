import { useState } from 'react';
import { ShoppingBag, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminSidebar from '../../Components/AdminSidebar.jsx';

export default function AdminDashboard({ orders: initialOrders = [] }) {
  const [orders] = useState(
    initialOrders.map(order => ({
      ...order,
      status: order.status || 'Processing'
    }))
  );

  // Filter only completed orders for revenue and analytics calculations
  const completedOrders = orders.filter(order => order.status === 'Completed');

  const totalRevenue = completedOrders.reduce((acc, order) => {
    return acc + Number(order.total_price || order.totalPrice || order.total || order.amount || 0);
  }, 0);

  // Aggregate chart telemetry data strictly from completed database orders
  const chartDataMap = completedOrders.reduce((acc, order) => {
    const rawDate = order.created_at || order.date || 'Recent';
    const dateKey = typeof rawDate === 'string' ? rawDate.split('T')[0] : 'Recent';
    
    if (!acc[dateKey]) {
      acc[dateKey] = { date: dateKey, revenue: 0, orders: 0 };
    }
    acc[dateKey].revenue += Number(order.total_price || order.totalPrice || order.total || order.amount || 0);
    acc[dateKey].orders += 1;
    return acc;
  }, {});

  const chartData = Object.values(chartDataMap);

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col md:flex-row selection:bg-purple-600 selection:text-white">
      
      {/* Modular Admin Sidebar */}
      <AdminSidebar ordersCount={orders.length} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Live Store Control Panel</h1>
            <p className="text-xs text-neutral-400 mt-0.5">Real-time telemetry tracking live database checkouts and store metrics.</p>
          </div>
        </div>

        {/* Stats Grid - Reflects Live Completed Orders Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-6 space-y-2 shadow-xl">
            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Total Revenue (Completed Orders)</span>
            <div className="text-2xl font-black text-emerald-400">₱{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-6 space-y-2 shadow-xl">
            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Completed Orders Count</span>
            <div className="text-2xl font-black text-white">{completedOrders.length} <span className="text-xs text-neutral-500 font-normal">/ {orders.length} total</span></div>
          </div>
        </div>

        {/* Analytics Chart Section */}
        <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>Revenue Performance Overview (Completed)</span>
            </h2>
            <span className="text-xs text-neutral-400">Live Telemetry</span>
          </div>

          <div className="h-72 w-full pt-4">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-neutral-500 text-xs border border-dashed border-neutral-800 rounded-2xl">
                No completed database orders to render graph trends yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#26262a" />
                  <XAxis dataKey="date" stroke="#737373" fontSize={10} />
                  <YAxis stroke="#737373" fontSize={10} tickFormatter={(val) => `₱${val}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#121215', borderColor: '#26262a', borderRadius: '1rem', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#34d399' }}
                    formatter={(val) => [`₱${Number(val).toFixed(2)}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#c084fc" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
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
              <p>No customer orders found in the database yet.</p>
              <p className="text-neutral-600">Complete an order from your frontend to populate live database records here!</p>
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
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                  {orders.map((order) => {
                    let parsedItems = [];
                    try {
                      parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
                    } catch (e) {
                      parsedItems = [];
                    }

                    const totalPrice = Number(order.total_price || order.totalPrice || order.total || order.amount || 0);
                    const shippingDest = order.shipping_address || order.shippingAddress || order.address || 'Standard Shipping';
                    const orderDate = order.created_at || order.date || 'Recent';

                    return (
                      <tr key={order.id} className="hover:bg-neutral-800/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-purple-300">
                          #{order.id}
                          <span className="block text-[10px] text-neutral-500">{orderDate}</span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-white max-w-xs truncate">{shippingDest}</td>
                        <td className="py-3.5 px-4">{parsedItems.length || 1} component(s)</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-400">₱{totalPrice.toFixed(2)}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${
                            order.status === 'Completed' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}>
                            {order.status || 'Processing'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}