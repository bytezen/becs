var stampit = require('stampit'),
	Type = require('./util/').StampAware



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

module.exports = function component(config) {
						var Comp = stampit().props(config)
						return stampit.compose(Type,Comp)
					}


// var CompPrototype = module.exports({name: 'stringcomponent', value: 'bar', bar: 100})
// var CompPrototype2 = module.exports({name: 'stringcomponent', value:'foo'})
// var comp1 = CompPrototype()
// var comp2 = CompPrototype()
// var comp3 = CompPrototype2()

// console.log(comp2.is(comp1))
// console.log(comp2.is(CompPrototype))
// console.log(comp2.sameStamp(comp3))
// console.log(CompPrototype.__proto__ === CompPrototype2.__proto__)
// console.log(CompPrototype.__proto__ === comp1.__proto__)
// console.log(comp1.hasOwnProperty('prototype'))
// console.log(comp1.__proto__ === comp2.__proto__ === comp3.__proto__)

