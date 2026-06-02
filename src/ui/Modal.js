// Modal: ventana simple para créditos y demás
export default class Modal{
  constructor(){ this.visible=false; this.content=''; this.y=0; }
  open(content){ this.content = content; this.visible=true; }
  close(){ this.visible=false; }
  render(ctx,w,h){ if(!this.visible) return; ctx.save(); ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.fillRect(0,0,w,h);
    const boxW = Math.min(640,w-80), boxH = Math.min(480,h-120);
    ctx.fillStyle='#071423'; roundRect(ctx,(w-boxW)/2,(h-boxH)/2,boxW,boxH,8,true,false); ctx.strokeStyle='#6ea'; ctx.lineWidth=3; ctx.stroke();
    ctx.fillStyle='#fff'; ctx.font='16px monospace'; wrapText(ctx,this.content,(w-boxW)/2+20,(h-boxH)/2+40,boxW-40,20);
    ctx.restore(); }
}

function roundRect(ctx,x,y,w,h,r,fill,stroke){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); if(fill) ctx.fill(); if(stroke) ctx.stroke(); }
function wrapText(ctx,text,x,y,maxWidth,lineHeight){ const words=text.split(' '); let line=''; for(let n=0;n<words.length;n++){ const testLine = line + words[n] + ' '; const metrics = ctx.measureText(testLine); if(metrics.width > maxWidth && n>0){ ctx.fillText(line,x,y); line = words[n] + ' '; y += lineHeight; } else { line = testLine; } } ctx.fillText(line,x,y); }
