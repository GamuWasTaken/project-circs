import { vec2 } from "./vec";


export declare global {
  interface Window {
    canvas: HTMLCanvasElement
    mouse: vec2
    ticks: number
  }
}
