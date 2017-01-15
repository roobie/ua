# `uniform-accessor`

This is a uniform accessor, `ua`, also known as a getter/setter or a function property.

### Caveats

This module is written in ES 6 syntax, but an ES 5 transpiled module is in the source tree names `ua.es5.js`

### Installing

**NPM**
`npm install --save https://github.com/roobie/ua`

### Usage 

**Basics**

```javascript
var ua = require('uniform-accessor');

var prop = ua('hello');
prop() === 'hello';
prop('world') === 'world';
prop(null) === null;
```

**"Real world" example**

```javascript
var ua = require('uniform-accessor');

var viewModel = {
  user: ua({}), // an empty object, so that we do incur a null ref
  error: ua() // defaults to null
};

api.getUser('Alfred').then(viewModel.user, viewModel.error);
```

```html
{#if viewModel.user()}
  <span class="user-name">{{ viewModel.user().name }}</span>
{/if}
{#if viewModel.error()}
  <span class="error">{{ viewModel.error().message }}</span>
{/if}
```

### Configuration

It's possible to trigger events when the accessor is used:

```javascript
const error = ua(null, {
  onset: () => data(null),
  onget: (current) => console.log('Someone accessed me. Current error is', error)
});
const data = ua(null, {
  onset: () => error(null)
});
```

### Serialization

The `function` returned by `ua` defines a `toJSON` property, which results in it being automagically serialized as the boxed value.

```javascript
var user = ua({ name: "Alfred" });
JSON.stringify(user); // => "{\"name\":\"Alfred\"}"
```

### Coverage
```
----------|----------|----------|----------|----------|----------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
----------|----------|----------|----------|----------|----------------|
All files |      100 |      100 |      100 |      100 |                |
 spec.js  |      100 |      100 |      100 |      100 |                |
 ua.js    |      100 |      100 |      100 |      100 |                |
----------|----------|----------|----------|----------|----------------|
```
