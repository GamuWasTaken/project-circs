import vec from './vec.js'

/** @import { vec2 } from './vec.js'*/
/** @typedef {(parent: Segment, self: Segment) => void} Constraint */

/** @typedef {{child: Segment, constraing: Constraint}} Child */

/**
  @param {vec2} pos
  @param {number} size 
  @returns {Segment}
*/
export default function segment(pos, size) {
  return new Segment(pos, size)
}

export class Segment {
  /** @type {vec2}*/
  pos = [0, 0]
  /** @type {number}*/
  size = 10


  /** @type {Child[]} */
  childs = []


  /**
    @param {vec2} pos
    @param {number} size 
  */
  constructor(pos, size) {
    this.pos = pos
    this.size = size
  }

  /**
    @param {Segment} child 
    @param {Constraint} constraint 
  */
  add_child(child, constraint) {
    this.childs.push({ child, constraint })
  }

  propagate() {
    for (const { child, constraint } of this.childs) {
      constraint(this, child)
    }
  }

  /** @param {CanvasRenderingContext2D} ctx */
  simple_draw(ctx) {
    const [x, y] = vec.sub2([this.size / 2, this.size / 2], this.pos)
    const r = this.size;
    ctx.ellipse(x, y, r, r, 0, 0, 2 * Math.PI)
  }
}
/**
  @param {number} distance
  @returns {Constraint}
*/
export function build_distance_constraint(distance) {
  return (parent, self) => {
    const diff = vec.sub2(parent.pos, self.pos)
    const clamped = vec.clamp2(diff, distance)

    const next = vec.add2(parent.pos, clamped)

    self.pos = next
  }
}

