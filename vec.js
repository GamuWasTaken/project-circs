// @ts-check

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
  @returns {number}
*/
export function get_dir(a) {
  return (a[1] > 0)
    ? Math.acos(a[0] / mag2(a))
    : 2 * Math.PI - Math.acos(a[0] / mag2(a))
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
  @returns {vec2 | null}
*/
export function div2(v, k) {
  if (k == 0) return null
  return [v[0] / k, v[1] / k]
}

/**
  @param {vec2} v
  @param {number} k
  @returns {vec2 | null}
*/
export function clamp_mag(v, k) {
  const len = mag2(v)
  if (len <= k) return v
  const normalized = div2(v, len)
  if (!normalized) return null
  return mul2(normalized, k)
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
  @param {number} angle
  @returns {vec2}
*/
export function dir2(angle) {
  return [Math.cos(angle), Math.sin(angle)]
}

/**
  @param {number} start
  @param {number} end
  @param {number} t from `range_start` to `range_end`
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

/** @type {vec2}*/
const X = [1, 0]
/** @type {vec2}*/
const Y = [0, 1]

export default {
  sub2,
  add2,
  mag2,
  div2,
  clamp_mag,
  mul2,
  lerp2,
  dir2,
  dot,
  get_dir,

  lerp,
  rand,
  clamp,
  X,
  Y
}
