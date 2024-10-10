import { constants } from '../../constants'
import { events } from '../../events'
import { resources } from '../../resources'
import { Sprite } from '../../sprite'
import { Vector2 } from '../../../vector2'
import { GameObject, type GameObjectOptions } from '../game-object'
import { type HeroItemPickupEventData, type HeroPositionEventData } from '../hero'
import { storyFlags } from '../story-flags'
import { InteractiveObject, type InteractiveObjectOptions } from '../interactive-object'

export class BlueBall extends InteractiveObject {
  constructor(options: InteractiveObjectOptions) {
    super(options)
    this.isSolid = false
    const sprite = new Sprite({
      resource: resources.get('BlueBall'),
      position: new Vector2(0, -3)
    })
    this.addChild(sprite)

  }

  

  public override onCollisionWithHero() {
    console.log('Collided with hero!')
    this.destroy()

    //storyFlags.add('Rod')

    events.emit<HeroItemPickupEventData>(constants.events.heroItemPickUp, {
      sprite: new Sprite({
        resource: resources.get('BlueBallInventory'),
        position: new Vector2(0, -3)
      }),
      position: this.position,
      item: this,
      sound: 'ItemPickUp'
    })
  }
}