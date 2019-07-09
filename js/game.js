import {map1} from "./logic/maps.js";
import {Player, Maze} from "./logic/main.js";

map1.forEach(level => {
    for (let i2=0; i2 < level.length; i2++){
        let row = level[i2];
        let new_row = [];
        for (let i=0; i<row.length; i++){
            new_row.push(row.charAt(i));
        }
        level[i2] = new_row;
    }
});

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

const game = new Phaser.Game(config);

function preload ()
{
  this.load.spritesheet('human', 'assets/characters/human.png', { frameWidth: 16, frameHeight: 16 });
  this.load.spritesheet('map', 'assets/map/map.png', { frameWidth: 24, frameHeight: 24 });
}

function create () {
    this.sleep_input_till = 0;
    this.maze = new Maze(map1);
    this.custom_player = new Player(this.maze, 0,1,1,'P');
    this.map_render = map_render;
    this.key_up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.key_down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.key_left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.key_right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.key_use = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

function update(time, delta) {
    let sleep_input = 250;
    if (time > this.sleep_input_till){
        if (this.key_up.isDown) {
            this.custom_player.move(0,0,-1);
            this.sleep_input_till = time + sleep_input;
        }
        else if (this.key_down.isDown) {
            this.custom_player.move(0,0,1);
            this.sleep_input_till = time + sleep_input;
        }
        else if (this.key_left.isDown) {
            this.custom_player.move(0,-1,0);
            this.sleep_input_till = time + sleep_input;
        }
        else if (this.key_right.isDown) {
            this.custom_player.move(0,1,0);
            this.sleep_input_till = time + sleep_input;
        }
        else if (this.key_use.isDown) {
            this.custom_player.useStairs(0,0,0);
            this.sleep_input_till = time + sleep_input;
        }
    }
    this.custom_player.render();
    this.map_render();
}

function map_render() {
    let level = this.custom_player.saw;
    for (let i2=0; i2 < level.length; i2++){
        let row = level[i2];
        for (let i=0; i<row.length; i++){
            let el = 3;
            if (row[i] == '#') el = 0;
            else if (row[i] == '.') el = 16;
            this.add.sprite(12 + 24*i, 12 + 24*i2, 'map').setFrame(el);
            if (row[i] == 'P') this.player = this.add.sprite(12 + 24*i, 12 + 24*i2, 'human').setScale(1.5);
        }
    }
}
