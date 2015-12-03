var becs_path = '../../src/',
    becs = require(becs_path),
    expect = require('chai').expect,
    Signal = require('signals')
    ComponentFactory = becs.ComponentFactory,
    EntityFactory = becs.EntityFactory,
    EntityPrototype = EntityFactory()

describe('# Entity', function() {

  var mockEntity
  
  before('create mock', function() {
    mockEntity = EntityPrototype.create(); //({componentAdded : new Signal(),
//                           componentRemoved : new Signal()
//                          });

  });

  //-----------
  
  it('be able to create entity', function() {      
      expect(mockEntity).to.exist
      expect(mockEntity).to.have.property('componentMap')  
      expect(mockEntity).to.have.property('next')
      expect(mockEntity).to.have.property('previous')
  });

  it('be able to create withComponents', function() {
      var Mock1ComponentFactory = ComponentFactory().withName('mock1component')
      var Mock2ComponentFactory = ComponentFactory().withName('mock2component')

      var mock1component = Mock1ComponentFactory.create()
      var mock2component = Mock2ComponentFactory.create()

      var MockEntityPrototype = EntityFactory().withComponents([mock1component, mock2component])
      var entity = MockEntityPrototype.create()

      expect(entity.componentMap.size()).to.be.equal(2)
      expect(entity.has( Mock1ComponentFactory.type ) ).to.be.true
      expect(entity.has( Mock2ComponentFactory.type ) ).to.be.true
      expect(entity.get( Mock1ComponentFactory.type ) ).to.be.equal(mock1component)
      expect(entity.get( Mock2ComponentFactory.type ) ).to.be.equal(mock2component)
  })

  //-----------

  describe('## add / remove components:', function() {
    var mockfactories = [] , mockcomponents = []

    before('create mock components',function() {
      for(var i=0; i<6; ++i) {
        mockfactories[i] = ComponentFactory().withName('Mock' + i)
        mockcomponents[i] = mockfactories[i].create()
      }
    });

    beforeEach('create mock', function() {
     mockEntity = EntityPrototype.create();
  });


    it('add a component', function() {

      mockEntity.add(mockcomponents[0])
      expect(mockEntity.has(mockfactories[0].type)).to.be.true
      expect(mockEntity.componentMap.size()).to.be.equal(1)
    });


    it('add 2 components with chaining',function() {

      mockEntity.add(mockcomponents[1])
                .add(mockcomponents[2])

      expect(mockEntity.componentMap.size()).to.be.equal(2)
      expect(mockEntity.has(mockfactories[1].type)).to.be.true
      expect(mockEntity.has(mockfactories[2].type)).to.be.true
      expect(mockEntity.has(mockfactories[3].type)).to.be.false
    });


    it('trigger addHandler for 3 component additions',function(done) {

      var handlerCount = 0;

      mockEntity.componentAdded.add(onAddComponent);

      mockEntity.add(mockcomponents[1])
                .add(mockcomponents[2])
                .add(mockcomponents[0])

      expect(mockEntity.has(mockfactories[1].type)).to.be.true
      expect(mockEntity.has(mockfactories[2].type)).to.be.true
      expect(mockEntity.has(mockfactories[0].type)).to.be.true

      function onAddComponent(e,c) {
        handlerCount++;
        expect([mockfactories[0].type,
                mockfactories[1].type,
                mockfactories[2].type]).to.contain(c.type)

        if(handlerCount == 2 ) {
          mockEntity.componentAdded.remove(onAddComponent)
          done()
        }
      }

    });

    it('should not add duplicates', function() {
      var len = mockcomponents.length

      mockcomponents.forEach(function(mc) {
        mockEntity.add(mc)
      })

      //try to add each a second time
      mockcomponents.forEach(function(mc) {
        mockEntity.add(mc)
      })
      
      expect(mockEntity.componentCount()).to.equal(len)

    });


   it('can remove components',function(){

      mockcomponents.forEach(function(mc) {
        mockEntity.add(mc)
      })
      var len = mockEntity.componentCount()
      mockEntity.remove(mockfactories[3])
    
      expect(mockEntity.has(mockcomponents[3])).to.be.false
      expect(mockEntity.componentCount()).to.be.equal(len - 1)
    });

    it('remove 2 components with chaining', function() {
      mockcomponents.forEach(function(mc) {
        mockEntity.add(mc)
      })
      var len = mockEntity.componentCount()

      mockEntity.remove(mockfactories[2]).remove(mockfactories[5])

      expect(mockEntity.componentCount()).to.equal(len - 2)
      expect(mockEntity.has(mockcomponents[2])).to.be.false      
      expect(mockEntity.has(mockcomponents[5])).to.be.false      

    });

    it('remove 2 components and handle each', function(done) {
      var handleCount = 0,
          len = 0

      mockcomponents.forEach(function(mc) {
        mockEntity.add(mc)
      })

      mockEntity.componentRemoved.add(onDeleteComponent)

      len = mockEntity.componentCount()

      mockEntity.remove(mockfactories[0]).remove(mockfactories[4])

      
      expect(mockEntity.has(mockcomponents[0])).to.be.false      
      expect(mockEntity.has(mockcomponents[4])).to.be.false      


      // handler callback
      function onDeleteComponent(e,c) {
        handleCount++

        expect([mockfactories[0].type,mockfactories[4].type]).to.contain(c.type)
        expect(mockEntity).to.equal(e)

        if(handleCount == 2) {
          expect(mockEntity.componentCount()).to.equal(len - 2)
          mockEntity.componentRemoved.remove(onDeleteComponent)
          done()
        }
      }
    });
  });

  //-----------

  describe('## Access entity component properties',function() {
    var mockComponent1, mockComponent2, factory1, factory2

    before('add components to entity', function() {
      factory1 = ComponentFactory().withName('mock1')
      factory2 = ComponentFactory().withName('mock2')

      mockComponent1 = factory1.create( {foo: 1,
                                   bar: 'xyz',
                                   baz: false,
                                   boo: [1,2,3]
                                  })

      mockComponent2 = factory2.create( {baz : { foo: 3, bar : true } })

      mockEntity.add(mockComponent1).add(mockComponent2)

    });

    it('have accessible primitive properties',function(){

      expect(mockComponent1.type).to.equal(factory1.type)
      expect(mockComponent2.type).to.equal(factory2.type)
      expect(mockComponent1.foo).to.equal(1)
      expect(mockComponent1.bar).to.equal('xyz')
      expect(mockComponent1.baz).to.equal(false)
      expect(mockComponent1.boo[1]).to.equal(2)

      expect(mockComponent2.baz.foo).to.equal(3)
      expect(mockComponent2.baz.bar).to.equal(true)

    });

/*    it('',function(){ });
    it('',function(){ });
    it('',function(){ });
*/
  });



});



