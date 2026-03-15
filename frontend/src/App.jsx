import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TaskInterface from './components/TaskInterface'; // We'll rename this to TypingTest later
import ReactionTest from './tests/ReactionTest';
import AttentionTest from './tests/AttentionTest';
import { BrainCircuit } from 'lucide-react';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-[#110C0A] font-sans flex flex-col selection:bg-amber-500/30 selection:text-amber-200 relative text-[#FDFBF9]">
               {/* Soft abstract overall background */}
               <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                  <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[120px]"></div>
                  <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#4A3228]/20 rounded-full blur-[150px]"></div>
                  <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-amber-400/5 rounded-full blur-[100px]"></div>
               </div>
               
               <div className="relative z-10 flex flex-col min-h-screen">

        {/* Navigation Bar */}
        <nav className="bg-transparent sticky top-0 z-50 pt-6 pb-4 border-b border-white/5 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-3 group">
                    <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                        <BrainCircuit className="w-6 h-6 text-amber-400" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-[#FDFBF9]">
                        Thin<span className="text-amber-400">Q</span>Trace
                    </h1>
                </Link>
                <div className="hidden md:flex space-x-10 text-sm font-semibold text-[#A6958E]">
                    <Link to="/" className="text-amber-400 border-b-2 border-amber-500 pb-1">Dashboard</Link>
                    <span className="hover:text-amber-400 cursor-pointer transition-colors">Tests</span>
                    <span className="hover:text-amber-400 cursor-pointer transition-colors">Insights</span>
                    <span className="hover:text-amber-400 cursor-pointer transition-colors">Research</span>
                </div>
                <div className="flex items-center space-x-4">
                     <button className="text-[#A6958E] hover:text-amber-400 transition-colors">
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                     </button>
                     <div className="w-10 h-10 rounded-full bg-[#1F1715] border border-white/10 shadow-sm overflow-hidden flex items-center justify-center">
                         <span className="text-[#D4C3BA] font-bold text-sm">US</span>
                     </div>
                </div>
            </div>
        </nav>

                {/* Main Content Area */}
                <main className="flex-grow w-full py-8">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/test/typing" element={<TaskInterface />} />
                        <Route path="/test/reaction" element={<ReactionTest />} />
                        <Route path="/test/attention" element={<AttentionTest />} />
                    </Routes>
                </main>

                {/* Footer */}
                <footer className="bg-transparent py-8 text-center text-[#A6958E] text-sm mt-auto border-t border-white/5">
                    <p>ThinQTrace Prototype &copy; 2026. A non-invasive behavioral cognitive detection system.</p>
                </footer>
               </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
