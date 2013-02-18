define([
	"paper/modules/strokeFilters/default",
	"paper/modules/interpolators/linear",
	"paper/modules/interpolators/simplelinear",
	"paper/modules/interpolators/quadratic",
	"paper/modules/utils"
], function(strokeFilter, interpolator, simpleLinearInterpolator, quadraticInterpolator, utils){

	var
			mathMax = Math.max,
			mathMin = Math.min,
			Paper = function(args){
				this.domNode = typeof args.node === "string" ? document.getElementById(args.node) : args.node;
				this.buildDom();
				if(args.plugins){
					this.loadPlugins(args.plugins);
				}
				this.addEventListeners();
				this._undoData = [];
				this._draw = utils.bind(this.draw, this);
				this.draw();
				this.plugins = {};
				this.isDebug = !!args.isDebug;
				this.drawControlPoints = !!args.drawControlPoints;
			};
	Paper.prototype = {
		_buffer: null,
		_undoData: null,
		_drawTimeout: 0,
		_buffercontext: null,
		_touchstartListener: null,
		_touchmoveListener: null,
		_touchendListener: null,
		_drawingTool: "pen",
		plugins: null,
		undoManager: null,
		canvas: null,
		domNode: null,
		context: null,
		height: 0,
		width: 0,
		strokes: {},
		buildDom: function(){
			var cs;
			this.domNode.className = this.domNode.className ? this.domNode.className + " blocknotes" : "blocknotes";
			// main buffer
			this.domNode.appendChild(this.canvas = document.createElement("canvas"));
			this.canvas.className = "paper";

			// pre write buffer
			this.domNode.appendChild(this._buffer = document.createElement("canvas"));
			this._buffer.className = "buffer";

			cs = window.getComputedStyle(this.canvas, null);
			this.canvas.style.height = this._buffer.style.height = (this.height = this.canvas.height = this._buffer.height = parseInt(cs.height)) + "px";
			this.canvas.style.width = this._buffer.style.width = (this.width = this.canvas.width = this._buffer.width = parseInt(cs.width)) + "px";
			this.context = this.canvas.getContext("2d")
//			this.undoManager.pushState(this.context.getImageData(0, 0, this.width, this.height));
			this._buffercontext = this._buffer.getContext("2d");
//			this.context.lineJoin = "round";
			this.strokes = {};

			// todo: parametrize
//			this.context.fillStyle = "black";
//			this.context.lineWidth = 3;
//			this.context.lineCap = "round";
//			this.context.lineJoin = "round";
//			this.context.shadowOffsetX = 0;
//			this.context.shadowOffsetY = 0;
//			this.context.shadowBlur = 2;
			// doesn't work well on chrome / android
//			this.context.shadowColor = "rgba(0,0,0,.5)";
//			this._buffercontext.fillStyle = "red";
		},
		touchStartHandler: function(e){
			var touches = e.changedTouches, strokes = this.strokes, domNode = this.domNode,
					ol = domNode.offsetLeft, ot = domNode.offsetTop
					;
			for(var i = 0, touch; touch = touches[i]; i++){
				(strokes[(touch = touches[i]).identifier] = [{
					x: touch.clientX - ol,
					y: touch.clientY - ot
				}]).index = 0;
			}
		},
		touchMoveHandler: function(e){
			var touches = e.changedTouches, stroke, strokeLength,
					domNode = this.domNode, strokes = this.strokes,
					ol = domNode.offsetLeft, ot = domNode.offsetTop
					;
			for(var i = 0, touch; touch = touches[i]; i++){
				if(!(stroke = strokes[(touch = touches[i]).identifier])){
					continue;
				}
				strokeLength = stroke.length;
				stroke[strokeLength] = {
					x: touch.clientX - ol,
					y: touch.clientY - ot
				};
			}
			e.preventDefault();
		},
		touchEndHandler: function(e){
			var changedTouches = e.changedTouches, touch, domNode = this.domNode, stroke, strokes = this.strokes,
					ol = domNode.offsetLeft, ot = domNode.offsetTop, ctx = this._buffercontext, rect,
					fir = this._findIncludingRect;
			;
			var i = changedTouches.length;
			while(i--){
				if(!(stroke = strokes[(touch = changedTouches[i]).identifier])){
					continue;
				}
				stroke[stroke.length] =
				{
					x: touch.clientX - ol,
					y: touch.clientY - ot,
					last: true
				};
				rect = fir(stroke);

				// saving the current state
				if(this._drawingTool == "pen"){ // == is faster than ===, I suppose
//					this.commit(stroke);
					stroke.index = 0;
					quadraticInterpolator.run(this.context, stroke);

				}else{
					this.erase(this.context, stroke);
				}

			}
			// clear buffer
			clearTimeout(this._drawTimeout);
			ctx.clearRect(0, 0, this._buffer.width, this._buffer.height);
			this._drawTimeout = setTimeout(this._draw, 20);
		},
		addEventListeners: function(){
			this._touchstartListener = this._buffer.addEventListener("touchstart", utils.bind(this.touchStartHandler, this), false);
			this._touchmoveListener = this._buffer.addEventListener("touchmove", utils.bind(this.touchMoveHandler, this), false);
			this._touchendListener = this._buffer.addEventListener("touchend", utils.bind(this.touchEndHandler, this), false);
		},
		_findIncludingRect: function(stroke){
			var x = stroke[0].x, y = stroke[0].y, x1 = 0, y1 = 0, w, h, i = 0, l = stroke.length, point;
			for(; i < l; i++){
				x = mathMin(x, (point = stroke[i]).x);
				y = mathMin(y, point.y);
				x1 = mathMax(x1, point.x);
				y1 = mathMax(y1, point.y);
			}
			w = x1 - x;
			h = y1 - y;
			return {
				x: x,
				y: y,
				w: w,
				h: h
			};
		},
		erase: function(context, stroke){
			stroke.index = 0;
			var rect = this._findIncludingRect(stroke);
			if(!rect.h || !rect.w){
				return
			}
			this._buffercontext.lineWidth = 30;
			interpolator.run(this._buffercontext, {
				0: stroke
			});
			this._buffercontext.lineWidth = 1;
			var destData = this.context.getImageData(rect.x, rect.y, rect.w, rect.h),
					eraseData = this._buffercontext.getImageData(rect.x, rect.y, rect.w, rect.h)
					;

			for(var i = 0, l = destData.data.length; i < l; i+=4){
				if(eraseData.data[i+3]){ // alpha channel
					destData.data[i] = destData.data[i + 1] = destData.data[i + 2] = destData.data[i + 3] = 0;
				}
			}
			this.context.putImageData(destData, rect.x, rect.y);
		},
		loadPlugins: function(plugins){
			// todo: 'blocknotes' should be 'paper', change it
			var that = this;
			require(plugins.map(function(elem){ return "paper/plugins/" + elem.id }), function(){
				for(var i = 0, arg, plugin; arg = arguments[i], plugin = plugins[i]; i++){
					that.plugins[plugin.id] = new arg(plugin.cfg || {}, that);
				}
			});
		},
		setDrawingTool: function(/** Object */ args){
			this._drawingTool = args.type;
		},
		_draw: function(){

		},
		draw: function(){
			interpolator.run(this._buffercontext, strokeFilter.run(this.strokes));
			this._drawTimeout = setTimeout(this._draw, 20);
		}
	};
	return Paper;
});