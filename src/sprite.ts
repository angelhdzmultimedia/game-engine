import { Animations } from './animations'
import { GameObject, type GameObjectOptions } from './objects/game-object'
import { type Resource } from './resources'
import { Vector2 } from '../vector2'



export type SpriteOptions<T extends PropertyKey = PropertyKey> = GameObjectOptions & {
  resource?: Resource<typeof Image>
  frameSize?: Vector2
  hFrames?: number
  vFrames?: number
  frame?: number
  scale?: number
  position?: Vector2
  animations?: Animations<T>
  opacity?: number
}




export class Sprite<T extends PropertyKey = PropertyKey> extends GameObject {
  public resource?: Resource<typeof Image> 
  public hFrames: number 
  public vFrames: number 
  public frame: number
  public scale: number 
  public frameMap = new Map<number, Vector2>()
  public animations?: Animations<T>
  public opacity: number

  constructor(options: SpriteOptions<T>) {
    super(options)
    this.resource = options.resource
    this.frameSize = options.frameSize ?? new Vector2(16, 16)
    this.hFrames = options.hFrames ?? 1
    this.vFrames = options.vFrames ?? 1
    this.frame = options.frame ?? 0
    this.scale = options.scale ?? 1
    this.position = options.position ?? new Vector2(0, 0)
    this.animations = options.animations
    this.opacity = options.opacity ?? 1
    this.buildFrameMap()
   }

   public buildFrameMap() {
     let frameCount = 0
     for (let v = 0; v < this.vFrames; v++) {
       for (let h = 0; h < this.hFrames; h++) {
        this.frameMap.set(frameCount, 
          new Vector2(this.frameSize.x * h, this.frameSize.y * v)
        ) 
        frameCount++

       }
     }
   }

   public override step(deltaTime: number) {
    if (!this.animations) {
      return
    }
    this.animations.step(deltaTime)
    this.frame = this.animations.frame ?? 0
   }

   public override drawImage(canvasContext: CanvasRenderingContext2D, x: number, y: number) {
    if (!this.resource?.isLoaded) {
      return
    }
    let frameCordX = 0 
    let frameCordY = 0
    const frame = this.frameMap.get(this.frame!)
    if (frame) {
      frameCordX = frame.x
      frameCordY = frame.y
    }

    const frameSizeX = this.frameSize.x
    const frameSizeY = this.frameSize.y

    canvasContext.filter = 'opacity(' + this.opacity + ')'

    canvasContext.drawImage(
      this.resource.element as HTMLImageElement,
      frameCordX,
      frameCordY,
      frameSizeX,
      frameSizeY,
      x,
      y,
      frameSizeX * this.scale,
      frameSizeY * this.scale
    )
   }
}