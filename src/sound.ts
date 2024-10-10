import { events } from './events'

const audioContext = new (window.AudioContext ?? (window as any).webkitAudioContext)()

export class Sound {
  private static playlist: {gainNode?: GainNode, source?: AudioBufferSourceNode, fadeOut: (duration: number) => void}[] = []
  private source?: AudioBufferSourceNode
  private gainNode?: GainNode
  private audioBuffer?: AudioBuffer

  constructor() { 
    
  }

  public async load(url: string) {
    const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      this.audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
  }

  public play(delay: number = 0, volume: number = 1.0) {
    if (!this.audioBuffer) {
      return
    }
    setTimeout(() => {
      this.source = audioContext.createBufferSource();
      
      this.source.buffer = this.audioBuffer!
      
      this.gainNode = audioContext.createGain(); // For volume control (fading)
      this.source.connect(this.gainNode);
      this.gainNode.connect(audioContext.destination);
      this.source.start() // Play the audio
      this.gainNode.gain.setValueAtTime(volume, 0)
      const sound = {gainNode: this.gainNode, source: this.source}
      Sound.playlist.push({
        ...sound,
        fadeOut(duration: number) {
          Sound._fadeOut(sound, duration)
        }
      })
    }, delay)
  }

  public static fadeOutAll(duration: number) {
    const sounds = [...Sound.playlist]
    sounds.forEach(sound => {
      sound.fadeOut(duration)
    })
    setTimeout(() => {
      events.emit('SoundFadeOutAll');
    }, duration); 
  }

  public static _fadeOut(sound: {gainNode?: GainNode, source?: AudioBufferSourceNode}, duration: number) {
    if (!sound?.gainNode || !sound?.source) return;
  
    const { gainNode, source } = sound;
    const now = audioContext.currentTime;
    const durationInSeconds = duration / 1000; // Convert milliseconds to seconds
  
    gainNode.gain.setValueAtTime(gainNode.gain.value, now); // Set current gain value
    gainNode.gain.linearRampToValueAtTime(0, now + durationInSeconds);
    // Stop the audio source after the fade out
    source.stop(now + duration);
    Sound.playlist = Sound.playlist.filter(s => s.gainNode !== gainNode && s.source !== source)
    // Emit the FadeOut event when the fade out is complete
    // Multiply by 1000 to convert seconds to milliseconds
  }
  
  public static stopAll() {
    const sounds = [...Sound.playlist]
    sounds.forEach(sound => {
      sound.source?.stop() 
      Sound.playlist = Sound.playlist.filter(sound => sound.gainNode !== sound.gainNode && sound.source !== sound.source)
    })
  }

  
  public stop() {
    if (!this?.gainNode || !this?.source) return
    if (this.source.context.state !== 'running') return
    const {gainNode, source} = this
    source.stop()
    Sound.playlist = Sound.playlist.filter(sound => sound.gainNode !== this.gainNode && sound.source !== this.source)
  }
}


