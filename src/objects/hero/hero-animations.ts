export type Animation = {
  duration: number
  frames: {
    time?: number
    frame?: number
  }[]
}

export function walkAnimation(rootFrame: number = 0): Animation {
  return {
    duration: 400,
    frames: [
      {
        time: 0,
        frame: rootFrame+1
      },
      {
        time: 100,
        frame: rootFrame
      },
      {
        time: 200,
        frame: rootFrame+1
      },
      {
        time: 300,
        frame: rootFrame+2
      }
    ]
  }
}

export function idleAnimation(rootFrame: number = 0): Animation {
  return {
    duration: 400,
    frames: [
      {
        time: 0,
        frame: rootFrame
      },
    ]
  }
}

export const walkDown = walkAnimation(0)
export const walkRight = walkAnimation(3)
export const walkUp = walkAnimation(6)
export const walkLeft = walkAnimation(9)


export const idleDown = idleAnimation(1)  
export const idleRight = idleAnimation(4)
export const idleUp = idleAnimation(7)
export const idleLeft = idleAnimation(10)

export const pickUpDown = {
  duration: 400,
  frames: [
    {
      time: 0,
      frame: 12
    },
  ]
}