# ua
Uniform Accessor for javascript

--


This is a Uniform Accessor, ua, also known as a getter/setter or a function property. Use it like thus:

```
var prop = ua('hello');
prop() === 'hello';
prop('world') === 'world';
prop.nullify() === null;
prop() === null;
```
