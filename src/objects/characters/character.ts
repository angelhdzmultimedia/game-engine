import { resources } from '../../resources'
import { Sprite } from '../../sprite'
import { Vector2 } from '../../../vector2'
import { InteractiveObject, InteractiveObjectOptions } from '../interactive-object'


export class Character extends InteractiveObject {
  constructor(options: InteractiveObjectOptions) {
    super(options)
    this.isSolid = true
    const shadow = new Sprite({
      resource: resources.get('Shadow'),
      frameSize: new Vector2(32, 32),
      position: new Vector2(-8, -19),
    })
    this.addChild(shadow)

    const body = new Sprite({
      resource: resources.get('Knight'),
      frameSize: new Vector2(32, 32),
      hFrames: 2,
      vFrames: 1,
      position: new Vector2(-8, -20),
    })
    this.addChild(body)
  }


}