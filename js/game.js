import {map1} from "./logic/maps.js";

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
    create: create
  }
};

const game = new Phaser.Game(config);

function preload ()
{
  this.load.spritesheet('human', 'assets/characters/human.png', { frameWidth: 16, frameHeight: 16 });
  this.load.spritesheet('map', 'assets/map/map.png', { frameWidth: 24, frameHeight: 24 });
}

function create () {
  let player;
  let level = map1[0];
  for (let i2=0; i2 < level.length; i2++){
      let row = level[i2];
      for (let i=0; i<row.length; i++){
        let el = 3;
        if (row[i] == '#') el = 0;
        else if (row[i] == '.') el = 16;
        this.add.sprite(12 + 24*i, 12 + 24*i2, 'map').setFrame(el);
          if (row[i] == 'S') player = this.add.sprite(12 + 24*i, 12 + 24*i2, 'human').setScale(1.5);
      }
  }

}
