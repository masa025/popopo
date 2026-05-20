const fs = require('fs');
const code = fs.readFileSync('app.js', 'utf8');

// Extract SPOTS array
const spotsMatch = code.match(/const SPOTS = (\[[\s\S]*?\]);/);
const SPOTS = eval(spotsMatch[1]);

// Extract ADDRESS_TRANSLATION_MAP
const transMatch = code.match(/const ADDRESS_TRANSLATION_MAP = (\{[\s\S]*?\});/);
const ADDRESS_TRANSLATION_MAP = eval('(' + transMatch[1] + ')');

function normalizePrefValue(pref = '') {
  let value = String(pref || '').trim();
  if (!value) return '';
  value = value.replace(/\s+(prefecture|pref)$/i, '');
  const lowerVal = value.toLowerCase();
  for (const [jpKey, enVal] of Object.entries(ADDRESS_TRANSLATION_MAP)) {
    if (enVal && enVal.toLowerCase() === lowerVal) {
      value = jpKey;
      break;
    }
  }
  if (value !== '北海道') {
    value = value.replace(/[都府県]$/g, '');
  }
  return value;
}

const addedToMap = [];
SPOTS.forEach(spot => {
  const normPref = normalizePrefValue(spot.pref);
  if (normPref === '全国' || normPref === 'オンライン') return;
  if (spot.cat === 'entertainment' && (spot.id === 'hazbin' || spot.id === 'doc72')) return;
  addedToMap.push(spot.name);
});

console.log("Excluded spots:", SPOTS.filter(s => !addedToMap.includes(s.name)).map(s => s.name));
