import { FrameIndexPattern } from './frame-index-pattern'

export class Animations<T extends PropertyKey = PropertyKey> {
  public activeKey: T
  public isPlaying: boolean = false

  constructor(public readonly patterns: Record<T, FrameIndexPattern>) {
    this.activeKey = Object.keys(patterns)[0] as T
  }

  public play(key: keyof typeof this.patterns, startTime = 0) {
    if (this.activeKey === key) {
      return
    }
    this.activeKey = key
    this.isPlaying = true
    this.patterns[this.activeKey].currentTime = startTime
  }

  public stop() {
    this.isPlaying = false;
    this.patterns[this.activeKey].currentTime = 0
  }

 
  public step(deltaTime: number) {
    if (!this.isPlaying) {
      return
    }
    this.patterns[this.activeKey as T].step(deltaTime)
  }

  public get frame() {
    return this.patterns[this.activeKey as T].frame
  }
}