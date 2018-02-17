
var AM = new AssetManager();

gameScore = 0;
gameEnd = false;

function distance(a, b) {
    var difX = a.x - b.x;
    var difY = a.y - b.y;
    return Math.sqrt(difX * difX + difY * difY);
};

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
Animation.prototype.drawEnemyCircle = function (tick, ctx,x, y) {
	this.elapsedTime += tick;
	var frame = this.currentFrame();
	ctx.drawImage(this.spriteSheet,
	0, 0, 90, 90, x, y, 
	15 * this.scale, 15 * this.scale);
};
Animation.prototype.drawEnemyFrame = function (tick, ctx, x, y, left, right) {
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
Animation.prototype.drawEnemy2Frame = function (tick, ctx, x, y) {
    /*this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    */
    
    var frame = this.currentFrame();
    var xindex = frame % this.sheetWidth;
    var yindex = Math.floor(frame/this.sheetWidth);
    
    
    
    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight, 76, 76, x, y, // sprite position on screen.
                 105, // sprite scale; x
				105); // sprite scale; y
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
	this.speed = 2;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 0);
};

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {	
	
};

$(document).ready(function() {
	var x = 0;
    setInterval(function(){
        x+=1;
        $('canvas').css('background-position','0 ' + x + 'px');
        
    }, 1);
    
});


Background.prototype.draw = function () {
};

function updateBullet(bullet)
{
	//switch cases for all different types of patterns
	switch(bullet.bulletType){
	
	case "Reimu":
		bullet.y -= bullet.game.clockTick * bullet.speed;
		if(bullet.y < 0){
			bullet.removeFromWorld = true;
		}
		break;
	case "EnemyDown":
		bullet.y += bullet.game.clockTick * bullet.speed;
		if(bullet.y > 700){
			bullet.removeFromWorld = true;
		}
		break;
	case "EnemyDownLeft":
		bullet.y += bullet.game.clockTick * bullet.speed;
		bullet.x -= bullet.game.clockTick * 20;
		if(bullet.y > 700){
			bullet.removeFromWorld = true;
		}
		break;
	case "EnemyDownRight":
		bullet.y += bullet.game.clockTick * bullet.speed;
		bullet.x += bullet.game.clockTick * 20;
		if(bullet.y > 700){
			bullet.removeFromWorld = true;
		}
		break;
	}
}

function Reimu(game, spritesheet) {
	this.animation = new Animation(spritesheet, 32, 47, 261, .5, 8, true, 1.5); // Creates the Reimu animation.
	this.bulletAnimation = new Animation(spritesheet, 15, 12, 261, .5, 4, false, 1.5); // Create's the Bullet animation for Reimu.
    this.speed = 200;
    this.bulletSpeed = 230;
    this.bulletY = this.y;
    this.radius = 3;
    this.isShooting = false;
	this.slow = false;
    this.moveRight = false;
    this.moveLeft = false;
    this.moveUp = false;
    this.moveDown = false;
    this.ctx = game.ctx;
    Entity.call(this, game, 400, 550);
}

ReimuBullet.prototype = new Entity();
ReimuBullet.prototype.constructor = ReimuBullet;

ReimuBullet.prototype.collideRight = function () {
    return this.x + this.radius > 800;
};
ReimuBullet.prototype.collideLeft = function () {
    return this.x - this.radius < 0;
};
ReimuBullet.prototype.collideBottom = function () {
    return this.y + this.radius > 800;
};
ReimuBullet.prototype.collideTop = function () {
    return this.y - this.radius < 0;
};

ReimuBullet.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};


function ReimuBullet(game, spritesheet) {
	this.animation = new Animation(spritesheet, 15, 12, 261, .5, 4, false, 1.5); // Create's the Bullet animation for Reimu.
	this.speed = 450;
	this.X;
	this.Y;
	this.radius = 2;
	this.bulletType = "Reimu";
	this.ctx = game.ctx;
	Entity.call(this, game, 400, 550);
}

ReimuBullet.prototype.update = function() {
    //this.y -= this.game.clockTick * this.speed;
	updateBullet(this)
    
    Entity.prototype.update.call(this);
}

ReimuBullet.prototype.draw = function () {
    this.animation.drawBulletFrame(this.game.clockTick, this.ctx, this.x, this.y);
    
    Entity.prototype.draw.call(this);
};

EnemyBullet.prototype = new Entity();
EnemyBullet.prototype.constructor = EnemyBullet;

function EnemyBullet(game, spritesheet, x, y) {
	this.animation = new Animation(spritesheet, 15, 12, 261, .5, 4, false, 1.5); // Create's the Bullet animation for Reimu.
	this.speed = Math.floor((Math.random() * 10) * 4);//	 + 55;
	this.x = x;
	this.y = y;
	this.bulletType = "EnemyDown";
	this.radius = 2;
	this.isEnemy = true;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
	Entity.call(this, game, x, y);
}

EnemyBullet.prototype.collideRight = function () {
    return this.x + this.radius > 800;
};
EnemyBullet.prototype.collideLeft = function () {
    return this.x - this.radius < 0;
};
EnemyBullet.prototype.collideBottom = function () {
    return this.y + this.radius > 800;
};
EnemyBullet.prototype.collideTop = function () {
    return this.y - this.radius < 0;
};

EnemyBullet.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

EnemyBullet.prototype.Enemyupdate = function() {
	updateBullet(this);

    Entity.prototype.update.call(this);
}

EnemyBullet.prototype.draw = function () {
    this.animation.drawEnemyCircle(this.game.clockTick, this.ctx, this.x, this.y);
    
    Entity.prototype.draw.call(this);
};


Reimu.prototype = new Entity();
Reimu.prototype.constructor = Reimu;

b = [];
bEnemy = [];

Reimu.prototype.collideRight = function () {
    return this.x + this.radius > 600;
};
Reimu.prototype.collideLeft = function () {
    return this.x - this.radius < 0;
};

Reimu.prototype.collideBottom = function () {
    return this.y + this.radius > 800;
};
Reimu.prototype.collideTop = function () {
    return this.y - this.radius < 0;
};

Reimu.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Reimu.prototype.update = function () {
	
	Entity.prototype.update.call(this);
	
	var that = this;
	
	if(this.game.space) { // If the space key is pressed.
		this.isShooting = true;
		this.bulletY = that.y;
	}
	if(this.game.c) 
	{
		this.speed = 100;
	}
	if(!this.game.c) 
	{ // If the left arrow key is pressed.
		this.speed = 200;
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
		
		//this.bulletY -= this.game.clockTick * this.bulletSpeed; // Bullet moves towards the top of the screen
	}if(this.moveRight){
		if(this.x < 750) {
		this.x += this.game.clockTick * this.speed; // Reimu moves right towards the side of the screen
		}
	}if(this.moveLeft){
		if(this.x > 0) {
			this.x -= this.game.clockTick * this.speed; // Reimu moves right towards the side of the screen
		}
	}if(this.moveUp){
		if(this.y > 0) {
		this.y -= this.game.clockTick * this.speed; // Reimu moves towards the top of the screen
		}
	}if(this.moveDown){
		if(this.y < 600) {
		
		
		this.y += this.game.clockTick * this.speed; // Reimu moves towards the bottom of the screen
		}
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
	
	
	
	for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this != ent && this.collide(ent) && ent.isEnemy) {
            this.removeFromWorld = true;
            ent.removeFromWorld = true;
            this.game.gameEnd = true;
        };
    };

};

Reimu.prototype.draw = function () {

	if(this.isShooting){		
		temp = new ReimuBullet(this.game, AM.getAsset("./img/reimu_hakurei.png"));
		temp2 = new ReimuBullet(this.game, AM.getAsset("./img/reimu_hakurei.png"));
		
		temp.x = this.x+5;
		temp.y = this.bulletY;
		
		temp2.x = this.x+25;
		temp2.y = this.bulletY;
		
		this.game.addEntity(temp);
		this.game.addEntity(temp2);
		
		
		this.animation.drawBulletFrame(this.game.clockTick, this.ctx, this.x+5, this.bulletY); // Draws bullet onto the canvas.
		this.animation.drawBulletFrame(this.game.clockTick, this.ctx, this.x+25, this.bulletY); 
		b.push(temp);
		b.push(temp2);
	}
		
	this.animation.drawReimuFrame(this.game.clockTick, this.ctx, this.x, this.y, this.moveLeft, this.moveRight);
    Entity.prototype.draw.call(this);
};

function Enemy2(game, spritesheet, x, y) {
	this.x = x;
	this.y = y;
	this.animation = new Animation(spritesheet, 76, 76, 76, 1, 1, true, 1);
	this.bulletAnimation = new Animation("./img/reimu_hakurei.png", 15, 12, 261, 1, 4, true, 1.5)
	this.timer = Math.floor((Math.random()*8) + 3);
	this.speed = 200;
	this.bulletSpeed = 200;
	this.bulletY = 50;
	this.radius = 5;
	this.isEnemy = true;
	this.shoot = false;
	this.ctx = game.ctx;
	this.killScore = 200;
	Entity.call(this, game, x, y);
};
Enemy2.prototype = new Entity();
Enemy2.prototype.constructor = Enemy2;

Enemy2.prototype.collideRight = function () {
    return this.x + this.radius > 800;
};
Enemy2.prototype.collideLeft = function () {
    return this.x - this.radius < 0;
};
Enemy2.prototype.collideBottom = function () {
    return this.y + this.radius > 800;
};
Enemy2.prototype.collideTop = function () {
    return this.y - this.radius < 0;
};

Enemy2.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Enemy2.prototype.update = function() {
	Entity.prototype.update.call(this);
	//if this.timer 
	if(this.shoot) {
		this.bulletY += this.game.clockTick * this.bulletSpeed;
		
	}
	//this.y -= this.game.clockTick * this.speed;
	
	for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this != ent && this.collide(ent) && !ent.isEnemy) {
            this.removeFromWorld = true;
            ent.removeFromWorld = true;
            this.game.gameScore += this.killScore;
        };
    };
}

Enemy2.prototype.draw = function() {
	this.animation.drawEnemy2Frame(this.game.clockTick, this.ctx, this.ctx, this.x, this.y);
	Entity.prototype.draw.call(this);
};

function Enemy(game, spritesheet, x, y){
	this.x = x;
	this.y = y;
	this.animation = new Animation(spritesheet, 32, 48, 640, 0.75, 8, true, 1.5); // Creates an Enemy animation
	this.moveRight = true;
	this.moveLeft = false;
	this.speed = Math.floor((Math.random() * 10) + 10)*20;
	this.bulletSpeed = 200;
	this.bulletY = 50;
	this.radius = 5;
	this.isEnemy = true;
	this.shoot = false;
	this.killScore = 100;
	this.ctx = game.ctx;
	Entity.call(this, game, x, y);
};

Enemy.prototype = new Entity();
Enemy.prototype.constructor = Enemy;

Enemy.prototype.collideRight = function () {
    return this.x + this.radius > 600;
};
Enemy.prototype.collideLeft = function () {
    return this.x - this.radius < 0;
};
Enemy.prototype.collideBottom = function () {
    return this.y + this.radius > 600;
};
Enemy.prototype.collideTop = function () {
    return this.y - this.radius < 0;
};

Enemy.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Enemy.prototype.update = function () {
	Entity.prototype.update.call(this);
	
	//this.speed = Math.floor(Math.random() * 10)*100);
	if(this.shoot){
		this.bulletY += this.game.clockTick * this.bulletSpeed;
	}
	
	if(this.x <= 0 ){
		
		this.moveRight = true;
		this.moveLeft= false;
		this.x += this.game.clockTick * this.speed;
	}else if(this.x >= 568){
		this.moveRight = false;
		this.moveLeft = true;
		
	}
	if(this.moveLeft){
		this.x -= this.game.clockTick * this.speed;
	}
	
	if(this.moveRight){
		this.x += this.game.clockTick * this.speed;
	}
	/*firestart = Math.floor((Math.random() * 8) * 100);
	if (this.x === firestart) {
		this.shoot = true;
	if ((this.x > firestart + 200) ||(this.x < firestart - 200)) {
		this.shoot = false;
	}*/

	if (Math.floor(Math.random() * 100)> 90) {
		this.shoot = true;
	}else{
		this.shoot = false;
	}
	
	bEnemy.forEach(function(element)
	{
		element.Enemyupdate();
		element.draw();
		//console.log("update");
		
	});
	
	for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this != ent && this.collide(ent) && !ent.isEnemy) {
            this.removeFromWorld = true;
            ent.removeFromWorld = true;
            this.game.gameScore += this.killScore;
        };
    };
	
}

Enemy.prototype.draw = function () {


	this.animation.drawEnemyFrame(this.game.clockTick, this.ctx, this.x, this.y, this.moveLeft, this.moveRight);
	
	if(this.shoot) {
		tempEnemy = new EnemyBullet(this.game, AM.getAsset("./img/battle.png"), this.x, this.y + this.bulletY);
		tempEnemy.x = this.x+15;
		tempEnemy.y = this.y+50;
		tempEnemy.bulletType = "EnemyDownLeft";
		this.game.addEntity(tempEnemy);
		//this.shoot = false;
		
		//trying 2 bullet
		tempEnemy2 = new EnemyBullet(this.game, AM.getAsset("./img/battle.png"), this.x, this.y + this.bulletY);
		tempEnemy2.x = this.x+15;
		tempEnemy2.y = this.y+50;
		tempEnemy2.bulletType = "EnemyDownRight";
		this.game.addEntity(tempEnemy2);
		this.shoot = false;
		
		//this.animation.drawEnemyCircle(this.game.clockTick, this.ctx, this.x, 50);
		bEnemy.push(tempEnemy);
		bEnemy.push(tempEnemy2);
		
		//console.log("shooting");
	}
	
    Entity.prototype.draw.call(this);
};

function Enemy3(game, spritesheet, x, y){
	this.x = x;
	this.y = y;
	this.animation = new Animation(spritesheet, 32, 48, 640, 0.75, 8, true, 1.5); // Creates an Enemy animation.
	this.bulletAnimation = new Animation("./img/reimu_hakurei.png", 15, 12, 261, 1, 4, true, 1.5)
	this.radius = 5;
	this.isEnemy = true;
	this.speed = 185;
	this.bulletSpeed = 200;
	this.bulletY = this.y + 50;
	this.shoot = false;
	this.killScore = 500;
	this.ctx = game.ctx;
	Entity.call(this, game, x, y);
};

Enemy3.prototype = new Entity();
Enemy3.prototype.constructor = Enemy3;

Enemy3.prototype.collideRight = function () {
    return this.x + this.radius > 800;
};
Enemy3.prototype.collideLeft = function () {
    return this.x - this.radius < 0;
};
Enemy3.prototype.collideBottom = function () {
    return this.y + this.radius > 800;
};
Enemy3.prototype.collideTop = function () {
    return this.y - this.radius < 0;
};

Enemy3.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Enemy3.prototype.update = function () {
	Entity.prototype.update.call(this);
	
	if(this.shoot){
		this.bulletY += this.game.clockTick * this.bulletSpeed;
	}
	this.y += 2;
	if (this.y > 600) {
		this.y = 0;
	}
	
	
	if (Math.floor(Math.random() * 60) > 50){
		this.shoot = true;
	}else{
		this.shoot = false;
	}
	
	bEnemy.forEach(function(element)
	{
		element.Enemyupdate();
		element.draw();
		//console.log("update");
	});
	
	for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this != ent && this.collide(ent) && !ent.isEnemy) {
            this.removeFromWorld = true;
            ent.removeFromWorld = true;
            this.game.gameScore += this.killScore;
        };
    };
}

Enemy3.prototype.draw = function () {


	this.animation.drawEnemyFrame(this.game.clockTick, this.ctx, this.x, this.y, this.moveLeft, this.moveRight);
	
	if(this.shoot) {
		tempEnemy = new EnemyBullet(this.game, AM.getAsset("./img/reimu_hakurei.png"), this.x, this.y + this.bulletY);
		tempEnemy.x = this.x+15;
		tempEnemy.y = this.y + 50;
		this.game.addEntity(tempEnemy);
		
		
		this.animation.drawBulletFrame(this.game.clockTick, this.ctx, this.x, 50);
		bEnemy.push(tempEnemy);
		
		//console.log("shooting");
	}
	
    Entity.prototype.draw.call(this);
};


AM.queueDownload("./img/desert_background.jpg");
AM.queueDownload("./img/reimu_hakurei.png");
AM.queueDownload("./img/enemy.png")
AM.queueDownload("./img/mini.png")
AM.queueDownload("./img/battle.png")


AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    
    gameEngine.gameScore = gameScore;
    
    gameEngine.addEntity(new Reimu(gameEngine, AM.getAsset("./img/reimu_hakurei.png"), 400, 500));

    gameEngine.addEntity(new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), 400, 50));
	gameEngine.addEntity(new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), 10, 350));
	gameEngine.addEntity(new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), 300, 100));
	gameEngine.addEntity(new Enemy3(gameEngine, AM.getAsset("./img/enemy.png"), 100, 200));
	gameEngine.addEntity(new Enemy3(gameEngine, AM.getAsset("./img/enemy.png"), 40, 50));
	gameEngine.addEntity(new Enemy3(gameEngine, AM.getAsset("./img/enemy.png"), 120, 50));
	gameEngine.addEntity(new Enemy3(gameEngine, AM.getAsset("./img/enemy.png"), 80, 50));
    
    console.log("All Done!");
});