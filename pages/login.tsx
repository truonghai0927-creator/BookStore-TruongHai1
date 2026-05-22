import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import AuthInput from '../components/AuthInput';
import {
  EnvelopeIcon,
  LockClosedIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { login } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleResize = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const validate = () => {
    const next: Record<string, string> = {};

    if (!email.trim()) {
      next.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Please enter a valid email';
    }

    if (!password) {
      next.password = 'Password is required';
    }

    return next;
  };

  const handleBlur = () => {
    setTouched({ email: true, password: true });
    setErrors(validate());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    setTouched({ email: true, password: true });
    const v = validate();
    setErrors(v);

    if (Object.keys(v).length > 0) {
      formRef.current?.classList.add('shake');
      setTimeout(() => formRef.current?.classList.remove('shake'), 400);
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);

      if (rememberMe) {
        localStorage.setItem('remember-email', email.trim());
      } else {
        localStorage.removeItem('remember-email');
      }

      // Don't store password in localStorage for security
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('remember-email');
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-auth-gradient dark:bg-[#0F172A]">
      {/* ── Ambient orbs ── */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', animation: 'float 8s ease-in-out infinite' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full opacity-25"
        style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', animation: 'float 10s ease-in-out infinite reverse' }}
        aria-hidden="true"
      />

      {/* ── Main layout ── */}
      <div className="relative z-10 flex min-h-screen items-stretch">

        {/* ── Left panel ── */}
        <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 flex-col justify-between bg-gradient-to-br from-indigo-600 via-violet-600 to-violet-700 p-12 xl:p-16">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Bookstore
              </span>
            </div>

            {/* Decorative stack */}
            <div
              className="mt-auto mb-auto book-setup"
              aria-hidden="true"
              style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,.3))' }}
            >
              {['#6366f1', '#7c3aed', '#a78bfa'].map((color, i) => (
                <div
                  key={color}
                  className="book-cover flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${color} 0%, ${color}aa 100%)`,
                    width: `${52 + i * 6}px`,
                    height: `${72 + i * 8}px`,
                    borderRadius: `${6 + i * 2}px ${12}px ${12}px ${6 + i * 2}px`,
                    marginLeft: i > 0 ? '-12px' : '0',
                    opacity: 0.78 + i * 0.08,
                    transform: `rotateY(${i * -5}deg) rotateZ(${i === 0 ? -2 : i === 1 ? 1 : 2}deg)`,
                    zIndex: 3 - i,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Quote */}
          <div className="mt-16 xl:mt-0">
            <blockquote className="text-2xl xl:text-3xl font-semibold leading-relaxed text-white/90">
              &ldquo;We read to know we are not alone.&rdquo;
            </blockquote>
            <p className="mt-3 text-sm font-medium text-white/60">— C.S. Lewis</p>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="glass-card w-full max-w-md overflow-hidden rounded-3xl p-8 sm:p-10 shadow-auth-card">
            {/* Mobile logo */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Bookstore</span>
            </div>

            {/* Headings */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 dark:text-white leading-tight">
                Welcome{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                  back
                </span>
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Sign in to continue to your account
              </p>
            </div>

            {/* Error alert */}
            {formError && (
              <div className="mb-5 animate-slideDown rounded-xl bg-red-50 p-3.5 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400 ring-1 ring-red-100 dark:ring-red-900/40">
                <div className="flex items-start gap-2.5">
                  <svg className="mt-px h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                  <span className="leading-relaxed">{formError}</span>
                </div>
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email */}
              <AuthInput
                label="Email Address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (touched.email) setErrors(validate());
                }}
                onBlur={handleBlur}
                error={touched.email ? errors.email : undefined}
                icon={<EnvelopeIcon className="h-5 w-5" />}
                autoComplete="email"
              />

              {/* Password */}
              <AuthInput
                label="Password"
                name="password"
                type="password"
                showPasswordToggle
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touched.password) setErrors(validate());
                }}
                onBlur={handleBlur}
                error={touched.password ? errors.password : undefined}
                icon={<LockClosedIcon className="h-5 w-5" />}
                autoComplete="current-password"
              />

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400 select-none">
                    Remember me
                  </span>
                </label>

                <Link
                  href="/forgot-password"
                  className="inline-flex items-center gap-1 text-sm font-medium text-violet-600 transition-colors hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  mt-2 flex h-12 w-full items-center justify-center gap-2
                  rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600
                  px-6 py-3.5 text-sm font-semibold
                  text-white shadow-auth-button
                  transition-all duration-200 ease-out
                  hover:shadow-auth-button-hover hover:brightness-110
                  active:scale-[0.985]
                  disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:brightness-100 disabled:hover:scale-100
                "
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <>
                    <LockClosedIcon className="h-5 w-5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500">
                or
              </span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Register link */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-medium text-violet-600 transition-colors hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
