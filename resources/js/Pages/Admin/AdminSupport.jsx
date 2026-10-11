import { useState } from 'react';
import { router } from '@inertiajs/react';
import { MessageSquare, Trash2, AlertTriangle, X } from 'lucide-react';
import AdminSidebar from '../../Components/AdminSidebar.jsx';

export default function AdminSupport({ tickets: initialTickets = [], ordersCount = 0 }) {
  const [supportTickets, setSupportTickets] = useState(initialTickets);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [pendingStatus, setPendingStatus] = useState(null); // { ticketId, newStatus }

  // Handle status update via database patch request
  const handleStatusChange = (ticketId, newStatus) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    fetch(`/admin/support/tickets/${ticketId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': csrfToken || ''
      },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => {
        if (res.ok) {
          setSupportTickets(prev =>
            prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t)
          );
        }
      })
      .catch(err => console.error("Failed to update ticket status:", err));
  };

  const handleClearTickets = () => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    fetch('/admin/support/tickets', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'X-CSRF-TOKEN': csrfToken || ''
      }
    })
      .then(res => {
        if (res.ok) {
          setSupportTickets([]);
          setIsClearModalOpen(false);
          router.reload({ preserveScroll: true, preserveState: true });
        }
      })
      .catch(err => console.error("Failed to clear support tickets:", err));
  };

  const getStatus = (t) => supportTickets.find(x => x.id === t.id)?.status || t.status || 'Pending';

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col md:flex-row selection:bg-purple-600 selection:text-white relative">
      
      {/* Sidebar */}
      <AdminSidebar ordersCount={ordersCount} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Customer Support Inquiries</h1>
            <p className="text-xs text-neutral-400 mt-0.5">Manage and respond to messages submitted through the support center database.</p>
          </div>
          
          <button
            onClick={() => {
              console.log('Clear All button clicked. Opening modal...');
              setIsClearModalOpen(true);
            }}
            disabled={supportTickets.length === 0}
            className={`text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all ${
              supportTickets.length === 0
                ? 'bg-neutral-800/50 text-neutral-600 border border-neutral-800 cursor-not-allowed'
                : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 cursor-pointer shadow-lg shadow-rose-950/20'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Messages</span>
          </button>
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
              <p>No support tickets submitted in the database yet.</p>
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
                  {supportTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="hover:bg-neutral-800/30 transition-colors align-top cursor-pointer"
                    >
                      <td className="py-4 px-4 font-medium text-white">
                        {ticket.email || ticket.userEmail || 'Anonymous'}
                        <span className="block text-[10px] text-neutral-500 font-mono mt-0.5">
                          {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : 'Recent'}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-purple-300 max-w-xs">
                        {ticket.subject || 'General Inquiry'}
                      </td>
                      <td className="py-4 px-4 text-neutral-300 max-w-md break-words">
                        {ticket.message || ticket.content || 'No message provided.'}
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={ticket.status || 'Pending'}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setPendingStatus({ ticketId: ticket.id, newStatus: e.target.value })}
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

      {/* Custom Confirmation Modal with Maximum z-index */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#161619] border border-neutral-800 rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl relative text-center">
            
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Clear All Support Messages?</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Are you sure you want to delete all customer inquiries from the database? This action is permanent and cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setIsClearModalOpen(false)}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleClearTickets}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-rose-900/40"
              >
                Yes, Clear All
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Status Change Confirmation Modal */}
      {pendingStatus && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#161619] border border-neutral-800 rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl relative text-center">

            <div
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center mx-auto ${
                pendingStatus.newStatus === 'Resolved'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Change Ticket Status?</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Are you sure you want to mark this ticket as{' '}
                <span className={pendingStatus.newStatus === 'Resolved' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {pendingStatus.newStatus}
                </span>
                ?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setPendingStatus(null)}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleStatusChange(pendingStatus.ticketId, pendingStatus.newStatus);
                  setPendingStatus(null);
                }}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-purple-900/40"
              >
                Yes, Confirm
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedTicket(null)}
        >
          <div
            className="bg-[#161619] border border-neutral-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 pr-6">
              <h3 className="text-base font-bold text-purple-300 break-words">
                {selectedTicket.subject || 'General Inquiry'}
              </h3>
              <p className="text-xs text-neutral-400">
                {selectedTicket.email || selectedTicket.userEmail || 'Anonymous'}
                <span className="text-neutral-600 font-mono">
                  {' · '}
                  {selectedTicket.created_at ? new Date(selectedTicket.created_at).toLocaleString() : 'Recent'}
                </span>
              </p>
            </div>

            <div className="bg-[#0d0d0f] border border-neutral-800 rounded-2xl p-4 text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap break-words">
              {selectedTicket.message || selectedTicket.content || 'No message provided.'}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span
                className={`px-3 py-1.5 rounded-xl font-bold text-xs border ${
                  (getStatus(selectedTicket)) === 'Resolved'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                {getStatus(selectedTicket)}
              </span>
              <button
                onClick={() => setSelectedTicket(null)}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}