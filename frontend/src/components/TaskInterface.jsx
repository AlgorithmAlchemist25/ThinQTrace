import React, { useState } from 'react';
import { useMetrics } from '../hooks/useMetrics';
import axios from 'axios';
import { Activity, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog. Cognitive load affects how we type, introducing slight hesitations and errors. Please type this text as continuously and naturally as possible.";

export default function TaskInterface() {
  const [input, setInput] = useState('');
  const [isTaskActive, setIsTaskActive] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { events, sessionId, clearMetrics } = useMetrics(isTaskActive);

  const handleStart = () => {
    setIsTaskActive(true);
    setInput('');
    clearMetrics();
    setResult(null);
  };

  const handleSubmit = async () => {
    setIsTaskActive(false);
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/submit-data', {
        sessionId,
        taskType: 'typing-test',
        events,
        token: localStorage.getItem('token')
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error submitting data", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-500 pb-12">
      
      <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to="/" className="inline-flex items-center text-[#A6958E] hover:text-indigo-400 font-semibold mb-2 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
            <h2 className="text-4xl font-black text-[#FDFBF9] tracking-tight">Typing Test</h2>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl">
              <Activity className="w-10 h-10 text-indigo-400" />
          </div>
      </div>

      <div className="bg-[#1F1715]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/5 overflow-hidden">
        <div className="bg-[#150F0D] p-10 text-[#FDFBF9] relative overflow-hidden border-b border-white/5">
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-l from-indigo-500/10 to-transparent mix-blend-screen opacity-50 blur-[60px] transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="p-4 bg-indigo-500/10 backdrop-blur-sm rounded-2xl shadow-inner border border-indigo-500/20 mb-6">
                <Activity className="w-10 h-10 text-indigo-400" />
            </div>
            <div>
                <h2 className="text-4xl font-black tracking-tight mb-3">ThinQTrace Assessment</h2>
                <div className="inline-flex items-center space-x-2 bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                    Behavioral Cognitive Detection
                </div>
            </div>
          </div>
        </div>

        <div className="p-10 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="bg-[#110C0A] p-6 rounded-3xl border border-white/5 mb-8 shadow-inner relative z-10">
                <p className="text-[#A6958E] font-bold uppercase tracking-wider text-sm mb-3">Target Text</p>
                <p className="text-[#D4C3BA] text-xl font-medium leading-relaxed select-none">
                {SAMPLE_TEXT}
                </p>
            </div>

            {isTaskActive ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                <textarea
                    className="w-full h-48 p-6 bg-[#110C0A] border-2 border-indigo-500/30 focus:border-indigo-400 focus:bg-[#1A1311] rounded-3xl outline-none resize-none text-xl transition-all shadow-inner relative z-10 placeholder-[#A6958E] text-[#FDFBF9]"
                    placeholder="Start typing the text above here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    autoFocus
                />
                <button 
                    onClick={handleSubmit}
                    className="w-full py-5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-[#110C0A] rounded-2xl font-black text-xl transition-all shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] transform hover:-translate-y-1"
                >
                    Submit Assessment
                </button>
                </div>
            ) : (
                <div className="relative z-10">
                <button 
                onClick={handleStart}
                className="w-full py-5 bg-[#150F0D] hover:bg-[#0A0706] text-[#FDFBF9] border border-white/10 rounded-2xl font-black text-xl transition-all hover:border-indigo-500/50 shadow-lg"
                >
                {result ? "Restart Assessment" : "Start Assessment"}
                </button>
                </div>
            )}

            {loading && (
                <div className="mt-8 pt-8 border-t border-white/5 text-center animate-pulse relative z-10">
                    <div className="inline-flex items-center justify-center space-x-3 text-indigo-400 font-bold tracking-widest uppercase">
                        <Activity className="w-6 h-6 animate-spin" />
                        <span>Analyzing behavioral telemetry...</span>
                    </div>
                </div>
            )}

            {result && (
                <div className="mt-12 p-10 rounded-3xl border border-white/5 bg-[#110C0A] shadow-inner transition-all animate-in zoom-in slide-in-from-bottom-8 duration-500 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 space-y-4 sm:space-y-0">
                    <h3 className="text-3xl font-black text-[#FDFBF9]">Assessment Results</h3>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider border ${result.cognitive_score === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : result.cognitive_score === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                        Score Confirmed
                    </span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-[#150F0D] p-6 rounded-3xl border border-white/5 shadow-inner flex flex-col items-center text-center">
                    <p className="text-xs font-bold text-[#A6958E] uppercase tracking-widest mb-3">Cognitive Score</p>
                    <p className={`text-3xl font-black drop-shadow-[0_0_10px_currentColor] ${result.cognitive_score === 'High' ? 'text-red-500' : result.cognitive_score === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {result.cognitive_score}
                    </p>
                    </div>
                    <div className="bg-[#150F0D] p-6 rounded-3xl border border-white/5 shadow-inner flex flex-col items-center text-center">
                    <p className="text-xs font-bold text-[#A6958E] uppercase tracking-widest mb-3">Average Delay</p>
                    <p className="text-3xl font-black text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.3)]">{result.metrics.average_iki_ms} <span className="text-lg text-[#A6958E]">ms</span></p>
                    </div>
                    <div className="bg-[#150F0D] p-6 rounded-3xl border border-white/5 shadow-inner flex flex-col items-center text-center">
                    <p className="text-xs font-bold text-[#A6958E] uppercase tracking-widest mb-3">Variance</p>
                    <p className="text-2xl font-black text-[#D4C3BA]">{result.metrics.variance}</p>
                    </div>
                    <div className="bg-[#150F0D] p-6 rounded-3xl border border-white/5 shadow-inner flex flex-col items-center text-center">
                    <p className="text-xs font-bold text-[#A6958E] uppercase tracking-widest mb-3">Keystrokes</p>
                    <p className="text-2xl font-black text-[#D4C3BA]">{result.metrics.key_count}</p>
                    </div>
                </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
