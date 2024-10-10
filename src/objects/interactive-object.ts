import { events } from '~/events'
import { GameObject, type GameObjectOptions } from './game-object'
import { storyFlags } from './story-flags'
import { Vector2 } from '~~/vector2'
import type { HeroPositionEventData } from './hero'
import { constants } from '~/constants'

export type Content = {
  text: string | (() => string)
  portrait: number
  bypass?: string[]
  requires?: string[]
  flag?: string
}

export type InteractiveObjectOptions = GameObjectOptions & {
  content: Content[]
}


export class InteractiveObject extends GameObject {
  public content: Content[]

  constructor(options: InteractiveObjectOptions) {
    super(options)
    this.content = options.content
    this.isSolid = true
  }

  public override draw(canvasContext: CanvasRenderingContext2D, x: number, y: number): void {
    const content = this.getContent()

    if (!content) {
      return
    }
    super.draw(canvasContext, x, y)
  }

  public override ready() {
    const content = this.getContent()

    if (!content) {
      return
    }
    events.on<HeroPositionEventData>(constants.events.heroPosition, this, (data?) => {
      if (!data) {
        return
      }
      const heroPosition: Vector2 = data?.position
      const roundedHeroPosition = new Vector2(
        Math.round(heroPosition.x),
        Math.round(heroPosition.y)
      )
      if (this.position.equals(roundedHeroPosition)) {
        this.onCollisionWithHero()
      }
    })
  }

  public getContent(): Content | undefined {
    const match: Content | undefined = storyFlags.getRelevantScenario(this.content)
    
    if (!match) {
      return
    }
    
    return match
  }

  public onCollisionWithHero() {
    
  }
}