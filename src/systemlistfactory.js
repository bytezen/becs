var stampit = require('stampit'),
	LinkedListPrototype = require('./util/linkedlist')


module.exports = function() {
	var SystemList = stampit()
						.compose( LinkedListPrototype ,stampit().methods({
										get : function get( type ) {
												for(var iter = this.head; iter; iter = iter.next) {
													if(iter.is(type)) {
														return iter
													}
												}

												return null
											},
										//Take system priority into account when adding
										add: function addNode( node ) {
											if( !this.head ) {
												this.head = this.tail = node
											} else if ( node.priority <= this.head.priority) {
												node.previous = this.head.previous //equals null
												node.next = this.head
												this.head.previous = node
												this.head = node
											} else if( node.priority > this.tail.priority) {
												this.tail.next = node
												node.previous = this.tail
												this.tail = node
											} else {
												var iter = this.head
												for(iter; iter; iter = iter.next){
													if( node.priority <= iter.priority ) {
														node.prev = iter.prev
														node.next = iter
														iter.prev = node
														break														
													}
												}												
											} 
												
										}										
									}))

	return SystemList
}
