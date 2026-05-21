/**
 * build_standalone.js
 * Genera pesca_standalone.html: un único archivo HTML completamente autocontenido.
 *
 * Qué hace:
 *  1. Descarga los SDK de Firebase desde CDN y los incrusta como <script> inline.
 *  2. Incrusta firebaseConfig.js directamente.
 *  3. Convierte las imágenes de sprites a data-URLs base64.
 *  4. Agrega un polyfill de window.storage usando localStorage.
 *  5. Incrusta las fuentes Google (Press Start 2P y VT323) en base64.
 *  6. Escribe el resultado en pesca_standalone.html
 *
 * Uso:
 *   node build_standalone.js
 */

const fs   = require('fs');
const path = require('path');
const https = require('https');

const ROOT = __dirname;
const SRC  = path.join(ROOT, 'pesca_sustentable_1.html');
const OUT  = path.join(ROOT, 'pesca_standalone.html');

// ── helpers ──────────────────────────────────────────────────────────────────
function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(fetchText(res.headers.location));
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(fetchBuffer(res.headers.location));
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function imgToDataURL(filePath, mime = 'image/png') {
  if (!fs.existsSync(filePath)) {
    console.warn(`  [WARN] Sprite no encontrado: ${filePath}`);
    return null;
  }
  const b64 = fs.readFileSync(filePath).toString('base64');
  return `data:${mime};base64,${b64}`;
}

// ── main ─────────────────────────────────────────────────────────────────────
async function build() {
  console.log('=== Build standalone Mar Vivo ===\n');

  let html = fs.readFileSync(SRC, 'utf8');

  // ── 1. Descargar Firebase SDKs ──────────────────────────────────────────
  const FB_URLS = [
    'https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore-compat.js',
  ];

  console.log('Descargando Firebase SDKs...');
  const fbScripts = [];
  for (const url of FB_URLS) {
    console.log(`  → ${url}`);
    try {
      const code = await fetchText(url);
      fbScripts.push(code);
      console.log(`    ✓ ${(code.length / 1024).toFixed(0)} KB`);
    } catch (e) {
      console.error(`    ✗ Error: ${e.message}`);
      process.exit(1);
    }
  }

  // Reemplazar las dos etiquetas <script src="...firebase..."> con el código inline.
  // IMPORTANTE: usar función como replacement para evitar que $ en el SDK minificado
  // sea interpretado como patrón especial ($&, $', $1, etc.) por String.replace().
  const appCode = fbScripts[0];
  const fsCode  = fbScripts[1];
  html = html.replace(
    /<script src="https:\/\/www\.gstatic\.com\/firebasejs\/11\.6\.1\/firebase-app-compat\.js"><\/script>/,
    () => `<script>\n/* firebase-app-compat 11.6.1 - inline */\n${appCode}\n</script>`
  );
  html = html.replace(
    /<script src="https:\/\/www\.gstatic\.com\/firebasejs\/11\.6\.1\/firebase-firestore-compat\.js"><\/script>/,
    () => `<script>\n/* firebase-firestore-compat 11.6.1 - inline */\n${fsCode}\n</script>`
  );
  console.log('  ✓ Firebase SDKs incrustados\n');

  // ── 2. Incrustar firebaseConfig.js ─────────────────────────────────────
  const configPath = path.join(ROOT, 'firebaseConfig.js');
  if (fs.existsSync(configPath)) {
    const configCode = fs.readFileSync(configPath, 'utf8');
    html = html.replace(
      '<script src="firebaseConfig.js"></script>',
      `<script>\n${configCode}\n</script>`
    );
    console.log('✓ firebaseConfig.js incrustado\n');
  } else {
    console.error('✗ firebaseConfig.js no encontrado');
    process.exit(1);
  }

  // ── 3. Incrustar sprites como base64 data-URLs ─────────────────────────
  console.log('Incrustando sprites...');

  // Mapa: ruta relativa en código → ruta absoluta en disco
  const SPRITES = {
    'sprites/people_sprt.png':       path.join(ROOT, 'sprites', 'people_sprt.png'),
    'sprites/town/town_day_sprt.png': path.join(ROOT, 'sprites', 'town', 'town_day_sprt.png'),
    'sprites/boats/spr_player.png':  path.join(ROOT, 'sprites', 'boats', 'spr_player.png'),
    'sprites/fish/spr_fish.png':     path.join(ROOT, 'sprites', 'fish', 'spr_fish.png'),
  };

  for (const [srcPath, absPath] of Object.entries(SPRITES)) {
    const dataURL = imgToDataURL(absPath);
    if (dataURL) {
      // Reemplaza todas las ocurrencias del src literal en el JS
      const escaped = srcPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      html = html.replace(new RegExp(`'${escaped}'`, 'g'), `'${dataURL}'`);
      html = html.replace(new RegExp(`"${escaped}"`, 'g'), `"${dataURL}"`);
      console.log(`  ✓ ${srcPath}`);
    } else {
      console.warn(`  ✗ ${srcPath} — no encontrado, se omite`);
    }
  }
  console.log();

  // ── 4. Polyfill window.storage → localStorage ──────────────────────────
  const storagePolyfill = `
<script>
/* ── window.storage polyfill (localStorage) para versión standalone ── */
window.storage = {
  set: async function(key, value) {
    try { localStorage.setItem('marvivo_' + key, value); } catch(e) {}
  },
  get: async function(key) {
    try {
      const v = localStorage.getItem('marvivo_' + key);
      return v !== null ? { value: v } : null;
    } catch(e) { return null; }
  },
  delete: async function(key) {
    try { localStorage.removeItem('marvivo_' + key); } catch(e) {}
  }
};
</script>`;

  // Insertar antes de </head> (regex para tolerar \r\n y \n de Windows)
  html = html.replace(/<\/head>/, () => `${storagePolyfill}\n</head>`);
  console.log('✓ Polyfill window.storage (localStorage) agregado\n');

  // ── 5. Incrustar fuentes Google ────────────────────────────────────────
  console.log('Descargando fuentes Google...');
  const FONT_URL = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&display=swap';
  try {
    // Descargar el CSS de fuentes
    const fontCSS = await fetchText(FONT_URL);

    // Extraer URLs de las fuentes y descargar cada una
    const fontUrlRegex = /url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g;
    const fontCache = {};
    let match;
    const urlsToFetch = [];
    while ((match = fontUrlRegex.exec(fontCSS)) !== null) {
      urlsToFetch.push(match[1]);
    }

    for (const furl of urlsToFetch) {
      if (!fontCache[furl]) {
        try {
          const buf = await fetchBuffer(furl);
          const ext = furl.includes('.woff2') ? 'woff2' : 'woff';
          fontCache[furl] = `data:font/${ext};base64,${buf.toString('base64')}`;
          console.log(`  ✓ ${furl.split('/').pop()}`);
        } catch(e) {
          console.warn(`  ✗ ${furl}: ${e.message}`);
        }
      }
    }

    // Parchear CSS con data-URLs
    let patchedCSS = fontCSS;
    for (const [furl, dataUrl] of Object.entries(fontCache)) {
      patchedCSS = patchedCSS.split(`url(${furl})`).join(`url(${dataUrl})`);
    }

    // Reemplazar la directiva @import con el CSS embebido
    html = html.replace(
      "@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&display=swap');",
      `/* Google Fonts incrustadas */\n${patchedCSS}`
    );
    console.log('  ✓ Fuentes incrustadas\n');
  } catch (e) {
    console.warn(`  ✗ No se pudieron descargar las fuentes: ${e.message}`);
    console.warn('  → Se usarán fuentes del sistema como fallback\n');
    // Remover el @import roto y dejar fallbacks del sistema
    html = html.replace(
      "@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&display=swap');",
      "/* Fuentes no disponibles offline — se usan fallbacks del sistema */"
    );
  }

  // ── 6. Agregar banner de versión standalone ────────────────────────────
  html = html.replace(
    '<title>Mar Vivo – Simulador de Pesca Sustentable</title>',
    '<title>Mar Vivo – Standalone</title>'
  );

  // ── 7. Escribir output ─────────────────────────────────────────────────
  fs.writeFileSync(OUT, html, 'utf8');
  const sizeKB = (fs.statSync(OUT).size / 1024).toFixed(0);
  console.log(`✅ Archivo generado: pesca_standalone.html (${sizeKB} KB)\n`);
  console.log('Instrucciones de uso:');
  console.log('  1. Copia pesca_standalone.html en el USB (junto con la carpeta sprites/ como respaldo).');
  console.log('  2. Ábrelo en cualquier navegador moderno.');
  console.log('  3. El juego funciona offline; Firebase envía datos cuando hay internet.');
  console.log('  4. Los guardados se almacenan en localStorage del navegador.\n');
}

build().catch(e => { console.error(e); process.exit(1); });
