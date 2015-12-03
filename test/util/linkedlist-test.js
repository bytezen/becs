var expect = require('chai').expect,
	stampit = require('stampit'),
 	linkedlistPrototype = require('../../bzutil/linkedlist'),
 	_ = require('underscore')
 


describe('#Nodelist ',function(){
	var nodeArr = []

	var MockNodePrototype = stampit().props({next: undefined, 
									previous: undefined, 
									label: ""})



	before('initialize mocks', function(){
		_.range(5).forEach( function(i,ind,arr) { 
						node = MockNodePrototype.create({label: "node" + i })
						nodeArr.push(node)
					})		
	})

	beforeEach('intialize list',function(){
		list = linkedlistPrototype.create()
		clearLinkedList()
	})


	it('## can add node', function() {			
		list.add(nodeArr[0])
		expect(list.head).to.equal(nodeArr[0])
	})

	it('## can add more than one node', function() {			
		list.add(nodeArr[0])
		expect(list.head).to.equal(nodeArr[0])
	})


	it('## can remove single node', function() { 
		list.add(nodeArr[0])
		// list.remove(nodeArr[0])
		list.remove(list.head)
		expect(list.head).to.not.be.ok
		expect(list.tail).to.not.be.ok
	})


	it('## can remove head with two nodes', function() {

		var mockNodeList = makeLinkedList(0,2)

		list.add(mockNodeList[0])

		list.add(mockNodeList[1])
		list.remove(mockNodeList[0])
		expect(list.head).to.equal(mockNodeList[1]).to.equal(list.tail)
	})

	it('## can remove tail with two nodes ', function() { 
		list.add(nodeArr[0])	
		list.add(nodeArr[1])
		list.remove(nodeArr[1])
		expect(list.head).to.equal(nodeArr[0]).to.equal(list.tail)
	})


	it('## can iterate through all nodes', function() { 
		var count = 0
		var mockNodes = makeLinkedList(0,nodeArr.length)

		mockNodes.forEach( function(n) { list.add(n) } )
		for(nodeIter = list.head; nodeIter ; nodeIter = nodeIter.next){
			expect(nodeIter).to.equal(mockNodes[count])
			count++
		}

		expect(count).to.equal(nodeArr.length)

	})	

	it('## can access list as array through list property', function() { 
		var mockNodes = makeLinkedList(0,nodeArr.length)

		mockNodes.forEach( function(n) { list.add(n) } )
		var nodeList = list.list

		expect(nodeList).to.have.length(nodeArr.length)
		expect(nodeList.every( function(n){ return nodeList.indexOf(n) >=0; })).to.be.true

	})	

	it('## can remove head node', function() { 

		var count = 0
		var mockNodes = makeLinkedList(0,nodeArr.length)

		mockNodes.forEach( function(n) { list.add(n) } )
		var nodeRemoved = list.head
		list.remove(nodeRemoved)

		for(var nodeIter = list.head; nodeIter; nodeIter = nodeIter.next) {
			expect(nodeIter).to.not.equal(nodeRemoved)
		}

		expect(list.head).to.equal(mockNodes[1])
		expect(list.head.previous).to.not.be.ok
		expect(list.head.next).to.equal(mockNodes[2])
	})

	it('## can remove tail node', function() { 
		var count = 0
		var mockNodes = makeLinkedList(0,nodeArr.length),
			oldtail = mockNodes[mockNodes.length-1]
			newtail = mockNodes[mockNodes.length-2]
			newSecondToLast = mockNodes[mockNodes.length-3]

		mockNodes.forEach( function(n) { list.add(n) } )
		var nodeRemoved = list.tail
		list.remove(nodeRemoved)

		for(var nodeIter = list.head; nodeIter; nodeIter = nodeIter.next) {
			expect(nodeIter).to.not.equal(nodeRemoved)
		}

		expect(list.tail).to.equal( newtail )
		expect(list.tail.previous).to.equal( newSecondToLast )
		expect(list.tail.next).to.not.be.ok
	})


	it('## can remove internal node', function() { 
		var count = 0
		var mockNodes = makeLinkedList(0,nodeArr.length),
			nodeToRemove = mockNodes[3]
			nodeAfter = mockNodes[4]
			nodeBefore = mockNodes[2]

		mockNodes.forEach( function(n) { list.add(n) } )

		list.remove(nodeToRemove)

		for(var nodeIter = list.head; nodeIter; nodeIter = nodeIter.next) {
			expect(nodeIter).to.not.equal( nodeToRemove )
		}

		expect(nodeAfter.previous).to.equal( nodeBefore )
		expect(nodeBefore.next).to.equal( nodeAfter )
	})		


	it('## can clear list', function(){
		var mockNodes = makeLinkedList(0,nodeArr.length)

		mockNodes.forEach( function(n) { list.add(n) } )
		
		list.removeAll()
		expect(list.head).to.be.null
		expect(list.tail).to.be.null


	})

	it('## can remove node while iterating', function() { 
		var mockNodes = makeLinkedList(0,nodeArr.length),
			indToRemove = 3,
			count = 0

		mockNodes.forEach( function(n) { list.add(n) } )


		for(nodeIter = list.head; nodeIter; nodeIter = nodeIter.next) {			
			if( count++ == indToRemove ) {
				list.remove(mockNodes[indToRemove])
			}

		}

		for(nodeIter = list.head; nodeIter; nodeIter = nodeIter.next) {			
			expect(nodeIter).to.not.equal(mockNodes[indToRemove])
		}

		expect( mockNodes[indToRemove-1].next ).to.equal( mockNodes[indToRemove + 1] )
		expect( mockNodes[indToRemove+1].previous ).to.equal( mockNodes[indToRemove - 1] )
		
	})

	// it('## insertion sort correctly sorts sorted nodes' )
	// it('## insertion sort correctly sorts reversed nodes' )
	// it('## insertion sort correctly sorts mixed nodes' )
	// it('## insertion sort correctly retains order of equivalent nodes' )
	// it('## merge sort correctly sorts sorted nodes' )
	// it('## merge sort correctly sorts reversed nodes' )
	// it('## merge sort correctly sorts mixed nodes' )
	// it('## merge sort correctly retains order of equivalent nodes' )

	function clearLinkedList() {
		nodeArr.forEach(function(n){
			n.previous = null
			n.next = null
		})
	}

	function makeLinkedList(start,length) {
			var arr = nodeArr.slice(start,length)
			arr.forEach(function (node,ind){
											node.previous = ind > 0 ? arr[ind-1] : null
											node.next = ind < arr.length-1 ? arr[ind+1] : null
										})			
			return arr

	}
})