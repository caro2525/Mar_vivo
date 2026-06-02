// AssetLoader: carga imágenes y audios con promesas
export default class AssetLoader {
  constructor(){ this.images = {}; this.audio = {}; }

  loadImage(key, src){
    return new Promise((res, rej) => {
      const img = new Image(); img.onload = () => { this.images[key]=img; res(img); };
      img.onerror = rej; img.src = src;
    });
  }

  loadAudio(key, src, opts={loop:false}){
    return new Promise((res, rej)=>{
      const a = new Audio(); a.src = src; a.loop = !!opts.loop; a.oncanplaythrough = ()=>{ this.audio[key]=a; res(a); };
      a.onerror = rej; a.load();
    });
  }

  getImage(key){ return this.images[key]; }
  getAudio(key){ return this.audio[key]; }
}
