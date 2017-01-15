/**
 * This is a Uniform Accessor, ua also known as a getter/setter
 * or a function property.
 *
 * @param value - the initial value of this instance. Defaults to null
 * @returns `value`
 * @example
 * ```
 * var prop = ua('hello');
 * prop() === 'hello';
 * prop('world') === 'world';
 * prop() === 'world';
 * ```
 */
function ua(value) {
  'use strict';

  // If no arguments are passed, we default the value to null
  if (arguments.length === 0) {
    value = null;
  }

  // this is the variable to which the current value is bound
  var store = value;

  function getset(maybeNewValue) {
    // if exactly one argument is received, the `value` variable is
    // re-bound to the value of the parameter `maybeNewValue`.
    if (arguments.length === 1) {
      store = maybeNewValue;
    }

    // always return the current value bound to the variable `value`
    return store;
  }

  // return the accessor function
  return getset;
}

module.exports = ua;
