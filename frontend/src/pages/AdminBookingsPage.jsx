import { useState, useEffect } from 'react';
import { Calendar, User, MapPin, IndianRupee, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { bookingApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [isAdmin, navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await bookingApi.list();
      setBookings(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAdmin) return null;

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-brand-ink dark:text-white">Bookings Management</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Monitor all hotel bookings</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 flex gap-3 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 flex gap-3 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-green-700 dark:text-green-400">{success}</p>
          </div>
        )}

        {/* Bookings List */}
        {loading ? (
          <div className="text-center text-slate-500">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
            <p className="text-slate-600 dark:text-slate-400">No bookings found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Guest
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Hotel
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Check-in
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Check-out
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Rooms
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {booking.userName}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {booking.userEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <p className="text-slate-900 dark:text-slate-100">{booking.hotelName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <p className="text-slate-900 dark:text-slate-100">
                          {formatDate(booking.checkInDate)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-900 dark:text-slate-100">
                        {formatDate(booking.checkOutDate)}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-slate-900 dark:text-slate-100">
                      {booking.numberOfRooms}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="h-4 w-4 text-slate-400" />
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {booking.totalPrice?.toLocaleString('en-IN') || '0.00'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary */}
        {bookings.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Bookings</p>
              <p className="mt-2 text-2xl font-bold text-brand-ink dark:text-white">{bookings.length}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Confirmed</p>
              <p className="mt-2 text-2xl font-bold text-green-600">
                {bookings.filter(b => b.status === 'confirmed').length}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Cancelled</p>
              <p className="mt-2 text-2xl font-bold text-red-600">
                {bookings.filter(b => b.status === 'cancelled').length}
              </p>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
