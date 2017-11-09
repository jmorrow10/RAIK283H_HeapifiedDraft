/* exported MinHeap */

const identity = (value) => value;

const HEAP_DEGREE = 2;

class MinHeapVertex {
	constructor(element) {
		this.element = element;
		this.parent = undefined;
		this.children = [];
		this.height = 0;
		this.id = undefined;
	}

	swapWith(vertex) {
		const swap = this.element;
		this.element = vertex.element;
		vertex.element = swap;
	}

	getLeastChild(vertexMetric) {
		let result = undefined;
		for (const child of this.children) {
			if (result === undefined || vertexMetric(child) < vertexMetric(result)) {
				result = child;
			}
		}
		return result;
	}

	_updateHeight() {
		const oldHeight = this.height;
		this.height = Math.max(-1, ...this.children.map((child) => child.height)) + 1;
		if (this.height !== oldHeight && this.parent !== undefined) {
			this.parent._updateHeight(); // eslint-disable-line no-underscore-dangle
		}
	}

	addChild(child) {
		console.assert(child.parent === undefined, `Tried to add ${child} as a child of ${this} when it already has the parent ${child.parent}.`);
		this.children.push(child);
		child.parent = this;
		this._updateHeight();
	}

	removeChild(child) {
		const index = this.children.indexOf(child);
		console.assert(index >= 0, `Tried to remove ${child} as a child of ${this}, which is not its parent.`);
		this.children.splice(index, 1);
		child.parent = undefined;
		this._updateHeight();
	}

	toString() {
		return `MinHeapVertex(${this.element})`;
	}
}

class MinHeap {
	constructor(metric = identity) {
		this.metric = metric;
		this.root = undefined;
		this.size = 0;
	}

	_getTail(forInsertion) {
		if (this.size==0){
			return undefined;
		}
		// get the parent of the next element to be added
		if (forInsertion){
			return this.search((vertex) => {return vertex.id == Math.max(1,Math.floor((this.size+HEAP_DEGREE-1)/HEAP_DEGREE));})
		}
		// get the last element
		else{
			return this.search((vertex) => {return vertex.id == this.size;})
		} 
	}

	_destroy(vertex) {
		console.assert(vertex.children.length === 0, `Tried to destroy the vertex ${vertex}, which still has children.`);
		if (vertex.parent !== undefined) {
			vertex.parent.removeChild(vertex);
		}
		if (this.root === vertex) {
			this.root = undefined;
		}
		this.size--;
	}

	_heapify(start, upwards) {
		if (start !== undefined) {
			const getRelative = upwards ? (vertex) => vertex.parent : (vertex) => vertex.getLeastChild((child) => this.metric(child.element));
			for (let vertex = start, relative = getRelative(vertex); relative !== undefined; vertex = relative, relative = getRelative(vertex)) {
				if ((this.metric(vertex.element) < this.metric(relative.element)) === upwards) {
					vertex.swapWith(relative);
				} else {
					break;
				}
			}
		}
	}

	enqueue(element) {
		const tail = this._getTail(true);
		const vertex = new MinHeapVertex(element);
		if (tail === undefined) {
			this.root = vertex;
		} else {
			tail.addChild(vertex);
		}
		this.size++;
		vertex.id = this.size;
		this._heapify(vertex, true);
	}

	peek() {
		return this.root !== undefined ? this.root.element : undefined;
	}

	dequeue() {
		console.assert(this.root !== undefined, 'Tried to dequeue from an empty MinHeap.');
		const result = this.root.element;
		const tail = this._getTail(false);
		this.root.swapWith(tail);
		this._destroy(tail);
		this._heapify(this.root, false);
		return result;
	}

	delete(metric = identity) {
		// TODO: stub
	}

	search(metric) {
		const helper = (vertex) => {
			// base case (no vertices yet)
			if (this.size == 0){
				return undefined;
			}
			// base case (this is the vertex we're looking for!)
			if (metric(vertex)) {
				return vertex;
			}
			// recursive case
			for (const child of vertex.children) {
				const toReturn = helper(child);
				if (toReturn != undefined) {
					return toReturn;
				}
			}
			return undefined;
		};
		const vertex = this.root;
		return helper(vertex);
	}

	toString() {
		const helper = (vertex) => {
			if (vertex === undefined) {
				return '[empty]';
			}
			if (vertex.children.length === 0) {
				return `${vertex.element}[${vertex.height}]`;
			}
			let accumulator = '';
			for (const child of vertex.children) {
				accumulator += (accumulator.length === 0 ? '' : ', ') + helper(child);
			}
			return `${vertex.element}[${vertex.height}] { ${accumulator} }`;
		};
		return helper(this.root);
	}
}
