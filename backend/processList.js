const fs = require('fs');

const raw = fs.readFileSync('rawMedicines.txt', 'utf8');

const lines = raw.split('\n');

const cleaned = [];

for (let line of lines) {
  let text = line.trim();
  if (!text || text === 'TOTAL') continue;
  
  // Remove leading numbers and tabs/spaces
  text = text.replace(/^\d+\s*/, '').trim();
  
  // Clean up any remaining artifacts but keep letters, spaces, parentheses
  if (text) {
    cleaned.push(text);
  }
}

// Remove duplicates and sort
const uniqueMedicines = [...new Set(cleaned)].sort();

const jsContent = `export const commonMedicines = ${JSON.stringify(uniqueMedicines, null, 2)};`;

fs.writeFileSync('../frontend/src/utils/medicines.js', jsContent);
console.log('Successfully extracted ' + uniqueMedicines.length + ' unique medicines.');
