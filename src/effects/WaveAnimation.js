// WaveAnimation: dibuja olas, reflejos y parallax
export default class WaveAnimation{
  constructor(){ this.time=0; this.waves=[{amp:6, speed:0.6, length:180},{amp:3,speed:0.9,length:90}]; }
  update(dt){ this.time += dt; }
  render(ctx,w,h){
    // simple layered sine waves
    ctx.save();
    ctx.translate(0, h*0.6);
    for(let i=0;i<this.waves.length;i++){
      const p = this.waves[i];
      ctx.beginPath();
      ctx.moveTo(0, p.amp*Math.sin(this.time*p.speed));
      for(let x=0;x<w;x+=10){
        const y = p.amp*Math.sin((x/p.length)+this.time*p.speed);
        ctx.lineTo(x,y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0,h);
      ctx.closePath();
      ctx.fillStyle = 'rgba(30,120,180,' + (0.08+0.06*i) + ')';
      ctx.fill();
    }
    ctx.restore();
  }
}
