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
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
};

Animation.prototype.drawReimuMoveRightFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth + 2;
    yindex = Math.floor(frame / this.sheetWidth) + 2;
    
    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
};

Animation.prototype.drawReimuMoveLeftFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth + 1;
    yindex = Math.floor(frame / this.sheetWidth) + 1;
    
    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
};

Animation.prototype.drawBulletFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 203;
    xindex = frame % (this.frameWidth * 4);
    yindex = 203;
    
    ctx.drawImage(this.spriteSheet,
    		xindex * this.frameWidth+83, yindex,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
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
	this.animation = new Animation(spritesheet, 32, 47, 261, 0.75, 8, true, 1.5);
    this.speed = 185;
    this.ctx = game.ctx;
    Entity.call(this, game, 400, 550);
}

Reimu.prototype = new Entity();
Reimu.prototype.constructor = Reimu;

Reimu.prototype.update = function () {
};

Reimu.prototype.draw = function () {
	
    this.animation.drawReimuStillFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
};

Reimu.prototype.drawLeft = function () {
    this.animation.drawReimuLeftFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
};

Reimu.prototype.drawRight = function () {
    this.animation.drawReimuRightFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
};

function Bullet(game, spritesheet) {
	this.animation = new Animation(spritesheet, 15, 12, 261, .1, 4, true, 1.5);
    this.speed = 230;
    this.ctx = game.ctx;
    Entity.call(this, game, 414, 550);
}

Bullet.prototype = new Entity();
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function () {
	this.y -= this.game.clockTick * this.speed;
	if(this.y < 50) this.y = 550;
};

Bullet.prototype.draw = function () {
	
    this.animation.drawBulletFrame(this.game.clockTick, this.ctx, this.x, this.y);
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
    gameEngine.addEntity(new Bullet(gameEngine, AM.getAsset("./img/reimu_hakurei.png")));
    //gameEngine.addEntity(new drawReimuMoveRightFrame(gameEngine, AM.getAsset("./img/reimu_hakurei.png")));
    
    console.log("All Done!");
});