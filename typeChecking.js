/**
 * @fileoverview typeChecking.js - A runtime type checking and assertion library.
 *
 * @formats browser script tag, nodejs module
 *
 * @language syntax: es5 +const +rest - globals: es6 +console
 *
 * @linter ESLint
 *
 * @namespace typeChecking
 * 
 * @design These type checking functions are strict, i.e. they do not coerce any of their arguments.
 * 
 * @references Other dynamic type checking and runtime assertion libraries:
 * 
 * With traditional syntax (TDD assertion style):
 * 
 *   {@link https://nodejs.org/api/assert.html Node module 'assert' (node doc) }
 *   {@link https://github.com/joyent/node-assert-plus (git) } Has support for 'process.env.NODE_NDEBUG'.
 *   {@link http://chaijs.com/api/assert/ chai.assert (doc) } Has assertions, extension API
 *
 *   {@link https://github.com/facebook/prop-types prop-types } Has duck types, type combinators, React integration
 *
 *   {@link https://github.com/etcinit/ensure ensure.js (git) } Has function wrappers, record types
 *   {@link https://github.com/PuerkitoBio/implement.js implement.js (git) } Has duck types, custom error objects
 *   {@link https://github.com/busterjs/samsam samsam (git) }
 *   {@link https://github.com/zvictor/ArgueJS ArgueJS (git) }
 *   {@link https://github.com/sharkbrainguy/type.js Type.js (git) } Has duck types, type combinators
 *   {@link https://github.com/mmaelzer/surely surely } Has function wrappers, an extension method, predefined type specs
 *
 * With chained syntax (BDD assertion style):
 *
 *   {@link http://chaijs.com/api/bdd chai.should, chai.expect (doc) }
 *   {@link https://github.com/philbooth/check-types.js check-types (git) }
 *   {@link https://github.com/Automattic/expect.js expect.js (git) }
 *   {@link https://github.com/arasatasaygin/is.js is.js (git) }
 */
'use strict';


/*eslint indent: "off" */
/*eslint-env browser, node */


// UMD snippet (without AMD support)
(function (root, moduleName, moduleExports) {
	
	// NodeJS support
	if(typeof module === "object") {
		if(typeof module.exports === "object") {
			module.exports = moduleExports;
		}
		else module = moduleExports; // eslint-disable-line no-global-assign
	}
	// Browser support
	else if(root && typeof root === "object") {
		root[moduleName] = moduleExports;
	}
	else throw new Error("Cannot export.");
	
}(this, "typeChecking", (function () {
	
	const typeChecking = Object.create(null);
	
	const reLines = /[\n\r]+/g;
	
	const areSymbolsSupported = typeof Symbol === "function";
	const isSymbolIteratorSupported = (areSymbolsSupported && typeof Symbol.iterator === "symbol");
	const isSymbolToStringTagSupported = (areSymbolsSupported && typeof Symbol.toStringTag === "symbol");
	
	const numberOfStackLinesToSkip = (function () {
		try {
			throw new Error("");
		} catch(error) {
			if("stack" in error) {
				return error.stack.split(reLines).length;
			}
			return 0;
		}
	}());
	
	function throwNewTypeError(readableTypeDescription) {
		const msg = "expected " + readableTypeDescription + ".";
		const error = new TypeError(msg);
		try {
			throw error;
		} catch(error) {
			if(error.stack) error.stack = error.stack.split(reLines).slice(1, -numberOfStackLinesToSkip).join("\n");
			throw error;
		}
	}
	
	typeChecking.throwNewTypeError = throwNewTypeError;
	
	typeChecking.isArray =
					function isArray(x) {
						return Array.isArray(x);
					};
	
	// 24.1.5 'ArrayBuffer' instances each have an [[ArrayBufferData]] internal slot and an [[ArrayBufferByteLength]] internal slot.
	typeChecking.isArrayBuffer =
					function isArrayBuffer(x) {
						try { Reflect.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get.call(x); return true; }
						catch(_) { return false; }
					};
	
	// Allows function objects unlike Lodash (https://lodash.com/docs#isArrayLike).
	// @note: an object being array-like does not guarantee that all generic 'Array' methods will work on it:
	//   some of those methods require their argument's length to be less than 2^32.
	typeChecking.isArrayLike =
					function isArrayLike(x) {
						return typeof x === "string" || (typeof x === "object" || typeof x === "function")
						&& x !== null && Number.isSafeInteger(x.length) && x.length >= 0;
					};
	
	typeChecking.isArrayLikeObject =
					function isArrayLikeObject(x) {
						return (typeof x === "object" || typeof x === "function")
						&& x !== null && Number.isSafeInteger(x.length) && x.length >= 0;
					};
	
	typeChecking.isBoolean =
					function isBoolean(x) {
						return typeof x === "boolean";
					};
	
	typeChecking.isDataView =
					function isDataView(x) {
						try { Object.getOwnPropertyDescriptor(DataView.prototype, "buffer").get.call(x); return true; } catch(_) { return false; }
					};
	
	typeChecking.isDate =
					function isDate(x) {
						try { Date.prototype.getDate.call(x); return true; } catch(_) { return false; }
					};
	
	// @see Duck typing https://en.wikipedia.org/wiki/Duck_typing
	typeChecking.isDuckOf =
					function isDuckOf(x, object) {
						typeChecking.expectNonPrimitive(object);
						if(typeChecking.isPrimitive(x)) return false;
						for(var i in object) {
							if(typeof x[i] !== typeof object[i]) return false;
						}
						return true;
					};
	
	typeChecking.isFormalGeneratorFunction =
					(function () {
						const _GeneratorFunction = (function () {
							try {
								// eslint-disable-next-line no-eval
								return eval("(function* () {}).constructor");
							} catch (_) {
								return null;
							}
						}());
						return function isFormalGeneratorFunction(x) {
							if(!_GeneratorFunction) return false;
							if(typeof x !== "function") return false;
							return x instanceof _GeneratorFunction;
						};
					}());
	
	typeChecking.isFunction =
					function isFunction(x) {
						return typeof x === "function";
					};
	
	typeChecking.isImmutable =
					function isImmutable(value) {
						return typeChecking.isPrimitive(value) || (Object.isSealed(value) && Object.isFrozen(value));
					};
	
	typeChecking.isInteger =
					function isInteger(value) {
						return typeof value === "number" && value % 1 === 0;
					};
	
	typeChecking.isIterable =
					function isIterable(value) {
						if(!isSymbolIteratorSupported) return false;
						if(value === null || typeof value === "undefined") return false;
						return Symbol.iterator in Object(value);
					};
	
	// @see https://stackoverflow.com/questions/29924932/how-to-reliably-check-an-object-is-an-ecmascript-6-map-set
	typeChecking.isMap =
					function isMap(o) {
						try {
							Map.prototype.has.call(o); // throws if o is not an object or has no [[MapData]]
							return true;
						} catch(_) {
							return false;
						}
					};
	
	typeChecking.isMutable =
					function isMutable(value) {
						return !typeChecking.isImmutable(value);
					};
	
	typeChecking.isMutableArrayLikeObject =
					function isMutableArrayLikeObject(value) {
						return typeChecking.isArrayLikeObject(value) && !typeChecking.isImmutable(value);
					};
	
	typeChecking.isNonPrimitive =
					function isNonPrimitive(x) {
						return !typeChecking.isPrimitive(x);
					};
	
	typeChecking.isNumber =
					function isNumber(value) {
						return typeof value === "number";
					};
	
	typeChecking.isPositiveInteger =
					function isPositiveInteger(value) {
						return typeof value === "number" && value % 1 === 0
						&& value >= 0 && value < Number.POSITIVE_INFINITY;
					};
	
	typeChecking.isPositiveNumber =
					function isPositiveNumber(value) {
						return typeof value === "number" && value >= 0;
					};
	
	typeChecking.isPrimitive =
					function isPrimitive(x) {
						return x === null || typeof x === "undefined" || typeof x === "boolean" || typeof x === "number" || typeof x === "string" || typeof x === "symbol";
					};
	
	typeChecking.isRegExp =
					function isRegExp(x) {
						if(isSymbolToStringTagSupported) {
							try {
								// 21.2.5.10 get RegExp.prototype.source
								Reflect.getOwnPropertyDescriptor(RegExp.prototype, "source").get.call(x);
								// Now 'x' is either a 'RegExp' instance or the 'RegExp.prototype' object, which is not a 'RegExp' instance.
								return x !== RegExp.prototype;
							} catch(_) {
								return false;
							}
						}
						return Object.prototype.toString.call(x) === "[object RegExp]";
					};
	
	typeChecking.isRegularNumber =
					function isRegularNumber(value) {
						if(typeof value !== "number") return false;
						// Checks for NaN
						if(value !== value) return false;
						return value < Number.POSITIVE_INFINITY && value > Number.NEGATIVE_INFINITY;
					};
	
	typeChecking.isSafeInteger =
					function isSafeInteger(value) {
						return typeof value === "number" && value % 1 === 0
						&& value >= Number.MIN_SAFE_INTEGER && value <= Number.MAX_SAFE_INTEGER;
					};
	
	// @see https://stackoverflow.com/questions/29924932/how-to-reliably-check-an-object-is-an-ecmascript-6-map-set
	typeChecking.isSet =
					function isSet(o) {
						try {
							Set.prototype.has.call(o); // throws if o is not an object or has no [[SetData]]
							return true;
						} catch(_) {
							return false;
						}
					};
	
	// 24.1.5 'SharedArrayBuffer' instances each have an [[ArrayBufferData]] internal slot and an [[ArrayBufferByteLength]] internal slot.
	typeChecking.isSharedArrayBuffer =
					function isSharedArrayBuffer(x) {
						try { Reflect.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, "byteLength").get.call(x); return true; }
						catch(_) { return false; }
					};

	typeChecking.isStrictlyPositiveInteger =
					function isStrictlyPositiveInteger(value) {
						return typeof value === "number" && value % 1 === 0
						&& value > 0 && value < Number.POSITIVE_INFINITY;
					};
	
	typeChecking.isStrictlyPositiveNumber =
					function isStrictlyPositiveNumber(value) {
						return typeof value === "number" && value > 0 && value < Number.POSITIVE_INFINITY;
					};
	
	typeChecking.isString =
					function isString(x) {
						return typeof x === "string";
					};
	
	typeChecking.isSymbol =
					function isSymbol(value) {
						return typeof value === "symbol";
					};
		
	typeChecking.isWeakMap =
					function isWeakMap(o) {
						try {
							WeakMap.prototype.has.call(o, {});
							return true;
						} catch(_) {
							return false;
						}
					};
	
	typeChecking.isWeakSet =
					function isWeakSet(o) {
						try {
							WeakSet.prototype.has.call(o, {});
							return true;
						} catch(_) {
							return false;
						}
					};
	
	// -------------
	
	typeChecking.expectArray =
					function expectArray(value) {
						if(!typeChecking.isArray(value)) {
							throwNewTypeError("an 'Array' object");
						}
					};
	
	typeChecking.expectArrayBuffer =
					function expectArrayBuffer(value) {
						if(!typeChecking.isArrayBuffer(value)) {
							throwNewTypeError("an 'ArrayBuffer' object");
						}
					};
	
	typeChecking.expectArrayLike =
					function expectArrayLike(value) {
						if(!typeChecking.isArrayLike(value)) {
							throwNewTypeError("an array-like value");
						}
					};
	
	typeChecking.expectArrayLikeObject =
					function expectArrayLikeObject(value) {
						if(!typeChecking.isArrayLikeObject(value)) {
							throwNewTypeError("an array-like object");
						}
					};
	
	typeChecking.expectBoolean =
					function expectBoolean(value) {
						if(!typeChecking.isBoolean(value)) {
							throwNewTypeError("a boolean");
						}
					};
	
	typeChecking.expectDate =
					function expectDate(value) {
						if(!typeChecking.isDate(value)) {
							throwNewTypeError("a 'Date' object");
						}
					};
	
	typeChecking.expectDuckOf =
					function expectDuckOf(value, duckType) {
						if(!typeChecking.isDuckOf(value, duckType)) {
							throwNewTypeError("a duck of the given 'duckType'");
						}
					};
	
	typeChecking.expectFunction =
					function expectFunction(value, arity) {
						if(typeof value !== "function") {
							throwNewTypeError("a function");
						}
						if(arguments.length === 2) {
							typeChecking.expectPositiveInteger(arity);
							if(value.length !== arity) {
								throwNewTypeError("a function with a 'length' of " + arity);
							}
						}
					};
	
	typeChecking.expectInstanceOf =
					function expectInstanceOf(value, ctor) {
						if(!(value instanceof ctor)) {
							throwNewTypeError("an instance of the given constructor");
						}
					};
	
	typeChecking.expectInteger =
					function expectInteger(value) {
						if(!typeChecking.isInteger(value)) {
							throwNewTypeError("an integer");
						}
					};
	
	typeChecking.expectIterable =
					function expectIterable(value) {
						if(!typeChecking.isIterable(value)) {
							throwNewTypeError("an iterable");
						}
					};
	
	typeChecking.expectMap =
					function expectMap(value) {
						if(!typeChecking.isMap(value)) {
							throwNewTypeError("a 'Map' object");
						}
					};
	
	typeChecking.expectMutableArrayLikeObject =
					function expectMutableArrayLikeObject(value) {
						if(!typeChecking.isMutableArrayLikeObject(value)) {
							throwNewTypeError("a mutable array-like object");
						}
					};
	
	typeChecking.expectNonEmptyArrayLike =
					function expectNonEmptyArrayLike(value) {
						if(!typeChecking.isArrayLike(value) || value.length === 0) {
							throwNewTypeError("a non-empty array-like value");
						}
					};
	
	typeChecking.expectNonEmptyString =
					function expectNonEmptyString(value) {
						if(typeof value !== "string" || value === "") {
							throwNewTypeError("a non-empty string");
						}
					};
	
	typeChecking.expectNonNull =
					function expectNonNull(value) {
						if(value === null || typeof value === "undefined") {
							throwNewTypeError("neither 'null' nor 'undefined'");
						}
					};
	
	typeChecking.expectNonPrimitive =
					function expectNonPrimitive(value) {
						if(typeChecking.isPrimitive(value)) {
							throwNewTypeError("a non-primitive value");
						}
					};
	
	typeChecking.expectNumber =
					function expectNumber(value) {
						if(typeof value !== "number") {
							throwNewTypeError("a number");
						}
					};
	
	typeChecking.expectPositiveInteger =
					function expectPositiveInteger(value) {
						if(!typeChecking.isPositiveInteger(value)) {
							throwNewTypeError("a positive integer");
						}
					};
	
	typeChecking.expectPositiveNumber =
					function expectPositiveNumber(value) {
						if(!typeChecking.isPositiveNumber(value)) {
							throwNewTypeError("a positive number");
						}
					};
	
	typeChecking.expectPrimitive =
					function expectPrimitive(value) {
						if(!typeChecking.isPrimitive(value)) {
							throwNewTypeError("a primitive value");
						}
					};
	
	typeChecking.expectRegularNumber =
					function expectRegularNumber(value) {
						if(!typeChecking.isRegularNumber(value)) {
							throwNewTypeError("a regular number");
						}
					};
	
	typeChecking.expectRegExp =
					function expectRegExp(value) {
						if(!typeChecking.isRegExp(value)) {
							throwNewTypeError("a 'RegExp' object");
						}
					};
	
	typeChecking.expectSafeInteger =
					function expectSafeInteger(value) {
						if(!typeChecking.isSafeInteger(value)) {
							throwNewTypeError("a safe integer");
						}
					};
	
	typeChecking.expectSet =
					function expectSet(value) {
						if(!typeChecking.isSet(value)) {
							throwNewTypeError("a 'Set' object");
						}
					};
		
	typeChecking.expectSharedArrayBuffer =
					function expectSharedArrayBuffer(value) {
						if(!typeChecking.isSharedArrayBuffer(value)) {
							throwNewTypeError("a 'SharedArrayBuffer' object");
						}
					};
	
	typeChecking.expectStrictlyPositiveInteger =
					function expectStrictlyPositiveInteger(value) {
						if(!typeChecking.isStrictlyPositiveInteger(value)) {
							throwNewTypeError("a strictly positive integer");
						}
					};
					
	typeChecking.expectStrictlyPositiveNumber =
					function expectStrictlyPositiveNumber(value) {
						if(!typeChecking.isStrictlyPositiveNumber(value)) {
							throwNewTypeError("a strictly positive number");
						}
					};
	
	typeChecking.expectString =
					function expectString(value, length) {
						if(typeof(value) !== "string") {
							throwNewTypeError("a string");
						}
						if(arguments.length === 2) {
							typeChecking.expectPositiveInteger(length);
							if(value.length !== length) {
								throwNewTypeError("a string of length " + length);
							}
						}
					};
	
	typeChecking.expectSymbol =
					function expectSymbol(value) {
						if(!typeChecking.isSymbol(value)) {
							throwNewTypeError("a symbol");
						}
					};
	
	typeChecking.expectWeakMap =
					function expectWeakMap(value) {
						if(!typeChecking.isWeaMap(value)) {
							throwNewTypeError("a 'WeaMap' object");
						}
					};
			
	typeChecking.expectWeakSet =
					function expectWeakSet(value) {
						if(!typeChecking.isWeakSet(value)) {
							throwNewTypeError("a 'WeakSet' object");
						}
					};
	
	for(var name in typeChecking) {
		if(name.startsWith("expect")) {
			
			var pluralName;
			if(name.endsWith("instanceOf")) {
				pluralName = name.slice(0, -("instanceOf".length)) + "instancesOf";
			}
			else if(!name.endsWith("Of")) {
				pluralName = name + "s";
			}
			else {
				continue;
			}
			
			// eslint-disable-next-line no-loop-func
			(function (name) {
				typeChecking[pluralName] = (function (values, ...args) {
					typeChecking.expectArrayLikeObject(values);
					for(var value of values) {
						typeChecking[name](value, ...args);
					}
				});
				
				const optionalName = "expectOptional" + name.slice("expect".length);
				
				typeChecking[optionalName] = (function (value) {
					if(typeof value === 'undefined') return;
					typeChecking[name](value);
				});
			}(name));
		}
	}
	
	return typeChecking;
}())));