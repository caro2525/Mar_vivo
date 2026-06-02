// FishBackgroundAnimation: peces simples nadando
export default class FishBackgroundAnimation{
  constructor(w){ this.fish = []; this.worldW = w; for(let i=0;i<6;i++) this.fish.push(this._make()); }
  _make(){ return {x: Math.random()*this.worldW, y: 240+Math.random()*120, vx: (0.3+Math.random()*0.8)*(Math.random()>0.5?1:-1), size: 8+(Math.random()*8)}; }
  update(dt){ for(const f of this.fish){ f.x += f.vx*dt*60; if(f.x < -50) f.x = this.worldW+50; if(f.x>this.worldW+50) f.x=-50; } }
  render(ctx){ ctx.save(); for(const f of this.fish){ ctx.fillStyle = '#ffd25a'; ctx.beginPath(); ctx.ellipse(f.x,f.y,f.size, f.size*0.6, 0,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#b35'; ctx.fillRect(f.x - f.size/2, f.y-1, f.size/2,2); } ctx.restore(); }
}
