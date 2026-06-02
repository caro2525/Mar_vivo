import SceneManager from './core/SceneManager.js';
import AssetLoader from './core/AssetLoader.js';
import AudioManager from './core/AudioManager.js';
import MainMenu from './scenes/MainMenu.js';

const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d');
function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resize); resize();

const assets = new AssetLoader(); const audio = new AudioManager(); const manager = new SceneManager();

async function loadAssets(){
  // images (placeholders if missing) and audio
  try{
    await assets.loadAudio('hover','assets/audio/hover.mp3');
  }catch(e){}
  try{ await assets.loadAudio('click','assets/audio/click.mp3'); }catch(e){}
  try{ await assets.loadAudio('music','assets/audio/ambient.mp3',{loop:true}); }catch(e){}
}

async function init(){ await loadAssets(); const mainMenu = new MainMenu(assets,audio); manager.add('main', mainMenu); await manager.change('main'); startLoop(); }

let last = performance.now(); function startLoop(){ function loop(t){ const dt = Math.min(0.05,(t-last)/1000); last=t; manager.update(dt); manager.render(ctx, canvas.width, canvas.height); requestAnimationFrame(loop); } requestAnimationFrame(loop); }

// mouse events delegated to scene
canvas.addEventListener('mousemove', e=>{ manager.handleEvent(e); }); canvas.addEventListener('click', e=>{ manager.handleEvent(e); });

init().catch(e=>console.error(e));
