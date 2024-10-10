
export class GameLoop {
  public lastFrameTime = 0
  public accumulatedTime = 0
  public timeStep = 1000 / 60
  public requestAnimationFrameId?: number
  public isRunning = false
  public update: (deltaTime: number) => void
  public render: () => void

  constructor(
    update: (deltaTime: number) => void, 
    render: () => void
  ) {
    this.update = update 
    this.render = render
  }

  public mainLoop = (timestamp: number) => {
    if (!this.isRunning) {
      return
    }
   
    let deltaTime = timestamp - this.lastFrameTime
    this.lastFrameTime = timestamp
    this.accumulatedTime += deltaTime

    while (this.accumulatedTime >= this.timeStep) {
      this.update(this.timeStep)
      this.accumulatedTime -= this.timeStep
    }
    
    this.render()
    this.requestAnimationFrameId = requestAnimationFrame(this.mainLoop)
  }

  public start() {
    if (!this.isRunning) {
      console.log('Game Started')
      this.isRunning = true
      this.requestAnimationFrameId = requestAnimationFrame(this.mainLoop)
    }
  }

  public stop() {
    if (this.requestAnimationFrameId) {
      cancelAnimationFrame(this.requestAnimationFrameId)
    }
    this.isRunning = false

  }
}