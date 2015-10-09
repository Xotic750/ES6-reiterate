/**
 * @file {@link @@HOMEPAGE @@MODULE}
 * @@DESCRIPTION
 * @version @@VERSION
 * @author @@AUTHORNAME <@@AUTHOREMAIL>
 * @copyright @@COPYRIGHT @@AUTHORNAME
 * @license {@link <@@LICLINK> @@LICENSE}
 * @module @@MODULE
 */

/*jslint maxlen:80, es6:false, this:true, bitwise:true, white:true, for:true */

/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    es3:true, esnext:true, plusplus:true, maxparams:4, maxdepth:6,
    maxstatements:false, maxcomplexity:false
*/

/*global
    window, self, global, define, module, Map, Set, Symbol
*/

/*property
    $, ArrayGenerator, CounterGenerator, DONE, ENTRIES, EnumerateGenerator,
    IdGenerator, KEYS, MAX_SAFE_INTEGER, MIN_SAFE_INTEGER, OPTS,
    RepeatGenerator, StringGenerator, ThenGenerator, UnzipGenerator, VALUES,
    abs, add, amd, apply, asArray, asMap, asObject, asSet, asString,
    assertIsFunction, assertIsObject, assign, by, call, charCodeAt, chop,
    chunkGenerator, clampToSafeIntegerRange, clear, codePointAt,
    compactGenerator, concat, configurable, curry, defineProperty,
    differenceGenerator, done, drop, dropGenerator, dropWhileGenerator,
    entries, enumerable, every, exports, filter, filterGenerator, findIndex,
    first, flattenGenerator, floor, forEach, from, fromCharCode, fromCodePoint,
    get, getIndex, getPrototypeOf, has, hasApplyBug, hasBoxedStringBug,
    hasCallBug, hasEnumArgsBug, hasOwn, hasOwnProperty, hasProperty,
    hasV8Strictbug, id, inStrictMode, includes, index, indexOf,
    initialGenerator, intersectionGenerator, is, isArray, isArrayLike, isDate,
    isFinite, isFunction, isIndex, isInteger, isLength, isNaN, isNil, isNumber,
    isObject, isObjectLike, isString, isSurrogatePair, isSymbol, isUndefined,
    iterator, join, keys, last, length, map, mapGenerator, max, min, next,
    noop, numIsFinite, numIsNaN, order, own, pow, prev, prototype, push,
    reduce, reflectArg, requireObjectCoercible, reset, rest, restGenerator,
    returnArgs, returnThis, reverse, reversed, sameValueZero, set, setValue,
    sign, size, some, splice, symIt, takeGenerator, takeWhileGenerator,
    tapGenerator, then, to, toInteger, toLength, toNumber, toObject,
    toPrimitive, toString, toStringTag, unionGenerator, uniqueGenerator,
    useShims, value, values, writable, zipGenerator
*/

/**
 * UMD (Universal Module Definition)
 *
 * @private
 * @see https://github.com/umdjs/umd/blob/master/returnExports.js
 */
(function umd(thisArg, factory) {
  'use strict';

  var root,
    $hasOwnProperty = Object.prototype.hasOwnProperty,
    $defineProperty = Object.defineProperty,
    $push = Array.prototype.push,
    $forEach = Array.prototype.forEach,
    $reduce = Array.prototype.reduce,
    $filter = Array.prototype.filter,
    $map = Array.prototype.map,
    $some = Array.prototype.some,
    $every = Array.prototype.every,
    $indexOf = Array.prototype.indexOf,
    $findIndex = Array.prototype.findIndex,
    $includes = Array.prototype.includes,
    $codePointAt = String.prototype.codePointAt,
    reduceError = 'reduce of empty array with no initial value',
    strFor = 'for',
    typeUndefined,
    typeFunction = typeof factory,
    typeObject = typeof Object.prototype,
    typeNumber = typeof 0,
    typeBoolean = typeof false,
    typeString = typeof strFor,
    typeSymbol,
    toTag = Object.prototype.toString,
    stringOrder = ['toString', 'valueOf'],
    numberOrder = stringOrder.slice().reverse(),
    descriptor = {
      enumerable: false,
      writable: true,
      configurable: true
    },
    _ = {
      useShims: false,
      MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1,
      MIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER || -(Math.pow(2, 53) - 1)
    },
    tagFunction,
    tagDate,
    tagNumber,
    tagString,
    tagArray,
    arrayIsArray,
    fixCall,
    testProp;

  /**
   * @private
   * @return {undefined}
   */
  _.noop = function noop() {
    return;
  };

  typeUndefined = typeof _.noop();

  /**
   * Returns the this context of the function.
   *
   * @private
   * @return {*}
   */
  function returnThis() {
    /*jshint validthis:true */
    return this;
  }

  _.returnThis = returnThis;

  /**
   * Indicates if running in strict mode.
   * True if we are, otherwise false.
   *
   * @private
   * @type {boolean}
   */
  _.inStrictMode = !returnThis();

  /**
   * Indicates if the this argument used with call does not convert to an
   * object when not strict mode. True if it does, otherwise false.
   *
   * @private
   * @type {boolean}
   */
  _.hasCallBug = !_.inStrictMode &&
    typeof returnThis.call(strFor) === typeString;

  /**
   * Indicates if the this argument used with apply does not convert to an
   * object when not strict mode. True if it does not, otherwise false.
   *
   * @private
   * @type {boolean}
   */
  _.hasApplyBug = !_.inStrictMode &&
    typeof returnThis.apply(strFor) === typeString;

  /**
   * Checks if the environment suffers the V8 strict mode bug.
   *
   * @private
   * @type {boolean}
   */
  if (_.inStrictMode && $forEach) {
    $forEach.call([1], function () {
      _.hasV8Strictbug = typeof this === typeObject;
    }, strFor);
  } else {
    _.hasV8Strictbug = false;
  }

  /**
   * Indicates if a string suffers the "indexed accessability bug".
   * True if it does, otherwise false.
   *
   * @private
   * @type {boolean}
   */
  _.hasBoxedStringBug = Object(strFor)[0] !== 'f' ||
    !(0 in Object(strFor));

  /**
   * Returns an arguments object of the arguments supplied.
   *
   * @private
   * @param {...*} [varArgs]
   * @return {Arguments}
   */
  _.returnArgs = function returnArgs() {
    return arguments;
  };

  /**
   * Indicates if the arguments object suffers the "index enumeration bug".
   * True if it does, otherwise false.
   *
   * @private
   * @type {boolean}
   */
  _.hasEnumArgsBug = true;
  for (testProp in _.returnArgs(strFor)) {
    if (testProp === '0') {
      _.hasEnumArgsBug = false;
      break;
    }
  }

  /**
   * Returns true if the operand subject is undefined
   *
   * @private
   * @param {*} subject The object to be tested.
   * @return {boolean} True if the object is undefined, otherwise false.
   */
  _.isUndefined = function isUndefined(subject) {
    return typeof subject === typeUndefined;
  };

  /**
   * Returns true if the operand inputArg is null.
   *
   * @private
   * @param {*} inputArg
   * @return {boolean}
   */
  _.isNull = function isNull(inputArg) {
    return inputArg === null;
  };

  /**
   * Returns true if the operand subject is null or undefined.
   *
   * @private
   * @param {*} subject The object to be tested.
   * @return {boolean} True if undefined or null, otherwise false.
   */
  _.isNil = function isNil(subject) {
    return _.isNull(subject) || _.isUndefined(subject);
  };

  /**
   * Checks if value is the language type of Object.
   * (e.g. arrays, functions, objects, regexes, new Number(0),
   * and new String('')).
   *
   * @private
   * @param {*} subject The value to check.
   * @return {boolean} Returns true if value is an object, else false.
   */
  _.isObject = function isObject(subject) {
    var type;

    if (!subject) {
      type = false;
    } else {
      type = typeof subject;
      type = type === typeObject || type === typeFunction;
    }

    return type;
  };

  if ($defineProperty && !_.useShims) {
    // IE 8 only supports 'Object.defineProperty' on DOM elements
    try {
      $defineProperty({}, {}, {});
    } catch (e) {
      /* istanbul ignore next */
      $defineProperty = !e;
    }
  }

  /* istanbul ignore next */
  if (!$defineProperty || _.useShims) {
    $defineProperty = function defineProperty(object, property, descriptor) {
      if (!_.isObject(object)) {
        throw new TypeError('called on non-object');
      }

      object[property] = descriptor.value;

      return object;
    };
  }

  _.defineProperty = $defineProperty;

  /**
   * The abstract operation throws an error if its argument is a value that
   * cannot be converted to an Object, otherwise returns the argument.
   *
   * @private
   * @param {*} subject The object to be tested.
   * @throws {TypeError} If subject is null or undefined.
   * @return {*} The subject if coercible.
   */
  _.requireObjectCoercible = function requireObjectCoercible(subject) {
    /* istanbul ignore if */
    if (_.isNil(subject)) {
      throw new TypeError('Cannot convert argument to object');
    }

    return subject;
  };

  /**
   * The abstract operation converts its argument to a value of type Object.
   *
   * @private
   * @param {*} subject The argument to be converted to an object.
   * @throws {TypeError} If subject is not coercible to an object.
   * @return {Object} Value of subject as type Object.
   * @see http://www.ecma-international.org/ecma-262/5.1/#sec-9.9
   */
  _.toObject = function toObject(subject) {
    return _.isObject(_.requireObjectCoercible(subject)) ?
      subject :
      Object(subject);
  };

  _.reflectArg = function reflectArg(subject) {
    return subject;
  };

  if (_.inStrictMode && _.hasCallBug) {
    fixCall = function fixCallApply(subject) {
      return !_.isNil(subject) ? _.toObject(subject) : subject;
    };
  } else {
    fixCall = _.reflectArg;
  }

  /**
   * Returns a boolean indicating whether the object has the specified
   * property. This function can be used to determine whether an object
   * has the specified property as a direct property of that object; this
   * method does not check down the object's prototype chain.
   *
   * @private
   * @param {Object} subject The object to test for the property.
   * @param {string} property The property to be tested.
   * @return {boolean} True if the object has the direct specified
   *                   property, otherwise false.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/
   * Reference/Global_Objects/Object/hasOwnProperty
   */
  _.hasOwn = function hasOwn(subject, property) {
    /*jshint singleGroups:false */
    return (_.hasBoxedStringBug &&
        _.isString(subject) &&
        _.isIndex(property, subject.length)) ||

      $hasOwnProperty.call(
        _.toObject(subject),
        _.isSymbol(property) ? property : _.toString(property)
      ) ||

      /*
       * Avoid a bug in IE 10-11 where objects with a [[Prototype]] of 'null',
       * that are composed entirely of index properties, return 'false' for
       * 'hasOwnProperty' checks of them.
       */
      (Object.getPrototypeOf &&
        typeof subject === typeObject &&
        _.hasProperty(subject, property) &&
        _.isNull(Object.getPrototypeOf(subject)));
  };

  /**
   * Defines a new property directly on an object, or throws an error if
   * there is an existing property on an object, and returns the object.
   * Uses a fixed descriptor definition.
   *
   * @private
   * @param {Object} object The object on which to defined the property.
   * @param {string} property The property name.
   * @param {function} value The value of the property.
   * @throws {Error} If the property already exists.
   * @return {Object}
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/
   * Reference/Global_Objects/Object/defineProperty
   */
  _.setValue = function setValue(object, property, value, noCheck) {
    /* istanbul ignore if */
    if (!noCheck && _.hasOwn(object, property)) {
      throw new Error(
        'property "' + property + '" already exists on object'
      );
    }

    descriptor.value = value;
    $defineProperty(object, property, descriptor);
    delete descriptor.value;

    return object;
  };

  _.symIt = typeof Symbol === typeFunction ? Symbol.iterator : '@@iterator';

  /**
   * Provides a string representation of the supplied object in the form
   * "[object type]", where type is the object type.
   *
   * @private
   * @param {*} subject The object for which a class string represntation
   *                    is required.
   * @return {string} A string value of the form "[object type]".
   * @see http://www.ecma-international.org/ecma-262/6.0/
   * #sec-object.prototype.tostring
   */
  _.toStringTag = function toStringTag(subject) {
    var val;

    if (_.isNull(subject)) {
      val = '[object Null]';
    } else if (_.isUndefined(subject)) {
      val = '[object Undefined]';
    } else {
      val = toTag.call(subject);
    }

    return val;
  };

  tagFunction = _.toStringTag(_.isNil);

  /**
   * Returns true if the operand subject is a Function
   *
   * @private
   * @param {*} subject The object to be tested.
   * @return {boolean} True if the object is a function, otherwise false.
   */
  _.isFunction = function isFunction(subject) {
    var tag = _.toStringTag(subject),
      result = false;

    if (_.isObject(subject)) {
      tag = _.toStringTag(subject);
      /* istanbul ignore else */
      if (tag === tagFunction) {
        result = true;
      } else if (tag === '[object GeneratorFunction]') {
        result = typeof subject === typeFunction;
      }
    }

    return result;
  };

  /**
   * Checks if value is object-like. A value is object-like if it's not null
   * and has a typeof result of "object".
   *
   * @privaye
   * @param {*} subject The value to check.
   * @return {boolean} Returns true if value is object-like, else false.
   */
  _.isObjectLike = function isObjectLike(subject) {
    return !!subject && typeof subject === typeObject;
  };

  tagDate = _.toStringTag(new Date());

  /* istanbul ignore next */
  _.isDate = function isDate(value) {
    return _.isObjectLike(value) && _.toStringTag(value) === tagDate;
  };

  /* istanbul ignore next */
  _.toPrimitive = function toPrimitive(subject, hint) {
    var methodNames,
      method,
      index,
      result;

    if (!_.isObject(subject)) {
      result = subject;
    } else {
      /*jshint singleGroups:false */
      if (hint === typeString || (hint !== typeNumber && _.isDate(subject))) {
        methodNames = stringOrder;
      } else {
        methodNames = numberOrder;
      }

      index = 0;
      while (index < 2) {
        method = methodNames[index];
        if (_.isFunction(subject[method])) {
          result = subject[method]();
          if (!_.isObject(result)) {
            return result;
          }
        }

        index += 1;
      }

      /* istanbul ignore next */
      throw new TypeError('ordinaryToPrimitive returned an object');
    }

    return result;
  };

  if (typeof Symbol === typeFunction && Symbol[strFor]) {
    typeSymbol = typeof Symbol[strFor](strFor);
  }

  _.toNumber = function toNumber(subject) {
    var type,
      val;

    /* istanbul ignore if */
    if (_.isNull(subject)) {
      val = +0;
    } else {
      type = typeof subject;
      if (type === typeNumber) {
        val = subject;
      } else if (type === typeUndefined) {
        val = NaN;
      } else {
        /* istanbul ignore next */
        if (type === typeBoolean) {
          val = subject ? 1 : +0;
        } else if (type === typeString) {
          val = Number(subject);
        } else {
          if (typeSymbol && type === typeSymbol) {
            throw new TypeError('Can not convert symbol to a number');
          }

          val = _.toNumber(_.toPrimitive(subject, typeNumber));
        }
      }
    }

    return val;
  };

  /* istanbul ignore else */
  if (Math.sign && !_.useShims) {
    _.sign = Math.sign;
  } else {
    _.sign = function sign(value) {
      return _.toNumber(value) && (_.toNumber(value >= 0) || -1);
    };
  }

  /* istanbul ignore else */
  if (Number.isNaN && !_.useShims) {
    _.numIsNaN = Number.isNaN;
  } else {
    _.numIsNaN = function numIsNaN(subject) {
      return typeof subject === typeNumber && isNaN(subject);
    };
  }

  /* istanbul ignore else */
  if (Number.isFinite && !_.useShims) {
    _.numIsFinite = Number.isFinite;
  } else {
    _.numIsFinite = function (subject) {
      return typeof subject === typeNumber && isFinite(subject);
    };
  }

  /**
   * The function evaluates the passed value and converts it to an
   * integer.
   *
   * @private
   * @param {*} subject The object to be converted to an integer.
   * @return {number} If the target value is NaN, null or undefined, 0 is
   *                  returned. If the target value is false, 0 is
   *                  returned and if true, 1 is returned.
   * @see http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger
   */
  _.toInteger = function toInteger(subject) {
    var number = _.toNumber(subject);

    if (_.numIsNaN(number)) {
      number = 0;
    } else if (number && _.numIsFinite(number)) {
      number = _.sign(number) * Math.floor(Math.abs(number));
    }

    return number;
  };

  tagNumber = _.toStringTag(0);

  /**
   * Returns true if the operand subject is a Number.
   *
   * @private
   * @param {*} subject The object to be to tested.
   * @return {boolean} True if is a number, otherwise false.
   */
  _.isNumber = function isNumber(subject) {
    var type = typeof subject;

    /*jshint singleGroups:false */
    return type === typeNumber ||
      (type === typeObject && _.toStringTag(subject) === tagNumber);
  };

  tagString = _.toStringTag(strFor);

  /**
   * Returns true if the operand subject is a String.
   *
   * @private
   * @param {*} subject
   * @return {boolean}
   */
  _.isString = function isString(subject) {
    var type = typeof subject;

    /*jshint singleGroups:false */
    return type === typeString ||
      (type === typeObject && _.toStringTag(subject) === tagString);
  };

  /**
   * Checks if value is a valid array-like length.
   *
   * @private
   * @param {*} subject The value to check.
   * @return {boolean} Returns true if value is a valid length,
   *                   else false.
   */
  _.isLength = function isLength(subject) {
    return typeof subject === typeNumber &&
      subject > -1 &&
      subject % 1 === 0 &&
      subject <= _.MAX_SAFE_INTEGER;
  };

  /**
   * Checks if value is array-like. A value is considered array-like if
   * it's  not a function and has a value.length that's an integer
   * greater than or equal to 0 and less than or equal to
   * Number.MAX_SAFE_INTEGER.
   *
   * @private
   * @param {*} subject The object to be tested.
   * @return {boolean} Returns true if subject is array-like,
   *                   else false.
   */
  _.isArrayLike = function isArrayLike(subject) {
    return !_.isNil(subject) &&
      !_.isFunction(subject) &&
      _.isLength(subject.length);
  };

  tagArray = _.toStringTag([]);

  /* istanbul ignore else */
  if (Array.isArray && !_.useShims) {
    arrayIsArray = Array.isArray;
  } else if (tagArray === '[object Array]') {
    arrayIsArray = function arrayIsArray(subject) {
      return _.isArrayLike(subject) && _.toStringTag(subject) === tagArray;
    };
  } else {
    // fallback
    arrayIsArray = function arrayIsArray(subject) {
      return _.isArrayLike(subject) &&
        !_.isString(subject) &&
        _.hasOwn(subject, 'length') &&
        !_.hasOwn(subject, 'callee');
    };
  }

  /**
   * If 'relaxed' is falsy The function tests the subject arguments and
   * returns the Boolean value true if the argument is an object whose
   * class internal property is "Array"; otherwise it returns false. if
   * 'relaxed' is true then 'isArrayLike' is used for the test.
   *
   * @private
   * @param {*} subject The argument to be tested.
   * @param {boolean} [relaxed] Use isArrayLike rather than isArray
   * @return {boolean} True if an array, or if relaxed and array-like,
   *                   otherwise false.
   * @see http://www.ecma-international.org/ecma-262/6.0/#sec-isarray
   */
  _.isArray = function isArray(subject, relaxed) {
    var isA;

    if (relaxed) {
      isA = _.isArrayLike(subject) && !_.isString(subject);
    } else {
      isA = arrayIsArray(subject);
    }

    return isA;
  };

  /**
   * Tests if the two character arguments combined are a valid UTF-16
   * surrogate pair.
   *
   * @private
   * @param {*} char1 The first character of a suspected surrogate pair.
   * @param {*} char2 The second character of a suspected surrogate pair.
   * @return {boolean} Returns true if the two characters create a valid
   *                   UTF-16 surrogate pair; otherwise false.
   */
  _.isSurrogatePair = function isSurrogatePair(char1, char2) {
    var result = false,
      code1,
      code2;

    if (_.isString(char1) && _.isString(char2)) {
      code1 = char1.charCodeAt();
      if (code1 >= 0xD800 && code1 <= 0xDBFF) {
        code2 = char2.charCodeAt();
        if (code2 >= 0xDC00 && code2 <= 0xDFFF) {
          result = true;
        }
      }
    }

    return result;
  };

  /* istanbul ignore else */
  if ($codePointAt && !_.useShims) {
    _.codePointAt = function codePointAt(string, position) {
      return $codePointAt.call(string, position);
    };
  } else {
    _.codePointAt = function codePointAt(subject, position) {
      var string = String(_.requireObjectCoercible(subject)),
        size = string.length,
        index = _.toInteger(position),
        first,
        second,
        val;

      if (index >= 0 && index < size) {
        first = string.charCodeAt(index);
        if (first >= 0xD800 && first <= 0xDBFF && size > index + 1) {
          second = string.charCodeAt(index + 1);
          if (second >= 0xDC00 && second <= 0xDFFF) {
            val = (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
          }
        }
      }

      return val || first;
    };
  }

  /**
   * Tests the subject to see if it is a function and throws an error if
   * it is not.
   *
   * @private
   * @param {*} subject The argument to test for validity.
   * @throws {TypeError} If subject is not a function
   * @return {*} Returns the subject if passes.
   */
  _.assertIsFunction = function assertIsFunction(subject) {
    if (!_.isFunction(subject)) {
      throw new TypeError('argument must be a function');
    }

    return subject;
  };

  /**
   * The abstract operation ToLength converts its argument to an integer
   * suitable for use as the length of an array-like object.
   *
   * @private
   * @param {*} subject The object to be converted to a length.
   * @return {number} If len <= +0 then +0 else if len is +INFINITY then
   *                  2^53-1 else min(len, 2^53-1).
   * @see http://www.ecma-international.org/ecma-262/6.0/#sec-tolength
   */
  _.toLength = function toLength(subject) {
    var length = _.toInteger(subject);

    /* istanbul ignore else */
    if (length <= 0) {
      length = 0;
    } else if (length > _.MAX_SAFE_INTEGER) {
      length = _.MAX_SAFE_INTEGER;
    }

    return length;
  };

  /**
   * Checks if 'value' is a valid array-like index.
   *
   * @private
   * @param {*} inputArg The value to check.
   * @param {number} [length] The upper bounds of a valid index otherwise
   *                          MAX_SAFE_INTEGER - 1.
   * @return {boolean} Returns true if inputArg is a valid index, otherwise
   *                   false.
   */
  _.isIndex = function isIndex(inputArg, length) {
    var size,
      arg;

    if (arguments.length > 1) {
      size = _.toLength(length);
    } else {
      size = _.MAX_SAFE_INTEGER - 1;
    }

    arg = _.toNumber(inputArg);

    return _.isLength(arg) && arg < size;
  };

  /**
   * This method adds one or more elements to the end of the array and
   * returns the new length of the array.
   *
   * @param {array} array
   * @param {...*} [varArgs]
   * @return {number}
   */
  testProp = [];
  if (!_.useShims || $push.call(testProp, _.noop()) !== 1 ||
    testProp.length !== 1 || testProp[0] !== _.noop()) {
    _.push = function push(array) {
      return $push.apply(array, _.chop(arguments, 1));
    };
  } else {
    _.push = function push(array) {
      var object = _.toObject(array),
        length = _.toLength(object.length),
        numItems = arguments.length - 1,
        index = 0;

      object.length = length + numItems;
      while (index < numItems) {
        object[length + index] = arguments[index + 1];
        index += 1;
      }

      return object.length;
    };
  }
  /**
   * The abstract operation converts its argument to a value of type string
   *
   * @private
   * @param {*} inputArg
   * @return {string}
   * @see http://www.ecma-international.org/ecma-262/6.0/#sec-tostring
   */
  _.toString = function toStrIng(inputArg) {
    var type,
      val;

    if (_.isNull(inputArg)) {
      val = 'null';
    } else {
      type = typeof inputArg;
      if (type === typeString) {
        val = inputArg;
      } else if (type === typeUndefined) {
        val = type;
      } else {
        if (typeSymbol && type === typeSymbol) {
          throw new TypeError('Cannot convert symbol to string');
        }

        val = String(inputArg);
      }
    }

    return val;
  };

  _.isSymbol = function isSymbol(subject) {
    return typeSymbol && typeof subject === typeSymbol;
  };

  /**
   * @private
   * @param {*} inputArg The object to be tested.
   * @param {string} property The property name.
   * @return {boolean} True if the property is on the object or in the object's
   *                   prototype, otherwise false.
   */
  _.hasProperty = function hasProperty(inputArg, property) {
    var prop = _.isSymbol(property) ? property : _.toString(property);

    /*jshint singleGroups:false */
    return (_.isString(inputArg) && _.isIndex(prop, inputArg.length)) ||
      prop in _.toObject(inputArg);
  };

  _.chop = function chop(array, start, end) {
    var object = _.toObject(array),
      length = _.toLength(object.length),
      relativeStart = _.toInteger(start),
      val = [],
      next = 0,
      relativeEnd,
      finalEnd,
      k;

    /* istanbul ignore if */
    if (relativeStart < 0) {
      k = Math.max(length + relativeStart, 0);
    } else {
      k = Math.min(relativeStart, length);
    }

    /* istanbul ignore else */
    if (_.isUndefined(end)) {
      relativeEnd = length;
    } else {
      relativeEnd = _.toInteger(end);
    }

    /* istanbul ignore if */
    if (relativeEnd < 0) {
      finalEnd = Math.max(length + relativeEnd, 0);
    } else {
      finalEnd = Math.min(relativeEnd, length);
    }

    finalEnd = _.toLength(finalEnd);
    val.length = _.toLength(Math.max(finalEnd - k, 0));
    while (k < finalEnd) {
      if (_.hasProperty(object, k)) {
        val[next] = object[k];
      }

      next += 1;
      k += 1;
    }

    return val;
  };

  /**
   * Apply a function against an accumulator and each value of the array
   * (from left-to-right) as to reduce it to a single value.
   *
   * @private
   * @param {array} arrayLike
   * @throws {TypeError} If array is null or undefined
   * @param {Function} callback
   * @throws {TypeError} If callback is not a function
   * @param {*} [initialValue]
   * @return {*}
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
   * Global_Objects/Array/reduce
   */
  /* istanbul ignore else */
  if ($reduce && !_.hasV8Strictbug && !_.useShims) {
    _.reduce = function reduce(array) {
      return $reduce.apply(array, _.chop(arguments, 1));
    };
  } else {
    _.reduce = function reduce(array, callback, initialValue) {
      var object = _.toObject(array),
        acc,
        length,
        kPresent,
        index;

      _.assertIsFunction(callback);
      length = _.toLength(object.length);
      if (!length && arguments.length === 2) {
        throw new TypeError(reduceError);
      }

      index = 0;
      if (arguments.length > 2) {
        acc = initialValue;
      } else {
        kPresent = false;
        while (!kPresent && index < length) {
          kPresent = _.hasProperty(object, index);
          if (kPresent) {
            acc = object[index];
            index += 1;
          }
        }

        if (!kPresent) {
          throw new TypeError(reduceError);
        }
      }

      while (index < length) {
        if (_.hasProperty(object, index)) {
          acc = callback.call(
            fixCall(_.noop()),
            acc,
            object[index],
            index,
            object
          );
        }

        index += 1;
      }

      return acc;
    };
  }

  /**
   * The isInteger method determines whether the passed value is an integer.
   * If the target value is an integer, return true, otherwise return false.
   * If the value is NaN or infinite, return false.
   *
   * @private
   * @param {*} subject
   * @return {boolean}
   */
  _.isInteger = function isInteger(subject) {
    /* istanbul ignore next */
    return _.numIsFinite(subject) && _.toInteger(subject) === subject;
  };

  /* istanbul ignore else */
  if (String.fromCodePoint && !_.useShims) {
    _.fromCodePoint = String.fromCodePoint;
  } else {
    _.fromCodePoint = function fromCodePoint() {
      var MAX_SIZE = 0x4000,
        codeUnits = [];

      return _.reduce(arguments, function (result, arg) {
        var codePnt = _.toNumber(arg),
          highSurrogate,
          lowSurrogate;

        if (!_.isInteger(codePnt) || codePnt < 0 || codePnt > 0x10FFFF) {
          throw new RangeError('Invalid codePnt point: ' + codePnt);
        }

        if (codePnt <= 0xFFFF) {
          _.push(codeUnits, codePnt);
        } else {
          codePnt -= 0x10000;
          /*jshint singleGroups:false */
          /*jshint bitwise:false */
          highSurrogate = (codePnt >> 10) + 0xD800;
          /*jshint bitwise:true */
          lowSurrogate = (codePnt % 0x400) + 0xDC00;
          /*jshint singleGroups:true */
          _.push(codeUnits, highSurrogate, lowSurrogate);
        }

        if (codeUnits.length > MAX_SIZE) {
          result += String.fromCharCode.apply(null, codeUnits);
          codeUnits.length = 0;
        }

        return result;
      }, '') + String.fromCharCode.apply(null, codeUnits);
    };
  }

  _.assertIsObject = function assertIsObject(subject) {
    /* istanbul ignore if */
    if (!_.isObject(subject)) {
      throw new TypeError('argument must be a object');
    }

    return subject;
  };

  /**
   * Converts the subject into a safe number within the max and min safe
   * integer range.
   *
   * @private
   * @param {*} subject The argument to be converted.
   * @return {number} Returns a safe number in range.
   */
  _.clampToSafeIntegerRange = function clampToSafeIntegerRange(subject) {
    var number = +subject;

    if (_.numIsNaN(number)) {
      number = 0;
    } else if (number < _.MIN_SAFE_INTEGER) {
      number = _.MIN_SAFE_INTEGER;
    } else if (number > _.MAX_SAFE_INTEGER) {
      number = _.MAX_SAFE_INTEGER;
    }

    return number;
  };

  if ($map && !_.hasV8Strictbug && !_.useShims) {
    _.map = function map(array) {
      return $map.apply(array, _.chop(arguments, 1));
    };
  } else {
    _.map = function map(array, callback, thisArg) {
      var object = _.toObject(array),
        length,
        arr,
        index;

      _.assertIsFunction(callback);
      arr = [];
      arr.length = length = _.toLength(object.length);
      index = 0;
      while (index < length) {
        if (_.hasProperty(object, index)) {
          arr[index] = callback.call(
            fixCall(thisArg),
            object[index],
            index,
            object
          );
        }

        index += 1;
      }

      return arr;
    };
  }

  if ($filter && !_.hasV8Strictbug && !_.useShims) {
    _.filter = function filter(array) {
      return $filter.apply(array, _.chop(arguments, 1));
    };
  } else {
    _.filter = function filter(array, callback, thisArg) {
      var object = _.toObject(array),
        length,
        arr,
        index,
        it;

      _.assertIsFunction(callback);
      length = _.toLength(object.length);
      arr = [];
      index = 0;
      while (index < length) {
        if (_.hasProperty(object, index)) {
          it = object[index];
          if (callback.call(fixCall(thisArg), it, index, object)) {
            _.push(arr, it);
          }
        }

        index += 1;
      }

      return arr;
    };
  }

  _.curry = function curry(fn) {
    var args;

    _.assertIsFunction(fn);
    args = _.chop(arguments, 1);

    return function () {
      return fn.apply(this, args.concat(_.chop(arguments)));
    };
  };

  /**
   * Executes a provided function once per array element.
   *
   * @private
   * @param {array} arrayLike
   * @param {function} callback
   * @throws {TypeError} If callback is not a function
   * @param {*} [thisArg]
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
   * Global_Objects/Array/forEach
   */
  /* istanbul ignore else */
  if ($forEach && !_.hasV8Strictbug && !_.useShims) {
    _.forEach = function forEach(array) {
      return $forEach.apply(array, _.chop(arguments, 1));
    };
  } else {
    _.forEach = function forEach(array, callback, thisArg) {
      var object = _.toObject(array),
        length,
        index;

      _.assertIsFunction(callback);
      length = _.toLength(object.length);
      index = 0;
      while (index < length) {
        if (_.hasProperty(object, index)) {
          callback.call(fixCall(thisArg), object[index], index, object);
        }

        index += 1;
      }
    };
  }

  /* istanbul ignore else */
  if ($some && !_.hasV8Strictbug && !_.useShims) {
    _.some = function some(array) {
      return $some.apply(array, _.chop(arguments, 1));
    };
  } else {
    _.some = function some(array, callback, thisArg) {
      var object = _.toObject(array),
        val,
        length,
        index;

      _.assertIsFunction(callback);
      length = _.toLength(object.length);
      val = false;
      index = 0;
      while (index < length) {
        if (_.hasProperty(object, index)) {
          val = !!callback.call(
            fixCall(thisArg),
            object[index],
            index, object
          );

          if (val) {
            break;
          }
        }

        index += 1;
      }

      return val;
    };
  }

  /* istanbul ignore else */
  if ($every && !_.hasV8Strictbug && !_.useShims) {
    _.every = function every(array) {
      return $every.apply(array, _.chop(arguments, 1));
    };
  } else {
    _.every = function every(array, callback, thisArg) {
      var object = _.toObject(array),
        length,
        val,
        index;

      _.assertIsFunction(callback);
      length = _.toLength(object.length);
      val = true;
      index = 0;
      while (index < length) {
        if (_.hasProperty(object, index)) {
          val = !!callback.call(
            fixCall(thisArg),
            object[index],
            index,
            object
          );

          if (!val) {
            break;
          }
        }

        index += 1;
      }

      return val;
    };
  }

  /* istanbul ignore else */
  if (Object.keys && !_.useShims) {
    _.keys = function keys(subject) {
      return Object.keys(_.toObject(subject));
    };
  } else {
    _.keys = function keys(subject) {
      var object = _.toObject(subject),
        ownKeys = [],
        key;

      for (key in object) {
        if (_.hasOwn(object, key)) {
          _.push(ownKeys, key);
        }
      }

      return ownKeys;
    };
  }

  /**
   * The assign function is used to copy the values of all of the
   * enumerable own properties from a source object to a target object.
   *
   * @private
   * @param {Object} target
   * @param {...Object} source
   * @return {Object}
   */
  /* istanbul ignore else */
  if (Object.assign && !_.useShims) {
    _.assign = Object.assign;
  } else {
    _.assign = function assign(target) {
      var to = _.toObject(target),
        length = _.toLength(arguments.length),
        from,
        index,
        keysArray,
        len,
        nextIndex,
        nextKey,
        arg;

      if (length >= 2) {
        index = 1;
        while (index < length) {
          arg = arguments[index];
          if (!_.isNil(arg)) {
            from = _.toObject(arg);
            keysArray = _.keys(from);
            len = keysArray.length;
            nextIndex = 0;
            while (nextIndex < len) {
              nextKey = keysArray[nextIndex];
              if (_.hasProperty(from, nextKey)) {
                to[nextKey] = from[nextKey];
              }

              nextIndex += 1;
            }
          }

          index += 1;
        }
      }

      return to;
    };
  }

  if (Array.from && !_.useShims) {
    try {
      if (Array.from(_.returnArgs(1))[0] === 1) {
        throw new Error('failed arguments check');
      }
      _.from = Array.from;
    } catch (e) {
      _.from = !e;
    }

  }

  if (!_.from) {
    _.from = function from(items, mapfn, thisArg) {
      var usingIterator = items && items[_.symIt],
        iterator,
        object,
        length,
        array,
        mapping,
        index,
        next;

      if (!_.isUndefined(mapfn)) {
        mapping = !!_.assertIsFunction(mapfn);
      }

      index = 0;
      if (usingIterator) {
        if (_.isFunction(this)) {
          array = new this();
        } else {
          array = [];
        }

        iterator = usingIterator();
        next = iterator.next();
        while (!next.done) {
          if (mapping) {
            array[index] = mapfn.call(fixCall(thisArg), next.value, index);
          } else {
            array[index] = next.value;
          }

          next = iterator.next();
          index += 1;
        }

        array.length = index;
      } else {
        object = _.toObject(items);
        length = _.toLength(object.length);
        if (_.isFunction(this)) {
          array = new this(length);
        } else {
          array = [];
        }

        array.length = length;
        while (index < length) {
          if (mapping) {
            array[index] = mapfn.call(fixCall(thisArg), object[index], index);
          } else {
            array[index] = object[index];
          }

          index += 1;
        }
      }

      return array;
    };
  }

  /* istanbul ignore else */
  if ($indexOf && !_.useShims) {
    _.indexOf = function indexOf(array) {
      return $indexOf.apply(array, _.chop(arguments, 1));
    };
  } else {
    _.indexOf = function indexOf(array, searchElement, fromIndex) {
      var object = _.toObject(array),
        length = _.toLength(object.length),
        val = -1,
        index;

      if (length) {
        if (arguments.length > 1) {
          fromIndex = _.toInteger(fromIndex);
        } else {
          fromIndex = 0;
        }

        if (fromIndex < length) {
          if (fromIndex < 0) {
            fromIndex = length - Math.abs(fromIndex);
            if (fromIndex < 0) {
              fromIndex = 0;
            }
          }

          index = fromIndex;
          while (index < length) {
            if (_.hasProperty(object, index) &&
              searchElement === object[index]) {
              val = index;
              break;
            }

            index += 1;
          }
        }
      }

      return val;
    };
  }

  _.is = function is(x, y) {
    /*jshint singleGroups:false */
    return (x === y && (x !== 0 || 1 / x === 1 / y)) ||
      (_.numIsNaN(x) && _.numIsNaN(y));
  };

  _.IdGenerator = function IdGenerator() {
    /* istanbul ignore if */
    if (!(this instanceof IdGenerator)) {
      return new IdGenerator();
    }

    _.setValue(this, 'id', [0]);
  };

  _.setValue(_.IdGenerator.prototype, 'next', function () {
    var result = [],
      length = this.id.length,
      howMany = Math.max(length, 1),
      carry = 0,
      index = 0,
      zi;

    while (index < howMany || carry) {
      zi = carry + (index < length ? this.id[index] : 0) + !index;
      _.push(result, zi % 10);
      carry = Math.floor(zi / 10);
      index += 1;
    }

    this.id = result;

    return this;
  });

  _.setValue(_.IdGenerator.prototype, 'get', function () {
    return this.id.join('');
  });

  _.setValue(_.IdGenerator.prototype, 'reset', function () {
    this.id.length = 0;
    _.push(this.id, 0);

    return this;
  });

  // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero
  _.sameValueZero = function sameValueZero(x, y) {
    /*jshint singleGroups:false */
    return (x === y) || (_.numIsNaN(x) && _.numIsNaN(y));
  };

  if ($findIndex && !_.useShims) {
    _.findIndex = function findIndex(array) {
      return $findIndex.apply(array, _.chop(arguments, 1));
    };
  } else {
    _.findIndex = function findIndex(array, callback, thisArg) {
      var object = _.toObject(array),
        val,
        length,
        index;

      _.assertIsFunction(callback);
      length = _.toLength(object.length);
      val = -1;
      index = 0;
      while (index < length) {
        if (callback.call(fixCall(thisArg), object[index], index, object)) {
          val = index;
          break;
        }

        index += 1;
      }

      return val;
    };
  }

  function isSameValueZero(element) {
    /*jshint validthis:true */
    return _.sameValueZero(this, element);
  }

  _.getIndex = function getIndex(array, item) {
    var searchIndex;

    if (item === 0 || _.numIsNaN(item)) {
      searchIndex = _.findIndex(array, isSameValueZero, item);
    } else {
      searchIndex = _.indexOf(array, item);
    }

    return searchIndex;
  };

  if ($includes && !_.useShims) {
    _.includes = function includes(array) {
      return $includes.apply(array, _.chop(arguments, 1));
    };
  } else {
    _.includes = function includes(array, searchElement, fromIndex) {
      var object = _.toObject(array),
        length = _.toLength(object.length),
        result = false,
        index,
        n;

      if (length) {
        n = _.toLength(fromIndex);
        if (n >= 0) {
          index = n;
        } else {
          index = length + n;
          if (index < 0) {
            index = 0;
          }
        }

        while (index < length) {
          if (_.sameValueZero(searchElement, object[index])) {
            result = true;
            break;
          }

          index += 1;
        }
      }

      return result;
    };
  }

  /* istanbul ignore if */
  if (typeof define === typeFunction && define.amd) {
    /*
     * AMD. Register as an anonymous module.
     */
    define([], function () {
      return factory(_, fixCall);
    });
  } else {
    /* istanbul ignore else */
    if (typeof module === typeObject && module.exports) {
      /*
       * Node. Does not work with strict CommonJS, but
       * only CommonJS-like environments that support module.exports,
       * like Node.
       */
      module.exports = factory(_, fixCall);
    } else {
      /*jshint singleGroups:false */
      root = (
          (typeof window === 'function' || typeof window === 'object') && window
        ) ||
        (typeof self === 'object' && self) ||
        (typeof global === 'object' && global) ||
        (typeof thisArg === 'object' && thisArg) || {};

      _.setValue(root, '@@MODULE', factory(_, fixCall));
    }
  }
}(

  this,

  /**
   * Factory function
   *
   * @private
   * @param {object} _
   * @param {function} fixCall
   * @return {function} The function be exported
   */
  function factory(_, fixCall) {
    'use strict';

    /* constants */
    var $reiterate,

      strDelete = 'delete',

      /**
       * The private namespace for common values.
       * @private
       * @namespace
       */
      $ = {

        DONE: {
          done: true,
          value: _.noop()
        },

        /**
         * The private namespace for common options.
         * @private
         * @namespace
         */
        OPTS: {

          /**
           * The private namespace for entries defaults.
           * @private
           * @namespace
           */
          ENTRIES: {
            entries: true,
            values: false,
            keys: false
          },

          /**
           * The private namespace for values defaults.
           * @private
           * @namespace
           */
          VALUES: {
            entries: false,
            values: true,
            keys: false
          },

          /**
           * The private namespace for keys defaults.
           * @private
           * @namespace
           */
          KEYS: {
            entries: false,
            values: false,
            keys: true
          }
        }

      },

      /**
       * Checks if an object already exists in a stack (Set), if it does then
       * throw an error because it means there is a circular reference.
       *
       * @private
       * @param {Set} stack A set of parent objects to check values against.
       * @throws {TypeError} If the a circular reference is found.
       * @return {boolean} Returns
       */
      throwIfCircular = function (stack, value) {
        if (stack.has(value)) {
          throw new TypeError('circular object');
        }

        return false;
      },

      /**
       * Set the reverse function is the option to reverse is set.
       *
       * @private
       * @param {Object} opts The options object.
       * @param {Object} generator The generator object to set the reverse
       *                           function on.
       * @return {boolean} Returns the generator object.
       */
      setReverseIfOpt = function (opts, generator) {
        if (opts.reversed) {
          generator.reverse();
        }

        return generator;
      },

      initMapSet = (function () {
        function getMapSetIterator(iterable) {
          var iterator;

          if (!_.isNil(iterable)) {
            if (_.isArrayLike(iterable)) {
              iterator = $reiterate(iterable, true);
            } else if (iterable[_.symIt]) {
              iterator = iterable;
            }

            iterator = iterator[_.symIt]();
          }

          return iterator;
        }

        return function (kind, context, iterable) {
          var iterator = getMapSetIterator(iterable),
            indexof,
            next,
            key;

          if (kind === 'map') {
            _.setValue(context, '[[value]]', []);
          }

          _.setValue(context, '[[key]]', []);
          _.setValue(context, '[[order]]', []);
          _.setValue(context, '[[id]]', new _.IdGenerator());
          _.setValue(context, '[[changed]]', false);
          if (iterator) {
            next = iterator.next();
            while (!next.done) {
              key = kind === 'map' ? next.value[0] : next.value;
              indexof = _.getIndex(context['[[key]]'], key);
              if (indexof < 0) {
                if (kind === 'map') {
                  _.push(context['[[value]]'], next.value[1]);
                }

                _.push(context['[[key]]'], key);
                _.push(context['[[order]]'], context['[[id]]'].get());
                context['[[id]]'].next();
              } else if (kind === 'map') {
                context['[[value]]'][indexof] = next.value[1];
              }

              next = iterator.next();
            }
          }

          _.setValue(context, 'size', context['[[key]]'].length);
        };
      }()),

      forEachMapSet = (function () {
        function changedMapSet(id, count) {
          /*jshint validthis:true */
          this.index = count;

          return id > this.order;
        }

        return function (kind, context, callback, thisArg) {
          var pointers,
            length,
            value,
            key;

          _.assertIsObject(context);
          _.assertIsFunction(callback);
          pointers = {
            index: 0,
            order: context['[[order]]'][0]
          };

          context['[[change]]'] = false;
          length = context['[[key]]'].length;
          while (pointers.index < length) {
            if (_.hasOwn(context['[[key]]'], pointers.index)) {
              key = context['[[key]]'][pointers.index];
              value = kind === 'map' ?
                context['[[value]]'][pointers.index] :
                key;

              callback.call(fixCall(thisArg), value, key, context);
            }

            if (context['[[change]]']) {
              length = context['[[key]]'].length;
              _.some(context['[[order]]'], changedMapSet, pointers);
              context['[[change]]'] = false;
            } else {
              pointers.index += 1;
            }

            pointers.order = context['[[order]]'][pointers.index];
          }

          return context;
        };
      }()),

      hasMapSet = function (key) {
        return _.includes(_.assertIsObject(this)['[[key]]'], key);
      },

      clearMapSet = function (kind, context) {
        _.assertIsObject(context);
        context['[[id]]'].reset();
        context['[[change]]'] = true;
        context['[[key]]'].length =
          context['[[order]]'].length =
          context.size = 0;

        if (kind === 'map') {
          context['[[value]]'].length = 0;
        }

        return context;
      },

      deleteMapSet = function (kind, context, key) {
        var indexof = _.getIndex(_.assertIsObject(context)['[[key]]'], key),
          result = false;

        if (indexof > -1) {
          if (kind === 'map') {
            context['[[value]]'].splice(indexof, 1);
          }

          context['[[key]]'].splice(indexof, 1);
          context['[[order]]'].splice(indexof, 1);
          context['[[change]]'] = true;
          context.size = context['[[key]]'].length;
          result = true;
        }

        return result;
      },

      setMapSet = function (kind, context, key, value) {
        var index = _.getIndex(_.assertIsObject(context)['[[key]]'], key);

        if (kind === 'map' && index > -1) {
          context['[[value]]'][index] = value;
        } else {
          if (kind === 'map') {
            _.push(context['[[value]]'], value);
          }

          _.push(context['[[key]]'], key);
          _.push(context['[[order]]'], context['[[id]]'].get());
          context['[[id]]'].next();
          context['[[change]]'] = true;
          context.size = context['[[key]]'].length;
        }

        return context;
      },

      SetObject = (function (typeFunction) {
        var S = typeof Set === typeFunction && !_.useShims && Set,
          createSetIterator,
          SetIterator,
          typeIdenifier,
          fn,
          s;

        /* istanbul ignore if */
        if (S) {
          try {
            s = new S([0, -0]);
            if (typeof s.has !== typeFunction ||
              typeof s.add !== typeFunction ||
              typeof s.keys !== typeFunction ||
              typeof s.values !== typeFunction ||
              typeof s.entries !== typeFunction ||
              typeof s.forEach !== typeFunction ||
              typeof s.clear !== typeFunction ||
              typeof s[strDelete] !== typeFunction ||
              typeof s[_.symIt] !== typeFunction) {
              throw new Error('Missing methods');
            }

            s.add(_.noop);
            s.add(_.noop);
            s.add(_.noop);
            s.add(s);
            s.add(NaN);
            s.add(NaN);
            s.add(strDelete);
            s.add(-0);
            s.add(0);
            if (s.size !== 7) {
              throw new Error('Incorrect size');
            }
          } catch (e) {
            S = !e;
          }
        }

        /* istanbul ignore else */
        if (S) {
          fn = S;
        } else {
          typeIdenifier = 'set';

          SetIterator = function (context, iteratorKind) {
            _.setValue(this, '[[Set]]', _.assertIsObject(context));
            _.setValue(this, '[[SetNextIndex]]', 0);
            _.setValue(this, '[[SetIterationKind]]', iteratorKind || 'value');
            _.setValue(this, '[[IteratorHasMore]]', true);
          };

          _.setValue(SetIterator.prototype, 'next', function () {
            var context = _.assertIsObject(this['[[Set]]']),
              index = this['[[SetNextIndex]]'],
              iteratorKind = this['[[SetIterationKind]]'],
              more = this['[[IteratorHasMore]]'],
              object;

            if (index < context['[[key]]'].length && more) {
              object = {
                done: false
              };

              if (iteratorKind === 'key+value') {
                object.value = [
                  context['[[key]]'][index],
                  context['[[key]]'][index]
                ];
              } else {
                object.value = context['[[key]]'][index];
              }

              this['[[SetNextIndex]]'] += 1;
            } else {
              this['[[IteratorHasMore]]'] = false;
              object = _.assign({}, $.DONE);
            }

            return object;
          });

          _.setValue(SetIterator.prototype, _.symIt, _.returnThis);

          createSetIterator = function () {
            return new SetIterator(this);
          };

          fn = function Set(iterable) {
            initMapSet(typeIdenifier, this, iterable);
          };

          _.setValue(fn.prototype, 'has', hasMapSet);

          _.setValue(fn.prototype, 'add', function (key) {
            return setMapSet(typeIdenifier, this, key);
          });

          _.setValue(fn.prototype, 'clear', function () {
            return clearMapSet(typeIdenifier, this);
          });

          _.setValue(fn.prototype, strDelete, function (key) {
            return deleteMapSet(typeIdenifier, this, key);
          });

          _.setValue(fn.prototype, 'forEach', function (callback, thisArg) {
            return forEachMapSet(typeIdenifier, this, callback, thisArg);
          });

          _.setValue(fn.prototype, 'values', createSetIterator);

          _.setValue(fn.prototype, 'keys', createSetIterator);

          _.setValue(fn.prototype, 'entries', function () {
            return new SetIterator(this, 'key+value');
          });

          _.setValue(fn.prototype, _.symIt, function () {
            return this.values();
          });
        }

        return fn;
      }(typeof _.isObject)),

      MapObject = (function (typeFunction) {
        var M = typeof Map === typeFunction && !_.useShims && Map,
          MapIterator,
          typeIdenifier,
          fn,
          m;

        /* istanbul ignore if */
        if (M) {
          try {
            m = new M([
              [1, 1],
              [2, 2]
            ]);

            if (typeof m.has !== typeFunction ||
              typeof m.set !== typeFunction ||
              typeof m.keys !== typeFunction ||
              typeof m.values !== typeFunction ||
              typeof m.entries !== typeFunction ||
              typeof m.forEach !== typeFunction ||
              typeof m.clear !== typeFunction ||
              typeof m[strDelete] !== typeFunction ||
              typeof m[_.symIt] !== typeFunction) {
              throw new Error('Missing methods');
            }

            m.set(_.noop, _);
            m.set(_.noop, _.noop);
            m.set(_.noop, m);
            m.set(m, _.noop);
            m.set(NaN, _);
            m.set(NaN, _.noop);
            m.set(strDelete, _.noop());
            m.set(-0, _.noop);
            m.set(0, _);
            if (m.get(0) !== _ || m.get(-0) !== _ || m.size !== 7) {
              throw new Error('Incorrect result');
            }
          } catch (e) {
            M = !e;
          }
        }

        /* istanbul ignore else */
        if (M) {
          fn = M;
        } else {
          typeIdenifier = 'map';

          MapIterator = function (context, iteratorKind) {
            _.setValue(this, '[[Map]]', _.assertIsObject(context));
            _.setValue(this, '[[MapNextIndex]]', 0);
            _.setValue(this, '[[MapIterationKind]]', iteratorKind);
            _.setValue(this, '[[IteratorHasMore]]', true);
          };

          _.setValue(MapIterator.prototype, 'next', function () {
            var context = _.assertIsObject(this['[[Map]]']),
              index = this['[[MapNextIndex]]'],
              iteratorKind = this['[[MapIterationKind]]'],
              more = this['[[IteratorHasMore]]'],
              object;

            _.assertIsObject(context);
            if (index < context['[[key]]'].length && more) {
              object = {
                done: false
              };

              if (iteratorKind === 'key+value') {
                object.value = [
                  context['[[key]]'][index],
                  context['[[value]]'][index]
                ];
              } else {
                object.value = context['[[' + iteratorKind + ']]'][index];
              }

              this['[[MapNextIndex]]'] += 1;
            } else {
              this['[[IteratorHasMore]]'] = false;
              object = _.assign({}, $.DONE);
            }

            return object;
          });

          _.setValue(MapIterator.prototype, _.symIt, _.returnThis);

          fn = function Map(iterable) {
            initMapSet(typeIdenifier, this, iterable);
          };

          _.setValue(fn.prototype, 'has', hasMapSet);

          _.setValue(fn.prototype, 'set', function (key, value) {
            return setMapSet(typeIdenifier, this, key, value);
          });

          _.setValue(fn.prototype, 'clear', function () {
            return clearMapSet(typeIdenifier, this);
          });

          _.setValue(fn.prototype, 'get', function (key) {
            var index = _.getIndex(_.assertIsObject(this)['[[key]]'], key);

            return index > -1 ? this['[[value]]'][index] : _.noop();
          });

          _.setValue(fn.prototype, strDelete, function (key) {
            return deleteMapSet(typeIdenifier, this, key);
          });

          _.setValue(fn.prototype, 'forEach', function (callback, thisArg) {
            return forEachMapSet(typeIdenifier, this, callback, thisArg);
          });

          _.setValue(fn.prototype, 'values', function () {
            return new MapIterator(this, 'value');
          });

          _.setValue(fn.prototype, 'keys', function () {
            return new MapIterator(this, 'key');
          });

          _.setValue(fn.prototype, 'entries', function () {
            return new MapIterator(this, 'key+value');
          });

          _.setValue(fn.prototype, _.symIt, function () {
            return this.entries();
          });
        }

        return fn;
      }(typeof _.isObject)),

      /**
       * A function to return the entries, values or keys depending on the
       * generator options.
       *
       * @private
       * @param {object} opts The generator options object.
       * @param {object} object The object being iterated/enumerated.
       * @param {object} object The key to get the value from the object.
       */
      getYieldValue = function (opts, object, key) {
        var result;

        if (opts.keys) {
          result = key;
        } else if (opts.values) {
          result = object[key];
        } else {
          result = [key, object[key]];
        }

        return result;
      },

      addMethods = function (object) {
        _.setValue(object, 'first', p.first);
        _.setValue(object, 'last', p.last);
        _.setValue(object, 'enumerate', g.EnumerateGenerator);
        _.setValue(object, 'unique', p.uniqueGenerator);
        _.setValue(object, 'flatten', p.flattenGenerator);
        _.setValue(object, 'compact', p.compactGenerator);
        _.setValue(object, 'initial', p.initialGenerator);
        _.setValue(object, 'rest', p.restGenerator);
        _.setValue(object, 'drop', p.dropGenerator);
        _.setValue(object, 'dropWhile', p.dropWhileGenerator);
        _.setValue(object, 'take', p.takeGenerator);
        _.setValue(object, 'takeWhile', p.takeWhileGenerator);
        _.setValue(object, 'every', p.every);
        _.setValue(object, 'some', p.some);
        _.setValue(object, 'filter', p.filterGenerator);
        _.setValue(object, 'asArray', p.asArray);
        //_.setValue(object, 'asString', p.asString);
        _.setValue(object, 'asString', p.asString);
        _.setValue(object, 'asObject', p.asObject);
        _.setValue(object, 'asMap', p.asMap);
        _.setValue(object, 'map', p.mapGenerator);
        _.setValue(object, 'reduce', p.reduce);
        _.setValue(object, 'difference', p.differenceGenerator);
        _.setValue(object, 'join', p.join);
        _.setValue(object, 'union', p.unionGenerator);
        _.setValue(object, 'intersection', p.intersectionGenerator);
        _.setValue(object, 'asSet', p.asSet);
        _.setValue(object, 'chunk', p.chunkGenerator);
        _.setValue(object, 'tap', p.tapGenerator);
        _.setValue(object, 'then', p.then);
        _.setValue(object, 'zip', p.zipGenerator);
      },

      populatePrototypes = function () {
        addMethods(g.CounterGenerator.prototype);
        addMethods(g.ArrayGenerator.prototype);
        addMethods(g.StringGenerator.prototype);
        addMethods(g.EnumerateGenerator.prototype);
        addMethods(g.RepeatGenerator.prototype);
        addMethods(g.UnzipGenerator.prototype);
        addMethods(g.ThenGenerator.prototype);
      },

      setIndexesOpts = function (start, end, opts) {
        opts.from = _.toInteger(start);
        if (opts.from < 0) {
          opts.from = Math.max(opts.length + opts.from, 0);
        } else {
          opts.from = Math.min(opts.from, opts.length);
        }

        if (_.isUndefined(end)) {
          opts.to = opts.length;
        } else {
          opts.to = _.toInteger(end);
        }

        if (opts.to < 0) {
          opts.to = Math.max(opts.length + opts.to, 0);
        } else {
          opts.to = Math.min(opts.to, opts.length);
        }

        opts.to = _.toLength(opts.to) - 1;
      },

      /**
       * The private namespace for common prototype functions.
       * @private
       * @namespace
       */
      p = {

        reduce: function (callback, initialValue) {
          var iterator,
            supplied,
            assigned,
            index,
            next;

          _.assertIsFunction(callback);
          if (arguments.length > 1) {
            supplied = true;
          }

          iterator = this[_.symIt]();
          next = iterator.next();
          if (!next.done) {
            index = 0;
            while (!next.done) {
              if (!supplied && !assigned) {
                initialValue = next.value;
                assigned = true;
              } else {
                initialValue = callback(initialValue, next.value, index);
              }

              next = iterator.next();
              index += 1;
            }
          }

          return initialValue;
        },

        tapGenerator: function (callback, thisArg) {
          var generator;

          _.assertIsFunction(callback);
          generator = this[_.symIt];
          this[_.symIt] = function () {
            var index = 0,
              itertor,
              next;

            return {
              next: function () {
                var object;

                itertor = itertor || generator();
                next = next && next.done ? next : itertor.next();
                if (!next.done) {
                  callback.call(fixCall(thisArg), next.value, index);
                  object = {
                    done: false,
                    value: next.value
                  };

                  index += 1;
                } else {
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        every: function (callback, thisArg) {
          var iterator,
            result,
            index,
            next;

          _.assertIsFunction(callback);
          iterator = this[_.symIt]();
          next = iterator.next();
          result = true;
          index = 0;
          while (result && !next.done) {
            if (!callback.call(fixCall(thisArg), next.value, index)) {
              result = false;
            } else {
              next = iterator.next();
              index += 1;
            }
          }

          return result;
        },

        some: function (callback, thisArg) {
          var iterator,
            result,
            index,
            next;

          _.assertIsFunction(callback);
          iterator = this[_.symIt]();
          next = iterator.next();
          result = false;
          index = 0;
          while (!result && !next.done) {
            if (callback.call(fixCall(thisArg), next.value, index)) {
              result = true;
            } else {
              next = iterator.next();
              index += 1;
            }
          }

          return result;
        },

        asArray: function () {
          var iterator = this[_.symIt](),
            next = iterator.next(),
            result = [];

          while (!next.done) {
            _.push(result, next.value);
            next = iterator.next();
          }

          return result;
        },

        join: function (seperator) {
          var iterator = this[_.symIt](),
            next = iterator.next(),
            result = '',
            after;

          if (_.isUndefined(seperator)) {
            seperator = ',';
          }

          while (!next.done) {
            result += next.value;
            after = iterator.next();
            if (!after.done) {
              result += seperator;
            }

            next = after;
          }

          return result;
        },

        /*
        asString: function () {
          return this.join();
        },
        */

        asString: function () {
          return this.join('');
        },

        asObject: function () {
          var iterator = this[_.symIt](),
            next = iterator.next(),
            result = {},
            index = 0;

          while (!next.done) {
            result[index] = next.value;
            next = iterator.next();
            index += 1;
          }

          return result;
        },

        asMap: (function (typeFunction) {
          return function (CustomMap) {
            var iterator = this[_.symIt](),
              next = iterator.next(),
              result,
              index;

            if (arguments.length) {
              _.assertIsFunction(CustomMap);
              result = new CustomMap();
            } else if (typeof Map === typeFunction) {
              result = new Map();
            }

            if (!next.done) {
              index = 0;
              while (!next.done) {
                result.set(index, next.value);
                next = iterator.next();
                index += 1;
              }
            }

            return result;
          };
        }(typeof _.isObject)),

        asSet: (function (typeFunction) {
          return function (CustomSet) {
            var iterator = this[_.symIt](),
              next = iterator.next(),
              result;

            if (arguments.length) {
              _.assertIsFunction(CustomSet);
              result = new CustomSet();
            } else if (typeof Set === typeFunction) {
              result = new Set();
            }

            while (!next.done) {
              result.add(next.value);
              next = iterator.next();
            }

            return result;
          };
        }(typeof _.isObject)),

        /*
        asSetOwn: function () {
          var iterator = this[_.symIt](),
            next;

          do {
            next = iterator.next();
          } while (!next.done);

          return next.value;
        },
        */

        dropGenerator: function (number) {
          var generator = this[_.symIt],
            howMany = _.toLength(number);

          this[_.symIt] = function () {
            var index = 0,
              iterator,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = next && index < howMany ? next : iterator.next();
                while (!next.done && index < howMany) {
                  next = iterator.next();
                  index += 1;
                }

                if (!next.done) {
                  object = {
                    done: false,
                    value: next.value
                  };

                  index += 1;
                } else {
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        restGenerator: function () {
          return this.drop(1);
        },

        dropWhileGenerator: function (callback, thisArg) {
          var generator;

          _.assertIsFunction(callback);
          generator = this[_.symIt];
          this[_.symIt] = function () {
            var index = 0,
              iterator,
              dropped,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = next && !dropped ? next : iterator.next();
                while (!dropped && !next.done && callback.call(
                    fixCall(thisArg),
                    next.value,
                    index
                  )) {
                  next = iterator.next();
                  index += 1;
                }

                dropped = true;
                if (!next.done) {
                  object = {
                    done: false,
                    value: next.value
                  };

                  index += 1;
                } else {
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        takeGenerator: function (number) {
          var generator = this[_.symIt],
            howMany = _.toLength(number);

          this[_.symIt] = function () {
            var index = 0,
              iterator,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = next && index >= howMany ? next : iterator.next();
                if (!next.done && index < howMany) {
                  object = {
                    done: false,
                    value: next.value
                  };

                  index += 1;
                } else {
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        takeWhileGenerator: function (callback, thisArg) {
          var generator;

          _.assertIsFunction(callback);
          generator = this[_.symIt];
          this[_.symIt] = function () {
            var index = 0,
              iterator,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = next && next.done ? next : iterator.next();
                if (!next.done && callback.call(
                    fixCall(thisArg),
                    next.value,
                    index
                  )) {
                  object = {
                    done: false,
                    value: next.value
                  };

                  index += 1;
                } else {
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        chunkGenerator: function (size) {
          var generator = this[_.symIt],
            howMany = _.toLength(size) || 1;

          this[_.symIt] = function () {
            var iterator,
              next;

            return {
              next: function () {
                var chunk,
                  object;

                iterator = iterator || generator();
                next = next || iterator.next();
                if (!next.done) {
                  chunk = [];
                }

                while (!next.done && chunk && chunk.length < howMany) {
                  _.push(chunk, next.value);
                  next = iterator.next();
                }

                /*jshint singleGroups:false */
                if (!next.done || (chunk && chunk.length)) {
                  object = {
                    done: false,
                    value: chunk
                  };
                } else {
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        compactGenerator: function () {
          var generator = this[_.symIt];

          this[_.symIt] = function () {
            var iterator,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = next && next.done ? next : iterator.next();
                while (!next.done && !next.value) {
                  next = iterator.next();
                }

                if (!next.done) {
                  object = {
                    done: false,
                    value: next.value
                  };
                } else {
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        differenceGenerator: function (values) {
          var generator = this[_.symIt],
            set;

          this[_.symIt] = function () {
            var iterator,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = next && next.done ? next : iterator.next();
                set = set || new SetObject($reiterate(values).values());
                while (!next.done && set.has(next.value)) {
                  next = iterator.next();
                }

                if (!next.done) {
                  object = {
                    done: false,
                    value: next.value
                  };
                } else {
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        initialGenerator: function () {
          var generator = this[_.symIt];

          this[_.symIt] = function () {
            var iterator,
              after,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = next || iterator.next();
                after = iterator.next();
                if (!next.done && !after.done) {
                  object = {
                    done: false,
                    value: next.value
                  };

                  next = after;
                } else {
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        first: function () {
          var next = this[_.symIt]().next();

          return next.done ? _.noop() : next.value;
        },

        last: function () {
          var iterator = this[_.symIt](),
            next = iterator.next(),
            after,
            last;

          while (!next.done) {
            after = iterator.next();
            if (after.done) {
              last = next.value;
              break;
            }

            next = after;
          }

          return last;
        },

        uniqueGenerator: function () {
          var generator = this[_.symIt];

          this[_.symIt] = function () {
            var seen,
              iterator,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                seen = seen || new SetObject();
                next = next || iterator.next();
                while (!next.done && seen.has(next.value)) {
                  next = iterator.next();
                }

                if (!next.done) {
                  object = {
                    done: false,
                    value: next.value
                  };

                  seen.add(next.value);
                  next = iterator.next();
                } else {
                  object = _.assign({}, $.DONE);
                  object.value = seen;
                }

                return object;
              }
            };
          };

          return this;
        },

        intersectionGenerator: (function () {
          function has(argSet) {
            /*jshint validthis:true */
            return argSet.has(this.value);
          }

          function push(argSets, arg) {
            if (_.isArrayLike(arg) || _.isFunction(arg[_.symIt])) {
              _.push(argSets, new SetObject($reiterate(arg)));
            }

            return argSets;
          }

          return function () {
            var generator = this[_.symIt],
              args = arguments;

            this[_.symIt] = function () {
              var iterator,
                argSets,
                seen,
                next;

              return {
                next: function () {
                  var object;

                  argSets = argSets || _.reduce(args, push, []);
                  seen = seen || new SetObject();
                  iterator = iterator || generator();
                  next = next && next.done ? next : iterator.next();
                  while (!next.done) {
                    if (!seen.has(next.value)) {
                      if (_.every(argSets, has, next)) {
                        seen.add(next.value);
                        //yield next.value;
                        break;
                      }

                      seen.add(next.value);
                    }

                    next = iterator.next();
                  }

                  if (!next.done) {
                    object = {
                      done: false,
                      value: next.value
                    };
                  } else {
                    object = _.assign({}, $.DONE);
                  }

                  return object;
                }
              };
            };

            return this;
          };
        }()),

        unionGenerator: function () {
          var generator = this[_.symIt],
            args = arguments;


          this[_.symIt] = function () {
            var seen,
              iterator,
              next,
              outerIt,
              innerIt,
              outerNext,
              innerNext;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                seen = seen || new SetObject();
                next = next && next.done ? next : iterator.next();
                while (!next.done && !outerIt) {
                  if (!seen.has(next.value)) {
                    seen.add(next.value);
                    //yield next.value
                    break;
                  }

                  next = iterator.next();
                }

                if (next.done && args.length) {
                  outerIt = outerIt || new g.ArrayGenerator(args)[_.symIt]();
                  if (!innerNext || innerNext.done) {
                    outerNext = outerIt.next();
                  }

                  while (!outerNext.done || !innerNext) {
                    if (_.isArrayLike(outerNext.value) ||
                      _.isFunction(outerNext.value[_.symIt])) {
                      /*jshint singleGroups:false */
                      if (!innerIt || (innerNext && innerNext.done)) {
                        if (_.isArrayLike(outerNext.value)) {
                          innerIt =
                            $reiterate(outerNext.value, true)[_.symIt]();
                        } else {
                          innerIt = outerNext.value[_.symIt]();
                        }
                      }

                      if (innerIt) {
                        innerNext = innerIt.next();
                        while (!innerNext.done) {
                          if (!seen.has(innerNext.value)) {
                            seen.add(innerNext.value);
                            //yield innerNext.value;
                            break;
                          }

                          innerNext = innerIt.next();
                        }
                      }
                    }

                    if (innerNext.done) {
                      outerNext = outerIt.next();
                    } else {
                      break;
                    }
                  }
                }

                /*jshint singleGroups:false */
                if (!next.done || (innerNext && !innerNext.done)) {
                  object = {
                    done: false,
                    value: innerNext ? innerNext.value : next.value
                  };
                } else {
                  object = _.assign({}, $.DONE);
                  object.value = seen;
                }

                return object;
              }
            };
          };

          return this;
        },

        zipGenerator: (function () {
          function ofNext(zip, iterator) {
            var next = iterator.next();

            if (next.done) {
              _.push(zip.value, _.noop());
            } else {
              _.push(zip.value, next.value);
              zip.done = false;
            }

            return zip;
          }

          function push(iterators, arg) {
            if (_.isArrayLike(arg) || _.isFunction(arg[_.symIt])) {
              _.push(iterators, $reiterate(arg, true)[_.symIt]());
            }

            return iterators;
          }

          return function () {
            var generator = this[_.symIt],
              args = arguments;

            this[_.symIt] = function () {
              var iterators,
                next;

              return {
                next: function () {
                  var object;

                  iterators = iterators || _.reduce(args, push, [generator()]);
                  while (!next || !next.done) {
                    next = _.reduce(iterators, ofNext, {
                      value: [],
                      done: true
                    });

                    if (!next.done) {
                      //yield zip.value;
                      break;
                    }
                  }

                  if (!next.done) {
                    object = {
                      done: false,
                      value: next.value
                    };
                  } else {
                    object = _.assign({}, $.DONE);
                  }

                  return object;
                }
              };
            };

            return this;
          };
        }()),

        flattenGenerator: (function () {
          function setStack(stack, current, previous) {
            return stack.set(current, {
              index: 0,
              prev: previous
            });
          }

          return function (relaxed) {
            var generator = this[_.symIt];

            this[_.symIt] = function () {
              var stack,
                iterator,
                next,
                item,
                done1;

              return {
                next: function () {
                  var object,
                    value,
                    tail,
                    done2;

                  iterator = iterator || generator();
                  stack = stack || new MapObject();
                  next = !next || done1 ? iterator.next() : next;
                  done1 = false;
                  while (!next.done && !done2) {
                    if (!stack.size) {
                      if (_.isArray(next.value, relaxed)) {
                        item = next.value;
                        setStack(stack, item, null);
                      } else {
                        //yield
                        value = next.value;
                        done1 = true;
                        break;
                      }
                    }

                    while (stack.size) {
                      tail = stack.get(item);
                      if (tail.index >= item.length) {
                        stack[strDelete](item);
                        item = tail.prev;
                      } else {
                        value = item[tail.index];
                        if (_.isArray(value, relaxed)) {
                          throwIfCircular(stack, value);
                          setStack(stack, value, item);
                          item = value;
                        } else {
                          //yield
                          tail.index += 1;
                          done2 = true;
                          break;
                        }

                        tail.index += 1;
                      }
                    }

                    if (!done2) {
                      next = iterator.next();
                    }
                  }

                  if (!next.done) {
                    object = {
                      done: false,
                      value: value
                    };
                  } else {
                    object = _.assign({}, $.DONE);
                  }

                  return object;
                }
              };
            };

            return this;
          };
        }()),

        /*
         * Future code
         *
        walkOwnGenerator: (function () {
          function setStack(stack, current, previous) {
            return stack.set(current, {
              keys: keys(current),
              index: 0,
              prev: previous
            });
          }

          return function* () {
            var iterator = this[_.symIt](),
              next = iterator.next(),
              stack,
              object,
              value,
              tail;

            if (next.done) {
              return;
            }

            stack = new es6.Map();
            while (!next.done) {
              if (_.isObject(object)) {
                setStack(stack, object, null);
              } else {
                yield object;
              }

              while (stack && stack.size) {
                tail = stack.get(object);
                if (tail.index >= tail.keys.length) {
                  stack.delete(object);
                  object = tail.prev;
                } else {
                  key = tail.keys[tail.index];
                  value = object[next.value];
                  if (_.isObject(value)) {
                    throwIfCircular(stack, value);
                    setStack(stack, value, object);
                    object = value;
                  } else {
                    yield value;
                  }

                  tail.index += 1;
                }
              }

              next = iterator.next();
            }
          };
        }()),
        */

        mapGenerator: function (callback, thisArg) {
          var generator;

          _.assertIsFunction(callback);
          generator = this[_.symIt];
          this[_.symIt] = function () {
            var index = 0,
              iterator,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = next && next.done ? next : iterator.next();
                if (!next.done) {
                  object = {
                    done: false,
                    value: callback.call(fixCall(thisArg), next.value, index)
                  };

                  index += 1;
                } else {
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        filterGenerator: function (callback, thisArg) {
          var generator;

          _.assertIsFunction(callback);
          generator = this[_.symIt];
          this[_.symIt] = function () {
            var index = 0,
              iterator,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = next && next.done ? next : iterator.next();
                while (!next.done &&
                  !callback.call(fixCall(thisArg), next.value, index)) {
                  next = iterator.next();
                  index += 1;
                }

                if (!next.done) {
                  object = {
                    done: false,
                    value: next.value
                  };

                  index += 1;
                } else {
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        then: function (gen) {
          var generator = this[_.symIt],
            context;

          if (!_.isUndefined(gen)) {
            if (!_.isFunction(gen)) {
              throw new TypeError(
                'If not undefined, generator must be a function'
              );
            }

            context = new g.ThenGenerator(gen, this, _.chop(arguments, 1));
          } else {
            this[_.symIt] = function () {
              var index = 0,
                iterator,
                next;

              return {
                next: function () {
                  var object;

                  iterator = iterator || generator();
                  next = next && next.done ? next : iterator.next();
                  if (!next.done) {
                    object = {
                      done: false,
                      value: next.value
                    };

                    index += 1;
                  } else {
                    object = _.assign({}, $.DONE);
                  }

                  return object;
                }
              };
            };

            context = this;
          }

          return context;
        }
      },

      /**
       * The private namespace for generator functions.
       * @private
       * @namespace
       */
      g = {

        ThenGenerator: function (generator, context, argsArray) {
          this[_.symIt] = function () {
            var index = 0,
              iterator,
              next;

            return {
              next: function () {
                var object;

                if (!iterator) {
                  if (_.isFunction(generator)) {
                    iterator = generator.apply(context, argsArray);
                  } else {
                    iterator = generator[_.symIt]();
                  }
                }

                next = next && next.done ? next : iterator.next();
                if (!next.done) {
                  object = {
                    done: false,
                    value: next.value
                  };

                  index += 1;
                } else {
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          };
        },

        CounterGenerator: (function () {
          function countReverseGenerator(opts) {
            var count = opts.to;

            return {
              next: function () {
                var object;

                if (opts.to <= opts.from) {
                  if (count <= opts.from) {
                    object = {
                      done: false,
                      value: count
                    };

                    count += opts.by;
                  } else {
                    object = _.assign({}, $.DONE);
                  }
                } else {
                  if (count >= opts.from) {
                    object = {
                      done: false,
                      value: count
                    };

                    count -= opts.by;
                  } else {
                    object = _.assign({}, $.DONE);
                  }
                }

                return object;
              }
            };
          }

          function countForwardGenerator(opts) {
            var count = opts.from;

            return {
              next: function () {
                var object;

                if (opts.from <= opts.to) {
                  if (count <= opts.to) {
                    object = {
                      done: false,
                      value: count
                    };

                    count += opts.by;
                  } else {
                    object = _.assign({}, $.DONE);
                  }
                } else {
                  if (count >= opts.to) {
                    object = {
                      done: false,
                      value: count
                    };

                    count -= opts.by;
                  } else {
                    object = _.assign({}, $.DONE);
                  }
                }

                return object;
              }
            };
          }

          function countGenerator(opts) {
            var iterator,
              next;

            if (!iterator) {
              if (opts.reversed) {
                iterator = countReverseGenerator(opts);
              } else {
                iterator = countForwardGenerator(opts);
              }
            }

            return {
              next: function () {
                next = next && next.done ? next : iterator.next();

                return next;
              }
            };
          }

          function CounterGenerator() {
            if (!(this instanceof CounterGenerator)) {
              return new CounterGenerator();
            }

            var opts = {
              reversed: false,
              from: 0,
              to: _.MAX_SAFE_INTEGER,
              by: 1
            };

            _.setValue(this, 'state', function () {
              return _.assign({}, opts);
            });

            _.setValue(this, _.symIt, function () {
              return countGenerator(_.assign({}, opts));
            });

            _.setValue(this, 'from', function (number) {
              opts.from = _.clampToSafeIntegerRange(number);

              return this;
            });

            _.setValue(this, 'to', function (number) {
              opts.to = _.clampToSafeIntegerRange(number);

              return this;
            });

            _.setValue(this, 'by', function (number) {
              opts.by = Math.abs(_.clampToSafeIntegerRange(number));
              if (!opts.by) {
                throw new TypeError('can not count by zero');
              }

              return this;
            });

            _.setValue(this, 'reverse', function () {
              opts.reversed = !opts.reversed;
              return this;
            });
          }

          return CounterGenerator;
        }()),

        ArrayGenerator: (function () {
          function arrayGenerator(subject, opts) {
            var generator,
              counter,
              iterator,
              next;

            if (opts.length) {
              generator = g.CounterGenerator();
              generator.from(opts.from).to(opts.to).by(opts.by);
              setReverseIfOpt(opts, generator);
              iterator = {
                next: function () {
                  var object;

                  counter = counter || generator[_.symIt]();
                  next = next && next.done ? next : counter.next();
                  if (!next.done) {
                    object = {
                      done: false,
                      value: getYieldValue(opts, subject, next.value)
                    };
                  } else {
                    object = _.assign({}, $.DONE);
                  }

                  return object;
                }
              };
            } else {
              iterator = {
                next: function () {
                  return _.assign({}, $.DONE);
                }
              };
            }

            return iterator;
          }

          function ArrayGenerator(subject) {
            if (!(this instanceof ArrayGenerator)) {
              return new ArrayGenerator(subject);
            }

            var length = _.isArrayLike(subject) ? subject.length : 0,
              opts = _.assign({
                length: length,
                reversed: false,
                from: 0,
                to: length - 1,
                by: 1
              }, $.OPTS.VALUES);

            _.setValue(this, 'state', function () {
              return _.assign({}, opts);
            });

            _.setValue(this, _.symIt, function () {
              return arrayGenerator(subject, _.assign({}, opts));
            });

            _.setValue(this, 'entries', function () {
              _.assign(opts, $.OPTS.ENTRIES);

              return this;
            });

            _.setValue(this, 'values', function () {
              _.assign(opts, $.OPTS.VALUES);

              return this;
            });

            _.setValue(this, 'keys', function () {
              _.assign(opts, $.OPTS.KEYS);

              return this;
            });

            _.setValue(this, 'reverse', function () {
              opts.reversed = !opts.reversed;
              return this;
            });

            _.setValue(this, 'slice', function (start, end) {
              setIndexesOpts(start, end, opts);
              return this;
            });
          }

          return ArrayGenerator;
        }()),

        StringGenerator: (function () {
          function getStringYieldValue(opts, character, key) {
            var result;

            if (opts.keys) {
              result = key;
            } else if (opts.values) {
              result = _.fromCodePoint(_.codePointAt(character));
            } else {
              result = [key, _.fromCodePoint(_.codePointAt(character))];
            }

            return result;
          }

          function stringGenerator(subject, opts) {
            var generator,
              counter,
              iterator,
              isPair,
              next;

            if (!opts.length) {
              return {
                next: function () {
                  return _.assign({}, $.DONE);
                }
              };
            }

            generator = g.CounterGenerator(opts);
            generator.from(opts.from).to(opts.to).by(opts.by);
            setReverseIfOpt(opts, generator);
            iterator = {
              next: function () {
                var object,
                  char1,
                  char2;

                counter = counter || generator[_.symIt]();
                next = next || counter.next();
                if (!next.done) {
                  while (!next.done && !object) {
                    if (!isPair) {
                      if (opts.reversed) {
                        char1 = subject[next.value - 1];
                        char2 = subject[next.value];
                        isPair = _.isSurrogatePair(char1, char2);
                        if (!isPair) {
                          object = {
                            done: false,
                            value: getStringYieldValue(
                              opts,
                              char2,
                              next.value
                            )
                          };
                        }
                      } else {
                        char1 = subject[next.value];
                        char2 = subject[next.value + 1];
                        isPair = _.isSurrogatePair(char1, char2);
                        object = {
                          done: false,
                          value: getStringYieldValue(
                            opts,
                            char1 + char2,
                            next.value
                          )
                        };
                      }
                    } else {
                      isPair = !isPair;
                      if (opts.reversed) {
                        object = {
                          done: false,
                          value: getStringYieldValue(
                            opts,
                            char1 + char2,
                            next.value
                          )
                        };
                      }
                    }

                    next = counter.next();
                  }
                }

                return object || _.assign({}, $.DONE);
              }
            };

            return iterator;
          }

          function StringGenerator(subject) {
            if (!(this instanceof StringGenerator)) {
              return new StringGenerator(subject);
            }

            var length = _.isArrayLike(subject) ? subject.length : 0,
              opts = _.assign({
                length: length,
                reversed: false,
                from: 0,
                to: length - 1,
                by: 1
              }, $.OPTS.VALUES);

            _.setValue(this, 'state', function () {
              return _.assign({}, opts);
            });

            _.setValue(this, _.symIt, function () {
              return stringGenerator(subject, _.assign({}, opts));
            });

            _.setValue(this, 'entries', function () {
              _.assign(opts, $.OPTS.ENTRIES);

              return this;
            });

            _.setValue(this, 'values', function () {
              _.assign(opts, $.OPTS.VALUES);

              return this;
            });

            _.setValue(this, 'keys', function () {
              _.assign(opts, $.OPTS.KEYS);

              return this;
            });

            _.setValue(this, 'reverse', function () {
              opts.reversed = !opts.reversed;
              return this;
            });

            _.setValue(this, 'slice', function (start, end) {
              var char1,
                char2;

              setIndexesOpts(start, end, opts);
              if (opts.from) {
                char1 = subject[opts.from - 1];
                char2 = subject[opts.from];
                if (_.isSurrogatePair(char1, char2)) {
                  opts.from += 1;
                }
              }

              if (opts.to) {
                char1 = subject[opts.to - 1];
                char2 = subject[opts.to];
                if (_.isSurrogatePair(char1, char2)) {
                  opts.to -= 1;
                }
              }

              return this;
            });
          }

          return StringGenerator;
        }()),

        EnumerateGenerator: (function () {
          function enumerateGenerator(subject, opts) {
            var iterator,
              keys,
              next,
              key;

            if (opts.own) {
              keys = _.keys(subject);
            } else {
              keys = [];
              for (key in subject) {
                /*jshint forin:false */
                _.push(keys, key);
              }
            }

            return {
              next: function () {
                var object;

                iterator = iterator || new g.ArrayGenerator(keys)[_.symIt]();
                next = next && next.done ? next : iterator.next();
                if (!next.done) {
                  object = {
                    done: false,
                    value: getYieldValue(opts, subject, next.value)
                  };
                } else {
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          }

          function EnumerateGenerator(subject) {
            if (!(this instanceof EnumerateGenerator)) {
              return new EnumerateGenerator(subject);
            }

            var opts = _.assign({
              own: false
            }, $.OPTS.VALUES);

            _.setValue(this, 'state', function () {
              return _.assign({}, opts);
            });

            _.setValue(this, _.symIt, function () {
              return enumerateGenerator(subject, _.assign({}, opts));
            });

            _.setValue(this, 'entries', function () {
              _.assign(opts, $.OPTS.ENTRIES);

              return this;
            });

            _.setValue(this, 'values', function () {
              _.assign(opts, $.OPTS.VALUES);

              return this;
            });

            _.setValue(this, 'keys', function () {
              _.assign(opts, $.OPTS.KEYS);

              return this;
            });

            _.setValue(this, 'own', function () {
              opts.own = !opts.own;
              return this;
            });
          }

          return EnumerateGenerator;
        }()),

        RepeatGenerator: (function () {
          function repeatGenerator(subject) {
            return {
              next: function () {
                return {
                  done: false,
                  value: subject
                };
              }
            };
          }

          function RepeatGenerator(subject) {
            if (!(this instanceof RepeatGenerator)) {
              return new RepeatGenerator(subject);
            }

            _.setValue(this, _.symIt, function () {
              return repeatGenerator(subject);
            });
          }

          return RepeatGenerator;
        }()),

        UnzipGenerator: (function () {
          function unzipGenerator(array) {
            var iterator,
              first,
              next,
              rest;

            if (_.isArrayLike(array) || _.isFunction(array[_.symIt])) {
              first = $reiterate(array).first();
              if (!_.isObjectLike(first)) {
                first = [];
              }

              rest = $reiterate(array).rest().asArray();
            } else {
              first = rest = [];
            }

            return {
              next: function () {
                var object;

                iterator = iterator || p.zipGenerator.apply(
                  $reiterate(first, true),
                  rest
                )[_.symIt]();

                next = next && next.done ? next : iterator.next();
                if (!next.done) {
                  object = {
                    done: false,
                    value: next.value
                  };
                } else {
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          }

          function UnzipGenerator(subject) {
            if (!(this instanceof UnzipGenerator)) {
              return new UnzipGenerator(subject);
            }

            _.setValue(this, _.symIt, function () {
              return unzipGenerator(subject);
            });
          }

          return UnzipGenerator;
        }())

      };

    populatePrototypes();

    return (function () {
      function makeCounterGenerator(subject, to, by) {
        var generator = new g.CounterGenerator();

        if (_.isNumber(subject)) {
          if (_.isNil(to)) {
            generator.to(subject);
          } else {
            generator.from(subject).to(to);
          }

          if (!_.isNil(by)) {
            generator.by(by);
          }
        }

        return generator;
      }

      $reiterate = function reiterate(subject, to, by) {
        var generator;

        if (_.isNil(subject) || _.isNumber(subject)) {
          generator = makeCounterGenerator(subject, to, by);
        } else if (_.isArray(subject, to)) {
          generator = new g.ArrayGenerator(subject);
        } else if (_.isString(subject)) {
          generator = new g.StringGenerator(subject);
        } else if (_.isFunction(subject[_.symIt])) {
          generator = new g.ThenGenerator(subject, {}, _.chop(arguments, 1));
        } else {
          generator = new g.EnumerateGenerator(subject);
        }

        return generator;
      };

      /*
       * Static methods
       */
      _.setValue($reiterate, '$', {});
      _.setValue($reiterate.$, 'Map', MapObject);
      _.setValue($reiterate.$, 'Set', SetObject);
      _.forEach(_.keys(_), function (key) {
        _.setValue($reiterate.$, key, _[key]);
      });

      _.setValue($reiterate, 'array', g.ArrayGenerator);
      _.setValue($reiterate, 'string', g.StringGenerator);
      _.setValue($reiterate, 'enumerate', g.EnumerateGenerator);
      _.setValue($reiterate, 'repeat', g.RepeatGenerator);
      _.setValue($reiterate, 'unzip', g.UnzipGenerator);
      _.setValue($reiterate, 'iterator', _.symIt);

      return $reiterate;
    }());
  }

));
