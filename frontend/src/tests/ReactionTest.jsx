import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Zap, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReactionTest() {
  const [gameState, setGameState] = useState('waiting'); // waiting, ready, active, done
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [round, setRound] = useState(1);
  const [avgTime, setAvgTime] = useState(0);
  
  const startTime = useRef(0);
  const timeoutId = useRef(null);
  const events = useRef([]);
  const sessionId = useRef(crypto.randomUUID());

  const handleStartGame = () => {
    setRound(1);
    setResult(null);
    events.current = [];
    startRound(1);
  };

  const startRound = (currentRound) => {
    setGameState('ready');
    
    // Random delay between 1.5 to (2 + round) seconds
    const maxDelay = 2000 + (currentRound * 1000);
    const delay = Math.floor(Math.random() * maxDelay) + 1500;
    
    timeoutId.current = setTimeout(() => {
      setGameState('active');
      startTime.current = Date.now();
    }, delay);
  };

  const handleClick = async () => {
    if (gameState === 'waiting') {
      handleStartGame();
      return;
    }

    if (gameState === 'ready') {
      // Clicked too early (false start)
      clearTimeout(timeoutId.current);
      setGameState('waiting');
      alert("Too early! Wait for the screen to turn green.");
      return;
    }

    if (gameState === 'active') {
      const responseTime = Date.now() - startTime.current;
      
      events.current.push({
          key: "mouse_click",
          timestamp: responseTime, 
          eventType: "reaction_click"
      });

      if (round < 5) {
        setRound(r => r + 1);
        startRound(round + 1);
      } else {
        setGameState('done');
        const avg = Math.round(events.current.reduce((acc, curr) => acc + curr.timestamp, 0) / events.current.length);
        setAvgTime(avg);
        await submitData(avg);
      }
    }
  };

  const submitData = async (avgResponseTime) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/submit-data', {
        sessionId: sessionId.current,
        taskType: 'reaction-test',
        events: events.current,
        token: localStorage.getItem('token')
      });
      setResult({ ...response.data, responseTimeMs: avgResponseTime });
    } catch (error) {
      console.error("Error submitting data", error);
    }
    setLoading(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
      return () => clearTimeout(timeoutId.current);
  }, []);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500 pb-12">
      
      <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to="/" className="inline-flex items-center text-[#A6958E] hover:text-amber-400 font-semibold mb-2 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
            <h2 className="text-4xl font-black text-[#FDFBF9] tracking-tight">Reaction Test</h2>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl">
              <Zap className="w-10 h-10 text-amber-400" />
          </div>
      </div>

      <div className="bg-[#1F1715]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/5 overflow-hidden">
        
        {/* Interactive Area */}
        <div 
            onClick={handleClick}
            className={`h-[32rem] w-full flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 relative overflow-hidden ${
                gameState === 'waiting' || gameState === 'done' ? 'bg-[#110C0A] hover:bg-[#1A1311]' :
                gameState === 'ready' ? 'bg-red-500 text-white shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]' :
                gameState === 'active' ? 'bg-emerald-500 text-white shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]' : ''
            }`}
        >
            {gameState === 'waiting' && !result && (
                <div className="text-center p-8 max-w-xl relative z-10 animate-in fade-in slide-in-from-bottom-4">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-[60px] pointer-events-none"></div>
                    <div className="bg-amber-500/10 p-6 rounded-3xl inline-block mb-6 border border-amber-500/20 relative">
                        <Zap className="w-16 h-16 text-amber-400" />
                    </div>
                    <h3 className="text-3xl font-black text-[#FDFBF9] mb-4 tracking-tight">Click anywhere to start</h3>
                    <p className="text-[#A6958E] text-lg leading-relaxed">When the red background turns green, tap or click as fast as you can.</p>
                </div>
            )}

            {gameState === 'ready' && (
                <div className="text-center p-8 animate-pulse">
                    <span className="text-sm font-bold text-white/70 uppercase tracking-wider bg-black/20 px-4 py-2 rounded-xl mb-4 inline-block">Round {round} / 5</span>
                    <AlertCircle className="w-20 h-20 text-white/50 mx-auto mb-6" />
                    <h3 className="text-5xl font-black mb-2 tracking-tight">Wait for green...</h3>
                </div>
            )}

            {gameState === 'active' && (
                <div className="text-center p-8 scale-110 transition-transform">
                    <Zap className="w-28 h-28 text-white mx-auto mb-6 animate-bounce" />
                    <h3 className="text-6xl font-black uppercase tracking-widest">Click Now!</h3>
                </div>
            )}

            {gameState === 'done' && loading && (
                <div className="text-center p-8 animate-pulse text-[#FDFBF9]">
                    <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-amber-400 font-bold uppercase tracking-widest">Analyzing Response...</p>
                </div>
            )}

            {gameState === 'done' && !loading && result && (
                <div className="text-center p-8 animate-in slide-in-from-bottom-8 relative z-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                    <h3 className="text-2xl font-bold text-[#A6958E] mb-2 uppercase tracking-widest">Avg Response Time</h3>
                    <p className="text-7xl font-black text-amber-500 mb-10 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                        {result.responseTimeMs} <span className="text-3xl text-[#A6958E] font-bold">ms</span>
                    </p>
                    
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleStartGame(); }}
                        className="px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#110C0A] rounded-2xl font-black text-xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(245,158,11,0.3)]"
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
