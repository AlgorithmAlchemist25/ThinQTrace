import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { PenTool, ArrowLeft, MousePointerClick, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DrawingTest() {
  const [gameState, setGameState] = useState('waiting'); // waiting, active, done
  const [round, setRound] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const deviations = useRef([]);
  const allDeviations = useRef([]); // across all rounds
  const sessionId = useRef(crypto.randomUUID());
  
  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 400;
  const START_X = 50;
  const END_X = 550;

  useEffect(() => {
    if (gameState === 'active') {
      drawCanvas();
    }
  }, [gameState, round]);

  const getLevelParams = (level) => {
    return {
        amplitude: 30 + (level * 25),      // 55, 80, 105, 130, 155
        frequency: 0.01 + (level * 0.005), // 0.015, 0.020, ...
        width: 60 - (level * 6),           // 54, 48, 42, 36, 30
    };
  };

  const getPathPoints = (level) => {
    const params = getLevelParams(level);
    const points = [];
    for (let x = START_X; x <= END_X; x += 2) {
        const y = (CANVAS_HEIGHT / 2) + Math.sin(x * params.frequency) * params.amplitude;
        points.push({ x, y });
    }
    return points;
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const points = getPathPoints(round);
    const params = getLevelParams(round);

    // Draw the main thick path
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = "rgba(16, 185, 129, 0.15)"; // Soft emerald background
    ctx.lineWidth = params.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    // Draw the center dashed line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]); // reset

    // Draw Start and End Zones
    const startPoint = points[0];
    const endPoint = points[points.length - 1];

    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, params.width / 2, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(245, 158, 11, 0.8)"; // Amber start
    ctx.fill();

    ctx.beginPath();
    ctx.arc(endPoint.x, endPoint.y, params.width / 2, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(16, 185, 129, 0.8)"; // Emerald end
    ctx.fill();
    
    // Draw labels
    ctx.fillStyle = "white";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("START", startPoint.x, startPoint.y - params.width / 2 - 15);
    ctx.fillText("END", endPoint.x, endPoint.y - params.width / 2 - 15);
  };

  const handleStart = () => {
    setGameState('active');
    setResult(null);
    setRound(1);
    allDeviations.current = [];
    deviations.current = [];
  };

  const getDistanceToPath = (x, y) => {
    const points = getPathPoints(round);
    let minDistance = Infinity;
    for (const pt of points) {
        const d = Math.sqrt(Math.pow(pt.x - x, 2) + Math.pow(pt.y - y, 2));
        if (d < minDistance) minDistance = d;
    }
    return minDistance;
  };

  const handleMouseDown = (e) => {
    if (gameState !== 'active') return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const points = getPathPoints(round);
    const startX = points[0].x;
    const startY = points[0].y;
    const params = getLevelParams(round);

    // Check if clicked in start zone
    const distToStart = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
    if (distToStart <= params.width / 2 + 10) {
        isDrawing.current = true;
        deviations.current = [];
    } else {
        alert("Please start tracing from the amber START zone.");
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current || gameState !== 'active') return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const d = getDistanceToPath(x, y);
    deviations.current.push(d);

    // Draw user path
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fill();

    // Check End zone
    const points = getPathPoints(round);
    const endX = points[points.length - 1].x;
    const endY = points[points.length - 1].y;
    const params = getLevelParams(round);

    const distToEnd = Math.sqrt(Math.pow(x - endX, 2) + Math.pow(y - endY, 2));
    if (distToEnd <= params.width / 2) {
        isDrawing.current = false;
        finishRound();
    }
  };

  const handleMouseUp = () => {
    if (isDrawing.current) {
        isDrawing.current = false;
        alert("You lifted your mouse! Restarting round.");
        drawCanvas(); // reset canvas user path
        deviations.current = [];
    }
  };
  
  const handleMouseLeave = () => {
      if (isDrawing.current) {
          isDrawing.current = false;
          alert("Mouse left the canvas! Restarting round.");
          drawCanvas();
          deviations.current = [];
      }
  };

  const finishRound = () => {
    const avgDeviation = deviations.current.reduce((a,b)=>a+b, 0) / (deviations.current.length || 1);
    allDeviations.current.push(avgDeviation);

    if (round < 5) {
        setRound(r => r + 1);
    } else {
        setGameState('done');
        submitData();
    }
  };

  const submitData = async () => {
    setLoading(true);
    const finalAvg = allDeviations.current.reduce((a,b)=>a+b, 0) / allDeviations.current.length;
    try {
      const response = await axios.post('http://localhost:8000/api/submit-data', {
        sessionId: sessionId.current,
        taskType: 'drawing-test',
        events: [{
            key: "pseudo_event",
            timestamp: finalAvg, // map deviation to timestamp field as expected by backend
            eventType: "tracing"
        }],
        token: localStorage.getItem('token')
      });
      setResult({ ...response.data, finalDeviationPx: finalAvg });
    } catch (error) {
      console.error("Error submitting data", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500 pb-12">
      <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to="/" className="inline-flex items-center text-[#A6958E] hover:text-indigo-400 font-semibold mb-2 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
            <h2 className="text-4xl font-black text-[#FDFBF9] tracking-tight">Motor Tracing Test</h2>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl">
              <PenTool className="w-10 h-10 text-indigo-400" />
          </div>
      </div>

      <div className="bg-[#1F1715]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/5 overflow-hidden">
        <div className="p-10 text-center text-[#FDFBF9] relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>

            {gameState === 'waiting' && (
                <div className="py-12 max-w-xl mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-white/5 p-6 rounded-full inline-block mb-6 border border-white/10">
                        <MousePointerClick className="w-16 h-16 text-indigo-500 mx-auto" />
                    </div>
                    <h3 className="text-3xl font-black text-[#FDFBF9] mb-4">Motor Tracing Assessment</h3>
                    <p className="text-[#A6958E] mb-10 text-lg leading-relaxed">
                        Assess fine motor control and visual-motor coordination. Click and hold the <span className="text-amber-500 font-bold">START</span> point, then drag your cursor along the center of the path until you reach the <span className="text-emerald-500 font-bold">END</span> point without lifting your mouse. Keep as close to the center white line as possible.
                    </p>
                    <button 
                    onClick={handleStart}
                    className="w-full py-5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-[#110C0A] rounded-2xl font-black text-xl transition-all shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] transform hover:-translate-y-1"
                    >
                        Start Tracing Test
                    </button>
                </div>
            )}

            {gameState === 'active' && (
                <div className="relative z-10 flex flex-col items-center">
                    <div className="flex justify-between items-center mb-6 w-full max-w-[600px] px-2">
                        <span className="text-sm font-bold text-[#A6958E] uppercase tracking-wider bg-[#110C0A] px-4 py-2 rounded-xl border border-white/5">Round {round} / 5</span>
                        <span className="text-sm font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl animate-pulse">Fine Motor Tracking</span>
                    </div>
                    
                    <div className="p-4 bg-[#110C0A] rounded-3xl border border-white/5 shadow-inner inline-block relative cursor-crosshair">
                        <canvas 
                           ref={canvasRef}
                           width={CANVAS_WIDTH} 
                           height={CANVAS_HEIGHT}
                           onMouseDown={handleMouseDown}
                           onMouseMove={handleMouseMove}
                           onMouseUp={handleMouseUp}
                           onMouseLeave={handleMouseLeave}
                           className="rounded-2xl"
                        />
                    </div>
                </div>
            )}

            {gameState === 'done' && loading && (
                <div className="py-20 animate-pulse relative z-10">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-indigo-400 font-bold uppercase tracking-widest">Analyzing Deviation Metrics...</p>
                </div>
            )}

            {gameState === 'done' && !loading && result && (
                <div className="py-10 animate-in slide-in-from-bottom-8 relative z-10">
                    <h3 className="text-3xl font-black text-[#FDFBF9] mb-10">Test Complete</h3>
                    
                    <div className="bg-[#110C0A] p-8 rounded-3xl text-center border border-white/5 shadow-inner max-w-sm mx-auto mb-10">
                        <p className="text-xs font-bold text-[#A6958E] uppercase tracking-widest mb-3">Average Trace Deviation</p>
                        <p className="text-5xl font-black text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                            {result.finalDeviationPx.toFixed(1)} <span className="text-2xl font-bold text-[#A6958E]">px</span>
                        </p>
                        <p className="text-sm text-[#A6958E] mt-4">Lower deviation implies smoother fine motor control.</p>
                    </div>
                    
                    <button 
                        onClick={handleStart}
                        className="px-10 py-5 bg-[#150F0D] hover:bg-[#0A0706] text-[#FDFBF9] border border-white/10 rounded-2xl font-bold text-lg transition-all hover:border-indigo-500/50 shadow-lg"
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
