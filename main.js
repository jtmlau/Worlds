var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawReimuStillFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);
    
    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // (x,y) source from sheet
                 this.frameWidth, this.frameHeight, // (x,y) size of sprite.
                 x, y, // sprite position on screen.
                 this.frameWidth * this.scale, // sprite scale; x
                 this.frameHeight * this.scale); // sprite scale; y
};

Animation.prototype.drawBulletFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    
    var frame = this.currentFrame();
    var xindex = 83;
    var yindex = 203;

    ctx.drawImage(this.spriteSheet,
    		xindex, yindex,  // (x,y) source from sheet
            15, 12, // (x,y) size of sprite.
            x, y, // position on screen.
            15 * this.scale, // sprite scale; x
            12 * this.scale); // sprite scale; y
};

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
};

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
};

// no inheritance

function Background(game, spritesheet) {
	this.x = 0;
	this.y = 0;
	this.spritesheet = spritesheet;
	this.game = game;
	this.speed = 0;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 0);
};

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
	this.y += this.game.clockTick * this.speed;
    if (this.y > 0) this.y = -500;
    Entity.prototype.update.call(this);
};

Background.prototype.draw = function () {
	this.ctx.drawImage(this.spritesheet, 0, 0
			, 189, 634,
            this.x, this.y, 189 * 4.25, 634*2);
};

function Reimu(game, spritesheet) {
	this.animation = new Animation(spritesheet, 32, 47, 261, 0.75, 8, true, 1.5); // Creates the Reimu animation.
	this.bulletAnimation = new Animation(spritesheet, 15, 12, 261, .1, 4, false, 1.5); // Create's the Bullet animation for Reimu.
    this.speed = 185;
    this.bulletSpeed = 230;
    this.isShooting = false;
    this.ctx = game.ctx;
    Entity.call(this, game, 400, 550);
}

Reimu.prototype = new Entity();
Reimu.prototype.constructor = Reimu;

Reimu.prototype.update = function () {
	if(this.game.space) { // If the space key is pressed.
		this.isShooting = true;
		this.y = 550;
	}
	if(this.isShooting){
		if(this.bulletAnimation.isDone()){
			this.bulletAnimation.elapsedTime = 0;
			this.isShooting = false;
		}
		this.y -= this.game.clockTick * this.bulletSpeed; // Bullet moves towards the top of the screen
	}
	Entity.prototype.update.call(this);
};

Reimu.prototype.draw = function () {
	if(this.isShooting){
		this.animation.drawBulletFrame(this.game.clockTick, this.ctx, this.x+15, this.y); // Draws bullet onto the canvas.
		this.animation.drawReimuStillFrame(this.game.clockTick, this.ctx, this.x, 550); // Draws Reimu onto canvas in a static position. Need to shange once we get Reimu moving around screen.
	}else {
		this.animation.drawReimuStillFrame(this.game.clockTick, this.ctx, this.x, this.y);
	}
    Entity.prototype.draw.call(this);
};

AM.queueDownload("./img/desert_background.jpg");
AM.queueDownload("./img/reimu_hakurei.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/desert_background.jpg")));
    gameEngine.addEntity(new Reimu(gameEngine, AM.getAsset("./img/reimu_hakurei.png")));
    
    console.log("All Done!");
});