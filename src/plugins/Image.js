define([
	"../modules/utils",
	"../gesture"
],function(utils){
	var transformString = (function(){
		return "WebkitTransform"
	})(),
	startRotation = 0,
	startX = 0,
	startY = 0,
	dx = 0,
	dy = 0,
	degToRad = Math.PI/180,
	startScale = 1,
	_touchStartHandler = function(e){
		e.preventDefault();
	},
	ImagePlugin = function(args, paper){
		this.paper = paper;
		var img = this.img;
		img.addEventListener("gesturestart", utils.bind(this.onGestureStart, this), false);
		img.addEventListener("gesturechange", utils.bind(this.onGestureChange, this), false);
		img.addEventListener("gestureend", utils.bind(this.onGestureEnd, this), false);
		img.addEventListener("touchstart", utils.bind(this.onTouchStart, this), false);
		img.addEventListener("touchmove", utils.bind(this.onTouchMove, this), false);
		img.addEventListener("touchend", utils.bind(this.onTouchEnd, this), false);
	};
	ImagePlugin.prototype = {
		underlay: null,
		img: (function(){
			return document.createElement("img")
		})(),
		cover: (function(){
			var cover = document.createElement("div");
			cover.style.position = "absolute";
			cover.style.top = "0";
			cover.style.left = "0";
			cover.style.width = "100%";
			cover.style.height = "100%";
			cover.addEventListener("touchstart", _touchStartHandler);
			return cover;
		})(),
		start: function(imageData){
			var img = this.img, cover = this.cover;
			cover.style.background = "transparent";
			img.src = imageData;
			img.style.position = "absolute";
			img.style.top = "0";
			img.style.left = "0";
			img.style.width = "200px";
			img.style.display = "block";
			this.paper.domNode.appendChild(cover);
			this.paper.domNode.appendChild(img);
			this.paper.emit("image:ready", img);
			startRotation = 0;
			startScale = 1;
			img.addEventListener("touchstart", function(e){
				e.preventDefault();
			})
		},
		removeCover: function(){
			this.cover.parentNode.removeChild(this.cover);
		},
		removeImage: function(){
			this.img.parentNode.removeChild(this.img);
		},
		cancel: function(){
			this.removeCover();
		},
		saveImage: function(){
			var ctx = this.paper.context,
				img = this.img,
				left = parseInt(img.style.left),
				top = parseInt(img.style.top),
				width = parseInt(img.width),
				height = parseInt(img.height)

			;
			this.removeCover();
			this.removeImage();
			ctx.save();
			ctx.translate(left+width/2, top+height/2);
			ctx.scale((200/this.img.width)*startScale, (200/this.img.width)*startScale);
			ctx.rotate(startRotation*degToRad);
			ctx.drawImage(this.img, -this.img.width/2, -this.img.height/2);
			ctx.restore();
			img.style[transformString] = "";
			startX = startY = startRotation = 0;
			startScale = 1;
		},
		onTouchMove: function(e){
			if(e.touches.length === 1){
				var touch = e.changedTouches[0];
				e.target.style.left = touch.clientX - dx + "px";
				e.target.style.top = touch.clientY - dy + "px";
			}
		},
		onTouchStart: function(e){
			if(e.touches.length === 1){
				var ol = e.target.offsetLeft, ot = e.target.offsetTop, touch = e.changedTouches[0];
				dx = touch.clientX - ol;
				dy = touch.clientY - ot;
			}
		},
		onTouchEnd: function(e){
			if(!e.touches.length){
				var ol = e.target.offsetLeft, ot = e.target.offsetTop, touch = e.changedTouches[0];
				startX = touch.clientX - ol;
				startY = touch.clientY - ot;
			}
		},
		onGestureStart: function(e){
		},
		onGestureChange: function(e){
			e.target.style[transformString] = 'scale(' + (e.scale*startScale)  + ') rotate(' + (e.rotation + startRotation) + 'deg)';
			e.preventDefault();
		},
		onGestureEnd: function(e){
			e.preventDefault();
			startRotation = e.rotation + startRotation;
			startScale = e.scale * startScale;
			e.preventDefault();
		}
	};
	return ImagePlugin;
});