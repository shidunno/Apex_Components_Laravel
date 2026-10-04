import { HelpCircle } from 'lucide-react';
import Navbar from '../Components/Navbar';
import ContactSupport from '../Components/ContactSupport';
import Footer from '../Components/Footer';

export default function Contactsupport() {
  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col selection:bg-purple-600 selection:text-white relative">
      <Navbar />

      <main className="flex-1 flex flex-col min-w-0 bg-[#0d0d0f] max-w-6xl mx-auto w-full p-6 md:p-10 pt-8 space-y-10">
        
        {/* Page Title Header */}
        <div className="pb-2 border-b border-neutral-800">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-400" />
            <span>Contact Support</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">Need help with your custom rig, parts, or order? Our technical team is here for you.</p>
        </div>

        {/* Render Contact Support Component */}
        <ContactSupport />

      </main>
      <Footer />
    </div>
  );
}