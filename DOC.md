## Modules

<dl>
<dt><a href="#module_uniform-accessor">uniform-accessor</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#State">State(value)</a> ⇒ <code><a href="#monad">monad</a></code></dt>
<dd><p>Type initializer for a <code>State</code> monad</p>
</dd>
<dt><a href="#monad">monad()</a></dt>
<dd><p>This is the function returned by invoking the type initializer.
It allows for reading and updating the internally stored value
by checking whether or not an argument was received in its
invocation.</p>
</dd>
</dl>

<a name="module_uniform-accessor"></a>

## uniform-accessor
<a name="State"></a>

## State(value) ⇒ <code>[monad](#monad)</code>
Type initializer for a `State` monad

**Kind**: global function  
**Returns**: <code>[monad](#monad)</code> - an instance of the `State` monad with its initial value set to `value`  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | the initial value |

<a name="monad"></a>

## monad()
This is the function returned by invoking the type initializer.
It allows for reading and updating the internally stored value
by checking whether or not an argument was received in its
invocation.

**Kind**: global function  
**Mixes**: <code>augment</code>  
**Example**  
```js
const x = State(1)
console.assert(x() === 1)
console.assert(x(2) === 2)
```
<a name="monad+equals"></a>

### monad.equals(m)
Compares two instances of `State` by using `===` on their internal values

**Kind**: instance method of <code>[monad](#monad)</code>  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| m | <code>[State](#State)</code> | the other instance of `State` to compare to |

