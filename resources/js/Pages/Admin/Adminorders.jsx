import { useState } from 'react';
import { ShoppingBag, X, AlertTriangle } from 'lucide-react';
import AdminSidebar from '../../Components/AdminSidebar.jsx';

export default function AdminOrders({ orders: initialOrders = [] }) {
  const [orders, setOrders] = useState(
    initialOrders.map(order => ({
      ...order,
      status: order.status || 'Processing'
    }))
  );
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pendingStatusChange, setPendingStatusChange] = useState(null); // { orderId, newStatus, currentStatus }

  // Trigger status change or open confirmation modal if reverting from Completed
  const handleStatusSelect = (orderId, newStatus, currentStatus, e) => {
    if (e) e.stopPropagation(); // Prevent row click modal from opening

    if (currentStatus === 'Completed' && newStatus === 'Processing') {
      // Open custom confirmation modal
      setPendingStatusChange({ orderId, newStatus });
      return;
    }

    // Otherwise update immediately
    executeStatusChange(orderId, newStatus);
  };

  // Execute the status change and sync to backend database
  const executeStatusChange = async (orderId, newStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        (order.id === orderId ? { ...order, status: newStatus } : order)
      )
    );

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }

    setPendingStatusChange(null);

    try {
      await fetch(`/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (error) {
      console.error('Failed to update order status in database:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col md:flex-row selection:bg-purple-600 selection:text-white">
      
      {/* Sidebar */}
      <AdminSidebar ordersCount={orders.length} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Customer Orders Management</h1>
            <p className="text-xs text-neutral-400 mt-0.5">Click any database order row to inspect full details and items.</p>
          </div>
        </div>

        {/* Orders Table Container */}
        <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              <span>All Database Recorded Orders</span>
            </h2>
            <span className="text-xs text-neutral-400">{orders.length} total</span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16 text-neutral-500 text-xs border border-dashed border-neutral-800 rounded-2xl space-y-2">
              <p>No customer orders found in the database.</p>
              <p className="text-neutral-600">Checkouts synced to your backend will show up here automatically.</p>
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
                  {orders.map((order) => {
                    const totalPrice = Number(order.total_price || order.totalPrice || 0);
                    const shippingDest = order.shipping_address || order.shippingAddress || 'N/A';
                    const orderDate = order.created_at || order.date || 'Recent';

                    let parsedItems = [];
                    try {
                      parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
                    } catch (e) {
                      parsedItems = [];
                    }

                    const itemsSummary = Array.isArray(parsedItems) 
                      ? parsedItems.map(i => i.name || i.title || 'Component').join(', ') 
                      : `${parsedItems.length || 0} items`;

                    return (
                      <tr 
                        key={order.id} 
                        onClick={() => setSelectedOrder(order)}
                        className="hover:bg-neutral-800/40 transition-colors cursor-pointer group"
                      >
                        <td className="py-4 px-4 font-mono text-purple-300 group-hover:text-purple-200">
                          #{order.id}
                          <span className="block text-[10px] text-neutral-500">{orderDate}</span>
                        </td>
                        <td className="py-4 px-4 font-medium text-white max-w-xs truncate">
                          {shippingDest}
                        </td>
                        <td className="py-4 px-4 text-neutral-400">
                          {itemsSummary || 'No items listed'}
                        </td>
                        <td className="py-4 px-4 font-bold text-emerald-400">
                          ₱{totalPrice.toFixed(2)}
                        </td>
                        <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex items-center space-x-2">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusSelect(order.id, e.target.value, order.status, e)}
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* Order Details Modal */}
      {selectedOrder && (() => {
        let modalItems = [];
        try {
          modalItems = typeof selectedOrder.items === 'string' ? JSON.parse(selectedOrder.items) : (selectedOrder.items || []);
        } catch (e) {
          modalItems = [];
        }

        const modalTotalPrice = Number(selectedOrder.total_price || selectedOrder.totalPrice || 0);
        const modalShipping = selectedOrder.shipping_address || selectedOrder.shippingAddress || 'N/A';
        const modalDate = selectedOrder.created_at || selectedOrder.date || 'Recent';
        const fallbackItemPrice = modalItems.length > 0 ? modalTotalPrice / modalItems.length : 0;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#161619] border border-neutral-800 rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl relative">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Order Inspection</span>
                  <h3 className="text-lg font-black text-white">Order #{selectedOrder.id}</h3>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Order Meta Info */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-[#121215] border border-neutral-800/80 p-3.5 rounded-2xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-500">Timestamp</span>
                  <p className="font-mono text-neutral-300">{modalDate}</p>
                </div>
                <div className="bg-[#121215] border border-neutral-800/80 p-3.5 rounded-2xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-500">Current Status</span>
                  <p className={`font-bold ${selectedOrder.status === 'Completed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {selectedOrder.status}
                  </p>
                </div>
              </div>

              {/* Shipping Destination */}
              <div className="bg-[#121215] border border-neutral-800/80 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-500">Shipping Destination</span>
                <p className="text-xs font-medium text-white">{modalShipping}</p>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Ordered Components ({modalItems.length})</span>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {modalItems.length === 0 ? (
                    <p className="text-xs text-neutral-500 italic py-2">No detailed items recorded in payload.</p>
                  ) : (
                    modalItems.map((item, idx) => {
                      const itemPrice = Number(item.price || item.cost || item.unit_price || item.amount || 0) || fallbackItemPrice;
                      const itemName = item.name || item.title || `Item #${idx + 1}`;

                      return (
                        <div key={idx} className="flex items-center justify-between bg-[#121215] border border-neutral-800/60 p-3 rounded-xl text-xs">
                          <span className="font-medium text-white">{itemName}</span>
                          <span className="font-bold text-emerald-400">₱{itemPrice.toFixed(2)}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Total & Footer Actions */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Total Amount</span>
                  <span className="text-xl font-black text-emerald-400">₱{modalTotalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* Confirmation Modal for Reverting Completed Order */}
      {pendingStatusChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#161619] border border-neutral-800 rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl relative text-center">
            
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Revert Order Status?</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                This order is currently marked as Completed. Are you sure you want to change it back to Processing?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setPendingStatusChange(null)}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => executeStatusChange(pendingStatusChange.orderId, pendingStatusChange.newStatus)}
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Yes, Revert
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}