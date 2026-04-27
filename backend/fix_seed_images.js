const fs = require('fs');

const queries = [
  'Mumbai', 'Gateway_of_India',
  'Delhi', 'Red_Fort',
  'Kolkata', 'Victoria_Memorial_(India)',
  'Chennai', 'Marina_Beach',
  'Bengaluru', 'Bangalore_Palace', 'Lalbagh_Botanical_Garden', 'Cubbon_Park',
  'Hyderabad', 'Charminar', 'Golconda_Fort', 'Ramoji_Film_City',
  'Jaipur', 'Hawa_Mahal',
  'Agra', 'Taj_Mahal',
  'Pune', 'Shaniwar_Wada',
  'Amritsar', 'Golden_Temple',
  'Varanasi', 'Dashashwamedh_Ghat',
  'Udaipur', 'City_Palace,_Udaipur',
  'Hampi', 
  'Rishikesh', 'Lakshman_Jhula'
];

async function fetchWikiImage(title) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=1000`;
    const res = await fetch(url);
    const data = await res.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pageId === '-1' || !pages[pageId].thumbnail) {
      console.log(`No image for ${title}`);
      return null;
    }
    return pages[pageId].thumbnail.source;
  } catch (err) {
    console.log(`Error for ${title}:`, err.message);
    return null;
  }
}

async function run() {
  const map = {};
  for (const q of queries) {
    const url = await fetchWikiImage(q);
    if (url) map[q] = url;
  }
  
  console.log(JSON.stringify(map, null, 2));
}

run();
