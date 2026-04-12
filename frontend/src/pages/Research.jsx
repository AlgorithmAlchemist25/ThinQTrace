import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Beaker, FileText, CheckCircle, TrendingUp, Target, Zap, MousePointer2, Keyboard, ShieldCheck, Info } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const CategoryCard = ({ title, score, icon: Icon, color, description }) => (
    <div className="bg-[#110C0A] p-6 rounded-3xl border border-white/5 shadow-inner flex flex-col items-center text-center group hover:border-white/10 transition-all duration-500">
        <div className={`p-4 rounded-2xl mb-4 bg-white/5 group-hover:bg-white/10 transition-colors`}>
            <Icon className={`w-8 h-8 ${color}`} />
        </div>
        <h4 className="text-xs font-bold text-[#A6958E] uppercase tracking-widest mb-2">{title}</h4>
        <div className="flex items-baseline space-x-1 mb-2">
            <span className={`text-4xl font-black ${color}`}>{score}</span>
            <span className="text-xs font-bold text-[#A6958E]">/100</span>
        </div>
        <p className="text-[11px] text-[#8C7B74] leading-tight px-2">{description}</p>
    </div>
);

export default function Research() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem('token');
      fetch(`http://localhost:8000/api/research-summary?token=${token}`)
        .then(res => res.json())
        .then(resData => {
           setData(resData.summary);
           setLoading(false);
        })
        .catch(err => {
           console.error(err);
           setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in zoom-in-95 duration-700 pb-20">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link to="/" className="inline-flex items-center text-[#A6958E] hover:text-indigo-400 font-semibold mb-2 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
            <h2 className="text-4xl sm:text-6xl font-black text-[#FDFBF9] tracking-tight leading-none">
               Neuro-Analytics <span className="text-indigo-400">Dossier</span>
            </h2>
            <p className="text-[#A6958E] text-lg mt-3 font-medium">Aggregated cognitive behavioral research based on live telemetry.</p>
          </div>
          <div className="flex space-x-3">
             <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-3xl backdrop-blur-md">
                <Beaker className="w-10 h-10 text-indigo-400" />
             </div>
          </div>
      </div>

      {!isLoggedIn ? (
          <div className="bg-[#1F1715]/80 p-20 rounded-[3rem] text-center border border-white/5 backdrop-blur-xl relative overflow-hidden">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
              <h3 className="text-3xl font-black text-[#FDFBF9] mb-4 relative z-10">Authentication Required</h3>
              <p className="text-[#A6958E] mb-10 text-lg max-w-md mx-auto relative z-10">Access your personalized AI research dossier by logging in to your ThinQTrace account.</p>
              <Link to="/login" className="px-10 py-5 bg-indigo-500 text-[#110C0A] font-black text-xl rounded-2xl hover:bg-indigo-400 transition-all shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] transform hover:-translate-y-1 relative z-10">Sign In Now</Link>
          </div>
      ) : loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-8 text-center">
              <div className="relative">
                  <div className="w-24 h-24 border-4 border-indigo-500/20 rounded-full animate-ping"></div>
                  <div className="absolute top-0 left-0 w-24 h-24 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div>
                <p className="text-2xl font-black text-[#FDFBF9] tracking-tight">Compiling Cognitive Telemetry...</p>
                <p className="text-[#A6958E] font-medium mt-2 uppercase tracking-widest text-xs">AI Research Engine is Processing Sessions</p>
              </div>
          </div>
      ) : data ? (
          <div className="space-y-10">
              {/* Radar & Summary Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                  <div className="lg:col-span-3 bg-[#1F1715]/90 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden flex flex-col">
                        <div className="absolute top-[-30%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                        <h3 className="text-2xl font-black text-[#FDFBF9] mb-8 flex items-center relative z-10 uppercase tracking-tight">
                            <FileText className="w-6 h-6 mr-3 text-indigo-400" /> Executive Research Summary
                        </h3>
                        <p className="text-[#D4C3BA] text-xl leading-relaxed relative z-10 font-medium italic">"{data.overall}"</p>
                        
                        <div className="mt-auto pt-10 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            <div className="bg-[#110C0A] p-6 rounded-2xl border border-white/5">
                                <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-4 flex items-center">
                                    <CheckCircle className="w-4 h-4 mr-2" /> Strengths
                                </h4>
                                <ul className="space-y-3">
                                    {data.strengths.map((str, idx) => (
                                        <li key={idx} className="text-sm font-medium text-[#A6958E] flex items-start">
                                            <span className="text-emerald-500 mr-2 mt-1 shrink-0">✔</span>
                                            {str}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-[#110C0A] p-6 rounded-2xl border border-white/5">
                                <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center">
                                    <TrendingUp className="w-4 h-4 mr-2" /> Optimizations
                                </h4>
                                <ul className="space-y-3">
                                    {data.improvements.map((imp, idx) => (
                                        <li key={idx} className="text-sm font-medium text-[#A6958E] flex items-start">
                                            <span className="text-amber-500 mr-2 mt-1 shrink-0">→</span>
                                            {imp}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                  </div>

                  <div className="lg:col-span-2 bg-[#110C0A] p-10 rounded-[3rem] border border-white/5 shadow-inner flex flex-col items-center justify-center relative min-h-[450px]">
                        <div className="absolute bottom-0 w-full h-1/2 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                        <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Multi-Dimensional Analysis</h3>
                        <div className="w-full h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.radar_data}>
                                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#A6958E', fontSize: 10, fontWeight: 'bold' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Cognitive Profile" dataKey="A" stroke="#818cf8" fill="#818cf8" fillOpacity={0.4} />
                                    <Tooltip contentStyle={{ backgroundColor: '#110C0A', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-center mt-6">
                            <span className="px-5 py-2 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 rounded-full shadow-lg">
                                Assessments Analyzed: {data.total_assessments}
                            </span>
                        </div>
                  </div>
              </div>

              {/* Category Detail Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 <CategoryCard 
                    title="Focus" 
                    score={data.category_scores.Focus} 
                    icon={Target} 
                    color="text-emerald-400" 
                    description="Visual discrimination efficiency and attention filtering accuracy."
                 />
                 <CategoryCard 
                    title="Agility" 
                    score={data.category_scores.Agility} 
                    icon={Zap} 
                    color="text-amber-400" 
                    description="Neural processing velocity and visual-click latency response."
                 />
                 <CategoryCard 
                    title="Control" 
                    score={data.category_scores.Control} 
                    icon={MousePointer2} 
                    color="text-indigo-400" 
                    description="Fine motor precision and path stability in tracing tasks."
                 />
                 <CategoryCard 
                    title="Cadence" 
                    score={data.category_scores.Cadence} 
                    icon={Keyboard} 
                    color="text-pink-400" 
                    description="Micro-behavioral rhythm and digital behavioral stability."
                 />
              </div>

              {/* Research Protocol Footer */}
              <div className="bg-[#1F1715]/40 border border-white/5 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 group">
                  <div className="flex items-center">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl mr-4 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-[#FDFBF9] uppercase tracking-wide">Protocol Confirmed</h4>
                        <p className="text-[11px] text-[#8C7B74] font-medium">All data is encrypted and processed via local neuro-behavioral models.</p>
                    </div>
                  </div>
                  <button className="flex items-center px-4 py-2 text-[10px] font-black text-[#A6958E] hover:text-[#FDFBF9] uppercase tracking-widest border border-white/10 rounded-xl hover:border-white/20 transition-all">
                      <info className="w-3 h-3 mr-2" /> Technical Methodology
                  </button>
              </div>
          </div>
      ) : (
          <div className="text-center py-20 bg-red-500/5 rounded-3xl border border-red-500/10">
              <Beaker className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-400">Dossier Compilation Failed</h3>
              <p className="text-[#A6958E] mt-2">Error connecting to the ThinQTrace analytics engine.</p>
          </div>
      )}
    </div>
  );
}

