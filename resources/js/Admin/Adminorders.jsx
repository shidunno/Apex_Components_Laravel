import { useState, useEffect } from 'react';
import { ShoppingBag, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../Components/Adminsidebar';

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  useEffect(() => {
    // Fetch live orders and registered users from localStorage
    const storedOrders = JSON.parse(localStorage.getItem('pc_orders') || '[]');
    const storedUsers = JSON.parse(localStorage.getItem('apex_registered_users') || '[]');
    
    // Ensure every order has a default status if it doesn't already have one
    const ordersWithStatus = storedOrders.map(order => ({
      ...order,
      status: order.status || 'Processing'
    }));

    setOrders(ordersWithStatus);
    setRegisteredUsers(storedUsers);
  }, []);

  // Handle status update for a specific order index/ID
  const handleStatusChange = (index, newStatus) => {
    const updatedOrders = [...orders];
    updatedOrders[index].status = newStatus;
    setOrders(updatedOrders);
    
    // Save back to localStorage so changes persist
    localStorage.setItem('pc_orders', JSON.stringify(updatedOrders));
  };

  const handleClearOrders = () => {
    if (window.confirm("Are you sure you want to clear all customer orders?")) {
      localStorage.removeItem('pc_orders');
      setOrders([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col md:flex-row selection:bg-purple-600 selection:text-white">
      
      {/* Sidebar */}
      <AdminSidebar ordersCount={orders.length} usersCount={registeredUsers.length} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Customer Orders Management</h1>
            <p className="text-xs text-neutral-400 mt-0.5">View and update real-time customer order statuses.</p>
          </div>
          
          {orders.length > 0 && (
            <button
              onClick={handleClearOrders}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all cursor-pointer self-start md:self-auto"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All Orders</span>
            </button>
          )}
        </div>

        {/* Orders Table Container */}
        <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              <span>All Recorded Orders</span>
            </h2>
            <span className="text-xs text-neutral-400">{orders.length} total</span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16 text-neutral-500 text-xs border border-dashed border-neutral-800 rounded-2xl space-y-2">
              <p>No customer orders have been placed yet.</p>
              <p className="text-neutral-600">Completed checkouts from the store will instantly show up here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Shipping Destination</th>
                    <th className="py-3 px-4">Items Summary</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                  {orders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="py-4 px-4 font-mono text-purple-300">
                        #{order.id}
                        <span className="block text-[10px] text-neutral-500">{order.date}</span>
                      </td>
                      <td className="py-4 px-4 font-medium text-white max-w-xs truncate">
                        {order.shippingAddress || 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-neutral-400">
                        {order.items?.map(i => i.name).join(', ') || `${order.items?.length || 0} items`}
                      </td>
                      <td className="py-4 px-4 font-bold text-emerald-400">
                        ${Number(order.totalPrice || 0).toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="inline-flex items-center space-x-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(idx, e.target.value)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs border outline-none cursor-pointer transition-all ${
                              order.status === 'Completed'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            <option value="Processing" className="bg-[#161619] text-amber-400">Processing</option>
                            <option value="Completed" className="bg-[#161619] text-emerald-400">Completed</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}