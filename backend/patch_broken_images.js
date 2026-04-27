const fs = require('fs');

const overrides = {
  "Bengaluru": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Vidhana_Soudha%2C_Bangalore%2C_India.jpg/1280px-Vidhana_Soudha%2C_Bangalore%2C_India.jpg",
  "Bangalore Palace": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Bangalore_Palace_-_Front_view.jpg/1280px-Bangalore_Palace_-_Front_view.jpg",
  "Lalbagh Botanical Garden": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Glasshouse_at_Lalbagh.jpg/1280px-Glasshouse_at_Lalbagh.jpg",
  "Cubbon Park": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Cubbon_Park_Avenue.jpg/1280px-Cubbon_Park_Avenue.jpg",
  
  "Hyderabad": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Hyderabad_cityscape.jpg/1280px-Hyderabad_cityscape.jpg",
  "Charminar": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Charminar_-_Hyderabad.jpg/1280px-Charminar_-_Hyderabad.jpg",
  "Golconda Fort": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Golconda_Fort_Main_Entrance.jpg/1280px-Golconda_Fort_Main_Entrance.jpg",
  "Ramoji Film City": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Ramoji_Film_City_entrance.jpg/1280px-Ramoji_Film_City_entrance.jpg",
  
  "Hampi": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Wide_angle_of_Galigopuram_of_Virupaksha_Temple%2C_Hampi_%2804%29_%28cropped%29.jpg/1280px-Wide_angle_of_Galigopuram_of_Virupaksha_Temple%2C_Hampi_%2804%29_%28cropped%29.jpg",
  
  "Rishikesh": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Trayambakeshwar_Temple_VK.jpg/1280px-Trayambakeshwar_Temple_VK.jpg",
  "Laxman Jhula": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Rishikesh-Lakshman_Jhula_by_Kaustubh_Nayyar.jpg/1280px-Rishikesh-Lakshman_Jhula_by_Kaustubh_Nayyar.jpg"
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
      const url = overrides[name];
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
console.log('Successfully patched broken images in seed.js');
