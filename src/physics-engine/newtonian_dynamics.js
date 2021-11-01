// HMJ
let wasm;

const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;

function getUint8Memory0() {
  if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
    cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }

  return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function _assertClass(instance, klass) {
  if (!(instance instanceof klass)) {
    throw new Error(`expected instance of ${klass.name}`);
  }

  return instance.ptr;
}
/**
 */
export class CelestialBody {
  static __wrap(ptr) {
    const obj = Object.create(CelestialBody.prototype);
    obj.ptr = ptr;

    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;

    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_celestialbody_free(ptr);
  }
  /**
   * @param {Position} position
   * @param {Velocity} velocity
   * @param {Time} time
   * @param {number} dt_in_days
   * @returns {CelestialBody}
   */
  static new(position, velocity, time, dt_in_days) {
    _assertClass(position, Position);
    const ptr0 = position.ptr;
    position.ptr = 0;
    _assertClass(velocity, Velocity);
    const ptr1 = velocity.ptr;
    velocity.ptr = 0;
    _assertClass(time, Time);
    const ptr2 = time.ptr;
    time.ptr = 0;
    const ret = wasm.celestialbody_new(ptr0, ptr1, ptr2, dt_in_days);

    return CelestialBody.__wrap(ret);
  }
  /**
   */
  tick_one_day() {
    wasm.celestialbody_tick_one_day(this.ptr);
  }
}
/**
 */
export class Position {
  static __wrap(ptr) {
    const obj = Object.create(Position.prototype);
    obj.ptr = ptr;

    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;

    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_position_free(ptr);
  }
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Position}
   */
  static new(x, y, z) {
    const ret = wasm.position_new(x, y, z);

    return Position.__wrap(ret);
  }
}
/**
 */
export class Time {
  static __wrap(ptr) {
    const obj = Object.create(Time.prototype);
    obj.ptr = ptr;

    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;

    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_time_free(ptr);
  }
  /**
   * @param {number} year
   * @param {number} month
   * @param {number} day
   * @returns {Time}
   */
  static new(year, month, day) {
    const ret = wasm.time_new(year, month, day);

    return Time.__wrap(ret);
  }
}
/**
 */
export class Velocity {
  static __wrap(ptr) {
    const obj = Object.create(Velocity.prototype);
    obj.ptr = ptr;

    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;

    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_velocity_free(ptr);
  }
  /**
   * @param {number} vx
   * @param {number} vy
   * @param {number} vz
   * @returns {Velocity}
   */
  static new(vx, vy, vz) {
    const ret = wasm.position_new(vx, vy, vz);

    return Velocity.__wrap(ret);
  }
}

async function load(module, imports) {
  if (typeof Response === 'function' && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === 'function') {
      try {
        return await WebAssembly.instantiateStreaming(module, imports);
      } catch (e) {
        if (module.headers.get('Content-Type') != 'application/wasm') {
          console.warn(
            '`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n',
            e,
          );
        } else {
          throw e;
        }
      }
    }

    const bytes = await module.arrayBuffer();

    return await WebAssembly.instantiate(bytes, imports);
  }
 
    const instance = await WebAssembly.instantiate(module, imports);

    if (instance instanceof WebAssembly.Instance) {
      return { instance, module };
    }
 
      return instance;
    
  
}

async function init(input) {
  if (typeof input === 'undefined') {
    input = new URL('/newtonian_dynamics_bg.wasm');
  }

  const imports = {};
  imports.wbg = {};
  imports.wbg.__wbindgen_throw = function (arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  };

  if (
    typeof input === 'string' ||
    (typeof Request === 'function' && input instanceof Request) ||
    (typeof URL === 'function' && input instanceof URL)
  ) {
    input = fetch(input);
  }

  const { instance, module } = await load(await input, imports);

  wasm = instance.exports;
  init.__wbindgen_wasm_module = module;

  return wasm;
}

export default init;
