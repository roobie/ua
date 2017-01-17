/**
 * This is a Uniform Accessor, ua also known as a getter/setter
 * or a function property.
 *
 * @param value - the initial value of this instance. Defaults to null
 * @param configuration - a configuration for the uniform-accessor instance
 * <pre>
 * {
 *   TBD
 * }
 * </pre>
 * @returns `value`
 * @example
 * ```
 * var prop = ua('hello');
 * prop() === 'hello';
 * prop('world') === 'world';
 * prop() === 'world';
 * ```
 */
export default function ua(value = null, { onset, onget } = {}) {
  // this is the variable to which the current value is bound
  var store = value;

  function uniformAccess(maybeNewValue) {
    // if exactly one argument is received, the `value` variable is
    // re-bound to the value of the parameter `maybeNewValue`.
    if (arguments.length === 1) {
      store = maybeNewValue;
      if (onset) {
        onset(maybeNewValue);
      }
    }

    if (onget) {
      onget(store);
    }
    // always return the current value bound to the variable `value`
    return store;
  }

  uniformAccess.equals = function (other) {
    return typeof other === 'function' &&
      other() === this();
  };

  uniformAccess.map = function (fn) {
    return ua(fn(this()));
  };

  uniformAccess.update = function (fn) {
    this(fn(this()));
    return this;
  };

  uniformAccess.collect = function (x) {
    this(x());
    return this;
  };

  uniformAccess.valueOf = function () {
    if (onget) {
      onget(store);
    }

    return store;
  };

  uniformAccess.toJSON = function () {
    return value;
  };

  // return the accessor function
  return uniformAccess;
}
