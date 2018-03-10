window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = new AudioContext();
var bufferLoader;
var soundBuffer = null;
var gainNode = null;
var gainNode2 = null;
var gainNode1 = null;
var mute = false;
var AM = new AssetManager();

gameScore = 0;

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
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    
    
    var frame = this.currentFrame();
    var xindex = 1045 + ((frame % this.sheetWidth)* 32);
    var yindex = 980;
    
    ctx.drawImage(this.spriteSheet,
    		xindex, 980,  // (x,y) source from sheet
            32, 35, // (x,y) size of sprite.
            x, y, // sprite position on screen.
            this.frameWidth * this.scale, // sprite scale; x
            this.frameHeight * this.scale); // sprite scale; y
};

Animation.prototype.drawEnemy3Frame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    
    
    var frame = this.currentFrame();
    var xindex = 789 + (frame % this.sheetWidth * 32);
    var yindex = 985;
    
    ctx.drawImage(this.spriteSheet,
    		xindex, yindex,  // (x,y) source from sheet
            32, 28, // (x,y) size of sprite.
            x, y, // sprite position on screen.
            this.frameWidth * this.scale, // sprite scale; x
            this.frameHeight * this.scale); // sprite scale; y
};

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
};

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
};

// no inheritance


function BufferLoader(context, urlList, callback) {
	  this.context = context;
	  this.urlList = urlList;
	  this.onload = callback;
	  this.bufferList = new Array();
	  this.loadCount = 0;
	}

BufferLoader.prototype.loadBuffer = function(url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest(),
      mult = typeof url != 'string',
      srcInd = 0;
    request.open("GET", mult ? url[srcInd++] : url, true);
    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function() {
        // Asynchronously decode the audio file data in request.response
        loader.context.decodeAudioData(
            request.response,
            function(buffer) {
                if (!buffer) {
                    if(!mult || srcInd == url.length) {
                        console.error('error decoding file data:', url);
                        return;
                    } else {
                        console.info('error decoding file data, trying next source');
                        request.open("GET", url[srcInd++], true);
                        return request.send();
                    }
                }
                loader.bufferList[index] = buffer;
                if (++loader.loadCount == loader.urlList.length)
                    loader.onload(loader.bufferList);
            },
            function(error) {
                if(!mult || srcInd == url.length) {
                    console.error('decodeAudioData error:', url);
                    return;
                } else {
                    console.info('decodeAudioData error, trying next source');
                    request.open("GET", url[srcInd++], true);
                    return request.send();
                }
            }
        );
    }

    request.onerror = function() {
        if(!mult || srcInd == url.length) {
            console.error('BufferLoader XHR error:', url);
            return;
        } else {
            console.info('BufferLoader XHR error, trying next source');
            request.open("GET", url[srcInd++], true);
            return request.send();
        }
    }

    request.send();
}


BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}
	

function playSound(buffer) {
	var source = audioCtx.createBufferSource(); // creates a sound source
	gainNode = audioCtx.createGain();
	source.buffer = buffer;                    // tell the source which sound to play
	source.connect(gainNode);
	gainNode.connect(audioCtx.destination);       // connect the source to the context's destination (the speakers)
	if(mute)
	{
		gainNode.gain.value = 0;
	}
	else
	{
		gainNode.gain.value = 0.02;
	}
	
	source.start(0);  
}

function playDeath(buffer)
{
	var source2 = audioCtx.createBufferSource(); // creates a sound source
	gainNode2 = audioCtx.createGain();
	source2.buffer = buffer;                    // tell the source which sound to play
	source2.connect(gainNode2);
	gainNode2.connect(audioCtx.destination);       // connect the source to the context's destination (the speakers)
	if(mute)
	{
		gainNode2.gain.value = 0;
	}
	else
	{
		gainNode2.gain.value = 0.02;
	}
	source2.start(0);  
}

function playBGM(buffer)
{
	var source1 = audioCtx.createBufferSource(); // creates a sound source
	gainNode1 = audioCtx.createGain();
	source1.buffer = buffer;                    // tell the source which sound to play
	source1.connect(gainNode1);
	gainNode1.connect(audioCtx.destination);       // connect the source to the context's destination (the speakers)
	if(mute)
	{
		gainNode1.gain.value = 0;
	}
	else
	{
		gainNode1.gain.value = 0.25;
	}
	
	source1.start(0); 
	
	
}

function Background(game, spritesheet) {
	this.x = 0;
	this.y = 0;
	this.centerX = 0;
	this.centerY = 0;
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
		if(bullet.y < -50 || bullet.x > 650 || bullet.x < -50){
			bullet.removeFromWorld = true;
		}
		break;
	case "EnemyDown":
		bullet.y += bullet.game.clockTick * bullet.speed + 5;
		if(bullet.y < -50 || bullet.y > 750 || bullet.x > 650 || bullet.x < -50){
			bullet.removeFromWorld = true;
		}
		break;
	case "EnemyDownLeft":
		bullet.y += bullet.game.clockTick * bullet.speed + 5;
		bullet.x -= bullet.game.clockTick * bullet.speed + 1;
		if(bullet.y < -50 || bullet.y > 750 || bullet.x > 650 || bullet.x < -50){
			bullet.removeFromWorld = true;
		}
		break;
	case "EnemyDownRight":
		bullet.y += bullet.game.clockTick * bullet.speed + 5;
		bullet.x += bullet.game.clockTick * bullet.speed + 1;
		if(bullet.y < -50 || bullet.y > 750 || bullet.x > 650 || bullet.x < -50){
			bullet.removeFromWorld = true;
		}
		break;
	case "EnemyRightUp":
		bullet.x += bullet.game.clockTick * bullet.speed + 5;
		bullet.y -= bullet.game.clockTick * bullet.speed + 1;
		if(bullet.y < -50 || bullet.y > 750 || bullet.x > 650 || bullet.x < -50){
			bullet.removeFromWorld = true;
		}
		break;
	case "EnemyLeftUp":
		bullet.x -= bullet.game.clockTick * bullet.speed + 5;
		bullet.y -= bullet.game.clockTick * bullet.speed + 1;
		if(bullet.y < -50 || bullet.y > 750 || bullet.x > 650 || bullet.x < -50){
			bullet.removeFromWorld = true;
		}
		break;
	case "EnemyRightDown":
		bullet.x += bullet.game.clockTick * bullet.speed + 5;
		bullet.y += bullet.game.clockTick * 55;
		if(bullet.y < -50 || bullet.y > 750 || bullet.x > 650 || bullet.x < -50){
			bullet.removeFromWorld = true;
		}
		break;
	case "EnemyLeftDown":
		bullet.x -= bullet.game.clockTick * bullet.speed + 5;
		bullet.y += bullet.game.clockTick * bullet.speed + 1;
		if(bullet.y < -50 || bullet.y > 750 || bullet.x > 650 || bullet.x < -50){
			bullet.removeFromWorld = true;
		}
		break;
	case "EnemyUp":
		bullet.y -= bullet.game.clockTick * bullet.speed + 3;
		if(bullet.y < -50 || bullet.y > 750 || bullet.x > 650 || bullet.x < -50){
			bullet.removeFromWorld = true;
		}
		break;
	case "EnemyUpLeft":
		bullet.y -= bullet.game.clockTick * bullet.speed + 5;
		bullet.x -= bullet.game.clockTick * bullet.speed + 1;
		if(bullet.y < -50 || bullet.y > 750 || bullet.x > 650 || bullet.x < -50){
			bullet.removeFromWorld = true;
		}
		break;
	case "EnemyUpRight":
		bullet.y -= bullet.game.clockTick * bullet.speed + 5;
		bullet.x += bullet.game.clockTick * bullet.speed + 1;
		if(bullet.y < -50 || bullet.y > 750 || bullet.x > 650 || bullet.x < -50){
			bullet.removeFromWorld = true;
		}
		break;
	}
	
}

function enemyMovement(the_enemy)
{
	switch(the_enemy.enemyType)
	{
		case "Stop":
			{
				the_enemy.timer += 1;
				if(the_enemy.timer > 30)
				{
					the_enemy.enemyType = the_enemy.nextType;
				}
				break;
			}
		case "StraightRight":
			the_enemy.x += the_enemy.game.clockTick * 650;
			if(the_enemy.x > 1000) {
				the_enemy.removeFromWorld = true;
			}	
			break;
		case "SlowRight":
			the_enemy.x += the_enemy.game.clockTick * 400;
			if(the_enemy.x > 1000) {
				the_enemy.removeFromWorld = true;
			}	
			break;
		case "StraightRightLoop":
			the_enemy.x += the_enemy.game.clockTick * 650;
			if(the_enemy.x > 1000) {
				the_enemy.removeFromWorld = true;
			}	
			break;
		case "StraightLeft":
			the_enemy.x -= the_enemy.game.clockTick * 650;
			if(the_enemy.x < -200) {
				the_enemy.removeFromWorld = true;
			}	
			break;
		case "SlowLeft":
			the_enemy.x -= the_enemy.game.clockTick * 400;
			if(the_enemy.x < -200) {
				the_enemy.removeFromWorld = true;
			}	
			break;
		case "StraightLeftLoop":
			the_enemy.x -= the_enemy.game.clockTick * 650;
			if(the_enemy.x < -200) {
				the_enemy.removeFromWorld = true;
			}	
			break;
		case "StraightDown":
			the_enemy.y += the_enemy.game.clockTick * 230;
			if(the_enemy.y >750) {
				the_enemy.removeFromWorld = true;
			}
			break;
			
		case "ClockwiseCircle":
			angle = 0.1 * the_enemy.currentState;
			the_enemy.x += 45 * the_enemy.game.clockTick * ((1+angle)*Math.cos(angle));
			the_enemy.y += 45 * the_enemy.game.clockTick * ((1+angle)*Math.sin(angle));
			the_enemy.currentState++;
			
			if(the_enemy.currentState > 120)
			{
				the_enemy.enemyType = the_enemy.nextType;
			}
			break;
		case "CounterClockwiseCircle":
			angle = 0.1 * the_enemy.currentState;
			the_enemy.x -= 45 * the_enemy.game.clockTick * ((1+angle)*Math.cos(angle));
			the_enemy.y += 45 * the_enemy.game.clockTick * ((1+angle)*Math.sin(angle));
			the_enemy.currentState++;
			
			if(the_enemy.currentState > 120)
			{
				the_enemy.enemyType = the_enemy.nextType;
			}
			break;
	}
}

function Reimu(game, spritesheet) {
	this.animation = new Animation(spritesheet, 32, 47, 261, .5, 8, true, 1.5); // Creates the Reimu animation.
	this.bulletAnimation = new Animation(spritesheet, 15, 12, 261, .5, 4, false, 1.5); // Create's the Bullet animation for Reimu.
    this.speed = 350;
    this.bulletSpeed = 230;
    this.bulletY = this.y;
    this.centerX = 23;
    this.centerY = 28;
    this.radius = 4;
    this.isShooting = false;
	this.slow = false;
	this.isHero = true;
	this.canCollide = true;
    this.moveRight = false;
    this.moveLeft = false;
    this.moveUp = false;
    this.moveDown = false;
    this.ctx = game.ctx;
    this.spawned = false;
    this.music = false;
    this.muteFired = false;
    Entity.call(this, game, 268, 550);
}

ReimuBullet.prototype = new Entity();
ReimuBullet.prototype.constructor = ReimuBullet;

function ReimuBullet(game, spritesheet) {
	this.animation = new Animation(spritesheet, 15, 12, 261, .5, 4, false, 1.5); // Create's the Bullet animation for Reimu.
	this.speed = 450;
	this.X;
	this.Y
	this.centerX = 7;
	this.centerY = 6;
	this.radius = 6
	this.bulletType = "Reimu";
	this.ctx = game.ctx;
	Entity.call(this, game, 268, 550);
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
	this.speed = Math.floor((Math.random() * 12) * 3);//	 + 55;
	this.x = x;
	this.y = y;
	this.centerX = 11;
	this.centerY = 11;
	this.bulletType = "EnemyDown"
	this.radius = 11;
	this.isEnemy = true;
	this.ctx = game.ctx;
	this.removeFromWorld = false;
	Entity.call(this, game, x, y);
}

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

Reimu.prototype.update = function () {
	bEnemy.forEach(function(element)
	{
		element.Enemyupdate();
		element.draw();
		//console.log("update");
		
	});
	
	if(this.game.god){
		this.canCollide = false;
	} else{
		this.canCollide = true;
	}
	
	Entity.prototype.update.call(this);
	
	var that = this;
	
	if(this.game.space) { // If the space key is pressed.
		this.isShooting = true;
		this.bulletY = that.y;
		
		if(!this.spawned)
		{
			if(soundBuffer != null)
			{
				playBGM(soundBuffer[0]);
				this.music = true;
			}
			
			spawnEnemies(this.game, 2);
			this.spawned = true;
		}
	}
	if(this.spawned && !this.music)
	{
		if(soundBuffer != null)
		{
			playBGM(soundBuffer[0]);
			this.music = true;
		}
	}

	if(this.game.m)
	{
		if(!muteFired)
		{
			if(!mute)
			{
				console.log("Muted!");
				if(gainNode != null)
				{
					gainNode.gain.value = 0;
				}
				if(gainNode1 != null)
				{
					gainNode1.gain.value = 0;
				}
				if(gainNode2 != null)
				{
					gainNode2.gain.value = 0;
				}
				mute = true;
			}
			else if(mute)
			{
				console.log("Unmuted!");
				if(gainNode != null)
				{
					gainNode.gain.value = 0.02;
				}
				if(gainNode1 != null)
				{
					gainNode1.gain.value = 0.25;
				}
				if(gainNode2 != null)
				{
					gainNode2.gain.value = 0.02;
				}
				mute = false;
			}
			
			muteFired = true;
		}
	}
	else if(!this.game.m)
	{
		muteFired = false;
	}
	
	if(this.game.shift) 
	{
		this.speed = 100;
	}
	if(!this.game.shift) 
	{ // If the left arrow key is pressed.
		this.speed = 250;
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
		if(this.x < 550) {
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
		if(this.y < 650) {
		
		
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
	
	
	var gameEngine =this.game;
	var ctx = this.ctx;
	for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this != ent && this.collide(ent) && ent.isEnemy && this.canCollide) {
        	if(soundBuffer != null)
    		{
    			playDeath(soundBuffer[2]);
    		}
        	
            this.removeFromWorld = true;
            ent.removeFromWorld = true;
            this.game.gameEnd = true;
			
        };
    };
	if(this.game.gameEnd) {
		this.game.lives --;
		if(this.game.lives > 0) {
		restarter(gameEngine, ctx);
		
		} else {
			//this.game.prototype.init(ctx);
			starter();
		}
	}
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
	this.bulletAnimation = new Animation("./img/reimu_hakurei.png", 15, 12, 261, 1, 4, true, 1.5)
	
	this.animation = new Animation(spritesheet, 28, 32, 1350, .5, 8, true, 1.5);// Creates an Enemy animation
	this.enemyType = "StraightLeft";
	this.nextType = "StraightLeft";
	this.attackType = "Star";
	this.centerX = 16;
	this.centerY = 24;
	this.waiting = false;
	this.maxShot = 12;
	this.timer = 0;
	this.speed = Math.floor((Math.random() * 10) + 10)*20;
	this.bulletSpeed = 10;
	this.bulletY = 23;
	this.radius = 15
	this.count = 0;
	this.bulletInterval = bulletInterval = Math.floor(Math.random() * 11) + 1;
	this.totalInterval = 12;
	this.isEnemy = true;
	this.shoot = false;
	this.currentState = 60;
	this.killScore = 100;
	this.ctx = game.ctx;
	Entity.call(this, game, x, y);
};
Enemy2.prototype = new Entity();
Enemy2.prototype.constructor = Enemy2;

Enemy2.prototype.update = function() {
Entity.prototype.update.call(this);
	
	//this.speed = Math.floor(Math.random() * 10)*100);
	if(this.shoot){
		this.bulletY += this.game.clockTick * this.bulletSpeed;
	}
	
	if(this.x > 300 && this.x < 400)
	{
		if(this.enemyType === "StraightRightLoop")
		{
			this.storedX = this.x;
			this.storedY = this.y;
			this.enemyType = "ClockwiseCircle";
		}
		if(this.enemyType === "StraightLeftLoop")
		{
			this.storedX = this.x;
			this.storedY = this.y;
			this.enemyType = "CounterClockwiseCircle";
		}
	}
	
	if(this.enemyType === "StraightDown")
	{
		if(this.y > 130)
		{
			this.waiting = false;
			this.enemyType = "Stop";
		}
	}
	
	//should update enemy movement
	enemyMovement(this)
	
	if(this.count < this.maxShot)
	{
		if(this.waiting === false)
		{
			if(this.bulletInterval === 0)
			{
				this.shoot = true;
				this.count++;
				this.bulletInterval = this.totalInterval;
			}
			else
			{
				this.shoot = false;
			}
			this.bulletInterval--;
		}
	}
	var gameEngine = this.game;
	var ctx = this.ctx;
	for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this != ent && this.collide(ent) && !ent.isEnemy && !ent.canCollide) {
            this.removeFromWorld = true;
            ent.removeFromWorld = true;
            this.game.gameScore += this.killScore;
            if(ent.isHero) this.game.gameEnd = true;
			
        };
    };
	if(this.game.gameEnd) {
		this.game.lives --;
		if(this.game.lives > 0) {
		restarter(gameEngine, ctx);
		}
	}
}

Enemy2.prototype.draw = function() {


	this.animation.drawEnemy2Frame(this.game.clockTick, this.ctx, this.x, this.y);
	
	if(this.shoot) {
		if(this.attackType === "Star")
		{
			drawSpreads(this, "Star");
		}
		if(this.attackType === "SecondaryStar")
		{
			drawSpreads(this, "SecondaryStar");
		}
		if(this.attackType === "FullSpread")
		{
			drawSpreads(this, "Star");
			drawSpreads(this, "SecondaryStar");
			
		}
		
		this.shoot = false;
		
	}
	
    Entity.prototype.draw.call(this);
};

function Enemy(game, spritesheet, x, y){
	this.x = x;
	this.y = y;
	this.animation = new Animation(spritesheet, 32, 48, 640, 0.75, 8, true, 1.5); // Creates an Enemy animation
	//this.moveRight = true;
	//this.moveLeft = false;
	this.enemyType = "StraightLeft";
	this.nextType = "StraightLeft";
	this.attackType = "Star";
	this.centerX = 16;
	this.centerY = 24;
	this.waiting = false;
	this.maxShot = 12;
	this.timer = 0;
	this.speed = Math.floor((Math.random() * 10) + 10)*20;
	this.bulletSpeed = 10;
	this.bulletY = 50;
	this.radius = 15
	this.count = 0;
	this.bulletInterval = bulletInterval = Math.floor(Math.random() * 11) + 1;
	this.totalInterval = 12;
	this.isEnemy = true;
	this.shoot = false;
	this.currentState = 60;
	this.killScore = 100;
	this.ctx = game.ctx;
	Entity.call(this, game, x, y);
};

Enemy.prototype = new Entity();
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function () {
	Entity.prototype.update.call(this);
	
	//this.speed = Math.floor(Math.random() * 10)*100);
	if(this.shoot){
		this.bulletY += this.game.clockTick * this.bulletSpeed;
	}
	
	if(this.x > 300 && this.x < 400)
	{
		if(this.enemyType === "StraightRightLoop")
		{
			this.storedX = this.x;
			this.storedY = this.y;
			this.enemyType = "ClockwiseCircle";
		}
		if(this.enemyType === "StraightLeftLoop")
		{
			this.storedX = this.x;
			this.storedY = this.y;
			this.enemyType = "CounterClockwiseCircle";
		}
	}
	
	if(this.enemyType === "StraightDown")
	{
		if(this.y > 130)
		{
			this.waiting = false;
			this.enemyType = "Stop";
		}
	}
	
	//should update enemy movement
	enemyMovement(this)
	
	if(this.count < this.maxShot)
	{
		if(this.waiting === false)
		{
			if(this.bulletInterval === 0)
			{
				this.shoot = true;
				this.count++;
				this.bulletInterval = this.totalInterval;
			}
			else
			{
				this.shoot = false;
			}
			this.bulletInterval--;
		}
	}
	var gameEngine = this.game;
	var ctx = this.ctx;
	for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this != ent && this.collide(ent) && !ent.isEnemy && !ent.canCollide) {
            this.removeFromWorld = true;
            ent.removeFromWorld = true;
            this.game.gameScore += this.killScore;
            if(ent.isHero) this.game.gameEnd = true;
        };
    };
	if(this.game.gameEnd) {
		this.game.lives --;
		if(this.game.lives > 0) {
		
		restarter(gameEngine, ctx);
		}
	}
}



Enemy.prototype.draw = function () {


	this.animation.drawEnemyFrame(this.game.clockTick, this.ctx, this.x, this.y, this.moveLeft, this.moveRight);
	
	if(this.shoot) {
		if(this.attackType === "Star")
		{
			drawSpreads(this, "Star");
		}
		if(this.attackType === "SecondaryStar")
		{
			drawSpreads(this, "SecondaryStar");
		}
		if(this.attackType === "FullSpread")
		{
			drawSpreads(this, "Star");
			drawSpreads(this, "SecondaryStar");
			
		}
		
		this.shoot = false;
		
	}
	
    Entity.prototype.draw.call(this);
};

function drawSpreads(enemy, attackPattern)
{
	if(attackPattern === "Star")
	{
		tempEnemy = new EnemyBullet(enemy.game, AM.getAsset("./img/battle.png"), enemy.x, enemy.y + enemy.bulletY);
		tempEnemy.x = enemy.x+15;
		tempEnemy.y = enemy.y+enemy.bulletY;
		tempEnemy.bulletType = "EnemyDownLeft";
		enemy.game.addEntity(tempEnemy);
		//this.shoot = false;
		
		//trying 2 bullet
		tempEnemy2 = new EnemyBullet(enemy.game, AM.getAsset("./img/battle.png"), enemy.x, enemy.y + enemy.bulletY);
		tempEnemy2.x = enemy.x+15;
		tempEnemy2.y = enemy.y+enemy.bulletY;
		tempEnemy2.bulletType = "EnemyDownRight";
		enemy.game.addEntity(tempEnemy2);
		
		//trying all bullet
		tempEnemy3 = new EnemyBullet(enemy.game, AM.getAsset("./img/battle.png"), enemy.x, enemy.y + enemy.bulletY);
		tempEnemy3.x = enemy.x+15;
		tempEnemy3.y = enemy.y+enemy.bulletY;
		tempEnemy3.bulletType = "EnemyRightUp";
		enemy.game.addEntity(tempEnemy3);
		
		tempEnemy4 = new EnemyBullet(enemy.game, AM.getAsset("./img/battle.png"), enemy.x, enemy.y + enemy.bulletY);
		tempEnemy4.x = enemy.x+15;
		tempEnemy4.y = enemy.y+enemy.bulletY;
		tempEnemy4.bulletType = "EnemyLeftUp";
		enemy.game.addEntity(tempEnemy4);
		
		tempEnemy5 = new EnemyBullet(enemy.game, AM.getAsset("./img/battle.png"), enemy.x, enemy.y + enemy.bulletY);
		tempEnemy5.x = enemy.x+15;
		tempEnemy5.y = enemy.y+enemy.bulletY;
		tempEnemy5.bulletType = "EnemyUp";
		enemy.game.addEntity(tempEnemy5);
	
		if(soundBuffer != null)
		{
			playSound(soundBuffer[1]);
		}
		bEnemy.push(tempEnemy);
		bEnemy.push(tempEnemy2);
		bEnemy.push(tempEnemy3);
		bEnemy.push(tempEnemy4);
		bEnemy.push(tempEnemy5);
	}
	if(attackPattern === "SecondaryStar")
	{
		tempEnemy = new EnemyBullet(enemy.game, AM.getAsset("./img/battlepurple.png"), enemy.x, enemy.y + enemy.bulletY);
		tempEnemy.x = enemy.x+15;
		tempEnemy.y = enemy.y+enemy.bulletY;
		tempEnemy.bulletType = "EnemyDown";
		enemy.game.addEntity(tempEnemy);
		tempEnemy2 = new EnemyBullet(enemy.game, AM.getAsset("./img/battlepurple.png"), enemy.x, enemy.y + enemy.bulletY);
		tempEnemy2.x = enemy.x+15;
		tempEnemy2.y = enemy.y+enemy.bulletY;
		tempEnemy2.bulletType = "EnemyUpLeft";
		enemy.game.addEntity(tempEnemy2);
		tempEnemy3 = new EnemyBullet(enemy.game, AM.getAsset("./img/battlepurple.png"), enemy.x, enemy.y + enemy.bulletY);
		tempEnemy3.x = enemy.x+15;
		tempEnemy3.y = enemy.y+enemy.bulletY;
		tempEnemy3.bulletType = "EnemyUpRight";
		enemy.game.addEntity(tempEnemy3);
		tempEnemy4 = new EnemyBullet(enemy.game, AM.getAsset("./img/battlepurple.png"), enemy.x, enemy.y + enemy.bulletY);
		tempEnemy4.x = enemy.x+15;
		tempEnemy4.y = enemy.y+enemy.bulletY;
		tempEnemy4.bulletType = "EnemyLeftDown";
		enemy.game.addEntity(tempEnemy4);
		tempEnemy5 = new EnemyBullet(enemy.game, AM.getAsset("./img/battlepurple.png"), enemy.x, enemy.y + enemy.bulletY);
		tempEnemy5.x = enemy.x+15;
		tempEnemy5.y = enemy.y+enemy.bulletY;
		tempEnemy5.bulletType = "EnemyRightDown";
		enemy.game.addEntity(tempEnemy5);
	
		if(soundBuffer != null)
		{
			playSound(soundBuffer[1]);
		}
		bEnemy.push(tempEnemy);
		bEnemy.push(tempEnemy2);
		bEnemy.push(tempEnemy3);
		bEnemy.push(tempEnemy4);
		bEnemy.push(tempEnemy5);
	}
	
	
}



function Enemy3(game, spritesheet, x, y){
	this.x = x;
	this.y = y;
	this.animation = new Animation(spritesheet, 28, 30, 252, .5, 8, true, 1.5); // Creates an Enemy animation.
	this.bulletAnimation = new Animation("./img/reimu_hakurei.png", 15, 12, 261, 1, 4, true, 1.5)
	this.enemyType = "StraightLeft";
	this.nextType = "StraightLeft";
	this.attackType = "Star";
	this.centerX = 16;
	this.centerY = 24;
	this.waiting = false;
	this.maxShot = 12;
	this.timer = 0;
	this.speed = Math.floor((Math.random() * 10) + 10)*20;
	this.bulletSpeed = 10;
	this.bulletY = 23;
	this.radius = 15
	this.count = 0;
	this.bulletInterval = bulletInterval = Math.floor(Math.random() * 11) + 1;
	this.totalInterval = 12;
	this.isEnemy = true;
	this.shoot = false;
	this.currentState = 60;
	this.killScore = 100;
	this.ctx = game.ctx;
	Entity.call(this, game, x, y);
};

Enemy3.prototype = new Entity();
Enemy3.prototype.constructor = Enemy3;

Enemy3.prototype.update = function () {
	Entity.prototype.update.call(this);
	
	//this.speed = Math.floor(Math.random() * 10)*100);
	if(this.shoot){
		this.bulletY += this.game.clockTick * this.bulletSpeed;
	}
	
	if(this.x > 300 && this.x < 400)
	{
		if(this.enemyType === "StraightRightLoop")
		{
			this.storedX = this.x;
			this.storedY = this.y;
			this.enemyType = "ClockwiseCircle";
		}
		if(this.enemyType === "StraightLeftLoop")
		{
			this.storedX = this.x;
			this.storedY = this.y;
			this.enemyType = "CounterClockwiseCircle";
		}
	}
	
	if(this.enemyType === "StraightDown")
	{
		if(this.y > 130)
		{
			this.waiting = false;
			this.enemyType = "Stop";
		}
	}
	
	//should update enemy movement
	enemyMovement(this)
	
	if(this.count < this.maxShot)
	{
		if(this.waiting === false)
		{
			if(this.bulletInterval === 0)
			{
				this.shoot = true;
				this.count++;
				this.bulletInterval = this.totalInterval;
			}
			else
			{
				this.shoot = false;
			}
			this.bulletInterval--;
		}
	}
	var gameEngine = this.game;
	var ctx = this.ctx;
	for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this != ent && this.collide(ent) && !ent.isEnemy && !ent.canCollide) {
            this.removeFromWorld = true;
            ent.removeFromWorld = true;
            this.game.gameScore += this.killScore;
            if(ent.isHero) this.game.gameEnd = true;
        };
    };
	if (this.game.gameEnd) {
		this.game.lives --;
		if(this.game.lives > 0) {
		restarter(gameEngine, ctx);
		}
	}
}

Enemy3.prototype.draw = function () {


	this.animation.drawEnemy3Frame(this.game.clockTick, this.ctx, this.x, this.y);
	
	if(this.shoot) {
		if(this.attackType === "Star")
		{
			drawSpreads(this, "Star");
		}
		if(this.attackType === "SecondaryStar")
		{
			drawSpreads(this, "SecondaryStar");
		}
		if(this.attackType === "FullSpread")
		{
			drawSpreads(this, "Star");
			drawSpreads(this, "SecondaryStar");
			
		}
		
		this.shoot = false;
		
	}
	
    Entity.prototype.draw.call(this);
};

function spawnEnemies(gameEngine, difficulty)
{	
	//while(!gameEngine.gamEnd) {
		if (difficulty < 1) {
			difficulty = .5;
		}
		var spacing = 6/difficulty;
		var interval = spacing * 50
		
		console.log("spawn");

		for(var i = 2000; i<=2500; i+=interval)
		{
			setTimeout(function()
			{
				tempEnemy = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), -50, 70);
				tempEnemy.enemyType = "StraightRight";
				gameEngine.addEntity(tempEnemy);
				//gameEngine.addEntity(new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), -50, 80));
			}, i);
		}
		
		if (difficulty > 1) 
		{
			for(var i = 6000; i<=6500; i+=interval)
			{
				setTimeout(function()
				{
					tempEnemy = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), 650, 70);
					tempEnemy.enemyType = "StraightLeft";
					gameEngine.addEntity(tempEnemy);
				}, i);
			}
		}
		if (difficulty > 1) 
		{
			for(var i = 8000; i<=8500; i+=interval)
			{
				setTimeout(function()
				{
					tempEnemy = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), -50, 40);
					tempEnemy.enemyType = "StraightRight";
					gameEngine.addEntity(tempEnemy);
					//gameEngine.addEntity(new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), -50, 80));
				}, i);
			}
		}
		
		for(var i = 10000; i<=10500; i+=interval)
		{
			setTimeout(function()
			{
				tempEnemy = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), 650, 100);
				tempEnemy.enemyType = "StraightLeft";
				gameEngine.addEntity(tempEnemy);
			}, i);
		}
		
		
		if (difficulty > 2) {	
			for(var i = 12000; i<=12500; i+=interval)
			{
				setTimeout(function()
				{
					tempEnemy = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), 650, 40);
					tempEnemy.enemyType = "StraightLeft";
					tempEnemy2 = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), -50, 100);
					tempEnemy2.enemyType = "StraightRight";
					gameEngine.addEntity(tempEnemy);
					gameEngine.addEntity(tempEnemy2);
				}, i);
			}
			
		}
	//    setTimeout(function()
	//	{
	//		tempEnemy = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), 480, -50);
	//		tempEnemy.enemyType = "StraightDown";
	//		tempEnemy.nextType = "SlowLeft";
	//		tempEnemy.waiting = true;
	//		tempEnemy.maxShot = 20
	//		gameEngine.addEntity(tempEnemy);
	//	}, 16500);
	   
			for(var i = 16500; i<=26000; i+= 4600)
			{
			setTimeout(function()
					{
						tempEnemy = new Enemy3(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 480, -50);
						tempEnemy.enemyType = "StraightDown";
						tempEnemy.nextType = "SlowLeft";
						tempEnemy.attackType = "FullSpread";
						tempEnemy.waiting = true;
						tempEnemy.maxShot = 20
						gameEngine.addEntity(tempEnemy);
					}, i);
			}
		if (difficulty > 2) {
			for(var i = 18800; i<=29000; i+=46 * interval)
			{
			setTimeout(function()
					{
						tempEnemy = new Enemy3(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 120, -50);
						tempEnemy.enemyType = "StraightDown";
						tempEnemy.nextType = "SlowRight";
						tempEnemy.attackType = "FullSpread";
						tempEnemy.waiting = true;
						tempEnemy.maxShot = 20
						gameEngine.addEntity(tempEnemy);
					}, i);
			}
		}
		if (difficulty > 1) 
		{
			setTimeout(function()
			{
				tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 650, 180);
				tempEnemy.enemyType = "StraightLeftLoop";
				tempEnemy.nextType = "StraightLeft";
				gameEngine.addEntity(tempEnemy);
			}, 21000);
		}
		if (difficulty > 2) {
			setTimeout(function()
			{
				tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 650, 180);
				tempEnemy.enemyType = "StraightLeftLoop";
				tempEnemy.nextType = "StraightLeft";
				gameEngine.addEntity(tempEnemy);
			}, 25500);
		}
		
			setTimeout(function()
				{
					tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), -50, 50);
					tempEnemy.enemyType = "StraightRightLoop";
					tempEnemy.nextType = "StraightRight";
					gameEngine.addEntity(tempEnemy);
				}, 28000);
			
		
		if(difficulty > 1)
		{	setTimeout(function()
			{
				tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 650, 180);
				tempEnemy.enemyType = "StraightLeftLoop";
				tempEnemy.nextType = "StraightLeft";
				tempEnemy.attackType = "Star";
				gameEngine.addEntity(tempEnemy);
			}, 32000);
		}
		
		setTimeout(function()
		{
			tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 650, 50);
			tempEnemy.enemyType = "StraightLeftLoop";
			tempEnemy.nextType = "StraightLeft";
			tempEnemy.attackType = "SecondaryStar";
			gameEngine.addEntity(tempEnemy);
		}, 32800);
		if (difficulty > 1) 
		{
			setTimeout(function()
			{
				tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 650, 270);
				tempEnemy.enemyType = "StraightLeftLoop";
				tempEnemy.nextType = "StraightLeft";
				tempEnemy.attackType = "Star";
				gameEngine.addEntity(tempEnemy);
			}, 33600);
		}
		if (difficulty > 2) {
			setTimeout(function()
			{
				tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 650, 100);
				tempEnemy.enemyType = "StraightLeftLoop";
				tempEnemy.nextType = "StraightLeft";
				tempEnemy.attackType = "SecondaryStar";
				gameEngine.addEntity(tempEnemy);
			}, 34400);
		}
		if (difficulty > 1) 
		{
			setTimeout(function()
			{
				tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 650, 180);
				tempEnemy.enemyType = "StraightLeftLoop";
				tempEnemy.nextType = "StraightLeft";
				tempEnemy.attackType = "Star";
				gameEngine.addEntity(tempEnemy);
			}, 35200);
		}
		if(difficulty > 1) 
		{	for(var i = 38000; i<=48000; i+=(interval * 46))
			{
			setTimeout(function()
					{
						tempEnemy = new Enemy3(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 120, -50);
						tempEnemy.enemyType = "StraightDown";
						tempEnemy.nextType = "SlowRight";
						tempEnemy.attackType = "FullSpread";
						tempEnemy.waiting = true;
						tempEnemy.maxShot = 20
						gameEngine.addEntity(tempEnemy);
					}, i);
			}
		}
		if (difficulty > 2) {
			for(var i = 41000; i<=50000; i+=(interval * 23))
			{
			setTimeout(function()
					{
						tempEnemy = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), 650, 60);
						tempEnemy.enemyType = "StraightLeft";
						tempEnemy.attackType = "Star"
						gameEngine.addEntity(tempEnemy);
					}, i);
			}
		}
	   
			for(var i = 52000; i<=52500; i+=(interval))
			{
				setTimeout(function()
				{
					tempEnemy = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), 650, 40);
					tempEnemy.enemyType = "StraightLeft";
					tempEnemy2 = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), -50, 100);
					tempEnemy2.enemyType = "StraightRight";
					tempEnemy2.attackType = "SecondaryStar";
					gameEngine.addEntity(tempEnemy);
					gameEngine.addEntity(tempEnemy2);
				}, i);
			}
		
		 if (difficulty > 1) {
			 {
			setTimeout(function()
					{
						tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), -50, 180);
						tempEnemy.enemyType = "StraightRightLoop";
						tempEnemy.nextType = "StraightRight";
						tempEnemy.attackType = "Star";
						gameEngine.addEntity(tempEnemy);
					}, 55000);
			 }
		if (difficulty > 2 ) {
				setTimeout(function()
				{
					tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), -50, 50);
					tempEnemy.enemyType = "StraightRightLoop";
					tempEnemy.nextType = "StraightRight";
					tempEnemy.attackType = "SecondaryStar";
					gameEngine.addEntity(tempEnemy);
				}, 55800);
		}
			 if (difficulty > 1) {
				setTimeout(function()
				{
					tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), -50, 270);
					tempEnemy.enemyType = "StraightRightLoop";
					tempEnemy.nextType = "StraightRight";
					tempEnemy.attackType = "Star";
					gameEngine.addEntity(tempEnemy);
				}, 56600);
			 }
				setTimeout(function()
				{
					tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), -50, 100);
					tempEnemy.enemyType = "StraightRightLoop";
					tempEnemy.nextType = "StraightRight";
					tempEnemy.attackType = "SecondaryStar";
					gameEngine.addEntity(tempEnemy);
				}, 56400);
			 if (difficulty > 1) {
				setTimeout(function()
				{
					tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), -50, 180);
					tempEnemy.enemyType = "StraightRightLoop";
					tempEnemy.nextType = "StraightRight";
					tempEnemy.attackType = "Star";
					gameEngine.addEntity(tempEnemy);
				}, 58200);
			 }
				if (difficulty > 1) {
					for(var i = 60000; i<=90000; i+=4600)
					{
					setTimeout(function()
							{
								tempEnemy = new Enemy3(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 480, -50);
								tempEnemy.enemyType = "StraightDown";
								tempEnemy.nextType = "SlowLeft";
								tempEnemy.attackType = "FullSpread";
								tempEnemy.waiting = true;
								tempEnemy.maxShot = 20
								gameEngine.addEntity(tempEnemy);
							}, i);
					}
				}
			   
					 
					for(var i = 62500; i<=90500; i+=4600)
					{
					setTimeout(function()
							{
								tempEnemy = new Enemy3(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 120, -50);
								tempEnemy.enemyType = "StraightDown";
								tempEnemy.nextType = "SlowRight";
								tempEnemy.attackType = "FullSpread";
								tempEnemy.waiting = true;
								tempEnemy.maxShot = 20
								gameEngine.addEntity(tempEnemy);
							}, i);
					}
				 
				if (difficulty > 2) {
					setTimeout(function()
					{
						tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 650, 180);
						tempEnemy.enemyType = "StraightLeftLoop";
						tempEnemy.nextType = "StraightLeft";
						gameEngine.addEntity(tempEnemy);
					}, 64000);
				}
				 if (difficulty > 1) {
					setTimeout(function()
					{
						tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 650, 180);
						tempEnemy.enemyType = "StraightLeftLoop";
						tempEnemy.nextType = "StraightLeft";
						gameEngine.addEntity(tempEnemy);
					}, 68000);
				 }
				setTimeout(function()
				{
					tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), -50, 50);
					tempEnemy.enemyType = "StraightRightLoop";
					tempEnemy.nextType = "StraightRight";
					gameEngine.addEntity(tempEnemy);
				}, 71000);
				 if (difficulty > 1) {
					for(var i = 80000; i<=90500; i+=4600)
					{
					setTimeout(function()
							{
								tempEnemy = new Enemy3(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 350, -50);
								tempEnemy.enemyType = "StraightDown";
								tempEnemy.nextType = "SlowLeft";
								tempEnemy.attackType = "FullSpread";
								tempEnemy.waiting = true;
								tempEnemy.maxShot = 20
								gameEngine.addEntity(tempEnemy);
							}, i);
					}
				 }
				  if (difficulty > 1) {
				for(var i = 82000; i<=92500; i+=4600)
				{
				setTimeout(function()
						{
							tempEnemy = new Enemy3(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 270, -50);
							tempEnemy.enemyType = "StraightDown";
							tempEnemy.nextType = "SlowRight";
							tempEnemy.attackType = "FullSpread";
							tempEnemy.waiting = true;
							tempEnemy.maxShot = 20
							gameEngine.addEntity(tempEnemy);
						}, i);
					}
				}
				
				if (difficulty > 1) {
		
					for(var i = 99000; i<=99500; i+=100)
					{
						setTimeout(function()
						{
							tempEnemy = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), 650, 40);
							tempEnemy.enemyType = "StraightLeft";
							tempEnemy2 = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), -50, 100);
							tempEnemy2.enemyType = "StraightRight";
							tempEnemy2.attackType = "SecondaryStar";
							gameEngine.addEntity(tempEnemy);
							gameEngine.addEntity(tempEnemy2);
						}, i);
					}
				}
				 if (difficulty > 1) {
				setTimeout(function()
				{
					tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 650, 180);
					tempEnemy.enemyType = "StraightLeftLoop";
					tempEnemy.nextType = "StraightLeft";
					gameEngine.addEntity(tempEnemy);
				}, 103000);
				 }
				 if (difficulty > 2) {
				setTimeout(function()
					{
						tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), -50, 50);
						tempEnemy.enemyType = "StraightRightLoop";
						tempEnemy.nextType = "StraightRight";
						gameEngine.addEntity(tempEnemy);
					}, 103000);
				 }
				
					for(var i = 104000; i<=104500; i+=interval)
					{
						setTimeout(function()
						{
							tempEnemy = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), 650, 40);
							tempEnemy.enemyType = "StraightLeft";
							tempEnemy2 = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), -50, 100);
							tempEnemy2.enemyType = "StraightRight";
							tempEnemy2.attackType = "SecondaryStar";
							gameEngine.addEntity(tempEnemy);
							gameEngine.addEntity(tempEnemy2);
						}, i);
					}
				
				 if (difficulty > 1) {
				setTimeout(function()
				{
					tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 650, 180);
					tempEnemy.enemyType = "StraightLeftLoop";
					tempEnemy.nextType = "StraightLeft";
					gameEngine.addEntity(tempEnemy);
				}, 107000);
				 }
				if (difficulty > 2) {
					setTimeout(function()
						{
							tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), -50, 50);
							tempEnemy.enemyType = "StraightRightLoop";
							tempEnemy.nextType = "StraightRight";
							gameEngine.addEntity(tempEnemy);
						}, 107000);
				}
				if (difficulty > 1) {
					for(var i = 109000; i<=109500; i+=interval)
					{
						setTimeout(function()
						{
							tempEnemy = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), 650, 40);
							tempEnemy.enemyType = "StraightLeft";
							tempEnemy2 = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), -50, 100);
							tempEnemy2.enemyType = "StraightRight";
							tempEnemy2.attackType = "SecondaryStar";
							gameEngine.addEntity(tempEnemy);
							gameEngine.addEntity(tempEnemy2);
						}, i);
					}
				}
				
				setTimeout(function()
				{
					tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 650, 180);
					tempEnemy.enemyType = "StraightLeftLoop";
					tempEnemy.nextType = "StraightLeft";
					gameEngine.addEntity(tempEnemy);
				}, 111200);
				 if (difficulty > 1) {
				setTimeout(function()
					{
						tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), -50, 50);
						tempEnemy.enemyType = "StraightRightLoop";
						tempEnemy.nextType = "StraightRight";
						gameEngine.addEntity(tempEnemy);
					}, 111200);
				 }
				if(difficulty > 2)
				{
					for(var i = 115000; i<=115500; i+=interval	)
					{
						setTimeout(function()
						{
							tempEnemy = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), 650, 40);
							tempEnemy.enemyType = "StraightLeft";
							tempEnemy2 = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), -50, 100);
							tempEnemy2.enemyType = "StraightRight";
							tempEnemy2.attackType = "SecondaryStar";
							gameEngine.addEntity(tempEnemy);
							gameEngine.addEntity(tempEnemy2);
						}, i);
					}
				}
				
		 }gameEngine.gameScore = 7400;
		
}

//function finishedLoading(bufferList)
//{
//	var source1 = context.createBufferSource();
//	source1.buffer = bufferList[0];
//	source1.connect(context.destination);
//	source1.start(0);
//}

function starter() {
	
	var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");
	var gameEngine = new GameEngine();
	gameEngine.play = false;
	gameEngine.lives = 5;
	var menu = new Menu(gameEngine, AM.getAsset("./img/menu.png"));
	gameEngine.addEntity(menu);
	
	bufferLoader = new BufferLoader(
			audioCtx,
			[
				'./audio/sennen.ogg',
				'./audio/attack3.ogg',
				'./audio/dead.ogg',
			],
			function(buffer) {
				console.log("Callback");
				soundBuffer = buffer;
			}
			);
	bufferLoader.load();
    
    gameEngine.init(ctx);
    gameEngine.start();
    
    gameEngine.gameScore = 0;
    //gameEngine.showOutlines = true;
    
    gameEngine.addEntity(new Reimu(gameEngine, AM.getAsset("./img/reimu_hakurei.png"), 400, 500));
}
function restarter(gameEngine, ctx) {
	gameEngine.init(ctx);
    gameEngine.start();
    
    gameEngine.gameScore = 0;
	gameEngine.entities = [];
    //gameEngine.showOutlines = true;
    
    gameEngine.addEntity(new Reimu(gameEngine, AM.getAsset("./img/reimu_hakurei.png"), 400, 500));
}
	
function Menu(game, sprite) {
	this.sprite = sprite;
	Entity.call(this, game, 0, 0);
}
Menu.prototype = new Entity();
Menu.prototype.constructor = Menu;
Menu.prototype.reset = function() {
		this.game.play = false;
}
Menu.update = function() {
	if(this.game.space) {
		this.game.play = true;
	}
}
Menu.prototype.draw = function(ctx) {
	if(this.game.play) return;
	if(!this.game.play) {
		
		//ctx.drawImage(this.sprite, 0, 0);
		ctx.font = "24pt Times New Roman";
		ctx.fillStyle = "white";
		ctx.fillText("Space to start", 200, 200);
		ctx.fillStyle = "black";
		ctx.strokeText("Space to start", 200, 200);
	}
}


AM.queueDownload("./img/blue_background.jpg");
AM.queueDownload("./img/Touhou_pfb_sprites.png");
AM.queueDownload("./img/reimu_hakurei.png");
AM.queueDownload("./img/enemy.png")
AM.queueDownload("./img/mini.png")
AM.queueDownload("./img/battle.png")
AM.queueDownload("./img/battlepurple.png")
AM.queueDownload("./img/menu.png")
AM.queueDownload("./img/hud.png")

//AM.queueDownload("./audio/sennen.ogg")
//AM.queueDownload("./audio/attack3.ogg")
//AM.queueDownload("./SFX/dead.ogg")



AM.downloadAll(function () {
	starter();
    /*var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");
	var gameEngine = new GameEngine();
	gameEngine.play = false;
	var menu = new Menu(gameEngine, AM.getAsset("./img/menu.png"));
	gameEngine.addEntity(menu);
	
	bufferLoader = new BufferLoader(
			audioCtx,
			[
				'./audio/sennen.ogg',
				'./audio/attack3.ogg',
				'./audio/dead.ogg',
			],
			function(buffer) {
				console.log("Callback");
				soundBuffer = buffer;
			}
			);
	bufferLoader.load();
    
    gameEngine.init(ctx);
    gameEngine.start();
    
    gameEngine.gameScore = gameScore;
    //gameEngine.showOutlines = true;
    
    gameEngine.addEntity(new Reimu(gameEngine, AM.getAsset("./img/reimu_hakurei.png"), 400, 500));*/

    //gameEngine.addEntity(new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 300, 50));
	//gameEngine.addEntity(new Enemy3(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 300, 350));
	/*gameEngine.addEntity(new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), 300, 100));
	gameEngine.addEntity(new Enemy3(gameEngine, AM.getAsset("./img/enemy.png"), 100, 200));
	gameEngine.addEntity(new Enemy3(gameEngine, AM.getAsset("./img/enemy.png"), 40, 50));
	gameEngine.addEntity(new Enemy3(gameEngine, AM.getAsset("./img/enemy.png"), 120, 50));
	gameEngine.addEntity(new Enemy3(gameEngine, AM.getAsset("./img/enemy.png"), 80, 50));*/
    
    
    
    
//	for(var i = 10000; i<=10500; i+=100)
//    {
//    	setTimeout(function()
//	    {
//    		tempEnemy = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), 650, 80);
//    		tempEnemy.enemyType = "StraightDown";
//    		gameEngine.addEntity(tempEnemy);
//	    }, i);
//    }
//	for(var i = 2000; i < 5000; i +=500)
//	{
//		setTimeout(function()
//		{ 
//			tempEnemy = new Enemy3(gameEngine, AM.getAsset("./img/mini.png"), 500, 0);
//			gameEngine.addEntity(tempEnemy);
//		}, i);
//	}
    
    console.log("All Done!");
});