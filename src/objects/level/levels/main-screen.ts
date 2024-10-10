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

export class MainScreen extends Level {
  public playButton: Sprite
  constructor(options: LevelOptions) {
    super(options)
    
    ;(async() => {
      document.addEventListener('keydown', (event: KeyboardEvent) => {
       
      })
          
    })
    


    this.background = new Sprite({
      resource: resources.get('Sky'),
      frameSize: new Vector2(320, 180),
    })

    this.playButton = new Sprite({
      resource: resources.get('PlayGameButton'),
      frameSize: new Vector2(100, 30),
      position: new Vector2((320 - 100) /2, (180 - 30) /2),
      root: this.root
    })
    this.addChild(this.playButton)
  }

  public override step(deltaTime: number): void {
    let {x, y} = this.playButton.position

    const clientX = this.root?.input.mousePosition.x ?? 0
    const clientY = this.root?.input.mousePosition.y ?? 0
    if (clientX >= x && clientX <= (x + 100)  && clientY >= y && clientY <= (y + 30 )) {
      this.playButton.opacity = 0.5
      document.body.style.setProperty('cursor', 'pointer')
    } else {
      this.playButton.opacity = 1
      document.body.style.setProperty('cursor', 'default')

    }
    if (this.playButton.isClicked()) {
      document.body.style.setProperty('cursor', 'default')

      events.emit<LevelChangeEventData>(constants.events.levelChange, {
        level: new CaveLevel1({
          heroPosition: new Vector2(gridCells(3), gridCells(6)),
          root: this.root
        })
      })
    }
  }


  public override ready() {
    
      resources.getSound('Title')?.play()
   
   
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

