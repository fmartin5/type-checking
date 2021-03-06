# type-checking

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]


Runtime type checking and type assertion library for Node and the browser


- Traditional syntax.
- Aims to cover every EcmaScript language type and specification type except Proxy.
- Offers a small set of composable numeric predicates and assertions for integers, signed numbers, and special numbers.
- Cross-realm/iframe support (i.e., predicates should remain correct across different realms).
- Does not get easily fooled by the value of the `Symbol.toStringTag` property.
- Handles `-0` and `NaN` correctly.
- Aims to provide readable error messages.
- Does not rely on Symbol.toStringTag
- You can easily disable `typeChecking.assert()` (but not `.expect()`) for production:
	in Node: by setting the NODE_NDEBUG environment variable;
	in Nashorn: by setting the "nashorn.ndebug" system property.
- Does not aim to cover any DOM API type.
- Does not aim to cover complex constrained string types like email address etc.
- Does not aim to offer custom type constructor.

## Installation
```sh
npm install @fmartin5/type-checking
```
## Usage
```js
const tc = require("@fmartin5/type-checking");

let x = 0;

tc.isNumber(x); // true
tc.isInteger(x); // true

tc.isPositiveNumber(x); // true
tc.isPositiveInteger(x); // true

tc.isStrictlyPositiveNumber(x); // false
tc.isStrictlyPositiveInteger(x); // false


let map = new Map();
tc.isMap(map); // true
tc.isWeakMap(map); // false

tc.expectMap(map); //
tc.expectWeakMap(map); // TypeError: expected a 'WeaMap' object.


```

## Tests

Clone the repo, then do:
```sh
npm install
npm test
```

## License

[AGPL-3.0](LICENSE)

[npm-image]: https://img.shields.io/npm/v/@fmartin5/type-checking.svg
[npm-url]: https://npmjs.org/package/@fmartin5/type-checking

[downloads-image]: https://img.shields.io/npm/dm/@fmartin5/type-checking.svg
[downloads-url]: https://npmjs.org/package/@fmartin5/type-checking
