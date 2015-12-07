var becs_path = '../../src/',
    becs = require(becs_path),
    chai = require('chai'),
    expect = chai.expect,
    ComponentStamper = becs.ComponentFactory
    // ComponentFactory = require('../componentfactory')


describe('# Component Test', function() {

  describe('## create', function() {
    var StringStamper = ComponentStamper({name:'stringComponent', foo:'value'}),
        PointStamper = ComponentStamper({name:'pointStamper', x:0, y:0}),
        compString = StringStamper(),
        compString2 = StringStamper({foo: 'differentValue'})
        compPoint2D = PointStamper()
        compPoint3D = PointStamper({z:0})


   it('can create a component',function(){
      expect(compString).to.be.ok
      expect(compString.name).to.equal('stringComponent')
      expect(compString.foo).to.equal('value')
    });

    it('can compare stamps of objects',function() {
      expect(compString.is(compString2)).to.be.true
      expect(compString.is(compPoint2D)).to.be.false
    })

    it('can compare objects with stampers',function(){
      expect(compString.is(StringStamper)).to.be.true
      expect(compPoint2D.is(StringStamper)).to.be.false
    })

    it('can create default properties in factory',function() {
      expect(compString2.foo).to.equal('differentValue')

    })

    it('can create instance specific properties',function() {
      expect(compPoint2D.z).to.not.exist
      expect(compPoint3D.z).to.exist
      expect(compPoint3D.is(compPoint2D)).to.be.true
    })

    it('can write and read new values',function() {
      compPoint2D.x = 100
      compPoint2D.y = -100

      expect(compPoint2D.x).to.equal(100)
      expect(compPoint2D.y).to.equal(-100)
      expect(compPoint3D.x).to.not.equal(compPoint2D.x)
      expect(compPoint3D.y).to.not.equal(compPoint2D.y)
    });

  });

});