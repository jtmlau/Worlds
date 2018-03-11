window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = new AudioContext();
var bufferLoader;
var soundBuffer = null;
var gainNode = null;
var gainNode2 = null;
var gainNode1 = null;
var gainNode3 = null;
var gameEngine = null;
var mute = false;
var stopSpawn = false;
var AM = new AssetManager();
var bombCount = 0;
var textDisplay = "";

gameScore = 0;
intervalIDs = [];

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

Animation.prototype.drawYuyukoFrame = function(tick, ctx, x, y, yuyuko) {
	this.elapsedTime += tick;
	if(this.isDone()) {
		if(this.loop) this.elapsedTime =0;
	}
	var vindex =0;
	var offset = 710;
	var yoffset = 380;
	
		
	var frame = this.currentFrame();
	
	if(yuyuko.isMoving)
	{
//		xindex = 710;
//		yindex = 570;
//		
//		ctx.drawImage(this.spriteSheet, xindex,
//				yindex, this.frameWidth, this.frameHeight,
//				x, y, this.frameWidth * this.scale, this.frameHeight * this.scale);
		
		xindex = 815;
		yindex = 470;
		
		ctx.drawImage(this.spriteSheet, xindex,
				yindex, this.frameWidth, this.frameHeight,
				x, y, this.frameWidth * this.scale, this.frameHeight * this.scale);
	}
	else if(yuyuko.startMove)
	{
		if ((frame < 3)) {
			var xindex = 710 + (frame * 50);
			var yindex = 380;
			ctx.drawImage(this.spriteSheet, xindex,
			yindex, this.frameWidth, this.frameHeight,
			x, y, this.frameWidth * this.scale, this.frameHeight * this.scale);
		} else{
			var xindex = 715 +((frame - 3) * 50);
			var yindex = 470;
			ctx.drawImage(this.spriteSheet, xindex,
			yindex, this.frameWidth, this.frameHeight,
			x, y + 10	, this.frameWidth * this.scale, this.frameHeight * this.scale);	
		}
		if(frame == 5)
		{
			yuyuko.isMoving = true;
		}
	}
	
	if(!yuyuko.startMove & !yuyuko.isMoving)
	{
		xindex = 710;
		yindex = 380;
		
		ctx.drawImage(this.spriteSheet, xindex,
				yindex, this.frameWidth, this.frameHeight,
				x, y, this.frameWidth * this.scale, this.frameHeight * this.scale);
	}
	
	//yindex = Math.floor(frame/this.sheetWidth)
	
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
		gainNode2.gain.value = 0.2;
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

function playBomb(buffer)
{
	var source3 = audioCtx.createBufferSource(); // creates a sound source
	gainNode3 = audioCtx.createGain();
	source3.buffer = buffer;                    // tell the source which sound to play
	source3.connect(gainNode3);
	gainNode3.connect(audioCtx.destination);       // connect the source to the context's destination (the speakers)
	if(mute)
	{
		gainNode3.gain.value = 0;
	}
	else
	{
		gainNode3.gain.value = 0.14;
	}
	
	source3.start(0); 
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

function Reimu(game, spritesheet, hp) {
	this.hp = hp;
	this.bombs = 3;
	
	this.animation = new Animation(spritesheet, 32, 47, 261, .2, 8, true, 1.5); // Creates the Reimu animation.
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
    this.removeOnDeath = true;
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
	this.removeOnDeath = true;
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
	this.removeOnDeath = true;
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
	if(this.game.x) {
		this.game.x = false;
		if(this.bombs > 0) {
			this.bombs--;
			bombCount--;
			this.game.bombs = this.bombs;
			//DO BOMB STUFF
			if(soundBuffer != null)
		{
			playBomb(soundBuffer[3]);
		}
			
			
			for (var i = 0; i < this.game.entities.length; i++) 
        	{
                if(this.game.entities[i].isEnemy && !this.game.entities[i].bombImmune)
                {
                	this.game.entities[i].removeFromWorld = true;
                }
        	}
		}
	}
	if(this.game.z) { // If the space key is pressed.
		this.isShooting = true;
		this.bulletY = that.y;
	}
	
	if(this.game.space)
	{
		if(!this.spawned)
		{
			if(soundBuffer != null)
			{
				playBGM(soundBuffer[0]);
				this.music = true;
			}
			//stopSpawn = false;
			
			//spawnEnemies(this.game, 2);
			spawnBoss(this.game);
			console.log("Calling spawn enemies");
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
				if(gainNode3 != null)
				{
					gainNode3.gain.value = 0;
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
					gainNode2.gain.value = 0.2;
				}
				if(gainNode3 != null)
				{
					gainNode3.gain.value = 0.14;
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
	}if(!this.game.z) {
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
        	
        	this.game.lives--;
        	
            this.removeFromWorld = true;
            ent.removeFromWorld = true;
            
          //remove all enemies and bullets on death?
        	for (var i = 0; i < this.game.entities.length; i++) 
        	{
                if(this.game.entities[i].removeOnDeath)
                {
                	this.game.entities[i].removeFromWorld = true;
                }
        	}
            
			if(this.game.lives < 1)
			{
				restart(gameEngine, ctx);
				//this.game.gameEnd = true;
			}
			else
			{
				spawnReimu(gameEngine, ctx);
			}
        };
    };
//	if(this.game.gameEnd) {
//		this.game.lives--;
//		if(this.game.lives > 0) {
//		restarter(gameEngine, ctx);
//		
//		} else {
//			//this.game.prototype.init(ctx);
//			starter();
//		}
//	}
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

function Enemy2(game, spritesheet, x, y, hp) {
	this.hp = hp;
	this.x = x;
	this.y = y;
	this.bulletAnimation = new Animation("./img/reimu_hakurei.png", 15, 12, 261, 1, 4, true, 1.5)
	
	this.animation = new Animation(spritesheet, 28, 32, 1350, .5, 8, true, 1.5);// Creates an Enemy animation
	this.enemyType = "StraightLeft";
	this.nextType = "StraightLeft";
	this.attackType = "Star";
	this.removeOnDeath = true;
	this.centerX = 16;
	this.centerY = 24;
	this.waiting = false;
	this.maxShot = 12;
	this.timer = 0;
	this.bombImmune = false;
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
			if (this.hp > 0) {
				this.hp--;
				if(!ent.isHero) {
					ent.removeFromWorld = true;
				}
			} else {
            this.removeFromWorld = true;
            ent.removeFromWorld = true;
            this.game.gameScore += this.killScore;
			this.game.gameScore +=7400;	
            }
            //i dont think we need this anymore?
            if(ent.isHero) 
            {
            	//remove all enemies and bullets on death?
            	for (var i = 0; i < this.game.entities.length; i++) 
            	{
                    if(this.game.entities[i].removeOnDeath)
                    {
                    	this.game.entities[i].removeFromWorld = true;
                    }
            	}
            	
            	
            	this.game.lives--;
            	
            	if(this.game.lives < 1)
    			{
            		restart(gameEngine, ctx);
            		//this.game.gameEnd = true;
            		
    			}
    			else
    			{
    				spawnReimu(gameEngine, ctx);
    			}
            }
			
        };
    };
//	if(this.game.gameEnd) {
//		this.game.lives --;
//		if(this.game.lives > 0) {
//			spawnReimu(gameEngine, ctx);
//		}
//	}
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
function Yuyuko(game, spritesheet, x, y, difficulty) {//set hp to like 100
	this.hp = difficulty * 20;
	this.phasehealth = this.hp/6;
	this.phase = 6;
	this.spritesheet = spritesheet;
	this.x = x;
	this.y = y;
	this.floatnum = 6;
	this.fanAlpha = 0.0;
	this.animation = new Animation(spritesheet, 40, 85, 1350, .1, 6, true, 1.5)
	this.fanimation = new Animation(spritesheet, 510, 260, 1350, 1, 1, true, 3) //x=710-1220 y = 640-900
	this.fanout = true;
	this.state = "Down";
	this.timer = 0;
	this.speed = 80;
	this.bulletSpeed = 10;
	this.bulletY = 10;
	this.radius = 50;
	this.centerX = 37;
    this.centerY = 70;
	this.count = 0;
	this.bombImmune = true;
	this.startMove = false;
	this.isMoving = false;
	this.currentSpell = false;
	this.bulletInterval = 7;
	this.canCollide = true;
	this.isEnemy = true;
	this.shoot = false;
	this.killScore = 10000;
	this.ctx = game.ctx;
	Entity.call(this,game,x,y);
};
Yuyuko.prototype = new Entity();
Yuyuko.prototype.constructor = Yuyuko;
Yuyuko.prototype.update = function () {
	if(this.hp % this.phasehealth === 0 && this.hp/this.phasehealth > this.phase) {
		this.phase --;
		if(this.phase%3 ===0) {
			this.fanout = true;
		} else {
			this.fanout = false;
			this.fanAlpha = 0.0;
		}
		for (var i = 0; i < this.game.entities.length; i++) 
        	{
				if(!this.game.entities[i]===this) {
					if(this.game.entities[i].isEnemy)
					{
						this.game.entities[i].removeFromWorld = true;
					}
				}
        	}
	}
	Entity.prototype.update.call(this);
	if(this.state === "Down") {
		this.startMove = true;
		
		this.y += 1
		if (this.y > 100) {
			this.state = "Float";
			
		}
	}
	if(this.state === "MoveRight") {
		if(this.x < 350) {
			this.x++;
		}
		if(this.y > 50) {
			this.y -= .5;
		}
		if(this.x > 346 && this.y < 60)
		{
			this.state = "MoveCenter"
		}
		
	}
	if(this.state === "MoveLeft") {
		if(this.x > 150) {
			this.x--;
		}
		if(this.y > 50) {
			this.y -= .5;
		}
		if(this.x < 158 && this.y < 60)
		{
			this.state = "MoveCenter"
		}
	}
	if(this.state === "MoveCenter") {
		if(this.x > 250) {
			this.x--;
		}
		if(this.x < 250) {
			this.x ++;
		}
		if(this.y > 100) {
			this.y-=.5;
		}
		if(this.y < 100) {
			this.y+=.5;
		}
		if(this.x < 252 && this.x > 248 && this.y >98 && this.y < 102) {
			this.state = "Float";
			console.log("Center to float");
		}
	} 
	if(this.state === "Float") {
		this.startMove = false;
		this.isMoving = false;
		
		console.log(this.state);
//		if(this.floatnum % 2 === 1 && this.floatnum >= 0) {
//			if(this.y <= 90) {
//				this.floatnum--;
//			}this.y-=.3;
//		} 
//		if (this.floatnum % 2 === 0 && this.floatnum >= 0) {
//			if(this.y >= 110) {
//				this.floatnum--;
//			}this.y +=.3;
//		}
		
		if(this.floatnum % 2 === 1) {
			if(this.y <= 90) {
				this.floatnum--;
			}this.y-=.3;
		} 
		if (this.floatnum % 2 === 0) {
			if(this.y >= 110) {
				this.floatnum--;
			}this.y +=.3;
		}
		if (this.floatnum === 0)
		{
			this.floatnum = 6;
		}
		
		this.timer++;
		
		console.log(this.timer);
		
		if(this.timer == 130)
		{
			if(this.currentSpell == false)
			{
				timer = 0;
				var random = Math.floor((Math.random() * 3) +1);
				if(random == 1)
				{
					this.state = "MoveLeft";
					this.startMove = true;
				}
				else if(random == 2)
				{
					this.state = "MoveRight";
					this.startMove = true;
				}
				console.log(random);
			}
			
			console.log(this.state);
			
			this.timer = 0;
		}
		
//		if(this.floatnum < 0) {
//			this.floatnum = 13;
//			this.state = "Move"
//			this.fanout = true;
//		}
		
	}
		
		
	

	
	var gameEngine = this.game;
	var ctx = this.ctx;
	for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this != ent && this.collide(ent) && !ent.isEnemy && !ent.canCollide) {
			if(this.hp > 0) {
				this.hp--;
				console.log(this.hp);
				if(!ent.isHero) {
					ent.removeFromWorld = true;
				}
			} else {
            this.removeFromWorld = true;
            ent.removeFromWorld = true;
            this.game.gameScore += this.killScore;
            }
            //i dont think we need this anymore?
            if(ent.isHero) 
            {
            	//remove all enemies and bullets on death?
            	for (var i = 0; i < this.game.entities.length; i++) 
            	{
                    if(this.game.entities[i].removeOnDeath)
                    {
                    	this.game.entities[i].removeFromWorld = true;
                    }
            	}
            	
            	
            	this.game.lives--;
            	
            	if(this.game.lives < 1)
    			{
            		restart(gameEngine, ctx);
            		//this.game.gameEnd = true;
    			}
    			else
    			{
    				spawnReimu(gameEngine, ctx);
    			}
            }
			
        };
    };
//	if(this.game.gameEnd) {
//		this.game.lives --;
//		if(this.game.lives > 0) {
//			spawnReimu(gameEngine, ctx);
//		}
//	}
}



Yuyuko.prototype.draw = function () {

	if(this.fanout) {
		//x=710-1220 y = 640-900
//		var xindex = 710;
//		var yindex = 640;
//		this.ctx.drawImage(this.spritesheet, xindex,
//		yindex, 510, 260,
//		this.x-320, this.y -130	, 510*1.4, 260*1.4);	
		//this.fanimation.drawFan(this.ctx, this.x, this.y);
		
		var xindex = 710;
		var yindex = 640;
		if(this.fanAlpha < 1.1)
		{
			this.fanAlpha+= 0.004;
			this.ctx.save();
			this.ctx.globalAlpha = this.fanAlpha;
			this.ctx.drawImage(this.spritesheet, xindex,
				yindex, 510, 260,
				this.x-320, this.y -130	, 510*1.4, 260*1.4);
			this.ctx.restore();
		}
		else
		{
			this.ctx.drawImage(this.spritesheet, xindex,
					yindex, 510, 260,
					this.x-320, this.y -130	, 510*1.4, 260*1.4);
		}
	}
	this.animation.drawYuyukoFrame(this.game.clockTick, this.ctx, this.x, this.y, this);
	

    Entity.prototype.draw.call(this);
};
function Enemy(game, spritesheet, x, y, hp){
	this.hp = hp;
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
	this.removeOnDeath = true;
	this.timer = 0;
	this.speed = Math.floor((Math.random() * 10) + 10)*20;
	this.bulletSpeed = 10;
	this.bulletY = 50;
	this.radius = 15
	this.bombImmune = false;
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
			if(this.hp > 0) {
				this.hp--;
				if(!ent.isHero) {
					ent.removeFromWorld = true;
				}
			} else {
            this.removeFromWorld = true;
            ent.removeFromWorld = true;
            this.game.gameScore += this.killScore;
            }
            //i dont think we need this anymore?
            if(ent.isHero) 
            {
            	//remove all enemies and bullets on death?
            	for (var i = 0; i < this.game.entities.length; i++) 
            	{
                    if(this.game.entities[i].removeOnDeath)
                    {
                    	this.game.entities[i].removeFromWorld = true;
                    }
            	}
            	
            	
            	this.game.lives--;
            	
            	if(this.game.lives < 1)
    			{
            		restart(gameEngine, ctx);
            		//this.game.gameEnd = true;
    			}
    			else
    			{
    				spawnReimu(gameEngine, ctx);
    			}
            }
			
        };
    };
//	if(this.game.gameEnd) {
//		this.game.lives --;
//		if(this.game.lives > 0) {
//			spawnReimu(gameEngine, ctx);
//		}
//	}
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



function Enemy3(game, spritesheet, x, y, hp){
	this.hp = hp;
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
	this.bombImmune = false;
	this.bulletInterval = bulletInterval = Math.floor(Math.random() * 11) + 1;
	this.totalInterval = 12;
	this.isEnemy = true;
	this.shoot = false;
	this.currentState = 60;
	this.removeOnDeath = true;
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
			if(this.hp > 0) {
				this.hp--;
				if(!ent.isHero) {
					ent.removeFromWorld = true;
				}
			} else {
            this.removeFromWorld = true;
            ent.removeFromWorld = true;
            this.game.gameScore += this.killScore;
            }
            //i dont think we need this anymore?
            if(ent.isHero) 
            {
            	this.game.lives--;
            	
            	//remove all enemies and bullets on death?
            	for (var i = 0; i < this.game.entities.length; i++) 
            	{
                    if(this.game.entities[i].removeOnDeath)
                    {
                    	this.game.entities[i].removeFromWorld = true;
                    }
            	}
            	
            	if(this.game.lives < 1)
    			{
            		restart(gameEngine, ctx);
            		//this.game.gameEnd = true;
    			}
    			else
    			{
    				spawnReimu(gameEngine, ctx);
    			}
            }
			
        };
    };
//	if(this.game.gameEnd) {
//		this.game.lives --;
//		if(this.game.lives > 0) {
//			spawnReimu(gameEngine, ctx);
//		}
//	}
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
	console.log("Starting Spawn enemies function");
	
	//while(!gameEngine.gamEnd) {
		if (difficulty < 1) {
			difficulty = .5;
		}
		var hp = difficulty;//Math.ceil(difficulty/2);
		var spacing = 6/difficulty;
		var interval = spacing * 50
		var tempID = 0;
		

		for(var i = 2000; i<=2500; i+=interval)
		{
			tempID = setTimeout(function()
			{
				tempEnemy = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), -50, 70, hp);
				tempEnemy.enemyType = "StraightRight";
				gameEngine.addEntity(tempEnemy);
				//gameEngine.addEntity(new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), -50, 80));
			}, i); intervalIDs.push(tempID);
		}
		
		if (difficulty > 1) 
		{
			for(var i = 6000; i<=6500; i+=interval)
			{
				tempID = setTimeout(function()
				{
					tempEnemy = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), 650, 70, hp);
					tempEnemy.enemyType = "StraightLeft";
					gameEngine.addEntity(tempEnemy);
				}, i); intervalIDs.push(tempID);
			}
		}
		if (difficulty > 1) 
		{
			for(var i = 8000; i<=8500; i+=interval)
			{
				tempID = setTimeout(function()
				{
					tempEnemy = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), -50, 40, hp);
					tempEnemy.enemyType = "StraightRight";
					gameEngine.addEntity(tempEnemy);
					//gameEngine.addEntity(new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), -50, 80));
				}, i); intervalIDs.push(tempID);
			}
		}
		
		for(var i = 10000; i<=10500; i+=interval)
		{
			tempID = setTimeout(function()
			{
				tempEnemy = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), 650, 100,hp);
				tempEnemy.enemyType = "StraightLeft";
				gameEngine.addEntity(tempEnemy);
			}, i); intervalIDs.push(tempID);
		}
		
		
		if (difficulty > 2) {	
			for(var i = 12000; i<=12500; i+=interval)
			{
				tempID = setTimeout(function()
				{
					tempEnemy = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), 650, 40, hp);
					tempEnemy.enemyType = "StraightLeft";
					tempEnemy2 = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), -50, 100, hp);
					tempEnemy2.enemyType = "StraightRight";
					gameEngine.addEntity(tempEnemy);
					gameEngine.addEntity(tempEnemy2);
				}, i); intervalIDs.push(tempID);
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
				tempID = setTimeout(function()
					{
						tempEnemy = new Enemy3(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 480, -50, hp);
						tempEnemy.enemyType = "StraightDown";
						tempEnemy.nextType = "SlowLeft";
						tempEnemy.attackType = "FullSpread";
						tempEnemy.waiting = true;
						tempEnemy.maxShot = 20
						gameEngine.addEntity(tempEnemy);
					}, i); intervalIDs.push(tempID);
			}
		if (difficulty > 2) {
			for(var i = 18800; i<=29000; i+=46 * interval)
			{
				tempID = setTimeout(function()
					{
						tempEnemy = new Enemy3(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 120, -50, hp);
						tempEnemy.enemyType = "StraightDown";
						tempEnemy.nextType = "SlowRight";
						tempEnemy.attackType = "FullSpread";
						tempEnemy.waiting = true;
						tempEnemy.maxShot = 20
						gameEngine.addEntity(tempEnemy);
					}, i); intervalIDs.push(tempID);
			}
		}
		if (difficulty > 1) 
		{
			tempID = setTimeout(function()
			{
				tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 650, 180, hp);
				tempEnemy.enemyType = "StraightLeftLoop";
				tempEnemy.nextType = "StraightLeft";
				gameEngine.addEntity(tempEnemy);
			}, 21000); intervalIDs.push(tempID);
		}
		if (difficulty > 2) {
			tempID = setTimeout(function()
			{
				tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 650, 180, hp);
				tempEnemy.enemyType = "StraightLeftLoop";
				tempEnemy.nextType = "StraightLeft";
				gameEngine.addEntity(tempEnemy);
			}, 25500); intervalIDs.push(tempID);
		}
		
		tempID = setTimeout(function()
				{
					tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), -50, 50, hp);
					tempEnemy.enemyType = "StraightRightLoop";
					tempEnemy.nextType = "StraightRight";
					gameEngine.addEntity(tempEnemy);
				}, 28000); intervalIDs.push(tempID);
			
		
		if(difficulty > 1)
		{	tempID = setTimeout(function()
			{
				tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 650, 180, hp);
				tempEnemy.enemyType = "StraightLeftLoop";
				tempEnemy.nextType = "StraightLeft";
				tempEnemy.attackType = "Star";
				gameEngine.addEntity(tempEnemy);
			}, 32000); intervalIDs.push(tempID);
		}
		
		tempID = setTimeout(function()
		{
			tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 650, 50, hp);
			tempEnemy.enemyType = "StraightLeftLoop";
			tempEnemy.nextType = "StraightLeft";
			tempEnemy.attackType = "SecondaryStar";
			gameEngine.addEntity(tempEnemy);
		}, 32800); intervalIDs.push(tempID);
		if (difficulty > 1) 
		{
			tempID = setTimeout(function()
			{
				tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 650, 270, hp);
				tempEnemy.enemyType = "StraightLeftLoop";
				tempEnemy.nextType = "StraightLeft";
				tempEnemy.attackType = "Star";
				gameEngine.addEntity(tempEnemy);
			}, 33600); intervalIDs.push(tempID);
		}
		if (difficulty > 2) {
			tempID = setTimeout(function()
			{
				tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 650, 100, hp);
				tempEnemy.enemyType = "StraightLeftLoop";
				tempEnemy.nextType = "StraightLeft";
				tempEnemy.attackType = "SecondaryStar";
				gameEngine.addEntity(tempEnemy);
			}, 34400); intervalIDs.push(tempID);
		}
		if (difficulty > 1) 
		{
			tempID = setTimeout(function()
			{
				tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 650, 180, hp);
				tempEnemy.enemyType = "StraightLeftLoop";
				tempEnemy.nextType = "StraightLeft";
				tempEnemy.attackType = "Star";
				gameEngine.addEntity(tempEnemy);
			}, 35200); intervalIDs.push(tempID);
		}
		if(difficulty > 1) 
		{	for(var i = 38000; i<=48000; i+=(interval * 46))
			{
			tempID = setTimeout(function()
					{
						tempEnemy = new Enemy3(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 120, -50, hp);
						tempEnemy.enemyType = "StraightDown";
						tempEnemy.nextType = "SlowRight";
						tempEnemy.attackType = "FullSpread";
						tempEnemy.waiting = true;
						tempEnemy.maxShot = 20
						gameEngine.addEntity(tempEnemy);
					}, i); intervalIDs.push(tempID);
			}
		}
		if (difficulty > 2) {
			for(var i = 41000; i<=50000; i+=(interval * 23))
			{
				tempID = setTimeout(function()
					{
						tempEnemy = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), 650, 60, hp);
						tempEnemy.enemyType = "StraightLeft";
						tempEnemy.attackType = "Star"
						gameEngine.addEntity(tempEnemy);
					}, i); intervalIDs.push(tempID);
			}
		}
	   
			for(var i = 52000; i<=52500; i+=(interval))
			{
				tempID = setTimeout(function()
				{
					tempEnemy = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), 650, 40, hp);
					tempEnemy.enemyType = "StraightLeft";
					tempEnemy2 = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), -50, 100, hp);
					tempEnemy2.enemyType = "StraightRight";
					tempEnemy2.attackType = "SecondaryStar";
					gameEngine.addEntity(tempEnemy);
					gameEngine.addEntity(tempEnemy2);
				}, i); intervalIDs.push(tempID);
			}
		
		 if (difficulty > 1) {
			 {
				 tempID = setTimeout(function()
					{
						tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), -50, 180, hp);
						tempEnemy.enemyType = "StraightRightLoop";
						tempEnemy.nextType = "StraightRight";
						tempEnemy.attackType = "Star";
						gameEngine.addEntity(tempEnemy);
					}, 55000); intervalIDs.push(tempID);
			 }
		if (difficulty > 2 ) {
			tempID = setTimeout(function()
				{
					tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), -50, 50, hp);
					tempEnemy.enemyType = "StraightRightLoop";
					tempEnemy.nextType = "StraightRight";
					tempEnemy.attackType = "SecondaryStar";
					gameEngine.addEntity(tempEnemy);
				}, 55800); intervalIDs.push(tempID);
		}
			 if (difficulty > 1) {
				 tempID = setTimeout(function()
				{
					tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), -50, 270, hp);
					tempEnemy.enemyType = "StraightRightLoop";
					tempEnemy.nextType = "StraightRight";
					tempEnemy.attackType = "Star";
					gameEngine.addEntity(tempEnemy);
				}, 56600); intervalIDs.push(tempID);
			 }
			 tempID = setTimeout(function()
				{
					tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), -50, 100, hp);
					tempEnemy.enemyType = "StraightRightLoop";
					tempEnemy.nextType = "StraightRight";
					tempEnemy.attackType = "SecondaryStar";
					gameEngine.addEntity(tempEnemy);
				}, 56400); intervalIDs.push(tempID);
			 if (difficulty > 1) {
				 tempID = setTimeout(function()
				{
					tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), -50, 180, hp);
					tempEnemy.enemyType = "StraightRightLoop";
					tempEnemy.nextType = "StraightRight";
					tempEnemy.attackType = "Star";
					gameEngine.addEntity(tempEnemy);
				}, 58200); intervalIDs.push(tempID);
			 }
				if (difficulty > 1) {
					for(var i = 60000; i<=90000; i+=4600)
					{
						tempID = setTimeout(function()
							{
								tempEnemy = new Enemy3(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 480, -50, hp);
								tempEnemy.enemyType = "StraightDown";
								tempEnemy.nextType = "SlowLeft";
								tempEnemy.attackType = "FullSpread";
								tempEnemy.waiting = true;
								tempEnemy.maxShot = 20
								gameEngine.addEntity(tempEnemy);
							}, i); intervalIDs.push(tempID);
					}
				}
			   
					 
					for(var i = 62500; i<=90500; i+=4600)
					{
						tempID = setTimeout(function()
							{
								tempEnemy = new Enemy3(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 120, -50, hp);
								tempEnemy.enemyType = "StraightDown";
								tempEnemy.nextType = "SlowRight";
								tempEnemy.attackType = "FullSpread";
								tempEnemy.waiting = true;
								tempEnemy.maxShot = 20
								gameEngine.addEntity(tempEnemy);
							}, i); intervalIDs.push(tempID);
					}
				 
				if (difficulty > 2) {
					tempID = setTimeout(function()
					{
						tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 650, 180, hp);
						tempEnemy.enemyType = "StraightLeftLoop";
						tempEnemy.nextType = "StraightLeft";
						gameEngine.addEntity(tempEnemy);
					}, 64000); intervalIDs.push(tempID);
				}
				 if (difficulty > 1) {
					 tempID = setTimeout(function()
					{
						tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 650, 180, hp);
						tempEnemy.enemyType = "StraightLeftLoop";
						tempEnemy.nextType = "StraightLeft";
						gameEngine.addEntity(tempEnemy);
					}, 68000); intervalIDs.push(tempID);
				 }
				 tempID = setTimeout(function()
				{
					tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), -50, 50, hp);
					tempEnemy.enemyType = "StraightRightLoop";
					tempEnemy.nextType = "StraightRight";
					gameEngine.addEntity(tempEnemy);
				}, 71000); intervalIDs.push(tempID);
				 if (difficulty > 1) {
					for(var i = 80000; i<=90500; i+=4600)
					{
						tempID = setTimeout(function()
							{
								tempEnemy = new Enemy3(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 350, -50, hp);
								tempEnemy.enemyType = "StraightDown";
								tempEnemy.nextType = "SlowLeft";
								tempEnemy.attackType = "FullSpread";
								tempEnemy.waiting = true;
								tempEnemy.maxShot = 20
								gameEngine.addEntity(tempEnemy);
							}, i); intervalIDs.push(tempID);
					}
				 }
				  if (difficulty > 1) {
				for(var i = 82000; i<=92500; i+=4600)
				{
					tempID = setTimeout(function()
						{
							tempEnemy = new Enemy3(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 270, -50, hp);
							tempEnemy.enemyType = "StraightDown";
							tempEnemy.nextType = "SlowRight";
							tempEnemy.attackType = "FullSpread";
							tempEnemy.waiting = true;
							tempEnemy.maxShot = 20
							gameEngine.addEntity(tempEnemy);
						}, i); intervalIDs.push(tempID);
					}
				}
				
				if (difficulty > 1) {
		
					for(var i = 99000; i<=99500; i+=100)
					{
						tempID = setTimeout(function()
						{
							tempEnemy = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), 650, 40, hp);
							tempEnemy.enemyType = "StraightLeft";
							tempEnemy2 = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), -50, 100, hp);
							tempEnemy2.enemyType = "StraightRight";
							tempEnemy2.attackType = "SecondaryStar";
							gameEngine.addEntity(tempEnemy);
							gameEngine.addEntity(tempEnemy2);
						}, i); intervalIDs.push(tempID);
					}
				}
				 if (difficulty > 1) {
					 tempID = setTimeout(function()
				{
					tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 650, 180, hp);
					tempEnemy.enemyType = "StraightLeftLoop";
					tempEnemy.nextType = "StraightLeft";
					gameEngine.addEntity(tempEnemy);
				}, 103000); intervalIDs.push(tempID);
				 }
				 if (difficulty > 2) {
					 tempID = setTimeout(function()
					{
						tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), -50, 50, hp);
						tempEnemy.enemyType = "StraightRightLoop";
						tempEnemy.nextType = "StraightRight";
						gameEngine.addEntity(tempEnemy);
					}, 103000); intervalIDs.push(tempID);
				 }
				
					for(var i = 104000; i<=104500; i+=interval)
					{
						tempID = setTimeout(function()
						{
							tempEnemy = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), 650, 40, hp);
							tempEnemy.enemyType = "StraightLeft";
							tempEnemy2 = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), -50, 100, hp);
							tempEnemy2.enemyType = "StraightRight";
							tempEnemy2.attackType = "SecondaryStar";
							gameEngine.addEntity(tempEnemy);
							gameEngine.addEntity(tempEnemy2);
						}, i); intervalIDs.push(tempID);
					}
				
				 if (difficulty > 1) {
					 tempID = setTimeout(function()
				{
					tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 650, 180, hp);
					tempEnemy.enemyType = "StraightLeftLoop";
					tempEnemy.nextType = "StraightLeft";
					gameEngine.addEntity(tempEnemy);
				}, 107000); intervalIDs.push(tempID);
				 }
				if (difficulty > 2) {
					tempID = 	setTimeout(function()
						{
							tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), -50, 50, hp);
							tempEnemy.enemyType = "StraightRightLoop";
							tempEnemy.nextType = "StraightRight";
							gameEngine.addEntity(tempEnemy);
						}, 107000); intervalIDs.push(tempID);
				}
				if (difficulty > 1) {
					for(var i = 109000; i<=109500; i+=interval)
					{
						tempID = 	setTimeout(function()
						{
							tempEnemy = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), 650, 40, hp);
							tempEnemy.enemyType = "StraightLeft";
							tempEnemy2 = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), -50, 100, hp);
							tempEnemy2.enemyType = "StraightRight";
							tempEnemy2.attackType = "SecondaryStar";
							gameEngine.addEntity(tempEnemy);
							gameEngine.addEntity(tempEnemy2);
						}, i); intervalIDs.push(tempID);
					}
				}
				
				tempID = setTimeout(function()
				{
					tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 650, 180, hp);
					tempEnemy.enemyType = "StraightLeftLoop";
					tempEnemy.nextType = "StraightLeft";
					gameEngine.addEntity(tempEnemy);
				}, 111200); intervalIDs.push(tempID);
				 if (difficulty > 1) {
					 tempID = setTimeout(function()
					{
						tempEnemy = new Enemy2(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), -50, 50, hp);
						tempEnemy.enemyType = "StraightRightLoop";
						tempEnemy.nextType = "StraightRight";
						gameEngine.addEntity(tempEnemy);
					}, 111200); intervalIDs.push(tempID);
				 }
				if(difficulty > 2)
				{
					for(var i = 115000; i<=115500; i+=interval	)
					{
						tempID = setTimeout(function()
						{
							tempEnemy = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), 650, 40, hp);
							tempEnemy.enemyType = "StraightLeft";
							tempEnemy2 = new Enemy(gameEngine, AM.getAsset("./img/enemy.png"), -50, 100, hp);
							tempEnemy2.enemyType = "StraightRight";
							tempEnemy2.attackType = "SecondaryStar";
							gameEngine.addEntity(tempEnemy);
							gameEngine.addEntity(tempEnemy2);
						}, i); intervalIDs.push(tempID);
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

function stopSpawns()
{
	//stop all spawns
	intervalIDs.forEach(function(element)
	{
		clearTimeout(element);
	});
}

function spawnBoss(gameEngine)
{
	gameEngine.addEntity(new Yuyuko(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 260, -200, 100));
}

function starter() 
{	
	var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");
	gameEngine = new GameEngine();
	gameEngine.play = false;
	gameEngine.lives = 5;
	textDisplay = "Space to Start";
	var menu = new Menu(gameEngine, AM.getAsset("./img/menu.png"));
	gameEngine.addEntity(menu);
	gameEngine.bombs = 3;
	bufferLoader = new BufferLoader(
			audioCtx,
			[
				'./audio/sennen.ogg',
				'./audio/attack3.ogg',
				'./audio/dead.ogg',
				'./audio/spellcard.ogg',
			],
			function(buffer) {
				console.log("Callback");
				soundBuffer = buffer;
			}
			);
	bufferLoader.load();
    
    gameEngine.init(ctx);
    
    //show bounding boxes
    gameEngine.showOutlines = true;
    
    gameEngine.start();
    
    gameEngine.gameScore = 0;
    //gameEngine.showOutlines = true;
    //gameEngine.addEntity(new Yuyuko(gameEngine, AM.getAsset("./img/Touhou_pfb_sprites.png"), 260, -200, 100));
    gameEngine.addEntity(new Reimu(gameEngine, AM.getAsset("./img/reimu_hakurei.png"), 400, 500));
}
function restart(gameEngine, ctx) {
	stopSpawns();
	
	bombCount = 3;
	gameEngine.bombs = 3;
	
	intervalIDs = [];
	
	
	
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
	if(gainNode3 != null)
	{
		gainNode3.gain.value = 0;
	}
	
	gainNode = null
	gainNode1 = null;
	gainNode2 = null;
	
	stopSpawn = true;
	
	gameEngine.lives = 5;
	
	temp = new Reimu(gameEngine, AM.getAsset("./img/reimu_hakurei.png"), 400, 500);
	temp.spawned = false;
	
	
	gameEngine.addEntity(temp);
	gameEngine.gameScore = 0;
	
	gameEngine.play = false;
	
	textDisplay = "Space to Restart";
	var menu = new Menu(gameEngine, AM.getAsset("./img/menu.png"));
	gameEngine.addEntity(menu);
	
}

function spawnReimu(gameEngine, ctx) {
	
	tempReimu = new Reimu(gameEngine, AM.getAsset("./img/reimu_hakurei.png"), 400, 500);
	tempReimu.spawned = true;
	tempReimu.music = true;
	
	tempReimu.bombs = gameEngine.bombs;
	gameEngine.addEntity(tempReimu);
}

function timeStop()
{
	//This code actually causes timestop for the bullets!!!!!!!!! good to know
    
    b = [];
    bEnemy = [];
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
		ctx.fillText(textDisplay, 200, 200);
		ctx.fillStyle = "black";
		ctx.strokeText(textDisplay, 200, 200);
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