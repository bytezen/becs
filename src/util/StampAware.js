var stampit = require('stampit'),
	L = require('lemonad')



// module.exports = function () {
// 					var prototypeType = { name: DEFAULT_TYPE_NAME }
// 					return stampit()
// 		            		.refs({
// 		            			type: prototypeType
// 		            		})
// 							.static({
// 								type: prototypeType,
// 					            withName: function withName (name) {
// 		                              prototypeType.name = name           
// 		                              return this
// 		                          }
// 							})
// 			}

module.exports =  stampit().refs({
			        			stamp: undefined
			        		})
							.methods({
								sameStamp: function sameStamp(obj) {
									return L.existy(obj.stamp) && (this.stamp === obj.stamp)
								},	
								stampOf: function stampOf(stamp) {
									return this.stamp === stamp
								},	
								is: function is(x) {
									return this.sameStamp(x) || this.stampOf(x)
								}											
							})
							.init(function initType(params) { 
								this.stamp = params.stamp
							})
	


// var CompPrototype = module.exports
// var CompPrototype2 = module.exports
// var comp1 = CompPrototype({bar: 100, value: 'bar'})
// var comp2 = CompPrototype()
//  var comp3 = CompPrototype2()

// console.log(comp1)
// console.log(comp2.is(comp1))
// console.log(comp2.is(CompPrototype))
// console.log(comp3.is(CompPrototype2))
// console.log(comp2.sameStamp(comp3))
// console.log(CompPrototype.__proto__ === CompPrototype2.__proto__)
// console.log(CompPrototype.__proto__ === comp1.__proto__)
// console.log(comp1.hasOwnProperty('prototype'))
// console.log(comp1.__proto__ === comp2.__proto__ === comp3.__proto__)

