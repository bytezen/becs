var stampit = require('stampit'),
	DEFAULT_TYPE_NAME = 'anonymousComponentType'

module.exports = function () {
					var prototypeType = { name: DEFAULT_TYPE_NAME }
					return stampit()
		            		.refs({
		            			type: prototypeType
		            		})
							.static({
								type: prototypeType,
					            withName: function withName (name) {
		                              prototypeType.name = name           
		                              return this
		                          }
							})
			}
