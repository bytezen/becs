var becs_path = '../../src/',
    becs = require(becs_path),
    chai = require('chai'),
    expect = chai.expect,
    ComponentFactory = becs.ComponentFactory
    // ComponentFactory = require('../componentfactory')


describe('# Component Test', function() {

  describe('## create', function() {
    it('can create a component with default name', function() {
      var mockcomponent = ComponentFactory().create()

      expect(mockcomponent).to.exist
      expect(mockcomponent.type).to.exist
      expect(mockcomponent.type.name).to.equal('anonymousComponentType')
    });

    it('can create a name using fluent style',function(){
      mockcomponent = ComponentFactory().withName('mockcomponent').create()
      expect(mockcomponent.type.name).to.equal('mockcomponent');
    });

    it('has the correct type',function() {
      var factory = ComponentFactory()
      var mockcomponent =  factory.create()
      expect(mockcomponent.type).to.equal(factory.type)
      
    });


    it('can create default properties in factory',function() {
      var factory = ComponentFactory()
                        .withName('mockcomponent')
                        .props({foo: 'default', bar: -1}),
      mockcomponent = factory.create()

      expect(mockcomponent.foo).to.equal('default')
      expect(mockcomponent.bar).to.equal(-1)


    })

    it('can create instance specific properties',function() {
      var factory = ComponentFactory()
                        .withName('mockcomponent'),
          mockcomponent =  factory.create({x:'foo', y: 'bar'});      
          mockcomponent2 = factory.create();

      ['x','y'].forEach( function(prop) {
        expect(mockcomponent).to.have.property(prop)        
        expect(mockcomponent2).to.not.have.property(prop)
      });

      expect(mockcomponent.x).to.equal('foo')
      expect(mockcomponent.y).to.equal('bar')

    });

    it('can write and read new values',function() {
      var mockcomponent =  ComponentFactory()
                              .withName('mockcomponent')
                              .create({x:'foo', y: 'bar'});      

      mockcomponent.x = 10
      mockcomponent.y = "foobar"
      mockcomponent.z = true


      expect(mockcomponent.x).to.equal(10)
      expect(mockcomponent.y).to.equal('foobar')
      expect(mockcomponent.z).to.be.true


    });

  });


  //-----------

  describe('## Component Types', function() {

    it('components from the same factory have the same type',function() {
      var MockFactory = ComponentFactory().withName('mock'),
          component1 = MockFactory.create({foo:10, bar: false})
          component2 = MockFactory.create()

      expect(component1.type).to.equal(MockFactory.type)
      expect(component2.type).to.equal(component2.type)      
    });


    it('components from different factories have different type', function(){
      // var mock1 = FooFactory.create(),
      //     mock2 = BarFactory.create()

      var component1 = ComponentFactory().withName('mock').create()
      var component2 = ComponentFactory().withName('mock').create()

      expect(component1.type).to.not.equal(component2.type)          
          
      //expect(mock1.type).to.not.equal(mock2.type)

    })

  });


  //-----------

});