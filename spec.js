
const test = require('tap').test;
const ua = require('./ua.es5.js').default;

const valueByRef = { name: 'an object' };
const valueByValue = 42;

test('ua initial value', t => {
  t.plan(3);

  const uaEmpty = ua();
  const uaRef = ua(valueByRef);
  const uaValue = ua(valueByValue);

  t.equals(uaEmpty(), null);
  t.equals(uaRef(), valueByRef);
  t.equals(uaValue(), valueByValue);
});

test('ua update value', t => {
  t.plan(4);

  const uaRef = ua(valueByRef);
  const uaValue = ua(valueByValue);

  const newRef = { name: 'another object' };
  const newValue = 99;

  t.equals(uaRef(newRef), newRef);
  t.equals(uaValue(newValue), newValue);

  t.equals(uaRef(), newRef);
  t.equals(uaValue(), newValue);
});

test('serialization', t => {
  t.plan(3);

  const uaRef = ua(valueByRef);
  const uaValue = ua(valueByValue);
  const uaEmpty = ua();

  t.equals(JSON.stringify(uaRef), JSON.stringify(valueByRef));
  t.equals(JSON.stringify(uaValue), JSON.stringify(valueByValue));
  t.equals(JSON.stringify(uaEmpty), JSON.stringify(null));
});

test('callbacks', t => {
  t.plan(7);

  const ref1 = {};
  const ref2 = {};
  var countSet = 0;
  var countGet = 0;

  const v1 = ua(ref1, {
    onset: (v) => {
      t.equals(ref2, v);
      countSet += 1;
    },
    onget: (v) => {
      if (countGet === 0) {
        t.equals(ref1, v);
      }
      else {
        t.equals(ref2, v);
      }
      countGet += 1;
    }
  });

  t.equals(countGet, 0);
  t.equals(countSet, 0);
  v1();
  t.equals(countGet, 1);
  v1(ref2);
  t.equals(countSet, 1);
});
