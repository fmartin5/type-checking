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
	
	typeChecking.disabled = false;
	
	const areSymbolsSupported = typeof Symbol === "function";
	const isSymbolIteratorSupported = (areSymbolsSupported && typeof Symbol.iterator === "symbol");
	const isSymbolToStringTagSupported = (areSymbolsSupported && typeof Symbol.toStringTag === "symbol");
	
	function getErrorMessage(errorType, parameterName, readableTypeDescription) {
		return `An instance of '${errorType.name}' was about to be thrown but the error constructor was called incorrectly: argument ${parameterName} was not ${readableTypeDescription}.`;
	}
	
	// @param {string} typeDescription - A non-empty and preferably readable description of the type which was expected.
	// @param {function} [thrower] - A function that should not show up in the stack trace of the generated error.
	function throwNewTypeError(typeDescription, thrower) {
		if(typeof typeDescription !== "string" || typeDescription === "") {
			// Do not attempt to modify the 'stack' property in this case.
			throw new TypeError(getErrorMessage(TypeError, "typeDescription", "a non-empty string"));
		}
		const error = new TypeError("expected " + typeDescription + ".");
		if("1" in arguments) {
			if(typeof thrower !== "function") {
				throw new TypeError(getErrorMessage(TypeError, "thrower", "a function"));
			}
			if(typeof Error.captureStackTrace === "function") {
				Error.captureStackTrace(error, thrower);
			}
		}
		throw error;
	}
	
	typeChecking.throwNewTypeError = throwNewTypeError;
	
	typeChecking.isArray =
		function isArray(x) {
			return Array.isArray(x);
		};
	
	// 24.1.5 'ArrayBuffer' instances each have an [[ArrayBufferData]] internal slot and an [[ArrayBufferByteLength]] internal slot.
	typeChecking.isArrayBuffer =
		function isArrayBuffer(x) {
			try {
				Reflect.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get.call(x);
				return true;
			}
			catch(_) {
				return false;
			}
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
			try {
				Object.getOwnPropertyDescriptor(DataView.prototype, "buffer").get.call(x);
				return true; 
			}
			catch(_) {
				return false;
			}
		};
	
	typeChecking.isDate =
		function isDate(x) {
			try {
				Date.prototype.getDate.call(x);
				return true;
			}
			catch(_) {
				return false;
			}
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
				}
				catch (_) {
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
	
	typeChecking.isInstanceOf =
		function isInstanceOf(x, ctor) {
			return x !== null && typeof x !== "undefined"
			&& typeof ctor === "function" && x instanceof ctor;
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
			}
			catch(_) {
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
	
	typeChecking.isNegativeInteger =
		function isNegativeInteger(value) {
			return typeof value === "number" && value % 1 === 0
			&& value <= 0 && value > Number.NEGATIVE_INFINITY && !Object.is(value, 0);
		};
	
	typeChecking.isNegativeNumber =
		function isNegativeNumber(value) {
			return typeof value === "number" && value <= 0 && !Object.is(value, 0);
		};
	
	typeChecking.isNonEmptyArray =
		function isNonEmptyArray(arg) {
			return Array.isArray(arg) && arg.length > 0;
		};
	
	typeChecking.isNonEmptyArrayLike =
		function isNonEmptyArrayLike(arg) {
			return typeChecking.isArrayLike(arg) && arg.length > 0;
		};
	
	typeChecking.isNonEmptyString =
		function isNonEmptyString(arg) {
			return typeof arg === "string" && arg !== "";
		};
	
	typeChecking.isNonNull =
		function isNonNull(x) {
			return x !== null && typeof x !== "undefined";
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
			&& value >= 0 && value < Number.POSITIVE_INFINITY && !Object.is(value, -0);
		};
	
	typeChecking.isPositiveNumber =
		function isPositiveNumber(value) {
			return typeof value === "number" && value >= 0 && !Object.is(value, -0);
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
				}
				catch(_) {
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
			}
			catch(_) {
				return false;
			}
		};
	
	// 24.1.5 'SharedArrayBuffer' instances each have an [[ArrayBufferData]] internal slot and an [[ArrayBufferByteLength]] internal slot.
	typeChecking.isSharedArrayBuffer =
		function isSharedArrayBuffer(x) {
			try {
				Reflect.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, "byteLength").get.call(x);
				return true;
			}
			catch(_) {
				return false;
			}
		};
	
	typeChecking.isStrictlyNegativeInteger =
		function isStrictlyNegativeInteger(value) {
			return typeof value === "number" && value % 1 === 0
			&& value < 0 && value > Number.NEGATIVE_INFINITY;
		};
	
	typeChecking.isStrictlyNegativeNumber =
		function isStrictlyNegativeNumber(value) {
			return typeof value === "number" && value < 0;
		};
	
	typeChecking.isStrictlyPositiveInteger =
		function isStrictlyPositiveInteger(value) {
			return typeof value === "number" && value % 1 === 0
			&& value > 0 && value < Number.POSITIVE_INFINITY;
		};
	
	typeChecking.isStrictlyPositiveNumber =
		function isStrictlyPositiveNumber(value) {
			return typeof value === "number" && value > 0;
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
			} 
			catch(_) {
				return false;
			}
		};
	
	typeChecking.isWeakSet =
		function isWeakSet(o) {
			try {
				WeakSet.prototype.has.call(o, {});
				return true;
			}
			catch(_) {
				return false;
			}
		};
	
	const descriptionsByTypeName = {
		'Array': "an 'Array' object",
		'ArrayBuffer': "an 'ArrayBuffer' object",
		'ArrayLike': "an array-like value",
		'ArrayLikeObject': "an array-like object",
		'Boolean': "a boolean",
		'Date': "a 'Date' object",
		'DuckOf': "a duck of the given 'duckType'",
		'Function': "a function",
		'InstanceOf': "an instance of the given constructor",
		'Integer': "an integer",
		'Iterable': "an iterable",
		'Map': "a 'Map' object",
		
		'MutableArrayLikeObject': "a mutable array-like object",
		'NegativeInteger': "a negative integer",
		'NegativeNumber': "a negative number",
		'NonEmptyArray': "a non-empty Array object",
		'NonEmptyArrayLike': "a non-empty array-like value",
		'NonEmptyString': "a non-empty string",
		'NonNull': "neither 'null' nor 'undefined'",
		'NonPrimitive': "a non-primitive value",
		'Number': "a number",
		'PositiveInteger': "a positive integer",
		'PositiveNumber': "a positive number",
		
		'Primitive': "a primitive value",
		'RegularNumber': "a regular number",
		'RegExp': "a 'RegExp' object",
		'SafeInteger': "a safe integer",
		'Set': "a 'Set' object",
		'SharedArrayBuffer': "a 'SharedArrayBuffer' object",
		'StrictlyNegativeInteger': "a strictly negative integer",
		'StrictlyNegativeNumber': "a strictly negative number",
		'StrictlyPositiveInteger': "a strictly positive integer",
		'StrictlyPositiveNumber': "a strictly positive number",
		'String': "a string",
		'Symbol': "a symbol",
		'WeakMap': "a 'WeakMap' object",
		'WeakSet': "a 'WeakSet' object",
	};
	
	const typeNames = Object.keys(descriptionsByTypeName);
	
	for(const typeName of typeNames) {
		const description = descriptionsByTypeName[typeName];
		if(typeof description !== "string" || description === "") throw new TypeError(`Invalid or missing type description for type '${typeName}'.`);
		const predicateName = "is" + typeName;
		const predicate = typeChecking[predicateName];
		if(typeof predicate !== "function") throw new TypeError(`Invalid or missing predicate: '${predicateName}'.`);
	}
	
	for(const typeName of typeNames) {
		
		// eslint-disable-next-line no-loop-func
		(function makeExpectation(typeName) {
			
			typeChecking["expect" + typeName] = (function expectation(arg, ...args) {
				if(typeChecking.disabled) return;
				if(!typeChecking["is" + typeName](arg, ...args)) {
					throwNewTypeError(descriptionsByTypeName[typeName], expectation);
				}
			});
		
		}(typeName));
	}
	
	for(const typeName of typeNames) {
		
		// eslint-disable-next-line no-loop-func
		(function makePluralExpectation(typeName) {
			const description = descriptionsByTypeName[typeName];
			const predicate = typeChecking["is" + typeName];
			const pluralTypeName = pluralizeTypeName(typeName);
			const pluralTypeDescription = "an array (or array-like object) where every element is " + description;
			const elementTypeDescription = "every element to be " + description;
			
			function pluralizeTypeName(typeName) {
				if(typeName.endsWith("instanceOf")) {
					return typeName.slice(0, -("instanceOf".length)) + "instancesOf";
				}
				else if(typeName.endsWith("Of")) {
					return typeName.slice(0, -("Of".length)) + "sOf";
				}
				else if(typeName.endsWith("s") || typeName.endsWith("x")) {
					return typeName + "es";
				}
				else {
					return typeName + "s";
				}
			}
			
			typeChecking["expect" + pluralTypeName] = (function expectation(values, ...args) {
				if(typeChecking.disabled) return;
				if(!typeChecking.isArrayLikeObject(values)) {
					throwNewTypeError(pluralTypeDescription, expectation);
				}
				for(const value of values) {
					if(!predicate(value, ...args)) {
						throwNewTypeError(elementTypeDescription, expectation);
					}
				}
			});
		}(typeName));
	}
	
	for(const typeName of typeNames) {
		
		// eslint-disable-next-line no-loop-func
		(function makeOptionalExpectation(typeName) {
			const description = descriptionsByTypeName[typeName];
			const predicate = typeChecking["is" + typeName];
			
			typeChecking["expectOptional" + typeName] = (function expectation(arg, ...args) {
				if(typeChecking.disabled) return;
				if(typeof arg === 'undefined') return;
				if(!predicate(arg, ...args)) {
					throwNewTypeError(description, expectation);
				}
			});
		}(typeName));
	}
	
	return typeChecking;
	
}())));
