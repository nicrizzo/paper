require([
	"../../src/Paper.js",
	"../../src/modules/utils"
], function(Paper, utils){
	var app = {
		paper: null,
		toolbar: null,
		penbutton: null,
		eraserbutton: null,
		imagebutton: null,
		cancelbutton: null,
		savebutton: null,
		_reader: null,
		init: function(){
			this.toolbar = document.getElementById("toolbar");
			this.penbutton = document.getElementById("penbutton");
			this.eraserbutton = document.getElementById("eraserbutton");
			this.imagebutton = document.getElementById("imagebutton");
			this.savebutton = document.getElementById("saveBtn");
			this.cancelbutton = document.getElementById("cancelBtn");
			if(typeof FileReader !== "undefined"){
				this._reader = new FileReader();
			}
			this.paper = new Paper({
				node: "paper",
				plugins: [
					{
						id: "Image"
					}
				]
			});
			this.addEventListeners();
			this.paper.setStrokeAttributes({
				lineWidth:.8
			})
		},
		_onFileChange: function(e){
			var files = e.target.files;
			for(var i = 0, f; f = files[i]; i++){
				this._reader.readAsDataURL(f);
			}
		},
		_onFileLoad: function(e){
			var paper = this.paper;
			if(!paper.plugins || !paper.plugins["Image"]){
				console.warn("Missing plugin: Image");
				return;
			}
			paper.plugins["Image"].start(e.target.result);
		},
		showImageButtons: function(){
			var btns = document.querySelectorAll(".toolbar>button,.separator");
			for(var i = 0; btns[i]; i++){
				btns[i].style.display = "none";
			}
			btns = document.querySelectorAll(".toolbar>.imgbutton");
			for(i = 0; btns[i]; i++){
				btns[i].style.display = "inline";
			}
		},
		hideImageButtons: function(){
			var btns = document.querySelectorAll(".toolbar>button,.separator");
			for(i = 0; btns[i]; i++){
				btns[i].style.display = "inline";
			}
			btns = document.querySelectorAll(".toolbar>.imgbutton");
			for(var i = 0; btns[i]; i++){
				btns[i].style.display = "none";
			}
		},
		onImageReady: function(img){
			this.showImageButtons();
		},
		addEventListeners: function(){
			this.paper.addListener("image:ready", utils.bind(this.onImageReady, this));
			if(this._reader){
				this._reader.onload = utils.bind(this._onFileLoad, this);
			}
//			this._reader && this._reader.addEventListener("load", utils.bind(this._onFileLoad, this), false);
			this.imagebutton.addEventListener("change", utils.bind(this._onFileChange, this), false);
//			this.imagebutton.onchange = utils.bind(this._onFileChange, this);
			this.toolbar.addEventListener("touchmove", function(e){
				e.preventDefault();
			}, false);
			this.penbutton.addEventListener("touchstart", utils.bind(function(e){
				var btns = document.querySelectorAll(".toolbar>button");
				for(var i = 0; btns[i]; i++){
					btns[i].className = "";
				}
				e.target.className = "selected";
				this.paper.setDrawingTool({
					type: "pen"
				})
			}, this));
			this.eraserbutton.addEventListener("touchstart", utils.bind(function(e){
				var btns = document.querySelectorAll(".toolbar>button");
				for(var i = 0; btns[i]; i++){
					btns[i].className = "";
				}
				e.target.className = "selected";
				this.paper.setDrawingTool({
					type: "eraser"
				})
			}, this));
			this.savebutton.addEventListener("touchstart", utils.bind(function(e){
				this.hideImageButtons();
				this.paper.plugins["Image"].saveImage();
			}, this))
		}
	}
	app.init();
})