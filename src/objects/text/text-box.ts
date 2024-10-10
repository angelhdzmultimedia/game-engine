import { resources } from '../../resources'
import { Sprite } from '../../sprite'
import { Vector2 } from '../../../vector2'
import { GameObject, type GameObjectOptions } from '../game-object'

export class TextBox extends GameObject {
  public content: string = 'This is a Sample Text. This is a Sample Text.'
  public backdrop: Sprite
  constructor(options: GameObjectOptions) {
    super({ ...options, position: new Vector2(32, 112) })
    this.backdrop = new Sprite({
      resource: resources.get('TextBox'),
      frameSize: new Vector2(256, 64)
    })
  }

  public override drawImage(canvasContext: CanvasRenderingContext2D, x: number, y: number) {
    this.backdrop.drawImage(canvasContext, x, y)
    canvasContext.font = '12px fontRetroGaming'
    canvasContext.fillStyle = '#fff'
    canvasContext.textBaseline = 'top'
    canvasContext.textAlign = 'left'

    const maxWidth = 250
    const lineHeight = 20
    const paddingLeft = 10
    const paddingTop = 12

    let words = this.content.split(' ')
    let line = ''

    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' '
      let metrics = canvasContext.measureText(testLine)
      let testWidth = metrics.width

      if (testWidth > maxWidth && n > 0) {
        canvasContext.fillText(line, x + paddingLeft, y + paddingTop)
        line = words[n] + ' '
        y += lineHeight
      } else {
        line = testLine

      }
    }
    canvasContext.fillText(line, x + paddingLeft, y + paddingTop)
  }
}