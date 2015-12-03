"use strict"
var stampit = require('stampit'),
	TypeStamper = require('./typeStamper')

module.exports = function() {
	var SystemStamper = stampit()
							.methods({
								addToEngine: function addToEngine(engine) {
												/* implemented by object */
											 },
								removeFromEngine: function removeFromEngine(engine) {
												/* implemented by object */
											 },										 
								update: function update(time) {
												/* implemented by object */
											 }
							})	
							.props({
								priority: 0
							})			
	return stampit.compose(TypeStamper(), SystemStamper)						
}



// -- demo use creating 2 different SystemStampers with unique IDs
/*
var  SystemStamper = module.exports,
	 SystemFactory1 = SystemStamper(),
	 SystemFactory2 = SystemStamper()

var sys1 = SystemFactory1.create()
var sys2 = SystemFactory2.withName('sys').create()
console.log(sys1.type)
console.log(sys2.type)
*/
