
const test = require('tap').test
const state = require('./ua.es5.js').default

const functorTest = require('fantasy-land/laws/functor')
console.log(functorTest)

test('fantasy-land', t => {
  const a = state()
  const result = functorTest
          .identity(a.of)((x, y) => x.equals(y))(1)
  t.ok(result)

  t.end()
})

test('basic', t => {
  const a = state(1)

  t.equal(a(), 1)
  t.equal(a.valueOf(), 1)

  test('equals', t => {
    t.ok(a.equals(a))
    t.ok(a.equals(state(1)))
    t.ok(state(1).equals(a))
    t.end()
  })

  test('of', t => {
    const b = a.of(2)
    t.equal(b(), 2)

    t.end()
  })

  test('chain', t => {
    const f = x => state(x + 1)
    const g = x => state(x + 2)

    const r1 = a.chain(f).chain(g)
    const r2 = a.chain(x => f(x).chain(g))

    t.ok(r1.equals(r2))

    const b = a.chain(x => state(x + 1))
    t.equal(b(), 2)

    t.end()
  })

  test('map', t => {
    const f = x => x + 1
    const g = x => x + 2

    const r1 = a.map(x => f(g(x)))
    const r2 = a.map(g).map(f)

    t.ok(r1.equals(r2))

    const b = a.map(x => x + 1)
    t.equal(b(), 2)

    t.end()
  })

  test('ap', t => {
    const v = state(1)
    const a = state(x => x + 1)
    const u = state(x => x + 2)

    const r1 = v.ap(u.ap(a.map(f => g => x => f(g(x)))))
    const r2 = v.ap(u).ap(a)
    t.ok(r1.equals(r2))

    const b = v.ap(state(x => x + 1))
    t.equal(b(), 2)

    t.end()
  })

  test('mutators', t => {
    const v = state(1)
    v.transform(x => x + 1)
    t.equals(v(), 2)

    v.collect(() => 9)
    t.equals(v(), 9)

    let before = -1
    let after = -1
    const sideEff = v.around(() => { before = 1 }, () => { after = 1 })
    sideEff(2)
    t.equals(v(), 2)
    t.equals(before, 1)
    t.equals(after, 1)

    let trigValue = -1
    const trig = v.trigger(x => { trigValue = 1 })
    trig(3)
    t.equals(v(), 3)
    t.equals(trigValue, 1)

    const throws = v.throwOnMutate()
    t.throws(() => throws(999), /Update/)
    t.equals(v(), 3)

    const rdonly = v.readonly()
    rdonly(999)
    t.equals(v(), 3)

    const m1 = rdonly.map(x => x + 1)
    t.ok(m1.equals(state(4)))

    const q = state({a: 1})
    t.equals(JSON.stringify(q), `{"a":1}`)
    q({a: 2})
    t.equals(JSON.stringify(q), `{"a":2}`)
    const w = q.transform(o => ({ a: o.a + 1 }))
    t.equals(JSON.stringify(w), `{"a":3}`)

    t.end()
  })

  t.end()
})
