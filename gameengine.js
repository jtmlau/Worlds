window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

function distance(a, b) {
	
    var difX = a.x - b.x;
    var difY = a.y - b.y;
    return Math.sqrt(difX * difX + difY * difY);
};

function GameEngine() {
    this.entities = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.gameEnd = false;
    this.gameScore = 0;
};

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.startInput();
    this.timer = new Timer();
    this.gameEnd = false;
    this.endGameScore = 0;
    this.gameScore = 0;
    console.log('game initialized');
};

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
};


GameEngine.prototype.startInput = function () {
    console.log('Starting input');
    
    var that = this;
    
    this.ctx.canvas.addEventListener("keydown", function (e)
	{
//    	if (e.IsRepeat)
//		{
//			// Ignore key repeats...let the timer handle that
//    		return;
//		}
    	
    	switch(e.code)
    	{
    	case "Space":
    		that.space = true;
    		break;
    		
    	case "ShiftLeft":
    		that.shift = true;
    		break;
    		
    	case "ArrowUp":
     		that.up = true;
     		break;
    		
    	case "ArrowLeft":
     		that.left = true;
     		break;
    		
    	case "ArrowDown":
     		that.down = true;
     		break;
    		
    	case "ArrowRight":
     		that.right = true;
     		break;
    		
    	case "KeyG":
    		if(!that.god)that.god = true;
    		else that.god = false;
    		break;
    	}
    	
    	e.preventDefault();
    	
    	
	}, false);
    
    this.ctx.canvas.addEventListener("keyup", function(e)
	{
    	switch(e.code)
    	{
    	case "Space":
    		that.space = false;
    		break;
    		
    	case "ShiftLeft":
    		that.shift = false;
    		break;
    		
    	case "ArrowUp":
     		that.up = false;
     		break;
    		
    	case "ArrowLeft":
     		that.left = false;
     		break;
    		
    	case "ArrowDown":
     		that.down = false;
     		break;
    		
    	case "ArrowRight":
     		that.right = false;
     		break;
    		
    	/*case "KeyG":
    		that.god = false;
    		break;*/
    	}
    	
    	e.preventDefault();
	}, false);
    

    
}

GameEngine.prototype.addEntity = function (entity) {
    //console.log('added entity');
    this.entities.push(entity);
};

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
};

GameEngine.prototype.update = function () {
	var canvas = document.getElementById("hud");
	var ctx = canvas.getContext("2d");
	
	ctx.font = "20px Arial";
    ctx.fillText("Controls", 150, 20);
    ctx.fillText("G: God Mode", 10, 50);
    ctx.fillText("Space: Shoot", 200, 50);
    ctx.fillText("Shift: Slow speed", 100, 200);
    ctx.fillText("Left Arrow: Left", 10, 100);
    ctx.fillText("Up Arrow: Up", 10, 150);
    ctx.fillText("Right Arrow: Right", 200, 100);
    ctx.fillText("Down Arrow: Down", 200, 150);
    
	if(this.space) this.play = true;
	
	if(this.play){
		
		var entitiesCount = this.entities.length;

	    for (var i = 0; i < entitiesCount; i++) {
	        var entity = this.entities[i];

	        if (!entity.removeFromWorld) {
	            entity.update();
	        }
	    }

	    for (var i = this.entities.length - 1; i >= 0; --i) {
	        if (this.entities[i].removeFromWorld) {
	            this.entities.splice(i, 1);
	        }
	    }

	    /*ctx.save();
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    ctx.fillRect(0, 0, canvas.width, canvas.height);
	    var stringScore = "Score: " + this.gameScore;
	    ctx.fillStyle = 'black';
	    ctx.font="20px Arial";
	    var text_score = stringScore;
	    
	    ctx.fillText(stringScore, 0, 50);*/
	    
	    this.endGameScore = this.endGameScore + 1;
	    this.gameScore = this.gameScore + this.endGameScore;
	    //ctx.restore();
	    
	    //console.log(this.endGameScore);
	    
	    if(this.endGameScore > 3000) this.gameEnd = true;
	    
	    if (this.gameEnd){
	    	for (var i = this.entities.length - 1; i >= 0; --i) {
	    		this.entities.splice(i, 1);
	        }
	    	this.clockTick = 0;
	    }

	    //ctx.clearRect(0, 0, canvas.width, canvas.height);
	    //console.log(this.entities.length)
	}
    
};

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
};

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
};

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
};

Entity.prototype.collideRight = function () {
    return this.x + this.radius > 600;
};
Entity.prototype.collideLeft = function () {
    return this.x - this.radius < 0;
};
Entity.prototype.collideBottom = function () {
    return this.y + this.radius > 600;
};
Entity.prototype.collideTop = function () {
    return this.y - this.radius < 0;
};

Entity.prototype.collide = function (other) {
	
    return distance(this, other) < this.radius + other.radius;
};

Entity.prototype.update = function () {
};

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.fillstyle = "green";
        this.animation.frameWidth;
        this.game.ctx.arc(this.x+this.animation.frameWidth, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.fill();
        this.game.ctx.closePath();
    }
};

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
};