import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Hotel, 
  Mail, 
  Users, 
  TrendingUp,
  Calendar,
  Star,
  Eye,
  Settings
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { bookingApi, messageApi, hotelApi } from '../lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    bookings: 0,
    messages: 0,
    hotels: 0
  });
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    fetchStats();
  }, [isAdmin, navigate]);

  const fetchStats = async () => {
    try {
      const [bookingsRes, messagesRes, hotelsRes] = await Promise.all([
        bookingApi.list().catch(() => ({ data: [] })),
        messageApi.list().catch(() => ({ data: [] })),
        hotelApi.list().catch(() => ({ data: [] }))
      ]);

      setStats({
        bookings: bookingsRes.data?.length || 0,
        messages: messagesRes.data?.length || 0,
        hotels: hotelsRes.data?.length || 0
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null;

  const adminFeatures = [
    {
      id: 'hotels',
      title: 'Hotel Management',
      description: 'Add, edit, and manage hotels with images',
      icon: Hotel,
      link: '/admin/hotels',
      color: 'bg-blue-500',
      count: stats.hotels
    },
    {
      id: 'messages',
      title: 'Messages',
      description: 'View and manage contact messages',
      icon: Mail,
      link: '/admin/messages',
      color: 'bg-green-500',
      count: stats.messages
    },
    {
      id: 'bookings',
      title: 'Bookings',
      description: 'Monitor and manage all bookings',
      icon: Calendar,
      link: '/admin/bookings',
      color: 'bg-purple-500',
      count: stats.bookings
    }
  ];

  const quickStats = [
    {
      label: 'Total Hotels',
      value: stats.hotels,
      icon: Hotel,
      color: 'text-blue-600'
    },
    {
      label: 'Total Bookings',
      value: stats.bookings,
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      label: 'Messages',
      value: stats.messages,
      icon: Mail,
      color: 'text-green-600'
    }
  ];

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-2xl bg-brand-accent/10 p-3 text-brand-accent dark:bg-brand-accent/20">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-extrabold text-brand-ink dark:text-white">Admin Dashboard</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Manage all aspects of City Explorer</p>
        </div>

        {/* Quick Stats */}
        {!loading && (
          <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {quickStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-3xl font-bold text-brand-ink dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color} opacity-20`} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Admin Features Grid */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-brand-ink dark:text-white">
            Admin Features
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {adminFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.id}
                  to={feature.link}
                  className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${feature.color} rounded-lg p-3 text-white`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                        {feature.count}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold text-brand-ink dark:text-white group-hover:text-brand-accent transition">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {feature.description}
                    </p>

                    {/* Footer */}
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-brand-accent group-hover:gap-3 transition">
                      <span>View More</span>
                      <Eye className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Additional Admin Tools */}
        <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <h3 className="text-lg font-semibold text-brand-ink dark:text-white">
              Additional Features Coming Soon
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
              <Users className="h-5 w-5 text-slate-400" />
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-300">User Management</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage user roles and permissions</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
              <Star className="h-5 w-5 text-slate-400" />
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-300">Reviews Management</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Moderate and manage reviews</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
              <TrendingUp className="h-5 w-5 text-slate-400" />
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-300">Analytics</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">View detailed analytics and reports</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
              <Settings className="h-5 w-5 text-slate-400" />
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-300">System Settings</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Configure platform settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
