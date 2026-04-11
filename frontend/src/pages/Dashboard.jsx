import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, LineChart as LineChartIcon, Zap, Activity, Flame, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CircularProgress = ({ value, strokeColor, label }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 flex items-center justify-center mb-3">
                <svg className="absolute w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r={radius} stroke="currentColor" className="text-white/5" strokeWidth="8" fill="transparent" />
                    <circle 
                        cx="48" cy="48" r={radius} 
                        stroke={strokeColor}
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray={circumference} 
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out drop-shadow-md"
                    />
                </svg>
                <div className="absolute flex items-center justify-center">
                    <span className="text-xl font-black text-[#FDFBF9] drop-shadow-sm">{value}%</span>
                </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#A6958E]">{label}</span>
        </div>
    );
};

export default function Dashboard() {
  const [scores, setScores] = useState([]);
  const [prediction, setPrediction] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [streak, setStreak] = useState(0);
  const [productivity, setProductivity] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('username');
    if (token) {
      setIsLoggedIn(true);
      if (user) setUsername(user);
      
      fetch(`http://localhost:8000/api/user/scores?token=${token}`)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') setScores(data.scores);
        }).catch(err => console.error(err));
        
      fetch(`http://localhost:8000/api/predict-mental-health?token=${token}`)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') setPrediction(data.predictions || []);
        }).catch(err => console.error(err));
    }
  }, []);

  useEffect(() => {
    if (scores.length > 0) {
      // Calculate streak
      const dates = [...new Set(scores.map(s => new Date(s.timestamp).toDateString()))].sort((a, b) => new Date(a) - new Date(b));
      const today = new Date();
      let currentStreak = 0;
      if (dates.length > 0) {
        let lastDate = new Date(dates[dates.length - 1]);
        const diffFromToday = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
        if (diffFromToday <= 1) { // last activity today or yesterday
          currentStreak = 1;
          for (let i = dates.length - 2; i >= 0; i--) {
            const prevDate = new Date(dates[i]);
            const diff = Math.floor((lastDate - prevDate) / (1000 * 60 * 60 * 24));
            if (diff === 1) {
              currentStreak++;
              lastDate = prevDate;
            } else {
              break;
            }
          }
        }
      }
      setStreak(currentStreak);

      // Calculate productivity
      const scoreMap = { 'High': 90, 'Medium': 60, 'Low': 30 };
      const total = scores.reduce((sum, s) => sum + scoreMap[s.score], 0);
      const avg = total / scores.length;
      setProductivity(Math.round(avg));
    } else {
      setStreak(0);
      setProductivity(0);
    }
  }, [scores]);

  // Mock Trend Data for the chart derived from scores (if empty, show generic data)
  const chartData = isLoggedIn && scores.length > 0 ? [...scores].reverse().slice(0, 7).map((s, i) => ({
      name: `T-${scores.length - i}`,
      focus: s.score === 'Low' ? 90 : s.score === 'Medium' ? 60 : 30
  })) : [];

  // Mock computed metrics based on recent score
  const focusScore = isLoggedIn && scores.length > 0 ? (scores[0].score === 'Low' ? 88 : scores[0].score === 'Medium' ? 62 : 35) : 0;
  const fatigueScore = isLoggedIn && scores.length > 0 ? (scores[0].score === 'Low' ? 20 : scores[0].score === 'Medium' ? 45 : 85) : 0;
  const stressScore = isLoggedIn && scores.length > 0 ? (scores[0].score === 'Low' ? 25 : scores[0].score === 'Medium' ? 50 : 80) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12 relative z-10 px-4 sm:px-6 lg:px-8">
      
      {/* Gamification Hero */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 space-y-6 md:space-y-0 pt-6">
          <div>
              <h1 className="text-4xl sm:text-5xl font-black text-[#FDFBF9] mb-3 tracking-tight">
                  Welcome back, <span className="text-amber-400">{username || "Explorer"}</span>
              </h1>
              <p className="text-[#A6958E] text-lg font-medium">Here is your cognitive health telemetry for today.</p>
          </div>
          <div className="flex space-x-4">
              <div className="bg-[#110C0A] px-5 py-3 rounded-2xl border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)] flex items-center space-x-3">
                  <Flame className="w-6 h-6 text-amber-500" />
                  <div>
                      <p className="text-[10px] text-[#A6958E] font-bold uppercase tracking-widest">Focus Streak</p>
                      <p className="text-[#FDFBF9] font-black leading-none text-lg mt-0.5">{streak} Days</p>
                  </div>
              </div>
              <div className="bg-[#110C0A] px-5 py-3 rounded-2xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] flex items-center space-x-3">
                  <TrendingUp className="w-6 h-6 text-emerald-500" />
                  <div>
                      <p className="text-[10px] text-[#A6958E] font-bold uppercase tracking-widest">Productivity</p>
                      <p className="text-[#FDFBF9] font-black leading-none text-lg mt-0.5">{productivity}/100</p>
                  </div>
              </div>
          </div>
      </div>

      {!isLoggedIn && (
          <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div>
                  <h3 className="text-xl font-bold text-[#FDFBF9] mb-1">Unlock Personalized Insights</h3>
                  <p className="text-[#A6958E]">Log in to aggregate your cognitive scores and receive real-time AI predictions.</p>
              </div>
              <Link to="/login" className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-[#110C0A] font-bold rounded-xl transition-colors whitespace-nowrap">Log In</Link>
          </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (2 spans) */}
          <div className="lg:col-span-2 space-y-8">
              
              {/* Performance Summary */}
              <div className="bg-[#1F1715]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                  <div className="flex items-center justify-between mb-8 relative z-10">
                      <h3 className="text-2xl font-black text-[#FDFBF9] flex items-center">
                          <Brain className="w-6 h-6 mr-3 text-emerald-400" /> Performance Summary
                      </h3>
                      <button className="text-sm font-bold text-[#A6958E] hover:text-[#FDFBF9] transition-colors">Details &rarr;</button>
                  </div>
                  <div className="flex flex-wrap justify-around items-center py-6 bg-[#110C0A] rounded-2xl border border-white/5 shadow-inner relative z-10 gap-4">
                      <CircularProgress value={focusScore} strokeColor="#34d399" label="Focus" />
                      <div className="hidden sm:block w-px h-16 bg-white/5"></div>
                      <CircularProgress value={fatigueScore} strokeColor="#f87171" label="Fatigue" />
                      <div className="hidden sm:block w-px h-16 bg-white/5"></div>
                      <CircularProgress value={stressScore} strokeColor="#fbbf24" label="Stress" />
                  </div>
              </div>

              {/* Trend Graph */}
              <div className="bg-[#1F1715]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                  <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                  <h3 className="text-2xl font-black text-[#FDFBF9] mb-8 flex items-center relative z-10">
                      <LineChartIcon className="w-6 h-6 mr-3 text-indigo-400" /> Cognitive Trend (Weekly)
                  </h3>
                  <div className="h-64 w-full relative z-10 flex items-center justify-center min-h-[240px]">
                      {!isLoggedIn ? (
                          <p className="text-[#A6958E] font-medium text-lg">Log in to view your cognitive trend.</p>
                      ) : chartData.length === 0 ? (
                          <p className="text-[#A6958E] font-medium text-lg">Complete assessments to build your trend data.</p>
                      ) : (
                          <ResponsiveContainer width="100%" height="100%" minHeight={240} minWidth={300}>
                              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                                  <XAxis dataKey="name" stroke="#A6958E" fontSize={12} tickLine={false} axisLine={false} />
                                  <YAxis stroke="#A6958E" fontSize={12} tickLine={false} axisLine={false} />
                                  <Tooltip contentStyle={{ backgroundColor: '#110C0A', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem', color: '#FDFBF9' }} itemStyle={{ color: '#fbbf24', fontWeight: 'bold' }} />
                                  <Line type="monotone" dataKey="focus" stroke="#fbbf24" strokeWidth={4} dot={{ r: 4, fill: '#fbbf24', strokeWidth: 2, stroke: '#110C0A' }} activeDot={{ r: 6, fill: '#f59e0b', stroke: '#110C0A', strokeWidth: 2 }} animationDuration={1500} />
                              </LineChart>
                          </ResponsiveContainer>
                      )}
                  </div>
              </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-8">
              
              {/* AI Prediction */}
              <div className="bg-gradient-to-br from-[#2D211E] to-[#1F1715] p-8 rounded-3xl border border-amber-500/20 shadow-2xl relative overflow-hidden group hover:border-amber-500/40 transition-colors">
                  <div className="absolute top-[-30%] right-[-30%] w-48 h-48 bg-amber-500/10 rounded-full blur-[40px] group-hover:bg-amber-500/20 transition-colors"></div>
                  <h3 className="text-2xl font-black text-[#FDFBF9] mb-6 flex items-center relative z-10">
                      <Sparkles className="w-6 h-6 mr-3 text-amber-400" /> AI Insights
                  </h3>
                  <div className="space-y-4 relative z-10">
                      {!isLoggedIn ? (
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                              <p className="text-[#A6958E] font-bold">Log in to unlock AI Insights.</p>
                          </div>
                      ) : prediction && prediction.length > 0 ? (
                          prediction.map((insight, idx) => (
                              <div key={idx} className="flex items-start bg-[#110C0A]/60 p-4 rounded-xl border border-white/5 transition-colors hover:bg-[#110C0A]">
                                  {idx === 0 ? <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 mr-3 shrink-0" /> : idx === 1 ? <Zap className="w-5 h-5 text-emerald-500 mt-0.5 mr-3 shrink-0" /> : <Activity className="w-5 h-5 text-indigo-400 mt-0.5 mr-3 shrink-0" />}
                                  <p className="text-sm font-medium text-[#D4C3BA] leading-relaxed">{insight}</p>
                              </div>
                          ))
                      ) : (
                          <div className="flex flex-col items-center justify-center py-8 text-center text-[#A6958E]">
                              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                              <p className="font-bold">Generating insights...</p>
                          </div>
                      )}
                  </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-[#1F1715]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative">
                  <h3 className="text-xl font-black text-[#FDFBF9] mb-5">Quick Actions</h3>
                  <div className="space-y-3">
                      <Link to="/test/reaction" className="w-full flex items-center justify-between p-4 bg-[#110C0A] hover:bg-[#1A1311] rounded-xl border border-white/5 transition-colors group">
                          <span className="font-bold text-[#A6958E] group-hover:text-amber-400 transition-colors">Reaction Latency</span>
                          <span className="text-amber-500 transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </Link>
                      <Link to="/test/attention" className="w-full flex items-center justify-between p-4 bg-[#110C0A] hover:bg-[#1A1311] rounded-xl border border-white/5 transition-colors group">
                          <span className="font-bold text-[#A6958E] group-hover:text-emerald-400 transition-colors">Visual Attention</span>
                          <span className="text-emerald-500 transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </Link>
                      <Link to="/tests" className="w-full flex items-center justify-center p-4 mt-2 rounded-xl border border-white/10 hover:border-amber-500/30 text-sm font-bold uppercase tracking-widest text-[#D4C3BA] hover:text-amber-400 transition-colors">
                          View All Tests
                      </Link>
                  </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-[#1F1715]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-black text-[#FDFBF9]">Recent Activity</h3>
                  </div>
                  <div className="space-y-4">
                      {scores.length > 0 ? scores.slice(0,4).map((score, idx) => (
                          <div key={idx} className="flex justify-between items-center pb-4 border-b border-white/5 last:border-0 last:pb-0">
                              <div>
                                  <p className="font-bold text-[#D4C3BA]">{score.task_type.replace('-test', '').toUpperCase()}</p>
                                  <p className="text-[11px] text-[#A6958E] mt-1 font-bold tracking-wider">{new Date(score.timestamp).toLocaleDateString()}</p>
                              </div>
                              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${score.score === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : score.score === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'}`}>
                                  {score.score} Load
                              </span>
                          </div>
                      )) : (
                          <div className="text-center py-6 bg-[#110C0A] rounded-2xl border border-white/5">
                              <p className="text-[#A6958E] text-sm font-medium">No activity recorded yet.</p>
                          </div>
                      )}
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
}
