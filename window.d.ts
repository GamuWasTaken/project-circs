import { vec2 } from "./vec";


declare global {
  interface Window {
    canvas: HTMLCanvasElement
    mouse: vec2
  }
}
