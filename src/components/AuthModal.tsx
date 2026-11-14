import React, { useState } from 'react';
import { X, ArrowRight, Check, Loader2, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup' | 'forgot';
  onClose: () => void;
  onSuccess: (isNewUser: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signup',
  onClose,
  onSuccess,
}) => {
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    const cleanEmail = email.trim();

    // 1. Validate empty inputs before any request
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setErrorMessage('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    // 2. SIGN UP FLOW
    if (mode === 'signup') {
      const cleanName = name.trim();
      if (!cleanName) {
        setErrorMessage('Please enter your name.');
        return;
      }

      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }

      setIsLoading(true);

      try {
        const result = await signUp(cleanEmail, password, cleanName);

        if (!result.success) {
          setIsLoading(false);
          setErrorMessage(result.error || 'Failed to create your account. Please try again.');
          return;
        }

        // Account created & session established
        setIsLoading(false);
        onSuccess(true);
      } catch (err: any) {
        setIsLoading(false);
        setErrorMessage(err.message || 'An unexpected error occurred during account creation.');
      }

      return;
    }

    // 3. SIGN IN FLOW
    if (mode === 'signin') {
      setIsLoading(true);

      try {
        const result = await signIn(cleanEmail, password);

        if (!result.success) {
          // Strictly display generic error without revealing email existence
          setIsLoading(false);
          setErrorMessage("We couldn't sign you in. Check your email and password and try again.");
          return;
        }

        // Session confirmed!
        setIsLoading(false);
        onSuccess(false);
      } catch (err: any) {
        setIsLoading(false);
        setErrorMessage("We couldn't sign you in. Check your email and password and try again.");
      }

      return;
    }

    // 4. FORGOT PASSWORD
    if (mode === 'forgot') {
      setSuccessNotice('If a prototype account exists for this email, password reset instructions have been recorded.');
      setTimeout(() => setMode('signin'), 3000);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF8F5] border border-[#E7E2D7] rounded-3xl p-6 sm:p-10 max-w-md w-full shadow-2xl relative text-[#16281D]"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#76877A] hover:text-[#16281D] p-1.5 rounded-lg cursor-pointer transition-colors"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
            {mode === 'signup' && 'Create Your Personal Garden'}
            {mode === 'signin' && 'Welcome Back'}
            {mode === 'forgot' && 'Account Recovery'}
          </span>
          <h2 id="auth-modal-title" className="font-serif text-3xl text-[#16281D] font-normal tracking-tight mt-1">
            {mode === 'signup' && 'Start your LeafStory'}
            {mode === 'signin' && 'Sign in to your garden'}
            {mode === 'forgot' && 'Reset password'}
          </h2>
          <p className="font-serif italic text-xs text-[#566B5C] mt-1 font-light">
            {mode === 'signup' && '“See how your plant grows. Notice how you grow with it.”'}
            {mode === 'signin' && 'Enter your registered credentials to resume observation.'}
            {mode === 'forgot' && 'Enter your email to receive a password reset link.'}
          </p>
        </div>

        {/* Inline Error Message */}
        {errorMessage && (
          <div
            className="mb-4 p-3.5 rounded-xl bg-[#FAF0EE] border border-[#EAC7C0] text-xs font-sans text-[#8C342A] flex items-start gap-2 animate-fade-in"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Success Notice */}
        {successNotice && (
          <div className="mb-4 p-3.5 rounded-xl bg-[#EEF5EF] border border-[#C5DAC9] text-xs font-sans text-[#204029] flex items-start gap-2 animate-fade-in">
            <Check className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{successNotice}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#76877A] font-sans font-medium mb-1.5">
                Full Name <span className="text-[#8C342A]">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Elena Rostova"
                disabled={isLoading}
                className="w-full px-4 py-2.5 rounded-xl border border-[#DDD7CC] bg-white text-sm font-sans text-[#16281D] focus:border-[#16281D] outline-none disabled:opacity-50"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#76877A] font-sans font-medium mb-1.5">
              Email Address <span className="text-[#8C342A]">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="elena@botanical.me"
              disabled={isLoading}
              className="w-full px-4 py-2.5 rounded-xl border border-[#DDD7CC] bg-white text-sm font-sans text-[#16281D] focus:border-[#16281D] outline-none disabled:opacity-50"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] uppercase tracking-wider text-[#76877A] font-sans font-medium">
                  Password <span className="text-[#8C342A]">*</span>
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMessage(null);
                    }}
                    className="text-[11px] text-[#76877A] hover:text-[#16281D] underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full px-4 py-2.5 rounded-xl border border-[#DDD7CC] bg-white text-sm font-sans text-[#16281D] focus:border-[#16281D] outline-none disabled:opacity-50"
              />
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#76877A] font-sans font-medium mb-1.5">
                Confirm Password <span className="text-[#8C342A]">*</span>
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full px-4 py-2.5 rounded-xl border border-[#DDD7CC] bg-white text-sm font-sans text-[#16281D] focus:border-[#16281D] outline-none disabled:opacity-50"
              />
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#16281D] text-[#FAF8F5] hover:bg-[#233F2E] font-sans text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {mode === 'signup' ? 'Creating account…' : 'Signing in…'}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'signup' && 'Create Account & Begin'}
                    {mode === 'signin' && 'Sign In to Garden'}
                    {mode === 'forgot' && 'Send Reset Email'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Educational Security Disclaimer Note */}
        <div className="mt-5 p-2.5 rounded-xl bg-[#F4EFE6] border border-[#E3DBD0] text-[11px] font-sans text-[#6C7C71] flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 shrink-0 text-[#4E6153]" />
          <span>Prototype authentication — production deployment would use a secure authentication service.</span>
        </div>

        {/* Mode Toggle Footer */}
        <div className="mt-5 pt-4 border-t border-[#E7E2D7] text-center text-xs font-sans text-[#76877A]">
          {mode === 'signup' ? (
            <p>
              Already registered with LeafStory?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                  setSuccessNotice(null);
                }}
                className="text-[#16281D] font-semibold underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p>
              New to mindful plant observation?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                  setSuccessNotice(null);
                }}
                className="text-[#16281D] font-semibold underline cursor-pointer"
              >
                Create an account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
