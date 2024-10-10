import { Sound } from '~/sound'
import { constants } from '../../constants'
import { events } from '../../events'
import { Input } from '../../input'
import { Camera } from '../camera'
import { GameObject, type GameObjectOptions } from '../game-object'
import { type HeroActionRequest } from '../hero'
import { Inventory } from '../inventory'
import { Level, type LevelChangeEventData } from '../level'
import { storyFlags } from '../story-flags'
import { SpriteText } from '../text/sprite-text'
import { Sprite } from '~/sprite'
import { resources, ResourceType, type Resource } from '~/resources'
import { Vector2 } from '~~/vector2'

export class Main extends GameObject {
  public input = new Input()
  public camera = new Camera()
  public level?: Level
  public inventory = new Inventory()

  constructor(options: GameObjectOptions) {
    super(options)
  }

  public override ready() {
    this.addChild(this.inventory)

    events.on<LevelChangeEventData>(constants.events.levelChange, this, (data?) => {
      if (!data) return
      this.setLevel(data.level)
    })

    events.on<HeroActionRequest>(constants.events.heroActionRequest, this, (data) => {
      if (typeof data?.object.getContent === 'function') {
        const content = data.object.getContent()

        if (!content) {
          return
        }

        if (content.flag) {
          storyFlags.add(content.flag)
        }

        const textBox = new SpriteText({
          text: content.text,
          portrait: content.portrait,
          root: this
        })
      this.addChild(textBox)
      events.emit(constants.events.textBoxStart)
      const endingSubcription = events.on(constants.events.textBoxEnd, this, () => {
        textBox.destroy()
        events.off(endingSubcription)
      })
      }
      
    })
  }

  public setLevel(level: Level) {
    if (this.level) this.level.destroy()
      
    const id = events.on('MainFadeOut', this, () => {
      this.level = level
      this.addChild(level)
      events.unsubscribe(id)
    })
    this.fadeOut(5000)
  }

  private fadeOut(duration: number) {
    const black = new Sprite({
      resource: resources.get('Black'),
      frameSize: new Vector2(320, 180),
    })
    black.drawLayer = 'Hud'
    this.addChild(black)
    const id = events.on('SoundFadeOutAll', this, () => {
      this.removeChild(black)
      events.emit('MainFadeOut')
      events.unsubscribe(id)
    })
    Sound.fadeOutAll(duration)
  }

  public drawBackground(canvasContext: CanvasRenderingContext2D) {
    this.level?.background?.drawImage(canvasContext, 0, 0)
  }

  public drawObjects(canvasContext: CanvasRenderingContext2D) {
    this.children.forEach(child => {
      if (child.drawLayer !== 'Hud') {
        child.draw(canvasContext, 0, 0)
      }
    })
  }

  public drawForeground(canvasContext: CanvasRenderingContext2D) {
    this.children.forEach(child => {
      if (child.drawLayer === 'Hud') {
        child.draw(canvasContext, 0, 0)
      }
    })
  }
}
