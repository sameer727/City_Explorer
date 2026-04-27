import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Star, Clock, X, CheckCircle2, AlertCircle } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { bookingApi } from '../lib/api';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelModal, setCancelModal] = useState({ isOpen: false, booking: null });
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingApi.list();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!cancelModal.booking) return;

    try {
      setCancelling(true);
      await bookingApi.cancel(cancelModal.booking._id);
      // Update the booking status locally
      setBookings(prev => prev.map(booking =>
        booking._id === cancelModal.booking._id
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
      setCancelModal({ isOpen: false, booking: null });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('Failed to cancel booking. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    return Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <PageTransition>
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-brand-ink dark:text-white sm:text-5xl">
              My Bookings
            </h1>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              Loading your bookings...
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 rounded-t-2xl bg-slate-200 dark:bg-slate-700"></div>
                <div className="rounded-b-2xl bg-white p-6 shadow-soft dark:bg-slate-800">
                  <div className="mb-4 h-4 rounded bg-slate-200 dark:bg-slate-700"></div>
                  <div className="mb-2 h-3 rounded bg-slate-200 dark:bg-slate-700"></div>
                  <div className="h-3 rounded bg-slate-200 dark:bg-slate-700"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-brand-ink dark:text-white sm:text-5xl">
            My Bookings
          </h1>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
            View and manage all your hotel reservations.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="py-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
            <h3 className="mt-4 text-lg font-semibold text-brand-ink dark:text-white">No bookings yet</h3>
            <p className="mt-2 text-slate-500">Your hotel reservations will appear here once you make a booking.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {bookings.map((booking) => (
                <motion.article
                  key={booking._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="group overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-soft dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={booking.hotel.imageUrl}
                      alt={booking.hotel.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-sm font-semibold text-brand-ink backdrop-blur-sm dark:bg-slate-900/90 dark:text-white">
                      {booking.bookingReference}
                    </div>
                    <div className={`absolute left-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="capitalize">{booking.status}</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="mb-2 text-lg font-semibold text-brand-ink dark:text-white line-clamp-1">
                      {booking.hotel.name}
                    </h3>

                    <div className="mb-3 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="line-clamp-1">{booking.hotel.location}, {booking.hotel.city}</span>
                    </div>

                    <div className="mb-4 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Check-in:</span>
                        <span className="font-medium text-brand-ink dark:text-white">
                          {formatDate(booking.checkInDate)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Check-out:</span>
                        <span className="font-medium text-brand-ink dark:text-white">
                          {formatDate(booking.checkOutDate)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Guests:</span>
                        <span className="font-medium text-brand-ink dark:text-white">
                          {booking.guests}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Nights:</span>
                        <span className="font-medium text-brand-ink dark:text-white">
                          {calculateNights(booking.checkInDate, booking.checkOutDate)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-700/50">
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Total Paid</div>
                        <div className="text-lg font-bold text-brand-ink dark:text-white">
                          ₹{booking.totalPrice.toLocaleString('en-IN')}
                        </div>
                      </div>

                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => setCancelModal({ isOpen: true, booking })}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Cancel Booking Modal */}
        <AnimatePresence>
          {cancelModal.isOpen && cancelModal.booking && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCancelModal({ isOpen: false, booking: null })}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-800"
              >
                <div className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-ink dark:text-white">Cancel Booking</h3>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">
                    Are you sure you want to cancel your booking for <strong>{cancelModal.booking.hotel.name}</strong>?
                  </p>
                  <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                    This action cannot be undone.
                  </p>
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setCancelModal({ isOpen: false, booking: null })}
                      className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500/20 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      Keep Booking
                    </button>
                    <button
                      onClick={handleCancelBooking}
                      disabled={cancelling}
                      className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-70"
                    >
                      {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>
    </PageTransition>
  );
}