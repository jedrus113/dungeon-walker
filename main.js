const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

function clear(){
	process.stdout.write('\033c');
}

function copy(o){
	return JSON.parse(JSON.stringify(o));

}

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


function renderLevel(maze, items, level){
	items.forEach(item => {
		try{
			maze[item.l][item.y][item.x] = item.c;
		} catch (err) {}
	})
	maze[level].forEach(x => {
		console.log(x.join(''))
	})
}


class Item{
	constructor(maze, l,x,y,c) {
		this.maze = maze;
		this.known = [];
		this.l = l;
		this.x = x;
		this.y = y;
		this.c = c;
		this.see();
	}
	see(){
		let seePower = 5;
		this.known = []
		this.seeReq(this.l,this.x,this.y,seePower,0,1);
		this.seeReq(this.l,this.x,this.y,seePower,0,-1);
		this.seeReq(this.l,this.x,this.y,seePower,1,0);
		this.seeReq(this.l,this.x,this.y,seePower,-1,0);
		
		this.seeReq(this.l,this.x,this.y,seePower,1,1);
		this.seeReq(this.l,this.x,this.y,seePower,1,-1);
		this.seeReq(this.l,this.x,this.y,seePower,-1,1);
		this.seeReq(this.l,this.x,this.y,seePower,-1,-1);
	}
	seeReq(l,x,y,p,px,py){
		while (this.known.length <= l) this.known.push([]);
		let knownL = this.known[l];
		while (knownL.length <= y) knownL.push([]);
		let knownY = knownL[y];
		while (knownY.length <= x) knownY.push(' ');
		this.known[l][y][x] = this.maze.getBlock(l,x,y);
		if (p>0 && this.maze.check(l,x,y)){
			let p2 = p-1;
			this.seeReq(l,x+px, y+py, p2, px,py);
			if(px!=0 && py!=0){
				this.seeReq(l,x,y,p2,px,0);
				this.seeReq(l,x,y,p2,0,py);
			} else if(px != 0){
				this.seeReq(l,x,y,p2,px,1);
				this.seeReq(l,x,y,p2,px,-1);
			} else {
				this.seeReq(l,x,y,p2,1,py);
				this.seeReq(l,x,y,p2,-1,px);
			}
		}
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
		this.see();
	}
	useStairs(){
		let block = this.maze.maze[this.l][this.y][this.x];
		console.log('Use');
		console.log(block);
		if (block == 'v') this.move(1, 0,0);
		else if (block == '^') this.move(-1,0,0);
	}
	render(items){
		clear();
		renderLevel(copy(this.known), items, this.l);
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
	getBlock(l,x,y){
		return this.maze[l][y][x];
	}
}



maze = new Maze(base_maze);
player = new Item(maze, 0,1,1,'P'),
items = [player]

player.render(items);


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
	player.render(items)
})
console.log("Game started!");
console.log("Please use wasd to navigate and esc to exit.");

