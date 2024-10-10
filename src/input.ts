import  { Vector2 } from '~~/vector2'

export class Input {
  public static UP = 'UP'
  public static DOWN = 'DOWN'
  public static LEFT = 'LEFT'
  public static RIGHT = 'RIGHT'

  public keys: Record<string, boolean> = {}
  public lastKeys: Record<string, boolean> = {}
  public mousePosition: Vector2 = new Vector2(0, 0)
  public mouseButtons: Record<number, boolean> = {}

  private readonly heldDirections: string[] = []

  public mouseButton(index: number) {
    return this.mouseButtons[index]
  }

  constructor() {
    //Mouse 
    document.addEventListener('mousemove', (event: MouseEvent) => {
      this.mousePosition = new Vector2(event.clientX, event.clientY)
    })

    document.addEventListener('mouseup', (event: MouseEvent) => {
      this.mouseButtons[event.button] = false
    })

    document.addEventListener('mousedown', (event: MouseEvent) => {
      this.mouseButtons[event.button] = true

    })

    // Keyboard
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      this.keys[event.code] = true
      if (event.code === 'ArrowUp' || event.code === 'KeyW') {
        this.onArrowPressed(Input.UP)
        
      }

      if (event.code === 'ArrowDown' || event.code === 'KeyS') {
        this.onArrowPressed(Input.DOWN)
      }

      if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        this.onArrowPressed(Input.LEFT)
      }

      if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        this.onArrowPressed(Input.RIGHT)
      }
    })

    document.addEventListener('keyup', (event: KeyboardEvent) => {
      this.keys[event.code] = false
      if (event.code === 'ArrowUp' || event.code === 'KeyW') {
        this.onArrowReleased(Input.UP)
        
      }

      if (event.code === 'ArrowDown' || event.code === 'KeyS') {
        this.onArrowReleased(Input.DOWN)
      }

      if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        this.onArrowReleased(Input.LEFT)
      }

      if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        this.onArrowReleased(Input.RIGHT)
      }
    })
  }

  public update() {
    this.lastKeys = {...this.keys}
  }

  public getActionJustPressed(keyCode: string) {
    let justPressed = false
    if (this.keys[keyCode] && !this.lastKeys[keyCode]) {
      justPressed = true
    }
    return justPressed
  }

  private onArrowPressed(direction: string) {
    if (this.heldDirections.indexOf(direction) === -1) {
      this.heldDirections.unshift(direction)
    }
  }

  public get direction() {
    return this.heldDirections[0]
  }

  private onArrowReleased(direction: string) {
    const index = this.heldDirections.indexOf(direction)
    if (index !== -1) {
      this.heldDirections.splice(index, 1)
    }
  }
}