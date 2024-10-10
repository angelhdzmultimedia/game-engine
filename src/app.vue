<script lang="ts" setup>
import { constants } from './constants'
import { events } from './events'
import { GameLoop } from './game-loop'
import { gridCells } from './helpers/grid-cells'
import { CaveLevel1 } from './objects/level/levels/cave-level-1'
import { Main } from './objects/main'
import { resources } from './resources'
import { Vector2 } from '../vector2'
import { MainScreen } from './objects/level/levels/main-screen'
import { Sound } from './sound'



// Grabbing the canvas to draw to
const gameCanvas = ref<HTMLCanvasElement>()
const canvasContext = ref<CanvasRenderingContext2D>()

const mainScene = new Main({
  position: new Vector2(0, 0),
})


// Establish update and draw loops
const update = (deltaTime: number) => {
  mainScene.stepEntry(deltaTime)
  mainScene.input.update()
}

const render = () => {
  if (!canvasContext.value || !gameCanvas.value) return
  canvasContext.value.clearRect(0, 0, gameCanvas.value.width, gameCanvas.value.height)
  mainScene.drawBackground(canvasContext.value)

  canvasContext.value.save()
  if (mainScene.camera) {
    canvasContext.value?.translate(mainScene.camera.position.x, mainScene.camera.position.y)
  }
  mainScene.drawObjects(canvasContext.value)
  canvasContext.value?.restore()
  mainScene.drawForeground(canvasContext.value)
}

// Start the game!
const gameLoop = new GameLoop(update, render)

onMounted(() => {
  Sound.stopAll()
  canvasContext.value = gameCanvas.value?.getContext('2d')!
  if (!gameCanvas.value) return
  if (!canvasContext.value) return
  events.on('ResourceAdded', resources, (resource) => {
    console.log(`Added resource: ${JSON.stringify(resource)}`)
  })
  
  events.on('ResourceLoaded', resources, (resource) => {
    console.log(`Loaded resource: ${JSON.stringify(resource)}`)
  })
  
  
  events.on('AllLoaded', resources, () => {

    console.log('All loaded!')
    mainScene.setLevel(new MainScreen({
      root: mainScene
    })) 
  
    mainScene.drawBackground(canvasContext.value!)
  
   gameLoop.start()
  })

  resources.addMany([
    ...constants.media.sounds,
    ...constants.media.images,
  ])

  resources.load()
})



</script>

<template>
  <div>
    <canvas width="320" height="180" style="width: 320px; height: 180px;" ref="gameCanvas"></canvas>
  
  </div>
</template>

<style>
body, html {
  padding: 0;
  margin: 0;
  overflow: hidden;
  image-rendering: pixelated;
  width: 100%;
  height: 100%;
}

canvas {
 
  background: blue;
}

@font-face {
  font-family: fontRetroGaming;
  src: url("/fonts/Retro Gaming.ttf");
}
</style>