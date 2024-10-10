import { gridCells } from '../../../helpers/grid-cells'
import { Exit } from '../../exit/exit'
import { Hero } from '../../hero'
import  { Level, type LevelChangeEventData, type LevelOptions } from '..'
import { Rod } from '../../rod'
import { resources } from '../../../resources'
import { Sprite } from '../../../sprite'
import { Vector2 } from '../../../../vector2'
import { constants } from '../../../constants'
import { events } from '../../../events'
import { CaveLevel1 } from './cave-level-1'

export class OutdoorLevel1 extends Level {
  constructor(options: LevelOptions) {
    super(options)
    

    this.background = new Sprite({
      resource: resources.get('Sky'),
      frameSize: new Vector2(320, 180),
    })

    const ground = new Sprite({
      resource: resources.get('Ground'),
      frameSize: new Vector2(320, 180)
    })
    ground.drawLayer = 'Bottom'

    this.addChild(ground)
    const exit = new Exit({
      position: new Vector2(gridCells(6), gridCells(3))
    })
    this.addChild(exit)


    const hero = new Hero({
      position: this.heroPosition,
      root: this.root,
    })
    this.addChild(hero)

    const rod = new Rod({ position: new Vector2(gridCells(7), gridCells(6)), root: this.root, content: [
      { 
        bypass: ['Rod'],
        flag: 'Rod',
        portrait: 1,
        text: ''
      }
    ] })
    this.addChild(rod)

    this.tiles.add(`64,48`)
    this.tiles.add(`64,64`)
    this.tiles.add(`64,80`)
    this.tiles.add(`80,64`)
    this.tiles.add(`80,80`)
    this.tiles.add(`112,80`)
    this.tiles.add(`128,80`)
    this.tiles.add(`144,80`)
    this.tiles.add(`160,80`)
  }


  public override ready() {
    resources.getSound('OverWorld')?.play(0)
    events.on(constants.events.heroExit, this, () => {
      events.emit<LevelChangeEventData>(constants.events.levelChange, {
        level: new CaveLevel1({
          heroPosition: new Vector2(gridCells(3), gridCells(6)),
          root: this.root
        })
      })
    })
  }
}

