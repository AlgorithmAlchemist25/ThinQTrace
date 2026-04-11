import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TaskInterface from './components/TaskInterface'; // We'll rename this to TypingTest later
import ReactionTest from './tests/ReactionTest';
import AttentionTest from './tests/AttentionTest';
import Auth from './pages/Signup'; // Now combined Auth component
import Tests from './pages/Tests';
import Research from './pages/Research';
import DrawingTest from './tests/DrawingTest';
import { BrainCircuit, LogOut, Moon, Sun } from 'lucide-react';

function App() {
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState('theme-dark');

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(storedTheme || (preferDark ? 'theme-dark' : 'theme-light'));
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('theme-dark', theme === 'theme-dark');
        document.documentElement.classList.toggle('theme-light', theme === 'theme-light');
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');
            if (token && username) {
                setUser({ username });
            } else {
                setUser(null);
            }
        };
        checkAuth();
        window.addEventListener('authChange', checkAuth);
        return () => window.removeEventListener('authChange', checkAuth);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.dispatchEvent(new Event('authChange'));
    };

    const handleThemeToggle = () => {
        setTheme(prev => prev === 'theme-dark' ? 'theme-light' : 'theme-dark');
    };

    return (
        <BrowserRouter>
            <div className="min-h-screen font-sans flex flex-col selection:bg-[var(--accent-primary)]/30 selection:text-[var(--text-primary)] relative" style={{ backgroundColor: 'var(--page-bg)', color: 'var(--text-primary)' }}>
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
                    <Link to="/dashboard" className="hover:text-amber-400 cursor-pointer transition-colors">Dashboard</Link>
                    <Link to="/tests" className="hover:text-amber-400 cursor-pointer transition-colors">Tests</Link>
                    <Link to="/research" className="hover:text-amber-400 cursor-pointer transition-colors">Research</Link>
                </div>
                <div className="flex items-center space-x-3">
                    <button onClick={handleThemeToggle} className="rounded-full border border-white/10 bg-white/5 p-2 text-[#A6958E] hover:text-[var(--text-primary)] transition-colors" title="Toggle theme">
                        {theme === 'theme-dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                     {user ? (
                         <>
                             <div className="w-10 h-10 rounded-full bg-[#1F1715] border border-white/10 shadow-sm overflow-hidden flex items-center justify-center" title={user.username}>
                                 <span className="text-[#D4C3BA] font-bold text-sm">{user.username.substring(0, 2).toUpperCase()}</span>
                             </div>
                             <button onClick={handleLogout} className="text-[#A6958E] hover:text-amber-400 transition-colors" title="Logout">
                                 <LogOut className="w-5 h-5" />
                             </button>
                         </>
                     ) : (
                         <>
                             <Link to="/login" className="text-sm font-semibold text-[#A6958E] hover:text-[#FDFBF9] transition-colors">Login</Link>
                             <Link to="/signup" className="text-sm font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-4 py-2 rounded-xl hover:bg-amber-500/20 transition-colors">Sign Up</Link>
                         </>
                     )}
                </div>
            </div>
        </nav>

                {/* Main Content Area */}
                <main className="flex-grow w-full py-8">
                    <Routes>
                        <Route path="/" element={<Auth />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/tests" element={<Tests />} />
                        <Route path="/test/typing" element={<TaskInterface />} />
                        <Route path="/test/reaction" element={<ReactionTest />} />
                        <Route path="/test/attention" element={<AttentionTest />} />
                        <Route path="/test/drawing" element={<DrawingTest />} />
                        <Route path="/research" element={<Research />} />
                        <Route path="/login" element={<Auth />} />
                        <Route path="/signup" element={<Auth />} />
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
