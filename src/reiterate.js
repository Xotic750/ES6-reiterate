/**
 * @file {@link @@HOMEPAGE @@MODULE}. @@DESCRIPTION.
 * @version @@VERSION
 * @author @@AUTHORNAME <@@AUTHOREMAIL>
 * @copyright @@COPYRIGHT @@AUTHORNAME
 * @license {@link <@@LICLINK> @@LICENSE}
 * @module @@MODULE
 */

/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:3, maxdepth:4, maxstatements:200,
    maxcomplexity:6
*/

/*global
    define, module
*/

/*property
    ARRAY, BY, ENTRIES, FROM, FUNCTION, KEYS, MAP, MAX_SAFE_INTEGER,
    METHODDESCRIPTOR, MIN_SAFE_INTEGER, NUMBER, OWN, Object, REVERSED, SET,
    STARTED, STRING, STRINGTAG, SYMBOL, TO, TYPE, UNDEFINED, VALUES,
    VARIABLEDESCRIPTOR, abs, amd, bind, call, charCodeAt, clamp,
    clampToSafeIntegerRange, configurable, defineProperty, enumerable, exports,
    floor, for, has, hasOwn, hasOwnProperty, isArray, isArrayLike, isCircular,
    isFinite, isFunction, isLength, isNaN, isNil, isNumber, isObject, isString,
    isSurrogatePair, isUndefined, lastIndex, length, max, min, mustBeFunction,
    mustBeFunctionIfDefined, prototype, setMethod, setProperty, setVariable,
    sign, toInteger, toSafeInteger, toString, toStringTag, value, writable
*/

// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    if (root.hasOwnProperty('reiterate')) {
      throw new Error('Unable to define "reiterate"');
    }

    Object.defineProperty(root, 'reiterate', {
      enumerable: false,
      writable: true,
      configurable: true,
      value: factory()
    });
  }
}(this, function () {
  'use strict';

  /*
   * const
   */

  var $ = {
      STRINGTAG: {
        ARRAY: Object.prototype.toString.call(Array.prototype),
        MAP: Object.prototype.toString.call(Map.prototype),
        SET: Object.prototype.toString.call(Set.prototype),
        STRING: Object.prototype.toString.call(String.prototype),
        NUMBER: Object.prototype.toString.call(Number.prototype)
      },
      TYPE: {
        FUNCTION: typeof Function,
        UNDEFINED: typeof undefined
      },
      METHODDESCRIPTOR: {
        enumerable: false,
        writable: true,
        configurable: false,
        value: undefined
      },
      VARIABLEDESCRIPTOR: {
        enumerable: false,
        writable: true,
        configurable: false,
        value: undefined
      },
      SYMBOL: {
        ENTRIES: Symbol.for('entries'),
        KEYS: Symbol.for('keys'),
        VALUES: Symbol.for('values'),
        STARTED: Symbol.for('started'),
        REVERSED: Symbol.for('reversed'),
        OWN: Symbol.for('own'),
        FROM: Symbol.for('from'),
        TO: Symbol.for('to'),
        BY: Symbol.for('by')
      }
    },
    _ = {
      hasOwn: Function.call.bind(Object.prototype.hasOwnProperty),

      toStringTag: Function.call.bind(Object.prototype.toString),

      Object: Object,

      setProperty: function (object, property, descriptor) {
        Object.defineProperty(object, property, descriptor);
      },

      setMethod: function (object, property, method) {
        if (_.hasOwn(object, property)) {
          throw new Error('property already exists on object');
        }

        $.METHODDESCRIPTOR.value = method;
        _.setProperty(object, property, $.METHODDESCRIPTOR);

        return method;
      },

      setVariable: function (object, property, value) {
        $.VARIABLEDESCRIPTOR.value = value;
        _.setProperty(object, property, $.VARIABLEDESCRIPTOR);

        return value;
      },

      /**
       * Returns true if the operand inputArg is null or undefined.
       *
       * @private
       * @param {*} subject
       * @return {boolean}
       */
      isNil: function (subject) {
        /*jshint eqnull:true */
        return subject == null;
      },

      /**
       * The abstract operation throws an error if its argument is a value that
       * cannot be  converted to an Object, otherwise returns the argument.
       *
       * @private
       * @param {*} inputArg
       * @throws {TypeError} If inputArg is null or undefined.
       * @return {*}
       * @see http://www.ecma-international.org/ecma-262/6.0/
       *      #sec-requireobjectcoercible
       */
      /*
      requireObjectCoercible: function (subject) {
        if (_.isNil(subject)) {
          throw new TypeError('Cannot convert undefined or null to object');
        }

        return subject;
      },
      */

      /**
       * The abstract operation converts its argument to a value of type Object.
       *
       * @private
       * @param {*} subject
       * @throws {TypeError} If subject is null or undefined.
       * @return {Object}
       * @see http://www.ecma-international.org/ecma-262/6.0/#sec-toobject
       */
      /*
      toObject: function (subject) {
        return _.Object(_.requireObjectCoercible(subject));
      },
      */

      /**
       * The function evaluates the passed value and converts it to an integer.
       *
       * @private
       * @param {*} subject The object to be converted to an integer.
       * @return {number} If the target value is NaN, null or undefined, 0 is
       *                  returned. If the target value is false, 0 is returned
       *                  and if true, 1 is returned.
       * @see http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger
       */
      toInteger: function (subject) {
        var number = +subject,
          val = 0;

        if (!Number.isNaN(number)) {
          if (!number || !Number.isFinite(number)) {
            val = number;
          } else {
            val = Math.sign(number) * Math.floor(Math.abs(number));
          }
        }

        return val;
      },

      /**
       * Returns true if the operand inputArg is a Number.
       *
       * @private
       * @param {*} subject
       * @return {boolean}
       */
      isNumber: function (subject) {
        return _.toStringTag(subject) === $.STRINGTAG.NUMBER;
      },

      /**
       * Returns a number clamped to the range set by min and max.
       *
       * @private
       * @param {number} number
       * @param {number} min
       * @param {number} max
       * @throws {TypeError} If params are not of number type.
       * @return {number}
       */
      clamp: function (number, min, max) {
        if (!_.isNumber(number) || !_.isNumber(min) || !_.isNumber(max)) {
          throw new TypeError('argument is not of type number');
        }
        return Math.min(Math.max(number, min), max);
      },

      /**
       * The function evaluates the passed value and converts it to a safe
       * integer.
       *
       * @private
       * @param {*} subject
       * @return {number}
       */
      toSafeInteger: function (subject) {
        return _.clamp(
          _.toInteger(subject),
          Number.MIN_SAFE_INTEGER,
          Number.MAX_SAFE_INTEGER
        );
      },

      /**
       * Returns true if the operand subject is undefined
       *
       * @private
       * @param {*} subject The object to be tested.
       * @return {boolean} True if the object is undefined, otherwise false.
       */
      isUndefined: function (subject) {
        return typeof subject === $.TYPE.UNDEFINED;
      },

      /**
       * Returns true if the operand subject is a Function
       *
       * @private
       * @param {*} subject The object to be tested.
       * @return {boolean} True if the object is a function, otherwise false.
       */
      isFunction: function (subject) {
        return typeof subject === $.TYPE.FUNCTION;
      },

      /**
       * Returns true if the operand inputArg is a String.
       *
       * @private
       * @param {*} subject
       * @return {boolean}
       */
      isString: function (subject) {
        return _.toStringTag(subject) === $.STRINGTAG.STRING;
      },

      /**
       * Checks if `value` is a valid array-like length.
       *
       * @private
       * @param {*} subject The value to check.
       * @return {boolean} Returns `true` if `value` is a valid length,
       *                   else `false`.
       */
      isLength: function (subject) {
        return _.toSafeInteger(subject) === subject && subject >= 0;
      },

      /**
       * Checks if `value` is array-like. A value is considered array-like if
       * it's  not a function and has a `value.length` that's an integer greater
       * than or equal to `0` and less than or equal to
       * `Number.MAX_SAFE_INTEGER`.
       *
       * @private
       * @param {*} subject The object to be tested.
       * @return {boolean} Returns `true` if `subject` is array-like,
       *                   else `false`.
       */
      isArrayLike: function (subject) {
        return !_.isNil(subject) &&
          !_.isFunction(subject) &&
          _.isLength(subject.length);
      },

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
      isArray: function (subject, relaxed) {
        var isA;

        if (relaxed) {
          isA = _.isArrayLike(subject) && !_.isString(subject);
        } else {
          isA = Array.isArray(subject);
        }

        return isA;
      },

      /**
       * Get the last index of an array-like object.
       *
       * @private
       * @param {*} subject The object to get the last index of.
       * @return {number} Returns the last index number of the array-like or 0.
       */
      lastIndex: function (subject) {
        return _.isArrayLike(subject) &&
          _.toSafeInteger(subject.length - 1) ||
          0;
      },

      /**
       * Returns true if the operand subject is an Object.
       *
       * @private
       * @param {*} subject The argument to test for validity.
       * @return {boolean} true if an object, otherwise false.
       */
      isObject: function (subject) {
        return _.Object(subject) === subject;
      },

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
      isSurrogatePair: function (char1, char2) {
        var result = false,
          code1,
          code2;

        if (char1 && char2 && _.isString(char1) && _.isString(char2)) {
          code1 = char1.charCodeAt();
          if (code1 >= 0xD800 && code1 <= 0xDBFF) {
            code2 = char2.charCodeAt();
            if (code2 >= 0xDC00 && code2 <= 0xDFFF) {
              result = true;
            }
          }
        }

        return result;
      },

      /**
       * Tests the subject to see if it is a function and throws an error if it
       * is not.
       *
       * @private
       * @param {*} subject The argument to test for validity.
       * @throws {TypeError} If subject is not a function
       * @return {*} Returns the subject if passes.
       */
      mustBeFunction: function (subject) {
        if (!_.isFunction(subject)) {
          throw new TypeError('argument must be a function');
        }

        return subject;
      },

      /**
       * Tests the subject to see if it is undefined, if not then the subject
       * must be a function, otherwise throw an error.
       *
       * @private
       * @param {*} subject The argument to test for validity
       * @throws {TypeError} If subject is not undefined and  is not a function.
       * @return {*} Returns the subject if passes.
       */
      mustBeFunctionIfDefined: function (subject, name) {
        if (!_.isUndefined(subject) && !_.isFunction(subject)) {
          throw new TypeError(
            'If not undefined, ' + name + ' must be a function'
          );
        }

        return subject;
      },

      /**
       * Converts the subject into a safe number within the max and min safe
       * integer range.
       *
       * @private
       * @param {*} subject The argument to be converted.
       * @return {number} Returns a safe number in range.
       */
      clampToSafeIntegerRange: function (subject) {
        var num = +subject,
          val = 0;

        if (!Number.isNaN(num)) {
          val = _.clamp(num, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        }

        return val;
      },

      isCircular: function (thisArg, stack, value) {
        if (stack.has(thisArg) || stack.has(value)) {
          throw new TypeError('circular object');
        }

        return false;
      }
    };

  /*
   * define iterators
   */

  /*
   * toArray
   */

  function toArray(mapFn, thisArg) {
    var result,
      item;

    _.mustBeFunctionIfDefined(mapFn, 'mapFn');
    /*jshint validthis:true */
    for (item of this) {
      if (!result) {
        result = [];
      }

      result.push(mapFn ? mapFn.call(thisArg, this, item) : item);
    }

    return result;
  }

  /*
   * unique
   */

  function* uniqueGenerator() {
    var seen,
      item;

    /*jshint validthis:true */
    for (item of this) {
      if (!seen) {
        seen = new Set();
      }

      if (!seen.has(item)) {
        seen.add(item, true);
        yield item;
      }
    }
  }

  /*
   * flatten
   */

  function* flattenGenerator(relaxed) {
    var stack,
      object,
      value,
      tail;

    /*jshint validthis:true */
    for (object of this) {
      if (_.isArray(object, relaxed)) {
        stack = new Map().set(object, {
          index: 0,
          prev: null
        });
      } else {
        yield object;
      }

      while (stack && stack.size) {
        tail = stack.get(object);
        if (tail.index >= object.length) {
          stack.delete(object);
          object = tail.prev;
        } else {
          value = object[tail.index];
          if (_.isArray(value, relaxed)) {
            /*jshint validthis:true */
            _.isCircular(this, stack, value);
            stack.set(value, {
              index: 0,
              prev: object
            });

            object = value;
          } else {
            yield value;
          }

          tail.index += 1;
        }
      }
    }
  }

  /*
   * walkOwn
   */

  /*
  function* WalkOwnGenerator() {
    var stack = new Map(),
      object,
      value,
      tail,
      key;

    for (object of this) {
      if (_.isObject(object)) {
        stack.set(object, {
          keys: Object.keys(object),
          index: 0,
          prev: null
        });
      } else {
        yield object;
      }

      while (stack.size) {
        tail = stack.get(object);
        if (tail.index >= tail.keys.length) {
          stack.delete(object);
          object = tail.prev;
        } else {
          key = tail.keys[tail.index];
          value = object[key];
          if (_.isObject(value)) {
            _.isCircular(this, stack, value);
            stack.set(value, {
              keys: Object.keys(value),
              index: 0,
              prev: object
            });

            object = value;
          } else {
            yield value;
          }

          tail.index += 1;
        }
      }
    }
  }
  */

  /*
   * iterator execution
   */

  function getYieldValue(opts, object, key) {
    var result,
      value;

    if (opts.keys) {
      result = key;
    } else {
      value = object[key];
      if (opts.values) {
        result = value;
      } else {
        result = [key, value];
      }
    }

    return result;
  }

  function* mapGenerator(callback, thisArg) {
    _.mustBeFunction(callback);
    /*jshint validthis:true */
    for (var element of this) {
      yield callback.call(thisArg, element, this);
    }
  }

  /*
   * filter
   */

  function* filterGenerator(callback, thisArg) {
    _.mustBeFunction(callback);
    /*jshint validthis:true */
    for (var element of this) {
      if (callback.call(thisArg, element, this)) {
        yield element;
      }
    }
  }

  function then(generator) {
    /*jshint validthis:true */
    var iterator;

    if (!_.isFunction(generator)) {
      if (!_.isUndefined(generator)) {
        throw new TypeError('If not undefined, generator must be a function');
      }

      iterator = this;
    } else {
      iterator = generator(this);
      _.setMethod(iterator, 'filter', filterGenerator);
      _.setMethod(iterator, 'map', mapGenerator);
      _.setMethod(iterator, 'unique', uniqueGenerator);
      _.setMethod(iterator, 'iterate', iterateGenerator);
      _.setMethod(iterator, 'enumerate', EnumerateGenerator);
      _.setMethod(iterator, 'then', then);
      _.setMethod(iterator, 'toArray', toArray);
      _.setMethod(iterator, 'stringify', stringify);
      _.setMethod(iterator, 'flatten', flattenGenerator);
    }

    return iterator;
  }

  /*
   * counter
   */

  function* countReverseGenerator(opts) {
    var count = opts.to;

    if (opts.to <= opts.from) {
      while (count <= opts.from) {
        yield count;
        count += opts.by;
      }
    } else {
      while (count >= opts.from) {
        yield count;
        count -= opts.by;
      }
    }
  }

  function* countForwardGenerator(opts) {
    var count = opts.from;

    if (opts.from <= opts.to) {
      while (count <= opts.to) {
        yield count;
        count += opts.by;
      }
    } else {
      while (count >= opts.to) {
        yield count;
        count -= opts.by;
      }
    }
  }

  function* countGenerator(opts) {
    if (opts.reversed) {
      yield * countReverseGenerator(opts);
    } else {
      yield * countForwardGenerator(opts);
    }
  }

  function setReverseGenerator(opts, generator) {
    if (opts.reversed) {
      generator.reverse();
    }

    return generator;
  }

  function CounterGenerator() {
    if (!(this instanceof CounterGenerator)) {
      return new CounterGenerator();
    }

    var opts = {
      reversed: false,
      from: 0,
      to: Number.MAX_SAFE_INTEGER,
      by: 1
    };

    _.setMethod(this, 'state', function () {
      return {
        reversed: opts.reversed,
        from: opts.from,
        to: opts.to,
        by: opts.by
      };
    });

    _.setMethod(this, Symbol.iterator, function () {
      return countGenerator(this.state());
    });

    _.setMethod(this, 'from', function (number) {
      opts.from = _.clampToSafeIntegerRange(number);
      return this;
    });

    _.setMethod(this, 'to', function (number) {
      opts.to = _.clampToSafeIntegerRange(number);
      return this;
    });

    _.setMethod(this, 'by', function (number) {
      opts.by = Math.abs(_.clampToSafeIntegerRange(number));
      if (!opts.by) {
        throw new TypeError('can not count by zero');
      }

      return this;
    });

    _.setMethod(this, 'reverse', function () {
      opts.reversed = !opts.reversed;
      return this;
    });
  }

  _.setMethod(CounterGenerator.prototype, 'map', mapGenerator);
  _.setMethod(CounterGenerator.prototype, 'filter', filterGenerator);
  _.setMethod(CounterGenerator.prototype, 'toArray', toArray);
  _.setMethod(CounterGenerator.prototype, 'then', then);

  /*
   * arrayEntries
   */

  function* arrayGenerator(subject, opts) {
    var generator = new CounterGenerator(),
      key;

    setReverseGenerator(opts, generator.to(_.lastIndex(subject)));
    for (key of generator) {
      yield getYieldValue(opts, subject, key);
    }
  }

  function ArrayGenerator(subject) {
    if (!(this instanceof ArrayGenerator)) {
      return new ArrayGenerator(subject);
    }

    var opts = {
      reversed: false,
      entries: true,
      values: false,
      keys: false,
    };

    _.setMethod(this, 'state', function () {
      return {
        reversed: opts.reversed,
        entries: opts.entries,
        values: opts.values,
        keys: opts.keys
      };
    });

    _.setMethod(this, Symbol.iterator, function () {
      return arrayGenerator(subject, this.state());
    });

    _.setMethod(this, 'entries', function () {
      opts.entries = true;
      opts.values = false;
      opts.keys = false;
      return this;
    });

    _.setMethod(this, 'values', function () {
      opts.entries = false;
      opts.values = true;
      opts.keys = false;
      return this;
    });

    _.setMethod(this, 'keys', function () {
      opts.entries = false;
      opts.values = false;
      opts.keys = true;
      return this;
    });

    _.setMethod(this, 'reverse', function () {
      opts.reversed = !opts.reversed;
      return this;
    });
  }

  _.setMethod(ArrayGenerator.prototype, 'map', mapGenerator);
  _.setMethod(ArrayGenerator.prototype, 'filter', filterGenerator);
  _.setMethod(ArrayGenerator.prototype, 'toArray', toArray);
  _.setMethod(ArrayGenerator.prototype, 'then', then);
  _.setMethod(ArrayGenerator.prototype, 'unique', uniqueGenerator);
  _.setMethod(ArrayGenerator.prototype, 'flatten', flattenGenerator);

  /*
   * stringEntries
   */

  function stringify(mapFn, thisArg) {
    var result,
      item;

    _.mustBeFunctionIfDefined(mapFn, 'mapFn');
    result = '';
    /*jshint validthis:true */
    for (item of this) {
      result += mapFn ? mapFn.call(thisArg, this, item) : item;
    }

    return result;
  }

  function getStringYieldValue(opts, character, key) {
    var value,
      result;

    if (opts.keys) {
      result = key;
    } else {
      value = String.fromCodePoint(character.codePointAt(0));
      if (opts.values) {
        result = value;
      } else {
        result = [key, value];
      }
    }

    return result;
  }

  function* stringGenerator(subject, opts) {
    var generator = new CounterGenerator(opts),
      next = true,
      char1,
      char2,
      key;

    setReverseGenerator(opts, generator.to(_.lastIndex(subject)));
    for (key of generator) {
      if (next) {
        if (opts.reversed) {
          char1 = subject[key - 1];
          char2 = subject[key];
          next = !_.isSurrogatePair(char1, char2);
          if (next) {
            yield getStringYieldValue(opts, char2, key);
          }
        } else {
          char1 = subject[key];
          char2 = subject[key + 1];
          next = !_.isSurrogatePair(char1, char2);
          yield getStringYieldValue(opts, char1 + char2, key);
        }
      } else {
        next = !next;
        if (opts.reversed) {
          yield getStringYieldValue(opts, char1 + char2, key);
        }
      }
    }
  }

  function StringGenerator(subject) {
    if (!(this instanceof StringGenerator)) {
      return new StringGenerator(subject);
    }

    var opts = {
      reversed: false,
      entries: true,
      values: false,
      keys: false,
    };

    _.setMethod(this, 'state', function () {
      return {
        reversed: opts.reversed,
        entries: opts.entries,
        values: opts.values,
        keys: opts.keys
      };
    });

    _.setMethod(this, Symbol.iterator, function () {
      return stringGenerator(subject, this.state());
    });

    _.setMethod(this, 'entries', function () {
      opts.entries = true;
      opts.values = false;
      opts.keys = false;
      return this;
    });

    _.setMethod(this, 'values', function () {
      opts.entries = false;
      opts.values = true;
      opts.keys = false;
      return this;
    });

    _.setMethod(this, 'keys', function () {
      opts.entries = false;
      opts.values = false;
      opts.keys = true;
      return this;
    });

    _.setMethod(this, 'reverse', function () {
      opts.reversed = !opts.reversed;
      return this;
    });
  }

  _.setMethod(StringGenerator.prototype, 'map', mapGenerator);
  _.setMethod(StringGenerator.prototype, 'filter', filterGenerator);
  _.setMethod(StringGenerator.prototype, 'toArray', toArray);
  _.setMethod(StringGenerator.prototype, 'then', then);
  _.setMethod(StringGenerator.prototype, 'unique', uniqueGenerator);
  _.setMethod(StringGenerator.prototype, 'stringify', stringify);

  /*
   * enumerate
   */

  function* enumerateGenerator(subject, opts) {
    for (var key in subject) {
      if (!opts.own || _.hasOwn(subject, key)) {
        yield getYieldValue(opts, subject, key);
      }
    }
  }

  function EnumerateGenerator(subject) {
    if (!(this instanceof EnumerateGenerator)) {
      return new EnumerateGenerator(subject);
    }

    var opts = {
      entries: true,
      values: false,
      keys: false,
      own: false
    };

    _.setMethod(this, 'state', function () {
      return {
        entries: opts.entries,
        values: opts.values,
        keys: opts.keys,
        own: opts.own
      };
    });

    _.setMethod(this, Symbol.iterator, function () {
      return enumerateGenerator(subject, this.state());
    });

    _.setMethod(this, 'entries', function () {
      opts.entries = true;
      opts.values = false;
      opts.keys = false;
      return this;
    });

    _.setMethod(this, 'values', function () {
      opts.entries = false;
      opts.values = true;
      opts.keys = false;
      return this;
    });

    _.setMethod(this, 'keys', function () {
      opts.entries = false;
      opts.values = false;
      opts.keys = true;
      return this;
    });

    _.setMethod(this, 'own', function () {
      opts.own = !opts.own;
      return this;
    });
  }

  _.setMethod(EnumerateGenerator.prototype, 'map', mapGenerator);
  _.setMethod(EnumerateGenerator.prototype, 'filter', filterGenerator);
  _.setMethod(EnumerateGenerator.prototype, 'toArray', toArray);
  _.setMethod(EnumerateGenerator.prototype, 'then', then);
  _.setMethod(EnumerateGenerator.prototype, 'unique', uniqueGenerator);
  _.setMethod(EnumerateGenerator.prototype, 'flatten', flattenGenerator);
  _.setMethod(EnumerateGenerator.prototype, 'stringify', stringify);

  function* mapObjectGenerator() {
    if (true) {
      throw new Error('not yet');
    }

    yield undefined;
  }

  function* setObjectGenerator() {
    if (true) {
      throw new Error('not yet');
    }

    yield undefined;
  }

  function makeCounterGenerator(subject, to, by) {
    var generator = new CounterGenerator();

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

  function makeOtherGenerators(subject) {
    var tag = _.toStringTag(subject),
      generator;

    if (tag === $.MAPTAG) {
      generator = mapObjectGenerator(subject);
    } else if (tag === $.SETTAG) {
      generator = setObjectGenerator(subject);
    } else {
      generator = new EnumerateGenerator(subject);
    }

    return generator;
  }

  function Reiterate(subject, to, by) {
    if (!(this instanceof Reiterate)) {
      return new Reiterate(subject, to, by);
    }

    var generator;

    if (_.isNil(subject) || _.isNumber(subject)) {
      generator = makeCounterGenerator(subject, to, by);
    } else if (_.isArray(subject, to)) {
      generator = new ArrayGenerator(subject);
    } else if (_.isString(subject)) {
      generator = new StringGenerator(subject);
    } else {
      generator = makeOtherGenerators(subject);
    }

    return generator;
  }

  function* iterateGenerator(relaxed) {
    var value,
      tag;

    /*jshint validthis:true */
    for (value of this) {
      if (_.isArray(value, relaxed)) {
        yield * new ArrayGenerator(value);
      } else if (_.isString(value)) {
        yield * new StringGenerator(value);
      } else {
        tag = _.toStringTag(value);
        if (tag === $.MAPTAG) {
          yield * mapObjectGenerator(value);
        } else if (tag === $.SETTAG) {
          yield * setObjectGenerator(value);
        }
      }
    }
  }

  /*
   * reduce
   */

  /*
  _.setMethod(Reiterate, 'reduce', function (subject, callback, initialValue) {
    var object = _.requireObjectCoercible(subject),
      element,
      index;

    _.mustBeFunction(callback);
    index = 0;
    for (element of object) {
      initialValue = callback(initialValue, element, index, object);
      index += 1;
    }

    return initialValue;
  });
  */

  /*
   * forEach
   */

  /*
  _.setMethod(Reiterate, 'forEach', function (subject, callback, thisArg) {
    var object = _.requireObjectCoercible(subject),
      element,
      index;

    _.mustBeFunction(callback);
    index = 0;
    for (element of object) {
      callback.call(thisArg, element, index, object);
      index += 1;
    }
  });
  */

  /*
   * every
   */

  /*
  _.setMethod(Reiterate, 'every', function (subject, callback, thisArg) {
    var object = _.requireObjectCoercible(subject),
      result,
      element,
      index;

    _.mustBeFunction(callback);
    result = true;
    index = 0;
    for (element of object) {
      if (!callback.call(thisArg, element, index, object)) {
        result = false;
        break;
      }

      index += 1;
    }

    return result;
  });
  */
  _.setMethod(mapGenerator.prototype, 'filter', filterGenerator);
  _.setMethod(mapGenerator.prototype, 'map', mapGenerator);
  _.setMethod(mapGenerator.prototype, 'unique', uniqueGenerator);
  _.setMethod(mapGenerator.prototype, 'iterate', iterateGenerator);
  _.setMethod(mapGenerator.prototype, 'enumerate', EnumerateGenerator);
  _.setMethod(mapGenerator.prototype, 'then', then);
  _.setMethod(mapGenerator.prototype, 'toArray', toArray);
  _.setMethod(mapGenerator.prototype, 'flatten', flattenGenerator);

  _.setMethod(filterGenerator.prototype, 'filter', filterGenerator);
  _.setMethod(filterGenerator.prototype, 'map', mapGenerator);
  _.setMethod(filterGenerator.prototype, 'unique', uniqueGenerator);
  _.setMethod(filterGenerator.prototype, 'iterate', iterateGenerator);
  _.setMethod(filterGenerator.prototype, 'enumerate', EnumerateGenerator);
  _.setMethod(filterGenerator.prototype, 'then', then);
  _.setMethod(filterGenerator.prototype, 'toArray', toArray);
  _.setMethod(filterGenerator.prototype, 'flatten', flattenGenerator);

  _.setMethod(iterateGenerator.prototype, 'filter', filterGenerator);
  _.setMethod(iterateGenerator.prototype, 'map', mapGenerator);
  _.setMethod(iterateGenerator.prototype, 'unique', uniqueGenerator);
  _.setMethod(iterateGenerator.prototype, 'iterate', iterateGenerator);
  _.setMethod(iterateGenerator.prototype, 'enumerate', EnumerateGenerator);
  _.setMethod(iterateGenerator.prototype, 'then', then);
  _.setMethod(iterateGenerator.prototype, 'toArray', toArray);
  _.setMethod(iterateGenerator.prototype, 'flatten', flattenGenerator);

  _.setMethod(uniqueGenerator.prototype, 'filter', filterGenerator);
  _.setMethod(uniqueGenerator.prototype, 'map', mapGenerator);
  _.setMethod(uniqueGenerator.prototype, 'unique', uniqueGenerator);
  _.setMethod(uniqueGenerator.prototype, 'iterate', iterateGenerator);
  _.setMethod(uniqueGenerator.prototype, 'enumerate', EnumerateGenerator);
  _.setMethod(uniqueGenerator.prototype, 'then', then);
  _.setMethod(uniqueGenerator.prototype, 'toArray', toArray);
  _.setMethod(uniqueGenerator.prototype, 'flatten', flattenGenerator);

  _.setMethod(flattenGenerator.prototype, 'filter', filterGenerator);
  _.setMethod(flattenGenerator.prototype, 'map', mapGenerator);
  _.setMethod(flattenGenerator.prototype, 'unique', uniqueGenerator);
  _.setMethod(flattenGenerator.prototype, 'iterate', iterateGenerator);
  _.setMethod(flattenGenerator.prototype, 'enumerate', EnumerateGenerator);
  _.setMethod(flattenGenerator.prototype, 'then', then);
  _.setMethod(flattenGenerator.prototype, 'toArray', toArray);
  _.setMethod(flattenGenerator.prototype, 'flatten', flattenGenerator);

  return Reiterate;
}));
