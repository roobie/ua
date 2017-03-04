'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = State;

var _fantasyLand = require('fantasy-land');

var _fantasyLand2 = _interopRequireDefault(_fantasyLand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Type initializer for a `State` monad
 * @kind function
 * @param {any} value - the initial value
 * @returns {monad} an instance of the `State` monad with its initial value set to `value`
 */
function State() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  console.assert(arguments.length === 0 || arguments.length === 1, 'there must be exactly either zero or one argument');

  // this is the variable to which the current value is bound
  var store = value;

  /**
   * This is the function returned by invoking the type initializer.
   * It allows for reading and updating the internally stored value
   * by checking whether or not an argument was received in its
   * invocation.
   * @function monad
   * @mixes augment
   * @example
   * const x = State(1)
   * console.assert(x() === 1)
   * console.assert(x(2) === 2)
   */
  function monad(maybeNewValue) {
    console.assert(arguments.length === 0 || arguments.length === 1, 'there must be exactly either zero or one argument');
    if (arguments.length === 1) {
      store = maybeNewValue;
    }

    return store;
  }

  return augment(monad);
}

/**
 * Augments a `State` monad with the methods that implement fantasy-land compliance
 * plus other functionality
 * @function augment
 * @inner
 * @namespace monad
 * @access private
 * @mixin
 */
/**
 * @module uniform-accessor
 * @exports State
 */

// used for exposing fantasy-land method functions
function augment(monad) {
  /**
   * Compares two instances of `State` by using `===` on their internal values
   * @method equals
   * @instance
   * @memberof monad
   * @access public
   * @param {State} m - the other instance of `State` to compare to
   */
  monad.equals = function (m) {
    return monad.valueOf() === m.valueOf();
  };
  monad[_fantasyLand2.default.equals] = monad.equals;

  monad.map = function (f) {
    return State.of(f(monad.valueOf()));
  };
  monad[_fantasyLand2.default.map] = monad.map;

  monad.chain = function (f) {
    return f(monad.valueOf());
  };
  monad[_fantasyLand2.default.chain] = monad.chain;

  monad.ap = function (m) {
    return m.chain(function (f) {
      return monad.map(f);
    });
  };
  monad[_fantasyLand2.default.ap] = monad.ap;

  monad.transform = function (f) {
    return monad(f(monad.valueOf()));
  };

  monad.collect = function (f) {
    return monad(f());
  };

  /**
   * `before` and `after` are invoked with the arguments received, _and_
   * a reference to the State instance, at the end of the list of arguments
   *
   */
  monad.around = function (before, after) {
    return augment(function () {
      if (before) {
        before.apply(this, [].concat(Array.prototype.slice.call(arguments), [monad]));
      }

      var result = monad.apply(this, arguments);

      if (after) {
        after.apply(this, [].concat(Array.prototype.slice.call(arguments), [monad]));
      }

      return result;
    });
  };

  monad.onbeforeMutate = function (f) {
    var wrapper = function wrapper() {
      // we account for `around` passing the reference to the
      // State instance here, so, if only one argument is received
      // it is equivalent to only reading the state, and if 2 or more
      // arguments are received, it means someone is trying to mutate
      // the state.
      if (arguments.length > 1) {
        f.apply(this, arguments);
      }
    };

    return monad.around(wrapper, null);
  };

  monad.onafterMutate = function (f) {
    var wrapper = function wrapper() {
      // see `wrapper` in `onbeforeMutate`
      if (arguments.length > 1) {
        f.apply(this, arguments);
      }
    };

    return monad.around(null, wrapper);
  };

  monad.throwOnMutate = function () {
    return monad.around(check, null);

    function check() {
      // see `wrapper` in `onbeforeMutate`
      if (arguments.length > 1) {
        throw new TypeError('Update of State not allowed');
      }
    }
  };

  monad.readonly = function () {
    return augment(function () {
      return monad();
    });
  };

  monad.valueOf = function () {
    return monad();
  };

  monad.toJSON = function () {
    return monad.valueOf();
  };

  return monad;
}

State.of = function (x) {
  return State(x);
};
State[_fantasyLand2.default.of] = State.of;
