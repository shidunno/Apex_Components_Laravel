import { useEffect } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function Toast({ message, type = 'error', onClose }) {
  // Auto-dismiss after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isError = type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 bg-[#161619] border border-neutral-800 px-4 py-3 rounded-2xl shadow-2xl animate-fade-in text-white">
      {isError ? (
        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      )}
      <span className="text-xs font-medium">{message}</span>
      <button 
        onClick={onClose}
        className="text-neutral-400 hover:text-white p-1 cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}