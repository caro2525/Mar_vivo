const fs = require('fs');
const path = require('path');

// Read the HTML file
const htmlPath = path.join(__dirname, 'pesca_sustentable_1.html');
const content = fs.readFileSync(htmlPath, 'utf8');

// Extract all id attributes from the HTML
const idMatches = content.match(/id=["']([^"']+)["']/g);
if (!idMatches) {
  console.log('No IDs found');
  process.exit(0);
}

const ids = [...new Set(idMatches.map(m => m.match(/id=["']([^"']+)["']/)[1]))];

// Convert kebab-case to camelCase
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

// Generate cache initialization code
let cacheCode = '// ─── DOM CACHE ──────────────────────────────────────────────\n';
cacheCode += 'const DOM={};\n';
cacheCode += 'function initDOMCache(){\n';

// Group by category for readability
const groups = {
  hud: [],
  bar: [],
  modal: [],
  canvas: [],
  fish: [],
  catch: [],
  method: [],
  zone: [],
  other: []
};

ids.forEach(id => {
  // Skip dynamic IDs that contain template syntax
  if (id.includes('${') || id.includes('}`')) return;

  const camelId = toCamelCase(id);
  if (id.startsWith('hud-')) groups.hud.push({ id, camelId });
  else if (id.startsWith('bar-')) groups.bar.push({ id, camelId });
  else if (id.startsWith('modal-') || id.includes('modal')) groups.modal.push({ id, camelId });
  else if (id.includes('canvas')) groups.canvas.push({ id, camelId });
  else if (id.startsWith('fish-')) groups.fish.push({ id, camelId });
  else if (id.startsWith('catch-')) groups.catch.push({ id, camelId });
  else if (id.startsWith('method-')) groups.method.push({ id, camelId });
  else if (id.startsWith('zm-') || id === 'zone-name' || id === 'zone-species') groups.zone.push({ id, camelId });
  else groups.other.push({ id, camelId });
});

// Write groups with comments
Object.entries(groups).forEach(([groupName, items]) => {
  if (items.length === 0) return;
  cacheCode += `  // ${groupName.charAt(0).toUpperCase() + groupName.slice(1)} elements\n`;
  items.forEach(({ id, camelId }) => {
    cacheCode += `  DOM.${camelId}=document.getElementById('${id}');\n`;
  });
});

cacheCode += '}\n';

console.log(cacheCode);
console.log('\n// Total IDs:', ids.length);
