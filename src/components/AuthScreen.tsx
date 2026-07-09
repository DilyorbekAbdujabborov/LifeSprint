import React, { useState } from 'react';
import { Mail, Lock, User, Loader2, GraduationCap } from 'lucide-react';
import logoSrc from '../img/logo.jpg';
import { useAuth } from '../auth';
import CustomSelect from './CustomSelect';

export default function AuthScreen() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, role);
      }
    } catch (err: any) {
      setError(err.message || 'Xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell relative flex min-h-screen items-center justify-center p-4 transition-colors duration-300">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-[-5rem] h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute bottom-[-6rem] right-[-4rem] h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
          <div className="mb-8 flex flex-col items-center">
            <img src={logoSrc} alt="LifeSprint" className="mb-4 h-16 w-16 rounded-2xl object-cover shadow-lg" />
          <h1 className="text-3xl font-black tracking-tight text-[color:var(--text)]">LifeSprint</h1>
          <p className="mt-1 text-sm font-bold text-[color:var(--text-muted)]">
            {mode === 'login' ? 'Hisobingizga kiring' : 'Yangi hisob yarating'}
          </p>
        </div>

        {/* Card */}
        <div className="app-panel p-6 shadow-xl sm:p-8">
          {/* Mode switch */}
          <div className="mb-6 flex gap-2 rounded-2xl bg-[color:var(--surface-2)] p-1">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError(null); }}
                className={`flex-1 cursor-pointer rounded-xl py-2.5 text-sm font-black transition-all ${
                  mode === m
                    ? 'bg-[color:var(--surface)] text-[color:var(--brand)] shadow-xs'
                    : 'text-[color:var(--text-subtle)] hover:text-[color:var(--text)]'
                }`}
              >
                {m === 'login' ? 'Kirish' : 'Ro\'yxatdan o\'tish'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' && (
              <Field icon={<User className="w-4 h-4" />}>
                  <input
                    type="text"
                    placeholder="To'liq ism"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-transparent text-sm font-bold text-[color:var(--text)] outline-none placeholder:text-[color:var(--text-subtle)]"
                  />
              </Field>
            )}

            <Field icon={<Mail className="w-4 h-4" />}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent text-sm font-bold text-[color:var(--text)] outline-none placeholder:text-[color:var(--text-subtle)]"
              />
            </Field>

            <Field icon={<Lock className="w-4 h-4" />}>
              <input
                type="password"
                placeholder="Parol (kamida 6 belgi)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-transparent text-sm font-bold text-[color:var(--text)] outline-none placeholder:text-[color:var(--text-subtle)]"
              />
            </Field>

            {mode === 'register' && (
              <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3.5">
                <GraduationCap className="w-4 h-4 text-[color:var(--text-subtle)]" />
                <div className="flex-1">
                  <CustomSelect
                    value={role}
                    onChange={setRole}
                    options={[
                      { value: 'student', label: 'O\'quvchi' },
                      { value: 'teacher', label: 'O\'qituvchi' },
                      { value: 'parent', label: 'Ota-ona' },
                    ]}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[color:var(--brand)] py-3.5 text-sm font-black text-[color:var(--brand-contrast)] shadow-lg shadow-sky-500/20 transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? 'Kirish' : 'Hisob yaratish'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs font-bold text-[color:var(--text-subtle)]">
          Ma'lumotlaringiz xavfsiz saqlanadi <Lock className="w-3.5 h-3.5 inline" />
        </p>
      </div>
    </div>
  );
}

function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3.5 transition-colors focus-within:border-[color:var(--brand)]">
      <span className="text-[color:var(--text-subtle)]">{icon}</span>
      {children}
    </div>
  );
}
