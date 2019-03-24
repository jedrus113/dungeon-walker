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
var cons = require('./constants');

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


function renderLevel(maze, items, cl, cx, cy){

	items.forEach(item => {
		try{
			maze[item.l][item.y][item.x] = item.c;
		} catch (err) {}
	})
	let start_cx = cx - cons.seePower;
	let start_cy = cy - cons.seePower;
	let seeElems = (cons.seePower * 2) + 1
	if (start_cx < 0) start_cx = 0;
	if (start_cy < 0) start_cy = 0;
	maze[cl].forEach(x => {
		if(--start_cy < 0){
			let new_x = x.splice(start_cx, 11);
			console.log(new_x.join(' '))
		}
	})
}


class Item{
	constructor(maze, l,x,y,c){
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
		if (block == 'v') this.move(1, 0,0);
		else if (block == '^') this.move(-1,0,0);
	}

}

class Player extends Item {	
	constructor(maze, l,x,y,c){
		super(maze, l,x,y,c);
		this.known = [];
	}
	render(items){
		this.see();
		clear();
		renderLevel(copy(this.known), items, this.l, this.x, this.y);
	}
	see() {
		let seePower = cons.seePower;
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
	seeReq(l,x,y,p,px,py,u=false) {
		while (this.known.length <= l) this.known.push([]);
		let knownL = this.known[l];
		while (knownL.length <= y) knownL.push([]);
		let knownY = knownL[y];
		while (knownY.length <= x) knownY.push(' ');
		this.known[l][y][x] = this.maze.getBlock(l,x,y);
		if (p>0 && this.maze.check(l,x,y)){
			let p2 = p-1;
			this.seeReq(l,x+px, y+py, p2, px,py,u);
			if (u) return;
			if(px!=0 && py!=0){
				this.seeReq(l,x,y,p2,px,0,true);
				this.seeReq(l,x,y,p2,0,py,true);
			} else if(px != 0){
				this.seeReq(l,x,y,p2,px,1,true);
				this.seeReq(l,x,y,p2,px,-1,true);
			} else {
				this.seeReq(l,x,y,p2,1,py,true);
				this.seeReq(l,x,y,p2,-1,py,true);
			}
		}
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
			return block == '.' || block == 'v' || block == '^';
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
player = new Player(maze, 0,1,1,'P'),
items = [player]

player.render(items);


process.stdin.on('keypress', (str, key) => {
	if (str == 'q' || key.name == 'escape') {
		console.log("Quiting...");
		process.exit();
	}
	else if (str == 'w' || key.name == 'up')
		player.move(0,0,-1);
	else if (str == 's' || key.name == 'down')
		player.move(0,0,1);
	else if (str == 'a' || key.name == 'left')
		player.move(0,-1,0);
	else if (str == 'd' || key.name == 'right')
		player.move(0,1,0);
	else if (str == ' ') player.useStairs(0,0,0);
	player.render(items)
})
console.log("Game started!");
console.log("Please use wasd to navigate and esc to exit.");
