import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Type, Zap, Target, BrainCircuit } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12 relative z-10 px-4 sm:px-6 lg:px-8">
      
      {/* Hero Section */}
      <div className="relative pt-10 pb-20 md:pt-16 md:pb-40 flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-3/5 z-20">
            <div className="inline-flex items-center space-x-2 bg-amber-500/10 text-amber-300 border border-amber-500/20 px-4 py-1.5 rounded-full font-bold text-[0.75rem] uppercase tracking-widest mb-8 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <Activity className="w-4 h-4" />
                <span>Cognitive Load Meter</span>
            </div>
            
            <h2 className="text-5xl md:text-[4.5rem] font-black text-white leading-[1.1] mb-8 tracking-tight">
                Understand Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 drop-shadow-lg">
                    Digital Mental <br/>Bandwidth.
                </span>
            </h2>
            
            {/* Visual Meter */}
            <div className="flex items-center space-x-4 mb-10 w-full max-w-lg">
                <span className="text-[#A6958E] font-semibold text-sm tracking-wider uppercase">Low</span>
                <div className="flex-1 h-2.5 bg-[#2A211F] rounded-full overflow-hidden flex shadow-inner">
                    <div className="w-1/3 h-full bg-gradient-to-r from-emerald-400 to-emerald-300"></div>
                    <div className="w-1/3 h-full bg-gradient-to-r from-amber-400 to-amber-300"></div>
                    <div className="w-[15%] h-full bg-gradient-to-r from-orange-500 to-orange-400"></div>
                    <div className="flex-1 h-full bg-[#2A211F]"></div>
                </div>
            </div>

            <p className="text-xl text-[#D0C2BB] max-w-xl leading-relaxed font-light">
                Interact with the three core behavioral tasks below. The system will process your response time, accuracy, and interactions to securely estimate your cognitive load level.
            </p>
        </div>
        
        {/* Large Glowing Brain Graphic on the right */}
        <div className="w-full md:w-2/5 absolute right-0 top-1/2 -translate-y-1/2 opacity-90 pointer-events-none flex justify-end">
            <div className="relative">
                {/* Glow behind brain */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-amber-500/20 rounded-full blur-[100px]"></div>
                <BrainCircuit className="w-96 h-96 text-amber-200/40 drop-shadow-[0_0_30px_rgba(251,191,36,0.4)]" strokeWidth={1} />
            </div>
        </div>
      </div>

      {/* Tests Grid (Floating at the bottom, overlapping hero area) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-30 md:-mt-28">
        
        {/* Typing Test Card */}
        <div className="group h-full">
            <div className="bg-[#1F1715]/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/5 hover:border-indigo-500/50 hover:bg-[#251D1B]/90 transition-all duration-500 transform group-hover:-translate-y-2 h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-center space-x-4 mb-6 mt-2 relative z-10">
                    <div className="bg-indigo-500/10 w-14 h-14 rounded-2xl flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)] group-hover:scale-110 transition-transform">
                        <Type className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#FDFBF9]">Typing Test</h3>
                </div>
                
                <p className="text-[#A6958E] flex-grow text-base md:text-sm lg:text-base leading-relaxed mb-8 relative z-10">
                    Evaluates cognitive load by analyzing typing speed, error rates, and micro-task performance.
                </p>
                
                <Link to="/test/typing" className="w-full relative z-10">
                    <div className="w-full flex items-center justify-between bg-[#150F0D] hover:bg-[#0A0706] border border-white/5 rounded-2xl px-6 py-4 transition-colors group-hover:border-indigo-500/30">
                        <div className="flex items-center space-x-3 text-[#D4C3BA] font-semibold text-sm">
                           <Activity className="w-4 h-4 text-indigo-400" />
                           <span>Typing Test</span>
                        </div>
                        <span className="text-[#A6958E] font-bold group-hover:text-indigo-400 transition-colors">&gt;</span>
                    </div>
                </Link>
            </div>
        </div>

        {/* Reaction Test Card */}
        <div className="group h-full">
            <div className="bg-[#1F1715]/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/5 hover:border-amber-500/50 hover:bg-[#251D1B]/90 transition-all duration-500 transform group-hover:-translate-y-2 h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-orange-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-center space-x-4 mb-6 mt-2 relative z-10">
                    <div className="bg-amber-500/10 w-14 h-14 rounded-2xl flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)] group-hover:scale-110 transition-transform">
                        <Zap className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#FDFBF9]">Reaction Test</h3>
                </div>
                
                <p className="text-[#A6958E] flex-grow text-base md:text-sm lg:text-base leading-relaxed mb-8 relative z-10">
                    Measures pure motor response time and reflex degradation associated with high mental load.
                </p>
                
                <Link to="/test/reaction" className="w-full relative z-10">
                    <div className="w-full flex items-center justify-between bg-[#150F0D] hover:bg-[#0A0706] border border-white/5 rounded-2xl px-6 py-4 transition-colors group-hover:border-amber-500/30">
                        <div className="flex items-center space-x-3 text-[#D4C3BA] font-semibold text-sm">
                           <Zap className="w-4 h-4 text-amber-400" />
                           <span>Reaction Test</span>
                        </div>
                        <span className="text-[#A6958E] font-bold group-hover:text-amber-400 transition-colors">&gt;</span>
                    </div>
                </Link>
            </div>
        </div>

        {/* Attention Test Card */}
        <div className="group h-full">
            <div className="bg-[#1F1715]/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/5 hover:border-emerald-500/50 hover:bg-[#251D1B]/90 transition-all duration-500 transform group-hover:-translate-y-2 h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-center space-x-4 mb-6 mt-2 relative z-10">
                    <div className="bg-emerald-500/10 w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-transform">
                        <Target className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#FDFBF9]">Attention Test</h3>
                </div>
                
                <p className="text-[#A6958E] flex-grow text-base md:text-sm lg:text-base leading-relaxed mb-8 relative z-10">
                    Assesses focus and visual discrimination by requiring the user to identify targets.
                </p>
                
                <Link to="/test/attention" className="w-full relative z-10">
                    <div className="w-full flex items-center justify-between bg-[#150F0D] hover:bg-[#0A0706] border border-white/5 rounded-2xl px-6 py-4 transition-colors group-hover:border-emerald-500/30">
                        <div className="flex items-center space-x-3 text-[#D4C3BA] font-semibold text-sm">
                           <Target className="w-4 h-4 text-emerald-400" />
                           <span>Attention Test</span>
                        </div>
                        <span className="text-[#A6958E] font-bold group-hover:text-emerald-400 transition-colors">&gt;</span>
                    </div>
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
}
