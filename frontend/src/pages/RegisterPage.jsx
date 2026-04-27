import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { authApi } from '../lib/api';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { login, isLoggedIn } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Already logged in — redirect to dashboard
  if (isLoggedIn) return <Navigate to="/dashboard" replace />;

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authApi.register({
        name: form.name.trim(),
        email: form.email,
        password: form.password
      });
      setSuccess('Account created successfully! You can now log in.');
      // Optionally, auto-login after register
      // const response = await authApi.login({ email: form.email, password: form.password });
      // login(response.data.token);
      // navigate('/dashboard');
    } catch (requestError) {
      const apiMessage = requestError?.response?.data?.message;
      if (!requestError?.response) {
        setError('Cannot reach backend API. Please start backend server.');
      } else {
        setError(apiMessage || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <section className="mx-auto grid min-h-[70vh] max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-brand-accent">CityExplorer</p>
          <h1 className="mt-4 text-4xl font-bold text-brand-ink dark:text-white">
            Create your CityExplorer account
          </h1>
          <p className="mt-4 text-slate-500">
            Join us to explore amazing attractions around the world.
          </p>
        </div>

        <form onSubmit={onSubmit} className="rounded-[24px] bg-white p-7 shadow-soft dark:bg-slate-800">
          <h2 className="text-2xl font-semibold text-brand-ink dark:text-white">
            Get Started
          </h2>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">Name</span>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={onChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-ink outline-none transition focus:border-brand-accent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">Email</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-ink outline-none transition focus:border-brand-accent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-400">Password</span>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-ink outline-none transition focus:border-brand-accent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
          </div>

          {error ? <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:bg-rose-900/50 dark:text-rose-400">{error}</p> : null}
          {success ? <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600 dark:bg-green-900/50 dark:text-green-400">{success}</p> : null}

          <button
            disabled={loading}
            className="mt-6 w-full rounded-full bg-brand-accent px-5 py-3 text-sm font-semibold text-white transition hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account? <Link to="/login" className="text-brand-accent hover:underline">Sign in</Link>
          </p>
        </form>
      </section>
    </PageTransition>
  );
}