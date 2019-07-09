/**

const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

function clear(){
	process.stdout.write('\033c');
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
**/
import {settings} from "./settings.js";



function copy(o){
	return JSON.parse(JSON.stringify(o));

}

function renderLevel(maze, items, cl, cx, cy){
	if (items){
		items.forEach(item => {
			try{
				maze[item.l][item.y][item.x] += item.c;
			} catch (err) {}
		})
	}
	let start_cx = cx - settings.seePower;
	let start_cy = cy - settings.seePower;
	let seeElems = (settings.seePower * 2) + 1;
	if (start_cx < 0) start_cx = 0;
	if (start_cy < 0) start_cy = 0;

	let visible_level = [];
	maze[cl].forEach(x => {
		if(--start_cy < 0){
			let new_x = x.splice(start_cx, 11);
            new_x = [" ",  ...new_x, " "];
			visible_level.push(new_x)
		}
	});
	return visible_level
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
		this.saw = [];
		this.render()
	}
	render(items){
		if (!items) items = [];
		items.push(this);
		this.see();
		this.saw = renderLevel(copy(this.known), items, this.l, this.x, this.y);
	}
	see() {
		let seePower = settings.seePower;
		this.known = [];
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


function move(direction){
	switch(direction){
		case 'up':
			player.move(0,0,-1);
			break;
		case 'down':
			player.move(0,0,1);
			break;
		case 'left':
			player.move(0,-1,0);
			break;
		case 'right':
			player.move(0,1,0);
			break;
		case 'use':
			player.useStairs(0,0,0);
			break;
	}
	player.render(items)
}
console.log("Game started!");
console.log("Please use wasd to navigate and esc to exit.");

export {Player, Maze}
