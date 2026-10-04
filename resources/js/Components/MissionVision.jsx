import { Target, Compass } from 'lucide-react';

export default function MissionVision({
  missionTitle = "Our Mission",
  missionText = "To empower builders, gamers, and professional creators with bulletproof hardware components that fuse extreme thermal efficiency, aesthetic brilliance, and unmatched durability.",
  visionTitle = "Our Vision",
  visionText = "To redefine the standard of custom PC building by leading the industry in modular innovation, smart telemetry integration, and uncompromising performance standards."
}) {
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Mission Card */}
      <div className="bg-[#161619] border border-neutral-800/80 rounded-3xl p-8 space-y-4 shadow-xl hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between group">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">{missionTitle}</h2>
          <p className="text-sm text-neutral-300 leading-relaxed font-normal">
            {missionText}
          </p>
        </div>
      </div>

      {/* Vision Card */}
      <div className="bg-[#161619] border border-neutral-800/80 rounded-3xl p-8 space-y-4 shadow-xl hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between group">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">{visionTitle}</h2>
          <p className="text-sm text-neutral-300 leading-relaxed font-normal">
            {visionText}
          </p>
        </div>
      </div>

    </section>
  );
}