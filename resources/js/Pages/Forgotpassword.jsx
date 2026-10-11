import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Mail, ArrowLeft, CheckCircle2, Send } from 'lucide-react';
import Footer from '../Components/Footer';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API request to send password reset instructions
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <>
      <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col justify-center items-center px-6 py-12 selection:bg-purple-600 selection:text-white relative font-sans">
      
      {/* BACKGROUND GLOW EFFECT */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        
        {/* LOGO / BRANDING HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2.5 bg-[#161619] px-4 py-2 rounded-2xl border border-neutral-800 shadow-inner">
            <Award className="w-5 h-5 text-purple-400" />
            <span className="text-xs font-bold tracking-wider text-white">APEX COMPONENTS PORTAL</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Reset Password</h1>
          <p className="text-sm text-neutral-400">
            Enter your account email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {/* CARD CONTAINER */}
        <div className="bg-[#161619] border border-neutral-800 rounded-3xl p-8 shadow-2xl space-y-6">
          
          {submitted ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Check your email</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  We have sent password recovery instructions to <span className="text-white font-semibold">{email}</span>.
                </p>
              </div>
              <button 
                onClick={() => setSubmitted(false)}
                className="w-full bg-[#121215] hover:bg-neutral-800 text-white font-semibold text-xs py-3.5 rounded-xl transition-all cursor-pointer border border-neutral-800 shadow-md"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-neutral-500 absolute left-3.5 top-3.5" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#121215] border border-neutral-800 rounded-xl px-4 py-3 pl-11 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all shadow-inner"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs py-3.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-purple-900/30 disabled:opacity-50"
              >
                {loading ? (
                  <span>Sending instructions...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Reset Instructions</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-neutral-800 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center space-x-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>

        </div>
      </div>

      </div>
      <Footer />
    </>
  );
}