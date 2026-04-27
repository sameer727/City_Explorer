const cityImages = [
  'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1473220464501-c8fc479c45bf?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80'
];

const attractionImages = [
  'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80'
];

const getIndex = (str, arrayLength) => {
  if (!str) return 0;
  const sum = [...str].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return sum % arrayLength;
};

export const cityImage = (cityName) => cityImages[getIndex(cityName, cityImages.length)];

export const attractionImage = (attractionName) => attractionImages[getIndex(attractionName, attractionImages.length)];

export const pseudoRating = (seed = '') => {
  const total = [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (3.5 + (total % 15) / 10).toFixed(1);
};

export const countries = [
  'All',
  'India',
  'United States',
  'France',
  'Japan',
  'Italy',
  'Australia',
  'United Kingdom'
];

export const categories = ['All', 'Nature', 'Historical', 'Museum', 'Adventure', 'Food', 'Culture'];
