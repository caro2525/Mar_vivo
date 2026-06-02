// AudioManager: controla música y efectos, volumen global
export default class AudioManager{
  constructor(){ this.musicVol = 0.5; this.sfxVol = 0.8; this.music = null; }
  setMusic(audio){ if(this.music){ this.music.pause(); } this.music = audio; this.music.volume = this.musicVol; }
  playMusic(){ if(this.music){ this.music.volume = this.musicVol; this.music.loop = true; this.music.play().catch(()=>{}); } }
  stopMusic(){ if(this.music){ this.music.pause(); this.music.currentTime=0; } }
  playSFX(audio){ if(!audio) return; audio.volume = this.sfxVol; audio.currentTime = 0; audio.play().catch(()=>{}); }
  setMusicVolume(v){ this.musicVol = v; if(this.music) this.music.volume = v; }
  setSfxVolume(v){ this.sfxVol = v; }
}
