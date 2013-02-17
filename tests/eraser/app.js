require([
	"../../src/Paper.js",
	"../../src/modules/utils"
], function(Paper, utils){
	var app = {
		paper: null,
		toolbar: null,
		penbutton: null,
		eraserbutton: null,
		init: function(){
			this.toolbar = document.getElementById("toolbar");
			this.penbutton = document.getElementById("penbutton");
			this.eraserbutton = document.getElementById("eraserbutton");
			this.addEventListeners();
			this.paper = new Paper({
				node: "paper"
			});
		},
		addEventListeners: function(){
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
			}, this))
			this.eraserbutton.addEventListener("touchstart", utils.bind(function(e){
				var btns = document.querySelectorAll(".toolbar>button");
				for(var i = 0; btns[i]; i++){
					btns[i].className = "";
				}
				e.target.className = "selected";
				this.paper.setDrawingTool({
					type: "eraser"
				})
			}, this))
		}
	}
	app.init();
})