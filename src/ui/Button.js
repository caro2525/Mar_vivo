// Button UI: dibuja botones, maneja hover, click y teclado
export default class Button{
  constructor(opts){
    this.x = opts.x||0; this.y=opts.y||0; this.w=opts.w||220; this.h=opts.h||46; this.text = opts.text||'Btn';
    this.onClick = opts.onClick||(()=>{}); this.enabled = true; this.hover=false; this.focused=false; this.sfxHover = opts.sfxHover; this.sfxClick = opts.sfxClick; this.font='20px monospace';
  }
  contains(px,py){ return px>=this.x && px<=this.x+this.w && py>=this.y && py<=this.y+this.h; }
  update(dt){}
  render(ctx){ ctx.save(); ctx.translate(this.x,this.y);
    // hover scale
    const scale = this.hover||this.focused?1.05:1.0;
    ctx.translate(this.w/2,this.h/2); ctx.scale(scale,scale); ctx.translate(-this.w/2,-this.h/2);
    ctx.fillStyle = this.enabled? '#2a5f78' : '#444'; ctx.strokeStyle='#102a3a'; ctx.lineWidth=3; roundRect(ctx,0,0,this.w,this.h,6,true,true);
    ctx.fillStyle='#fff'; ctx.font=this.font; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.shadowColor='rgba(0,0,0,0.6)'; ctx.shadowBlur=6; ctx.fillText(this.text,this.w/2,this.h/2+1);
    ctx.restore(); }
  setHover(v, audioManager){ if(v && !this.hover){ if(audioManager && this.sfxHover) audioManager.playSFX(this.sfxHover); } this.hover=v; }
  click(audioManager){ if(!this.enabled) return; if(audioManager && this.sfxClick) audioManager.playSFX(this.sfxClick); this.onClick(); }
}

function roundRect(ctx,x,y,w,h,r,fill,stroke){ if(typeof r==='undefined') r=5; ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); if(fill) ctx.fill(); if(stroke) ctx.stroke(); }
