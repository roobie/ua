function ua(value) {
  'use strict';

  /// This is a Uniform Accessor, ua
  /// also known as a getter/setter
  /// or a function property.
  /// Use it like thus:
  /// var prop = lib.ua('hello');
  /// prop() === 'hello';
  /// prop('world') === 'world';

  var store = value;

  getset.nullify = function () {
    store = null;
    return store;
  };

  function getset(maybeNewValue) {
    if (maybeNewValue !== void 0) {
      store = maybeNewValue;
    }
    return store;
  }

  return getset;
}

module.exports = ua;
