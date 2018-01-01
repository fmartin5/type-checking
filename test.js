// #node mocha --ui=tdd --es_staging mochatests/typeChecking.js
/*
Passing arrow functions (“lambdas”) to Mocha is discouraged. Due to the lexical binding of this, such functions are unable to access the Mocha context. 
*/
'use strict';


const assert = require("assert");
const tc = require("./typeChecking");


suite("@module typeChecking", function () {

	suite("predicates", function () {
		
		const emptyArray = [];
		const emptyArrayBuffer = new ArrayBuffer();	
		const emptyArrayLikeObject = {"length": 0};
		const emptyBoolean = new Boolean();	
		const emptyDataView = new DataView(emptyArrayBuffer);	
		const emptyDate = new Date();
		const emptyError = new Error();
		const emptyFunction = new Function();
		const emptyGeneratorFunction = (function* () {});
		const emptyGeneratorObject = emptyGeneratorFunction();
		const emptyMap = new Map();	
		const emptyNullObject = Object.create(null);
		const emptyNumber = new Number();
		const emptyPlainObject = {};
		const emptyRegExp = new RegExp();
		const emptySet = new Set();	
		const emptyWeakMap = new WeakMap();	
		const emptyWeakSet = new WeakSet();	
		
		const arrayBufferObject = Object.create(ArrayBuffer.prototype);
		const arrayObject = Object.create(Array.prototype);
		const booleanObject = Object.create(Boolean.prototype);
		const dataViewObject = Object.create(DataView.prototype);
		const dateObject = Object.create(Date.prototype);
		const errorObject = Object.create(Error.prototype);
		const functionObject = Object.create(Function.prototype);
		const mapObject = Object.create(Map.prototype);
		const numberObject = Object.create(Number.prototype);
		const regExpObject = Object.create(RegExp.prototype);
		const setObject = Object.create(Set.prototype);
// 		const sharedArrayBufferObject = Object.create(SharedArrayBuffer.prototype);
		const stringObject = Object.create(String.prototype);
		const weakMapObject = Object.create(WeakMap.prototype);
		const weakSetObject = Object.create(WeakSet.prototype);
		
		const fakeArray = {[Symbol.toStringTag]: "Array"};
		const fakeArrayBuffer = {[Symbol.toStringTag]: "ArrayBuffer"};
		const fakeBoolean = {[Symbol.toStringTag]: "Boolean"};
		const fakeDataView = {[Symbol.toStringTag]: "DataView"};
		const fakeDate = {[Symbol.toStringTag]: "Date"};
		const fakeError = {[Symbol.toStringTag]: "Error"};
		const fakeFunction = {[Symbol.toStringTag]: "Function"};
		const fakeMap = {[Symbol.toStringTag]: "Map"};
		const fakeNumber = {[Symbol.toStringTag]: "Number"};
		const fakeRegExp = {[Symbol.toStringTag]: "RegExp"};
		const fakeSet = {[Symbol.toStringTag]: "Set"};
		const fakeWeakMap = {[Symbol.toStringTag]: "WeakMap"};
		const fakeWeakSet = {[Symbol.toStringTag]: "WeakSet"};

		const maskedArray = Object.defineProperty([], Symbol.toStringTag, {"value": "Foo"});
		const maskedArrayBuffer = Object.defineProperty(new ArrayBuffer(), Symbol.toStringTag, {"value": "Foo"});
		const maskedBoolean = Object.defineProperty(new Boolean(), Symbol.toStringTag, {"value": "Foo"});
		const maskedDataView = Object.defineProperty(new DataView(emptyArrayBuffer), Symbol.toStringTag, {"value": "Foo"});
		const maskedDate = Object.defineProperty(new Date(), Symbol.toStringTag, {"value": "Foo"});
		const maskedError = Object.defineProperty(new Error(), Symbol.toStringTag, {"value": "Foo"});
		const maskedFunction = Object.defineProperty(new Function(), Symbol.toStringTag, {"value": "Foo"});
		const maskedMap = Object.defineProperty(new Map(), Symbol.toStringTag, {"value": "Foo"});
		const maskedNumber = Object.defineProperty(new Number(), Symbol.toStringTag, {"value": "Foo"});
		const maskedObject = Object.defineProperty(new Object(), Symbol.toStringTag, {"value": "Foo"});
		const maskedRegExp = Object.defineProperty(new RegExp(), Symbol.toStringTag, {"value": "Foo"});
		const maskedSet = Object.defineProperty(new Set(), Symbol.toStringTag, {"value": "Foo"});
		const maskedString = Object.defineProperty(new String(), Symbol.toStringTag, {"value": "Foo"});
		const maskedWeakMap = Object.defineProperty(new WeakMap(), Symbol.toStringTag, {"value": "Foo"});
		const maskedWeakSet = Object.defineProperty(new WeakSet(), Symbol.toStringTag, {"value": "Foo"});
		
		const s = "abc";

		test("@function .isArray", function () {
			assert.ok(tc.isArray(arrayObject) === false);
			assert.ok(tc.isArray(emptyArray));
			assert.ok(tc.isArray(emptyArrayBuffer) === false);
			assert.ok(tc.isArray(s) === false);
			assert.ok(tc.isArray(arguments) === false);
			assert.ok(tc.isArray(emptyArrayLikeObject) === false);
			assert.ok(tc.isArray(emptyFunction) === false);
			assert.ok(tc.isArray(emptyPlainObject) === false);
			assert.ok(tc.isArray(emptyRegExp) === false);
			assert.ok(tc.isArray(fakeArray) === false);
			assert.ok(tc.isArray(maskedArray));
		});
		
		test("@function .isArrayBuffer", function () {
			assert.ok(tc.isArrayBuffer(emptyArrayBuffer));
			assert.ok(tc.isArrayBuffer(s) === false);
			assert.ok(tc.isArrayBuffer(arguments) === false);
			assert.ok(tc.isArrayBuffer(emptyPlainObject) === false);
			assert.ok(tc.isArrayBuffer(fakeArrayBuffer) === false);
			assert.ok(tc.isArrayBuffer(maskedArrayBuffer));
		});
		
		test("@function .isArrayLike", function () {
			assert.ok(tc.isArrayLike(emptyArray));
			assert.ok(tc.isArrayLike(s));
			assert.ok(tc.isArrayLike(arguments));
			assert.ok(tc.isArrayLike(emptyPlainObject) === false);
			assert.ok(tc.isArrayLike(fakeArray) === false);
			assert.ok(tc.isArrayLike(maskedArray));
		});
		
		test("@function .isArrayLikeObject", function () {
			assert.ok(tc.isArrayLikeObject(emptyArray));
			assert.ok(tc.isArrayLikeObject(s) === false);
			assert.ok(tc.isArrayLikeObject(arguments));
			assert.ok(tc.isArrayLikeObject(emptyPlainObject) === false);
			assert.ok(tc.isArrayLikeObject(fakeArray) === false);
			assert.ok(tc.isArrayLikeObject(maskedArray));
		});		
		
		test("@function .isBoolean", function () {
			assert.ok(tc.isBoolean(false));
			assert.ok(tc.isBoolean(true));
			assert.ok(tc.isBoolean(0) === false);
			assert.ok(tc.isBoolean(1) === false);
			assert.ok(tc.isBoolean("false") === false);
			assert.ok(tc.isBoolean("true") === false);
			assert.ok(tc.isBoolean(emptyArray) === false);
			assert.ok(tc.isBoolean(emptyBoolean) === false);
			assert.ok(tc.isBoolean(emptyPlainObject) === false);
			assert.ok(tc.isBoolean(null) === false);
			assert.ok(tc.isBoolean(undefined) === false);
			assert.ok(tc.isBoolean("") === false);
		});		
		
		test("@function .isDataView", function () {
			assert.ok(tc.isDataView(dataViewObject) === false);
			assert.ok(tc.isDataView(emptyArrayBuffer) === false);
			assert.ok(tc.isDataView(emptyDataView));
			assert.ok(tc.isDataView(fakeDataView) === false);
			assert.ok(tc.isDataView(maskedDataView));
		});
		
		test("@function .isDate", function () {
			assert.ok(tc.isDate(dateObject) === false);
			assert.ok(tc.isDate(emptyDate));
			assert.ok(tc.isDate(fakeDate) === false);
			assert.ok(tc.isDate(maskedDate));
			assert.ok(tc.isDate(0) === false);
			assert.ok(tc.isDate("Monday") === false);
		});		
		
		test("@function .isFormalGeneratorFunction", function () {
			assert.ok(tc.isFormalGeneratorFunction(emptyFunction) === false);
			assert.ok(tc.isFormalGeneratorFunction(emptyGeneratorFunction));
			assert.ok(tc.isFormalGeneratorFunction(emptyGeneratorObject) === false);
			assert.ok(tc.isFormalGeneratorFunction(functionObject) === false);
		});		
		
		test("@function .isFunction", function () {
			assert.ok(tc.isFunction(emptyFunction));
			assert.ok(tc.isFunction(emptyGeneratorFunction));
			assert.ok(tc.isFunction(fakeFunction) === false);
			assert.ok(tc.isFunction(functionObject) === false);
			assert.ok(tc.isFunction(maskedFunction));
		});		
		
		test("@function .isImmutable", function () {
			assert.ok(tc.isImmutable(s));
			assert.ok(tc.isImmutable(0));
			assert.ok(tc.isImmutable(emptyArray) === false);
			assert.ok(tc.isImmutable(emptyFunction) === false);
			assert.ok(tc.isImmutable(emptyNullObject) === false);
			assert.ok(tc.isImmutable(emptyPlainObject) === false);
		});		
		
		test("@function .isIterable", function () {
			assert.ok(tc.isIterable(emptyArray));
			assert.ok(tc.isIterable(emptyArrayBuffer) ===  false);
			assert.ok(tc.isIterable(emptyArrayLikeObject) ===  false);
			assert.ok(tc.isIterable(emptyFunction) === false);
			assert.ok(tc.isIterable(emptyGeneratorFunction) === false);
			assert.ok(tc.isIterable(emptyMap));
			assert.ok(tc.isIterable(emptyPlainObject) === false);
			assert.ok(tc.isIterable(emptyRegExp) === false);
			assert.ok(tc.isIterable(emptySet));
			assert.ok(tc.isIterable(emptyWeakMap) === false);
			assert.ok(tc.isIterable(emptyWeakSet) === false);


			assert.ok(tc.isIterable(arrayObject));
			assert.ok(tc.isIterable(functionObject) === false);
			assert.ok(tc.isIterable(regExpObject) === false);
			assert.ok(tc.isIterable(maskedArray));
			assert.ok(tc.isIterable(maskedArrayBuffer) === false);
			assert.ok(tc.isIterable(maskedFunction) === false);
		});		

	});
});
