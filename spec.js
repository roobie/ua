
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
  const uaRef = ua(valueByRef)
  const uaValue = ua(valueByValue)
  const uaEmpty = ua()

  t.equals(JSON.stringify(uaRef), JSON.stringify(valueByRef))
  t.equals(JSON.stringify(uaValue), JSON.stringify(valueByValue))
  t.equals(JSON.stringify(uaEmpty), JSON.stringify(null))

  uaEmpty(valueByRef)
  t.equals(JSON.stringify(uaEmpty), JSON.stringify(valueByRef))

  t.end()
})

test('args len', t => {
  const a = ua(1)
  t.throws(() => a(1, 2))

  t.end()
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

  t.ok(ua(x => x).ap(a()).equals(a))
  t.ok(ua(x => inc1(inc2(x))).ap(a()).equals(
    inc2ua.ap(inc1ua.ap(a()))))
  t.equals(inc2ua.ap(inc1ua.ap(a())).valueOf(), 4)
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

test('readonly', t => {
  const a = ua(1).readonly()

  t.equals(a(), 1)
  a(2)
  t.equals(a(), 1)

  let param = -1
  let result = -1
  const chained = a.chain((fromArg, fromResult) => {
    param = fromArg
    result = fromResult
  })
  // since `a` is `readonly`, it should not be updated to 2
  t.equals(chained(2), 1)
  t.equals(param, 2)
  t.equals(result, 1)

  t.end()
})

test('throwOnMutate', t => {
  const a = ua(1).throwOnMutate()

  t.equals(a(), 1)
  t.throws(() => a(2), /tried to mutate frozen stateMonad/i)
  t.throws(() => a.update(x => x + 1), /tried to mutate frozen stateMonad/i)

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

const resolve = (data) => new Promise((resolve) => resolve(data))
const reject = (err) => new Promise((resolve, reject) => reject(err))

test('example code 1', t => {
  t.plan(2)

  const dataResult = [42, 8, 64]

  const error = ua(null)
  const data = ua([]).chain(error.nullify)

  return resolve(dataResult)
          .then(data, error)
          .then(() => {
            t.equals(data(), dataResult)
            t.equals(error(), null)
          })
})

test('example code 2', t => {
  t.plan(1)

  const error = ua(null)
  const data = ua([]).chain(error.nullify)

  const err = new Error('test')
  return reject(err)
          .then(data, error)
          .then(() => {
            t.equals(error(), err)
          })
})

test('example code 3', t => {
  t.plan(2)

  const dataResult = [42, 8, 64]

  const error = ua(new Error())
  const data = ua([]).chain(error.nullify)

  return resolve(dataResult)
    .then(data, error)
    .then(() => {
      t.equals(data(), dataResult)
      t.equals(error(), null)
    })
})
