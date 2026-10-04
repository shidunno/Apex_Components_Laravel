import { Cpu, Disc as Discord, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#121215] border-t border-neutral-800 text-neutral-400 py-12 px-6 md:px-10 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2 text-white font-bold tracking-tight">
            <div className="w-8 h-8 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Cpu className="w-4 h-4" />
            </div>
            <span>ApexParts</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Engineering high-performance custom rigs, hardware components, and precision gaming setups for enthusiasts.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/catalog" className="hover:text-purple-400 transition-colors">Component Catalog</a></li>
            <li><a href="/builder" className="hover:text-purple-400 transition-colors">Custom Rig Builder</a></li>
            <li><a href="/tracking" className="hover:text-purple-400 transition-colors">Order Tracking</a></li>
            <li><a href="/support" className="hover:text-purple-400 transition-colors">Contact Support</a></li>
          </ul>
        </div>

        {/* Legal & Support */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Support & Legal</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/warranty" className="hover:text-purple-400 transition-colors">Hardware Warranty</a></li>
            <li><a href="/shipping" className="hover:text-purple-400 transition-colors">Shipping & Returns</a></li>
            <li><a href="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        {/* Newsletter / Status */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">System Status</h4>
          <div className="flex items-center gap-2 text-xs bg-[#161619] border border-neutral-800 p-3 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-neutral-300">All Hardware Nodes Online</span>
          </div>
          <p className="text-[11px] text-neutral-500">
            Secure SSL 256-bit encryption active for all builds and transactions.
          </p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto pt-6 border-t border-neutral-800/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <p className="text-neutral-500">
          © {new Date().getFullYear()} ApexParts Inc. All rights reserved.
        </p>

        <div className="flex items-center gap-4 text-neutral-400">
          <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            <Discord className="w-4 h-4" />
          </a>
          <a href="mailto:support@apexparts.com" className="hover:text-white transition-colors">
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}