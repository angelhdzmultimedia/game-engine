import { Input } from './src/input'

export class Vector2 {
  constructor(public x: number, public y: number) { }

  public duplicate() {
    return new Vector2(this.x, this.y)
  }

  public equals(vector: Vector2) {
    return this.x === vector.x && this.y === vector.y
  }

  public toNeighbor(direction: string) {
    let { x, y } = this
    if (direction === Input.LEFT) x -= 16
    if (direction === Input.RIGHT) x += 16
    if (direction === Input.UP) y -= 16
    if (direction === Input.DOWN) y += 16
    return new Vector2(x, y)
  }
}