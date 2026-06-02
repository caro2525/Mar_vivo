// Panels: left and right info panels (read/write LocalStorage)
export class LeftPanel{
  constructor(){ this.data = {best:'—', money:0, record:'—', species:0, eco:72}; this.load(); }
  load(){ try{ const s=localStorage.getItem('save'); if(s){ const obj=JSON.parse(s); this.data=obj.summary||this.data; } }catch(e){}
  }
  save(){ try{ const s=localStorage.getItem('save'); const obj = s?JSON.parse(s):{}; obj.summary = this.data; localStorage.setItem('save',JSON.stringify(obj)); }catch(e){}
  }
  render(ctx,x,y,w,h){ ctx.save(); ctx.fillStyle='rgba(10,18,28,0.6)'; roundRect(ctx,x,y,w,h,6,true,true); ctx.fillStyle='#ffd'; ctx.font='14px monospace'; ctx.fillText('MEJOR PESCADOR: '+this.data.best, x+12,y+26); ctx.fillText('DINERO: $'+this.data.money, x+12,y+50); ctx.fillText('RÉCORD: '+this.data.record, x+12,y+74); ctx.fillText('ESPECIES: '+this.data.species, x+12,y+98);
    // ecosys bar
    ctx.fillStyle='#fff'; ctx.fillText('SALUD ECOSISTEMA', x+12,y+130);
    ctx.fillStyle='#333'; ctx.fillRect(x+12,y+138,w-24,12);
    ctx.fillStyle='#2ecc71'; ctx.fillRect(x+12,y+138,(w-24)*(this.data.eco/100),12);
    ctx.restore(); }
}

export class RightPanel{
  constructor(){ this.data={day:1,hour:'08:00',weather:'Soleado',sea:'Tranquilo',region:'Pueblo Azul'} }
  render(ctx,x,y,w,h){ ctx.save(); ctx.fillStyle='rgba(10,18,28,0.6)'; roundRect(ctx,x,y,w,h,6,true,true); ctx.fillStyle='#ffd'; ctx.font='14px monospace'; ctx.fillText('DÍA '+this.data.day, x+12,y+26); ctx.fillText('HORA '+this.data.hour, x+12,y+50); ctx.fillText('CLIMA: '+this.data.weather, x+12,y+74); ctx.fillText('MAR: '+this.data.sea, x+12,y+98); ctx.fillText('REGIÓN: '+this.data.region, x+12,y+122); ctx.restore(); }
}

function roundRect(ctx,x,y,w,h,r,fill,stroke){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); if(fill) ctx.fill(); if(stroke) ctx.stroke(); }
