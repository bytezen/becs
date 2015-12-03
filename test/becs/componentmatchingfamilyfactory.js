var becs_path = '../../src/',
	becs = require(becs_path),
	expect = require('chai').expect,
	MockData = require('./data/mocks'),
	FamilyFactory = becs.FamilyFactory,
	NodeFactory = becs.NodeFactory,
	ComponentFactory = becs.ComponentFactory,
	EntityFactory = becs.EntityFactory,
	EntityPrototype = EntityFactory()



describe('# Component Matching Family',function(){
	var family

	// beforeEach('',function(){
	// 	FamilyPrototype = FamilyFactory({name:'miFamilia'})
	// 	family = FamilyPrototype.create()
	// })

	it('creates a default named family', function(){
		family = FamilyFactory()
						.withNodePrototype( NodeFactory() )
						.create()
		// family = FamilyPrototype.create()
		expect(family.type).to.exist
		expect(family.type.name).to.equal('AnonymousMatchingFamily')
		expect(family.nodePrototype).to.be.ok
		expect(family.nodePool).to.be.ok

	})	

	it('uses fluent style naming', function(){
		family = FamilyFactory()
					.withName('miFamilia')
					.withNodePrototype( NodeFactory())
					.create()		
		expect(family.type.name).to.equal('miFamilia')		
	})	

	it('uses fluent style typing', function(){
		var MockNodePrototype = NodeFactory()
		var node = MockNodePrototype.create()

		family = FamilyFactory().withNodePrototype( MockNodePrototype )

		expect(family.nodePrototype).to.equal( MockNodePrototype)		

	})

	it('family created with empty nodelist', function(){
		var ComponentPrototype = ComponentFactory().withName('comp1').props({foo:'foo'})
		var MockNodePrototype = NodeFactory().withName('Comp1Node').withComponentTypes(ComponentPrototype.type)

		family = FamilyFactory().withNodePrototype(MockNodePrototype).create()	

		expect(family.nodelist.head).to.not.be.ok		
	})

	it('can create and access a component type', function(){
		var MockComp1Prototype = ComponentFactory()
								.withName('comp1')
								.props({foo:1, bar: 2}),
			mockcomponent1 = MockComp1Prototype.create(),
			MockComp2Prototype = ComponentFactory()
								.withName('comp2')
								.props({
									foo:[1,2,3], 
									bar:{ foo: 3, 
										  bar: 'bar'}
								}), 
			mockcomponent2 = MockComp2Prototype.create()

			MockNodePrototype = NodeFactory()
							.withName('mocknode')
							.withComponentTypes( MockComp1Prototype.type ,MockComp2Prototype.type )
							

			family = FamilyFactory().withNodePrototype( MockNodePrototype ).create()

			expect(family.componentMap.get(mockcomponent1.type)).to.be.ok
			expect(family.componentMap.get(mockcomponent2.type)).to.be.ok

	})

	it('can create a family from a node', function(){
		var node = MockNodePrototype.create(),
			family = FamilyFactory().withNodePrototype( MockNodePrototype ).create(),
			family2 = FamilyFactory().withNodePrototype( node.stamp ).create(),
			keys = family.componentMap.keys,
			keys2 = family.componentMap.keys

			keys.forEach(function(k,i){
				expect( k ).to.equal( keys2[i] )
				expect( family.componentMap.get( k ) ).to.equal( family2.componentMap.get( keys2[i] ))
			})
	})

	it('adds the correct entity to the family nodelist', function() {
		var mockFamily,
			ComponentPrototype1 = ComponentFactory().withName('comp1').props({foo: 23}), 
			ComponentPrototype2 = ComponentFactory().withName('comp2').props({bar:'something'}), 
			ComponentPrototype3 = ComponentFactory().withName('comp3'), 

			component1 = ComponentPrototype1.create(),	
			component2 = ComponentPrototype2.create(),
			component3 = ComponentPrototype3.create(),

			MockNodePrototype = NodeFactory()
							.withName('Comp1Comp2Node')
							.withComponentTypes([ ComponentPrototype1.type, ComponentPrototype2.type]),
			mockNode = MockNodePrototype.create()

		mockFamily = FamilyFactory()
						.withName('Comp1Comp2Family')
						.withNodePrototype( MockNodePrototype )
						.create()								
		
		entity = EntityFactory().withComponents( [component1, component2] ).create()

		mockFamily.newEntity(entity)
		expect(mockFamily.nodelist.head.entity).to.equal(entity)

	})

	it('can add and access single entity',function(){
		var stringNodePrototype = MockData.nodePrototypes[1],
			stringEntity = MockData.entities[1]

		family = FamilyFactory().withNodePrototype( stringNodePrototype ).create()
		family.newEntity( stringEntity )				

		expect(family.nodelist.head.entity).to.equal( stringEntity )
		expect(family.nodelist.tail.entity).to.equal( stringEntity )
	})

	it('can add and access second entity',function(){
		var stringNodePrototype = MockData.nodePrototypes[1],
			stringEntity = MockData.entities[1],			
			stringEntity1 = MockData.entities[2],
			

		family = FamilyFactory().withNodePrototype( stringNodePrototype ).create()
		family.newEntity( stringEntity )		
		family.newEntity( stringEntity1 )

		expect(family.nodelist.head.entity).to.equal( stringEntity )
		expect(family.nodelist.tail.entity).to.equal( stringEntity1 )
	})

	it('will not add entity that does not have matching components',function(){
		var stringNodePrototype = MockData.nodePrototypes[1],
			stringObjectNodePrototype = MockData.nodePrototypes[2],
			stringEntity = MockData.entities[1],
			numberEntity = MockData.entities[0]

		family = FamilyFactory().withNodePrototype( stringNodePrototype ).create()
		family.newEntity( stringEntity )
		family.newEntity( numberEntity )

		expect(family.nodelist.head.entity).to.equal( stringEntity )
		expect(family.nodelist.tail.entity).to.equal( stringEntity )

		family = FamilyFactory()
					.withName( 'StringObjectNode')
					.withNodePrototype( stringObjectNodePrototype ).create()

		family.newEntity( stringEntity )

		expect(family.nodelist.head).to.be.null
	})

    it('node Contains Entity Properties', function() {
    	var numberObjectNodePrototype = MockData.nodePrototypes[4],
    		numberObjectEntity = MockData.entities[4]
    		NodeProperties = []

    		numberObjectNodePrototype.componentTypes.forEach(function (t) {
    			NodeProperties.push(t.name)
    		})


		family = FamilyFactory().withNodePrototype( numberObjectNodePrototype ).create()
		family.newEntity( numberObjectEntity )
		var nodelist = family.nodelist,
			node = nodelist.head

		expect(NodeProperties.every(function(prop){
										return node.hasOwnProperty(prop)
									})
									).to.be.true
    })

    it('matching Entity Is Added When Component Added', function() {
		var UniversalNodePrototype = MockData.nodePrototypes[3],
			stringComp = MockData.components[0],
			numberComp = MockData.components[2],
			objectComp = MockData.components[5],
			blankEntity = EntityFactory().create()

// [stringComp,
// 				 stringComp1, 
// 				 numberComp, 
// 				 numberComp1, 
// 				 numberComp2, 
// 				 objComp],

		family = FamilyFactory().withNodePrototype( UniversalNodePrototype ).create()
		expect(family.nodelist.head).to.be.null
		
		family.newEntity( blankEntity )

		
		blankEntity.add( stringComp )
		family.componentAddedToEntity( blankEntity, stringComp.type )

		blankEntity.add( numberComp )
		family.componentAddedToEntity( blankEntity, numberComp.type )

		blankEntity.add( objectComp )
		family.componentAddedToEntity( blankEntity, objectComp.type )
		expect(family.nodelist.head.entity).to.equal( blankEntity )
		expect(family.nodelist.tail.entity).to.equal( blankEntity )

    })

    it('nonMatchingEntityIsNotAddedWhenComponentAdded', function(){
		var UniversalNodePrototype = MockData.nodePrototypes[3],
			stringComp = MockData.components[0],
			numberComp = MockData.components[2],
			objectComp = MockData.components[5],
			blankEntity = EntityFactory().create()


		family = FamilyFactory().withNodePrototype( UniversalNodePrototype ).create()
		expect(family.nodelist.head).to.be.null
		
		family.newEntity( blankEntity )
		expect(family.nodelist.head).to.be.null
		
		blankEntity.add( stringComp )
		family.componentAddedToEntity( blankEntity, stringComp.type )
		expect(family.nodelist.head).to.be.null    	

    })

    it('entity is removed nodelist when it is first', function() {
		var StringNodePrototype = MockData.nodePrototypes[1],		
			stringEntity = MockData.entities[1],
			stringEntity1 = MockData.entities[2]

		family = FamilyFactory().withNodePrototype( StringNodePrototype ).create()

		family.newEntity( stringEntity )
		expect(family.nodelist.head.entity).to.be.equal( stringEntity )    	
		expect(family.nodelist.tail.entity).to.be.equal( stringEntity )    	

		family.removeEntity( stringEntity )		
		expect(family.nodelist.head).to.be.null
		expect(family.nodelist.tail).to.be.null

		family.newEntity( stringEntity )
		family.newEntity( stringEntity1 )

		family.removeEntity( stringEntity )

		expect(family.nodelist.head.entity).to.equal(stringEntity1)
		expect(family.nodelist.tail.entity).to.equal(stringEntity1)

    })

    it('entity is removed from nodelist when it is second', function(){
		var StringNodePrototype = MockData.nodePrototypes[1],
			stringEntity = MockData.entities[1],
			stringEntity1 = MockData.entities[2]

		family = FamilyFactory().withNodePrototype( StringNodePrototype ).create()

		family.newEntity( stringEntity )
		family.newEntity( stringEntity1 )

		expect(family.nodelist.head.entity).to.be.equal( stringEntity)    	
		expect(family.nodelist.tail.entity).to.be.equal( stringEntity1 )    	

		family.removeEntity( stringEntity1 )		    	
		expect(family.nodelist.head.entity).to.be.equal( stringEntity )    	
		expect(family.nodelist.tail.entity).to.be.equal( stringEntity )    	

    })

    it('entity is removed when component in family is removed ', function(){
		var NumberObjectNodePrototype = MockData.nodePrototypes[4],
			numberComp = MockData.components[3],
			objectComp = MockData.components[5],
			numberObjectEntity = MockData.entities[4]


		family = FamilyFactory().withNodePrototype( NumberObjectNodePrototype ).create()
		family.newEntity( numberObjectEntity )

		expect(family.nodelist.head.entity).to.equal( numberObjectEntity )
		expect(family.nodelist.tail.entity).to.equal( numberObjectEntity )

		numberObjectEntity.remove( numberComp )
		family.componentRemovedFromEntity( numberObjectEntity, numberComp )

		expect(family.nodelist.head).to.be.null
		expect(family.nodelist.tail).to.be.null


    })

    it('nodeList Contains Only Matching Entities', function(){
		var StringNodePrototype = MockData.nodePrototypes[1],
			nameNumberEntity = MockData.entities[3], 
			stringEntity = MockData.entities[1],  
			stringEntity1 = MockData.entities[2],    	
    		family = FamilyFactory().withNodePrototype( StringNodePrototype ).create()
    	
    	//MockData.entities has 3 entities with String components
    	MockData.entities.forEach(function (e){
    								family.newEntity(e)
    							})

    	var nodelist = family.nodelist,
    		nodeIter = nodelist.head,
    		count = 0

    	for( ;nodeIter; nodeIter = nodeIter.next) {
    		count++
    		
    		expect( [nameNumberEntity, stringEntity, stringEntity1] ).to.include(nodeIter.entity)
    	}

    	expect(count).to.equal(3)


    })

	it('nodeList Contains Only Matching Entities When Component Removed', function(){
		var StringNodePrototype = MockData.nodePrototypes[1],
			StringComponentType = MockData.components[1].type
			nameNumberEntity = MockData.entities[3], 
			stringEntity = MockData.entities[1],  
			stringEntity1 = MockData.entities[2],    	
    		family = FamilyFactory().withNodePrototype( StringNodePrototype ).create()
    	
    	//MockData.entities has 3 entities with String components
    	MockData.entities.forEach(function (e){
    								family.newEntity(e)
    							})

    	var nodelist = family.nodelist,
    		nodeIter = nodelist.head,
    		count = 0

    	for( ;nodeIter; nodeIter = nodeIter.next) {
    		count++
    		
    		expect( [nameNumberEntity, stringEntity, stringEntity1] ).to.include(nodeIter.entity)
    	}

    	expect(count).to.equal(3)

    	var compToRemove = stringEntity.get( StringComponentType )
    	stringEntity.remove(compToRemove)

    	count = 0
    	nodeIter = nodelist.head
    	for( ;nodeIter; nodeIter = nodeIter.next) {
    		count++    	
    		expect( [nameNumberEntity, stringEntity1] ).to.include(nodeIter.entity)
    	}
    	expect(count).to.equal(2)


	})
	
    it('nodelist Contains All Matching Entities', function(){
    	var ObjectNodePrototype = MockData.nodePrototypes[5],
    		numberObjectEntity = MockData.entities[4],
    		objectEntity = MockData.entities[5],
    		objectEntity1 = MockData.entities[6],
    		objComp = MockData.components[5],
    		objComp1 = MockData.components[6],
    		objComp2 = MockData.components[7]
    		count = 0,
    		hasComponent = false,
    		entity = null,
    		nodeIter = null

    	family = FamilyFactory().withNodePrototype( ObjectNodePrototype ).withName( ' ObjectNodeFamily').create()

    	MockData.entities.forEach( function(e){
    		family.newEntity(e)
    	})

    	nodeIter = family.nodelist.head
    	for( ;nodeIter; nodeIter= nodeIter.next) {
    		count++
    		entity = nodeIter.entity
    		expect( [ numberObjectEntity, objectEntity, objectEntity1]).to.include(nodeIter.entity) 
    		//these should all be the same type
    		hasComponent = entity.has( objComp.type ) || entity.has( objComp1.type ) || entity.has( objComp2.type )
    		expect( hasComponent ).to.be.true 
    	}

    	expect(count).to.equal(3)
    })

    it('cleanUpEmptiesNodeList', function(){
    	var ObjectNodePrototype = MockData.nodePrototypes[5],
    		numberObjectEntity = MockData.entities[4],
    		objectEntity = MockData.entities[5],
    		objectEntity1 = MockData.entities[6],
    		count = 0

    	family = FamilyFactory().withNodePrototype( ObjectNodePrototype ).withName( ' ObjectNodeFamily').create()

    	MockData.entities.forEach( function(e){
    		family.newEntity(e)
    	})

    	nodeIter = family.nodelist.head
    	for( ;nodeIter; nodeIter= nodeIter.next) {
    		count++
    	}
    	expect(count).to.be.gt(0)
    	family.cleanUp()
    	
    	count = 0
    	for( ;nodeIter; nodeIter= nodeIter.next) {
    		count++
    	}

    	expect(count).to.be.eq(0)
    	expect(family.nodelist.head).to.be.null    	
    })

    it('cleanUpSetsNextNodeToNull', function(){
    	var ObjectNodePrototype = MockData.nodePrototypes[5],
    		numberObjectEntity = MockData.entities[4],
    		objectEntity = MockData.entities[5],
    		objectEntity1 = MockData.entities[6],
    		count = 0

    	family = FamilyFactory().withNodePrototype( ObjectNodePrototype ).withName( ' ObjectNodeFamily').create()

    	MockData.entities.forEach( function(e){
    		family.newEntity(e)
    	})

    	nodeIter = family.nodelist.head
    	for( ;nodeIter; nodeIter= nodeIter.next) {
    		count++
    	}
    	expect(count).to.be.gt(0)
    	nodeIter = family.nodelist.head
    	family.cleanUp()

    	expect(nodeIter.next).to.be.null
    })	



})