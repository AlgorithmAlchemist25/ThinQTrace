import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Zap, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReactionTest() {
  const [gameState, setGameState] = useState('waiting'); // waiting, ready, active, done
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const startTime = useRef(0);
  const timeoutId = useRef(null);
  const events = useRef([]);
  const sessionId = useRef(crypto.randomUUID());

  const handleStart = () => {
    setGameState('ready');
    setResult(null);
    events.current = [];
    
    // Random delay between 2 to 5 seconds
    const delay = Math.floor(Math.random() * 3000) + 2000;
    
    timeoutId.current = setTimeout(() => {
      setGameState('active');
      startTime.current = Date.now();
    }, delay);
  };

  const handleClick = async () => {
    if (gameState === 'ready') {
      // Clicked too early (false start)
      clearTimeout(timeoutId.current);
      setGameState('waiting');
      alert("Too early! Wait for the screen to turn green.");
      return;
    }

    if (gameState === 'active') {
      const responseTime = Date.now() - startTime.current;
      
      // Record the single event
      events.current.push({
          key: "mouse_click",
          timestamp: responseTime, 
          eventType: "reaction_click"
      });

      setGameState('done');
      await submitData(responseTime);
    }
  };

  const submitData = async (responseTimeMs) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/submit-data', {
        sessionId: sessionId.current,
        taskType: 'reaction-test',
        events: events.current
      });
      // The backend will just return raw metrics for now, we will override it here for display
      setResult({ ...response.data, responseTimeMs });
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
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      
      <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 font-semibold mb-2 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Reaction Test</h2>
          </div>
          <div className="bg-amber-100 p-4 rounded-2xl">
              <Zap className="w-10 h-10 text-amber-600" />
          </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Interactive Area */}
        <div 
            onClick={handleClick}
            className={`h-96 w-full flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${
                gameState === 'waiting' || gameState === 'done' ? 'bg-slate-50 hover:bg-slate-100' :
                gameState === 'ready' ? 'bg-red-500 text-white' :
                gameState === 'active' ? 'bg-emerald-500 text-white' : ''
            }`}
        >
            {gameState === 'waiting' && !result && (
                <div className="text-center p-8">
                    <Zap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/60">
        <div className="bg-[#423633] p-10 text-[#F5E6DE] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-l from-amber-500/20 to-transparent mix-blend-screen opacity-50 blur-[60px] transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl shadow-inner border border-white/20 mb-6">
                <Zap className="w-10 h-10 text-amber-400" />
            </div>
            <div>
                <h2 className="text-4xl font-extrabold tracking-tight mb-2">ThinQTrace Assessment</h2>
                <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 px-4 py-1.5 rounded-full font-semibold text-xs uppercase tracking-widest border border-amber-500/30">
                    Reaction Time Diagnostics
                </div>
            </div>
          </div>
        </div>

        <div className="p-10">
            <h3 className="text-2xl font-bold text-slate-700 mb-2">Click anywhere to start</h3>
            <p className="text-slate-500">When the red box turns green, click as fast as you can.</p>
        </div>
    </div>
                </div>
            )}

            {gameState === 'ready' && (
                <div className="text-center p-8 animate-pulse">
                    <AlertCircle className="w-16 h-16 text-white/50 mx-auto mb-4" />
                    <h3 className="text-4xl font-extrabold mb-2">Wait for green...</h3>
                </div>
            )}

            {gameState === 'active' && (
                <div className="text-center p-8 scale-110 transition-transform">
                    <Zap className="w-20 h-20 text-white mx-auto mb-4 animate-bounce" />
                    <h3 className="text-5xl font-black uppercase tracking-widest">Click Now!</h3>
                </div>
            )}

            {gameState === 'done' && loading && (
                <div className="text-center p-8 animate-pulse">
                    <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest">Analyzing Response...</p>
                </div>
            )}

            {gameState === 'done' && !loading && result && (
                <div className="text-center p-8 animate-in slide-in-from-bottom-4">
                    <h3 className="text-2xl font-bold text-slate-700 mb-2">Response Time</h3>
                    <p className="text-6xl font-black text-amber-500 mb-8">{result.responseTimeMs} <span className="text-2xl text-slate-400">ms</span></p>
                    
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleStart(); }}
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
