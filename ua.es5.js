'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = state;

var _fantasyLand = require('fantasy-land');

var _fantasyLand2 = _interopRequireDefault(_fantasyLand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 */
function state() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  // this is the variable to which the current value is bound
  var store = value;

  function monad(maybeNewValue) {
    if (arguments.length === 1) {
      store = maybeNewValue;
    } else if (arguments.length !== 0) {
      throw new TypeError('There must be exactly either zero or one argument');
    }

    return store;
  }

  return augment(monad);
}

function augment(monad) {
  monad.equals = function (m) {
    return monad.valueOf() === m.valueOf();
  };

  monad.of = function (x) {
    return state(x);
  };

  monad.map = function (f) {
    return monad.of(f(monad.valueOf()));
  };
  monad[_fantasyLand2.default.map] = monad.map;

  monad.chain = function (f) {
    return f(monad.valueOf());
  };

  monad.ap = function (m) {
    return m.chain(function (f) {
      return monad.map(f);
    });
  };

  monad.transform = function (f) {
    return monad(f(monad.valueOf()));
  };

  monad.collect = function (f) {
    return monad(f());
  };

  monad.around = function (before, after) {
    return augment(function () {
      if (before) {
        before.apply(this, arguments);
      }

      var result = monad.apply(this, arguments);

      if (after) {
        after.apply(this, arguments);
      }

      return result;
    });
  };

  monad.trigger = function (f) {
    return monad.around(null, f);
  };

  monad.throwOnMutate = function () {
    return monad.around(check, null);

    function check() {
      if (arguments.length > 0) {
        throw new TypeError('Update of state not allowed');
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
