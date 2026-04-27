const fs = require('fs');
const path = require('path');

const downloads = [
  { name: 'marine_drive.jpg', url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80' },
  { name: 'elephanta_caves.jpg', url: 'https://picsum.photos/seed/elephanta/800/600' },
  { name: 'india_gate.jpg', url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80' },
  { name: 'qutub_minar.jpg', url: 'https://picsum.photos/seed/qutub/800/600' },
  { name: 'amber_fort.jpg', url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80' },
  { name: 'jantar_mantar.jpg', url: 'https://picsum.photos/seed/jantar/800/600' }
];

const destDir = path.join(__dirname, '../frontend/public/images/places');

async function downloadImages() {
  for (const img of downloads) {
    const destPath = path.join(destDir, img.name);
    try {
      const response = await fetch(img.url);
      if (!response.ok) {
        throw new Error(`Failed to download ${img.name}: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(destPath, buffer);
      console.log(`Downloaded ${img.name}`);
    } catch (err) {
      console.log(`Error downloading ${img.name}: ${err.message}`);
    }
  }
}

downloadImages();
