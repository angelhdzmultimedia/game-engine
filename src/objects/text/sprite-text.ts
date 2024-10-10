import { constants } from '../../constants'
import { events } from '../../events'
import { resources } from '../../resources'
import { Sprite } from '../../sprite'
import { Vector2 } from '../../../vector2'
import { GameObject, type GameObjectOptions } from '../game-object'
import { Main } from '../main'
import { getCharacterFrame, getCharacterWidth } from './sprite-font-map'

type SpriteTextOptions = GameObjectOptions & {
  text: string | (() => string)
  portrait: number
}

export class SpriteText extends GameObject {
  public backdrop: Sprite
  public words: { wordWidth: number, characters: { width: number, sprite: Sprite }[] }[]
  public showingIndex = 0
  public textSpeed = 40
  public timeUntilNextShow = this.textSpeed
  public finalIndex: number
  public portrait: Sprite

  constructor(options: SpriteTextOptions) {
    super({
      position: new Vector2(32, 108),
      root: options.root
    })
    const text = typeof options.text === 'function' ? options.text() : options.text
    this.drawLayer = 'Hud'
    this.backdrop = new Sprite({
      resource: resources.get('TextBox'),
      frameSize: new Vector2(256, 64)
    })

    this.portrait = new Sprite({
      resource: resources.get('Portraits'),
      hFrames: 4,
      frame: options.portrait
    })



    this.words = text.split(' ').map(word => {
      let wordWidth: number = 0
      const characters = word.split('').map(character => {
        const characterWidth = getCharacterWidth(character)
        wordWidth += characterWidth
        return {
          width: characterWidth,
          sprite: new Sprite({
            resource: resources.get('SpriteFontWhite'),
            hFrames: 13,
            vFrames: 6,
            frame: getCharacterFrame(character)
          })
        }
      })

      return {
        wordWidth,
        characters
      }
    })

    this.finalIndex = this.words.reduce((acc, word) => {
      return acc + word.characters.length
    }, 0)
  }

  public override step(deltaTime: number) {
    if (this.root?.input.getActionJustPressed('Space')) {
      if (this.showingIndex < this.finalIndex) {
        this.showingIndex = this.finalIndex
        return
      }
      events.emit(constants.events.textBoxEnd)
    }

    this.timeUntilNextShow -= deltaTime
    if (this.timeUntilNextShow <= 0) {
      this.showingIndex += 1
      this.timeUntilNextShow = this.textSpeed
    }
  }


  public override drawImage(canvasContext: CanvasRenderingContext2D, x: number, y: number) {
    this.backdrop.drawImage(canvasContext, x, y)
    canvasContext.font = '12px fontRetroGaming'
    canvasContext.fillStyle = '#fff'
    canvasContext.textBaseline = 'top'
    canvasContext.textAlign = 'left'

    this.portrait.drawImage(canvasContext, x + 6, y + 6)

    const paddingLeft = 27
    const paddingTop = 9
    const lineWidthMax = 240
    const lineVerticalHeight = 14
    let currentShowingIndex = 0

    const cursor = new Vector2(x + paddingLeft, y + paddingTop)

    this.words.forEach((word) => {
      const spaceRemaining = x + lineWidthMax - cursor.x

      if (spaceRemaining < word.wordWidth) {
        cursor.x = x + paddingLeft
        cursor.y += lineVerticalHeight
      }

      word.characters.forEach((character) => {
        if (currentShowingIndex > this.showingIndex) {
          return
        }
        const { width, sprite } = character
        const withCharacterOffset = cursor.x - 5
        sprite.draw(canvasContext, withCharacterOffset, cursor.y)
        cursor.x += width
        cursor.x += 1
        currentShowingIndex += 1
      })
      cursor.x += 3
    })


  }
}