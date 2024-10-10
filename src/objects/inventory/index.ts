import { constants } from '../../constants'
import { events } from '../../events'
import { type Resource } from '../../resources'
import { Sprite } from '../../sprite'
import { Vector2 } from '../../../vector2'
import { GameObject } from '../game-object'
import { type HeroItemPickupEventData } from '../hero'

export type InventoryItem = {
  sprite: Sprite
  id: number
}

export class Inventory extends GameObject {
  public items: InventoryItem[] = []
  public index: number = 0

  public get length() {
    return this.items.length
  }

  constructor() {
    super({ position: new Vector2(0, 1) })

    this.drawLayer = 'Hud'

    events.on<HeroItemPickupEventData>(constants.events.heroItemPickUp, this, (data) => {
      if (!data) return
      this.index += 1
      this.addItem({
        id: this.index,
        sprite: data.sprite as Sprite
      })
    })
    this.update()
  }

  public addItem(resource: InventoryItem) {
  
    this.items.push(resource)
    this.update()
  }

  public removeItem(id: number) {
    this.items = this.items.filter(item => item.id !== id)
    this.update()
  }

  public update() {
    this.children.forEach(child => child.destroy())
    this.items.forEach((item, index) => {
      const sprite = new Sprite({
        resource: item.sprite.resource,
        position: new Vector2(index * 12, 0)
      })
      this.addChild(sprite)
    })
  }
}