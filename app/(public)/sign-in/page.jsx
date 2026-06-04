'use client';
import React, { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { TriangleAlert, Eye, EyeOff, TrendingUp, BellRing, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const getSessionWithRetry = async (tries = 5, delayMs = 80) => {
    let s = await getSession();
    for (let i = 0; i < tries && !s; i++) {
      await new Promise(r => setTimeout(r, delayMs));
      s = await getSession();
    }
    return s;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pending) return;

    setPending(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (res?.ok) {
        const session = await getSessionWithRetry();
        const id = session?.user?.id;

        toast.success('Login successful');

        if (id) {
          router.replace(`/agents/${id}`);
          router.refresh?.();
        } else {
          router.replace('/');
        }
        return;
      }

      if (res?.error === 'CredentialsSignin' || res?.status === 401) {
        setError('Invalid credentials');
      } else {
        setError(res?.error || 'Something went wrong');
      }
    } catch (err) {
      console.error('Sign-in error:', err);
      setError('Something went wrong');
    } finally {
      setPending(false);
    }
  };

  const handleProvider = async (event, provider) => {
    event.preventDefault();
    await signIn(provider, { callbackUrl: '/auth/callback' });
  };

  return (
    <div className="min-h-screen flex w-full bg-white font-sans">
      
      {/* Left Column (Auth) */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 py-12 relative max-w-3xl">
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <div className="text-[#0f4098] font-bold text-xl tracking-tight flex items-center gap-2">
             <span className="w-6 h-6 rounded-md bg-[#0f4098] text-white flex items-center justify-center text-xs">M</span>
             MOTIO
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">Automotive Intelligence</span>
        </div>

        <div className="w-full max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Welcome back</h1>
          <p className="text-slate-500 mb-8 text-sm">Log in to your dealership command center.</p>

          {!!error && (
            <div className="bg-red-50 p-3 rounded-lg flex items-center gap-x-2 text-sm text-red-600 mb-6 border border-red-100">
              <TriangleAlert className="w-4 h-4" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  disabled={pending}
                  placeholder="name@dealership.jo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 pl-10 text-sm focus:ring-2 focus:ring-[#0f4098] outline-none text-slate-700 placeholder-slate-400 transition-shadow"
                />
                <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs font-semibold text-[#0f4098] hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  disabled={pending}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 pl-10 pr-10 text-sm focus:ring-2 focus:ring-[#0f4098] outline-none text-slate-700 placeholder-slate-400 transition-shadow tracking-widest"
                />
                <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="stay-signed" 
                checked={staySignedIn}
                onChange={(e) => setStaySignedIn(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#0f4098] focus:ring-[#0f4098]"
              />
              <label htmlFor="stay-signed" className="text-sm font-medium text-slate-700 cursor-pointer">
                Stay signed in for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-[#0f4098] hover:bg-blue-900 text-white rounded-lg py-3 px-4 font-semibold text-sm flex items-center justify-center gap-2 transition-all mt-6 shadow-md hover:shadow-lg disabled:opacity-70"
            >
              {pending ? 'Signing in…' : 'Sign In'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 mb-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-4 font-bold text-slate-400 uppercase tracking-widest">Or login with</span>
            </div>
          </div>

          <button
            disabled={pending}
            onClick={(e) => handleProvider(e, 'google')}
            className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg py-3 px-4 font-semibold text-sm flex items-center justify-center gap-3 transition-colors shadow-sm"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
              <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
              <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
              <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
            </svg>
            Google Enterprise SSO
          </button>
        </div>
      </div>

      {/* Right Column (Insights) */}
      <div className="hidden lg:flex flex-1 bg-[#f8fafc] border-l border-slate-200 relative flex-col justify-center px-12 xl:px-20 overflow-hidden">
        
        {/* Top Status */}
        <div className="absolute top-8 right-8 flex items-center gap-6 text-sm font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            System Status: <span className="text-emerald-600 font-bold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Operational</span>
          </div>
          <a href="#" className="hover:text-slate-900 transition-colors">Support</a>
        </div>

        <div className="max-w-md w-full relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-[10px] font-bold tracking-wider uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Live Market Data
          </div>
          
          <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">Intelligent Automotive Insights</h2>
          <p className="text-slate-600 mb-10 text-lg leading-relaxed">Real-time valuation and inventory management powered by Jordanian market data.</p>

          <div className="space-y-4">
            {/* Alert 1 */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">BYD Dolphin (Irbid)</h3>
                    <p className="text-xs text-slate-500">Demand up 22% this week</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700">+1.2k Leads</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1 mt-4">
                <div className="bg-emerald-600 h-1 rounded-full" style={{width: '75%'}}></div>
              </div>
            </div>

            {/* Alert 2 */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <BellRing className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Toyota Ioniq 5 Alert</h3>
                    <p className="text-xs text-slate-500">Zarqa supply drop: 15%</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#0f4098] tracking-wider uppercase">High Heat</span>
              </div>
              <p className="text-xs text-slate-600 italic bg-blue-50/50 p-3 rounded-lg border border-blue-50">
                AI Suggestion: "Hold inventory for price correction in Amman Free Zone."
              </p>
            </div>

            {/* Alert 3 */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Daily Volume</h3>
                  <p className="text-xs text-slate-500">84.2K JOD total trade value</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-3 text-slate-500 text-sm font-medium">
            <ShieldCheck className="w-5 h-5 text-blue-600" /> Trusted by 250+ dealerships across the Kingdom.
          </div>
        </div>
        
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      </div>

      {/* Ticker (Absolute Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#0f4098] overflow-hidden hidden md:flex items-center">
        <div className="animate-marquee whitespace-nowrap text-white text-[11px] font-bold tracking-widest uppercase flex gap-12">
          <span>TESLA MODEL 3: 32,500 JOD (HOT)</span>
          <span>•</span>
          <span>MERCEDES EQE: 58,000 JOD (STABLE)</span>
          <span>•</span>
          <span>VW ID.4: 24,800 JOD (HOT)</span>
          <span>•</span>
          <span>INVENTORY LOW: HYUNDAI IONIQ</span>
          <span>•</span>
          <span>TESLA MODEL 3: 32,500 JOD (HOT)</span>
          <span>•</span>
          <span>MERCEDES EQE: 58,000 JOD (STABLE)</span>
          <span>•</span>
          <span>VW ID.4: 24,800 JOD (HOT)</span>
        </div>
      </div>
      
    </div>
  );
};

export default SignIn;
