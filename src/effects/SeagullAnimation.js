// SeagullAnimation: aves cruzando el cielo
export default class SeagullAnimation{
  constructor(w,h){ this.w=w; this.h=h; this.gulls=[]; for(let i=0;i<3;i++) this.gulls.push(this._make()); }
  _make(){ return {x: -50 - Math.random()*400, y: 40 + Math.random()*80, vx: 1+Math.random()*2, amp: 6+Math.random()*6, phase: Math.random()*Math.PI*2}; }
  update(dt){ for(const g of this.gulls){ g.x += g.vx*dt*60; g.y += Math.sin((g.x/50)+g.phase)*0.2; if(g.x > this.w+50){ Object.assign(g, this._make()); g.x = -50; } } }
  render(ctx){ ctx.save(); ctx.fillStyle='#fff'; for(const g of this.gulls){ ctx.beginPath(); ctx.moveTo(g.x,g.y); ctx.quadraticCurveTo(g.x+8,g.y-6,g.x+18,g.y); ctx.quadraticCurveTo(g.x+8,g.y-2,g.x,g.y); ctx.fill(); } ctx.restore(); }
}
