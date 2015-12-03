var stampit = require('stampit')


module.exports = stampit()
					.props({
						head: null,
						tail: null
					})
					.init(function initListProperty(){
							Object.defineProperty( this, 
						   "list",
						   { "get" : function(){
						   				var arr = [], 
						   					node
						   				for(node = this.head; node; node = node.next){
						   					arr.push(node)
						   				}
						   				return arr
						   			}})
					})
					.methods({
						add: function addNode( node ) {
							if( !this.head ) {
								this.head = this.tail = node
							} else {
								this.tail.next = node
								node.previous = this.tail
								this.tail = node
							}
						},
						remove: function removeNode( node ) {
							if( this.head === node ) {
								//replace the head
								this.head = node.next

								if(this.head) {
									this.head.previous = null
								}			
							}
							if( this.tail === node ) {
								this.tail = node.previous

								if(this.tail) {
									this.tail.next = null
								}

							} 

							if(node.previous) {
								node.previous.next = node.next
							}

							if(node.next) {
								node.next.previous = node.previous
							}							
						},
						removeAll: function removeAll() {
							while(this.head) {
								this.remove(this.head)
							}
						}
					})



// var SignalListChange = stampit()
// 						.methods({
// 							addNodeAddListener: function addNodeAddListener(fn) {
// 								this.nodeAdded.add(fn)
// 							},
// 							removeNodeAddListener: function removeNodeAddListener(fn) {
// 								this.nodeAdded.remove(fn)
// 							},
// 							addNodeRemoveListener: function addNodeRemoveListener(fn) {
// 								this.nodeRemoved.add(fn)
// 							},
// 							removeNodeRemoveListener: function removeNodeRemoveListener(fn) {
// 								this.nodeRemoved.remove(fn)
// 							}
// 						})
