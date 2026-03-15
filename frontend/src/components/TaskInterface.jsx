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
        events
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error submitting data", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      
      <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 font-semibold mb-2 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Typing Test</h2>
          </div>
      </div>

      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/60">
        <div className="bg-[#423633] p-10 text-[#F5E6DE] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-l from-indigo-500/20 to-transparent mix-blend-screen opacity-50 blur-[60px] transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl shadow-inner border border-white/20 mb-6">
                <Activity className="w-10 h-10 text-indigo-400" />
            </div>
            <div>
                <h2 className="text-4xl font-extrabold tracking-tight mb-2">ThinQTrace Assessment</h2>
                <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 px-4 py-1.5 rounded-full font-semibold text-xs uppercase tracking-widest border border-indigo-500/30">
                    Behavioral Cognitive Detection
                </div>
            </div>
          </div>
        </div>

        <div className="p-10">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 shadow-sm">
                <p className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-3">Target Text</p>
                <p className="text-slate-800 text-xl font-medium leading-relaxed select-none">
                {SAMPLE_TEXT}
                </p>
            </div>

            {isTaskActive ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <textarea
                    className="w-full h-48 p-6 bg-slate-50/50 border-2 border-indigo-200/50 focus:border-indigo-400 focus:bg-white rounded-2xl outline-none resize-none text-xl transition-all shadow-inner relative z-10 placeholder-slate-400 text-slate-700"
                    placeholder="Start typing the text above here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    autoFocus
                />
                <button 
                    onClick={handleSubmit}
                    className="w-full py-5 bg-gradient-to-r from-[#4E403D] to-[#2D2422] hover:from-[#3B302E] hover:to-[#1A1413] text-white rounded-2xl font-bold text-xl transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                    Submit Assessment
                </button>
                </div>
            ) : (
                <button 
                onClick={handleStart}
                className="w-full py-5 bg-[#D4C3BA] hover:bg-[#C2AEB4] text-[#423633] rounded-2xl font-bold text-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                {result ? "Restart Assessment" : "Start Assessment"}
                </button>
            )}

            {loading && (
                <div className="mt-8 pt-8 border-t border-slate-100 text-center animate-pulse">
                    <div className="inline-flex items-center justify-center space-x-3 text-blue-600 font-medium">
                        <Activity className="w-6 h-6 animate-spin" />
                        <span>Analyzing behavioral telemetry...</span>
                    </div>
                </div>
            )}

            {result && (
                <div className={`mt-8 p-8 rounded-3xl border-2 transition-all animate-in zoom-in duration-500 ${result.cognitive_score === 'High' ? 'bg-red-50 border-red-200' : result.cognitive_score === 'Medium' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-extrabold text-slate-800">Assessment Results</h3>
                    <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${result.cognitive_score === 'High' ? 'bg-red-200 text-red-800' : result.cognitive_score === 'Medium' ? 'bg-amber-200 text-amber-800' : 'bg-emerald-200 text-emerald-800'}`}>
                        Score Confirmed
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Cognitive Score</p>
                    <p className={`text-4xl font-extrabold ${result.cognitive_score === 'High' ? 'text-red-600' : result.cognitive_score === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {result.cognitive_score}
                    </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Average Delay</p>
                    <p className="text-3xl font-bold text-slate-700">{result.metrics.average_iki_ms} <span className="text-lg text-slate-400">ms</span></p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Variance</p>
                    <p className="text-3xl font-bold text-slate-700">{result.metrics.variance}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Keystrokes</p>
                    <p className="text-3xl font-bold text-slate-700">{result.metrics.key_count}</p>
                    </div>
                </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
