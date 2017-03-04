## Modules

<dl>
<dt><a href="#module_uniform-accessor">uniform-accessor</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#State">State(value)</a> ⇒ <code>function</code></dt>
<dd><p>Type initializer for a <code>State</code> monad</p>
</dd>
</dl>

<a name="module_uniform-accessor"></a>

## uniform-accessor
<a name="module_uniform-accessor..equals"></a>

### uniform-accessor~equals(m)
Compares two instances of `State` by using `===` on their internal values

**Kind**: inner method of <code>[uniform-accessor](#module_uniform-accessor)</code>  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| m | <code>[State](#State)</code> | the other instance of `State` to compare to |

<a name="State"></a>

## State(value) ⇒ <code>function</code>
Type initializer for a `State` monad

**Kind**: global function  
**Returns**: <code>function</code> - an instance of the `State` monad with its initial value set to `value`  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | the initial value |

<a name="State..monad"></a>

### State~monad()
This is the function returned by invoking the type initializer.
It allows for reading and updating the internally stored value
by checking whether or not an argument was received in its
invocation.

**Kind**: inner method of <code>[State](#State)</code>  
**Mixes**: <code>augment</code>  
**Example**  
```js
const x = State(1)
console.assert(x() === 1)
console.assert(x(2) === 2)
```
