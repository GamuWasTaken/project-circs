
/** @typedef {[number, number]} vec2 */

/**
  @param {vec2} from
  @param {vec2} to
  @returns {vec2}
*/
export function sub2(from, to) {
  return [to[0] - from[0], to[1] - from[1]]
}

/**
  @param {vec2} a 
  @param {vec2} b 
  @returns {number}
*/
export function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1]
}

/**
  @param {vec2} a 
  @param {vec2} b 
  @returns {number}
*/
export function angle_between(a, b) {
  const cos = dot(a, b) / mag2(a) * mag2(b)
  return cos
}

/**
  @param {vec2} from
  @param {vec2} to
  @returns {vec2}
*/
export function add2(from, to) {
  return [to[0] + from[0], to[1] + from[1]]
}

/**
MAYBE make it iter gen
  @param {vec2} v
  @returns {number}
*/
export function mag2(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1])
}

/**
  @param {vec2} v
  @param {number} k
  @returns {vec2}
*/
export function div2(v, k) {
  if (k == 0) return null
  return [v[0] / k, v[1] / k]
}

/**
  @param {vec2} v
  @param {number} k
  @returns {vec2}
*/
export function clamp2(v, k) {
  const len = mag2(v)
  if (len <= k) return v

  return mul2(div2(v, len), k)
}

/**
  @param {number} a 
  @param {number} min 
  @param {number} max 
  @returns {number}
*/
export function clamp(a, min, max) {
  return Math.max(Math.min(a, max), min)
}

/**
  @param {vec2} v
  @param {number} k
  @returns {vec2}
*/
export function mul2(v, k) {
  return [v[0] * k, v[1] * k]
}

/**
  @param {vec2} start
  @param {vec2} end
  @param {number} t from 0 to 100
  @returns {vec2}
*/
export function lerp2(start, end, t) {
  return [lerp(start[0], end[0], t), lerp(start[1], end[1], t)]
}


/**
  @param {vec2} start
  @param {vec2} end
  @param {number} t from 0 to 100
  @returns {number}
*/
export function rand2(start, end) {
  return [rand(start, end), rand(start, end)]
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
export function zip(a, b, f) {
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
export function lerp(start, end, t) {
  return start * (1 - t) + end * t
}

/**
  @param {number} start
  @param {number} end
  @returns {number}
*/
export function rand(start, end) {
  return start + Math.random() * (end - start)
}

export default {
  sub2,
  add2,
  mag2,
  div2,
  clamp2,
  mul2,
  lerp2,
  rand2,
  dot_product2: dot,
  angle_between,

  zip,
  lerp,
  rand,
  clamp,
}
