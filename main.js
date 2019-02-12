const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

var maps = require('./maps');

base_maze = maps.map1
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
	process.stdout.write('\033c');
	full_maze = maze.render();
	items.forEach(item => {
		full_maze[item.l][item.y][item.x] = item.c;
	})
	full_maze[level].forEach(x => {
		console.log(x.join(''))
	})
}


class Item{
	constructor(maze, l,x,y,c) {
		this.maze = maze;
		this.l = l;
		this.x = x;
		this.y = y;
		this.c = c;
	}
	move(l, x, y){
		let newL = this.l + l;
		let newX = this.x + x;
		let newY = this.y + y;
		if( this.maze.check(newL,newX,newY) ) {
			this.l = newL;
			this.x = newX;
			this.y = newY;
		}
	}
	useStairs(){
		let block = this.maze.maze[this.l][this.y][this.x];
		console.log('Use');
		console.log(block);
		if (block == 'v') this.move(1, 0,0);
		else if (block == '^') this.move(-1,0,0);
	}
}

class Maze {
	constructor(maze){
		console.log('Maze Start');
		this.maze = maze;
	}
	check(l,x,y){
		try {
			let block = this.maze[l][y][x];
			if (block === 'S'){
				console.log("\nCongratulations!\nYou Won!");
				process.exit();
			}
			return block == ' ' || block == 'v' || block == '^';
		} catch(err){}
		
		return false;
	}
	render(){
		return JSON.parse(JSON.stringify(this.maze));
	}
}



maze = new Maze(base_maze);
player = new Item(maze, 0,1,1,'P'),
items = [player]

render(maze, items, 0)


process.stdin.on('keypress', (str, key) => {
	if (key.name == 'escape') {
		console.log("Quiting...");
		process.exit();
	}
	else if (str == 'w') player.move(0,0,-1);
	else if (str == 's') player.move(0,0,1);
	else if (str == 'a') player.move(0,-1,0);
	else if (str == 'd') player.move(0,1,0);
	else if (str == ' ') player.useStairs(0,0,0);
	render(maze, items, player.l)
})
console.log("Game started!");
console.log("Please use wasd to navigate and esc to exit.");

