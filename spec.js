
const test = require('tap').test;
const ua = require('./ua');

const valueByRef = { name: 'an object' };
const valueByValue = 42;

const uaRef = ua(valueByRef);
const uaValue = ua(valueByValue);

test('ua initial value', t => {
  t.plan(3);

  const uaEmpty = ua();
  t.equals(uaEmpty(), null);
  t.equals(uaRef(), valueByRef);
  t.equals(uaValue(), valueByValue);
});

test('ua update value', t => {
  t.plan(4);

  const newRef = { name: 'another object' };
  const newValue = 99;

  t.equals(uaRef(newRef), newRef);
  t.equals(uaValue(newValue), newValue);

  t.equals(uaRef(), newRef);
  t.equals(uaValue(), newValue);
});
