export function checkTiles(tiles: Set<string>, x: number, y: number) {
  const tile = `${x},${y}`
  const isTileWalkable = tiles.has(tile)
  return !isTileWalkable
}