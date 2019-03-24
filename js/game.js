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
  this.load.image('human', 'assets/characters/human.png');
  this.load.image('wall', 'assets/map/map.png');
}

function create ()
{
  this.add.image(100, 100, 'wall');

  var logo = this.physics.add.image(400, 100, 'human');

}
