(() => {
  /** @type {HTMLCanvasElement}*/
  const canvas = window.canvas
  const ctx = canvas.getContext("2d", { alpha: true })

  const reset_size = () => {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
  }
  window.addEventListener('resize', reset_size)
  reset_size()

  const fps = 1000 / 30
  const max_points = 500
  const max_step_size = 5

  if (!ctx) { return console.error("Couldnt get the context") }

  /** @typedef {[number, number]} vec2 */
  /** @type { vec2[] }*/
  let points = []

  canvas.addEventListener('pointermove', ({ x, y }) => {

    // Just take the first point
    if (!points[0]) {
      points.unshift([x, y])
      return
    }

    // The rest interpolate so we smooth the point appearance
    const start = points[0]
    const end = [x, y]

    const diff = sub2(start, end)

    const length = mag2(diff)
    const steps = length / max_step_size
    const step = div2(diff, steps)

    for (let i = 0; i < Math.trunc(steps); i++) {
      points.unshift(
        add2(start, mul2(step, i))
      )
    }

    if (points.length > max_points) {
      points.splice(max_points)
    }

    const middle = div2(
      points.reduce((acc, cur) => add2(acc, cur)),
      points.length
    )

    points = points.map( p => lerp2(p, middle, -.06) )
    points = points.map( p => lerp2(p, points.at(0), .05) )

  })

  setInterval(() => {
    if(!points[0]) { return }
    // Clear canvas
    ctx.reset()
    ctx.strokeStyle = 'rgb(152, 224, 36)'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'

    // Paint our points
    for (const [ x, y ] of points) {
      ctx.lineTo(x, y)
    }
    ctx.stroke()

  }, fps)




  /** @type {Record<string,() => void>}*/
  const dev_tools = {
    e: () => console.log(points),
    x: () => console.clear(),
  }
  window.addEventListener('keyup', e => {
    const call = dev_tools[e.key]
    if (call) call()
  })




  /**
    @param {vec2} from
    @param {vec2} to
    @returns {vec2}
  */
  function sub2(from, to) {
    return [ to[0] - from[0], to[1] - from[1] ]
  }

  /**
    @param {vec2} from
    @param {vec2} to
    @returns {vec2}
  */
  function add2(from, to) {
    return [ to[0] + from[0], to[1] + from[1] ]
  }

  /**
    @param {vec2} v
    @returns {number}
  */
  function mag2(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1])
  }

  /**
    @param {vec2} v
    @param {number} k
    @returns {number}
  */
  function div2(v, k) {
    return [ v[0] / k, v[1] / k ]
  }

  /**
    @param {vec2} v
    @param {number} k
    @returns {number}
  */
  function mul2(v, k) {
    return [v[0] * k, v[1] * k]
  }

  /**
    @param {vec2} start
    @param {vec2} end
    @param {number} t from 0 to 100
    @returns {number}
  */
  function lerp2(start, end, t) {
    return [lerp(start[0], end[0], t), lerp(start[1], end[1], t)]
  }

  /**
    a and b should have the same length, it is not checked
    @template A
    @template B
    @template C
    @param {A[]} a
    @param {B[]} b
    @param {(A, B) => C} t from 0 to 100
    @returns {C}
  */
  function zip(a, b, f) {
    const c = Array(a.length)
    for (let i = 0; i < a.length; i++) {
      c[i] = f(a[i], b[i])
    }
    return c
  }


  /**
    @param {number} start
    @param {number} end
    @param {number} t from `range_start` to `range_end`
    @param {number} range_start
    @param {number} range_end
    @returns {number}
  */
  function lerp(start, end, t) {
    return start * (1 - t) + end * t
  }

})()

