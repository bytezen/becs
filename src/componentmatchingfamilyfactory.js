var stampit = require('stampit'),
	DictionaryPrototype = require('./util/dictionary'),
	NodelistPrototype = require('./nodelist'),
	NodePoolFactory = require('./nodepoolfactory'),
	DEFAULT_TYPE_NAME = "AnonymousMatchingFamily"


module.exports = function() {
	var config = { name: DEFAULT_TYPE_NAME,
	  				nodePrototype: null }

	return stampit()
			  .refs({
			    type: config
			  })
			  .init(function initStateVars() {
				this.entityNodeMap = DictionaryPrototype.create() // (entity, node) map
				this.nodelist = NodelistPrototype.create()
				this.componentMap = DictionaryPrototype.create()  // (componentType, typeName)	
				// this.nodePrototype = undefined

				Object.defineProperty( this, 
									   "nodes",
									   { "get" : function(){
									   				var arr = [], 
									   					node
									   				for(node = this.nodelist.head; node; node = node.next){
									   					arr.push(node)
									   				}

									   				return arr
									   			}})				
			  })
			  .init(function initNodeType(params) {
			  	this.nodePrototype = params.stamp.nodePrototype
			  })
			  .init(function initComponentMap(params){
			  	if(this.nodePrototype) {
				  	this.nodePrototype.componentTypes.forEach(function forEachInitTypes(t) {
				  												this.componentMap.add(t, t.name)
				  											}, this)
				}
			  })
			  .init(function initNodePool() {
			  	this.nodePool = NodePoolFactory()
			  						.withNodePrototype(this.nodePrototype)
			  						.create({componentMap: this.componentMap})
			  })			  
			  .static({
			    type: config,
			    withName: function withName(name) {
			    				config.name = name			
								return this
							},
				withNodePrototype: function withNodePrototype(nodeProto) {
							if(!nodeProto.hasOwnProperty('create') || typeof nodeProto.create !== 'function') {
								throw Error('Node prototype is not a stampit prototype: ' + nodeProto)
							}					
							this.nodePrototype = nodeProto
								return this
							}
			  })
			  .methods({
				newEntity: function newEntity(e) {
								if( !this.entityNodeMap.has(e) ){
									this.addIfMatch(e)		
								}								
							},
				removeEntity: function removeEntity(e) {
								this.removeIfMatch(e)
							},			
				addIfMatch: function addIfMatch(e) {
								//if the entity's components match all of the components 
								//that this family has registered then
								//create a node (or get it from the pool)
								// set its entity to e
								// set its properties to e.component.property values
								//create node
								if(!this.entityNodeMap.has(e)) {
									//does this entity have all of the necessary components to be in the family
									// console.log(this.componentMap)

									var shouldAdd = e.componentMap.size() > 0 && 
													this.componentMap.keys.every(function (familyCompType) {
																				return e.componentMap.has(familyCompType)
																			}, this)									
									if(shouldAdd) {
										//get a new node from the node pool
										var node = this.nodePool.get()
										node.entity = e
										//set node componentType property equal to entity component
										
										this.componentMap.forEach( function(k,v){
											node[k.name] = e.componentMap.get(k)
										})

										//add entity and node to entity node map
										this.entityNodeMap.add(e,node)
										//add component removed listener to the entity component
										e.componentRemoved.add(this.componentRemovedFromEntity,this)
										//add node to this.nodelist
										this.nodelist.add(node)
										
									}											
									

									//this.entityNodeMap.add(e,node)
								}
								//add entity to the node
								//add the entity, node pair to the dictionary
							},
				removeIfMatch: function removeIfMatch(e) {
									if(this.entityNodeMap.has(e)) {
										var node = this.entityNodeMap.get(e)
										//remove handler
										e.componentRemoved.remove(this.componentRemovedFromEntity)
										this.nodelist.remove(node)
										this.entityNodeMap.remove(e)

						                // if (this.engine.updating) {
						                    // nodePool.cache(node);
						                    // engine.updateComplete.add(this.releaseNodePoolCache, this);
						                // } else {
						                	this.nodePool.dispose(node)
						                // }										
									}
							},
				cleanUp: function cleanUp(){ 
								var nodeIter = this.nodelist.tail
								while(nodeIter) {
									this.nodelist.remove(nodeIter)
									nodeIter = nodeIter.previous
								}
						}, 
				componentAddedToEntity: function onComponentAddedToEntity(entity, componentType) {
											this.addIfMatch(entity)

										},
				componentRemovedFromEntity: function onComponentRemovedFromEntity(entity, componentType) {
											this.removeIfMatch(entity)
															}
			  })
	}


// ---------- Sandbox

// var factory = module.exports
// var prototype = factory().withName('testingFamily')
// var family = prototype()

// console.log(family)

