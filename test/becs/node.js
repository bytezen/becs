var becs_path = '../../src/',
    becs = require(becs_path),
	expect = require('chai').expect,
	NodeFactory = becs.NodeFactory,
	EntityPrototype = becs.EntityFactory(),
	ComponentFactory = becs.ComponentFactory


describe('# Node Test',function(){
	var mockNode

	it('can create a default node with default name',function(){
		var node = NodeFactory().create()
		expect(node).to.exist
		expect(node.type).to.exist
		expect(node.type.name).to.equal('AnonymousNodeFactory')
	})


	it('default nodes should not have the same type',function() {
		var mock1 = NodeFactory().create(),
			mock2 = NodeFactory().create()

			expect(mock1.type).to.not.equal(mock2.type)
	})	

	it('can create a node with family using fluent style',function(){		
		var ComponentPrototype = ComponentFactory().withName('Comp1').props({foo: 'foo'})
			mockcomponent = ComponentPrototype.create()

		mockNode = NodeFactory().withName('lymphNode').withComponentTypes(mockcomponent.type).create()		

		expect(mockNode.type.name).to.equal('lymphNode')
		expect(mockNode.componentTypes).to.contain(mockcomponent.type)
	})

	it('can create a nodes with different types',function(){		
		mockNode = NodeFactory().withName('lymphNode').create()
		mockNode2 = NodeFactory().withName('soreNode').create()
		expect(mockNode.type.name).to.not.equal(mockNode2.type.name)
	})

	it('can store and retrieve and entity', function() {
		var mockEntity = EntityPrototype.create(),
		node = NodeFactory().create()
		node.entity = mockEntity

		expect(node.entity).to.exist
		expect(node.entity).to.equal(mockEntity)
	})

	// it('can inherit component properties from entity', function(){
	// 	var ComponentPrototype = ComponentFactory().withName('Comp1').props({foo: 'foo'}),
	// 		ComponentPrototype2 = ComponentFactory().withName('Comp2').props({bar: 'bar'}),
	// 		ComponentPrototype3 = ComponentFactory().withName('Comp3').props({bar: [1,2,3]})

	// 		comp1 = ComponentPrototype.create()
	// 		comp2 = ComponentPrototype2.create()
	// 		comp3 = ComponentPrototype3.create()

	// 	var mockEntity = EntityPrototype.withComponents([comp1,comp2,comp3]).create()
	// 	var node = NodeFactory().create()
	// 	node.entity = mockEntity

	// 	console.log(mockEntity)

	// })
})