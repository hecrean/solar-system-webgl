/* tslint:disable */
/* eslint-disable */
/**
 */
export class CelestialBody {
  free(): void;
  /**
   * @param {Position} position
   * @param {Velocity} velocity
   * @param {Time} time
   * @param {number} dt_in_days
   * @returns {CelestialBody}
   */
  static new(position: Position, velocity: Velocity, time: Time, dt_in_days: number): CelestialBody;
  /**
   */
  tick_one_day(): void;
}
/**
 */
export class Position {
  free(): void;
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Position}
   */
  static new(x: number, y: number, z: number): Position;
}
/**
 */
export class Time {
  free(): void;
  /**
   * @param {number} year
   * @param {number} month
   * @param {number} day
   * @returns {Time}
   */
  static new(year: number, month: number, day: number): Time;
}
/**
 */
export class Velocity {
  free(): void;
  /**
   * @param {number} vx
   * @param {number} vy
   * @param {number} vz
   * @returns {Velocity}
   */
  static new(vx: number, vy: number, vz: number): Velocity;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_position_free: (a: number) => void;
  readonly position_new: (a: number, b: number, c: number) => number;
  readonly __wbg_time_free: (a: number) => void;
  readonly time_new: (a: number, b: number, c: number) => number;
  readonly __wbg_celestialbody_free: (a: number) => void;
  readonly celestialbody_new: (a: number, b: number, c: number, d: number) => number;
  readonly celestialbody_tick_one_day: (a: number) => void;
  readonly __wbg_velocity_free: (a: number) => void;
  readonly velocity_new: (a: number, b: number, c: number) => number;
}

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {InitInput | Promise<InitInput>} module_or_path
 *
 * @returns {Promise<InitOutput>}
 */
export default function init(module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
