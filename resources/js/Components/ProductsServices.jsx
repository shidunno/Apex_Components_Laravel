import { Link } from 'react-router-dom';
import { Cpu, Wrench, ShieldAlert, ArrowRight, Layers, Flame } from 'lucide-react';

export default function ProductsServices() {
  const highlights = [
    {
      title: "Bespoke Desktop Rigs",
      description: "Hand-assembled, benchmark-verified gaming and professional workstation systems.",
      icon: Cpu,
      badge: "Flagship",
      link: "/catalog"
    },
    {
      title: "Custom Thermal Loops",
      description: "Advanced hardline and soft-tubing liquid cooling solutions engineered for sub-zero thermal headroom.",
      icon: Flame,
      badge: "Popular",
      link: "/catalog"
    },
    {
      title: "Rig Telemetry & Tuning",
      description: "Professional overclocking, voltage optimization, and multi-stage stress testing services.",
      icon: Wrench,
      badge: "Expert Service",
      link: "/support"
    }
  ];

  return (
    <section className="w-full bg-[#161619] border border-neutral-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 transition-all duration-300 hover:border-purple-500/30">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-3.5 py-1 rounded-full border border-purple-500/20">
            <Layers className="w-3.5 h-3.5" /> Ecosystem Highlights
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-2">
            Products & Core Services
          </h2>
          <p className="text-xs text-neutral-400">
            Explore our premier hardware solutions or jump straight to the full catalog.
          </p>
        </div>

        <Link 
          to="/catalog" 
          className="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-purple-500/50 text-neutral-300 hover:text-white font-semibold text-xs transition-all shadow-sm"
        >
          View Full Catalog <ArrowRight className="w-4 h-4 text-purple-400" />
        </Link>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {highlights.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div 
              key={idx} 
              className="bg-[#121215] border border-neutral-800/80 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all duration-300 hover:border-purple-500/40 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-900 border border-neutral-800 text-neutral-400 px-2.5 py-1 rounded-md">
                    {item.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>

              <Link 
                to={item.link}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors pt-2 border-t border-neutral-800/60"
              >
                Learn more <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>

    </section>
  );
}