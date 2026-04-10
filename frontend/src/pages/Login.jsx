import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      // Dispatch custom event to update Navbar state simply
      window.dispatchEvent(new Event('authChange'));
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="bg-[#1F1715]/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 flex flex-col items-center mb-8">
            <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20 mb-4">
                <BrainCircuit className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-[#FDFBF9]">Welcome Back</h2>
            <p className="text-[#A6958E] mt-2 text-center">Login to track your cognitive mental health</p>
        </div>

        <form onSubmit={handleLogin} className="relative z-10 flex flex-col space-y-5">
            {error && <div className="text-red-400 bg-red-400/10 p-3 rounded-lg text-sm text-center border border-red-400/20">{error}</div>}
            
            <div>
                <label className="text-sm font-semibold text-[#A6958E] block mb-1">Username</label>
                <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#110C0A] border border-white/10 rounded-xl px-4 py-3 text-[#FDFBF9] focus:outline-none focus:border-amber-500/50 transition-colors"
                    placeholder="Enter your username"
                    required
                />
            </div>

            <div>
                <label className="text-sm font-semibold text-[#A6958E] block mb-1">Password</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#110C0A] border border-white/10 rounded-xl px-4 py-3 text-[#FDFBF9] focus:outline-none focus:border-amber-500/50 transition-colors"
                    placeholder="••••••••"
                    required
                />
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#110C0A] font-bold py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all transform hover:scale-[1.02]">
                Log In
            </button>
        </form>

        <p className="text-[#A6958E] text-center mt-6 relative z-10">
            Don't have an account? <Link to="/signup" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
