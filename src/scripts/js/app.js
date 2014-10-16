(function($, window, document, undefined){
	"use strict";

	var modules = {};

	/**
	 * CC object factory
	 *
	 * @param {[type]}   scope   [description]
	 * @param {[type]}   plugins [description]
	 * @param {Function} fn      [description]
	 */
	var CC = function(scope, plugins, fn){
		return new Init(scope); //.initModules(plugins, fn);;
	};

	/**
	 * The CC object constructor function
	 * @param {NodeList} scope [description]
	 */
	var Init = function(scope){

		return this.makeArray(scope);
	};

	/**
	 * Initialise modules
	 *
	 * @param  {String|Array|Object}   plugins [description]
	 * @param  {Function} fn      [description]
	 * @return {[type]}           [description]
	 */
	var initModules = function( plugins, fn ){

		var required, module, methods;

		// Plugins is either a string, an array, or an object.
		required = CC.makeObject(plugins);

		// No specified plugins means add all modules
		if (CC.isEmptyObject(required)){
			required = {};
			for (module in modules){
				if (modules.hasOwnProperty(module)){
					required[module] = {};
				}
			}
		}

		// Invoke required modules
		// Modules return public methods
		// to interact with
		methods = {};
		for(module in required){
			methods[module] = modules[module].call(this, required[module]);
		}

		// Sandbox
		if(fn && typeof fn === 'function'){
			injectDependencies(methods, fn).call(this);
		}

		return this;
	};

	/**
	 * [registerModule description]
	 *
	 * @param  {String}   name The module name for reference
	 * @param  {Function} fn   A function to be run on module initialisation
	 */
	var registerModule = function(name, fn){
		if(Object.prototype.toString.call(name) !== "[object String]")
		{
			throw new Error("The first argument for registerModule is your module name and should be a string");
		}
		if(Object.prototype.toString.call(fn) !== "[object Function]")
		{
			throw new Error("The second argument for registerModule is a callback and should be a function");
		}
		modules[name] = fn;
	};

	/**
	 * Returns true if properties can be enumerated using
	 * the length property
	 *
	 * The only native, array-like objects are strings,
	 * however these are excluded for the purposes of
	 * this app.
	 *
	 * @param  {obj}  obj [Object to be enumerated]
	 * @return {Boolean}
	 */
	var isArrayLike = function(){
		var obj, length, type, i;
		obj = arguments[0];
		length = obj.length;
		type = Object.prototype.toString.call(obj);

		if(type === '[object Array]' || length && typeof length === 'number' && type !== '[object String]')
		{
			return true;
		}
		return false;
	};


	/**
	 * Returns true if object is empty
	 *
	 * @param  {Object}  obj
	 * @return {Boolean}
	 */
	var isEmptyObject = function(obj){
		var prop;

		if (obj.toString() !== '[object Object]'){
			throw new Error('isEmptyObject requires first argument to be an Object');
		}
		for (prop in obj){
			if (obj.hasOwnProperty(prop)){
				return false;
			}
		}
		return true;
	};

	/**
	 * Converts to array
	 *
	 * @return {[type]}
	 */
	var makeArray = function(){

		var result, arr, i;

		result = this || [];
		i = 0;
		if (arguments.length > 1){
			result = arguments[i];
			i += 1;
		}
		arr = arguments[i];

		if (arr){
			if (isArrayLike(arr)){
				merge(result, arr);
			} else {
				[].push.call(result, typeof arr === 'string' ? [arr] : arr);
			}
		}
		return result;
	};

	/**
	 * Recursively converts Strings to Arrays to Objects
	 *
	 * @param  {String|Array|Object} obj
	 * @return {Object}
	 */
	var makeObject = function(obj){

		var result, i, toClass;

		result = {};

		toClass = Object.prototype.toString.call(obj);

		// return toClass === '[object Object]' ? obj :
		// 	toClass === '[object Array]' ? makeObject() :
		// 	toClass === '[object String]' ? makeObject(obj.split())

		if (toClass === '[object Object]'){
			return obj;
		}

		if (toClass === '[object Array]'){
			i = obj.length;
			while (i--){
				result[obj[i]] = {};
			}
			return CC.makeObject(result);
		}

		if (obj && toClass === '[object String]'){
			return CC.makeObject(obj.split(' '));
		}

		return {};
	};

	/**
	 * Stolen wholesale from jQuery
	 *
	 * @param  {[type]} first  [description]
	 * @param  {[type]} second [description]
	 * @return {[type]}        [description]
	 */
	var merge = function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	};

	/**
	 * Recursively merges any number of objects into the first.
	 *
	 * If no second argument supplied then merges with 'this'.
	 *
	 * @param  {Object} [obj [, obj2]] [Multiple Objects]
	 * @return {[type]}     [description]
	 */
	var extend = function(secondary){

		var args, primary, prop, i;

		args = Array.prototype.slice.call(arguments, 0);

		primary = this;
		if (arguments.length > 1){
			primary = args.shift();
			secondary = extend.apply(secondary, args);
		}

		for (prop in secondary){
			if (secondary.hasOwnProperty(prop)){
				primary[prop] = secondary[prop];
			}
		}
		return primary;
	};

	CC.extend = extend;

	CC.extend({
		/* test-code */
		modules: modules,
		Init: Init,
		merge: merge,
		isArrayLike: isArrayLike,
		isEmptyObject: isEmptyObject,
		makeArray: makeArray,
		/* end-test-code */
		registerModule: registerModule
	});

	Init.prototype = {
		/* test-code */
		// modules: modules,
		/* end-test-code */

		merge: merge,
		makeArray: makeArray,
		isArrayLike: isArrayLike,
		extend: extend
	};

	window.CC = CC;

})(jQuery, this, this.document);

// /* Polyfills */
// if(!Array.isArray) {
//   Array.isArray = function(arg) {
//     return Object.prototype.toString.call(arg) === '[object Array]';
//   };
// }

// (function($, window, document, undefined) {

// 	var modules = {};

// 	/**
// 	 * Returns true if object has array like properties
// 	 *
// 	 * Borrowed from jQuery
// 	 * Functions return false
// 	 *
// 	 * @return {boolean}
// 	 */
// 	var isArrayLike = function(obj){
// 		var length = obj.length,
// 			type = jQuery.type( obj );

// 		if ( type === "function" || jQuery.isWindow( obj ) ) {
// 			return false;
// 		}

// 		if ( obj.nodeType === 1 && length ) {
// 			return true;
// 		}

// 		return type === "array" || length === 0 ||
// 			typeof length === "number" && length > 0 && ( length - 1 ) in obj;
// 	};

// 	/**
// 	 * Passes a callback with dependencies applied
// 	 *
// 	 * @param  {Object}   obj Contains optional dependencies
// 	 * @param  {Function} fn  The function to which dependencies should be applied
// 	 * @return {Function}	  Callback
// 	 */
// 	var injectDependencies = function (obj, fn) {
// 		var str = fn.toString(),  // Be Aware: Non-standard functionality
// 			regex = /\(([^)]+)/,
// 			args = [],
// 			dependencies;

// 		if ((dependencies = regex.exec(str)[1]))
// 		{
// 			dependencies = dependencies.split(/\s*,\s*/);

// 			for (var i = dependencies.length - 1; i >= 0; i--) {
// 				if (obj[dependencies[i]])
// 				{
// 					args[i] = obj[dependencies[i]];
// 				}
// 			}
// 		}
// 		return function(){
// 			fn.apply(this, args);
// 		};
// 	};

// 	/**
// 	 * The base constructor function
// 	 */
// 	var CC = (function(){

// 		var CC = function( scope, plugins, fn ){
// 			return new CC.prototype.init( scope ).initModules( plugins, fn );
// 		};

// 		// Expose CC constructor
// 		return (window.CC = CC);
// 	})();

// 	CC.prototype = {

// 		name: "Carbon Crayon",
// 		description: "Module Framework",
// 		version: "0.0.1",

// 		// Invoke modules
// 		initModules: function( plugins, fn ){

// 			var required, module, methods;

// 			// Plugins is either a string, an array, or an object.
// 			required = CC.makeObject(plugins);

// 			// No specified plugins means add all modules
// 			if (CC.isEmptyObject(required)){
// 				required = {};
// 				for (module in modules){
// 					if (modules.hasOwnProperty(module)){
// 						required[module] = {};
// 					}
// 				}
// 			}

// 			// Invoke required modules
// 			// Modules return public methods
// 			// to interact with
// 			methods = {};
// 			for(module in required){
// 				methods[module] = modules[module].call(this, required[module]);
// 			}

// 			// Sandbox
// 			if(fn && typeof fn === 'function'){
// 				injectDependencies(methods, fn).call(this);
// 			}

// 			return this;
// 		},

// 		/**
// 		 * Creates an array from passed in arguments or merges arraylike objects.
// 		 *
// 		 * If single argument is passed, argument is merged with 'this'
// 		 * If multiple arguments are passed, each is merged with the first
// 		 *
// 		 * @return {[type]}
// 		 */
// 		makeArray: function(){

// 			var obj, args, i, j;

// 			obj = this || [];

// 			i = 0;
// 			if (arguments.length > 1){
// 				obj = arguments[i];
// 				i += 1;
// 			}
// 			// Items to be merged into obj
// 			args = Array.prototype.slice.call(arguments, i);

// 			obj.length = 0;

// 			if (args[0]){
// 				if ( isArrayLike( Object(args[0]) ) ){
// 					jQuery.merge( ret,
// 						typeof obj === "string" ?
// 						[ obj ] : obj
// 					);
// 				} else { // function or node
// 					// TODO: Make handle multiple args
// 					Array.prototype.push.call(obj, args[0]);
// 				}
// 			}

// 			return obj;
// 		},

// 		/**
// 		 * Wrapper for the static extend method
// 		 *
// 		 * @return {[type]} [description]
// 		 */
// 		extend: function(){
// 			return CC.extend.apply( Array.prototype.slice.call( arguments ) );
// 		},

// 		/**
// 		 * Gives our CC object array like powers!
// 		 *
// 		 * Causes Chrome devtools and Firebug to format object as
// 		 * an array type object in console.
// 		 *
// 		 * @type {Function}
// 		 */
// 		splice: [].splice
// 	};

// 	/**
// 	 * The main CC object constructor function
// 	 *
// 	 * @param  {[type]} scope [description]
// 	 * @return {[type]}       [description]
// 	 */
// 	var init = CC.prototype.init = function(scope){
// 		return this.makeArray(scope);
// 	};
// 	init.prototype = CC.prototype;

// 	// Static Methods

// 	/**
// 	 * [extend description]
// 	 * @param  {[type]} obj [description]
// 	 * @return {[type]}     [description]
// 	 */
// 	CC.extend = function(){

// 		var prop, obj, target, i;

// 		i = 0;
// 		target = this;
// 		if (arguments.length > 1){
// 			target = arguments[i];
// 			i += 1;
// 		}
// 		obj = arguments[i] || {};

// 		// Shallow copy
// 		for (prop in obj){
// 			if (obj.hasOwnProperty( prop )){
// 				target[prop] = obj[prop];
// 			}
// 		}

// 		return target;
// 	};

// 	CC.extend({

// 		/**
// 		 * Adds new module functions to the modules object
// 		 *
// 		 * @param  {[type]}   name
// 		 * @param  {Function} fn
// 		 * @return {[type]}
// 		 */
// 		registerModule: function(name, fn){
// 			modules[name] = fn;
// 		},

// 		/**
// 		 * Recursively converts Strings to Arrays to Objects
// 		 *
// 		 * @param  {String|Array|Object} obj
// 		 * @return {Object}
// 		 */
// 		makeObject: function(obj){

// 			var result, i, toClass;

// 			result = {};

// 			toClass = Object.prototype.toString.call(obj);

// 			// return toClass === '[object Object]' ? obj :
// 			// 	toClass === '[object Array]' ? makeObject() :
// 			// 	toClass === '[object String]' ? makeObject(obj.split())

// 			if (toClass === '[object Object]'){
// 				return obj;
// 			}

// 			if (toClass === '[object Array]'){
// 				i = obj.length;
// 				while (i--){
// 					result[obj[i]] = {};
// 				}
// 				return CC.makeObject(result);
// 			}

// 			if (obj && toClass === '[object String]'){
// 				return CC.makeObject(obj.split(' '));
// 			}

// 			return {};
// 		},

// 		/**
// 		 * Returns true if object is empty
// 		 *
// 		 * @param  {Object}  obj
// 		 * @return {Boolean}
// 		 */
// 		isEmptyObject: function(obj){
// 			var prop;
// 			for (prop in obj){
// 				if (obj.hasOwnProperty(prop)){
// 					return false;
// 				}
// 			}
// 			return true;
// 		},

// 		slice: Function.prototype.call.bind( Array.prototype.slice )
// 	});

// 	// Convenience wrapper
// 	// Avoids writing a selector engine O_o
// 	$.fn.cc = function () {

// 		var args = Array.prototype.slice.call( arguments, 0 );

// 		return this.each(function(){

// 			// Prepend DOM node as scope
// 			CC.apply(CC, [this].concat( args ));
// 		});
// 	};

// })( jQuery, this, this.document );