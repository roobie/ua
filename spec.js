
const test = require('tap').test;
const ua = require('./ua');

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
