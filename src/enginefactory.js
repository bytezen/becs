var stampit = require('stampit'),
	Signal = require('signals'),
	Dictionary = require('./util/dictionary'),
	LinkedList = require('./util/linkedlist'),
	SystemListPrototype = require('./systemlistfactory')(),
	FamilyFactory = require('./componentmatchingfamilyfactory')


module.exports = function() {
	var factory = stampit()
					.init( function initProps(){
						this.entityList = LinkedList.create()
						this.systemList = SystemListPrototype.create()
						this.nodeFamilyMap = Dictionary.create() //(node,family)
						this.updateComplete = new Signal()
					})
					.init( function initGetters(){
						Object.defineProperty( this, 
											   "entities",
											   { "get" : function(){
											   				var arr = [], 
											   					node
											   				for(node = this.entityList.head; node; node = node.next){
											   					arr.push(node)
											   				}

											   				return arr
											   			}})
					})
					.init( function initFamilyPrototype(){
						this.familyPrototype = this.familyPrototype || FamilyFactory()
					})
					.props({ 
						entityList: undefined,  	//LinkedList
						systemList: undefined,		//SystemsLinkedList
						nodeFamilyMap: undefined,		//Dictionary (nodeObject, ComponentMatchingFamily)
						updating : false,			
						updateComplete : undefined,
						familyPrototype: undefined
					})
					.methods({

				        addEntity: function (entity) {				        	
				            this.entityList.add( entity )
			            	entity.componentAdded.add( this.onComponentAdded, this )

				            this.nodeFamilyMap.forEach( function( nodeObject, family ) {
				                family.newEntity( entity )
				            })
				        },

				        onComponentAdded: function onComponentAdded(entity, component){
				        	this.nodeFamilyMap.forEach( function(node, family){

				        		family.componentAddedToEntity(entity, component)
				        	})
				        },

				        getNodeList: function getNodeList( nodeObject ) {
				            if( this.nodeFamilyMap.has( nodeObject ) ) {
				            	// console.log('{ComponentMatchingFamily.getNodeList} has node: ' + nodeObject)
				                return this.nodeFamilyMap.get( nodeObject ).nodelist
				            }

				    //         var familyPrototype = FamilyFactory()
				    //         				.withNodePrototype( nodeObject.stamp )
				    //         				.withName(nodeObject.type.name+"_family"),
								// family = familyPrototype.create()
							var family = this.familyPrototype
											.withNodePrototype( nodeObject.stamp )
				            				.withName(nodeObject.type.name + "_family")
				            				.create()
				            this.nodeFamilyMap.add( nodeObject, family )
							

				            //see if any of the entities that we have are valid for this new family
				            for( var entity = this.entityList.head ; entity ; entity = entity.next ) {
				                family.newEntity( entity )
				            }
				            return family.nodelist
				        },				        

				        removeEntity: function (entity) {
				            entity.componentAdded.remove( this.onComponentAdded, this )
				            this.nodeFamilyMap.forEach( function( nodeObject, family ) {
				                family.removeEntity( entity )
				            })
				            this.entityList.remove( entity )
				        },

				        releaseNodeList: function releaseNodeList( nodeObject ) {
				            if( this.nodeFamilyMap.has( nodeObject ) ) {
				                this.nodeFamilyMap.get( nodeObject ).cleanUp()
				            }
				            this.nodeFamilyMap.remove( nodeObject )
				        },

				        getNodeFamily: function getNodeFamily( nodeObject ) {
				        	return this.nodeFamilyMap.get( nodeObject )
				        },

				        removeAllEntities: function removeAllEntities() {
				            while( this.entityList.head ) {
				                this.removeEntity( this.entityList.head )
				            }
				        },

		                addSystem : function addSystem ( system, priority ) {
							            system.priority = priority || system.priority
							            system.addToEngine( this )
							            this.systemList.add( system )
				        },
		                getSystem : function getSystem ( systemType ) {
							            return this.systemList.get( systemType )
				        },

				        removeSystem: function removeSystem( system ) {
							            this.systemList.remove( system )
							            system.removeFromEngine( this )
				        },

				        update: function update( time ) {
						            this.updating = true
						            for( var system = this.systemList.head; system; system = system.next ) {
						                system.update( time )
						            }
						            this.updating = false
						            this.updateComplete.dispatch()							        	
				        },
				        notifyOnUpdateComplete: function onUpdateCompleteHandler(fn) {
				                                    this.updateComplete.add(fn)
				                                },

				        stopUpdateCompleteNotification: function removeOnUpdateCompleteHandler(fn) {
				                                    this.updateComplete.remove(fn)
				                                }     

					})


	return factory
}
