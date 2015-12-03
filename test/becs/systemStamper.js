var becs_path = '../../src/',
    existy = require('lemonad').existy,
    becs = require(becs_path),
    expect = require('chai').expect,
	SystemFactory = becs.SystemStamper,
    EngineFactory = becs.EngineFactory




describe('# System Stamper', function() {
    var fnCall = {},


        updateCallOrder = []

    var mockSystemPrototype1 = systemPrototype(callCount(fnCall,'add'),callCount(fnCall,'remove'),callCount(fnCall,'update')),
        mockSystemPrototype2 = systemPrototype(callCount(fnCall,'add'),callCount(fnCall,'remove'),callCount(fnCall,'update')),
        mockSystemPrototype3 = systemPrototype(callCount(fnCall,'add'),callCount(fnCall,'remove'),callCount(fnCall,'update'))

    var sys1,
        sys2,
        sys3,
        engine = EngineFactory().create()

    function resetFnCalls() {
        fnCall['add'] = 0
        fnCall['remove'] = 0
        fnCall['update'] = 0        
    }  

    function resetUpdateCallOrder() { updateCallOrder = []; }   

    function resetSystems() {
        sys1 = mockSystemPrototype1.create({name: 'mock1'})
        sys2 = mockSystemPrototype2.create({name: 'mock2'})
        sys3 = mockSystemPrototype3.create({name: 'mock3'})        
    }   

    before('',function(){
        resetFnCalls()
        resetSystems()
        resetUpdateCallOrder()
    })

	it('default sytem Priority Is Zero', function(){      
        expect(sys1.priority).to.be.equal(0)
    })

    it('add System Calls Add To Engine',function(){

        engine.addSystem(sys1)             
        engine.addSystem(sys2,1)             
        engine.addSystem(sys3,2)

        expect(fnCall['add']).to.equal(3)
        // expect(fnCall['add']).to.equal(1)
    })

    it('default priority is correct after adding to engine', function(){      
        expect(sys1.priority).to.be.equal(0)
    })

    it('can Set Priority When Adding System',function(){
        expect(sys2.priority).to.be.equal(1)
        expect(sys3.priority).to.be.equal(2)        
    })

    it('systems Getter Returns All The Systems', function(){

        expect(engine.systemList.list).to.have.length(3)
        expect(engine.systemList.list.every(function(x){ 
                                                return [sys1,sys2,sys3].indexOf(x) >= 0;
                                            })).to.be.true 
    })

    it('remove System Calls Removed From Engine',function(){
        engine.removeSystem(sys1)
        expect(fnCall['remove']).to.equal(1)
    })

    describe('## system priorities', function() {
        var sysorder

        beforeEach('',function(){
            resetUpdateCallOrder()
            resetFnCalls()
            resetSystems()            

            sysorder = [sys1,sys2,sys3]            
        })

        it('systems Updated In Priority Order If Same As Add Order',function(){

            engine = EngineFactory().create()
            engine.addSystem(sys1,10)
            engine.addSystem(sys2,20)
            engine.addSystem(sys3,30)


            engine.update(0.1)
            updateCallOrder.forEach(function(sys,i){ 
                expect(sys).to.equal(sysorder[i])
            })

        })

        it('systems Updated In Priority Order If Reverse Add Order',function(){

            engine = EngineFactory().create()
            engine.addSystem(sys3,30)
            engine.addSystem(sys2,20)
            engine.addSystem(sys1,10)              
            
            engine.update(0)
            updateCallOrder.forEach( function(sys,i){ 
                expect(sys).to.equal(sysorder[i])
            })

        })
        
    	it('systems Updated In Priority Order If Priorities Are Negative', function(){

                engine = EngineFactory().create()
                engine.addSystem(sys2,-5)
                engine.addSystem(sys1,-10)              
                engine.addSystem(sys3,-1)
                
                engine.update(0)
                updateCallOrder.forEach( function(sys,i){ 
                    expect(sys).to.equal(sysorder[i])
                })        

        })
    })

    describe('## Updating', function() {




        beforeEach('',function(){
            engine = EngineFactory().create()
            engine.addSystem(sys1,1)
            engine.addSystem(sys2,2)
            engine.addSystem(sys3,3)
            resetSystems()
            resetFnCalls()
        })

        it('engine calls update On systems', function(done){
            engine.update(5)
            expect(engine.systemList.list).to.have.length(3)
            setTimeout( function(){
                            expect(fnCall['update']).to.equal(3) 
                            done()
                        }, 50 )
        })

    	it('updating is false before update',function(){
            expect(engine.updating).to.be.false
        })

    	it('updating is true during update', function(){
            updateFnCall = function(time) {
                fnCall['update']++
                expect(engine.updating).to.be.true
            },


            sys1.update = updateFnCall
            sys2.update = updateFnCall
            sys3.update = updateFnCall
            engine.update(0)
        })

    	it('updating is false after update', function(done){
            engine.update(20)
            expect(engine.updating).to.be.false
            setTimeout( function(){
                            expect(engine.updating).to.be.false
                            done()
                        }, 100 )
        })

    	it('dispatches complete signal after update', function(done){
            var handlerCalled = false
            var handler = function () {
                                handlerCalled = true
                            }

            engine.notifyOnUpdateComplete(handler)
            engine.update(30)
            setTimeout( function(){
                            expect(handlerCalled).to.be.true
                            engine.stopUpdateCompleteNotification(handler)
                            done()
                        }, 200 )            



        })
    })

	it('get System Returns The System',function(){
        expect(engine.getSystem(sys2.type)).to.equal(sys2)

    })

	it('get System Returns Null If No Such System', function(){
        expect(engine.getSystem(sys1.type)).to.be.null        
    })

	it('remove All Systems Does What It Says')
	it('remove System And Add It Again Does Not Cause Invalid Linked List')

/*	
    test("systemsGetterReturnsAllTheSystems", function() {
        var system1 = new Ash.System();
        engine.addSystem( system1, 1 );
        var system2 = new Ash.System();
        engine.addSystem( system2, 1 );
        equal( engine.systems.length, 2 );
        notEqual(engine.systems.indexOf(system1), -1);
        notEqual(engine.systems.indexOf(system2), -1);
    });

    test("addSystemCallsAddToEngine", 2, function() {
        stop();
        var system = new MockSystem();
        asyncCallback = addedCallbackMethod;
        engine.addSystem( system, 0 );
        setTimeout(function(){
            start();
        }, 10);
    });

    test("removeSystemCallsRemovedFromEngine", 2, function() {
        stop();
        var system = new MockSystem();
        engine.addSystem( system, 0 );
        asyncCallback = removedCallbackMethod;
        engine.removeSystem( system );
        setTimeout(function(){
            start();
        }, 10);
    });

    test("engineCallsUpdateOnSystems", 2, function() {
        stop();
        var system = new MockSystem();
        engine.addSystem( system, 0 );
        asyncCallback = updateCallbackMethod;
        engine.update( 0.1 );
        setTimeout(function() {
            start();
        }, 10);
    });

    test("defaultPriorityIsZero", function() {
        var system = new MockSystem();
        equal( system.priority, 0 );
    });

    test("canSetPriorityWhenAddingSystem", function() {
        var system = new MockSystem();
        engine.addSystem( system, 10 );
        equal( system.priority, 10 );
    });

    test("systemsUpdatedInPriorityOrderIfSameAsAddOrder", 2, function() {
        system1 = new MockSystem();
        engine.addSystem( system1, 10 );
        system2 = new MockSystem();
        engine.addSystem( system2, 20 );
        asyncCallback = updateCallbackMethod1;
        engine.update( 0.1 );
    });

    test("systemsUpdatedInPriorityOrderIfReverseOfAddOrder", 2, function() {
        system2 = new MockSystem();
        engine.addSystem( system2, 20 );
        system1 = new MockSystem();
        engine.addSystem( system1, 10 );
        asyncCallback = updateCallbackMethod1;
        engine.update( 0.1 );
    });

    test("systemsUpdatedInPriorityOrderIfPrioritiesAreNegative", 2, function() {
        system2 = new MockSystem();
        engine.addSystem( system2, 10 );
        system1 = new MockSystem();
        engine.addSystem( system1, -20 );
        asyncCallback = updateCallbackMethod1;
        engine.update( 0.1 );
    });

    test("updatingIsFalseBeforeUpdate", function() {
        ok( engine.updating === false );
    });

    test("updatingIsTrueDuringUpdate", 1, function() {
        stop();
        var system = new MockSystem();
        engine.addSystem( system, 0 );
        asyncCallback = assertsUpdatingIsTrue;
        engine.update( 0.1 );
        start();
    });

    test("updatingIsFalseAfterUpdate", function() {
        engine.update(0.1);
        ok( engine.updating === false );
    });

    test("completeSignalIsDispatchedAfterUpdate", 1, function() {
        var system = new MockSystem();
        engine.addSystem( system, 0 );
        asyncCallback = listensForUpdateComplete;
        engine.update(0.1);
    });

    test("getSystemReturnsTheSystem", function(){
        var system1 = new MockSystem();
        engine.addSystem( system1, 0 );
        engine.addSystem( new Ash.System(), 0 );
        strictEqual( engine.getSystem( MockSystem ), system1 );
    });

    test("getSystemReturnsNullIfNoSuchSystem", function() {
        engine.addSystem( new Ash.System(), 0 );
        strictEqual( engine.getSystem( MockSystem ), null );
    });

    test("removeAllSystemsDoesWhatItSays", function() {
        engine.addSystem( new Ash.System(), 0 );
        engine.addSystem( new MockSystem(), 0 );
        engine.removeAllSystems();
        strictEqual( engine.getSystem( MockSystem ), null );
        strictEqual( engine.getSystem( Ash.System ), null );
    });

    test("removeSystemAndAddItAgainDoesNotCauseInvalidLinkedList", function() {
        var systemB = new Ash.System();
        var systemC = new Ash.System();
        engine.addSystem( systemB, 0 );
        engine.addSystem( systemC, 0 );
        engine.removeSystem( systemB );
        engine.addSystem( systemB, 0 );
        strictEqual( systemC.previous, null );

        strictEqual( systemB.next, null );
    });
*/

})


function systemPrototype(addFn, removeFn, updateFn) {
    return SystemFactory().methods({ addToEngine: addFn,
                                     removeFromEngine: removeFn,
                                     update: updateFn
                                })
}


function callCount(o,prop) {
    if(!existy(o[prop]))
        o[prop] = 0

    return function() {
        o[prop]++
    }
}

function addFn(o) {  
    if(!existy(o['add']))
        o['add'] = 0
    return function() {
        o['add']++ 
    }
}

function removeFn(o) { 
    if(!existy(o['remove']))
        o['remove'] = 0
    return function() {
        o['remove']++ 
    }
}

function updateCallOrderFn(o,callOrder) {
    if(!existy(o['update'])) {
        o['update'] = 0    
    }

    return function(time) {
        setTimeout( function(){ 
            o['update']++
            callOrder.push(this)
        }, time )        
    }
}

function updateFn(o) {
    if(!existy(o['update'])) {
        o['update'] = 0    
    }

    return function() {
        o['update']++
    }
}



