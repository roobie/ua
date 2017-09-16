
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

test('callbacks', t => {
  const ref1 = {}
  const ref2 = {}
  let countSet = 0
  let countGet = 0

  const onSet = (newValue, value, ref) => {
    t.ok(newValue)
    t.equals(ref, v1)
    countSet += 1
  }
  const onGet = (value, ref) => {
    t.ok(value)
    t.equals(ref, v1)
    countGet += 1
  }

  const v1 = ua(ref1)
  const deregSet = v1.onSet(onSet)
  const deregGet = v1.onGet(onGet)

  t.equals(countGet, 0)
  v1()
  t.equals(countGet, 1)
  t.equals(countSet, 0)
  v1(ref2)
  t.equals(countSet, 1)

  deregGet()
  deregSet()
  v1()
  v1(1)
  t.equals(countGet, 1)
  t.equals(countSet, 1)

  t.end()
})
