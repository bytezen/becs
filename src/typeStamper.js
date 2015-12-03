"use strict"
var stampit = require('stampit'),
	uuid = require('uuid')


module.exports = function() {
	var config = { stampID: undefined,
				   stampLabel: undefined },

		TypeStamper = stampit()
				.init( function initType(params){
					config.stampID = uuid.v4()
					config.stampLabel = params.stamp.factoryname ||  "anonymous"
					Object.defineProperty( this, "type", { 
															"get" : function(){ 
																		return config 
																	}
														})
				})
				.methods({
					is: function is(type) {
							return this.type === type
						}
				})
				.static({
					withName: function withName(name){
								this.factoryname = name
								// console.log(this)
								return this
							}
				})



	return TypeStamper

}
