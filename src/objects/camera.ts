import { constants } from '../constants'
import { events } from '../events'
import { gridCells } from '../helpers/grid-cells'
import { Vector2 } from '../../vector2'
import { GameObject, type GameObjectOptions } from './game-object'
import { type HeroItemPickupEventData, type HeroPositionEventData } from './hero'
import { type LevelChangeEventData } from './level'

export class Camera extends GameObject {
  constructor() {
    super({})
    events.on<HeroPositionEventData>(constants.events.heroPosition, this, (data?) => {
      if (!data) return
      this.centerPositionOnTarget(data.position)
    })

    events.on<LevelChangeEventData>(constants.events.levelChange, this, (data?) => {
      if (!data) return
      if (!data.level?.heroPosition) return
      this.centerPositionOnTarget(data.level.heroPosition)
    })
  }

  public centerPositionOnTarget(position: Vector2) {
    const personHalf = 8
    const canvasWidth = 320
    const canvasHeight = 180
    const halfWidth = - personHalf + canvasWidth / 2
    const halfHeight = - personHalf + canvasHeight / 2
    this.position = new Vector2(
      -position.x + halfWidth,
      -position.y + halfHeight
    )
  }
}