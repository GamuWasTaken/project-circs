// @ts-check
'use strict';

// TODO take a bunch of points and make the line follow them

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
(() => {
  /** @type {(o: {x: number, y: number}) => void}*/
  const track_mouse = ({ x, y }) => { window.mouse = [x, y] }
  window.addEventListener('pointermove', track_mouse, { passive: true })
})();
window.mouse = [0, 0]

import BoneList, { follow_mouse, build_distance_constraint } from './bone.js'

(() => {
  /** @type {HTMLCanvasElement}*/
  const canvas = window.canvas

  const ctx = canvas.getContext("2d", { alpha: true })
  if (!ctx) { debugger; return }

  const fps = 1000 / 30

  const bones = new BoneList()

  // Create root bone that follows mouse
  bones.add({
    pos: [200, 200],
    size: 20
  }, [follow_mouse])

  const num_segments = 8;

  // Create child bones that follow the prev one
  for (let i = 0; i <= num_segments; i++) {
    const size = (num_segments - i) * 3 + 5
    const prev_size = (num_segments - i - 1) * 3 + 5
    bones.add({
      pos: [i, i],
      size,
      parent: i
    }, [build_distance_constraint(size + prev_size)])
  }

  setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = "#a7db75"
    ctx.lineWidth = 4

    bones.propagate()

    ctx.beginPath()
    bones.draw(ctx)
    ctx.closePath()

  }, fps)

})();
