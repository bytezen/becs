var stampit = require('stampit'),
    Signal = require('signals'),
    Dictionary = require('./util/dictionary')



//var added = new Signal(), removed = new Signal()


module.exports = function() {

   return stampit({
          //TODO: Protect Components
          props: {
            previous :   null, //entity
            next     :   null //entity
          },

          methods : {
            log : console.log,

            add : function addComponent(component) {
                    if( !this.componentMap.has(component) ) {
                      this.componentMap.add(component.type, component)
                      this.componentAdded.dispatch(this, component)

                      return this
                    } else {
                      //throw Error("Component, " + comp.id + " already exists on this entity")
                    }

            },

            remove: function removeComponent(component) {            
                    if( this.componentMap.has(component.type) ) {              
                      this.componentMap.remove(component.type)
                      this.componentRemoved.dispatch(this, component)
                    }
                    return this
            },

            // return a component of the specified type if it exists
            // or null
            get : function getComponent(componentType) {
              if(this.componentMap.has(componentType)) {
                return this.componentMap.get(componentType)
              }

              return null
            },

            has : function has(componentType) {
              return this.componentMap.has(componentType)
            },

            componentCount : function componentCount() {
              return this.componentMap.size()
            }

          },

          init : function(params) {
            this.componentAdded = new Signal()
            this.componentRemoved = new Signal()
            this.componentMap = params.stamp.config.componentTypes || Dictionary.create()    //(component.type, component)
          },

          static : {
            config : {componentTypes : undefined},
            withComponents : function withComponents(components) {
                                this.config.componentTypes = Dictionary.create()
                                var args = []
                                if( Array.isArray(components) ) {
                                  args = components
                                  // components.forEach( function forEachNodeType(t){ 
                                  //                   prototypeType.componentcomponents.push(t)
                                  //               })
                                } else if(arguments.length > 1) {
                                  args = [].slice.call(arguments)
                                  // args.forEach( function forEachArgs(a){
                                  //                   prototypeType.componentcomponents.push(a)
                                  //               })
                                } else if(arguments.length == 1){                                  
                                  args.push(components)
                                }

                                //register each component name and type with this node
                                args.forEach(function argsForEach(a) {
                                  this.config.componentTypes.add(a.type, a)                                   
                                }, this)


                              return this
                            }       

            }
        })

          // function isType(component,type) {
          //   return component.type === type;
          // }
    }
