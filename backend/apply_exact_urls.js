const fs = require('fs');

const finalImages = {
  "Mumbai": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Mumbai_Bandra-Worli_Sea_Link.jpg/1280px-Mumbai_Bandra-Worli_Sea_Link.jpg",
  "Gateway of India": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Mumbai_03-2016_30_Gateway_of_India.jpg/1280px-Mumbai_03-2016_30_Gateway_of_India.jpg",
  "Delhi": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Jama_Masjid_2011.jpg/1280px-Jama_Masjid_2011.jpg",
  "Red Fort": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Delhi_fort.jpg/1280px-Delhi_fort.jpg",
  "Kolkata": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Kolkata_maidan.jpg/1280px-Kolkata_maidan.jpg",
  "Chennai": "https://upload.wikimedia.org/wikipedia/commons/3/32/Chennai_Central.jpg",
  "Marina Beach": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Chennai_-_bird%27s-eye_view.jpg/1280px-Chennai_-_bird%27s-eye_view.jpg",
  "Bengaluru": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/View_from_Visvesvaraya_Industrial_and_Technological_Museum_%282025%29_02.jpg/1280px-View_from_Visvesvaraya_Industrial_and_Technological_Museum_%282025%29_02.jpg",
  "Cubbon Park": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Cubbon_Park_W.jpg/1280px-Cubbon_Park_W.jpg",
  "Hyderabad": "https://upload.wikimedia.org/wikipedia/commons/8/88/Downtown_hyderabad_drone.png",
  "Charminar": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Charminar_Hyderabad_1.jpg/1280px-Charminar_Hyderabad_1.jpg",
  "Ramoji Film City": "https://upload.wikimedia.org/wikipedia/commons/d/d1/Ramoji_Film_City.jpg",
  "Jaipur": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/1280px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg",
  "Hawa Mahal": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/1280px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg",
  "Agra": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Taj_Mahal%2C_Agra%2C_India.jpg/1280px-Taj_Mahal%2C_Agra%2C_India.jpg",
  "Taj Mahal": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1280px-Taj_Mahal_%28Edited%29.jpeg",
  "Pune": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Pune_West_skyline_-_March_2017.jpg/1280px-Pune_West_skyline_-_March_2017.jpg",
  "Shaniwar Wada": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Front_view_of_Shaniwar_Wada_illuminated.jpg/1280px-Front_view_of_Shaniwar_Wada_illuminated.jpg",
  "Amritsar": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Golden_Temple_Amritsar_Gurudwara_%28cropped%29.jpg/1280px-Golden_Temple_Amritsar_Gurudwara_%28cropped%29.jpg",
  "Golden Temple": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/The_Golden_Temple_of_Amrithsar_7.jpg/1280px-The_Golden_Temple_of_Amrithsar_7.jpg",
  "Varanasi": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Varanasi%2C_India%2C_Ghats%2C_Cremation_ceremony_in_progress.jpg/1280px-Varanasi%2C_India%2C_Ghats%2C_Cremation_ceremony_in_progress.jpg",
  "Dashashwamedh Ghat": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Dasaswamedh_ghat-varanasi_india-andres_larin.jpg/1280px-Dasaswamedh_ghat-varanasi_india-andres_larin.jpg",
  "Udaipur": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Evening_view%2C_City_Palace%2C_Udaipur.jpg/1280px-Evening_view%2C_City_Palace%2C_Udaipur.jpg",
  "City Palace": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Udaipur_City_Palace.jpg/1280px-Udaipur_City_Palace.jpg",
  "Hampi": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Wide_angle_of_Galigopuram_of_Virupaksha_Temple%2C_Hampi_%2804%29_%28cropped%29.jpg/1280px-Wide_angle_of_Galigopuram_of_Virupaksha_Temple%2C_Hampi_%2804%29_%28cropped%29.jpg",
  "Rishikesh": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Trayambakeshwar_Temple_VK.jpg/1280px-Trayambakeshwar_Temple_VK.jpg",
  "Laxman Jhula": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Rishikesh-Lakshman_Jhula_by_Kaustubh_Nayyar.jpg/1280px-Rishikesh-Lakshman_Jhula_by_Kaustubh_Nayyar.jpg",
  
  // Handpicked ones for the missing 4
  "Victoria Memorial": "https://images.unsplash.com/photo-1558431382-27e303142255?w=1000&q=80",
  "Bangalore Palace": "https://images.unsplash.com/photo-1596422846543-74c6f2f9c8d5?w=1000&q=80",
  "Lalbagh Botanical Garden": "https://images.unsplash.com/photo-1596422846543-74c6f2f9c8d5?w=1000&q=80",
  "Golconda Fort": "https://images.unsplash.com/photo-1622359416049-35c9d1df4c49?w=1000&q=80"
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
      const url = finalImages[name];
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
console.log('Successfully updated seed.js with exactly matched Wikimedia URLs.');
