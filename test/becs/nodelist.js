var becs_path = '../../src/',
    becs = require(becs_path),
    expect = require('chai').expect,
 	nodelistPrototype = becs.NodeList,
 	NodePrototype = becs.NodeFactory(),
 	Signal = require('signals')
 


describe('# Nodelist ',function(){
	var nodeArr = []

	function addNodeArrayToList(arr,nodeList) {
		arr.forEach(function fn(node){
			nodeList.add(node)
		})
	}

	before('',function(){
		var count = 5
		//initialize array of nodes
		for( i = 0; i <= count; ++i) {
			nodeArr.push( NodePrototype.create({ value: i }) )
		}

		//populate list with nodes
		nodeArr.forEach(function forEach(node,ind,arr) { 
			var prev = ind - 1,
				next = ind + 1
			node.previous = prev >= 0 ? arr[prev] : null
			node.next = next < arr.length ? arr[next] : null		
		})

		//set node links
		nodeArr.forEach(function prnt(node,ind,arr) { 
			previous = node.previous ? node.previous.value : node.previous
			next = node.next ? node.next.value : node.next		
		});		
	})

	beforeEach('intialize Mocks',function(){
		mNode = NodePrototype.create()
		list = nodelistPrototype.create()
	})


	it('## can add node', function() {			
		list.add(mNode)

		expect(list.head).to.equal(mNode).to.equal(list.tail)				
	})

	it('## add node triggers signal', function(done) { 	

		function onNodeAdded(n) {
			expect(n).to.equal(mNode)
			list.removeNodeAddListener(onNodeAdded)					
			done()
		}
			
		list.addNodeAddListener(onNodeAdded)
		list.add(mNode)
	})

	it('## can remove single node', function() { 
		list.remove(mNode)
		expect(list.head).to.not.be.ok
		expect(list.tail).to.not.be.ok
	})

	it('## removing node triggers signal', function(done) { 
		function onNodeRemoved(n) {
			list.nodeRemoved.remove(onNodeRemoved)
			expect(n).to.equal(mNode)
			done()
		}

		list.nodeRemoved.add(onNodeRemoved)		
		list.add(mNode)
		list.remove(mNode)		

	})

	it('## can iterate through all nodes', function() { 
		var nodeIter,
			visitedCount = 0

		// nodeArr.forEach(function fn(node){ 
		// 	list.add(node)
		// })
		addNodeArrayToList(nodeArr,list)

		for(nodeIter = list.head; nodeIter ; nodeIter = nodeIter.next){
			visitedCount++
		}
		expect(visitedCount).to.equal(nodeArr.length)
	})	


	it('## can remove head node', function() { 
		var nodes = [],
			secondNode,
			thirdNode,
			selNode

		// nodeArr.forEach(function fn(node){
		// 	list.add(node)
		// })
		addNodeArrayToList(nodeArr,list)

		selNode = list.head
		secondNode = list.head.next
		thirdNode  = secondNode.next

		list.remove(list.head)

		for(nodeIter = list.head; nodeIter; nodeIter = nodeIter.next) {
			nodes.push(nodeIter)
		}		

		expect(nodes).to.not.include(selNode)		

		expect(list.head).to.equal(secondNode)
		expect(list.head.previous).to.not.be.ok
		expect(list.head.next).to.equal(thirdNode)
	})

	it('## can remove tail node', function() { 
		var nodes = [],
			secondToLast,
			thirdToLast

		// nodeArr.forEach(function fn(node){
		// 	list.add(node)
		// })
		addNodeArrayToList(nodeArr,list)

		selNode = list.tail
		secondToLast = list.tail.previous
		thirdToLast = secondToLast.previous

		list.remove(list.tail)

		for(nodeIter = list.head; nodeIter; nodeIter = nodeIter.next) {
			nodes.push(nodeIter)
		}

		expect(nodes).to.not.include(selNode)

		expect(list.tail).to.equal(secondToLast)
		expect(list.tail.next).to.be.not.ok
		expect(list.tail.previous).to.equal(thirdToLast)
	})


	it('## can remove internal node', function() { 
		var nodes = [],
			selNode = undefined,
			selNodePrevious,
			selNodeNext
			

		nodeArr.forEach(function fn(node){
			list.add(node)

			if(node.previous && node.next && !selNode) {
				selNode = node
				selNodePrevious = node.previous
				selNodeNext = node.next
			}
		})		

		list.remove(selNode)

		expect(selNodePrevious.next).to.equal(selNodeNext)
		expect(selNodeNext.previous).to.equal(selNodePrevious)

		for(nodeIter = list.head; nodeIter; nodeIter = nodeIter.next) {
			nodes.push(nodeIter)
		}

		expect(nodes).to.not.include(selNode)

	})

	it('## can clear list', function(done){
			var count = 0

		function removeNodeHandler(node) {
			count++			
			if(!list.head) {
				expect(count).to.equal(nodeArr.length)
				list.removeNodeRemoveListener(removeNodeHandler)
				done()
			}			
		}

		list.addNodeRemoveListener(removeNodeHandler)

		// nodeArr.forEach(function fn(node){
		// 	list.add(node)
		// })
		addNodeArrayToList(nodeArr,list)
		
		list.removeAll()

	})

	it('## can remove node while iterating', function() { 
		var target = Math.floor(nodeArr.length / 2),
			count = newcount = 0,
			newList = [],
			delNode 

		addNodeArrayToList(nodeArr,list)

		for(nodeIter = list.head; nodeIter; nodeIter = nodeIter.next) {
			if(count++ == target ) {
				list.remove(nodeIter)
				delNode = nodeIter
			} 			
		}

		for(nodeIter = list.head; nodeIter; nodeIter = nodeIter.next) {			
			expect(nodeIter).to.not.equal(delNode)
			newcount++
		}

		expect(newcount).to.equal(count-1)
		
	})

	it('## insertion sort correctly sorts sorted nodes' )
	it('## insertion sort correctly sorts reversed nodes' )
	it('## insertion sort correctly sorts mixed nodes' )
	it('## insertion sort correctly retains order of equivalent nodes' )
	it('## merge sort correctly sorts sorted nodes' )
	it('## merge sort correctly sorts reversed nodes' )
	it('## merge sort correctly sorts mixed nodes' )
	it('## merge sort correctly retains order of equivalent nodes' )




})