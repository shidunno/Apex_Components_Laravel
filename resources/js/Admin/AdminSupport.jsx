import { useState, useEffect } from 'react';
import { MessageSquare, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../Components/Adminsidebar';

export default function AdminSupport() {
  const navigate = useNavigate();
  const [supportTickets, setSupportTickets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  useEffect(() => {
    // 1. Fetch support messages from localStorage (synced with Contactsupport.jsx)
    const storedTickets = JSON.parse(localStorage.getItem('apex_support_tickets') || '[]');
    
    // Add default status if not present
    const ticketsWithStatus = storedTickets.map(ticket => ({
      ...ticket,
      status: ticket.status || 'Pending'
    }));

    setSupportTickets(ticketsWithStatus);

    // 2. Fetch orders and users for the sidebar counters
    setOrders(JSON.parse(localStorage.getItem('pc_orders') || '[]'));
    setRegisteredUsers(JSON.parse(localStorage.getItem('apex_registered_users') || '[]'));
  }, []);

  // Handle status update (Pending / Resolved)
  const handleStatusChange = (index, newStatus) => {
    const updatedTickets = [...supportTickets];
    updatedTickets[index].status = newStatus;
    setSupportTickets(updatedTickets);
    localStorage.setItem('apex_support_tickets', JSON.stringify(updatedTickets));
  };

  const handleClearTickets = () => {
    if (window.confirm("Are you sure you want to clear all support inquiries?")) {
      localStorage.removeItem('apex_support_tickets');
      setSupportTickets([]);
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
            <h1 className="text-xl font-bold tracking-tight text-white">Customer Support Inquiries</h1>
            <p className="text-xs text-neutral-400 mt-0.5">Manage and respond to messages submitted through the support center.</p>
          </div>
          
          {supportTickets.length > 0 && (
            <button
              onClick={handleClearTickets}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all cursor-pointer self-start md:self-auto"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All Messages</span>
            </button>
          )}
        </div>

        {/* Support Tickets Table / List Container */}
        <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span>Incoming Messages</span>
            </h2>
            <span className="text-xs text-neutral-400">{supportTickets.length} total messages</span>
          </div>

          {supportTickets.length === 0 ? (
            <div className="text-center py-16 text-neutral-500 text-xs border border-dashed border-neutral-800 rounded-2xl space-y-2">
              <p>No support tickets submitted yet.</p>
              <p className="text-neutral-600">Messages sent from user contact forms will show up here instantly.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">User / Date</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Message</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                  {supportTickets.map((ticket, idx) => (
                    <tr key={idx} className="hover:bg-neutral-800/30 transition-colors align-top">
                      <td className="py-4 px-4 font-medium text-white">
                        {ticket.email || ticket.userEmail || 'Anonymous'}
                        <span className="block text-[10px] text-neutral-500 font-mono mt-0.5">{ticket.date || 'Recent'}</span>
                      </td>
                      <td className="py-4 px-4 font-bold text-purple-300 max-w-xs">
                        {ticket.subject || 'General Inquiry'}
                      </td>
                      <td className="py-4 px-4 text-neutral-300 max-w-md break-words">
                        {ticket.message || ticket.content || 'No message provided.'}
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={ticket.status}
                          onChange={(e) => handleStatusChange(idx, e.target.value)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs border outline-none cursor-pointer transition-all ${
                            ticket.status === 'Resolved'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          <option value="Pending" className="bg-[#161619] text-amber-400">Pending</option>
                          <option value="Resolved" className="bg-[#161619] text-emerald-400">Resolved</option>
                        </select>
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