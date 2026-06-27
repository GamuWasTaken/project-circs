// @ts-check
'use strict';

// TODO take a bunch of points and make the line follow them
// TODO for skins use ctx.clip() with some cool noise function

/// Resize canvas
(() => {
  /** @type {HTMLCanvasElement}*/
  const canvas = window.canvas

  const reset_size = () => {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
  }
  window.addEventListener('resize', reset_size, { passive: true })
  reset_size()
})();

/// Track mouse
window.mouse = [0, 0];
(() => {
  /** @type {(o: {x: number, y: number}) => void}*/
  const track_mouse = ({ x, y }) => { window.mouse = [x, y] }
  window.addEventListener('pointermove', track_mouse, { passive: true })
})();

/// Track ticks
window.ticks = 0;
(() => {
  const update_tick = () => {
    window.ticks += 1
    requestAnimationFrame(update_tick)
  }
  requestAnimationFrame(update_tick)
})();

import BoneList, { build_follow_mouse, build_distance_constraint, build_circle_path, build_fish } from './bone.js'
(() => {
  /** @type {HTMLCanvasElement}*/
  const canvas = window.canvas

  const ctx = canvas.getContext("2d", { alpha: true })
  if (!ctx) { debugger; return }

  const bones = build_fish(0)

  const fishes = [
    build_fish(0),
    build_fish(10),
    build_fish(20),
  ]

  const step = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = "#a7db75"
    ctx.lineWidth = 4

    for (const fish of fishes) {
      fish.propagate()

      // ctx.beginPath()
      fish.draw(ctx)
      // ctx.closePath()

    }
    requestAnimationFrame(step)
  }

  requestAnimationFrame(step)

})();
