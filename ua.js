import fl from 'fantasy-land'

/**
 *
 */
export default function state (value = null) {
  // this is the variable to which the current value is bound
  let store = value

  function monad (maybeNewValue) {
    if (arguments.length === 1) {
      store = maybeNewValue
    } else if (arguments.length !== 0) {
      throw new TypeError('There must be exactly either zero or one argument')
    }

    return store
  }

  return augment(monad)
}

function augment (monad) {
  monad.equals = function (m) {
    return monad.valueOf() === m.valueOf()
  }

  monad.of = function (x) {
    return state(x)
  }

  monad.map = function (f) {
    return monad.of(f(monad.valueOf()))
  }
  monad[fl.map] = monad.map

  monad.chain = function (f) {
    return f(monad.valueOf())
  }

  monad.ap = function (m) {
    return m.chain(f => monad.map(f))
  }

  monad.transform = function (f) {
    return monad(f(monad.valueOf()))
  }

  monad.collect = function (f) {
    return monad(f())
  }

  monad.around = function (before, after) {
    return augment(function () {
      if (before) {
        before.apply(this, arguments)
      }

      const result = monad.apply(this, arguments)

      if (after) {
        after.apply(this, arguments)
      }

      return result
    })
  }

  monad.trigger = function (f) {
    return monad.around(null, f)
  }

  monad.throwOnMutate = function () {
    return monad.around(check, null)

    function check () {
      if (arguments.length > 0) {
        throw new TypeError('Update of state not allowed')
      }
    }
  }

  monad.readonly = function () {
    return augment(function () {
      return monad()
    })
  }

  monad.valueOf = function () {
    return monad()
  }

  monad.toJSON = function () {
    return monad.valueOf()
  }

  return monad
}
