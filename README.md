# `uniform-accessor`

This is a uniform accessor, `ua`, also known as a getter/setter or a function property.

### Caveats

This module is written in ES 6 syntax, but an ES 5 transpiled module is in the source tree named `ua.es5.js`

### Installing

**NPM**
`npm install --save <github-archive>`

**yarn**
`yarn add <github-archive>`

where `<github-archive>` is:
`https://github.com/roobie/uniform-accessor/archive/v2.0.0-rc2.tar.gz`

### Usage

**Basics**

```javascript
var ua = require('uniform-accessor');

var prop = ua('hello');
prop() === 'hello';
prop('world') === 'world';
prop(null) === null;
```

**"Real world™" example**

```javascript
var ua = require('uniform-accessor')

var viewModel = {
  items: ua([]),
  error: ua(), // defaults to null

  addItem: (newItem) => {
    viewModel.items.update(ary => ary.concat(newItem))
    // this is equivalent to:
    const current = viewModel.items()
    viewModel.items(current.concat(newItem))
  }
}

const init = () => {
  api.getItems()
    .then(
      // we say here that when the promise resolves sucessfully, update
      // the uniform-accessor `viewModel.items`, but also do set the
      // `viewModel.error` uniform-accessor to `null`
      viewModel.items.chain(() => viewModel.error(null)),
      // otherwise, if the promise is rejected, set the `viewModel.error`
      // to contain the reason
      viewModel.error)
}

init()
```

```html
{#if viewModel.items().length}
  <span class="item-count">{{ viewModel.items().length }}</span>
{/if}
{#if viewModel.error()}
  <span class="error">{{ viewModel.error().message }}</span>
{/if}
```

### Serialization

The `function` returned by `ua` defines a `toJSON` property, which results in it being automagically serialized as the boxed value.

```javascript
var user = ua({ name: "Alfred" });
JSON.stringify(user); // => "{\"name\":\"Alfred\"}"
```

### Coverage

Should™ be `100%`
