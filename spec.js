
const test = require('tap').test
const ua = require('./ua.es5.js').default

const valueByRef = { name: 'an object' }
const valueByValue = 42

test('ua initial value', t => {
  t.plan(3)

  const uaEmpty = ua()
  const uaRef = ua(valueByRef)
  const uaValue = ua(valueByValue)

  t.equals(uaEmpty(), null)
  t.equals(uaRef(), valueByRef)
  t.equals(uaValue(), valueByValue)
})

test('ua update value', t => {
  t.plan(4)

  const uaRef = ua(valueByRef)
  const uaValue = ua(valueByValue)

  const newRef = { name: 'another object' }
  const newValue = 99

  t.equals(uaRef(newRef), newRef)
  t.equals(uaValue(newValue), newValue)

  t.equals(uaRef(), newRef)
  t.equals(uaValue(), newValue)
})

test('serialization', t => {
  t.plan(3)

  const uaRef = ua(valueByRef)
  const uaValue = ua(valueByValue)
  const uaEmpty = ua()

  t.equals(JSON.stringify(uaRef), JSON.stringify(valueByRef))
  t.equals(JSON.stringify(uaValue), JSON.stringify(valueByValue))
  t.equals(JSON.stringify(uaEmpty), JSON.stringify(null))
})

const inc1 = x => x + 1
const inc2 = x => x + 2

test('map', t => {
  t.plan(3)

  const a = ua(1)

  t.ok(a.map(x => x).equals(a))
  t.ok(a.map(x => inc1(inc2(x))).equals(a.map(inc1).map(inc2)))
  t.equals(a.map(inc1).map(inc2).valueOf(), 4)
})

test('ap', t => {
  t.plan(3)

  const a = ua(1)
  const inc1ua = ua(inc1)
  const inc2ua = ua(inc2)

  t.ok(ua(x => x).ap(a).equals(a))
  t.ok(ua(x => inc1(inc2(x))).ap(a).equals(inc2ua.ap(inc1ua.ap(a))))
  t.equals(inc2ua.ap(inc1ua.ap(a)).valueOf(), 4)
})

test('chain', t => {
  const a = ua(null)
  const b = ua(null)

  const acb = a.chain(() => b(1))

  acb(2)
  t.equals(a(), 2)
  t.equals(b(), 1)

  t.end()
})

test('mutator helpers', t => {
  t.plan(4)

  const a = ua(1)
  t.equals(a, a.update(inc1))

  const b = ua(1)
  t.equals(2, b.update(inc1).valueOf())

  const c = ua(9)
  t.equals(9, a.collect(c).valueOf())

  t.equals(c, c.collect(b))
})
