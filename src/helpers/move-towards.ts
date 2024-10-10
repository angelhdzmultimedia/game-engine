import { GameObject } from '../objects/game-object'
import { Sprite } from '../sprite'
import { Vector2 } from '../../vector2'

export function moveTowards(object: GameObject | Sprite, destinationPosition: Vector2, speed: number) {
  const distanceToTravel = new Vector2(
    destinationPosition.x - object.position.x,
    destinationPosition.y - object.position.y
  )
  let distance = Math.sqrt(distanceToTravel.x ** 2 + distanceToTravel.y ** 2)

  if (distance <= speed) {
    object.position.x = destinationPosition.x
    object.position.y = destinationPosition.y
  } else {
    const normalizedPosition = new Vector2(
      distanceToTravel.x / distance,
      distanceToTravel.y / distance
    )

    object.position.x += normalizedPosition.x * speed
    object.position.y += normalizedPosition.y * speed

    distanceToTravel.x = destinationPosition.x - object.position.x
    distanceToTravel.y = destinationPosition.y - object.position.y
    distance = Math.sqrt(distanceToTravel.x ** 2 + distanceToTravel.y ** 2)
  }
  return distance
}