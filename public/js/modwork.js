/*!
 * modwork version: 1.0.0
 * 
 * Copyright 2014  
 * Distributed under the  license
 * https://github.com/mawaha/module-sandbox
 */
/* Polyfills */
if(!Array.isArray) {
	Array.isArray = function(arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}

(function(window, document, undefined){
	"use strict";

	var modules = {};

	/**
	 * CC object factory
	 *
	 * @param {[type]}   scope   [description]
	 * @param {[type]}   dependencies [description]
	 * @param {Function} fn      [description]
	 */
	var CC = function(scope, dependencies, fn){
		return new Init(scope).initModules(dependencies, fn);
	};

	/**
	 * The CC object constructor function
	 *
	 * @param {NodeList} scope [description]
	 */
	var Init = function(scope){

		return this.makeArray(scope);
	};

	/**
	 * Initialise modules
	 *
	 * @param  {String|Array|Object} 	dependencies
	 * @param  {Function} 				fn 				[The sandbox function]
	 * @return {Object}					this
	 */
	var initModules = function( plugins, fn ){

		var module;

		// Plugins is either a string, an array, or an object.
		// Objects may hold additional options for plugin
		plugins = makeObject(plugins);

		// No specified plugins means add all
		// with no additional options
		if (isEmptyObject(plugins)){
			for (module in modules){
				if (modules.hasOwnProperty(module)){
					plugins[module] = {};
				}
			}
		}

		// Invoke required modules
		// Passing in any additional options
		// Returns modules public methods
		for(module in plugins){
			plugins[module] = modules[module].call(this, plugins[module]);
		}

		// Sandbox
		if(fn && typeof fn === 'function'){
			injectDependencies(plugins, fn).call(this);
		}

		return this;
	};

	/**
	 * Returns a callback with dependencies applied
	 *
	 * @param  {Object}   obj Contains optional dependencies
	 * @param  {Function} fn  The function to which dependencies should be applied
	 * @return {Function}	  Callback
	 */
	var injectDependencies = function (obj, fn) {
		var str = fn.toString(),  // Be Aware: Non-standard functionality
			regex = /\(([^)]+)/,
			args = [],
			dependencies;

		if ((dependencies = regex.exec(str)[1]))
		{
			dependencies = dependencies.split(/\s*,\s*/);

			for (var i = dependencies.length - 1; i >= 0; i--) {
				if (obj[dependencies[i]])
				{
					args[i] = obj[dependencies[i]];
				}
			}
		}
		return function(){
			fn.apply(this, args);
		};
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
			return makeObject(result);
		}

		if (obj && toClass === '[object String]'){
			return makeObject(obj.split(' '));
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

		version: "0.0.1",
		description: "",
		registerModule: registerModule
	});

	Init.prototype = {

		initModules: initModules,
		merge: merge,
		makeArray: makeArray,
		isArrayLike: isArrayLike,
		extend: extend
	};

	window.CC = CC;

})(this, this.document);
(function($){
	CC.registerModule("clearfield", function(options){

		var methods, settings, onBlur, onFocus;

		options = options || [];

		settings = CC.extend({
			target: '[data-clearfield]'
		}, options);

		onFocus = function() {
			if (this.defaultValue === this.value) {
				this.value = '';
			}
		};
		onBlur = function() {
			if (!this.value.length) {
				this.value = this.defaultValue;
			}
		};
		var stuff = $(settings.target).focus(onFocus).blur(onBlur);

		return {
			clearAll: function(){
				$(settings.target).each(function(){
					this.value = '';
				});
			}
		};
	});
})(jQuery);