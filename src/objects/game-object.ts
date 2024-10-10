import { constants } from '../constants'
import { events } from '../events'
import { Vector2 } from '../../vector2'
import { Main } from './main'

export type GameObjectOptions = {
  position?: Vector2
  name?: string
  root?: Main
  frameSize?: Vector2
}

export class GameObject {
  public children: GameObject[]
  public position: Vector2
  public parent?: GameObject
  public root?: Main
  public name: string
  public isReady: boolean = false
  public isSolid: boolean = false
  public frameSize: Vector2
  public drawLayer?: typeof constants.gameObject.drawLayer[keyof typeof constants.gameObject.drawLayer]

  constructor(options: GameObjectOptions) {
    this.root = options.root
    this.position = options.position ?? new Vector2(0, 0)
    this.children = []
    this.name = options.name ?? this.constructor.name
    this.frameSize = options.frameSize ?? new Vector2(0, 0)
  }

  public stepEntry(deltaTime: number) {
    this.children.forEach(child => {
      child.stepEntry(deltaTime)
    })

    if (!this.isReady) {
      this.isReady = true
      this.ready()
    }

    this.step(deltaTime)
  }

  public step(deltaTime: number) {

  }

  public destroy() {
    this.children.forEach(child => child.destroy())
    this.parent?.removeChild(this)
    //console.log('Destroying', this)
  }


  public getChildrenSorted() {
    const bottoms = this.children.filter(c => c.drawLayer === "Bottom")
    const floors = this.children.filter(c => c.drawLayer === "Floor")
    const objects = this.children.filter(c => !c.drawLayer).sort((a, b) => {
      return a.position.y > b.position.y ? 1 : -1
    })
    return [
      ...bottoms,
      ...floors,
      ...objects
    ]
  }

  public draw(canvasContext: CanvasRenderingContext2D, x: number, y: number) {
    const drawPosition = new Vector2(
      x + this.position.x,
      y + this.position.y,
    )
    this.drawImage(canvasContext, drawPosition.x, drawPosition.y)
    this.getChildrenSorted().forEach(child => {
      child.draw(canvasContext, drawPosition.x, drawPosition.y)
    })
  }

  public drawImage(canvasContext: CanvasRenderingContext2D, x: number, y: number) {

  }

  public isClicked() {
    const {x, y} = this.root?.input.mousePosition ?? new Vector2(0, 0)
    const rect = {
      x: this.position.x,
      y: this.position.y,
      width: this.frameSize.x,
      height: this.frameSize.y
    }
    const isColliding = x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height
    return isColliding && this.root?.input.mouseButton(0)
  }

  public addChild(child: GameObject) {
    child.parent = this
    this.children.push(child)
  }

  public ready() {

  }

  public removeChild(child: GameObject) {
    //console.log('Removing child', child)
    events.unsubscribeAll(child)
    this.children = this.children.filter(c => c !== child)
    child.parent = undefined
  }
}