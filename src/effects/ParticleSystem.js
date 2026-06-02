// ParticleSystem: partículas de espuma y destellos
export default class ParticleSystem{
  constructor(){ this.particles = []; }
  spawn(x,y,opts={life:1.2,size:2,vy:-20}){
    this.particles.push({x,y,life:opts.life,age:0,size:opts.size,vy:opts.vy,alpha:1});
  }
  update(dt){
    for(const p of this.particles){ p.age += dt; p.y += p.vy*dt; p.alpha = 1 - p.age/p.life; }
    this.particles = this.particles.filter(p=>p.age < p.life);
  }
  render(ctx){
    ctx.save();
    for(const p of this.particles){ ctx.fillStyle = `rgba(255,255,255,${p.alpha*0.9})`; ctx.beginPath(); ctx.arc(p.x,p.y, p.size*(1-p.age/p.life),0,Math.PI*2); ctx.fill(); }
    ctx.restore();
  }
}
