const mongoose = require('mongoose');
const dotenv = require('dotenv');
const City = require('./models/City');
const Attraction = require('./models/Attraction');
const Hotel = require('./models/Hotel');

dotenv.config();

const cities = [
  // Tier 1
  { cityName: 'Mumbai', country: 'India', description: 'The financial capital of India, known for its bustling life and coastal beauty.', tier: 'Tier 1', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Mumbai_Bandra-Worli_Sea_Link.jpg/1280px-Mumbai_Bandra-Worli_Sea_Link.jpg' },
  { cityName: 'Delhi', country: 'India', description: 'The capital city, rich in history and culture with ancient monuments.', tier: 'Tier 1', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Jama_Masjid_2011.jpg/1280px-Jama_Masjid_2011.jpg' },
  { cityName: 'Kolkata', country: 'India', description: 'The City of Joy, known for its colonial architecture and arts.', tier: 'Tier 1', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Kolkata_maidan.jpg/1280px-Kolkata_maidan.jpg' },
  { cityName: 'Chennai', country: 'India', description: 'The Gateway to South India, famous for its long sandy beaches and temples.', tier: 'Tier 1', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Chennai_Central.jpg' },
  { cityName: 'Bengaluru', country: 'India', description: 'The Silicon Valley of India, known for its pleasant weather and parks.', tier: 'Tier 1', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/View_from_Visvesvaraya_Industrial_and_Technological_Museum_%282025%29_02.jpg/1280px-View_from_Visvesvaraya_Industrial_and_Technological_Museum_%282025%29_02.jpg' },
  { cityName: 'Hyderabad', country: 'India', description: 'The City of Pearls, famous for its IT industry and historical monuments.', tier: 'Tier 1', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Downtown_hyderabad_drone.png' },
  
  // Tier 2
  { cityName: 'Jaipur', country: 'India', description: 'The Pink City, famous for its royal forts and palaces.', tier: 'Tier 2', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/1280px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg' },
  { cityName: 'Agra', country: 'India', description: 'Home to the iconic Taj Mahal and rich Mughal heritage.', tier: 'Tier 2', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Taj_Mahal%2C_Agra%2C_India.jpg/1280px-Taj_Mahal%2C_Agra%2C_India.jpg' },
  { cityName: 'Pune', country: 'India', description: 'The Oxford of the East, known for its historical monuments and vibrant youth culture.', tier: 'Tier 2', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Pune_West_skyline_-_March_2017.jpg/1280px-Pune_West_skyline_-_March_2017.jpg' },
  
  // Tier 3
  { cityName: 'Amritsar', country: 'India', description: 'Spiritual center for Sikhs, home to the Golden Temple.', tier: 'Tier 3', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Golden_Temple_Amritsar_Gurudwara_%28cropped%29.jpg/1280px-Golden_Temple_Amritsar_Gurudwara_%28cropped%29.jpg' },
  { cityName: 'Varanasi', country: 'India', description: 'One of the oldest living cities in the world, spiritual heart of India.', tier: 'Tier 3', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Varanasi%2C_India%2C_Ghats%2C_Cremation_ceremony_in_progress.jpg/1280px-Varanasi%2C_India%2C_Ghats%2C_Cremation_ceremony_in_progress.jpg' },
  { cityName: 'Udaipur', country: 'India', description: 'The City of Lakes, renowned for its stunning palaces and romantic vibe.', tier: 'Tier 3', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Evening_view%2C_City_Palace%2C_Udaipur.jpg/1280px-Evening_view%2C_City_Palace%2C_Udaipur.jpg' },
  
  // Tier 4
  { cityName: 'Hampi', country: 'India', description: 'UNESCO World Heritage site with ancient ruins of the Vijayanagara Empire.', tier: 'Tier 4', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Wide_angle_of_Galigopuram_of_Virupaksha_Temple%2C_Hampi_%2804%29_%28cropped%29.jpg/1280px-Wide_angle_of_Galigopuram_of_Virupaksha_Temple%2C_Hampi_%2804%29_%28cropped%29.jpg' },
  { cityName: 'Rishikesh', country: 'India', description: 'The Yoga Capital of the World, nestled in the foothills of the Himalayas along the Ganges.', tier: 'Tier 4', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Trayambakeshwar_Temple_VK.jpg/1280px-Trayambakeshwar_Temple_VK.jpg' },
  
  // Andhra Pradesh
  { cityName: 'Visakhapatnam', country: 'India', description: 'The Executive Capital of Andhra Pradesh, known for its beaches and landscape.', tier: 'Tier 2', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Visakhapatnam_Cityscape.jpg' },
  { cityName: 'Tirupati', country: 'India', description: 'A major pilgrimage city, home to the famous Tirumala Venkateswara Temple.', tier: 'Tier 3', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Tirumala_Venkateswara_Temple.jpg' },
  { cityName: 'Vijayawada', country: 'India', description: 'The business capital of Andhra Pradesh, situated on the banks of the Krishna River.', tier: 'Tier 2', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Prakasam_Barrage_at_Night.jpg' },
  { cityName: 'Goa', country: 'India', description: 'A coastal state city known for beaches, nightlife, and Portuguese heritage.', tier: 'Tier 2', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Anjuna_Beach%2C_Goa.jpg/1280px-Anjuna_Beach%2C_Goa.jpg' },
  { cityName: 'Ahmedabad', country: 'India', description: 'A cultural hub with vibrant bazaars, riverfront gardens and historic sites.', tier: 'Tier 2', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Sabarmati_Riverfront%2C_Ahmedabad.jpg/1280px-Sabarmati_Riverfront%2C_Ahmedabad.jpg' },
  { cityName: 'Lucknow', country: 'India', description: 'A city prized for its Nawabi heritage, cuisine, and architecture.', tier: 'Tier 2', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Lucknow_cityscape.jpg/1280px-Lucknow_cityscape.jpg' },
  { cityName: 'Mysore', country: 'India', description: 'Famous for its royal heritage, palaces, and sandalwood crafts.', tier: 'Tier 3', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Mysore_Palace_at_night.JPG/1280px-Mysore_Palace_at_night.JPG' },
  { cityName: 'Kochi', country: 'India', description: 'A port city in Kerala known for its historic architecture and backwaters.', tier: 'Tier 3', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FortKochi_Horizon.jpg/1280px-FortKochi_Horizon.jpg' },
  { cityName: 'Chandigarh', country: 'India', description: 'A planned city with modern architecture and scenic gardens.', tier: 'Tier 2', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Capitol_Complex_Chandigarh.jpg/1280px-Capitol_Complex_Chandigarh.jpg' },
  { cityName: 'Darjeeling', country: 'India', description: 'A hill station renowned for tea gardens and Himalayan panoramas.', tier: 'Tier 3', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Darjeeling_view.jpg/1280px-Darjeeling_view.jpg' },
  { cityName: 'Ooty', country: 'India', description: 'A scenic hill station in the Nilgiris, famous for its gardens and lakes.', tier: 'Tier 3', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Ooty_lake.jpg/1280px-Ooty_lake.jpg' }
];

const attractions = [
  { cityName: 'Mumbai', name: 'Gateway of India', description: 'Iconic arch monument built during the 20th century.', category: 'Historical', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Mumbai_03-2016_30_Gateway_of_India.jpg/1280px-Mumbai_03-2016_30_Gateway_of_India.jpg' },
  { cityName: 'Delhi', name: 'Red Fort', description: 'Historic fort that served as the main residence of Mughal Emperors.', category: 'Historical', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Delhi_fort.jpg/1280px-Delhi_fort.jpg' },
  { cityName: 'Agra', name: 'Taj Mahal', description: 'Ivory-white marble mausoleum on the southern bank of the river Yamuna.', category: 'Historical', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1280px-Taj_Mahal_%28Edited%29.jpeg' },
  { cityName: 'Jaipur', name: 'Hawa Mahal', description: 'Palace of Winds, known for its unique five-story exterior.', category: 'Historical', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/1280px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg' },
  { cityName: 'Amritsar', name: 'Golden Temple', description: 'The holiest Gurdwara of Sikhism.', category: 'Spiritual', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/The_Golden_Temple_of_Amrithsar_7.jpg/1280px-The_Golden_Temple_of_Amrithsar_7.jpg' },
  { cityName: 'Kolkata', name: 'Victoria Memorial', description: 'Large marble building dedicated to the memory of Queen Victoria.', category: 'Historical', imageUrl: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=1000&q=80' },
  { cityName: 'Varanasi', name: 'Dashashwamedh Ghat', description: 'Main ghat in Varanasi on the Ganges River.', category: 'Spiritual', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Dasaswamedh_ghat-varanasi_india-andres_larin.jpg/1280px-Dasaswamedh_ghat-varanasi_india-andres_larin.jpg' },
  { cityName: 'Chennai', name: 'Marina Beach', description: 'The longest natural urban beach in the country.', category: 'Nature', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Chennai_-_bird%27s-eye_view.jpg/1280px-Chennai_-_bird%27s-eye_view.jpg' },
  { cityName: 'Pune', name: 'Shaniwar Wada', description: 'Historical fortification built in 1732, the seat of the Peshwas of the Maratha Empire.', category: 'Historical', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Front_view_of_Shaniwar_Wada_illuminated.jpg/1280px-Front_view_of_Shaniwar_Wada_illuminated.jpg' },
  { cityName: 'Udaipur', name: 'City Palace', description: 'A massive palace complex situated on the banks of Lake Pichola.', category: 'Historical', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Udaipur_City_Palace.jpg/1280px-Udaipur_City_Palace.jpg' },
  { cityName: 'Rishikesh', name: 'Laxman Jhula', description: 'A famous suspension bridge across the river Ganges.', category: 'Adventure', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Rishikesh-Lakshman_Jhula_by_Kaustubh_Nayyar.jpg/1280px-Rishikesh-Lakshman_Jhula_by_Kaustubh_Nayyar.jpg' },
  { cityName: 'Bengaluru', name: 'Bangalore Palace', description: 'Tudor-style palace known for its stunning architecture and sprawling grounds.', category: 'Historical', imageUrl: '/images/places/bangalore_palace.png' },
  { cityName: 'Bengaluru', name: 'Lalbagh Botanical Garden', description: 'Historic botanical garden featuring the famous glass house and rare tropical plants.', category: 'Nature', imageUrl: '/images/places/lalbagh.png' },
  { cityName: 'Bengaluru', name: 'Cubbon Park', description: 'A landmark park offering a peaceful green escape in the heart of the city.', category: 'Nature', imageUrl: '/images/places/cubbon_park.png' },
  { cityName: 'Hyderabad', name: 'Charminar', description: 'Iconic monument and mosque known globally as a symbol of Hyderabad.', category: 'Historical' , imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Charminar_Hyderabad_1.jpg/1280px-Charminar_Hyderabad_1.jpg' },
  { cityName: 'Hyderabad', name: 'Golconda Fort', description: 'A massive citadel and ruined city built by the Qutb Shahi dynasty.', category: 'Historical' , imageUrl: '/images/places/hyderabad.png' },
  { cityName: 'Hyderabad', name: 'Ramoji Film City', description: 'The largest integrated film city in the world and a major tourism recreation center.', category: 'Culture' , imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Ramoji_Film_City.jpg' },

  { cityName: 'Goa', name: 'Baga Beach', description: 'One of Goa\'s most popular beaches, known for its nightlife and water sports.', category: 'Nature', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Baga_Beach%2C_Goa%2C_India.jpg/1280px-Baga_Beach%2C_Goa%2C_India.jpg' },
  { cityName: 'Goa', name: 'Basilica of Bom Jesus', description: 'A UNESCO World Heritage site famous for its baroque architecture.', category: 'Spiritual', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Basilica_of_Bom_Jesus.jpg/1280px-Basilica_of_Bom_Jesus.jpg' },
  { cityName: 'Goa', name: 'Dudhsagar Falls', description: 'A spectacular four-tiered waterfall on the Mandovi River.', category: 'Nature', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Dudhsagar_falls_6.jpg/1280px-Dudhsagar_falls_6.jpg' },
  { cityName: 'Ahmedabad', name: 'Sabarmati Ashram', description: 'Historic residence of Mahatma Gandhi and a powerful site of India\'s independence movement.', category: 'Historical', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Sabarmati_Ashram_Gandhi.jpg/1280px-Sabarmati_Ashram_Gandhi.jpg' },
  { cityName: 'Ahmedabad', name: 'Adalaj Stepwell', description: 'A beautiful stepwell known for its intricate carvings and architecture.', category: 'Historical', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Adalaj_stepwell_inside.jpg/1280px-Adalaj_stepwell_inside.jpg' },
  { cityName: 'Ahmedabad', name: 'Kankaria Lake', description: 'A scenic lake with a promenade, amusement park, and aquarium.', category: 'Nature', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Kankaria_Lake.jpg/1280px-Kankaria_Lake.jpg' },
  { cityName: 'Lucknow', name: 'Bara Imambara', description: 'A grand historical complex famous for its arched central hall.', category: 'Historical', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Bara_Imambara.jpg/1280px-Bara_Imambara.jpg' },
  { cityName: 'Lucknow', name: 'Rumi Darwaza', description: 'A monumental gateway symbolizing the city\'s heritage.', category: 'Historical', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Rumi_Darwaza_Lucknow.jpg/1280px-Rumi_Darwaza_Lucknow.jpg' },
  { cityName: 'Lucknow', name: 'Hazratganj', description: 'A bustling shopping district known for its colonial architecture and street food.', category: 'Cultural', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Hazratganj_Lucknow.jpg/1280px-Hazratganj_Lucknow.jpg' },
  { cityName: 'Mysore', name: 'Mysore Palace', description: 'A majestic royal palace with grand halls and glittering chandeliers.', category: 'Historical', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Mysore_Palace_at_night.jpg/1280px-Mysore_Palace_at_night.jpg' },
  { cityName: 'Mysore', name: 'Chamundi Hills', description: 'A hill shrine offering panoramic views of Mysore city.', category: 'Spiritual', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Chamundi_Hills.jpg/1280px-Chamundi_Hills.jpg' },
  { cityName: 'Mysore', name: 'Brindavan Gardens', description: 'Terraced gardens famous for their illuminated fountains and landscapes.', category: 'Nature', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Brindavan_Gardens.jpg/1280px-Brindavan_Gardens.jpg' },
  { cityName: 'Kochi', name: 'Fort Kochi', description: 'A charming seaside area with colonial architecture and cafes.', category: 'Historical', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Fort_Kochi_July_2018.jpg/1280px-Fort_Kochi_July_2018.jpg' },
  { cityName: 'Kochi', name: 'Mattancherry Palace', description: 'Also called the Dutch Palace, it houses historic murals and artifacts.', category: 'Historical', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Mattancherry_Palace.jpg/1280px-Mattancherry_Palace.jpg' },
  { cityName: 'Kochi', name: 'Chinese Fishing Nets', description: 'Iconic fishing nets that line the Kochi waterfront.', category: 'Cultural', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Chinese_fishing_nets.jpg/1280px-Chinese_fishing_nets.jpg' },
  { cityName: 'Chandigarh', name: 'Rock Garden', description: 'A creative park built from recycled industrial materials.', category: 'Cultural', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Rock_Garden_Chandigarh.jpg/1280px-Rock_Garden_Chandigarh.jpg' },
  { cityName: 'Chandigarh', name: 'Sukhna Lake', description: 'A peaceful man-made reservoir popular for boating and walking.', category: 'Nature', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Sukhna_Lake_Chandigarh.jpg/1280px-Sukhna_Lake_Chandigarh.jpg' },
  { cityName: 'Chandigarh', name: 'Capitol Complex', description: 'A UNESCO World Heritage site featuring modern architecture by Le Corbusier.', category: 'Architectural', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Capitol_Complex_Chandigarh.jpg/1280px-Capitol_Complex_Chandigarh.jpg' },
  { cityName: 'Darjeeling', name: 'Tiger Hill', description: 'A famous viewpoint for sunrise views over the Himalayas and Kanchenjunga.', category: 'Nature', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Tiger_Hill_Darjeeling.jpg/1280px-Tiger_Hill_Darjeeling.jpg' },
  { cityName: 'Darjeeling', name: 'Batasia Loop', description: 'A winding railway loop with beautiful gardens and panoramic views.', category: 'Historical', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Batasia_Loop_Darjeeling.jpg/1280px-Batasia_Loop_Darjeeling.jpg' },
  { cityName: 'Darjeeling', name: 'Peace Pagoda', description: 'A Buddhist pagoda that offers serene views over the hills.', category: 'Spiritual', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Peace_Pagoda_Darjeeling.jpg/1280px-Peace_Pagoda_Darjeeling.jpg' },
  { cityName: 'Ooty', name: 'Botanical Gardens', description: 'A sprawling garden with exotic plants and seasonal flower shows.', category: 'Nature', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Ooty_Botanical_Garden.jpg/1280px-Ooty_Botanical_Garden.jpg' },
  { cityName: 'Ooty', name: 'Ooty Lake', description: 'A scenic lake offering boat rides and tranquil views.', category: 'Nature', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Ooty_Lake.jpg/1280px-Ooty_Lake.jpg' },
  { cityName: 'Ooty', name: 'Doddabetta Peak', description: 'The highest peak in the Nilgiri Hills with expansive viewpoints.', category: 'Nature', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Doddabetta_peak.jpg/1280px-Doddabetta_peak.jpg' },

  // Andhra Pradesh Attractions
  { cityName: 'Visakhapatnam', name: 'Araku Valley', description: 'A famous hill station known for its coffee plantations and scenic beauty.', category: 'Nature', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Araku_Valley_Landscape.jpg' },
  { cityName: 'Visakhapatnam', name: 'Borra Caves', description: 'One of the largest caves in the country, known for stalactite and stalagmite formations.', category: 'Nature', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Borra_Caves_Inside_View.jpg' },
  { cityName: 'Visakhapatnam', name: 'RK Beach', description: 'Ramakrishna Beach, a popular spot for locals and tourists alike.', category: 'Nature', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/RK_Beach_Visakhapatnam.jpg' },
  { cityName: 'Tirupati', name: 'Tirumala Venkateswara Temple', description: 'A famous Hindu temple dedicated to Lord Venkateswara.', category: 'Spiritual', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Tirumala_Venkateswara_Temple.jpg' },
  { cityName: 'Tirupati', name: 'Sri Venkateswara Zoological Park', description: 'A major zoo park housing various wildlife species.', category: 'Nature', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Sri_Venkateswara_Zoological_Park.jpg' },
  { cityName: 'Vijayawada', name: 'Kanaka Durga Temple', description: 'A famous Hindu temple located on the Indrakeeladri hill.', category: 'Spiritual', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Kanaka_Durga_Temple_Vijayawada.jpg' },
  { cityName: 'Vijayawada', name: 'Undavalli Caves', description: 'A monolithic example of Indian rock-cut architecture.', category: 'Historical', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Undavalli_Caves.jpg' },
  { cityName: 'Vijayawada', name: 'Bhavani Island', description: 'One of the largest river islands, offering various recreational activities.', category: 'Nature', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Bhavani_Island.jpg' }
];

const hotels = [
  { cityName: 'Mumbai', name: 'The Taj Mahal Palace', location: 'Colaba, near Gateway of India', description: 'Historic luxury hotel with sea views and iconic architecture.', rating: 4.9, price: 15000, reviews: 4200, imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80' },
  { cityName: 'Mumbai', name: 'Trident Nariman Point', location: 'Nariman Point, near Marine Drive', description: 'Elegant five-star property with marina and city skyline views.', rating: 4.8, price: 12000, reviews: 3100, imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80' },
  { cityName: 'Delhi', name: 'The Leela Palace', location: 'Chanakyapuri, Diplomatic Enclave', description: 'Sumptuous palace hotel blending Mughal and contemporary design.', rating: 4.9, price: 18000, reviews: 2800, imageUrl: 'https://images.unsplash.com/photo-1542314831-c6a420325142?auto=format&fit=crop&w=1200&q=80' },
  { cityName: 'Delhi', name: 'ITC Maurya', location: 'Sardar Patel Marg', description: 'Luxury hotel with refined dining and spacious rooms.', rating: 4.7, price: 14000, reviews: 3500, imageUrl: 'https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=1200&q=80' },
  { cityName: 'Jaipur', name: 'Rambagh Palace', location: 'Bhawani Singh Road', description: 'Royal heritage hotel with grand gardens and regal interiors.', rating: 5.0, price: 25000, reviews: 1800, imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80' },
  { cityName: 'Jaipur', name: 'Fairmont Jaipur', location: 'Riico Industrial Area, Kukas', description: 'Opulent resort with stunning Indo-Islamic architecture.', rating: 4.8, price: 11000, reviews: 2100, imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80' },
  { cityName: 'Visakhapatnam', name: 'Novotel Visakhapatnam Varun Beach', location: 'Beach Road, near RK Beach', description: 'Contemporary beachfront hotel with sea-facing rooms.', rating: 4.6, price: 8500, reviews: 1500, imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80' },
  { cityName: 'Visakhapatnam', name: 'Taj Gateway Hotel', location: 'Beach Road', description: 'Reliable upscale hotel with coastal comfort and amenities.', rating: 4.5, price: 7000, reviews: 1200, imageUrl: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80' },
  { cityName: 'Udaipur', name: 'Taj Lake Palace', location: 'Lake Pichola', description: 'Romantic luxury hotel located on a lake island.', rating: 4.9, price: 30000, reviews: 2900, imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80' },
  { cityName: 'Agra', name: 'The Oberoi Amarvilas', location: 'Taj East Gate Road', description: 'Grand hotel with direct views of the Taj Mahal.', rating: 5.0, price: 35000, reviews: 4100, imageUrl: 'https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=1200&q=80' },
  { cityName: 'Tirupati', name: 'Fortune Select Grand Ridge', location: 'Shilparamam, Tiruchanoor Road', description: 'A modern hotel perfect for pilgrimage travelers.', rating: 4.4, price: 5500, reviews: 950, imageUrl: 'https://images.unsplash.com/photo-1618773928120-2c1473659eb0?auto=format&fit=crop&w=1200&q=80' },
  { cityName: 'Hyderabad', name: 'Taj Banjara', location: 'Banjara Hills', description: 'Luxury hotel in a prime city location with lush gardens.', rating: 4.6, price: 9000, reviews: 2200, imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80' }
];

const sampleReviews = [
  { user: { name: 'Google Local Guide' }, rating: 5, comment: 'Absolutely stunning! A must-visit place with incredible architecture and history.' },
  { user: { name: 'Travel Enthusiast' }, rating: 4, comment: 'Very beautiful, but can get quite crowded during peak hours. Best to visit early morning.' },
  { user: { name: 'History Buff' }, rating: 5, comment: 'The level of detail in the design is mesmerizing. Truly a remarkable landmark.' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding... 🔌');

    const User = require('./models/User');
    const Review = require('./models/Review');

    await City.deleteMany({});
    await Attraction.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({ email: 'guide@google.com' });
    console.log('Cleared existing data 🧹');

    await City.insertMany(cities);
    console.log('Added cities 🏙️');

    const insertedAttractions = await Attraction.insertMany(attractions);
    console.log('Added attractions 🏛️');

    await Hotel.deleteMany({});
    const insertedHotels = await Hotel.insertMany(hotels);
    console.log(`Added ${insertedHotels.length} hotels 🏨`);
    
    // Create a dummy user for reviews
    const dummyUser = new User({
      name: 'Google Local Guide',
      email: 'guide@google.com',
      password: 'password123'
    });
    await dummyUser.save();

    // Add fake reviews
    let reviewCount = 0;
    for (const attr of insertedAttractions) {
      const numReviews = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numReviews; i++) {
        const sample = sampleReviews[Math.floor(Math.random() * sampleReviews.length)];
        const r = new Review({
          user: dummyUser._id,
          attraction: attr._id,
          rating: sample.rating,
          comment: sample.comment
        });
        await r.save();
        reviewCount++;
      }
    }
    console.log(`Added ${reviewCount} reviews 📝`);

    console.log('Database seeded successfully! ✅');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
