(function(window){
	var class2type = {};
	function type(obj) {
	    return obj == null ? String(obj) : class2type[toString.call(obj)] || "object"
	}
	function isNumber(arg){
		return typeof(arg)==="number"&&window.isFinite(arg)
	}
	function throwError(str){
		throw Error(str)
		return
	}
	// 角度转弧度
	function angleToRadian(num){
		return num*(2*Math.PI/360)
	}
	function getLineCap(str){
		if (str) {
			var Cap = ['butt','round','square'];
			if (Cap.indexOf(str)>-1) {
				return str
			}else{
				return 'butt'
			}
		}else{
			return 'butt'
		}
	}
	function getLineWidth(arg){
		if (arg&&isNumber(arg)) {
			return arg
		}else{
			return 1
		}
	}
	function fillOrStroke(that,option){
		that.ctx.fillStyle = option.fillStyle||that.ctx.fillStyle
		that.ctx.strokeStyle = option.strokeStyle||that.ctx.strokeStyle
		that.ctx.lineWidth = getLineWidth(option.lineWidth);
		that.ctx.rotate(option.rotate*Math.PI/180||0*Math.PI/180);
		that.ctx.closePath();
		if (option.fill === true) {
			that.ctx.fill();
		}else{
			that.ctx.stroke();
		}
		that.ctx.restore();
	}
	// 保存到localStorage
	function pushLocalStorage(item,option){
		var all = getLocalStorage("allShape");
		all.push({"shape":item,"option":option});
		window.localStorage.setItem("allShape",JSON.stringify(all));
	}
	// 删除前一项，在重绘时防止重复保存在localStorage中
	function shiftLocalStorage(){
		var all = getLocalStorage("allShape");
		all.shift();
		window.localStorage.setItem("allShape",JSON.stringify(all));
	}
	// 删除最后一次所画的图
	function popLocalStorage(){
		var all = getLocalStorage("allShape");
		all.pop();
		window.localStorage.setItem("allShape",JSON.stringify(all));
	}
	function getLocalStorage(item){
		return window.localStorage.getItem(item) === ""?[]:JSON.parse(window.localStorage.getItem(item))
	}

	function Canvas(option){
		this.option = option
		this.ctxOption = {
			fillStyle: "#000000",
			strokeStyle: "#000000"
		}
		this.size = {}
	}
	Canvas.prototype.init = function(option){
		var option = this.option||{},
			selector = document.querySelector(option.selector||"body"),
			canvas = document.createElement("canvas");
		// 设置画布size
		this.size.width = selector.clientWidth;
		this.size.height = selector.clientHeight;
		canvas.width = selector.clientWidth;
		canvas.height = selector.clientHeight;
		// 插入dom
		selector.appendChild(canvas);
		this.ele = canvas
		// 判断是否支持canvas
		if (this.ele.getContext) {
			this.ctx = this.ele.getContext("2d")
		}else{
			console.log('You Browser does not support canvas')
			return
		}
		window.localStorage.setItem("allShape","");
		return this
	}
	Canvas.prototype.setCtxOption = function(name,val){
		this.ctxOption.name = val
		return this
	}
	Canvas.prototype.draw = function(shape,option){
		switch(shape){
			case "line":
				this.drawLine(option)
				break
			case "rect":
				this.drawRect(option)
				break
			case "triangle":
				this.drawTriangle(option)
				break
			case "circle":
				this.drawCircle(option)
				break
			case "FPStar":
				this.drawFPStar(option)
				break
			case "lightning":
				this.drawLightning(option);
				break
			case "ellipse":
				this.drawEllipse(option);
				break
			default:
				throwError("Unknow type of shape")
		}
	}
	// 线
	Canvas.prototype.drawLine = function(option){
		pushLocalStorage("line",option);
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.strokeStyle = option.strokeStyle||this.ctx.strokeStyle
		this.ctx.lineCap = getLineCap(option.lineCap);
		this.ctx.lineWidth = getLineWidth(option.lineWidth);
		this.ctx.rotate(option.rotate*Math.PI/180||0*Math.PI/180);
		this.ctx.moveTo(option.start.x, option.start.y);
		this.ctx.lineTo(option.end.x, option.end.y);
		// this.ctx.closePath();
		this.ctx.stroke();
		this.ctx.restore();
		return this
	}
	// 三角形
	Canvas.prototype.drawTriangle = function(option){
		pushLocalStorage("triangle",option);
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.strokeStyle = option.strokeStyle||this.ctx.strokeStyle;
		this.ctx.fillStyle = option.fillStyle||this.ctx.fillStyle;
		this.ctx.lineCap = getLineCap(option.lineCap);
		this.ctx.lineWidth = getLineWidth(option.lineWidth);
		this.ctx.rotate(option.rotate*Math.PI/180||0*Math.PI/180);
		this.ctx.moveTo(option.p1.x, option.p1.y);
		this.ctx.lineTo(option.p2.x, option.p2.y);
		this.ctx.lineTo(option.p3.x, option.p3.y);
		// this.ctx.closePath();
		if (option.fill === true) {
			this.ctx.fill()
		}else{
			this.ctx.lineTo(option.p1.x, option.p1.y)
			this.ctx.stroke();
		}
		this.ctx.restore();
		return this
	}
	// 矩形
	Canvas.prototype.drawRect = function(option){
		pushLocalStorage("rect",option);
		var	width = option.width,
			height = option.height;
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.rotate(option.rotate*Math.PI/180||0*Math.PI/180);
		this.ctx.rect(option.point.x, option.point.y, width,height);
		fillOrStroke(this,option)
		return this
	}
	// 弧
	Canvas.prototype.drawCircle = function(option){
		pushLocalStorage("circle",option);
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.rotate(option.rotate*Math.PI/180||0*Math.PI/180);
		this.ctx.arc(option.center.x, option.center.y, option.r, option.start, option.end);
		fillOrStroke(this,option);
		return this
	}

	// 五角星⭐️
	Canvas.prototype.drawFPStar = function(option){
		pushLocalStorage("FPStar",option);
		var x = option.center.x,
			y = option.center.y,
			width = option.width,
			rotate = option.rotate;
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.strokeStyle = option.strokeStyle||this.ctx.strokeStyle;
		this.ctx.fillStyle = option.fillStyle||this.ctx.fillStyle;
		this.ctx.lineCap = getLineCap(option.lineCap);
		this.ctx.lineWidth = getLineWidth(option.lineWidth);
		var x1 = width * Math.sin(angleToRadian(18)),
			y1 = width * Math.cos(angleToRadian(18)),
			y2 = x1 * Math.tan(angleToRadian(54)),
			cross = y2 / Math.sin(angleToRadian(54));
		for (var i = 0; i < 5; i++) {   
		    this.ctx.lineTo(Math.cos((18+i*72+rotate)/180*Math.PI)*(y1+y2)+x,   
		                    -Math.sin((18+i*72+rotate)/180*Math.PI)*(y1+y2)+y);   
		    this.ctx.lineTo(Math.cos((54+i*72+rotate)/180*Math.PI)*cross+x,   
		                    -Math.sin((54+i*72+rotate)/180*Math.PI)*cross+y);   
		}  
		if (option.empty !== true) {
			for (var i = 0; i < 5; i++) {
				this.ctx.lineTo(Math.cos((54+i*72+rotate)/180*Math.PI)*cross+x,   
		                    -Math.sin((54+i*72+rotate)/180*Math.PI)*cross+y);  
			}
		} 
		// this.ctx.closePath();
		if (option.fill === true) {
			this.ctx.fill();
		}else{
			this.ctx.stroke();
		}
		this.ctx.restore();
		return this
	}
	// 闪电
	Canvas.prototype.drawLightning = function(option){
		pushLocalStorage("lightning",option);
		var x = option.start.x,
			y = option.start.y,
			r = option.r,
			l = option.l,
			h = option.h,
			_a1 = option.angle1,
			_a2 = option.angle2;

		this.ctx.save();
		this.ctx.beginPath();
		if (option.rotate) {
			this.ctx.rotate(option.rotate/180*Math.PI);
		}
		this.ctx.strokeStyle = option.strokeStyle||this.ctx.strokeStyle;
		this.ctx.fillStyle = option.fillStyle||this.ctx.fillStyle;
		this.ctx.lineCap = getLineCap(option.lineCap);
		this.ctx.lineWidth = getLineWidth(option.lineWidth);
		this.ctx.moveTo(x, y);
		this.ctx.lineTo(x+l, y);
		this.ctx.lineTo(x+l-(r*Math.sin(_a1/180*Math.PI)-h)/Math.tan((_a1+_a2)/180*Math.PI), y+r*Math.sin(_a1/180*Math.PI)-h);
		this.ctx.lineTo(x+r*Math.cos(_a1/180*Math.PI)+(l-(r*Math.sin(_a1/180*Math.PI)-h)/Math.tan((_a1+_a2)/180*Math.PI)), y-h);
		this.ctx.lineTo(x+r*Math.cos(_a1/180*Math.PI)-(r*Math.sin(_a1/180*Math.PI)-h)/Math.tan((_a1+_a2)/180*Math.PI), y-h);
		this.ctx.lineTo(x+r*Math.cos(_a1/180*Math.PI),y-r*Math.sin(_a1/180*Math.PI));
		this.ctx.lineTo(x, y);
		
		// this.ctx.closePath();
		if (option.fill === true) {
			this.ctx.fill();
		}else{
			this.ctx.stroke();
		}
		this.ctx.restore();
		return this
	}
	Canvas.prototype.drawEllipse  = function(option){
		pushLocalStorage("ellipse",option);
		var x = option.center.x,
			y = option.center.y,
			a = option.a,
			b = option.b;
		var step = a>b ? 1/a: 1/b;	    
		this.ctx.save()
		;
		this.ctx.beginPath();
		if (option.rotate) {
			this.ctx.translate(x, y);
			x = y = 0;
			this.ctx.rotate(option.rotate/180*Math.PI);
		}
		this.ctx.strokeStyle = option.strokeStyle||this.ctx.strokeStyle;
		this.ctx.fillStyle = option.fillStyle||this.ctx.fillStyle;
		this.ctx.lineCap = getLineCap(option.lineCap);
		this.ctx.lineWidth = getLineWidth(option.lineWidth);
	    for(var i = 0; i < option.angle/180*Math.PI; i += step) {
	        this.ctx.lineTo(x + a * Math.cos(i), y + b * Math.sin(i));
	    }
		// this.ctx.closePath();
		if (option.fill === true) {
			this.ctx.fill();
		}else{
			this.ctx.stroke();
		}
		this.ctx.restore();
		return this
	}
	// 撤销，删除localStorage里面保存的图形，然后进行重绘
	Canvas.prototype.revoke = function(){
		this.ctx.clearRect(0, 0, this.size.width, this.size.height);
		popLocalStorage();
		var allShape = getLocalStorage("allShape");
		for(var i = 0;i < allShape.length; i++){
			this.draw(allShape[i].shape, allShape[i].option);
			shiftLocalStorage();
		}
		return this
	}

	window.Canvas = Canvas;
})(window)