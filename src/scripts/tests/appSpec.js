describe('App', function () {
	var CC = window.CC;

	describe("Global object", function(){
		it("Should be defined", function(){
			expect(CC).toBeDefined();
		});
		it("Should be a function", function () {
			expect(CC).toEqual(jasmine.any(Function));
		});
		it("Should return an new object", function () {
			expect(CC(document)).toEqual(jasmine.any(Object));
		});
		it("Should have an extend method", function(){
			expect(CC.extend).toBeDefined();
		});
		it("Should have a register module method", function(){
			expect(CC.registerModule).toBeDefined();
		});
	});

	describe("CC Object", function() {
		// it("Should have a splice method", function(){
		// 	expect(CC(document).splice).toBeDefined();
		// });
		it("Should have an makeArray method", function(){
			expect(CC(document).makeArray).toBeDefined();
		});
		it("Should have a merge method", function(){
			expect(CC(document).merge).toBeDefined();
		});
		it("Should have an isArrayLike method", function(){
			expect(CC(document).isArrayLike).toBeDefined();
		});
	});


	describe("Register Module", function(){
		var registerModule = CC.registerModule;

		it("Should define a property on the modules object", function(){
			expect(CC.modules["moduleName"]).not.toBeDefined();
			registerModule("moduleName", function(){});
			expect(CC.modules["moduleName"]).toBeDefined();
		});
		it("it should throw an error if the first argument is not a string", function(){
			expect(registerModule.bind(null, 123, function(){})).toThrow();
		});
		it("it should throw an error if the second argument is not a function", function(){
			expect(registerModule.bind(null, "moduleName", 'not a function')).toThrow();
		});
	});

	describe("makeArray method", function(){
		var makeArray = CC.makeArray;
		var node = document.createElement('div');

		node.appendChild(document.createElement('div'));

		it("Should return an array", function(){
			expect( makeArray(['foo']) ).toEqual( jasmine.any( Array ) );
		});
		// TODO: further tests needed
	});

	describe("merge", function(){
		var merge = CC.merge;
		it("Should merge two arrays", function(){
			expect(merge([1,2,3], [4,5,6])).toEqual([1,2,3,4,5,6]);
			expect(merge(['foo'], ['bar'])).toEqual(['foo', 'bar']);
		});
	});

	// TODO: makeObject

	describe("Extend", function(){

		it("Should extend this if single object supplied", function(){
			CC['foo'] = 'bar';
			expect(CC['foo']).toBe('bar');
			CC.extend({'foo': 'wah'});
			expect(CC['foo']).toBe('wah');
		});

		it("Should combine the properties of two objects", function(){
			expect(CC.extend({'foo': 'bar'}, {'woo': 'wah'})).toEqual({'foo': 'bar', 'woo': 'wah'});
		});

		it("Should combine the properties of three objects", function(){
			expect(CC.extend( {'woo': 'wah'}, {'foo': 'bar'}, {'foo': 'hah'})).toEqual({'foo': 'hah', 'woo': 'wah'});
		});

		it("Should combine the properties of four objects", function(){
			expect(CC.extend( {'woo': 'wah'}, {'foo': 'bar'}, {'foo': 'hah'}, {'doo': 'dah'})).toEqual({'foo': 'hah', 'woo': 'wah', 'doo': 'dah'});
		});

		it("Should combine the properties of multiple objects", function(){
			expect(CC.extend({'foo': 'bar'}, {'woo': 'wah'}, {'foo': 'car'}, {'hee': 'hah'}, {'wee': 'wah'})).toEqual({'foo': 'car', 'woo': 'wah', 'hee': 'hah', 'wee': 'wah'});
		});

		it("Should overwrite the values of matching property names", function(){
			expect(CC.extend({'foo': 'bar'}, {'foo': 'nah'})['foo']).toBe('nah');
			expect(CC.extend({'foo': 'nah'}, {'foo': 'bar'})['foo']).toBe('bar');
		});
	});

	describe("isArrayLike", function(){
		var isArrayLike = CC.isArrayLike;
		var div = document.createElement('div');
			div.appendChild(document.createElement('div'));

		it("Should return false if passed undefined", function(){
			expect(isArrayLike('')).toBe(false);
		});
		// it("Should return false if passed null", function(){
		// 	expect(isArrayLike(null)).toBe(false);
		// });
		// it("Should return false if passed a Function", function(){
		// 	expect(isArrayLike(function(){})).toBe(false);
		// });
		// it("Should return false if passed an instance of window", function(){
		// 	expect(isArrayLike(window)).toBe(false);
		// });
		// it("Should return false if passed a number", function(){
		// 	expect(isArrayLike(123)).toBe(false);
		// 	expect(isArrayLike(0.123)).toBe(false);
		// });
		// it("Should return false if passed a string", function(){
		// 	expect(isArrayLike('foobar')).toBe(false);
		// 	expect(isArrayLike('123')).toBe(false);
		// 	expect(isArrayLike('')).toBe(false);
		// });
		// it("Should return true if passed an array", function(){
		// 	expect(isArrayLike([])).toBe(true);
		// 	expect(isArrayLike(['foo'])).toBe(true);
		// 	expect(isArrayLike(['foo','bar'])).toBe(true);
		// });
		// it("Should return true if passed a nodelist", function(){
		// 	expect(isArrayLike(div.querySelectorAll('div'))).toBe(true);
		// });
	});

	describe("isEmptyObject", function(){
		var isEmptyObject = CC.isEmptyObject;

		it("Should return true for an empty object", function(){
			expect(isEmptyObject({})).toBe(true);
		});
		it("Should return false for a non-empty object", function(){
			expect(isEmptyObject({'foo': 'bar'})).toBe(false);
		});
		it("Should throw an error if passed a non-object", function(){
			expect(isEmptyObject.bind(null, ['array'])).toThrow();
			expect(isEmptyObject.bind(null, 'string')).toThrow();
			expect(isEmptyObject.bind(null, 123)).toThrow();
		});
	});
});