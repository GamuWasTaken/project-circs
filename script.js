'use strict';

// TODO take a bunch of points and make the line follow them
// TODO pass segment from class to ecs, and fix the displaced bug
// - easier to access childs and removes the linked list call propagation 
// - lighter to operate on

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
  const track_mouse = ({ x, y }) => { window.mouse = [x, y] }
  window.addEventListener('pointermove', track_mouse, { passive: true })
})();
window.mouse = [0, 0]

import segment, { build_distance_constraint } from './segments.js'
import vec from './vec.js';

(() => {
  /** @type {HTMLCanvasElement}*/
  const canvas = window.canvas
  const ctx = canvas.getContext("2d", { alpha: true })

  const fps = 1000 / 30
  const max_points = 500
  const max_step_size = 5
  const line_width = 4

  if (!ctx) { debugger }

  const a = segment([10, 10], 8)
  const num_segments = 8;
  const segments = [a]
  for (let i = 0; i <= num_segments; i++) {
    const size = (num_segments - i)*3 + 5

    segments.push(segment([i, i], size))
    segments[i].add_child(
      segments[i + 1],
      build_distance_constraint(size + segments[i].size)
    )
  }

  setInterval(() => {
    ctx.reset()
    ctx.strokeStyle = "#a7db75"
    ctx.lineWidth = line_width

    const dist = vec.sub2(a.pos, window.mouse)
    a.pos = vec.add2(
      a.pos,
      vec.clamp2(dist, vec.clamp(vec.mag2(dist) / 10, 10, 30))
    )

    for (const segment of segments) {
      ctx.beginPath()

      segment.propagate()
      segment.simple_draw(ctx)

      ctx.stroke()
    }

  }, fps)

  return

  /** @import { vec2 } from './vec.js'*/
  /** @typedef { () => vec2[] } Generate */
  /** @typedef { (points: vec2[]) => vec2[] } Update */
  /** @typedef { (points: vec2[]) => () } Draw */

  /** @type {Generate} */
  const linearly_interpolated_max_length_mouse = points => {
    if (!window.mouse) { return }

    const [x, y] = window.mouse

    // Just take the first point
    if (!points[0]) {
      return points.unshift([x, y])
    }

    // The rest interpolate so we smooth the point appearance
    const start = points[0]
    const end = [x, y]

    const diff = sub2(start, end)

    const length = mag2(diff)
    const steps = length / max_step_size

    // Dont add points if length is not reached
    if (steps == 0) {
      return points.unshift([x, y])
    }

    const step = div2(diff, steps)
    for (let i = 0; i < Math.trunc(steps); i++) {
      points.unshift(
        add2(start, mul2(step, i))
      )
    }
    points.unshift([x, y])
  }

  /** @type {Draw} */
  const simple_drawer = points => {
    // Clear canvas
    ctx.reset()
    ctx.strokeStyle = 'rgb(152, 224, 36)'
    ctx.lineWidth = 5
    ctx.lineCap = 'round'

    // Paint our points
    for (const [x, y] of points) {
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }


  /** @type {(dir: vec2) => Update} */
  const create_wind = dir => points => {
    let general_direction = [0, 0]
    points.reduce((acc, cur) => {
      general_direction = div2(add2(general_direction, sub2(cur, acc)), 1)
      return cur
    }, points[0] ?? [0, 0])

    return points.map(p => add2(p, general_direction))
  }
  /** @type {(mag: number) => Update} */
  const create_cohesion = mag => points => {
    const middle = div2(points.reduce(add2, [0, 0]), points.length || 1)
    return points.map(p => lerp2(p, middle, mag))
  }

  /** @type {(mag: number) => Update} */
  const create_jitter = mag => points => {
    const r = rand2(-mag, mag)
    return points.map((p, i) => {
      const scaling = ((points.length - i) / points.length) ?? 0
      return add2(p, mul2(r, scaling))
    })
  }

  /** @type {vec2[]}*/
  let points = []

  /** @type {Generate} */
  const generate = linearly_interpolated_max_length_mouse
  /** @type {Update[]} */
  const updates = [
    // create_cohesion(.001),
    create_wind([0, 0]),
    // create_jitter(10)
  ]
  /** @type {Draw} */
  const draw = simple_drawer


  setInterval(() => {
    // Create new points
    generate(points)
    // Modify them
    for (const update of updates) {
      points = update(points)
    }
    // Remove old points
    if (points.length > max_points) {
      points.splice(max_points)
    }
    // Draw them
    draw(points)

  }, fps)


  /** @type {Record<string,() => void>}*/
  const dev_tools = {
    e: () => console.table(points),
    x: () => console.clear(),
  }
  window.addEventListener('keyup', e => {
    const call = dev_tools[e.key]
    if (call) call()
  })

})();
