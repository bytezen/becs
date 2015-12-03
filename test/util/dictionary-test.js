var DictionaryPrototype = require('../../bzutil/dictionary'),
	expect = require('chai').expect

describe('# Dictionary', function() {
	var webster

	before('initialize docs',function(){
		webster = DictionaryPrototype.create()
	})

	describe('# Creation',function(){
		it('# created with empty keys and values', function() {
			
			expect(webster.keys).to.be.ok
			expect(webster.keys).to.have.length(0)				
			
			expect(webster.values).to.be.ok
			expect(webster.values).to.have.length(0)
		})

	})

	describe('## Primitive Add and Retrieve ', function() {
		var numKey = 1,
			strKey = 'one',
			numVal = 100,
			strVal = "can't spell 100",
			mixKey = 2,
			mixVal = 'two'

		it('# can add entries ', function() { 

			webster.add(numKey,numVal)
			webster.add(strKey, strVal)
			webster.add(mixKey, mixVal)

			expect(webster.has(numKey)).to.be.true
			expect(webster.has(strKey)).to.be.true
			expect(webster.has(mixKey)).to.be.true
			
		})

		it('# can retrieve entries',function(){
			expect(webster.get(numKey)).to.equal(numVal)
			expect(webster.get(strKey)).to.equal(strVal)
			expect(webster.get(mixKey)).to.equal(mixVal)
		}) 	

		it('# can remove entries',function(){
			webster.remove(mixKey)
			expect(webster.has(mixKey)).to.be.false
			expect(webster.values.indexOf(mixVal)).to.be.equal(-1)

		})
	})

	describe('## Object Add and Retrieve ', function() {
		var objKey1 = {id:1},
			objVal1 = {val: 10},
			objKey2 = {id:2},
			objVal2 = {val: 20},
			objKey3 = {id:3},
			objVal3 = {val: 30}

		it('# can add entries ', function() { 
			webster.add(objKey1,objVal1)			
			webster.add(objKey2,objVal2)			
			webster.add(objKey3,objVal3)			
		})

		it('# can retrieve entries ', function() { 
			expect(webster.get(objKey1)).to.equal(objVal1)
			expect(webster.get(objKey2)).to.equal(objVal2)
			expect(webster.get(objKey3)).to.equal(objVal3)
		})
		it('# can remove entries ', function() { 
			webster.remove(objKey2)
			expect(webster.get(objKey2)).to.be.null
			expect(webster.values.indexOf(objVal2)).to.equal(-1)
		})
	})	

	describe('# Logic Testing',function(){
		it('# adding same key updates the value',function(){
			var obj = {id:1},
				val = {val: 10}
				obj2 = obj
				key1 = '2'
				key2 = '2'

			webster.add(obj,val)
			webster.add(obj2,key2)
			expect(webster.get(obj2)).to.equal('2')
			
			webster.add(key1,obj)
			webster.add('2','test')
			expect(webster.get('2')).to.equal('test')
		})

		it('# forEach iterates over every pair in the dictionary',function(){
			var keys = [], values = []
			webster.forEach( function(k,v) {
				keys.push(k)
				values.push(v)
			})

			webster.keys.forEach(function(k){
				expect(keys).to.contain(k)
			})

			webster.values.forEach(function(v){
				expect(values).to.contain(v)
			})			
		})  		
	})

/*	
	it('',function(){
		throw Error('not implemented')
	}) 
	it('',function(){
		throw Error('not implemented')
	}) 
	it('',function(){
		throw Error('not implemented')
	}) 
	it('',function(){
		throw Error('not implemented')
	}) 
	it('',function(){
		throw Error('not implemented')
	}) 
*/	
})