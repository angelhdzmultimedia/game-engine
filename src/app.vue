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

let mainScene: Main



onMounted(() => {
  alert('App.onMounted')
  Sound.stopAll()
  mainScene = new Main({
    canvas: gameCanvas.value,
    position: new Vector2(0, 0),
  })

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
  
  
    mainScene.start()
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