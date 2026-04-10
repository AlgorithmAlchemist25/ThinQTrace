import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Target, Activity, PenTool } from 'lucide-react';

export default function Tests() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-12 relative z-10 px-4 sm:px-6 lg:px-8 pt-10">
      
      <div className="text-center max-w-3xl mx-auto space-y-6 mb-16">
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-[#FDFBF9] drop-shadow-sm">
          Available <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Assessments</span>
        </h1>
        <p className="text-xl sm:text-2xl text-[#A6958E] font-medium leading-relaxed">
          Select a diagnostic test below to analyze your cognitive performance and reaction latency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Reaction Time Card */}
        <Link to="/test/reaction" className="group relative bg-[#1F1715]/80 backdrop-blur-2xl rounded-[2rem] p-8 transition-all hover:scale-[1.02] shadow-2xl border border-white/5 overflow-hidden flex flex-col justify-between min-h-[400px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[60px] transform group-hover:scale-110 transition-transform -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="bg-[#110C0A] p-4 rounded-2xl w-fit mb-8 shadow-inner border border-white/5 group-hover:bg-amber-500/10 transition-colors">
              <Zap className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-3xl font-black text-[#FDFBF9] mb-4 tracking-tight drop-shadow-sm group-hover:text-amber-400 transition-colors">Reaction Latency</h3>
            <p className="text-[#A6958E] text-lg font-medium leading-relaxed group-hover:text-[#D4C3BA] transition-colors">
              Measure your simple visuo-motor response time. Essential for tracking central nervous system fatigue.
            </p>
          </div>
          <div className="relative z-10 mt-8 flex items-center text-amber-500 font-bold uppercase tracking-widest text-sm group-hover:text-amber-400">
            <span className="mr-2">Commence Test</span>
            <span className="group-hover:translate-x-2 transition-transform">&rarr;</span>
          </div>
        </Link>

        {/* Attention Card */}
        <Link to="/test/attention" className="group relative bg-[#1F1715]/80 backdrop-blur-2xl rounded-[2rem] p-8 transition-all hover:scale-[1.02] shadow-2xl border border-white/5 overflow-hidden flex flex-col justify-between min-h-[400px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[60px] transform group-hover:scale-110 transition-transform -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
             <div className="bg-[#110C0A] p-4 rounded-2xl w-fit mb-8 shadow-inner border border-white/5 group-hover:bg-emerald-500/10 transition-colors">
              <Target className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-3xl font-black text-[#FDFBF9] mb-4 tracking-tight drop-shadow-sm group-hover:text-emerald-400 transition-colors">Visual Attention</h3>
            <p className="text-[#A6958E] text-lg font-medium leading-relaxed group-hover:text-[#D4C3BA] transition-colors">
              Identify targets amidst distractors. Tracks sustained attention and visual search efficiency.
            </p>
          </div>
          <div className="relative z-10 mt-8 flex items-center text-emerald-500 font-bold uppercase tracking-widest text-sm group-hover:text-emerald-400">
            <span className="mr-2">Commence Test</span>
            <span className="group-hover:translate-x-2 transition-transform">&rarr;</span>
          </div>
        </Link>

        {/* Typing Test Card */}
        <Link to="/test/typing" className="group relative bg-[#1F1715]/80 backdrop-blur-2xl rounded-[2rem] p-8 transition-all hover:scale-[1.02] shadow-2xl border border-white/5 overflow-hidden flex flex-col justify-between min-h-[400px]">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] transform group-hover:scale-110 transition-transform -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
             <div className="bg-[#110C0A] p-4 rounded-2xl w-fit mb-8 shadow-inner border border-white/5 group-hover:bg-indigo-500/10 transition-colors">
              <Activity className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-3xl font-black text-[#FDFBF9] mb-4 tracking-tight drop-shadow-sm group-hover:text-indigo-400 transition-colors">Motor Rhythm</h3>
            <p className="text-[#A6958E] text-lg font-medium leading-relaxed group-hover:text-[#D4C3BA] transition-colors">
              Analyze inter-key interval variance. Detects subtle psychomotor slowing and cognitive load.
            </p>
          </div>
          <div className="relative z-10 mt-8 flex items-center text-indigo-500 font-bold uppercase tracking-widest text-sm group-hover:text-indigo-400">
            <span className="mr-2">Commence Test</span>
            <span className="group-hover:translate-x-2 transition-transform">&rarr;</span>
          </div>
        </Link>

        {/* Drawing Test Card */}
        <Link to="/test/drawing" className="group relative bg-[#1F1715]/80 backdrop-blur-2xl rounded-[2rem] p-8 transition-all hover:scale-[1.02] shadow-2xl border border-white/5 overflow-hidden flex flex-col justify-between min-h-[400px]">
           <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[60px] transform group-hover:scale-110 transition-transform -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
             <div className="bg-[#110C0A] p-4 rounded-2xl w-fit mb-8 shadow-inner border border-white/5 group-hover:bg-cyan-500/10 transition-colors">
              <PenTool className="w-8 h-8 text-cyan-500" />
            </div>
            <h3 className="text-3xl font-black text-[#FDFBF9] mb-4 tracking-tight drop-shadow-sm group-hover:text-cyan-400 transition-colors">Motor Tracing</h3>
            <p className="text-[#A6958E] text-lg font-medium leading-relaxed group-hover:text-[#D4C3BA] transition-colors">
              Assess fine motor control and visual-motor coordination by tracing a dynamic path.
            </p>
          </div>
          <div className="relative z-10 mt-8 flex items-center text-cyan-500 font-bold uppercase tracking-widest text-sm group-hover:text-cyan-400">
            <span className="mr-2">Commence Test</span>
            <span className="group-hover:translate-x-2 transition-transform">&rarr;</span>
          </div>
        </Link>

      </div>
    </div>
  );
}
