const fs = require('fs');

const wikiImages = {
  "Mumbai": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Mumbai_skyline_B%2BW.jpeg/1280px-Mumbai_skyline_B%2BW.jpeg",
  "Gateway_of_India": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Gateway_of_India_2023.jpg/1280px-Gateway_of_India_2023.jpg",
  "Delhi": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/India_Gate_in_New_Delhi_03-2016.jpg/1280px-India_Gate_in_New_Delhi_03-2016.jpg",
  "Red_Fort": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Red_Fort_in_Delhi_03-2016.jpg/1280px-Red_Fort_in_Delhi_03-2016.jpg",
  "Kolkata": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Kolkata_skyline.jpg/1280px-Kolkata_skyline.jpg",
  "Chennai": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Chennai_Central.jpg/1280px-Chennai_Central.jpg",
  "Marina_Beach": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Marina_Beach%2C_Chennai_%282006%29.jpg/1280px-Marina_Beach%2C_Chennai_%282006%29.jpg",
  "Bengaluru": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Vidhana_Soudha%2C_Bangalore%2C_India.jpg/1280px-Vidhana_Soudha%2C_Bangalore%2C_India.jpg",
  "Cubbon_Park": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Cubbon_Park_Avenue.jpg/1280px-Cubbon_Park_Avenue.jpg",
  "Hyderabad": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Hyderabad_cityscape.jpg/1280px-Hyderabad_cityscape.jpg",
  "Charminar": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Charminar_-_Hyderabad.jpg/1280px-Charminar_-_Hyderabad.jpg",
  "Golconda_Fort": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Golconda_Fort_Main_Entrance.jpg/1280px-Golconda_Fort_Main_Entrance.jpg",
  "Ramoji_Film_City": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Ramoji_Film_City_entrance.jpg/1280px-Ramoji_Film_City_entrance.jpg",
  "Jaipur": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_cropped.jpg/1280px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_cropped.jpg",
  "Hawa_Mahal": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_cropped.jpg/1280px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_cropped.jpg",
  "Agra": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Taj_Mahal%2C_Agra%2C_India_edit3.jpg/1280px-Taj_Mahal%2C_Agra%2C_India_edit3.jpg",
  "Taj_Mahal": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Taj_Mahal%2C_Agra%2C_India_edit3.jpg/1280px-Taj_Mahal%2C_Agra%2C_India_edit3.jpg",
  "Pune": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Pune_skyline.jpg/1280px-Pune_skyline.jpg",
  "Shaniwar_Wada": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Shaniwar_Wada_Main_Gate.jpg/1280px-Shaniwar_Wada_Main_Gate.jpg",
  "Amritsar": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Golden_Temple_India.jpg/1280px-Golden_Temple_India.jpg",
  "Golden_Temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Golden_Temple_India.jpg/1280px-Golden_Temple_India.jpg",
  "Varanasi": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Ghats_of_Varanasi_%282022%29.jpg/1280px-Ghats_of_Varanasi_%282022%29.jpg",
  "Dashashwamedh_Ghat": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Dashashwamedh_Ghat_Varanasi.jpg/1280px-Dashashwamedh_Ghat_Varanasi.jpg",
  "Udaipur": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Evening_view%2C_City_Palace%2C_Udaipur.jpg/1280px-Evening_view%2C_City_Palace%2C_Udaipur.jpg",
  "City_Palace,_Udaipur": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Udaipur_City_Palace.jpg/1280px-Udaipur_City_Palace.jpg",
  "Hampi": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Wide_angle_of_Galigopuram_of_Virupaksha_Temple%2C_Hampi_%2804%29_%28cropped%29.jpg/1280px-Wide_angle_of_Galigopuram_of_Virupaksha_Temple%2C_Hampi_%2804%29_%28cropped%29.jpg",
  "Rishikesh": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Trayambakeshwar_Temple_VK.jpg/1280px-Trayambakeshwar_Temple_VK.jpg",
  "Lakshman_Jhula": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Rishikesh-Lakshman_Jhula_by_Kaustubh_Nayyar.jpg/1280px-Rishikesh-Lakshman_Jhula_by_Kaustubh_Nayyar.jpg",
  
  // Hand-picked fallbacks for the missing ones:
  "Victoria_Memorial": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Victoria_Memorial_Front_View.jpg/1280px-Victoria_Memorial_Front_View.jpg",
  "Bangalore_Palace": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Bangalore_Palace_-_Front_view.jpg/1280px-Bangalore_Palace_-_Front_view.jpg",
  "Lalbagh": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Glasshouse_at_Lalbagh.jpg/1280px-Glasshouse_at_Lalbagh.jpg"
};

// Map seed names to Wiki keys
const imgMap = {
  // Cities
  'Mumbai': wikiImages['Mumbai'],
  'Delhi': wikiImages['Delhi'],
  'Kolkata': wikiImages['Kolkata'],
  'Chennai': wikiImages['Chennai'],
  'Bengaluru': wikiImages['Bengaluru'],
  'Hyderabad': wikiImages['Hyderabad'],
  'Jaipur': wikiImages['Jaipur'],
  'Agra': wikiImages['Agra'],
  'Pune': wikiImages['Pune'],
  'Amritsar': wikiImages['Amritsar'],
  'Varanasi': wikiImages['Varanasi'],
  'Udaipur': wikiImages['Udaipur'],
  'Hampi': wikiImages['Hampi'],
  'Rishikesh': wikiImages['Rishikesh'],
  
  // Attractions
  'Gateway of India': wikiImages['Gateway_of_India'],
  'Red Fort': wikiImages['Red_Fort'],
  'Taj Mahal': wikiImages['Taj_Mahal'],
  'Hawa Mahal': wikiImages['Hawa_Mahal'],
  'Golden Temple': wikiImages['Golden_Temple'],
  'Victoria Memorial': wikiImages['Victoria_Memorial'],
  'Dashashwamedh Ghat': wikiImages['Dashashwamedh_Ghat'],
  'Marina Beach': wikiImages['Marina_Beach'],
  'Shaniwar Wada': wikiImages['Shaniwar_Wada'],
  'City Palace': wikiImages['City_Palace,_Udaipur'],
  'Laxman Jhula': wikiImages['Lakshman_Jhula'],
  'Bangalore Palace': wikiImages['Bangalore_Palace'],
  'Lalbagh Botanical Garden': wikiImages['Lalbagh'],
  'Cubbon Park': wikiImages['Cubbon_Park'],
  'Charminar': wikiImages['Charminar'],
  'Golconda Fort': wikiImages['Golconda_Fort'],
  'Ramoji Film City': wikiImages['Ramoji_Film_City']
};

let seedJs = fs.readFileSync('seed.js', 'utf8');

// The tricky part is updating imageUrl in cities and attractions arrays.
// The easiest way is to use regex or string replace.
// But since the names are unique strings in the file, we can just replace the imageUrl strings.

// Let's do a simple regex replacement for the lines.
const newLines = seedJs.split('\n').map(line => {
  if (line.includes('cityName: ') || line.includes('name: ')) {
    // Find the name
    let nameMatch;
    if (line.includes('name: ')) {
      nameMatch = line.match(/name:\s*'([^']+)'/);
    } else {
      nameMatch = line.match(/cityName:\s*'([^']+)'/);
    }
    
    if (nameMatch) {
      const name = nameMatch[1];
      const url = imgMap[name];
      if (url) {
        if (line.includes('imageUrl: ')) {
          line = line.replace(/imageUrl:\s*'[^']+'/, `imageUrl: '${url}'`);
        } else {
          // If no imageUrl exists, add it before the closing brace
          line = line.replace(/}\s*,?$/, `, imageUrl: '${url}' }`);
          if (line.endsWith('}')) line += ','; // restore comma if needed
        }
      }
    }
  }
  return line;
});

// Fix some comma issues if they occurred
let finalCode = newLines.join('\n');
finalCode = finalCode.replace(/} ,,/g, '},');
finalCode = finalCode.replace(/} ,/g, '},');

fs.writeFileSync('seed.js', finalCode);
console.log('Successfully updated seed.js with real images.');
