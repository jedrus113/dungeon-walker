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

function create () {
  for (let i=0; i<100; i++)
    this.add.sprite(20*i, 100, 'wall').setFrame(i+300);

  this.add.sprite(100, 200, 'wall').setFrame(300);

  var logo = this.add.sprite(400, 200, 'human');
  logo.setFrame(0);

}
