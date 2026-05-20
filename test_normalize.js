const ADDRESS_TRANSLATION_MAP = { '全国': 'Japan Nationwide', 'オンライン': 'Online' };
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
console.log("全国 =>", normalizePrefValue('全国'));
console.log("オンライン =>", normalizePrefValue('オンライン'));
