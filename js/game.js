var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
  },
  scene: {
    preload: preload,
    create: create
  }
};

var game = new Phaser.Game(config);

function preload ()
{
  this.load.spritesheet('human', 'assets/characters/human.png', { frameWidth: 16, frameHeight: 16 });
  this.load.spritesheet('wall', 'assets/map/map.png', { frameWidth: 16, frameHeight: 16 });
}

function create ()
{
  var wall = this.add.sprite(100, 100, 'wall');
  wall.setFrame(0);

  var logo = this.add.sprite(400, 100, 'human');
  logo.setFrame(0);

}
