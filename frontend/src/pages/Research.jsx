import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Beaker, FileText, CheckCircle, TrendingUp } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-10">
          <Link to="/" className="inline-flex items-center text-[#A6958E] hover:text-indigo-400 font-semibold mb-2 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
          <h2 className="text-4xl sm:text-5xl font-black text-[#FDFBF9] tracking-tight flex items-center">
             <Beaker className="w-10 h-10 mr-4 text-indigo-400" /> Research & Analytics
          </h2>
      </div>

      {!isLoggedIn ? (
          <div className="bg-[#1F1715]/80 p-10 rounded-3xl text-center border border-white/5">
              <h3 className="text-2xl font-bold text-[#FDFBF9] mb-2">Authentication Required</h3>
              <p className="text-[#A6958E] mb-6">Log in to view your comprehensive AI research dossier.</p>
              <Link to="/login" className="px-8 py-3 bg-indigo-500 text-[#FDFBF9] font-bold rounded-xl hover:bg-indigo-400 transition-colors">Log In</Link>
          </div>
      ) : loading ? (
          <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#A6958E] font-bold">Compiling Cognitive Dossier...</p>
          </div>
      ) : data ? (
          <div className="space-y-8">
              <div className="bg-[#1F1715]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                   <h3 className="text-2xl font-black text-[#FDFBF9] mb-4 flex items-center relative z-10">
                       <FileText className="w-6 h-6 mr-3 text-indigo-400" /> Executive Summary
                   </h3>
                   <p className="text-[#D4C3BA] text-lg leading-relaxed relative z-10">{data.overall}</p>
                   <div className="mt-4 inline-block bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-xl text-sm font-bold border border-indigo-500/20">
                       Assessments Analyzed: {data.total_assessments}
                   </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-[#110C0A] p-8 rounded-3xl border border-white/5 shadow-inner">
                      <h4 className="text-xl font-black text-[#FDFBF9] mb-6 flex items-center">
                          <CheckCircle className="w-5 h-5 mr-3 text-emerald-500" /> Cognitive Strengths
                      </h4>
                      <ul className="space-y-4">
                          {data.strengths.length > 0 ? data.strengths.map((str, idx) => (
                              <li key={idx} className="flex items-start">
                                  <span className="text-emerald-500 mr-3 mt-1">•</span>
                                  <span className="text-[#A6958E] leading-relaxed">{str}</span>
                              </li>
                          )) : (
                              <p className="text-[#A6958E] italic">More data needed to assess strengths.</p>
                          )}
                      </ul>
                  </div>

                  <div className="bg-[#110C0A] p-8 rounded-3xl border border-white/5 shadow-inner">
                      <h4 className="text-xl font-black text-[#FDFBF9] mb-6 flex items-center">
                          <TrendingUp className="w-5 h-5 mr-3 text-amber-500" /> Optimization Targets
                      </h4>
                      <ul className="space-y-4">
                          {data.improvements.length > 0 ? data.improvements.map((imp, idx) => (
                              <li key={idx} className="flex items-start">
                                  <span className="text-amber-500 mr-3 mt-1">→</span>
                                  <span className="text-[#A6958E] leading-relaxed">{imp}</span>
                              </li>
                          )) : (
                              <p className="text-[#A6958E] italic">No immediate optimizations currently recommended.</p>
                          )}
                      </ul>
                  </div>
              </div>
          </div>
      ) : (
          <div className="text-center py-20 text-red-400 font-bold">Failed to load dossier.</div>
      )}
    </div>
  );
}
