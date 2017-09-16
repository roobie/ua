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
export default function ua (value = null) {
  // this is the variable to which the current value is bound
  let store = value
  const eventHandlers = {
    onSet: [],
    onGet: []
  }

  function instance (maybeNewValue) {
    // if exactly one argument is received, the `value` variable is
    // re-bound to the value of the parameter `maybeNewValue`.
    if (arguments.length === 1) {
      trigger(eventHandlers.onSet, [arguments[0], value, instance])
      store = maybeNewValue
    } else if (arguments.length === 0) {
      trigger(eventHandlers.onGet, [value, instance])
    }

    // always return the current value bound to the variable `value`
    return store
  }

  instance.toJSON = () => value

  instance.onSet = (callback) => registerEventHandler(eventHandlers.onSet, callback)

  instance.onGet = (callback) => registerEventHandler(eventHandlers.onGet, callback)

  // return the accessor function
  return instance

  function registerEventHandler (list, callback) {
    list.push(callback)
    return function deregister () {
      list.splice(list.indexOf(callback), 1)
    }
  }

  function trigger (handlers, args) {
    for (let i = 0; i < handlers.length; ++i) {
      const handler = handlers[i]
      handler.apply(null, args)
    }
  }
}
