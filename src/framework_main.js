var ComponentFactory = require('./componentfactory'),
	FamilyFactory = require('./componentmatchingfamilyfactory'),
	EngineFactory = require('./enginefactory'),
	EntityFactory = require('./entityfactory'),
	NodeFactory = require('./nodefactory'),
	NodeList = require('./nodelist'),
	NodePoolFactory = require('./nodepoolfactory'),
	SystemListFactory = require('./systemlistfactory'),
	SystemStamper = require('./systemStamper'),
	TypeStamper = require('./typeStamper')

var becs = {
	ComponentFactory: ComponentFactory,
	FamilyFactory: FamilyFactory,
	EngineFactory: EngineFactory,
	EntityFactory: EntityFactory,
	NodeFactory: NodeFactory,
	NodeList: NodeList,
	NodePoolFactory: NodePoolFactory,
	SystemListFactory: SystemListFactory,
	SystemStamper: SystemStamper,
	TypeStamper: TypeStamper
}

module.exports = becs

// var becs = require('./bundle')

// var sys1 = becs.ComponentFactory().withName('mockComp1').create()
// var sys2 = becs.ComponentFactory().withName('mockComp2').create()

// console.log(sys1)
// console.log(sys2)
// console.log(sys2.type === sys1.type)



// console.log(becs)