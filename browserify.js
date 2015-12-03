// var becs = {
// 	EngineFactory : require('./enginefactory'),
// 	NodeFactory : require('./nodefactory'),
// 	ComponentFactory : require('./componentfactory'),
// 	SystemListFactory : require('./systemlistfactory')
// }

// module.exports.becs = becs

var EntityFactory = require('./src/entityfactory'),
	ComponentFactory = require('./src/componentfactory')


var comp1 = ComponentFactory().withName('comp1').create({foo: 10, bar: 20, baz: 'welcome'})
var comp2 = ComponentFactory().withName('comp2').create({foo: 100, bar: 200, baz: 'goodbye'})
var entity = EntityFactory().withComponents(comp1,comp2)

// var sys1 = becs.ComponentFactory().withName('mockComp1').create()
// var sys2 = becs.ComponentFactory().withName('mockComp2').create()

// console.log(sys1)
// console.log(sys2)
// console.log(sys2.type === sys1.type)



console.log(['component: ',comp1.type.name].join(''))
console.log(['component: ',comp2.type.name].join(''))
console.log('entity')
