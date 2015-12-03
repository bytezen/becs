var becs_path = '../../src/',
	becs = require(becs_path),
	expect = require('chai').expect,
	stampit = require('stampit'),
	EngineFactory = becs.EngineFactory,
	FamilyFactory = becs.FamilyFactory,
	mocks = require('./data/mocks'),
	entities = mocks.entities

describe('# Engine Factory', function() {
	var engine,
		numberNode = mocks.nodePrototypes[0].create(),
		stringNode = mocks.nodePrototypes[1].create(),
		stringObjectNode = mocks.nodePrototypes[2].create(),
		testNodeLists,
		numberNodeList,
		stringNodeList,
		stringObjectNodeList

	beforeEach('beforeEach',function(){

		engine = EngineFactory().create()


		//add nodes to engine to create some families
		numberNodeList = engine.getNodeList( numberNode )
		stringNodeList = engine.getNodeList( stringNode )
		stringObjectNodeList = engine.getNodeList( stringObjectNode )

		testNodeLists = [numberNodeList, stringNodeList, stringObjectNodeList]

		//clear all of the entity pointers
		entities.forEach(function (e){ e.previous = e.next = null } )

		expect(engine.nodeFamilyMap.keys).to.have.length(3)
	})


	it('get NodeList Creates Family', function(){
		engine = EngineFactory().create()
	
		expect(engine.nodeFamilyMap).to.exist
		expect(engine.nodeFamilyMap.size()).to.equal(0)		

		engine.getNodeList(numberNode)
	
		expect(engine.nodeFamilyMap.size()).to.equal(1)
		expect(engine.nodeFamilyMap.has(numberNode))

		var fam = engine.nodeFamilyMap.get(numberNode)		
		expect(fam.nodePrototype).to.equal(numberNode.stamp)
	})	

	it('get NodeList Checks All Entities',function(){
		var callCount = 0
		var newEntityCalled = function newEntityCalled(e) {
									expect(entities).to.contain(e)
									callCount++
								}
		var mockFamilyPrototype = stampit.compose(FamilyFactory(),
												stampit.methods({ newEntity: newEntityCalled}))

		//testing method override		
		// mockFamilyPrototype.withNodePrototype(numberNode.stamp)
		// 				   .create()
		// 				   .newEntity(null)

		engine = EngineFactory().create({familyPrototype: mockFamilyPrototype})

		entities.forEach(function(e){ engine.addEntity(e) })

		//side effect creates a family
		engine.getNodeList( numberNode )
		expect(callCount).to.equal( engine.nodeFamilyMap.size() * entities.length)


	})

	it('entities Getter Returns All The Entities', function(){
		entities.forEach(function(e) {
			engine.addEntity(e)
		})

		var engineEntities = engine.entities

		expect( engineEntities ).to.have.length( entities.length)
		entities.forEach( function(e,i){
			expect(e).to.equal( engineEntities[i] )
		})
	})

	it('add Entity Checks With All Families', function(){
			var callCount = 0,
				newEntityCountFn = function newEntityCalled(entity) {										
										callCount++
									}	
			//Hack, change the family method so that we can count hits of the method
			engine.nodeFamilyMap.get( numberNode ).newEntity = newEntityCountFn
			engine.nodeFamilyMap.get( stringNode ).newEntity = newEntityCountFn
			engine.nodeFamilyMap.get( stringObjectNode ).newEntity = newEntityCountFn

			engine.addEntity( entities[0] )
			engine.addEntity( entities[1] )		

			expect(engine.entities).to.have.length(2)	

			expect(callCount).to.equal(2 * testNodeLists.length)	
						
	})

	it('remove Entity Checks With All Families', function(){
		
		var callCount = 6
		var removeEntityCountFn = function removeEntityCalled() { 
									callCount--
								}

		//Hack, change the family method so that we can count hits of the method
		engine.nodeFamilyMap.get( numberNode ).removeEntity = removeEntityCountFn
		engine.nodeFamilyMap.get( stringNode ).removeEntity = removeEntityCountFn
		engine.nodeFamilyMap.get( stringObjectNode ).removeEntity = removeEntityCountFn		

		engine.addEntity( entities[0] )
		engine.addEntity( entities[1] )

		engine.removeEntity( entities[1] )
		engine.removeEntity( entities[0] )

		
		expect(callCount).to.be.equal(0)								

	})

	it('remove All Entities Checks With All Families', function(){
		//assume 2 entities added to an engine that has 3 nodes registered
		var callCount = 6


		//---- TODO: Refactor to use stampit compose like above
		var removeEntityCountFn = function removeEntityCalled() { 
									callCount--
								}

		//Hack, change the family method so that we can count hits of the method
		engine.nodeFamilyMap.get( numberNode ).removeEntity = removeEntityCountFn
		engine.nodeFamilyMap.get( stringNode ).removeEntity = removeEntityCountFn
		engine.nodeFamilyMap.get( stringObjectNode ).removeEntity = removeEntityCountFn		
	
		engine.addEntity( entities[0] )
		engine.addEntity( entities[1] )

		expect(engine.entities).to.have.length(2)

		engine.removeAllEntities();

		expect(callCount).to.be.equal(0)
		expect(engine.entities).to.have.length(0)								
	})

	it('release NodeList Calls CleanUp', function(){
		var callCount = 0
		var cleanUpCallCount = function cleanUpCallCount() {
									callCount++
								}
		var mockFamilyPrototype = stampit.compose(FamilyFactory(),
												stampit.methods({ cleanUp: cleanUpCallCount}))

		engine = EngineFactory().create({familyPrototype: mockFamilyPrototype})
		//side effect creates a family
		engine.getNodeList( numberNode )

		engine.releaseNodeList( numberNode )
		expect(callCount).to.equal(1)
		expect(engine.nodeFamilyMap.has(numberNode)).to.be.false
		
	})

	it('component Added Checks With All Families', function(){
		//add some nodes to the engine to make some families
		var testEntities = entities.slice(2,4) //string, string
		var callCount = 0

		//---- TODO: Refactor to use stampit compose like above
		var onComponentAddedCallCount = function(entity,component){										
											callCount++
										}

		engine.nodeFamilyMap.get( numberNode ).componentAddedToEntity = onComponentAddedCallCount
		engine.nodeFamilyMap.get( stringNode ).componentAddedToEntity = onComponentAddedCallCount
		engine.nodeFamilyMap.get( stringObjectNode ).componentAddedToEntity = onComponentAddedCallCount
		
		
		testEntities.forEach(function(te){ 
							engine.addEntity(te) 
						})

		// console.log(mocks.components[2].type)
		testEntities[0].add( mocks.components[2] ) //number component
		testEntities[1].add( mocks.components[1] ) //string componenent
		expect(callCount).to.equal( testEntities.length * 3)


	})

	// it('component Removed Checks With All Families', function(){
	// 	var testEntities = entities.slice(2,4)
	// 	var callCount = 0

	// 	var onComponentRemovedCallCount = function(entity,component){										
	// 										callCount++
	// 									}		

	// 	engine.nodeFamilyMap.get( numberNode ).componentRemovedFromEntity = onComponentRemovedCallCount
	// 	engine.nodeFamilyMap.get( stringNode ).componentRemovedFromEntity = onComponentRemovedCallCount
	// 	engine.nodeFamilyMap.get( stringObjectNode ).componentRemovedFromEntity = onComponentRemovedCallCount

	// 	testEntities.forEach(function(te){ 
	// 						engine.addEntity(te) 
	// 					})

	// 	var components = testEntities[0].componentMap.values
	// 	console.log(components[0])
	// 	testEntities[0].remove(components[0])

	// 	expect(callCount).to.equal(3)


	// })


/*
    test("entitiesGetterReturnsAllTheEntities", function() {
        var entity1 = new Ash.Entity();
        engine.addEntity( entity1 );
        var entity2 = new Ash.Entity();
        engine.addEntity( entity2 );
        equal(engine.entities.length, 2);
        notEqual(engine.entities.indexOf(entity1), -1);
        notEqual(engine.entities.indexOf(entity2), -1);
    });

    test("addEntityChecksWithAllFamilies", function() {
        engine.getNodeList( MockNode );
        engine.getNodeList( MockNode2 );
        var entity = new Ash.Entity();
        engine.addEntity( entity );
        equal( MockFamily.instances[0].newEntityCalls, 1 );
        equal( MockFamily.instances[1].newEntityCalls, 1 );
    });

    test("removeEntityChecksWithAllFamilies", function() {
        engine.getNodeList( MockNode );
        engine.getNodeList( MockNode2 );
        var entity = new Ash.Entity();
        engine.addEntity( entity );
        engine.removeEntity( entity );
        equal( MockFamily.instances[0].removeEntityCalls, 1 );
        equal( MockFamily.instances[1].removeEntityCalls, 1 );
    });

    test("removeAllEntitiesChecksWithAllFamilies", function() {
        engine.getNodeList( MockNode );
        engine.getNodeList( MockNode2 );
        var entity = new Ash.Entity();
        var entity2 = new Ash.Entity();
        engine.addEntity( entity );
        engine.addEntity( entity2 );
        engine.removeAllEntities();
        equal( MockFamily.instances[0].removeEntityCalls, 2 );
        equal( MockFamily.instances[1].removeEntityCalls, 2 );
    });

    test("componentAddedChecksWithAllFamilies", function() {
        engine.getNodeList( MockNode );
        engine.getNodeList( MockNode2 );
        var entity = new Ash.Entity();
        engine.addEntity( entity );
        entity.add( new Point() );
        equal( MockFamily.instances[0].componentAddedCalls, 1 );
        equal( MockFamily.instances[1].componentAddedCalls, 1 );
    });

    test("componentRemovedChecksWithAllFamilies", function() {
        engine.getNodeList( MockNode );
        engine.getNodeList( MockNode2 );
        var entity = new Ash.Entity();
        engine.addEntity( entity );
        entity.add( new Point() );
        entity.remove( Point );
        equal( MockFamily.instances[0].componentAddedCalls, 1 );
        equal( MockFamily.instances[1].componentAddedCalls, 1 );
    });

    test("getNodeListCreatesFamily", function() {
        engine.getNodeList( MockNode );
        equal( MockFamily.instances.length, 1 );
    });

    test("getNodeListChecksAllEntities", function() {
        engine.addEntity( new Ash.Entity() );
        engine.addEntity( new Ash.Entity() );
        engine.getNodeList( MockNode );
        equal( MockFamily.instances[0].newEntityCalls, 2 );
    });

    test("releaseNodeListCallsCleanUp", function() {
        engine.getNodeList( MockNode );
        engine.releaseNodeList( MockNode );
        equal( MockFamily.instances[0].cleanUpCalls, 1 );
    });
*/


})