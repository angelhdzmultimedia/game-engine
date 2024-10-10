import { Animations } from '../../animations'
import { constants } from '../../constants'
import { events } from '../../events'
import { FrameIndexPattern } from '../../frame-index-pattern'
import { checkTiles } from '../../helpers/check-tiles'
import { moveTowards } from '../../helpers/move-towards'
import { Input } from '../../input'
import { type Resource, resources } from '../../resources'
import { Sprite } from '../../sprite'
import { Vector2 } from '../../../vector2'
import { GameObject, type GameObjectOptions } from '../game-object'
import { InteractiveObject } from '../interactive-object'
import { walkDown, walkRight, walkUp, walkLeft, idleDown, idleRight, idleUp, idleLeft, pickUpDown } from './hero-animations'


export type HeroItemPickupEventData = {
  sprite?: Sprite
  position: Vector2
  item: GameObject
  sound: typeof constants.media.sounds[number]['name']
}

export type HeroPositionEventData = {
  position: Vector2
  object: GameObject
}

export type HeroActionRequest = {
  position: Vector2
  object: InteractiveObject
}

export class Hero extends GameObject {
  public facingDirection = Input.DOWN
  public destinationPosition: Vector2
  public lastPosition: Vector2
  public itemPickUpTime: number = 0
  public itemPickUpShell?: GameObject
  public isLocked: boolean = false
  public body = new Sprite({
    resource: resources.get('Hero'),
    frameSize: new Vector2(32, 32),
    hFrames: 3,
    vFrames: 8,
    frame: 1,
    position: new Vector2(-8, -20),
    animations: new Animations({
      walkDown: new FrameIndexPattern(walkDown),
      walkRight: new FrameIndexPattern(walkRight),
      walkUp: new FrameIndexPattern(walkUp),
      walkLeft: new FrameIndexPattern(walkLeft),
      idleDown: new FrameIndexPattern(idleDown),
      idleRight: new FrameIndexPattern(idleRight),
      idleUp: new FrameIndexPattern(idleUp),
      idleLeft: new FrameIndexPattern(idleLeft),
      itemPickUpDown: new FrameIndexPattern(pickUpDown)
    })
  })

  constructor(options: GameObjectOptions) {
    super(options)
    this.lastPosition = new Vector2(-8, -20)
    const shadow = new Sprite({
      resource: resources.get('Shadow'),
      frameSize: new Vector2(32, 32),
      position: new Vector2(-8, -19),
    })
    this.addChild(shadow)
    this.addChild(this.body)
    this.destinationPosition = this.position.duplicate()
    events.on<HeroItemPickupEventData>(constants.events.heroItemPickUp, this, (data?) => {
      this.onItemPickUp(data)
    })
  }

  public onItemPickUp(data?: HeroItemPickupEventData) {
    if (!data) return
    resources.getSound(data.sound)?.play()
 
    
    console.log(`Picked up item ${data.item.name} at`, data?.position)
    this.destinationPosition = data.position?.duplicate() ?? this.position
    this.itemPickUpTime = 500
    this.itemPickUpShell = new GameObject({})
    this.itemPickUpShell.addChild(new Sprite({
      resource: data.sprite?.resource,
      position: new Vector2(0, -18)
    }))

    this.addChild(this.itemPickUpShell)
  }

  public tryEmitPosition() {
    if (this.lastPosition.equals(this.position)) {
      return
    }
    events.emit<HeroPositionEventData>(constants.events.heroPosition, {
      object: this,
      position: this.position
    })
    this.lastPosition = this.position.duplicate()
  }

  public handleItemPickUp(deltaTime: number) {
    this.itemPickUpTime -= deltaTime
    this.body.animations?.play('itemPickUpDown')
    if (this.itemPickUpTime <= 0) {
      this.itemPickUpShell?.destroy()
    }
  }

  public override step(deltaTime: number) {
    if (this.isLocked) {
      return
    }
    if (this.itemPickUpTime > 0) {
      this.handleItemPickUp(deltaTime)
      return
    }

    if (this.root?.input.getActionJustPressed('Space')) {

      const objectAtPosition = this.parent?.children.find(child => child.position.equals(this.position.toNeighbor(this.facingDirection))) as InteractiveObject | undefined

      if (objectAtPosition) {
        this.body.animations?.stop()
        events.emit<HeroActionRequest>(constants.events.heroActionRequest, {
          object: objectAtPosition,
          position: this.position,
        })
      }


    }

    const distance = moveTowards(this, this.destinationPosition, 1)
    const hasArrived: boolean = distance <= 1

    if (hasArrived) {
      this.tryMove()
    }

    this.tryEmitPosition()
  }

  public override ready() {
    events.on(constants.events.textBoxStart, this, () => {
      this.isLocked = true
    })

    events.on(constants.events.textBoxEnd, this, () => {
      this.isLocked = false
    })
  }

  public tryMove() {
    if (!this.root?.input.direction) {
      if (this.facingDirection === Input.DOWN) this.body.animations?.play('idleDown')
      if (this.facingDirection === Input.UP) this.body.animations?.play('idleUp')
      if (this.facingDirection === Input.LEFT) this.body.animations?.play('idleLeft')
      if (this.facingDirection === Input.RIGHT) this.body.animations?.play('idleRight')

      return
    }
    const nextPosition = this.destinationPosition.duplicate()
    const gridSize = 16

    if (this.root?.input.direction === Input.DOWN) {
      nextPosition.y += gridSize
      this.body.animations?.play('walkDown')
    }

    if (this.root?.input.direction === Input.UP) {
      nextPosition.y -= gridSize
      this.body.animations?.play('walkUp')
    }

    if (this.root?.input.direction === Input.LEFT) {
      nextPosition.x -= gridSize
      this.body.animations?.play('walkLeft')
    }

    if (this.root?.input.direction === Input.RIGHT) {
      nextPosition.x += gridSize
      this.body.animations?.play('walkRight')
    }

    this.facingDirection = this.root?.input.direction ?? this.facingDirection
    const isTilesFree = checkTiles(this.root?.level?.tiles ?? new Set<string>(), nextPosition.x, nextPosition.y)
    const isSolidBodyAtTile = this.parent?.children.find(child => child.isSolid && child.position.equals(nextPosition))

    if (isTilesFree && !isSolidBodyAtTile) {
      this.destinationPosition.x = nextPosition.x
      this.destinationPosition.y = nextPosition.y
    }
  }

}