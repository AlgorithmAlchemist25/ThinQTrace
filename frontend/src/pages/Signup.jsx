import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

const Auth = () => {
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const routeIsLogin = location.pathname === '/login';
    setShowLogin(routeIsLogin);
    setError('');
    setInfo('');
  }, [location.pathname]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    try {
      const response = await fetch('http://localhost:8000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: signupUsername, password: signupPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Signup failed');
      }
      setShowLogin(true);
      setInfo('Signup successful! Please log in.');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      // Dispatch custom event to update Navbar state simply
      window.dispatchEvent(new Event('authChange'));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-[#100803] px-4 pt-8 pb-10">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#1c110a]/95 p-4 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-5">
          <div className="flex items-center justify-center w-14 h-14 rounded-3xl bg-amber-500/10 border border-amber-500/20 mb-4">
            <BrainCircuit className="w-7 h-7 text-amber-400" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-[#FDFBF9] mb-2">{showLogin ? 'Welcome Back' : 'Create your account'}</h2>
          <p className="text-sm text-[#A6958E] max-w-xs">
            {showLogin
              ? 'Log in to continue tracking your cognitive performance.'
              : 'Sign up now to start your personalized cognitive assessment journey.'}
          </p>
        </div>

        <div className="rounded-[24px] bg-[#221912]/95 border border-white/10 overflow-hidden">
          <div className={`flex w-[200%] transition-transform duration-500 ease-out ${showLogin ? '-translate-x-1/2' : 'translate-x-0'}`}>
            <div className="w-1/2 p-3">
              {error && <div className="text-red-400 bg-red-400/10 p-3 rounded-lg text-sm text-center border border-red-400/20 mb-4">{error}</div>}
              {info && <div className="text-amber-300 bg-amber-500/10 p-3 rounded-lg text-sm text-center border border-amber-500/20 mb-4">{info}</div>}

              <form onSubmit={handleSignup} className="flex flex-col space-y-4">
                <div>
                  <label className="text-sm font-semibold text-[#D8C5A9] block mb-2">Username</label>
                  <input
                    type="text"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    className="w-full bg-[#2b211b] border border-[#6e5a45] rounded-xl px-4 py-3 text-[#FDFBF9] placeholder:text-[#a8937f] focus:outline-none focus:border-amber-500/60 focus:bg-[#2f2722] transition-all"
                    placeholder="Choose a username"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#D8C5A9] block mb-2">Password</label>
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full bg-[#2b211b] border border-[#6e5a45] rounded-xl px-4 py-3 text-[#FDFBF9] placeholder:text-[#a8937f] focus:outline-none focus:border-amber-500/60 focus:bg-[#2f2722] transition-all"
                    placeholder="Create a strong password"
                    required
                  />
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-[#110C0A] font-bold py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:from-amber-400 hover:to-amber-500">
                  Sign Up
                </button>

                <p className="text-[#A6958E] text-center mt-4">
                  Already have an account? <button type="button" onClick={() => setShowLogin(true)} className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">Log in</button>
                </p>
              </form>
            </div>

            <div className="w-1/2 border-l border-white/10 p-3">
              {error && <div className="text-red-400 bg-red-400/10 p-3 rounded-lg text-sm text-center border border-red-400/20 mb-4">{error}</div>}
              {info && <div className="text-amber-300 bg-amber-500/10 p-3 rounded-lg text-sm text-center border border-amber-500/20 mb-4">{info}</div>}

              <form onSubmit={handleLogin} className="flex flex-col space-y-4">
                <div>
                  <label className="text-sm font-semibold text-[#D8C5A9] block mb-2">Username</label>
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full bg-[#2b211b] border border-[#6e5a45] rounded-xl px-4 py-3 text-[#FDFBF9] placeholder:text-[#a8937f] focus:outline-none focus:border-amber-500/60 focus:bg-[#2f2722] transition-all"
                    placeholder="Enter your username"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#D8C5A9] block mb-2">Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#2b211b] border border-[#6e5a45] rounded-xl px-4 py-3 text-[#FDFBF9] placeholder:text-[#a8937f] focus:outline-none focus:border-amber-500/60 focus:bg-[#2f2722] transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-[#110C0A] font-bold py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:from-amber-400 hover:to-amber-500">
                  Log In
                </button>

                <p className="text-[#A6958E] text-center mt-4">
                  Don't have an account? <button type="button" onClick={() => setShowLogin(false)} className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">Sign up</button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
