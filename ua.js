/**
 * This is an implementation of a uniform accessor, ua or couls also be called
 * a getter/setter or a function property.
 *
 * @param value - the initial value of this instance. Defaults to null
 * @returns a function that is used to access (or modify) the internally stored `value`
 * @example
 * ```
 * var prop = ua('hello');
 * prop() === 'hello';
 * prop('world') === 'world';
 * prop() === 'world';
 * ```
 */
export default function ua (value = null) {
  // this is the variable to which the current value is bound
  let store = value

  /**
   * This is the actual accessor function that is returned from invoking
   * the exported function. Its single purpose is to expose get/set functionality
   * to the outer world.
   *
   * @param maybeNewValue - if any arguments are received, this value will be used
   * to update the internal store.
   * @returns if no arguments are received, then the current value of the internal
   * store is returned, otherwise, the value of the first argument is returned
   */
  function uniformAccess (maybeNewValue) {
    // if exactly one argument is received, the `store` binding is
    // re-bound to the value of the parameter `maybeNewValue`.
    if (arguments.length === 1) {
      store = maybeNewValue
    } else if (arguments.length !== 0) {
      throw new TypeError('There must be exactly either zero or one argument')
    }

    // always return the current value bound to the variable `value`
    return store
  }

  // return the accessor function
  return augment(uniformAccess)
}

/**
 * Augments a stateMonad with methods
 *
 */
function augment (stateMonad) {
  /**
   * Unwraps this instance and the other one, and performs an `===`
   * (i.e. strict) equality check of the contained values.
   *
   * @param fn - the other uniform accessor (or a plain function)
   * @returns true if the values are equal, false if not.
   */
  stateMonad.equals = function (fn) {
    return typeof fn === 'function' &&
      fn() === stateMonad()
  }

  /**
   * Applies the function in this instance to the value of the uniform accessor/function
   * received as first argument. This results in a new instance.
   *
   * @param fn - the uniform accessor/function which holds the value to be used in the
   * application
   * @returns a new uniform accessor that stores the result of the computation
   */
  stateMonad.ap = function () {
    return ua(stateMonad().apply(this, arguments))
  }

  /**
   * Map a function on the value of the value of this instance, resulting in a new uniform
   * accessor instance. Works similar to the Array.prototype.map function.
   *
   * @param fn - the function to use in the application
   * @returns a new uniform accessor that stores the result of the computation
   */
  stateMonad.map = function (fn) {
    return ua(fn(stateMonad()))
  }

  /**
   * Creates a function that will call the received function when the first function itself
   * is called. This is useful when you want certain side-effects to happen when this
   * instance is updated.
   *
   * @param fn - the function to call when the returned function is called. This function
   * will receive the value received as well
   * @returns a function that will: a. update this uniform access instance, and b. call
   * the chained function.
   */
  stateMonad.chain = function (fn) {
    return augment(function () {
      const result = stateMonad.apply(this, arguments)
      fn.apply(this, [...arguments, result])
      return result
    })
  }

  stateMonad.pre = function (fn) {
    return augment(function () {
      fn.apply(this, arguments)
      return stateMonad.apply(this, arguments)
    })
  }

  stateMonad.readonly = function () {
    return augment(function () {
      return stateMonad()
    })
  }

  stateMonad.throwOnMutate = function () {
    return stateMonad.pre(function () {
      if (arguments.length > 0) {
        throw new TypeError('Tried to mutate frozen stateMonad')
      }
    })
  }

  /**
   * Updates the value stored in this instance by storing the result of applying the
   * function received as the first argument.
   *
   * @param fn - the function to use to transform the value of the uniform accessor
   * @returns this instance
   */
  stateMonad.update = function (fn) {
    stateMonad(fn(stateMonad()))
    return stateMonad
  }

  /**
   * Updates this instance with the value of another uniform access instance/function.
   *
   * @param fn - the other uniform access instance/function
   *
   */
  stateMonad.collect = function (fn) {
    stateMonad(fn())
    return stateMonad
  }

  stateMonad.nullify = function () {
    return stateMonad(null)
  }

  /**
   * In practice, exactly the same as reading the value of the uniform access instance, i.e.
   * `uainstance() === uainstance.valueOf()`, but semantically different.
   *
   * @returns the current value of this instance.
   */
  stateMonad.valueOf = function () {
    return stateMonad()
  }

  /**
   * In order to seamlessly integrate with `JSON`, we expose this method, which simply
   * returns the current value, so that it is serialized properly.
   *
   * @returns the current value
   */
  stateMonad.toJSON = function () {
    return stateMonad()
  }

  return stateMonad
}
