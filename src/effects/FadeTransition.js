// FadeTransition: transición fade-in/out
export default class FadeTransition{
  constructor(){ this.alpha=1; this.state='in'; this.speed=1.2; }
  startIn(){ this.state='in'; this.alpha=1; }
  startOut(){ this.state='out'; this.alpha=0; }
  update(dt){ if(this.state==='in'){ this.alpha -= dt*this.speed; if(this.alpha<0) this.alpha=0; } else if(this.state==='out'){ this.alpha += dt*this.speed; if(this.alpha>1) this.alpha=1; } }
  render(ctx,w,h){ if(this.alpha<=0) return; ctx.save(); ctx.fillStyle = `rgba(0,0,0,${this.alpha})`; ctx.fillRect(0,0,w,h); ctx.restore(); }
}
