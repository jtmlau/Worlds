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

Animation.prototype.drawReimuFrame = function (tick, ctx, x, y, left, right) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    
    
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    
    if(left){
    	yindex = Math.floor(frame / this.sheetWidth)+1;
    } else if(right){
    	yindex = Math.floor(frame / this.sheetWidth)+2;
    } else {
    	yindex = Math.floor(frame / this.sheetWidth);
    }
    
    xindex = frame % this.sheetWidth;
    
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
	this.animation = new Animation(spritesheet, 32, 47, 261, .75, 8, true, 1.5); // Creates the Reimu animation.
	this.bulletAnimation = new Animation(spritesheet, 15, 12, 261, .5, 4, false, 1.5); // Create's the Bullet animation for Reimu.
	this.rightAnimation = new Animation(spritesheet, 32, 47, 261, 0.75, 8, true, 1.5); // Creates the Reimu's move right animation.
	this.leftAnimation = new Animation(spritesheet, 32, 47, 261, 0.75, 8, true, 1.5); // Creates the Reimu's move left animation.
    this.speed = 185;
    this.bulletSpeed = 230;
    this.bulletY = this.y;
    this.isShooting = false;
    this.moveRight = false;
    this.moveLeft = false;
    this.moveUp = false;
    this.moveDown = false;
    this.ctx = game.ctx;
    Entity.call(this, game, 400, 550);
}

Bullet.prototype = new Entity();
Bullet.prototype.constructor = Bullet;

function Bullet(game, spritesheet) {
	this.animation = new Animation(spritesheet, 15, 12, 261, .5, 4, false, 1.5); // Create's the Bullet animation for Reimu.
	this.speed = 200;
	this.X;
	this.Y;
	this.ctx = game.ctx;
	Entity.call(this, game, 400, 550);
}

Bullet.prototype.update = function() {
    //console.log("bullet update");
    this.y -= this.game.clockTick * this.speed;
    
    Entity.prototype.update.call(this);
}

Bullet.prototype.draw = function () {
    //console.log("bullet draw func");
    this.animation.drawBulletFrame(this.game.clockTick, this.ctx, this.x, this.y);
    
    Entity.prototype.draw.call(this);
};

Reimu.prototype = new Entity();
Reimu.prototype.constructor = Reimu;

b = [];

Reimu.prototype.update = function () {
	
	var that = this;
	
	if(this.game.space) { // If the space key is pressed.
		this.isShooting = true;
		this.bulletY = that.y;
	}
	
	if(this.game.left) { // If the left arrow key is pressed.
		this.moveLeft = true;
}
	if(this.game.right) { // If the right arrow key is pressed.
		this.moveRight = true;
	}if(this.game.up) { // If the up arrow key is pressed.
		this.moveUp = true;
	}if(this.game.down) { // If the down arrow key is pressed.
		this.moveDown = true;
	}
	
	if(this.isShooting){
		if(this.bulletAnimation.isDone()){
			this.bulletAnimation.elapsedTime = 0;
			this.isShooting = false;
		}
		
		
		
		//loop?
		
		this.bulletY -= this.game.clockTick * this.bulletSpeed; // Bullet moves towards the top of the screen
	}if(this.moveRight){
		this.x += this.game.clockTick * this.speed; // Reimu moves right towards the side of the screen
		
	}if(this.moveLeft){
		this.x -= this.game.clockTick * this.speed; // Reimu moves right towards the side of the screen
	}if(this.moveUp){
		this.y -= this.game.clockTick * this.speed; // Reimu moves towards the top of the screen
		
	}if(this.moveDown){
		this.y += this.game.clockTick * this.speed; // Reimu moves towards the top of the 
	}
	
	if(!this.game.left) { // If the left arrow key is pressed.
		this.moveLeft = false;
}
	if(!this.game.right) { // If the right arrow key is pressed.
		this.moveRight = false;
	}if(!this.game.up) { // If the up arrow key is pressed.
		this.moveUp = false;
	}if(!this.game.down) { // If the down arrow key is pressed.
		this.moveDown = false;
	}if(!this.game.space) {
		this.isShooting = false;
	}
	
	b.forEach(function(element)
	{
		element.update();
		element.draw();
	});
	
	//console.log(b);
	
	Entity.prototype.update.call(this);
};

Reimu.prototype.draw = function () {

	if(this.isShooting){
		
		temp = new Bullet(this.game, AM.getAsset("./img/reimu_hakurei.png"));
		
		temp.x = this.x+15;
		temp.y = this.bulletY;
		
		this.game.addEntity(temp);
		
		
		this.animation.drawBulletFrame(this.game.clockTick, this.ctx, this.x+15, this.bulletY); // Draws bullet onto the canvas.
		b.push(temp)
	}
		
	this.animation.drawReimuFrame(this.game.clockTick, this.ctx, this.x, this.y)
    Entity.prototype.draw.call(this);
};
function BadBullet(game, spritesheet, x, y) {
	this.animation = new Animation(spritesheet, 100,100, 100, 1, 1, true, 1);
	this.speed = 100;
	this.ctx = game.ctx;
	Entity.call(this, game, x, 0);
	//this.angle = angle;
	this.x = x;
	this.y = y;
}
BadBullet.prototype = new Entity();
BadBullet.prototype.constructor = BadBullet;
BadBullet.prototype.update = function() {
	this.y += this.game.clockTick * this.bulletSpeed;//move down
	//add angle later
}
BadBullet.prototype.draw = function () {
	this.animation.drawBadBullet(this.game.clockTick, this.ctx, this.x, this.y);
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
	gameEngine.addEntity(new BadBullet(gameEngine, AM.getAsset("./img/battle.png"), 100, 0));
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/desert_background.jpg")));
    gameEngine.addEntity(new Reimu(gameEngine, AM.getAsset("./img/reimu_hakurei.png")));
    gameEngine.addEntity(new Bullet(gameEngine, AM.getAsset("./img/reimu_hakurei.png")));
    
    console.log("All Done!");
});