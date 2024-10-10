import { constants } from '../../constants'
import { Sprite } from '../../sprite'
import { Vector2 } from '../../../vector2'
import { GameObject, type GameObjectOptions } from '../game-object'
import { Main } from '../main'
import { Sound } from '~/sound'

export type LevelChangeEventData = {
  level: Level
}

export type LevelOptions = GameObjectOptions & {
  heroPosition?: Vector2
}

export class Level extends GameObject {
  public background?: Sprite
  public tiles = new Set<string>()
  public heroPosition?: Vector2

  constructor(options: LevelOptions) {
    super(options)
    
    this.heroPosition = options.heroPosition ?? constants.hero.defaultPosition
  }

  public addObject(gameObject: GameObject) {
    this.addChild(gameObject)
    gameObject.root = this.root
  }
}