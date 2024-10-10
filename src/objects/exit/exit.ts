import { constants } from '../../constants'
import { events } from '../../events'
import { resources } from '../../resources'
import { Sprite } from '../../sprite'
import { Vector2 } from '../../../vector2'
import { GameObject, type GameObjectOptions } from '../game-object'
import { type HeroPositionEventData } from '../hero'

export class Exit extends GameObject {

  constructor(options: GameObjectOptions) {
    super(options)
    this.drawLayer = constants.gameObject.drawLayer.floor
    this.addChild(new Sprite({
      resource: resources.get('Exit')
    }))

  }

  public override ready() {
    events.on<HeroPositionEventData>(constants.events.heroPosition, this, (data?) => {
      if (!data) {
        return
      }
      const heroPosition: Vector2 = data.position
      const roundedHeroPosition = new Vector2(
        Math.round(heroPosition.x),
        Math.round(heroPosition.y)
      )
      if (this.position.equals(roundedHeroPosition)) {
        events.emit(constants.events.heroExit)
      }
    })
  }

  public onCollisionWithHero() {

  }
}