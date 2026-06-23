// @ts-check
/** @import {vec2} from './vec.js' */
/** @typedef {(parent: vec2, self: vec2) => vec2} Constraint */

/** @typedef {{
  pos: vec2,
  size: number
  parent?: number
}} BoneData */

import vec from './vec.js'

export default class BoneList {
  /** @type {vec2[]} */
  #pos = []
  /** @type {(number)[]} */
  #parent = []
  /** @type {(number)[]} */
  #size = []
  /** @type {Constraint[][]} */
  #constraints = []

  /** @type {number} */
  #len = 0

  constructor() { } // MAYBE i need to init inside

  /**
    @param {BoneData} data
    @param {Constraint[]} constraints 
    @returns {number} The number of bones
  */
  add({ pos, size, parent }, constraints) {
    this.#pos.push(pos)
    this.#size.push(size)
    this.#constraints.push(constraints)
    this.#parent.push(parent ?? this.#len)
    this.#len += 1

    return this.#len
  }

  propagate() {
    for (let i = 0; i < this.#len; i++) {
      const parent = this.#parent[i]
      for (const constraint of this.#constraints[i]) {
        this.#pos[i] = constraint(this.#pos[parent], this.#pos[i])
      }
    }
  }

  /** @param {CanvasRenderingContext2D} ctx */
  draw(ctx) {
    ctx.beginPath()
    // TODO calc all the points, put them in an array and the paint them
    // - This way we can interpolate and add beziers to smooth the segments
    // TODO add min angle forces to avoid it collapsing on itself
    const head_l = this.calc_point_around(0, 3*Math.PI / 4)
    const head_r = this.calc_point_around(0, -3*Math.PI / 4)
    const head = this.calc_point_around(0, Math.PI)
    ctx.lineTo(...head)
    ctx.lineTo(...head_l)

    for (let i = 1; i < this.#len; i++) {
      const r270 = this.calc_point_around(i, -Math.PI / 2)
      ctx.lineTo(...r270)
    }

    const tail = this.calc_point_around(this.#len - 1, Math.PI)
    ctx.lineTo(...tail)

    for (let i = this.#len - 1; i > 0; i--) {

      const r90 = this.calc_point_around(i, Math.PI / 2)
      ctx.lineTo(...r90)

    }

    ctx.lineTo(...head_r)
    ctx.lineTo(...head)

    ctx.stroke()
  }

  /**
    @param {number} i
    @param {number} offset
    @returns {vec2}
   */
  calc_point_around(i, offset) {
    const head = this.#pos[i]
    const tail = i != 0 ? this.#pos[i - 1] : this.#pos[i + 1]

    const angle = vec.heading(vec.sub2(head, tail))
    const left = angle + offset
    const point = vec.add2(
      this.#pos[i],
      vec.mul2([Math.cos(left), Math.sin(left)], this.#size[i])
    )

    return point
  }

}


/** @type {Constraint} */
export function follow_mouse(_, self) {
  const diff = vec.sub2(self, window.mouse)

  const dist = vec.mag2(diff)
  if(dist < 30) return self

  return vec.add2(
    self,
    vec.clamp2(diff, vec.clamp(dist / 10, 10, 30))
  )
}

/**
  @param {number} distance
  @returns {Constraint}
*/
export function build_distance_constraint(distance) {
  return (parent, self) => {
    const diff = vec.sub2(parent, self)
    const clamped = vec.clamp2(diff, distance)

    return vec.add2(parent, clamped)
  }
}

