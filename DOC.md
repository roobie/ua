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

## ~monad()
This is the function returned by invoking the type initializer.
It allows for reading and updating the internally stored value
by checking whether or not an argument was received in its
invocation.

**Kind**: inner function  
**Mixes**: <code>augment</code>  
**Example**  
```js
const x = State(1)
console.assert(x() === 1)
console.assert(x(2) === 2)
```

* [~monad()](#monad)
    * [.equals(m)](#monad+equals) ⇒ <code>bool</code>
    * [.map(f)](#monad+map) ⇒ <code>[monad](#monad)</code>

<a name="monad+equals"></a>

### monad.equals(m) ⇒ <code>bool</code>
Compares two instances of `State` by using `===` on their internal values

**Kind**: instance method of <code>[monad](#monad)</code>  
**Returns**: <code>bool</code> - `true` if strictly equal, `false` if not  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| m | <code>[State](#State)</code> | the other instance of `State` to compare to |

<a name="monad+map"></a>

### monad.map(f) ⇒ <code>[monad](#monad)</code>
Maps a function over the value of this instance of `State`

**Kind**: instance method of <code>[monad](#monad)</code>  
**Returns**: <code>[monad](#monad)</code> - a new instance of the `State` monad with its value set to the
result of the mapping  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| f | <code>function</code> | the function to apply |

