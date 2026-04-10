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
    generateRound(1);
  };

  const getCellColor = (type, currentRound) => {
    if (type === 'distractor') {
        return { backgroundColor: 'hsl(150, 70%, 15%)' };
    }
    
    const lightnessOffsets = {
        1: 30,
        2: 15,
        3: 7,
        4: 3,
        5: 1
    };
    const targetLightness = 15 + (lightnessOffsets[currentRound] || 1);
    
    return { backgroundColor: `hsl(150, 70%, ${targetLightness}%)` };
  };

  const generateRound = (currentRound = round) => {
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
        const nextRound = round + 1;
        setRound(nextRound);
        generateRound(nextRound);
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
        events: events.current,
        token: localStorage.getItem('token')
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error submitting data", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500 pb-12">
      <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to="/" className="inline-flex items-center text-[#A6958E] hover:text-emerald-500 font-semibold mb-2 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
            <h2 className="text-4xl font-black text-[#FDFBF9] tracking-tight">Attention Test</h2>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
              <Target className="w-10 h-10 text-emerald-400" />
          </div>
      </div>

      <div className="bg-[#1F1715]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/5 overflow-hidden">
        <div className="bg-[#150F0D] p-10 text-[#FDFBF9] relative overflow-hidden border-b border-white/5">
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-l from-emerald-500/10 to-transparent mix-blend-screen opacity-50 blur-[60px] transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="p-4 bg-emerald-500/10 backdrop-blur-sm rounded-2xl shadow-inner border border-emerald-500/20 mb-6">
                <Target className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
                <h2 className="text-4xl font-black tracking-tight mb-3">ThinQTrace Assessment</h2>
                <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    Visual Form Discrimination
                </div>
            </div>
          </div>
        </div>

        <div className="p-10 text-center text-[#FDFBF9] relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        {gameState === 'waiting' && (
             <div className="py-12 max-w-lg mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-white/5 p-6 rounded-full inline-block mb-6 border border-white/10">
                    <MousePointerClick className="w-16 h-16 text-emerald-500 mx-auto" />
                </div>
                <h3 className="text-3xl font-black text-[#FDFBF9] mb-4">Find the specific target</h3>
                <p className="text-[#A6958E] mb-10 text-lg leading-relaxed">
                    A grid of shapes will appear. Click the <strong className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">lighter green circle</strong> as fast as you can. As levels progress, it will blend in with the distractors.
                </p>
                <button 
                onClick={handleStart}
                className="w-full py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-[#110C0A] rounded-2xl font-black text-xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transform hover:-translate-y-1"
                >
                    Start Assessment
                </button>
             </div>
        )}

        {gameState === 'active' && (
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-8 max-w-md mx-auto">
                    <span className="text-sm font-bold text-[#A6958E] uppercase tracking-wider bg-[#110C0A] px-4 py-2 rounded-xl border border-white/5">Round {round} / 5</span>
                    <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.2)]">Focus</span>
                </div>
                <div className="grid grid-cols-5 gap-3 max-w-md mx-auto p-6 bg-[#110C0A] rounded-3xl border border-white/5 shadow-inner">
                    {grid.map((type, i) => (
                        <div 
                           key={i}
                           onClick={() => handleCellClick(type, i)}
                           className={`aspect-square rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 border border-white/5 shadow-sm`}
                           style={getCellColor(type, round)}
                        >
                        </div>
                    ))}
                </div>
            </div>
        )}

        {gameState === 'done' && loading && (
                <div className="py-20 animate-pulse relative z-10">
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-emerald-400 font-bold uppercase tracking-widest">Analyzing Discrimination Latency...</p>
                </div>
        )}

        {gameState === 'done' && !loading && result && (
                <div className="py-10 animate-in slide-in-from-bottom-8 relative z-10">
                    <h3 className="text-3xl font-black text-[#FDFBF9] mb-10">Test Complete</h3>
                    
                    <div className="grid grid-cols-2 gap-6 max-w-md mx-auto mb-12">
                        <div className="bg-[#110C0A] p-6 rounded-3xl text-center border border-white/5 shadow-inner">
                            <p className="text-xs font-bold text-[#A6958E] uppercase tracking-widest mb-3">Accuracy</p>
                            <p className="text-5xl font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">{result.metrics.accuracy}%</p>
                        </div>
                        <div className="bg-[#110C0A] p-6 rounded-3xl text-center border border-white/5 shadow-inner">
                            <p className="text-xs font-bold text-[#A6958E] uppercase tracking-widest mb-3">Avg Search Time</p>
                            <p className="text-4xl font-black text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">{result.metrics.avg_search_time_ms} <span className="text-xl text-[#A6958E]">ms</span></p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleStart}
                        className="px-10 py-4 bg-[#150F0D] hover:bg-[#0A0706] text-[#FDFBF9] border border-white/10 rounded-2xl font-bold text-lg transition-all hover:border-emerald-500/50 shadow-lg"
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
