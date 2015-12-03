var stampit = require('stampit'),
	Dictionary = stampit()
					.methods({
						add: function add(k,v) {
							var ind

							if(!this.has(k)) {
								this.keys.push(k)
								this.values.push(v)
							} else {
								ind = this.keys.indexOf(k)
								this.values[ind] = v
							}
						},
						get: function get(k) {
							var result = null,
								ind = this.keys.indexOf(k)

							if( ind > -1 ) {
								result = this.values[ind]
							}

							return result
						},
						remove: function remove(k) {
							var ind = this.keys.indexOf(k)

							if( ind > -1) {
								
								this.keys.splice(ind,1)
								this.values.splice(ind,1)
							}
						},
						has: function has(k) {
							return this.keys.indexOf(k) > -1
						}, 
						size: function size() {
							return this.keys.length
						},
						forEach: function dictForEach(fn) {
							this.keys.forEach( function keysForEach(k,i) {
								fn( k, this.values[i] )
							}, this)
						}						
					})
					.props({
						keys: [],
						values: []
					})



module.exports = Dictionary
	


