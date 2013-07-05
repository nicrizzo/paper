define(function(){
	var worker,
	ctx,
	_onMessage = function(oEvent){
		console.log("message returned = " + oEvent);
		var res = oEvent.data;
		console.log(res)
		ctx.beginPath();
		ctx.moveTo(res[0], res[1]);
		for(var i = 0, l = res.length; i < l; i+=4){
			ctx.quadraticCurveTo(res[i+0], res[i+1], res[i+2], res[i+3]);
		}
//		for(var ii = 0, ll = stroke.length-2; ii < ll; ii++){
//			ctx.quadraticCurveTo(x = (point = stroke[ii]).x, y = point.y, (x + (nx = (nextPoint = stroke[ii + 1]).x)) >> 1, (y + (ny = nextPoint.y)) >> 1);
//		}
//		ctx.quadraticCurveTo(x, y, nx, ny);
		ctx.stroke();
	};
	return {
		setContext: function(context){
			ctx = context;
		},
		run: (function(){
			if("Worker" in window){
				worker = new Worker("../../src/modules/interpolators/_quadratic_worker.js");
				worker.addEventListener("message", _onMessage);
				return function(stroke){
					if(stroke.length == 2 && stroke[1].last){
						ctx.fillRect(stroke[0].x, stroke[0].y, 1, 1);
						return;
					}
					worker.postMessage(stroke);
				}
			}else{
				return function(stroke){
					var point, nextPoint, x, y, nx, ny;
					if(stroke.length == 2 && stroke[1].last){
						ctx.fillRect(stroke[0].x, stroke[0].y, 1, 1);
						return;
					}
					ctx.beginPath();
					ctx.moveTo(stroke[0].x, stroke[0].y);
					for(var ii = 0, ll = stroke.length-2; ii < ll; ii++){
						ctx.quadraticCurveTo(x = (point = stroke[ii]).x, y = point.y, (x + (nx = (nextPoint = stroke[ii + 1]).x)) >> 1, (y + (ny = nextPoint.y)) >> 1);
					}
					ctx.quadraticCurveTo(x, y, nx, ny);
					ctx.stroke();
				}
			}
		}
		)()
	};
});