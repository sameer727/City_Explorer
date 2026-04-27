import { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, User, LayoutDashboard, ShieldAlert } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { messageApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }

    const fetchMessages = async () => {
      try {
        const { data } = await messageApi.list();
        setMessages(data);
      } catch (err) {
        setError('Failed to fetch messages. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between border-b border-slate-200 pb-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-accent/10 p-3 text-brand-accent dark:bg-brand-accent/20">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-brand-ink dark:text-white">Admin Dashboard</h1>
              <p className="mt-1 text-slate-500 dark:text-slate-400">Manage 'Get in Touch' messages</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400">
            <ShieldAlert className="h-4 w-4" />
            Admin Access
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-accent border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-rose-50 p-6 text-center text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
            {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-slate-200 border-dashed bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
            <Mail className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No messages yet</h3>
            <p className="mt-1 text-slate-500 dark:text-slate-400">When users contact you, their messages will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {messages.map((msg) => (
              <div 
                key={msg._id} 
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-soft dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-bg text-brand-accent dark:bg-slate-800">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-brand-ink dark:text-white">{msg.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <Calendar className="h-3 w-3" />
                          {new Date(msg.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 space-y-2 text-sm">
                    <a href={`mailto:${msg.email}`} className="flex items-center gap-2 text-slate-600 transition hover:text-brand-accent dark:text-slate-300">
                      <Mail className="h-4 w-4 text-slate-400" />
                      {msg.email}
                    </a>
                    <a href={`tel:${msg.contactNumber}`} className="flex items-center gap-2 text-slate-600 transition hover:text-brand-accent dark:text-slate-300">
                      <Phone className="h-4 w-4 text-slate-400" />
                      {msg.contactNumber}
                    </a>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/50">
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      "{msg.message}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
