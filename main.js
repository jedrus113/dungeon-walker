
console.log('Starting');
// maze
base_maze = [
	[
		"###############",
		"#             #",
		"#             #",
		"#             #",
		"########## ####",
	],
]

base_maze.forEach(level => {
	for (let i2=0; i2 < level.length; i2++){
		let row = level[i2];
		new_row = [];
		for (let i=0; i<row.length; i++){
			new_row.push(row.charAt(i));
		}
		level[i2] = new_row;
	}
})


function render(maze, items, level){
	full_maze = maze.render();
	console.log(full_maze);
	items.forEach(item => {
		full_maze[item.l][item.y][item.z] = item.c;
		console.log(full_maze[item.l][item.y])
	})
	full_maze[level].forEach(x => {
		console.log(x)
	})
}


class Item{
	constructor(l,x,y,c) {
		this.l = l;
		this.x = x;
		this.y = y;
		this.c = c;
	}
}

class Maze {
	constructor(maze){
		console.log('Maze Start');
		console.log(maze);
		this.maze = maze;
	}
	
	render(){
		return this.maze;
	}
}

items = [
	new Item(0,1,1,'P'),
]

maze = new Maze(base_maze);

render(maze, items, 0)











