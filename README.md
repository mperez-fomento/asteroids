# Array

> An **array** is a list of objects.

| Index   | 0       | 1        | 2       | 3         |
| Element | `apple` | `orange` | `lemon` | `apricot` |

<p></p>

-   **Element**: every object on the list.
-   **Index**: the position of an element on the list (starting at zero).
-   **Length**: number of elements.


# Create an empty array

-   As for any other class of objects:
    
    ```js
    let fruits = new Array();
    let sequence = new Array();
    ```

-   Shortcut:
    
    ```js
    let fruits = [];
    let sequence = [];
    ```

<http://localhost:9000/examples/blank.html>


# Add elements

-   On creation:
    
    ```js
    let fruits = new Array("apple", "orange", "lemon", "apricot");
    let sequence = [1, 1, 2, 3, 5, 8, 13];
    ```

-   After creating it:
    
    ```js
    let semaphore = [];
    let redLight = new Circle(100, "red");
    let yellowLight = new Circle(100, "yellow");
    let greenLight = new Circle(100, "green");
    semaphore.push(redLight);
    semaphore.push(yellowLight);
    semaphore.push(greenLight);
    ```


# Access the elements

> Subscript operator: `[]` `arrayName[index]`

```js
let fruits = new Array("apple", "orange", "lemon", "apricot");
let sequence = [1, 1, 2, 3, 5, 8, 13];
console.log(fruits[0]);
console.log(sequence[3]);
```


## Arrays are zero-indexed

```js
let primes = [2, 3, 5, 7, 11, 13, 17];
```

Access the first element

```js
primes[0];
```


## Arrays are zero-indexed

```js
let primes = [2, 3, 5, 7, 11, 13, 17];
```

Access element whose value is 7:

```js
primes[3];
```


## Arrays are zero-indexed

```js
let primes = [2, 3, 5, 7, 11, 13, 17];
```

Access the last element

```js
primes[6];
```


# Array length

> Array&rsquo;s property `length` gives its length.
> 
> `arrayName.length`

```js
let primes = [2, 3, 5, 7, 11, 13, 17];
console.log(primes.length);
```


## Arrays are zero-indexed

```js
let primes = [2, 3, 5, 7, 11, 13, 17];
```

Which is the length of the array `primes`?

```js
primes.length == 7
```

Which is the last element&rsquo;s index?

```js
6
```


## Arrays are zero-indexed

```js
let primes = [2, 3, 5, 7, 11, 13, 17];
```

Access the last element

```js
primes[primes.length - 1];
```


# Get the position of an element

> `arrayName.indexOf(value)` returns the index of the **first** element whose value is `value`.

```js
let fruits = new Array("apple", "orange", "lemon", "apricot");
console.log(fruits.indexOf("orange"));
```


# Iterate an array

> To iterate an array: to perform some action on every element of the array.


## Iterate an array

```js
let fruits = new Array("apple", "orange", "lemon", "apricot");
let i = 0;
while (i < fruits.length) {
  console.log(fruits[i]);
  i = i + 1;
}
```

<iframe src="./examples/iterate.html" width="100%" height="400px"></iframe>


# Other operations

-   *array.splice(start, count)*: delete elements.
-   *array.concat(item1, item2,&#x2026;)*: append elements.
-   *array.concat(another)*: append *another* array.
-   *array.includes(value)*: is *value* in *array*?

```js
let fruits = new Array("apple", "orange", "lemon", "apricot");
fruits.splice(1, 2); // fruits = ["apple", "apricot"]
fruits.concat("plum", "pear", "peach");
// fruits = ["apple", "apricot", "plum", "pear", "peach"]
console.log(fruits.includes("pineapple")); // false
```
