import Button from '../ui/Button.js';
import { LeftPanel, RightPanel } from '../ui/Panels.js';
import WaveAnimation from '../effects/WaveAnimation.js';
import ParticleSystem from '../effects/ParticleSystem.js';
import FishAnimation from '../effects/FishAnimation.js';
import SeagullAnimation from '../effects/SeagullAnimation.js';
import FadeTransition from '../effects/FadeTransition.js';

export default class MainMenu{
  constructor(assets,audio){
    this.assets = assets; this.audio = audio;
    this.left = new LeftPanel(); this.right = new RightPanel();
    this.wave = new WaveAnimation(); this.particles = new ParticleSystem();
    this.fish = null; this.seagulls = null; this.fade = new FadeTransition();
    this.buttons = []; this.focusIndex = 0; this.logoFloat = 0;
  }
  async onEnter(){ // create dynamic pieces once canvas size known
    const w = this.canvasWidth || 800; this.fish = new FishAnimation(w); this.seagulls = new SeagullAnimation(w,600);
    // create buttons
    const bx =  (this.canvasWidth||800)/2 - 120; let by = 260;
    const sfxHover = this.assets.getAudio('hover'); const sfxClick = this.assets.getAudio('click');
    const makeBtn = (text,fn)=>{ const b=new Button({x:bx,y:by,w:240,h:46,text:oneline(text), onClick:fn, sfxHover, sfxClick}); by += 62; this.buttons.push(b); };
    makeBtn('NUEVA PARTIDA', ()=>{ this.startNew(); });
    makeBtn('CONTINUAR', ()=>{ this.continue(); });
    makeBtn('REGISTRO DE PECES', ()=>{ this.openPokedex(); });
    makeBtn('OPCIONES', ()=>{ this.openOptions(); });
    makeBtn('CRÉDITOS', ()=>{ this.openCredits(); });
    // keyboard
    window.addEventListener('keydown', this._kbd = e=>this.onKey(e));
    // start music
    const m = this.assets.getAudio('music'); if(m){ this.audio.setMusic(m); this.audio.playMusic(); }
    this.fade.startIn();
  }
  onExit(){ window.removeEventListener('keydown', this._kbd); }
  update(dt){ this.wave.update(dt); this.particles.update(dt); this.fish.update(dt); this.seagulls.update(dt); this.fade.update(dt); this.logoFloat = Math.sin(Date.now()/600)*6; }
  render(ctx,w,h){ this.canvasWidth=w; // background sky
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle='#2b6fb2'; ctx.fillRect(0,0,w,h);
    // simple distant island (placeholder)
    ctx.fillStyle='#16433b'; ctx.fillRect(40,h*0.45,200,80);
    // waves and fish
    this.wave.render(ctx,w,h); this.fish.render(ctx); this.seagulls.render(ctx);
    // logo
    ctx.save(); ctx.translate(w/2,110+this.logoFloat);
    ctx.font='72px "Press Start 2P", monospace'; ctx.textAlign='center'; ctx.fillStyle='#7fd2ff'; ctx.strokeStyle='#082a3a'; ctx.lineWidth=8; ctx.fillText('MAR VIVO',0,0); ctx.strokeText('MAR VIVO',0,0);
    ctx.restore();
    // buttons
    for(const b of this.buttons) b.render(ctx);
    // left/right panels
    this.left.render(ctx,20,220,240,220); this.right.render(ctx,w-260,220,240,160);
    // particles
    this.particles.render(ctx);
    // fade overlay
    this.fade.render(ctx,w,h);
  }
  handleEvent(e){ if(e.type==='mousemove'){ const rect=e.target.getBoundingClientRect(); const x=e.clientX-rect.left, y=e.clientY-rect.top; for(const b of this.buttons) b.setHover(b.contains(x,y), this.audio); }
    else if(e.type==='click'){ const rect=e.target.getBoundingClientRect(); const x=e.clientX-rect.left, y=e.clientY-rect.top; for(const b of this.buttons) if(b.contains(x,y)) b.click(this.audio); }
  }
  onKey(e){ if(e.key==='ArrowDown'){ this.focusIndex = (this.focusIndex+1)%this.buttons.length; this._updateFocus(); }
    else if(e.key==='ArrowUp'){ this.focusIndex = (this.focusIndex-1+this.buttons.length)%this.buttons.length; this._updateFocus(); }
    else if(e.key==='Enter'){ this.buttons[this.focusIndex].click(this.audio); }
  }
  _updateFocus(){ this.buttons.forEach((b,i)=> b.focused = (i===this.focusIndex)); }

  // button handlers (placeholders)
  startNew(){ localStorage.removeItem('save'); alert('Nueva partida creada — seleccionar personaje (falta UI)'); }
  continue(){ const s = localStorage.getItem('save'); if(!s){ alert('No hay partida guardada'); return;} alert('Cargando partida...'); }
  openPokedex(){ alert('Abrir enciclopedia (implementación pendiente)'); }
  openOptions(){ alert('Abrir opciones (implementación pendiente)'); }
  openCredits(){ alert('Abrir créditos...'); }
}

function oneline(t){ return t.replace(/\n/g,' '); }
