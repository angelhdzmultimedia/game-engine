import { type Animation } from './objects/hero/hero-animations'

export class FrameIndexPattern {
  public currentTime: number = 0

  constructor(public readonly animation: Animation) {
  }

  public step(deltaTime: number) {
    this.currentTime += deltaTime
    if (this.currentTime >= this.animation.duration) {
      this.currentTime = 0
    }
  }

  public get frame() {
    const {duration, frames} = this.animation
    for (let i = frames.length - 1; i >= 0; i--) {
      const frame = frames[i]
      if (!frame) {
        continue
      }
      if (this.currentTime >= frame.time!) {
        return frame.frame
      }
    }
    throw 'Time is before the first frame'
  }
}