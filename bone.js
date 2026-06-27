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

    const points = this.outline_points()

    ctx.beginPath()
    // ctx.strokeStyle = "red"
    // ctx.lineWidth = 1

    ctx.moveTo(...points[0])

    for (const point of points) {
      ctx.lineTo(...point)
    }

    const head_angle = this.bone_angle(1, 0) - Math.PI / 2
    ctx.arc(...this.#pos[0], this.#size[0], head_angle, head_angle + Math.PI)

    ctx.stroke()
    ctx.closePath()
  }

  // Points returns the 90 and 270 points, and in draw we use arc for head and tail
  // TODO test it and fit draw to use this

  /**
     @param {number} head_i
     @param {number} tail_i
  */
  bone_angle(head_i, tail_i) {
    const head = this.#pos[head_i]
    const tail = this.#pos[tail_i]

    return vec.get_dir(vec.sub2(head, tail))
  }

  /**
    @returns {vec2[]}
  */
  outline_points() {
    const points = Array(this.#len * 2)

    // Code duplication brought to you by "not having a branch in a tight loop :)"
    // First point has no prev so we use next
    const angle = this.bone_angle(1, 0)

    const l_point = vec.mul2(vec.dir2(angle + Math.PI / 2), this.#size[0])
    const r_point = vec.mul2(vec.dir2(angle - Math.PI / 2), this.#size[0])

    points[0] = vec.add2(this.#pos[0], l_point)
    points[this.#len * 2 - 1] = vec.add2(this.#pos[0], r_point)

    // Rest of the points
    for (let i = 1; i < this.#len; i++) {
      const angle = this.bone_angle(i, i - 1)

      const l_point = vec.mul2(vec.dir2(angle + Math.PI / 2), this.#size[i])
      const r_point = vec.mul2(vec.dir2(angle - Math.PI / 2), this.#size[i])

      points[i] = vec.add2(this.#pos[i], l_point)
      points[this.#len * 2 - i - 1] = vec.add2(this.#pos[i], r_point)
    }

    return points
  }

}

/**
 * @param {number} max
 * @param {number} min
 * @returns {Constraint}
 */
export function build_follow_mouse(max, min) {
  return (_, self) => {
    const diff = vec.sub2(self, window.mouse)

    const dist = vec.mag2(diff)
    if (dist < 30) return self

    return vec.add2(
      self,
      vec.clamp_mag(diff, vec.clamp(dist / min, min, max)) ?? [0, 0]
    )
  }
}

/**
  @param {number} distance
  @returns {Constraint}
*/
export function build_distance_constraint(distance) {
  return (parent, self) => {
    const diff = vec.sub2(parent, self)
    const clamped = vec.clamp_mag(diff, distance)

    return vec.add2(parent, clamped ?? [0, 0])
  }
}

/**
  @param {number} deviation 
  @param {number} offset
  @returns {Constraint}
*/
export function build_circle_path(deviation, offset) {
  const sign = Math.sign(Math.random() - .5)
  return (_, _self) => {

    /** @type {vec2} */
    const center = [window.innerWidth / 2, window.innerHeight / 2]
    const rate = window.ticks / (100 + offset) + offset

    const dir = vec.dir2(rate * sign)

    const size =
      Math.min(...center)
      - deviation
      + Math.cos(rate * Math.PI) * (deviation + offset) / 2

    return vec.add2(center, vec.mul2(dir, size))
  }
}

/**
   @returns {BoneList}
   @param {number} offset
*/
export function build_fish(offset) {

  const bones = new BoneList()

  // [size, distance]
  const segments = [
    // Head
    [10, 10], [14, 10], [14, 10],
    // Front Fins
    [20, 2], [24, 2], [26, 2], [28, 2],
    // Body
    [12, 1], [14, 15], [14, 15], [12, 5],
    // Back Fins
    [18, 1], [22, 3],
    // Tail
    [10, 5], [8, 15], [6, 15], [4, 15], [2, 15], [0, 15]
  ]

  // Create child bones that follow the prev one
  for (const [i, [size, distance]] of segments.entries()) {
    // const prev_size = segment_sizes[i - 1] ?? 20
    bones.add({
      pos: [i, i],
      size,
      parent: i == 0 ? i : i - 1
    }, [
      i == 0
        ? build_circle_path(150, offset)
        : build_distance_constraint(distance)
    ])
  }

  return bones
}
