import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image, MapPin, IndianRupee, Star, AlertCircle, CheckCircle } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { hotelApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    cityName: '',
    location: '',
    description: '',
    price: '',
    rating: '',
    rooms: '',
    capacity: '',
    category: 'Standard',
    amenities: '',
    contact: '',
    images: []
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    fetchHotels();
  }, [isAdmin, navigate]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const { data } = await hotelApi.list();
      setHotels(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch hotels');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: files
      }));
      
      const newPreviews = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result);
          if (newPreviews.length === files.length) {
            setImagePreviews(newPreviews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');

      const submitFormData = new FormData();
      submitFormData.append('name', formData.name);
      submitFormData.append('cityName', formData.cityName);
      submitFormData.append('location', formData.location);
      submitFormData.append('description', formData.description);
      submitFormData.append('price', formData.price);
      submitFormData.append('rating', formData.rating);
      submitFormData.append('rooms', formData.rooms);
      submitFormData.append('capacity', formData.capacity);
      submitFormData.append('category', formData.category);
      
      if (formData.amenities) {
        submitFormData.append('amenities', JSON.stringify(formData.amenities.split(',').map(a => a.trim())));
      }
      
      if (formData.contact) {
        submitFormData.append('contact', JSON.stringify(formData.contact));
      }

      if (formData.images && formData.images.length > 0) {
        formData.images.forEach(image => {
          submitFormData.append('images', image);
        });
      }

      if (editingId) {
        await hotelApi.update(editingId, submitFormData);
        setSuccess('Hotel updated successfully!');
      } else {
        await hotelApi.create(submitFormData);
        setSuccess('Hotel created successfully!');
      }

      resetForm();
      fetchHotels();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save hotel');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      cityName: '',
      location: '',
      description: '',
      price: '',
      rating: '',
      rooms: '',
      capacity: '',
      category: 'Standard',
      amenities: '',
      contact: ''
    });
    setImagePreviews([]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (hotel) => {
    setFormData({
      name: hotel.name,
      cityName: hotel.cityName,
      location: hotel.location,
      description: hotel.description,
      price: hotel.price,
      rating: hotel.rating,
      rooms: hotel.rooms,
      capacity: hotel.capacity,
      category: hotel.category,
      amenities: hotel.amenities ? hotel.amenities.join(', ') : '',
      contact: hotel.contact ? JSON.stringify(hotel.contact) : ''
    });
    setImagePreviews(hotel.images || [hotel.imageUrl]);
    setEditingId(hotel._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        await hotelApi.delete(id);
        setSuccess('Hotel deleted successfully!');
        fetchHotels();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete hotel');
        console.error(err);
      }
    }
  };

  if (!isAdmin) return null;

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-brand-ink dark:text-white">Hotel Management</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Add, edit, and manage hotels</p>
          </div>
          <button
            onClick={() => {
              if (showForm) resetForm();
              else setShowForm(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-brand-accent px-4 py-2 text-white transition hover:bg-brand-accent/90"
          >
            <Plus className="h-5 w-5" />
            {showForm ? 'Cancel' : 'Add Hotel'}
          </button>
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

        {/* Form */}
        {showForm && (
          <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Hotel Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
                <input
                  type="text"
                  name="cityName"
                  placeholder="City Name"
                  value={formData.cityName}
                  onChange={handleInputChange}
                  required
                  className="rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location/Address"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price per night"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
                <input
                  type="number"
                  name="rating"
                  placeholder="Rating (0-5)"
                  value={formData.rating}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="5"
                  step="0.1"
                  className="rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Budget">Budget</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>

              {/* Rooms & Capacity */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-500 ml-1">Number of Rooms</label>
                  <input
                    type="number"
                    name="rooms"
                    placeholder="e.g. 50"
                    value={formData.rooms}
                    onChange={handleInputChange}
                    min="0"
                    className="rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-500 ml-1">Total Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    placeholder="e.g. 100"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    min="0"
                    className="rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Description */}
              <textarea
                name="description"
                placeholder="Hotel Description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />

              {/* Amenities */}
              <input
                type="text"
                name="amenities"
                placeholder="Amenities (comma-separated: WiFi, Pool, Gym, etc.)"
                value={formData.amenities}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <Image className="h-4 w-4" />
                  Hotel Images (Select up to 5)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
                {imagePreviews.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {imagePreviews.map((preview, idx) => (
                      <img 
                        key={idx} 
                        src={preview?.startsWith('http') || preview?.startsWith('data:') ? preview : `http://localhost:5000${preview}`} 
                        alt={`Preview ${idx}`} 
                        className="h-20 w-20 rounded-lg object-cover border border-slate-200 dark:border-slate-700" 
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Contact */}
              <input
                type="text"
                name="contact"
                placeholder="Contact info (optional, e.g. {&quot;phone&quot;:&quot;123456&quot;,&quot;email&quot;:&quot;hotel@email.com&quot;})"
                value={formData.contact}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-lg bg-brand-accent py-2 text-white transition hover:bg-brand-accent/90"
              >
                {editingId ? 'Update Hotel' : 'Create Hotel'}
              </button>
            </form>
          </div>
        )}

        {/* Hotels List */}
        {loading ? (
          <div className="text-center text-slate-500">Loading hotels...</div>
        ) : hotels.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
            <p className="text-slate-600 dark:text-slate-400">No hotels found. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hotels.map(hotel => (
              <div
                key={hotel._id}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                  <img
                    src={hotel.imageUrl?.startsWith('http') ? hotel.imageUrl : `http://localhost:5000${hotel.imageUrl}`}
                    alt={hotel.name}
                    className="h-48 w-full object-cover"
                  />
                <div className="p-4">
                  <h3 className="font-semibold text-brand-ink dark:text-white">{hotel.name}</h3>
                  
                  <div className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {hotel.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4" />
                      ₹{hotel.price}/night
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      {hotel.rating}/5
                    </div>
                  </div>

                  {hotel.category && (
                    <div className="mt-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {hotel.category}
                    </div>
                  )}

                  {hotel.rooms > 0 && (
                    <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {hotel.rooms} rooms • {hotel.capacity} capacity
                    </div>
                  )}

                  {hotel.amenities && hotel.amenities.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {hotel.amenities.slice(0, 2).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                        >
                          {amenity}
                        </span>
                      ))}
                      {hotel.amenities.length > 2 && (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                          +{hotel.amenities.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {hotel.description && (
                    <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                      {hotel.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(hotel)}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-blue-50 py-2 text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(hotel._id)}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-red-50 py-2 text-red-600 transition hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
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
