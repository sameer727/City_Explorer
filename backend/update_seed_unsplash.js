const fs = require('fs');

const uImages = {
  // Cities
  "Mumbai": "https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?w=1000&q=80",
  "Delhi": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1000&q=80",
  "Kolkata": "https://images.unsplash.com/photo-1558431382-27e303142255?w=1000&q=80",
  "Chennai": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&q=80",
  "Bengaluru": "https://images.unsplash.com/photo-1596422846543-74c6f2f9c8d5?w=1000&q=80",
  "Hyderabad": "https://images.unsplash.com/photo-1622359416049-35c9d1df4c49?w=1000&q=80",
  "Jaipur": "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=1000&q=80",
  "Agra": "https://images.unsplash.com/photo-1548013146-72479768bada?w=1000&q=80",
  "Pune": "https://images.unsplash.com/photo-1574883445831-2fb185672ab6?w=1000&q=80",
  "Amritsar": "https://images.unsplash.com/photo-1603513364491-11d23b320d32?w=1000&q=80",
  "Varanasi": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&q=80",
  "Udaipur": "https://images.unsplash.com/photo-1615861113063-2f085d778d94?w=1000&q=80",
  "Hampi": "https://images.unsplash.com/photo-1620766165457-a80fe59217ca?w=1000&q=80",
  "Rishikesh": "https://images.unsplash.com/photo-1600010996884-1db0969da89f?w=1000&q=80",
  
  // Attractions
  "Gateway of India": "https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?w=1000&q=80",
  "Red Fort": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1000&q=80",
  "Taj Mahal": "https://images.unsplash.com/photo-1548013146-72479768bada?w=1000&q=80",
  "Hawa Mahal": "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=1000&q=80",
  "Golden Temple": "https://images.unsplash.com/photo-1603513364491-11d23b320d32?w=1000&q=80",
  "Victoria Memorial": "https://images.unsplash.com/photo-1558431382-27e303142255?w=1000&q=80",
  "Dashashwamedh Ghat": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&q=80",
  "Marina Beach": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000&q=80",
  "Shaniwar Wada": "https://images.unsplash.com/photo-1574883445831-2fb185672ab6?w=1000&q=80",
  "City Palace": "https://images.unsplash.com/photo-1615861113063-2f085d778d94?w=1000&q=80",
  "Laxman Jhula": "https://images.unsplash.com/photo-1600010996884-1db0969da89f?w=1000&q=80",
  "Bangalore Palace": "https://images.unsplash.com/photo-1596422846543-74c6f2f9c8d5?w=1000&q=80",
  "Lalbagh Botanical Garden": "https://images.unsplash.com/photo-1596422846543-74c6f2f9c8d5?w=1000&q=80",
  "Cubbon Park": "https://images.unsplash.com/photo-1596422846543-74c6f2f9c8d5?w=1000&q=80",
  "Charminar": "https://images.unsplash.com/photo-1622359416049-35c9d1df4c49?w=1000&q=80",
  "Golconda Fort": "https://images.unsplash.com/photo-1622359416049-35c9d1df4c49?w=1000&q=80",
  "Ramoji Film City": "https://images.unsplash.com/photo-1622359416049-35c9d1df4c49?w=1000&q=80"
};

let seedJs = fs.readFileSync('seed.js', 'utf8');

const newLines = seedJs.split('\n').map(line => {
  if (line.includes('cityName: ') || line.includes('name: ')) {
    let nameMatch;
    if (line.includes('name: ')) {
      nameMatch = line.match(/name:\s*'([^']+)'/);
    } else {
      nameMatch = line.match(/cityName:\s*'([^']+)'/);
    }
    
    if (nameMatch) {
      const name = nameMatch[1];
      const url = uImages[name];
      if (url) {
        if (line.includes('imageUrl: ')) {
          line = line.replace(/imageUrl:\s*'[^']+'/, `imageUrl: '${url}'`);
        } else {
          line = line.replace(/}\s*,?$/, `, imageUrl: '${url}' }`);
          if (line.endsWith('}')) line += ',';
        }
      }
    }
  }
  return line;
});

let finalCode = newLines.join('\n');
finalCode = finalCode.replace(/} ,,/g, '},');
finalCode = finalCode.replace(/} ,/g, '},');

fs.writeFileSync('seed.js', finalCode);
console.log('Successfully updated seed.js with real Unsplash images.');
