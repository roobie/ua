# ua - Uniform Accessor for javascript

This is a uniform accessor, `ua`, also known as a getter/setter or a function property.

### Usage 

#### Basics

```javascript
var prop = ua('hello');
prop() === 'hello';
prop('world') === 'world';
prop(null) === null;
```

#### "Real world" example

```javascript
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
{#if viewModel.user()}
  <span class="error">{{ viewModel.error().message }}</span>
{/if}
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
