import { constants } from '../../../constants'
import { events } from '../../../events'
import { gridCells } from '../../../helpers/grid-cells'
import { Exit } from '../../exit/exit'
import { Hero } from '../../hero'
import { Level, type LevelChangeEventData, type LevelOptions } from '..'
import { Rod } from '../../rod'
import { resources } from '../../../resources'
import { Sprite } from '../../../sprite'
import { Vector2 } from '../../../../vector2'
import { OutdoorLevel1 } from './outdoor-level-1'
import { Character } from '../../characters/character'
import { GameObject } from '../../game-object'
import { talkedToA, talkedToB } from '../../story-flags'
import { BlueBall } from '~/objects/blue-ball'

export class CaveLevel1 extends Level {
  constructor(options: LevelOptions) {
    super(options)

   
  }

  public override ready() {
    

    this.background = new Sprite({
      resource: resources.get('Cave'),
      frameSize: new Vector2(320, 180)
    })

    const ground = new Sprite({
      resource: resources.get('CaveGround'),
      frameSize: new Vector2(320, 180)
    })
    ground.drawLayer = 'Bottom'
    this.addChild(ground)

    const exit = new Exit({
      position: new Vector2(gridCells(3), gridCells(5)),
    })

    const rod = new Rod({ position: new Vector2(gridCells(7), gridCells(6)), content: [
      { 
        bypass: ['Rod'],
        flag: 'Rod',
        portrait: 1,
        text: ''
      }
    ] })

    const blueBall = new BlueBall({ position: new Vector2(gridCells(7), gridCells(3)), content: [
      {
        bypass: [],
        requires: [],
        portrait: 1,
        text: ''
      }
    ] })

    const hero = new Hero({
      position: this.heroPosition,
    })

    const knight = new Character({
      position: new Vector2(gridCells(5), gridCells(5)),
      root: this.root,
      content: [{
        portrait: 1,
        text: 'I am the knight!',
        bypass: [talkedToB],
        flag: talkedToA
      },
      {
        portrait: 1,
        text: 'What did you do to him!? He was mute until now!',
        requires: [talkedToA, talkedToB],

      }]
    })

    const knight2 = new Character({
      position: new Vector2(gridCells(8), gridCells(5)),
      content: [{
        portrait: 1,
        text: () => `You got ${this.root?.inventory.length} items!`,
        requires: [talkedToA],
        flag: talkedToB
      },
      {
        portrait: 1,
        text: '...',
        bypass: [talkedToA],

      }
      ]
    })

    
    new Array(...[hero, knight, knight2, exit, rod, blueBall] as GameObject[])
      .forEach(gameObject => this.addObject(gameObject))
    resources.getSound('Dungeon')?.play(0, 0.1)
    events.on(constants.events.heroExit, this, () => {
      events.emit<LevelChangeEventData>(constants.events.levelChange, {
        level: new OutdoorLevel1({
          heroPosition: new Vector2(gridCells(16), gridCells(4)),
          root: this.root
        })
      })
    })
  }
}