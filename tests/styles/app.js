require([
	"../../src/Paper.js",
	"../../src/modules/utils"
], function(Paper, utils){
	var app = {
		paper: null,
		toolbar: null,
		penbutton: null,
		eraserbutton: null,
		colorselect: null,
		strokeselect: null,
		opacityselect: null,
		init: function(){
			this.toolbar = document.getElementById("toolbar");
			this.penbutton = document.getElementById("penbutton");
			this.eraserbutton = document.getElementById("eraserbutton");
			this.colorselect = document.getElementById("colors");
			this.strokeselect = document.getElementById("strokes");
			this.opacityselect = document.getElementById("opacity");
			this.paper = new Paper({
				node: "paper"
			});
			this.addEventListeners();
			this.paper.setStrokeAttributes({
				strokeStyle: this.colorselect.value.replace(/\${opacity}/, this.opacityselect.value),
				lineWidth: this.strokeselect.value
			})
		},
		addEventListeners: function(){
			var colorsCallback = function(e){
				this.paper.setStrokeAttributes({
					strokeStyle: this.colorselect.value.replace(/\${opacity}/, this.opacityselect.value)
				})
			};
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
			}, this))
			this.colorselect.addEventListener("change", utils.bind(colorsCallback, this));

			this.strokeselect.addEventListener("change", utils.bind(function(e){
				this.paper.setStrokeAttributes({
					lineWidth: e.target.value
				})
			}, this));
			this.opacityselect.addEventListener("change", utils.bind(colorsCallback, this))
		}
	}
	app.init();
})