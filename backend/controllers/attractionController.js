const Attraction = require('../models/Attraction');
const Review = require('../models/Review');
const User = require('../models/User');

const GOOGLE_TEXT_SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
const GOOGLE_PLACE_DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json';

const toGoogleReview = (review, attractionId) => ({
  _id: `google-${attractionId}-${review.time || Date.now()}-${review.author_name || 'guest'}`,
  user: {
    name: review.author_name || 'Google User'
  },
  rating: Number(review.rating) || 0,
  comment: review.text || '',
  source: 'google',
  createdAt: review.time ? new Date(review.time * 1000) : new Date(),
  googleAuthorUrl: review.author_url || null,
  relativeTimeDescription: review.relative_time_description || null
});

const fetchGoogleReviewsForAttraction = async (attraction) => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey || !attraction?.name || !attraction?.cityName) {
    return [];
  }

  const query = encodeURIComponent(`${attraction.name}, ${attraction.cityName}`);
  const textSearchResponse = await fetch(`${GOOGLE_TEXT_SEARCH_URL}?query=${query}&key=${apiKey}`);

  if (!textSearchResponse.ok) {
    throw new Error(`Google text search failed with status ${textSearchResponse.status}`);
  }

  const textSearchData = await textSearchResponse.json();
  const placeId = textSearchData?.results?.[0]?.place_id;

  if (!placeId) {
    return [];
  }

  const detailsResponse = await fetch(
    `${GOOGLE_PLACE_DETAILS_URL}?place_id=${placeId}&fields=reviews&reviews_sort=newest&key=${apiKey}`
  );

  if (!detailsResponse.ok) {
    throw new Error(`Google place details failed with status ${detailsResponse.status}`);
  }

  const detailsData = await detailsResponse.json();
  const googleReviews = detailsData?.result?.reviews || [];

  return googleReviews.map((review) => toGoogleReview(review, attraction._id.toString()));
};

const getAttractions = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { cityName: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    const attractions = await Attraction.find(query);
    res.json(attractions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { attractionId, rating, comment } = req.body;
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    const review = new Review({
      user: req.user.id,
      attraction: attractionId,
      rating,
      comment,
      imageUrl
    });
    await review.save();
    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const { attractionId } = req.params;
    const [dbReviews, attraction] = await Promise.all([
      Review.find({ attraction: attractionId }).populate('user', 'name').sort({ createdAt: -1 }),
      Attraction.findById(attractionId)
    ]);

    if (!attraction) {
      return res.status(404).json({ message: 'Attraction not found' });
    }

    let googleReviews = [];
    try {
      googleReviews = await fetchGoogleReviewsForAttraction(attraction);
    } catch (googleError) {
      // Do not fail the whole endpoint when Google API is unavailable.
      console.error('Google reviews fetch failed:', googleError.message);
    }

    const localReviews = dbReviews.map((review) => ({
      ...review.toObject(),
      source: 'local'
    }));

    const combinedReviews = [...googleReviews, ...localReviews].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(combinedReviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addToFavorites = async (req, res) => {
  try {
    const { attractionId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user.favorites.includes(attractionId)) {
      user.favorites.push(attractionId);
      await user.save();
    }
    res.json({ message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const removeFromFavorites = async (req, res) => {
  try {
    const { attractionId } = req.params;
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(id => id.toString() !== attractionId);
    await user.save();
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAttractions, addReview, getReviews, addToFavorites, getFavorites, removeFromFavorites };
