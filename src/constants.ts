import { gridCells } from './helpers/grid-cells'
import { ResourceType } from './resources'
import { Vector2 } from '../vector2'

export namespace constants {
  export const events = {
    heroPosition: 'HeroPosition',
    heroItemPickUp: 'HeroItemPickUp',
    heroExit: 'HeroExit',
    levelChange: 'LevelChange',
    heroActionRequest: 'HeroActionRequest',
    textBoxEnd: 'TextBoxEnd',
    textBoxStart: 'TextBoxStart',

  } as const

  export const hero = {
    defaultPosition: new Vector2(gridCells(6), gridCells(5)),
  } as const

  export const gameObject = {
    drawLayer: {
      floor: 'Floor',
      bottom: 'Bottom',
      hud: 'Hud'
    }
  } as const

  export const media = {
    sounds: [
      {
        url: '/sounds/item-pickup.ogg',
        name: 'ItemPickUp',
        type: ResourceType.sound
      },
      {
        url: '/sounds/overworld.ogg',
        name: 'OverWorld',
        type: ResourceType.sound
      },
      {
        url: '/sounds/title.ogg',
        name: 'Title',
        type: ResourceType.sound
      },
      {
        url: '/sounds/main-action-areas.ogg',
        name: 'Dungeon',
        type: ResourceType.sound
      },
    ],
    images: [
      {
        url: '/sprites/sky.png',
        name: 'Sky',
        type: ResourceType.image
      },
      {
        url: '/sprites/black.png',
        name: 'Black',
        type: ResourceType.image
      },
      {
        url: '/sprites/ground.png',
        name: 'Ground',
        type: ResourceType.image
      },
      {
        url: '/sprites/hero-sheet.png',
        name: 'Hero',
        type: ResourceType.image
      },
      {
        url: '/sprites/blue-ball.png',
        name: 'BlueBall',
        type: ResourceType.image
      },
      {
        url: '/sprites/blue-ball-inventory.png',
        name: 'BlueBallInventory',
        type: ResourceType.image
      },
      { url: '/sprites/play-game-button.png', name: 'PlayGameButton', type: ResourceType.image },
      { url: '/sprites/shadow.png', name: 'Shadow', type: ResourceType.image },
      { url: '/sprites/rod.png', name: 'Rod', type: ResourceType.image },
      { url: '/sprites/rod-inventory.png', name: 'RodInventory', type: ResourceType.image },
      { url: '/sprites/cave.png', name: 'Cave', type: ResourceType.image },
      { url: '/sprites/cave-ground.png', name: 'CaveGround', type: ResourceType.image },
      { url: '/sprites/exit.png', name: 'Exit', type: ResourceType.image },
      { url: '/sprites/knight-sheet-1.png', name: 'Knight', type: ResourceType.image },
      { url: '/sprites/text-box.png', name: 'TextBox', type: ResourceType.image },
      { url: '/sprites/sprite-font-white.png', name: 'SpriteFontWhite', type: ResourceType.image },
      { url: '/sprites/portraits-sheet.png', name: 'Portraits', type: ResourceType.image },
    ]
  } as const
}