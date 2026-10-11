import { useState } from 'react';
import { 
  Award, ArrowRight, Shield, Sparkles, Trophy, 
  Target, Globe, Users, Compass, Cpu, Zap, Layers, Sliders 
} from 'lucide-react';
import Navbar from '../../Components/Navbar.jsx';
import Footer from '../../Components/Footer.jsx';
import Businessprofile from '../../Components/Businessprofile';
import ProductsServices from '../../Components/ProductsServices';
import MissionVision from '../../Components/MissionVision.jsx';

// Import your asset images
import loginImg1 from '../../Assets/loginimg1.jpg';
import loginImg2 from '../../Assets/loginimg2.jpg';
import loginImg3 from '../../Assets/loginimg3.jpg';

export default function Dashboard() {
  const achievements = [
    { 
      id: 1, 
      title: 'Top Custom Rig Hardware Provider', 
      desc: 'Recognized globally for delivering extreme performance, rock-solid stability, and premium cooling architectures.', 
      icon: Trophy, 
      year: '2025',
      image: loginImg1
    },
    { 
      id: 2, 
      title: 'Advanced Thermal Engineering Award', 
      desc: 'Pioneering next-gen liquid cooling solutions and optimized airflow chassis designs for elite enthusiasts.', 
      icon: Sparkles, 
      year: '2026',
      image: loginImg2
    },
    { 
      id: 3, 
      title: 'Global Esports & Creator Partner', 
      desc: 'Trusted hardware supplier powering championship esports arenas and professional studio workflows worldwide.', 
      icon: Cpu, 
      year: 'Active',
      image: loginImg3
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white selection:bg-purple-600 selection:text-white relative font-sans flex flex-col">
      {/* GLOBAL NAVBAR */}
      <Navbar />

      {/* DASHBOARD MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 md:p-10 space-y-8 mt-2">
        
        {/* HERO BANNER CONTAINER */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-950/60 via-[#161619] to-indigo-950/40 border border-neutral-800/80 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-4 relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300 bg-purple-500/10 px-3.5 py-1.5 rounded-full border border-purple-500/20">
              <Globe className="w-3.5 h-3.5 text-purple-400" /> Welcome to Apex Components
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Architecting the Future of High-End PC Rigs
            </h1>
            <p className="text-sm md:text-base text-neutral-300 leading-relaxed font-normal">
              Apex Components is a premier developer ecosystem dedicated to engineering next-generation hardware components, custom chassis, and thermal solutions designed for peak performance.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <a 
              href="#mission-vision"
              className="px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-2xl shadow-lg shadow-purple-900/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              Our Mission & Vision <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* BUSINESS PROFILE CONTAINER */}
        <Businessprofile />

        {/* PRODUCTS & SERVICES CONTAINER */}
        <ProductsServices />

        {/* INTERACTIVE SHOWCASE CONTAINER (Split Layout) */}
        <div className="bg-[#161619] border border-neutral-800/80 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="lg:col-span-7 space-y-4 relative z-10">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/10 px-3.5 py-1 rounded-full border border-indigo-500/20">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Interactive Showcase
            </span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Flagship Build Lab & Rig Telemetry
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Inspect our high-performance thermal rigs, real-time power distribution benchmarks, and stress-tested component configurations engineered for elite enthusiasts.
            </p>
            <div className="pt-2 flex items-center space-x-6 text-xs font-semibold">
              <div>
                <span className="text-neutral-400 block font-normal">Rig Compatibility:</span>
                <span className="text-emerald-400 text-sm font-bold">100% Optimized</span>
              </div>
              <div className="border-l border-neutral-800 pl-6">
                <span className="text-neutral-400 block font-normal">Enthusiast Trust:</span>
                <span className="text-purple-300 text-sm font-bold">50,000+ Active Rigs</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 w-full bg-[#121215] border border-neutral-800/80 rounded-2xl p-4 shadow-xl relative z-10">
            <div className="relative h-52 w-full rounded-xl overflow-hidden border border-neutral-800/80">
              <img src={loginImg1} alt="Apex Setup Showcase" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-3 left-3">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-600 text-white px-2.5 py-1 rounded-md shadow-md">
                  Flagship Build Lab
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MISSION & VISION CONTAINER (Using dedicated component) */}
        <div id="mission-vision">
          <MissionVision />
        </div>

        {/* MILESTONES & ACHIEVEMENTS CONTAINER */}
        <div className="bg-[#161619] border border-neutral-800/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">Milestones & Achievements</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Key breakthroughs and recognition driving Apex Components forward.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {achievements.map((item) => {
              const IconComp = item.icon;
              return (
                <div key={item.id} className="bg-[#121215] border border-neutral-800/80 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-purple-500/40 transition-all shadow-lg group">
                  <div className="relative h-36 w-full overflow-hidden bg-[#0a0a0c]">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-transparent"></div>
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-600/90 text-white px-2.5 py-1 rounded-md shadow-md">
                        {item.year}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div className="flex items-center space-x-2 text-purple-400">
                      <IconComp className="w-4 h-4 shrink-0" />
                      <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* WHY CHOOSE APEX CONTAINER (Numbered Feature Grid) */}
        <div className="bg-[#161619] border border-neutral-800/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">Why Choose Apex Components</h2>
            <p className="text-xs text-neutral-400 mt-0.5">The core principles guiding our engineering philosophy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: 'Uncompromising Quality', desc: 'Every component undergoes rigorous multi-stage stress testing to ensure peak reliability under extreme workloads.' },
              { title: 'Enthusiast-Driven Design', desc: 'Engineered hand-in-hand with builders, overclockers, and professional creators to exceed modern hardware demands.' },
              { title: 'Future-Proof Architecture', desc: 'Building modular ecosystems that scale seamlessly with next-generation processing power and graphical leaps.' }
            ].map((val, idx) => (
              <div key={idx} className="bg-[#121215] border border-neutral-800/80 rounded-2xl p-6 space-y-3 shadow-lg hover:border-purple-500/40 transition-all">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-black text-xs">
                  0{idx + 1}
                </div>
                <h3 className="text-sm font-bold text-white">{val.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}