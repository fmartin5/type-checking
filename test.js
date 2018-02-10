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
		
		const vm = require("vm");
		const sandbox = Object.create(null);
		vm.createContext(sandbox);
		
		const foreignEmptyArray = vm.runInContext("[]", sandbox);
		const foreignEmptyArrayBuffer = vm.runInContext("new ArrayBuffer()", sandbox);
		const foreignEmptyArrayLikeObject = vm.runInContext("({length: 0})", sandbox);
		const foreignEmptyBoolean = vm.runInContext("new Boolean()", sandbox);
		const foreignEmptyDataView = vm.runInContext("new DataView(new ArrayBuffer())", sandbox);
		const foreignEmptyDate = vm.runInContext("new Date()", sandbox);
		const foreignEmptyError = vm.runInContext("new Error()", sandbox);
		const foreignEmptyFunction = vm.runInContext("new Function()", sandbox);
		const foreignEmptyGeneratorFunction = vm.runInContext("(function* () {})", sandbox);
		const foreignEmptyGeneratorObject = vm.runInContext("(function* () {})()", sandbox);
		const foreignEmptyMap = vm.runInContext("new Map()", sandbox);
		const foreignEmptyNullObject = vm.runInContext("Object.create(null)", sandbox);
		const foreignEmptyNumber = vm.runInContext("new Number()", sandbox);
		const foreignEmptyPlainObject = vm.runInContext("{}", sandbox);
		const foreignEmptyRegExp = vm.runInContext("new RegExp()", sandbox);
		const foreignEmptySet = vm.runInContext("new Set()", sandbox);
		const foreignEmptyWeakMap = vm.runInContext("new WeakMap()", sandbox);
		const foreignEmptyWeakSet = vm.runInContext("new WeakSet()", sandbox);		

		const foreignEmptyString = vm.runInContext("('')", sandbox);
		const foreignRexExpPrototype = vm.runInContext("RegExp.prototype", sandbox);
		
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
			
			assert.ok(tc.isArray(foreignEmptyArray));
		});
		
		test("@function .isArrayBuffer", function () {
			assert.ok(tc.isArrayBuffer(emptyArrayBuffer));
			assert.ok(tc.isArrayBuffer(s) === false);
			assert.ok(tc.isArrayBuffer(arguments) === false);
			assert.ok(tc.isArrayBuffer(emptyPlainObject) === false);
			assert.ok(tc.isArrayBuffer(fakeArrayBuffer) === false);
			assert.ok(tc.isArrayBuffer(maskedArrayBuffer));

			assert.ok(tc.isArrayBuffer(foreignEmptyArrayBuffer));
		});
		
		test("@function .isArrayLike", function () {
			assert.ok(tc.isArrayLike(emptyArray));
			assert.ok(tc.isArrayLike(s));
			assert.ok(tc.isArrayLike(arguments));
			assert.ok(tc.isArrayLike(emptyPlainObject) === false);
			assert.ok(tc.isArrayLike(fakeArray) === false);
			assert.ok(tc.isArrayLike(maskedArray));

			assert.ok(tc.isArrayLike(foreignEmptyArray));
			assert.ok(tc.isArrayLike(foreignEmptyArrayLikeObject));
			assert.ok(tc.isArrayLike(foreignEmptyString));
		});
		
		test("@function .isArrayLikeObject", function () {
			assert.ok(tc.isArrayLikeObject(emptyArray));
			assert.ok(tc.isArrayLikeObject(s) === false);
			assert.ok(tc.isArrayLikeObject(arguments));
			assert.ok(tc.isArrayLikeObject(emptyPlainObject) === false);
			assert.ok(tc.isArrayLikeObject(fakeArray) === false);
			assert.ok(tc.isArrayLikeObject(maskedArray));
			
			assert.ok(tc.isArrayLikeObject(foreignEmptyArray));
			assert.ok(tc.isArrayLikeObject(foreignEmptyArrayLikeObject));
			assert.ok(tc.isArrayLikeObject(foreignEmptyString) === false);
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
			assert.ok(tc.isDataView(foreignEmptyDataView));
		});
		
		test("@function .isDate", function () {
			assert.ok(tc.isDate(dateObject) === false);
			assert.ok(tc.isDate(emptyDate));
			assert.ok(tc.isDate(fakeDate) === false);
			assert.ok(tc.isDate(maskedDate));
			assert.ok(tc.isDate(0) === false);
			assert.ok(tc.isDate("Monday") === false);
			assert.ok(tc.isDate(foreignEmptyDate));
		});		
		
		test("@function .isGeneratorFunction", function () {
			assert.ok(tc.isGeneratorFunction(emptyFunction) === false);
			assert.ok(tc.isGeneratorFunction(emptyGeneratorFunction));
			assert.ok(tc.isGeneratorFunction(emptyGeneratorObject) === false);
			assert.ok(tc.isGeneratorFunction(functionObject) === false);
			assert.ok(tc.isGeneratorFunction(foreignEmptyGeneratorFunction));
		});		
		
		test("@function .isFunction", function () {
			assert.ok(tc.isFunction(emptyFunction));
			assert.ok(tc.isFunction(emptyGeneratorFunction));
			assert.ok(tc.isFunction(fakeFunction) === false);
			assert.ok(tc.isFunction(functionObject) === false);
			assert.ok(tc.isFunction(maskedFunction));
			assert.ok(tc.isFunction(foreignEmptyFunction));
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
		
		test("@function .isMap", function () {
			assert.ok(tc.isMap(emptyMap));
			assert.ok(tc.isMap(fakeMap) === false);
			assert.ok(tc.isMap(mapObject) === false);
			assert.ok(tc.isMap(maskedMap));
			
			assert.ok(tc.isMap(emptyPlainObject) === false);
			assert.ok(tc.isMap(emptySet) === false);
			assert.ok(tc.isMap(emptyWeakMap) === false);
			assert.ok(tc.isMap(weakMapObject) === false);
			
			assert.ok(tc.isMap(foreignEmptyMap));
		});
		
		test("@function .isNegativeInteger", function () {
			assert.ok(tc.isNegativeInteger(0) === false);
			assert.ok(tc.isNegativeInteger(-0));
			assert.ok(tc.isNegativeInteger(1) === false);
			assert.ok(tc.isNegativeInteger(-1));
			assert.ok(tc.isNegativeInteger(Math.PI) === false);
			assert.ok(tc.isNegativeInteger(NaN) === false);
			assert.ok(tc.isNegativeInteger(Infinity) === false);
			assert.ok(tc.isNegativeInteger(-Infinity) === false);
			
			assert.ok(tc.isNegativeInteger(false) === false);
			assert.ok(tc.isNegativeInteger(true) === false);
			assert.ok(tc.isNegativeInteger("-1") === false);
			assert.ok(tc.isNegativeInteger(booleanObject) === false);
			assert.ok(tc.isNegativeInteger(numberObject) === false);
			assert.ok(tc.isNegativeInteger(null) === false);
			assert.ok(tc.isNegativeInteger(undefined) === false);
			assert.ok(tc.isNegativeInteger("") === false);
		});
		
		test("@function .isNegativeNumber", function () {
			assert.ok(tc.isNegativeNumber(0) === false);
			assert.ok(tc.isNegativeNumber(-0));
			assert.ok(tc.isNegativeNumber(1) === false);
			assert.ok(tc.isNegativeNumber(-1));
			assert.ok(tc.isNegativeNumber(Math.PI) === false);
			assert.ok(tc.isNegativeNumber(NaN) === false);
			assert.ok(tc.isNegativeNumber(Infinity) === false);
			assert.ok(tc.isNegativeNumber(-Infinity));
			
			assert.ok(tc.isNegativeNumber(false) === false);
			assert.ok(tc.isNegativeNumber(true) === false);
			assert.ok(tc.isNegativeNumber("-1") === false);
			assert.ok(tc.isNegativeNumber(booleanObject) === false);
			assert.ok(tc.isNegativeNumber(numberObject) === false);
			assert.ok(tc.isNegativeNumber(null) === false);
			assert.ok(tc.isNegativeNumber(undefined) === false);
			assert.ok(tc.isNegativeNumber("") === false);
		});
		
		test("@function .isNonEmptyString", function () {
			assert.ok(tc.isNonEmptyString(0) === false);
			assert.ok(tc.isNonEmptyString("") === false);
			assert.ok(tc.isNonEmptyString("abc"));
			assert.ok(tc.isNonEmptyString([""]) === false);
			assert.ok(tc.isNonEmptyString(["a", "b"]) === false);
			assert.ok(tc.isNonEmptyString(["abc"]) === false);
			assert.ok(tc.isNonEmptyString({'toString': () => ""}) === false);
			assert.ok(tc.isNonEmptyString({'toString': () => "abc"}) === false);
			
			assert.ok(tc.isNonEmptyString(false) === false);
			assert.ok(tc.isNonEmptyString(true) === false);
			assert.ok(tc.isNonEmptyString(" "));
			assert.ok(tc.isNonEmptyString("\x00"));
			assert.ok(tc.isNonEmptyString(booleanObject) === false);
			assert.ok(tc.isNonEmptyString(numberObject) === false);
			assert.ok(tc.isNonEmptyString(null) === false);
			assert.ok(tc.isNonEmptyString(undefined) === false);
		});
		
		test("@function .isNonNull", function () {
			assert.ok(tc.isNonNull(0));
			assert.ok(tc.isNonNull(-0));
			assert.ok(tc.isNonNull(NaN));
			assert.ok(tc.isNonNull(+Infinity));
			assert.ok(tc.isNonNull(-Infinity));
			assert.ok(tc.isNonNull(""));
			assert.ok(tc.isNonNull("null"));
			assert.ok(tc.isNonNull("undefined"));
			assert.ok(tc.isNonNull(false));
			assert.ok(tc.isNonNull(true));
			assert.ok(tc.isNonNull(null) === false);
			assert.ok(tc.isNonNull(undefined) === false);
			
			assert.ok(tc.isNonNull(emptyNullObject));
			assert.ok(tc.isNonNull(emptyPlainObject));
			
			assert.ok(tc.isNonNull({'valueOf': () => null}));
			assert.ok(tc.isNonNull({'valueOf': () => undefined}));
		});
		
		test("@function .isNumber", function () {
			assert.ok(tc.isNumber(0));
			assert.ok(tc.isNumber(-0));
			assert.ok(tc.isNumber(1));
			assert.ok(tc.isNumber(-1));
			assert.ok(tc.isNumber(Math.PI));
			assert.ok(tc.isNumber(NaN));
			assert.ok(tc.isNumber(Infinity));
			assert.ok(tc.isNumber(-Infinity));
			
			assert.ok(tc.isNumber(false) === false);
			assert.ok(tc.isNumber(true) === false);
			assert.ok(tc.isNumber("1") === false);
			assert.ok(tc.isNumber(booleanObject) === false);
			assert.ok(tc.isNumber(numberObject) === false);
			assert.ok(tc.isNumber(null) === false);
			assert.ok(tc.isNumber(undefined) === false);
			assert.ok(tc.isNumber("") === false);
		});
		
		test("@function .isPositiveInteger", function () {
			assert.ok(tc.isPositiveInteger(0));
			assert.ok(tc.isPositiveInteger(-0) === false);
			assert.ok(tc.isPositiveInteger(1));
			assert.ok(tc.isPositiveInteger(-1) === false);
			assert.ok(tc.isPositiveInteger(Math.PI) === false);
			assert.ok(tc.isPositiveInteger(NaN) === false);
			assert.ok(tc.isPositiveInteger(Infinity) === false);
			assert.ok(tc.isPositiveInteger(-Infinity) === false);
			
			assert.ok(tc.isPositiveInteger(false) === false);
			assert.ok(tc.isPositiveInteger(true) === false);
			assert.ok(tc.isPositiveInteger("1") === false);
			assert.ok(tc.isPositiveInteger(booleanObject) === false);
			assert.ok(tc.isPositiveInteger(numberObject) === false);
			assert.ok(tc.isPositiveInteger(null) === false);
			assert.ok(tc.isPositiveInteger(undefined) === false);
			assert.ok(tc.isPositiveInteger("") === false);
		});
		
		test("@function .isPositiveNumber", function () {
			assert.ok(tc.isPositiveNumber(0));
			assert.ok(tc.isPositiveNumber(-0) === false);
			assert.ok(tc.isPositiveNumber(1));
			assert.ok(tc.isPositiveNumber(-1) === false);
			assert.ok(tc.isPositiveNumber(Math.PI));
			assert.ok(tc.isPositiveNumber(NaN) === false);
			assert.ok(tc.isPositiveNumber(Infinity));
			assert.ok(tc.isPositiveNumber(-Infinity) === false);
			
			assert.ok(tc.isPositiveNumber(false) === false);
			assert.ok(tc.isPositiveNumber(true) === false);
			assert.ok(tc.isPositiveNumber("1") === false);
			assert.ok(tc.isPositiveNumber(booleanObject) === false);
			assert.ok(tc.isPositiveNumber(numberObject) === false);
			assert.ok(tc.isPositiveNumber(null) === false);
			assert.ok(tc.isPositiveNumber(undefined) === false);
			assert.ok(tc.isPositiveNumber("") === false);
		});
		
		test("@function .isPrimitive", function () {
			assert.ok(tc.isPrimitive(false));
			assert.ok(tc.isPrimitive(true));
			assert.ok(tc.isPrimitive(0));
			assert.ok(tc.isPrimitive(1));
			assert.ok(tc.isPrimitive(Math.PI));
			assert.ok(tc.isPrimitive(NaN));
			assert.ok(tc.isPrimitive(Infinity));
			assert.ok(tc.isPrimitive(-Infinity));
			assert.ok(tc.isPrimitive("false"));
			assert.ok(tc.isPrimitive("true"));
			assert.ok(tc.isPrimitive(emptyArray) === false);
			assert.ok(tc.isPrimitive(emptyBoolean) === false);
			assert.ok(tc.isPrimitive(emptyNumber) === false);
			assert.ok(tc.isPrimitive(emptyPlainObject) === false);
			assert.ok(tc.isPrimitive(null));
			assert.ok(tc.isPrimitive(undefined));
			assert.ok(tc.isPrimitive(""));
		});
		
		
		test("@function .isSet", function () {
			assert.ok(tc.isSet(emptySet));
			assert.ok(tc.isSet(fakeSet) === false);
			assert.ok(tc.isSet(mapObject) === false);
			assert.ok(tc.isSet(maskedSet));
			
			assert.ok(tc.isSet(emptyPlainObject) === false);
			assert.ok(tc.isSet(emptyMap) === false);
			assert.ok(tc.isSet(emptyWeakSet) === false);
			assert.ok(tc.isSet(weakSetObject) === false);
			
			assert.ok(tc.isSet(foreignEmptySet));
		});
		
		test("@function .isStrictlyNegativeInteger", function () {
			assert.ok(tc.isStrictlyNegativeInteger(0) === false);
			assert.ok(tc.isStrictlyNegativeInteger(-0) === false);
			assert.ok(tc.isStrictlyNegativeInteger(1) === false);
			assert.ok(tc.isStrictlyNegativeInteger(-1));
			assert.ok(tc.isStrictlyNegativeInteger(Math.PI) === false);
			assert.ok(tc.isStrictlyNegativeInteger(-Math.PI) === false);
			assert.ok(tc.isStrictlyNegativeInteger(NaN) === false);
			assert.ok(tc.isStrictlyNegativeInteger(Infinity) === false);
			assert.ok(tc.isStrictlyNegativeInteger(-Infinity) === false);
			assert.ok(tc.isStrictlyPositiveNumber({'valueOf': () => -1}) === false);
			
			assert.ok(tc.isStrictlyNegativeInteger(false) === false);
			assert.ok(tc.isStrictlyNegativeInteger(true) === false);
			assert.ok(tc.isStrictlyNegativeInteger("-1") === false);
			assert.ok(tc.isStrictlyNegativeInteger(booleanObject) === false);
			assert.ok(tc.isStrictlyNegativeInteger(numberObject) === false);
			assert.ok(tc.isStrictlyNegativeInteger(null) === false);
			assert.ok(tc.isStrictlyNegativeInteger(undefined) === false);
			assert.ok(tc.isStrictlyNegativeInteger("") === false);
		});
		
		test("@function .isStrictlyNegativeNumber", function () {
			assert.ok(tc.isStrictlyNegativeNumber(0) === false);
			assert.ok(tc.isStrictlyNegativeNumber(-0) === false);
			assert.ok(tc.isStrictlyNegativeNumber(1) === false);
			assert.ok(tc.isStrictlyNegativeNumber(-1));
			assert.ok(tc.isStrictlyNegativeNumber(Math.PI) === false);
			assert.ok(tc.isStrictlyNegativeNumber(-Math.PI));
			assert.ok(tc.isStrictlyNegativeNumber(NaN) === false);
			assert.ok(tc.isStrictlyNegativeNumber(Infinity) === false);
			assert.ok(tc.isStrictlyNegativeNumber(-Infinity));
			assert.ok(tc.isStrictlyPositiveNumber({'valueOf': () => -1}) === false);
			
			assert.ok(tc.isStrictlyNegativeNumber(false) === false);
			assert.ok(tc.isStrictlyNegativeNumber(true) === false);
			assert.ok(tc.isStrictlyNegativeNumber("-1") === false);
			assert.ok(tc.isStrictlyNegativeNumber(booleanObject) === false);
			assert.ok(tc.isStrictlyNegativeNumber(numberObject) === false);
			assert.ok(tc.isStrictlyNegativeNumber(null) === false);
			assert.ok(tc.isStrictlyNegativeNumber(undefined) === false);
			assert.ok(tc.isStrictlyNegativeNumber("") === false);
		});
		
		test("@function .isStrictlyPositiveInteger", function () {
			assert.ok(tc.isStrictlyPositiveInteger(0) === false);
			assert.ok(tc.isStrictlyPositiveInteger(-0) === false);
			assert.ok(tc.isStrictlyPositiveInteger(1));
			assert.ok(tc.isStrictlyPositiveInteger(-1) === false);
			assert.ok(tc.isStrictlyPositiveInteger(emptyNumber) === false);
			assert.ok(tc.isStrictlyPositiveInteger(new Number(1)) === false);
			assert.ok(tc.isStrictlyPositiveInteger(Math.PI) === false);
			assert.ok(tc.isStrictlyPositiveInteger(-Math.PI) === false);
			assert.ok(tc.isStrictlyPositiveInteger(NaN) === false);
			assert.ok(tc.isStrictlyPositiveInteger(Infinity) === false);
			assert.ok(tc.isStrictlyPositiveInteger(-Infinity) === false);
			assert.ok(tc.isStrictlyPositiveNumber({'valueOf': () => 1}) === false);
			
			assert.ok(tc.isStrictlyPositiveInteger(false) === false);
			assert.ok(tc.isStrictlyPositiveInteger(true) === false);
			assert.ok(tc.isStrictlyPositiveInteger("1") === false);
			assert.ok(tc.isStrictlyPositiveInteger(booleanObject) === false);
			assert.ok(tc.isStrictlyPositiveInteger(numberObject) === false);
			assert.ok(tc.isStrictlyPositiveInteger(null) === false);
			assert.ok(tc.isStrictlyPositiveInteger(undefined) === false);
			assert.ok(tc.isStrictlyPositiveInteger("") === false);
		});
		
		test("@function .isStrictlyPositiveNumber", function () {
			assert.ok(tc.isStrictlyPositiveNumber(0) === false);
			assert.ok(tc.isStrictlyPositiveNumber(-0) === false);
			assert.ok(tc.isStrictlyPositiveNumber(1));
			assert.ok(tc.isStrictlyPositiveNumber(-1) === false);
			assert.ok(tc.isStrictlyPositiveNumber(new Number(0)) === false);
			assert.ok(tc.isStrictlyPositiveNumber(new Number(1)) === false);
			assert.ok(tc.isStrictlyPositiveNumber(Math.PI));
			assert.ok(tc.isStrictlyPositiveNumber(-Math.PI) === false);
			assert.ok(tc.isStrictlyPositiveNumber(NaN) === false);
			assert.ok(tc.isStrictlyPositiveNumber(Infinity));
			assert.ok(tc.isStrictlyPositiveNumber(-Infinity) === false);
			assert.ok(tc.isStrictlyPositiveNumber({'valueOf': () => 1}) === false);
			
			assert.ok(tc.isStrictlyPositiveNumber(false) === false);
			assert.ok(tc.isStrictlyPositiveNumber(true) === false);
			assert.ok(tc.isStrictlyPositiveNumber("1") === false);
			assert.ok(tc.isStrictlyPositiveNumber(booleanObject) === false);
			assert.ok(tc.isStrictlyPositiveNumber(numberObject) === false);
			assert.ok(tc.isStrictlyPositiveNumber(null) === false);
			assert.ok(tc.isStrictlyPositiveNumber(undefined) === false);
			assert.ok(tc.isStrictlyPositiveNumber("") === false);
		});
		
	});
});
