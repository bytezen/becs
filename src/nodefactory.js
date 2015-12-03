var stampit = require('stampit'),
  DEFAULT_TYPE_NAME = "AnonymousNodeFactory"



module.exports = function() {
  var config = { name: DEFAULT_TYPE_NAME }
    // ,
                      // componentTypes: []} //{} }  // object key, val pairs :: (componentTypeName: componentType)

  return stampit()
            .refs({
              type: config,
              componentTypes: []
            })            
            .props({
                previous: null,
                next: null,
                entity: {}                    
            })
            .static({
              //TODO: Use config pattern here, but remember we need to have closure over the config
              //type
              type: config,
              componentTypes: [],
              withName: function withName(name) {     
                                config.name = name               
                                return this
                            },
              withComponentTypes: function withComponents(components) {
                                var args = []
                                if( Array.isArray(components) ) {
                                  args = components
                                  // components.forEach( function forEachNodeType(t){ 
                                  //                   config.componentcomponents.push(t)
                                  //               })
                                } else if(arguments.length > 1) {
                                  args = [].slice.call(arguments)
                                  // args.forEach( function forEachArgs(a){
                                  //                   config.componentcomponents.push(a)
                                  //               })
                                } else  if(arguments.length == 1){                                  
                                  args.push(components)
                                }

                                //register each component name and type with this node
                                //TODO: Refactor to   Use the pattern from Entity
                                args.forEach(function argsForEach(a) {
                                  this.componentTypes.push(a)
                                }, this)

                              return this
                            }                
            })
            .init( function(params){
              // copy the component
              // console.log(params)
              this.stamp = params.stamp //The stamper for this object

                
              this.componentTypes = params.stamp.componentTypes              
            })
          }
            // })
            // .methods({
            //   hasComponentName: function hasComponentName(name) {
            //     return this.type.components.hasOwnProperty(name)
            //   }
            // })
      //}


//------



