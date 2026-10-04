import { Building2, Globe, MapPin, Mail, Phone, Users, ShieldCheck, Award, Calendar } from 'lucide-react';

export default function Businessprofile({ 
  companyName = "APEX Technologies Inc.",
  tagline = "Engineering the Future of High-Performance Computing",
  foundedYear = "2022",
  headquarters = "Silicon Valley, CA",
  website = "https://apex-rigs.com",
  email = "contact@apex-rigs.com",
  phone = "+1 (800) 555-APEX",
  teamSize = "50–100 employees",
  description = "APEX is a premier hardware engineering and custom desktop ecosystem provider. We specialize in pushing the boundaries of raw computational power, precision thermal management, and bespoke aesthetics for professionals, enthusiasts, and enterprise clients worldwide."
}) {
  return (
    <section className="w-full bg-[#161619] border border-neutral-800/80 rounded-3xl overflow-hidden shadow-2xl text-white transition-all duration-300 hover:border-purple-500/30">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/50 via-[#1a1726]/60 to-[#161619] p-6 sm:p-8 border-b border-neutral-800/80 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-56 h-56 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-900/40 shrink-0 border border-purple-400/20">
              <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">{companyName}</h2>
              <p className="text-xs font-medium text-purple-400 mt-1">{tagline}</p>
            </div>
          </div>
          
          <div className="flex items-center self-start sm:self-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold shadow-inner">
              <ShieldCheck className="w-4 h-4" /> Verified Entity
            </span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 sm:p-8 space-y-8">
        
        {/* Overview Description */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Company Overview</h3>
          <p className="text-sm text-neutral-300 leading-relaxed font-normal">
            {description}
          </p>
        </div>

        {/* Quick Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#121215] border border-neutral-800/80 p-4 rounded-2xl space-y-1.5 transition-colors hover:border-purple-500/40">
            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-400" /> Founded
            </span>
            <p className="text-sm font-bold text-white">{foundedYear}</p>
          </div>

          <div className="bg-[#121215] border border-neutral-800/80 p-4 rounded-2xl space-y-1.5 transition-colors hover:border-purple-500/40">
            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-400" /> Headquarters
            </span>
            <p className="text-sm font-bold text-white truncate">{headquarters}</p>
          </div>

          <div className="bg-[#121215] border border-neutral-800/80 p-4 rounded-2xl space-y-1.5 transition-colors hover:border-purple-500/40">
            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-400" /> Team Scale
            </span>
            <p className="text-sm font-bold text-white">{teamSize}</p>
          </div>

          <div className="bg-[#121215] border border-neutral-800/80 p-4 rounded-2xl space-y-1.5 transition-colors hover:border-purple-500/40">
            <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-400" /> Accreditation
            </span>
            <p className="text-sm font-bold text-white">ISO 9001 Certified</p>
          </div>
        </div>

        {/* Contact & Links Footer Bar */}
        <div className="pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-xs text-neutral-400">
            <a href={website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-purple-400 transition-colors">
              <Globe className="w-4 h-4 text-purple-400" /> {website.replace('https://', '')}
            </a>
            <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-purple-400 transition-colors">
              <Mail className="w-4 h-4 text-purple-400" /> {email}
            </a>
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-purple-400" /> {phone}
            </span>
          </div>

          <button 
            onClick={() => window.location.href = `/support`}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-900/30 cursor-pointer transform hover:-translate-y-0.5"
          >
            Get in Touch
          </button>
        </div>

      </div>
    </section>
  );
}