import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Eye, EyeOff, Loader2, AlertCircle, Shield, ArrowRight, ArrowLeft, Mail } from 'lucide-react';
import { sendOtp, verifyOtp, signIn, signUp, resetPassword, isAllowedAdminEmail, shouldSkipAdminOtp } from '@workspace/esaora-core/lib/auth';
import { supabase } from '@workspace/esaora-core/lib/supabase';

type AuthView = 'login' | 'signup' | 'forgot' | 'success' | 'otp';

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpAuthType, setOtpAuthType] = useState<'signup' | 'email' | 'recovery'>('email');

  useEffect(() => {
    if (lockoutTime > 0) {
      const timer = setInterval(() => setLockoutTime(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutTime]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  const validatePassword = (pass: string) => {
    if (pass.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(pass)) return "Password must contain at least one uppercase letter.";
    if (!/[0-9]/.test(pass)) return "Password must contain at least one number.";
    return null;
  };

  const isValidEmailFormat = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const getLoginErrorMessage = () => 'Invalid email or password';

  const getSignupDomainErrorMessage = () =>
    'This email address is not authorized for admin access';

  const getOtpErrorMessage = (err?: { message?: string }) => {
    const msg = err?.message?.toLowerCase() ?? '';
    if (msg.includes('expired') || msg.includes('invalid') || msg.includes('token')) {
      return 'Invalid or expired code. Please try again.';
    }
    return 'Verification failed. Please check the code and try again.';
  };

  const sanitizeAuthError = (view: AuthView, err?: { message?: string }) => {
    const msg = err?.message?.toLowerCase() ?? '';
    if (msg.includes('rate limit') || (msg.includes('after') && msg.includes('seconds'))) {
      return 'rate-limit';
    }
    if (view === 'login') return getLoginErrorMessage();
    if (view === 'signup') {
      if (msg.includes('already registered') || msg.includes('already exists')) {
        return getLoginErrorMessage();
      }
      return 'Unable to create account. Please try again.';
    }
    return 'Unable to process your request. Please try again.';
  };

  const handleFailure = (defaultMsg: string, err?: { message?: string }) => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts === 2) {
      setLockoutTime(30);
      setError("rate-limit");
    } else if (newAttempts >= 3) {
      setLockoutTime(60);
      setError("rate-limit");
    } else {
      if (err?.message) {
        const match = err.message.match(/after (\d+) seconds/i);
        if (match) {
          setLockoutTime(parseInt(match[1], 10));
          setError("rate-limit");
          return;
        }
      }
      setError(defaultMsg);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const code = otpCode.join('');
      if (code.length !== 6) throw new Error('Please enter the fully completed 6-digit code.');
      
      await verifyOtp(email, code, otpAuthType);
      window.location.href = '/admin';
    } catch (err: unknown) {
      setError(getOtpErrorMessage(err as { message?: string }));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
       // Paste functionality
       const pasted = value.slice(0, 6).split('');
       const newOtp = [...otpCode];
       for(let i = 0; i < pasted.length; i++) {
         if (index + i < 6) newOtp[index + i] = pasted[i];
       }
       setOtpCode(newOtp);
       // Focus last
       const next = document.getElementById(`otp-${Math.min(5, index + pasted.length)}`);
       if (next) next.focus();
       return;
    }
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmailFormat(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    if (view === 'signup' && !isAllowedAdminEmail(email)) {
      setError(getSignupDomainErrorMessage());
      setLoading(false);
      return;
    }

    if (view === 'login' && !isAllowedAdminEmail(email)) {
      handleFailure(getLoginErrorMessage());
      setLoading(false);
      return;
    }

    if (view === 'signup') {
      const passError = validatePassword(password);
      if (passError) {
        setError(passError);
        setLoading(false);
        return;
      }
    }

    try {
      if (view === 'login') {
        if (shouldSkipAdminOtp()) {
          // DEV ONLY - remove/disable for production
          await signIn(email, password);
          window.location.href = '/admin';
        } else {
          try {
            await sendOtp(email);

            setOtpAuthType('email');
            setResendTimer(60);
            await new Promise(resolve => setTimeout(resolve, 600));
            setView('otp');
          } catch (err: unknown) {
            setAttempts(prev => prev + 1);
            throw err;
          }
        }
      } else if (view === 'signup') {
        const response = await signUp(email, password, {
          full_name: fullName,
          role: 'super_admin',
        });

        if (response.user) {
          if (shouldSkipAdminOtp()) {
            // DEV ONLY - remove/disable for production
            if (!response.session) {
              await signIn(email, password);
            }
            window.location.href = '/admin';
          } else {
            setOtpAuthType('signup');
            setResendTimer(60);
            setView('otp');
          }
        }
      } else if (view === 'forgot') {
        try {
          if (isAllowedAdminEmail(email)) {
            await resetPassword(email);
          }
        } catch {
          // Always show success to avoid account enumeration
        }
        setView('success');
      }
    } catch (err: unknown) {
      const safeMsg = sanitizeAuthError(view, err as { message?: string });
      if (safeMsg === 'rate-limit') {
        handleFailure('rate-limit', err as { message?: string });
      } else {
        handleFailure(safeMsg, err as { message?: string });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch font-sans selection:bg-[#001BB7] selection:text-white">
      {/* Left Panel: Precise Institutional Identity */}
      <div className="hidden lg:flex flex-col w-[40%] p-16 bg-[#001BB7] relative overflow-hidden">
        {/* Deep Field Background */}
        <div 
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: "url('/images/hero/hero-bg-10.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="relative z-10 flex flex-col h-full">
          {/* [1] TOP LOGO */}
          <div className="mb-12">
            <img src="/footerlogo.png" alt="Mahilala Madagascar" className="h-12 w-auto brightness-110" />
          </div>

          {/* [2] CONCISE HEADING & DESCRIPTION */}
          <div className="flex flex-col">
            <h1 className="text-white text-2xl font-bold tracking-tight uppercase mb-4">
              Admin Portal
            </h1>
            
            <p className="text-white/70 text-[14px] leading-relaxed max-w-sm">
              Secure administrative gateway for Mahilala Madagascar. This environment is strictly audited to maintain website content integrity and operational security.
            </p>
          </div>

          {/* [3] SEPARATOR & SECURITY (CENTERED) */}
          <div className="mt-8 pt-8 border-t border-white/20 flex items-center justify-center gap-3 text-[#F78A28]">
            <Shield className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Secure node active</span>
          </div>

          {/* [4] TECHNICAL METADATA (BOTTOM ANCHOR) */}
          <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between text-white/20 text-[10px] font-bold uppercase tracking-widest">
             <span>mahilalamadagascar.org</span>
             <span>v2.4.0</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Clean Dotted Security Portal */}
      <div 
        className="flex-1 flex flex-col justify-center items-center p-8 bg-white relative"
        style={{
          backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div className="w-full max-w-sm space-y-8">
          
          {/* Header (Outside the Card) */}
          <div className="space-y-2">
            <h1 className="text-brand-navy font-bold text-3xl tracking-tight">
              {view === 'login' && 'Sign in'}
              {view === 'signup' && 'Create account'}
              {view === 'forgot' && 'Reset pass key'}
              {view === 'success' && 'Request received'}
            </h1>
            <p className="text-gray-400 text-sm">
              {view === 'login' && 'Management portal for Mahilala Madagascar'}
              {view === 'signup' && 'Request administrative access for Mahilala Madagascar'}
              {view === 'forgot' && 'Verification will be sent to your identity email'}
              {view === 'success' && 'Processing your security request...'}
            </p>
          </div>

          <div className="bg-white p-0">
            {view === 'success' ? (
              <div className="space-y-8 py-4">
                <div className="w-16 h-16 bg-[#E8EAF8] rounded-full flex items-center justify-center mx-auto">
                   <Shield className="w-8 h-8 text-[#001BB7]" />
                </div>
                <div className="text-center space-y-3 px-4">
                   <p className="text-brand-navy font-semibold text-sm leading-relaxed">
                     If an account exists for that email, you will receive further instructions shortly.
                   </p>
                   <p className="text-gray-400 text-xs leading-relaxed">
                     To maintain the integrity of the alliance portal, we recommend checking your spam folder if the identity key does not appear within 5 minutes.
                   </p>
                </div>
                <button 
                  onClick={() => setView('login')}
                  className="w-full text-brand-navy font-bold text-xs uppercase tracking-widest hover:text-[#001BB7] transition-colors"
                >
                  Return to sign in
                </button>
              </div>
            ) : view === 'otp' ? (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-[#E8EAF8] rounded-full flex items-center justify-center mx-auto mb-4">
                     <Mail className="w-8 h-8 text-[#001BB7]" />
                  </div>
                  <h3 className="text-brand-navy font-bold text-lg">Verify Identity</h3>
                  <p className="text-gray-400 text-xs mt-1 px-4">
                    Enter the 6-digit code sent to <span className="font-bold text-gray-700">{email}</span>.
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-[6px] p-4 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-red-700 text-xs font-semibold leading-relaxed">{error}</p>
                  </div>
                )}

                <div className="flex justify-between gap-2 max-w-[280px] mx-auto py-2">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-10 h-10 text-center bg-white border border-gray-300 rounded-[6px] text-lg font-bold focus:border-[#001BB7] focus:ring-1 focus:ring-[#001BB7] outline-none transition-all"
                      required
                    />
                  ))}
                </div>

                <div className="flex flex-col gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#001BB7] text-white hover:bg-[#F78A28] px-8 py-4 rounded-[6px] font-bold text-xs tracking-widest transition-colors flex items-center justify-center gap-3 relative overflow-hidden group"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Access'}
                  </button>
                  <button 
                    type="button" 
                    disabled={resendTimer > 0 || loading}
                    onClick={async () => {
                      if (resendTimer > 0) return;
                      setLoading(true);
                      try {
                        if (otpAuthType === 'signup') {
                          await supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo: window.location.origin } });
                        } else {
                          await sendOtp(email);
                        }
                        setResendTimer(60);
                        setError("Code resent successfully.");
                      } catch (err: unknown) {
                        setError(getOtpErrorMessage(err as { message?: string }));
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className={`text-center text-[10px] font-bold uppercase tracking-widest transition-colors mt-3 ${resendTimer > 0 ? 'text-gray-300' : 'text-[#001BB7] hover:text-brand-navy'}`}
                  >
                    {resendTimer > 0 ? `Resend available in ${resendTimer}s` : 'Resend Code'}
                  </button>
                  <button 
                    type="button" 
                    disabled={loading}
                    onClick={() => setView('login')} 
                    className="text-center text-[10px] font-bold text-gray-400 hover:text-brand-navy uppercase tracking-widest transition-colors mt-2"
                  >
                    Cancel & Return
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && error !== "rate-limit" && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded p-4 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                    <p className="text-red-700 text-xs font-semibold leading-relaxed">{error}</p>
                  </div>
                )}

                {lockoutTime > 0 && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-[6px] p-4 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-red-700 text-xs font-semibold leading-relaxed text-left">
                       For security purposes, you can only request this after {lockoutTime} seconds.
                    </p>
                  </div>
                )}

                {view === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 ml-1 leading-none">Full name</label>
                    <div className="relative pt-1">
                       <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Mahilala team member"
                        required
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#001BB7] transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 ml-1 leading-none">Email</label>
                  <div className="relative pt-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@organization.com"
                      required
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#001BB7] transition-all"
                    />
                  </div>
                </div>

                {view !== 'forgot' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[11px] font-bold text-gray-400 leading-none">Password</label>
                      {view === 'login' && (
                        <button type="button" onClick={() => setView('forgot')} className="text-[10px] font-bold text-[#001BB7] hover:text-brand-navy transition-colors">
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative pt-1">
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 pr-12 text-sm font-medium focus:outline-none focus:border-[#001BB7] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((s) => !s)}
                        className="absolute right-4 top-[60%] -translate-y-1/2 text-gray-300 hover:text-brand-navy"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-6 pt-2">
                  <div className="flex items-center justify-between">
                    {view === 'login' && (
                       <label className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="peer sr-only"
                        />
                        <div className="w-4 h-4 border border-gray-300 rounded peer-checked:bg-[#001BB7] peer-checked:border-[#001BB7] transition-all" />
                        <span className="text-[11px] font-bold text-gray-400 group-hover:text-brand-navy transition-colors">Keep session active</span>
                      </label>
                    )}
                    {view !== 'login' && (
                      <button type="button" onClick={() => setView('login')} className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 hover:text-brand-navy transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || lockoutTime > 0}
                    className="w-full bg-[#001BB7] text-white hover:bg-[#F78A28] px-8 py-4 rounded-lg font-bold text-xs tracking-widest transition-colors flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <>
                        <span>
                          {view === 'login' && 'Security sign in'}
                          {view === 'signup' && 'Request access'}
                          {view === 'forgot' && 'Send reset link'}
                        </span>
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="pt-8 flex flex-col items-center gap-6">
             {view === 'login' && (
               <button 
                onClick={() => setView('signup')}
                className="group flex items-center gap-2 text-[11px] font-bold text-gray-400 hover:text-brand-navy transition-colors"
               >
                 No credentials? <span className="text-[#001BB7] group-hover:text-brand-navy transition-colors underline underline-offset-4 decoration-gray-200">Create account</span>
               </button>
             )}
             
             <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-300" />
                  <span className="text-[11px] font-bold text-gray-400 tracking-wide">Contact your IT administrator</span>
                </div>

                <div className="flex flex-col items-center gap-2 pt-4">
                  <p className="text-gray-300 text-[9px] font-bold uppercase tracking-[0.2em] font-mono">
                    Alliance · Regional Security Protocol
                  </p>
                  <a 
                    href="https://portfolio.kazinikazi.co.ke" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-gray-400 hover:text-brand-navy transition-colors font-medium"
                  >
                    Designed by <span className="font-bold underline underline-offset-2 italic">KNK Digital</span>
                  </a>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
