var heap = undefined;
var people = [
	{name: "Alfredo Bryant", rank: 34},
	{name: "Allen Curtis", rank: 18},
	{name: "Alton Jimenez", rank: 4},
	{name: "Amy Hodges", rank: 9},
	{name: "Andres White", rank: 7},
	{name: "Angelina Thompson", rank: 46},
	{name: "Blanche Stevens", rank: 22},
	{name: "Brent Hudson", rank: 33},
	{name: "Caroline Mills", rank: 32},
	{name: "Cary Underwood", rank: 40},
	{name: "Cassandra Goodwin", rank: 13},
	{name: "Charlie Delgado", rank: 44},
	{name: "Craig Casey", rank: 28},
	{name: "Danny Padilla", rank: 8},
	{name: "Franklin Watkins", rank: 5},
	{name: "Freddie Armstrong", rank: 36},
	{name: "Geraldine Fowler", rank: 39},
	{name: "Greg Bennett", rank: 15},
	{name: "Hazel Williams", rank: 27},
	{name: "Heather Harvey", rank: 2},
	{name: "Howard Vaughn", rank: 6},
	{name: "Jared Sanders", rank: 47},
	{name: "Jeanette Sparks", rank: 19},
	{name: "Jeanne Webster", rank: 49},
	{name: "Jodi Henderson", rank: 3},
	{name: "Kara Schmidt", rank: 12},
	{name: "Kristin Blair", rank: 35},
	{name: "Lee Vasquez", rank: 23},
	{name: "Lisa Cook", rank: 1},
	{name: "Lola Edwards", rank: 31},
	{name: "Lynn Garner", rank: 48},
	{name: "Mack Klein", rank: 29},
	{name: "Margaret Powell", rank: 42},
	{name: "Martha Bishop", rank: 45},
	{name: "Micheal George", rank: 21},
	{name: "Natasha Owens", rank: 20},
	{name: "Nicholas Mendez", rank: 37},
	{name: "Oliver Roberson", rank: 14},
	{name: "Phil Jefferson", rank: 30},
	{name: "Regina Copeland", rank: 17},
	{name: "Robin Cruz", rank: 16},
	{name: "Robyn Robinson", rank: 41},
	{name: "Roosevelt Hernandez", rank: 10},
	{name: "Rosie Valdez", rank: 11},
	{name: "Ross Scott", rank: 25},
	{name: "Sara Steele", rank: 50},
	{name: "Shane Warren", rank: 38},
	{name: "Susie Owen", rank: 24},
	{name: "Tasha Burke", rank: 43},
	{name: "Taylor Mcbride", rank: 26}
]

const initializeHeap = () => {
	heap = new MinHeap((element) => {
		return element.rank;
	});
	for (const person of people) {
		heap.enqueue(person);
	}
	return heap;
};

const getNodesAndEdges = (heap) => {
	let nodes = []
	let edges = []
	const helper = (vertex) => {
		if (vertex === undefined) {
			return;
		}
		// save a node representing the current 
		node = {
			id: vertex.element.name,
			label: vertex.element.name + ' (' + vertex.element.rank + ')'
		}
		nodes.push(node);
		// save an edge representing the relationship with parent
		if (vertex.parent != undefined) {
			edge = {
				from: vertex.parent.element.name,
				to: vertex.element.name,
				label: edges.length
			}
			edges.push(edge);
		}
		// add all children of the vertex
		for (const child of vertex.children) {
			helper(child);
		}
	};
	helper(heap.root);
	const data = {
		nodes: nodes,
		edges: edges
	}
	return data;
}

const displayGraph = (heap) => {
	const data = getNodesAndEdges(heap);
	// create a network
	const container = document.getElementById('network');
	const options = {
		layout: {
			hierarchical: {
				direction: "UD",
				nodeSpacing: 175,
				levelSeparation: 200,
				sortMethod: "directed",
				parentCentralization: true,
			}
		},
		interaction: {
			dragNodes: false
		},
		physics: {
			enabled: false
		},
		nodes: {
			font: {
				color: '#ffffff'
			},
			color: {
				background: '#dd0000',
				border: '#880000'
			},
			margin: {
				top: 5,
				bottom: 5,
				left: 20,
				right: 20
			}
		}
	};
	const network = new vis.Network(container, data, options);
}


$(document).ready(() => {
	people = people.sort(function (a, b) {
		var nameA = a.name.toUpperCase(); // ignore upper and lowercase
		var nameB = b.name.toUpperCase(); // ignore upper and lowercase
		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		return 0;
	});
	var heap = initializeHeap();

	$("#dequeue_button").click(() => {
		vertex = heap.dequeue();
		console.log(vertex);
		displayGraph(heap);
		$('#people_on_your_team').append(vertex.name + '<br/>');

		let id = 'delete_' + vertex.name.replace(' ', '');
		$('#' + id).remove();
	})

	let deleteButtons = $('#delete_buttons');
	for (person of people) {
		let id = 'delete_' + person.name.replace(' ', '');
		let $button = $('<p id="' + id + '"><button>DELETE</BUTTON>&nbsp;' + person.name + '</p>');
		deleteButtons.append($button);
		let f = (p, i) => {
			$button.click((e) => {
				$('#' + i).remove();
				heap.delete((vertex) => vertex.element.name == p.name);
				displayGraph(heap);
				$('#deleted_people').append(p.name + "<br/>");
			})
		};
		f(person, id);
	}

	displayGraph(heap);
})