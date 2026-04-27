
const fs = require('fs');

const seedJsContent = fs.readFileSync('seed.js', 'utf8');

const urls = [];
const regex = /imageUrl:\s*'([^']+)'/g;
let match;
while ((match = regex.exec(seedJsContent)) !== null) {
  urls.push(match[1]);
}

async function checkUrls() {
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (!res.ok) {
        console.log(`❌ BROKEN: ${url} (Status: ${res.status})`);
      } else {
        // console.log(`✅ OK: ${url}`);
      }
    } catch (e) {
      console.log(`❌ ERROR: ${url} - ${e.message}`);
    }
  }
  console.log("Done checking.");
}

checkUrls();
