# type-checking

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Node.js Version][node-version-image]][node-version-url]


Runtime type checking and type assertion library for Node and the browser.

- Covers every core ES5/6 constructor, including Map, Set, and Symbol.
- Cross-realm support (i.e., type assertion remain correct across different realms).
- Intentionally does not cover any DOM API constructor.
- Readable error messages: automatically skips some useless lines of the stack trace.


## Installation
```sh
npm install @fmartin5/type-checking
```
## Usage
```js
const tc = require("@fmartin5/type-checking");

let map = new Map();
tc.isMap(map); // true
tc.isWeakMap(map); // false

tc.expectMap(map); //
tc.expectWeakMap(map); // TypeError: expected a 'WeaMap' object.


```


## License

[AGPL-3.0](LICENSE)

[npm-image]: https://img.shields.io/npm/v/@fmartin5/type-checking.svg
[npm-url]: https://npmjs.org/package/@fmartin5/type-checking

[downloads-image]: https://img.shields.io/npm/dm/@fmartin5/type-checking.svg
[downloads-url]: https://npmjs.org/package/@fmartin5/type-checking

[node-version-image]: https://img.shields.io/node/v/@fmartin5/type-checking.svg
[node-version-url]: https://nodejs.org/en/download/
