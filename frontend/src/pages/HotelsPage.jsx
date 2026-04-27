import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, Search, Hotel, CheckCircle2, X, Calendar, Users } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { bookingApi, hotelApi } from '../lib/api';

const mockHotels = [
  { id: 'h1', name: 'The Taj Mahal Palace', city: 'Mumbai', location: 'Colaba, near Gateway of India', rating: 4.9, price: 15000, reviews: 4200, imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80' },
  { id: 'h2', name: 'Trident Nariman Point', city: 'Mumbai', location: 'Nariman Point, near Marine Drive', rating: 4.8, price: 12000, reviews: 3100, imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80' },
  { id: 'h3', name: 'The Leela Palace', city: 'Delhi', location: 'Chanakyapuri, Diplomatic Enclave', rating: 4.9, price: 18000, reviews: 2800, imageUrl: 'https://images.unsplash.com/photo-1542314831-c6a420325142?auto=format&fit=crop&w=1200&q=80' },
  { id: 'h4', name: 'ITC Maurya', city: 'Delhi', location: 'Sardar Patel Marg', rating: 4.7, price: 14000, reviews: 3500, imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c0d12c56?auto=format&fit=crop&w=1200&q=80' },
  { id: 'h5', name: 'Rambagh Palace', city: 'Jaipur', location: 'Bhawani Singh Road', rating: 5.0, price: 25000, reviews: 1800, imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80' },
  { id: 'h6', name: 'Fairmont Jaipur', city: 'Jaipur', location: 'Riico Industrial Area, Kukas', rating: 4.8, price: 11000, reviews: 2100, imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80' },
  { id: 'h7', name: 'Novotel Visakhapatnam Varun Beach', city: 'Visakhapatnam', location: 'Beach Road, near RK Beach', rating: 4.6, price: 8500, reviews: 1500, imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80' },
  { id: 'h8', name: 'Taj Gateway Hotel', city: 'Visakhapatnam', location: 'Beach Road', rating: 4.5, price: 7000, reviews: 1200, imageUrl: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80' },
  { id: 'h9', name: 'Taj Lake Palace', city: 'Udaipur', location: 'Lake Pichola', rating: 4.9, price: 30000, reviews: 2900, imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80' },
  { id: 'h10', name: 'The Oberoi Amarvilas', city: 'Agra', location: 'Taj East Gate Road', rating: 5.0, price: 35000, reviews: 4100, imageUrl: 'https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=1200&q=80' },
  { id: 'h11', name: 'Fortune Select Grand Ridge', city: 'Tirupati', location: 'Shilparamam, Tiruchanoor Road', rating: 4.4, price: 5500, reviews: 950, imageUrl: 'https://images.unsplash.com/photo-1618773928120-2c1473659eb0?auto=format&fit=crop&w=1200&q=80' },
  { id: 'h12', name: 'Taj Banjara', city: 'Hyderabad', location: 'Banjara Hills', rating: 4.6, price: 9000, reviews: 2200, imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80' }
];

export default function HotelsPage() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [bookingModal, setBookingModal] = useState({ isOpen: false, hotel: null });
  const [bookingStatus, setBookingStatus] = useState('idle'); // idle | processing | success | error
  const [bookingForm, setBookingForm] = useState({
    checkInDate: '',
    checkOutDate: '',
    guests: 1
  });
  const [bookingError, setBookingError] = useState('');
  const [hotels, setHotels] = useState([]);
  const [hotelLoading, setHotelLoading] = useState(true);
  const [hotelFetchError, setHotelFetchError] = useState('');

  useEffect(() => {
    const fetchHotels = async () => {
      setHotelLoading(true);
      try {
        const response = await hotelApi.list();
        setHotels(response.data || []);
      } catch (error) {
        console.error('Failed to load hotels from API:', error);
        setHotelFetchError('Unable to fetch hotel data. Showing fallback list.');
      } finally {
        setHotelLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const getHotelCity = (hotel) => hotel.city || hotel.cityName || '';

  const filteredHotels = useMemo(() => {
    const sourceHotels = hotels.length > 0 ? hotels : mockHotels;
    if (!searchQuery.trim()) return sourceHotels;
    const query = searchQuery.toLowerCase();
    return sourceHotels.filter((hotel) => {
      const city = getHotelCity(hotel).toLowerCase();
      return (
        city.includes(query) ||
        hotel.location.toLowerCase().includes(query) ||
        hotel.name.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, hotels]);

  const topCities = ['Mumbai', 'Delhi', 'Jaipur', 'Visakhapatnam', 'Udaipur', 'Hyderabad'];

  const handleBookClick = (hotel) => {
    setBookingModal({ isOpen: true, hotel });
    setBookingStatus('idle');
    setBookingError('');
    setBookingForm({
      checkInDate: '',
      checkOutDate: '',
      guests: 1
    });
  };

  const confirmBooking = async () => {
    if (!bookingForm.checkInDate || !bookingForm.checkOutDate) {
      setBookingError('Please select check-in and check-out dates');
      return;
    }

    const checkIn = new Date(bookingForm.checkInDate);
    const checkOut = new Date(bookingForm.checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      setBookingError('Check-in date cannot be in the past');
      return;
    }

    if (checkOut <= checkIn) {
      setBookingError('Check-out date must be after check-in date');
      return;
    }

    setBookingStatus('processing');
    setBookingError('');

    try {
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const totalPrice = bookingModal.hotel.price * nights;

      const bookingData = {
        hotel: {
          name: bookingModal.hotel.name,
          city: getHotelCity(bookingModal.hotel),
          location: bookingModal.hotel.location,
          imageUrl: bookingModal.hotel.imageUrl,
          price: bookingModal.hotel.price,
          rating: bookingModal.hotel.rating
        },
        checkInDate: bookingForm.checkInDate,
        checkOutDate: bookingForm.checkOutDate,
        guests: bookingForm.guests,
        totalPrice
      };

      await bookingApi.create(bookingData);
      setBookingStatus('success');
    } catch (error) {
      console.error('Booking error:', error);
      setBookingError(error.response?.data?.message || 'Failed to create booking. Please try again.');
      setBookingStatus('idle');
    }
  };

  const closeBookingModal = () => {
    setBookingModal({ isOpen: false, hotel: null });
    setBookingStatus('idle');
    setBookingError('');
  };

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-brand-ink dark:text-white sm:text-5xl">
            Find Your Perfect Stay
          </h1>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
            Discover and book premium hotels near your favorite tourist destinations.
          </p>
          {hotelFetchError && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm text-amber-700 dark:border-amber-700/40 dark:bg-amber-950/60 dark:text-amber-200">
              {hotelFetchError}
            </div>
          )}

          <div className="mx-auto mt-8 max-w-2xl">
            <div className="relative flex items-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-soft transition-shadow focus-within:border-brand-accent focus-within:ring-4 focus-within:ring-brand-accent/20 dark:border-slate-800 dark:bg-slate-900">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city, landmark, or hotel name..."
                className="w-full bg-transparent py-4 pl-12 pr-4 text-brand-ink placeholder:text-slate-400 focus:outline-none dark:text-white"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {topCities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSearchQuery(city)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  searchQuery.toLowerCase() === city.toLowerCase()
                    ? 'border-brand-accent bg-brand-accent text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-brand-accent/60 hover:text-brand-accent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                {city}
              </button>
            ))}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {filteredHotels.length > 0 ? (
              filteredHotels.map((hotel) => (
                <motion.article
                  key={hotel._id || hotel.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 12 }}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex flex-col overflow-hidden rounded-[22px] border border-slate-200/60 bg-white shadow-soft transition-shadow hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={hotel.imageUrl}
                      alt={hotel.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-300/0 via-sky-300/10 to-amber-200/0 opacity-0 transition duration-500 group-hover:opacity-100" />
                    <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-sm font-semibold text-brand-ink backdrop-blur-sm dark:bg-slate-900/90 dark:text-white">
                      ₹{hotel.price.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500">/night</span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold text-brand-ink dark:text-white line-clamp-1">
                        {hotel.name}
                      </h3>
                      <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{hotel.rating}</span>
                      </div>
                    </div>

                    <div className="mb-4 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="line-clamp-1">{hotel.location}, {getHotelCity(hotel)}</span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
                      <button
                        onClick={() => handleBookClick(hotel)}
                        className="w-full rounded-xl bg-brand-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-accent/90 focus:outline-none focus:ring-4 focus:ring-brand-accent/20"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <Hotel className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
                <h3 className="mt-4 text-lg font-semibold text-brand-ink dark:text-white">No hotels found</h3>
                <p className="mt-2 text-slate-500">Try adjusting your search to find what you're looking for.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Booking Modal */}
        <AnimatePresence>
          {bookingModal.isOpen && bookingModal.hotel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeBookingModal}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 24, filter: 'blur(4px)' }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.94, y: 16, filter: 'blur(4px)' }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-800"
              >
                {bookingStatus === 'success' ? (
                  <div className="p-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                    >
                      <CheckCircle2 className="h-8 w-8" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-brand-ink dark:text-white">Booking Confirmed!</h3>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                      You are all set for your stay at <strong>{bookingModal.hotel.name}</strong> in {bookingModal.hotel.city}.
                    </p>
                    <button
                      onClick={closeBookingModal}
                      className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative h-40">
                      <img
                        src={bookingModal.hotel.imageUrl}
                        alt={bookingModal.hotel.name}
                        className="h-full w-full object-cover"
                      />
                      <button
                        onClick={closeBookingModal}
                        className="absolute right-3 top-3 rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition hover:bg-black/40"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-brand-ink dark:text-white">Book Your Stay</h3>
                      
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                              Check-in Date
                            </label>
                            <input
                              type="date"
                              value={bookingForm.checkInDate}
                              onChange={(e) => setBookingForm(prev => ({ ...prev, checkInDate: e.target.value }))}
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                              Check-out Date
                            </label>
                            <input
                              type="date"
                              value={bookingForm.checkOutDate}
                              onChange={(e) => setBookingForm(prev => ({ ...prev, checkOutDate: e.target.value }))}
                              min={bookingForm.checkInDate || new Date().toISOString().split('T')[0]}
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Number of Guests
                          </label>
                          <select
                            value={bookingForm.guests}
                            onChange={(e) => setBookingForm(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          >
                            {[1, 2, 3, 4, 5, 6].map(num => (
                              <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 dark:text-slate-400">Hotel</span>
                          <span className="font-medium text-brand-ink dark:text-white">{bookingModal.hotel.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 dark:text-slate-400">Location</span>
                          <span className="font-medium text-brand-ink dark:text-white">{bookingModal.hotel.city}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 dark:text-slate-400">Price per night</span>
                          <span className="font-medium text-brand-ink dark:text-white">₹{bookingModal.hotel.price.toLocaleString('en-IN')}</span>
                        </div>
                        {bookingForm.checkInDate && bookingForm.checkOutDate && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500 dark:text-slate-400">Nights</span>
                              <span className="font-medium text-brand-ink dark:text-white">
                                {Math.ceil((new Date(bookingForm.checkOutDate) - new Date(bookingForm.checkInDate)) / (1000 * 60 * 60 * 24))}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm font-semibold">
                              <span className="text-slate-700 dark:text-slate-300">Total Price</span>
                              <span className="text-brand-ink dark:text-white">
                                ₹{(bookingModal.hotel.price * Math.ceil((new Date(bookingForm.checkOutDate) - new Date(bookingForm.checkInDate)) / (1000 * 60 * 60 * 24))).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {bookingError && (
                        <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          {bookingError}
                        </div>
                      )}
                      
                      <button
                        onClick={confirmBooking}
                        disabled={bookingStatus === 'processing'}
                        className="mt-6 flex w-full items-center justify-center rounded-xl bg-brand-accent px-4 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-accent/90 focus:outline-none disabled:opacity-70"
                      >
                        {bookingStatus === 'processing' ? 'Processing...' : 'Confirm Reservation'}
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>
    </PageTransition>
  );
}
