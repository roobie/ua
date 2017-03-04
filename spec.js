
const test = require('tap').test
const State = require('./ua.es5.js').default

test('fantasy-land', t => {
  const eq = (x, y) => x.equals(y)
  const x = 1
  const f = x => x + 1
  const g = x => x * 2

  test('applicative', t => {
    const applicativeTests = require('fantasy-land/laws/applicative')

    test('applicative/identity', t => {
      const result = applicativeTests
              .identity(State)(eq)(x)
      t.ok(result)

      t.end()
    })

    test('applicative/homomorphism', t => {
      const result = applicativeTests
              .homomorphism(State)(eq)(x)
      t.ok(result)

      t.end()
    })

    test('applicative/interchange', t => {
      const result = applicativeTests
              .interchange(State)(eq)(x)
      t.ok(result)

      t.end()
    })

    t.end()
  })

  test('apply', t => {
    const applyTests = require('fantasy-land/laws/apply')

    test('apply/composition', t => {
      const result = applyTests
              .composition(State)(eq)(x)
      t.ok(result)

      t.end()
    })

    t.end()
  })

  test('chain', t => {
    const chainTests = require('fantasy-land/laws/chain')

    test('chain/associativity', t => {
      const result = chainTests
              .associativity(State)(eq)(x)
      t.ok(result)

      t.end()
    })

    t.end()
  })

  test('functor', t => {
    const functorTests = require('fantasy-land/laws/functor')

    test('functor/identity', t => {
      const result = functorTests
            .identity(State.of)(eq)(x)
      t.ok(result)

      t.end()
    })

    test('functor/composition', t => {
      const result = functorTests
            .composition(State.of)(eq)(f)(g)(x)
      t.ok(result)

      t.end()
    })

    t.end()
  })

  test('monad', t => {
    const monadTests = require('fantasy-land/laws/monad')

    test('monad/leftIdentity', t => {
      const f = x => State(x)
      const result = monadTests
              .leftIdentity(State)(eq)(f)(x)
      t.ok(result)

      t.end()
    })

    test('monad/rightIdentity', t => {
      const result = monadTests
              .rightIdentity(State)(eq)(x)
      t.ok(result)

      t.end()
    })

    t.end()
  })

  t.end()
})

test('basic', t => {
  const a = State(1)

  t.equal(a(), 1)
  t.equal(a.valueOf(), 1)

  test('equals', t => {
    t.ok(a.equals(a))
    t.ok(a.equals(State(1)))
    t.ok(State(1).equals(a))
    t.end()
  })

  test('of', t => {
    const b = State.of(2)
    t.equal(b(), 2)

    t.end()
  })

  test('chain', t => {
    const f = x => State(x + 1)
    const g = x => State(x + 2)

    const r1 = a.chain(f).chain(g)
    const r2 = a.chain(x => f(x).chain(g))

    t.ok(r1.equals(r2))

    const b = a.chain(x => State(x + 1))
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
    const v = State(1)
    const a = State(x => x + 1)
    const u = State(x => x + 2)

    const r1 = v.ap(u.ap(a.map(f => g => x => f(g(x)))))
    const r2 = v.ap(u).ap(a)
    t.ok(r1.equals(r2))

    const b = v.ap(State(x => x + 1))
    t.equal(b(), 2)

    t.end()
  })

  test('args check', t => {
    t.throws(() => State(1, 2))
    const v = State(1)
    t.throws(() => v(1, 2))

    const n = State()
    t.equals(n(), null)
    t.end()
  })

  test('mutators', t => {
    const v = State(1)
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

    v(0)
    const effects = {
      before: 0,
      after: 0
    }

    const triggersBefore = v.onbeforeMutate((x, ref) => {
      t.equals(v, ref)
      t.equals(v(), 0)
      t.equals(x, 3)
      effects.before = 1
    })
    triggersBefore(3)
    t.equals(v(), 3)
    t.equals(effects.before, 1)
    const triggersAfter = v.onafterMutate((x, ref) => {
      t.equals(v, ref)
      t.equals(v(), 5)
      t.equals(x, 5)
      effects.after = 1
    })
    triggersAfter(5)
    t.equals(v(), 5)
    t.equals(effects.before, 1)

    v(3)
    const throws = v.throwOnMutate()
    t.throws(() => throws(999), /Update/)
    t.doesNotThrow(() => throws(), 'Should not throw on read')
    t.equals(v(), 3)
    t.equals(throws(), v())

    const rdonly = v.readonly()
    rdonly(999)
    t.equals(v(), 3)

    const m1 = rdonly.map(x => x + 1)
    t.ok(m1.equals(State(4)))

    const q = State({a: 1})
    t.equals(JSON.stringify(q), `{"a":1}`)
    q({a: 2})
    t.equals(JSON.stringify(q), `{"a":2}`)
    const w = q.transform(o => ({ a: o.a + 1 }))
    t.equals(JSON.stringify(w), `{"a":3}`)

    t.end()
  })

  t.end()
})

test('use cases', t => {
  const resolve = (data) => new Promise((resolve) => resolve(data))
  const reject = (reason) => new Promise((resolve, reject) => reject(reason))

  test('mutually exclusive data 1', t => {
    t.plan(2)
    const initialData = []
    const error = State.of(new Error('no used'))
    const data = State.of(initialData).onbeforeMutate(() => error(null))

    const resultData = [42, 8, 64]
    return resolve(resultData)
      .then(data, error)
      .then(() => {
        t.equals(data(), resultData)
        t.equals(error(), null)
      })
  })

  test('mutually exclusive data 2', t => {
    t.plan(2)
    const initialData = []
    const error = State.of(null)
    const data = State.of(initialData).onbeforeMutate(() => {
      throw new Error('this should not be invoked')
    })

    const resultErr = new Error('test')
    return reject(resultErr)
      .then(data, error)
      .then(() => {
        t.equals(data(), initialData)
        t.equals(error(), resultErr)
      })
  })

  test('validation', t => {
    class ValidationError extends Error {
    }

    const percent = State.of(0).onbeforeMutate((value) => {
      if (value < 0 || value > 100) {
        throw new ValidationError('Not a valid percentage')
      }
    })

    t.equals(percent(), 0)
    t.doesNotThrow(() => percent(42))
    t.equals(percent(), 42)
    t.throws(() => percent(142), /Not a valid percentage/)
    t.equals(percent(), 42)

    t.end()
  })

  t.end()
})
