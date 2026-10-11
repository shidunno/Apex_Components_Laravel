import { useState, useEffect } from 'react';
import { Mail, Phone, Clock, CheckCircle2, Send } from 'lucide-react';

export default function ContactSupport({ auth }) {
  const [formData, setFormData] = useState({
    name: auth?.user?.name || '',
    email: auth?.user?.email || '',
    category: 'technical',
    orderId: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    const payload = {
      subject: `[${formData.category.toUpperCase()}] ${formData.subject}${formData.orderId ? ` (Order: ${formData.orderId})` : ''}`,
      message: formData.message
    };

    fetch('/support/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': csrfToken
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        setIsSubmitting(false);
        if (data.success) {
          setIsSubmitted(true);
        }
      })
      .catch(error => {
        setIsSubmitting(false);
        console.error("Could not save support ticket", error);
      });
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      name: auth?.user?.name || '',
      email: auth?.user?.email || '',
      category: 'technical',
      orderId: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="space-y-10 w-full">
      
      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Response Time</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">Our support specialists typically reply within 2 to 4 hours during standard operational windows.</p>
        </div>

        <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Direct Support Email</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">You can also write to us directly at <span className="text-purple-300 font-semibold">support@apexparts.com</span></p>
        </div>

        <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Hardware Hotline</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">Available Mon-Fri, 9am - 6pm EST for urgent pre-built rig assembly inquiries.</p>
        </div>
      </div>

      {/* Ticket Submission Form Section */}
      <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        
        {isSubmitted ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Support Ticket Submitted!</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              Thank you for reaching out. Your ticket has been securely logged into our backend database.
            </p>
            <button
              onClick={handleReset}
              className="mt-4 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-purple-900/40 cursor-pointer"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-white">Submit a Support Ticket</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Fill out the form below with details regarding your component, build compatibility, or order history.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Your Name</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Issue Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                >
                  <option value="technical">Technical Support & Compatibility</option>
                  <option value="order">Order Tracking & Shipping</option>
                  <option value="warranty">Warranty & Returns</option>
                  <option value="custom">Custom Rig Consultation</option>
                </select>
              </div>

              {/* Order ID (Optional) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Order ID / Rig Reference (Optional)</label>
                <input 
                  type="text"
                  placeholder="e.g. #APX-99214"
                  value={formData.orderId}
                  onChange={(e) => setFormData({...formData, orderId: e.target.value})}
                  className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Subject</label>
              <input 
                type="text"
                required
                placeholder="Brief summary of your inquiry..."
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Message Description</label>
              <textarea 
                rows={5}
                required
                placeholder="Provide details about your hardware setup, error codes, or questions..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-[#121215] border border-neutral-800 rounded-xl p-4 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-purple-900/40 flex items-center justify-center space-x-2 transition-all cursor-pointer text-xs disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Submitting Ticket...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Support Message</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>

    </div>
  );
}