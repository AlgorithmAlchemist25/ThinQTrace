import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Target, ArrowLeft, MousePointerClick } from 'lucide-react';
import { Link } from 'react-router-dom';

const GRID_SIZE = 25; // 5x5 grid

export default function AttentionTest() {
  const [gameState, setGameState] = useState('waiting');
  const [grid, setGrid] = useState(Array(GRID_SIZE).fill('empty'));
  const [targetIndex, setTargetIndex] = useState(-1);
  const [round, setRound] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const startTime = useRef(0);
  const events = useRef([]);
  const sessionId = useRef(crypto.randomUUID());

  const handleStart = () => {
    setGameState('active');
    setResult(null);
    setRound(1);
    events.current = [];
    generateRound();
  };

  const generateRound = () => {
    const newGrid = Array(GRID_SIZE).fill('distractor');
    const randomTarget = Math.floor(Math.random() * GRID_SIZE);
    newGrid[randomTarget] = 'target';
    
    setGrid(newGrid);
    setTargetIndex(randomTarget);
    startTime.current = Date.now();
  };

  const handleCellClick = async (type, index) => {
    if (gameState !== 'active') return;

    const clickTime = Date.now() - startTime.current;
    const isCorrect = type === 'target';

    events.current.push({
      key: "mouse_click",
      timestamp: clickTime,
      eventType: "attention_click",
      isCorrect: isCorrect
    });

    if (round < 5) {
        setRound(r => r + 1);
        generateRound();
    } else {
        setGameState('done');
        await submitData();
    }
  };

  const submitData = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/submit-data', {
        sessionId: sessionId.current,
        taskType: 'attention-test',
        events: events.current
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error submitting data", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to="/" className="inline-flex items-center text-slate-500 hover:text-emerald-600 font-semibold mb-2 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Attention Test</h2>
          </div>
          <div className="bg-emerald-100 p-4 rounded-2xl">
              <Target className="w-10 h-10 text-emerald-600" />
          </div>
      </div>

      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/60">
        <div className="bg-[#423633] p-10 text-[#F5E6DE] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-l from-emerald-500/20 to-transparent mix-blend-screen opacity-50 blur-[60px] transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl shadow-inner border border-white/20 mb-6">
                <Target className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
                <h2 className="text-4xl font-extrabold tracking-tight mb-2">ThinQTrace Assessment</h2>
                <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-4 py-1.5 rounded-full font-semibold text-xs uppercase tracking-widest border border-emerald-500/30">
                    Visual Form Discrimination
                </div>
            </div>
          </div>
        </div>

        <div className="p-10">
        {gameState === 'waiting' && (
             <div className="py-20 max-w-lg mx-auto text-center">
                <MousePointerClick className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-slate-700 mb-4">Find the specific target</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    A grid of shapes will appear. Click the <strong className="text-emerald-600">solid emerald circle</strong> as fast as you can. Ignore the distractors.
                </p>
                <button 
                onClick={handleStart}
                className="w-full py-5 bg-[#D4C3BA] hover:bg-[#C2AEB4] text-[#423633] rounded-2xl font-bold text-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                    Start Assessment
                </button>
             </div>
        )}

        {gameState === 'active' && (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Round {round} / 5</span>
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-1 rounded-full animate-pulse">Focus</span>
                </div>
                <div className="grid grid-cols-5 gap-3 max-w-md mx-auto p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    {grid.map((type, i) => (
                        <div 
                           key={i}
                           onClick={() => handleCellClick(type, i)}
                           className={`aspect-square rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 ${
                               type === 'target' ? 'bg-emerald-500 shadow-md' : 'bg-slate-300'
                           }`}
                        >
                        </div>
                    ))}
                </div>
            </div>
        )}

        {gameState === 'done' && loading && (
                <div className="py-20 animate-pulse">
                    <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest">Analyzing Discrimination Latency...</p>
                </div>
        )}

        {gameState === 'done' && !loading && result && (
                <div className="py-10 animate-in slide-in-from-bottom-4">
                    <h3 className="text-2xl font-bold text-slate-700 mb-8">Test Complete</h3>
                    
                    <div className="grid grid-cols-2 gap-6 max-w-md mx-auto mb-8">
                        <div className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-100">
                            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Accuracy</p>
                            <p className="text-4xl font-black text-emerald-500">{result.metrics.accuracy}%</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-100">
                            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Avg Search Time</p>
                            <p className="text-4xl font-black text-slate-700">{result.metrics.avg_search_time_ms} <span className="text-lg text-slate-400">ms</span></p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleStart}
                        className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-xl"
                    >
                        Try Again
                    </button>
                </div>
        )}
        </div>
      </div>
    </div>
  );
}
