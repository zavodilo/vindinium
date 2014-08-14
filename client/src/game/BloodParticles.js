var PIXI = require("pixi.js");
var loadTexture = require("./loadTexture");
var smoothstep = require("smoothstep");
var tilePIXI = require("./tilePIXI");

var bloodTextures = loadTexture("bloodParticles.png");

var bloodPossibleTextures = [0,1,2,3,4,5,6,7].map(function (i) {
  return tilePIXI(8)(bloodTextures, i, 0);
});

function BloodParticle (pos, vel, duration) {
  PIXI.Sprite.call(this, bloodPossibleTextures[Math.floor(Math.random()*bloodPossibleTextures.length)]);
  this.position = pos.clone();
  this.vel = vel.clone();
  this.lastRender = this.startTime = Date.now();
  this.duration = duration;
}
BloodParticle.prototype = Object.create(PIXI.Sprite.prototype);
BloodParticle.prototype.constructor = BloodParticle;

BloodParticle.prototype.destroy = function () {
  this.parent.removeChild(this);
};
BloodParticle.prototype.render = function () {
  var now = Date.now();
  var progress = Math.min((now - this.startTime) / this.duration, 1);
  var elapsed = (now - this.lastRender) / 1000;

  this.position.x += this.vel.x * elapsed;
  this.position.y += this.vel.y * elapsed;

  this.alpha = smoothstep(1.0, 0.5, progress);

  this.lastRender = now;
  if (progress === 1)
    this.destroy();
};

function BloodParticles(fromPos, toPos, duration) {
  PIXI.DisplayObjectContainer.call(this);
  this.startTime = Date.now();

  this.duration = duration;

  this.position = toPos.clone();
  var delta = new PIXI.Point(toPos.x-fromPos.x, toPos.y-fromPos.y);
  var angle = Math.atan2(delta.y, delta.x);
  var dist = Math.sqrt(delta.x*delta.x + delta.y*delta.y);
  for (var i=0; i<16; ++i) {
    var a = angle + 0.8 * Math.PI * (Math.random()-0.5);
    var velocity = dist * (0.6 + 0.5 * Math.random());
    var dur = duration * (0.6 + 0.8 * Math.random());
    var x = 8 * (Math.random()-0.5) + Math.cos(a) * velocity;
    var y = 8 * (Math.random()-0.5) + Math.sin(a) * velocity;
    this.addChild(new BloodParticle(new PIXI.Point(0.0, 0.0), new PIXI.Point(x, y), dur));
  }
}
BloodParticles.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
BloodParticles.prototype.constructor = BloodParticles;

BloodParticles.prototype.destroy = function () {
  this.children.forEach(function (p) {
    p.destroy();
  });
  this.parent.removeChild(this);
};
BloodParticles.prototype.render = function () {
  var progress = Math.min((Date.now() - this.startTime) / this.duration, 1);
  this.children.forEach(function (p) {
    p.render();
  });
  if (progress === 1)
    this.destroy();
};


module.exports = BloodParticles;
