(function(window){
	var direction = ['up','right','down','left'];
	function getRandom(min,max,num){
	    var diff = (max - min>0)?max - min : Math.abs(max-min);
	    return parseFloat((min + diff*Math.random()).toFixed(num));   
	}
	var Snake = {
		canvas: document.getElementsByTagName('canvas')[0],
		canvasGriad: document.getElementsByTagName('canvas')[1],
		ctx: null,
		ctxGriad: null,
		body: [],
		defaultLength: 5,
		food:{},
		score: 0,
		option: {
			width: 30,
			headColor: "red",
			bodyColor: "green",
			griadColor: "#ccc",
			foodColor: "yellow"
		},
		speed: 2,
		drawTimer: null,
		isRuning: false,
		direction: direction[getRandom(0,3,0)],
		init: function(selector){
			var s = document.querySelector(selector)||document.body
			if (!this.canvas) {
				this.canvas = document.createElement("canvas");
				this.canvas.width = 600;
				this.canvas.height = 600;
				this.canvas.style.display = "block";
				this.canvas.style.border = "1px solid "+this.option.griadColor;
				s.appendChild(this.canvas);
			}
			if (!this.canvasGriad) {
				this.canvasGriad = document.createElement("canvas");
				this.canvasGriad.width = 600;
				this.canvasGriad.height = 600;
				this.canvasGriad.style.display = "block";
				s.appendChild(this.canvasGriad);
			}
			// 贪吃蛇canvas
			this.canvas.style.position = "absolute";
			this.canvas.style.top = "30px";
			// this.canvas.style.top = "50%";
			this.canvas.style.left = "50%";
			this.canvas.style.marginLeft = -this.canvas.width/2+"px";
			// this.canvas.style.marginTop = -this.canvas.height/2+"px";
			// this.canvas.style.margin = "20px auto";
			this.ctx = this.canvas.getContext('2d');

			// 网格canvas
			this.canvasGriad.style.position = "absolute";
			this.canvasGriad.style.top = "30px";
			// this.canvasGriad.style.top = "50%";
			this.canvasGriad.style.left = "50%";
			this.canvasGriad.style.marginLeft = -this.canvasGriad.width/2+"px";
			// this.canvasGriad.style.marginTop = -this.canvasGriad.height/2+"px";
			// this.canvas.style.margin = "20px auto";
			this.ctxGriad = this.canvasGriad.getContext('2d');

			var cw = this.canvas.width;
			var ch = this.canvas.height;
			var sw = this.option.width;
			// 画纵线
			for (var i = 0; i < cw/sw; i++) {
				this.ctxGriad.strokeStyle = this.option.griadColor;
				this.ctxGriad.beginPath();
				this.ctxGriad.lineTo(i*sw,0);
				this.ctxGriad.lineTo(i*sw,ch);
				this.ctxGriad.stroke();
			}
			// 画横线
			for (var j = 0; j < ch/sw; j++) {
				this.ctxGriad.strokeStyle = this.option.griadColor;
				this.ctxGriad.beginPath();
				this.ctxGriad.lineTo(0,j*sw);
				this.ctxGriad.lineTo(ch,j*sw);
				this.ctxGriad.stroke();				
			}
		},
		clearSnakeRect: function(){
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		},
		randomFood: function(){
			var cw = this.canvas.width||this.canvasGriad.width||600,  //600 //
				ch = this.canvas.height||this.canvasGriad.width||600,
				sw = this.option.width,
				fx = this.food.x,
				fy = this.food.y;
			if (fx) {
				this.ctx.clearRect(fx, fy, sw, sw);
			}
			var randomX = getRandom(0, cw/sw-1, 0);
			var randomY = getRandom(0, ch/sw-1, 0);
			for(var item of this.body){
				if (randomX*sw===item.x && randomY*sw===item.y) {
					// arguments.callee();   //ES5已经弃用
					this.randomFood();
					return
				}
			}
			this.food.x = randomX*sw;
			this.food.y = randomY*sw;
			this.ctx.fillStyle = this.option.foodColor;
			this.ctx.beginPath();
			this.ctx.fillRect(randomX*sw, randomY*sw, sw, sw);
		},
		drawSnake: function(){
			// console.log(this.body)
			for (var i = 0; i < this.body.length; i++) {
				var sw = this.option.width,
					hc = this.option.headColor,
					bc = this.option.bodyColor;
				this.ctx.fillStyle = i === 0? hc : bc;
				this.ctx.beginPath();
				this.ctx.fillRect(this.body[i].x, this.body[i].y, sw, sw);
			}
		},
		// 生成蛇，位置处于中间，预防撞墙
		reStart: function(){
			clearTimeout(this.drawTimer);
			this.speed = 2;
			this.direction = direction[getRandom(0,3,0)];
			this.body = [];
			this.score = 0;
			var cw = this.canvas.width,
				ch = this.canvas.height,
				sw = this.option.width;
			this.clearSnakeRect();
			var randomX = 0;
			var randomY = 0;
			switch(this.direction){
				case "up":
					randomX = getRandom(0,cw/sw,0);
					randomY = getRandom(5,ch/sw-this.defaultLength,0);
					// console.log(randomX+' / '+ randomY);
					for(var i = 0; i < this.defaultLength; i++){
						var x = randomX*sw;
						var y = (randomY+i)*sw;
						this.body.push({
							x: x,
							y: y
						})
					}
					break
				case 'left':
					randomX = getRandom(5,cw/sw-this.defaultLength,0);
					randomY = getRandom(0,ch/sw,0);
					// console.log(randomX+' / '+ randomY);
					for(var i = 0; i < this.defaultLength; i++){
						var x = (randomX+i)*sw;
						var y = randomY*sw;
						this.body.push({
							x: x,
							y: y
						})
					}
					break
				case 'down':
					randomX = getRandom(0,cw/sw,0);
					randomY = getRandom(this.defaultLength,ch/sw-9,0);
					// console.log(randomX+' / '+ randomY);
					for(var i = this.defaultLength-1; i >=0 ; i--){
						var x = randomX*sw;
						var y = (randomY+i)*sw;
						this.body.push({
							x: x,
							y: y
						})
					}
					break
				case 'right':
					randomX = getRandom(this.defaultLength,cw/sw-9,0);
					randomY = getRandom(0,ch/sw,0);
					// console.log(randomX+' / '+ randomY);
					for(var i = this.defaultLength-1; i >=0 ; i--){
						var x = (randomX+i)*sw;
						var y = randomY*sw;
						this.body.push({
							x: x,
							y: y
						})
					}
					break
				default: 
					throw Error("方向错误");
					return 
			}
			this.drawSnake();
			this.randomFood();
			this.move();
		},
		checkOver: function(p,arr){
			var cw = this.canvas.width,
				ch = this.canvas.height,
				sw = this.option.width;
			// 判断撞墙
			if(p.x<0||p.x>=cw||p.y<0||p.y>=ch){
				return true					
			}
			// 判断咬到自身
			for(var item of arr){
				if (p.x===item.x&&p.y===item.y) {
					return true
				}
			}
			return false
		},
		move: function(){
			var newP = {},
				x = this.body[0].x,
				y = this.body[0].y,
				length = this.body.length;
			var cw = this.canvas.width,
				ch = this.canvas.height,
				sw = this.option.width;
			var that = this;
			switch(this.direction){
				case "up":
					newP.x = x;
					newP.y = y-sw;
					break
				case 'left':
					newP.x = x-sw;
					newP.y = y;
					break
				case 'down':
					newP.x = x;
					newP.y = y+sw;
					break
				case 'right':
					newP.x = x+sw;
					newP.y = y;
					break
				default: 
					throw Error("方向错误");
					return 
			}
			if (this.checkOver(newP,this.body)) {
				alert("游戏结束");
				clearTimeout(this.drawTimer);
				return
			}
			for (var item of this.body) {
				this.ctx.clearRect(item.x, item.y, sw, sw);
			}					
			this.body.splice(0,0,newP);
			// console.log(newP);
			var yb = this.body.pop();
			if (newP.x===this.food.x && newP.y===this.food.y) {
				this.body.push(yb);
				this.randomFood.call(that);
				this.score+=5;
				this.changeSpeed(this.score);
				this.showScore();
			}
			this.drawSnake();
			this.drawTimer = setTimeout(function(){
				// arguments.callee();   //this指向变了	
				that.move();
			},1000/that.speed)
		},
		turn: function(direction){
			if (direction === this.direction||this.reverseDirection(direction) === this.direction) {
				return
			}
			this.direction = direction;
		},
		changeSpeed: function(score){
			if (score%20===0&&this.speed<6) {
				this.speed = this.speed+1
			}
			// console.log(this.speed)
		},
		showScore: function(){
			document.getElementById("score").innerText = this.score;
		},
		reverseDirection: function(str){
			return str === "up" ? "down" : (str === "down" ? "up" : (str === "left" ? "right" : (str === "right"  ? "left" : false)))
		}
	}
	var first_time = 0,
		next_time = 0;
	document.onkeydown = function(event){
		var e = event || window.event || arguments.callee.caller.arguments[0];
		var next_time = e.timeStamp;
		console.log(e);
		var time_diff = next_time - first_time;
		if (time_diff < 200) {
			return
		}
		var code = e.keyCode;
		first_time = next_time;
		switch(code){
			case 38:
				Snake.turn("up");
				break
			case 40:
				Snake.turn("down");
				break
			case 37:
				Snake.turn("left");
				break
			case 39:
				Snake.turn("right");
				break
			default:
				break
		}
	}
	window.Snake = Snake;
})(window)