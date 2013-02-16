define(function(){
	return {
		run: function(context, stroke){
			var point, nextPoint, x, y, nx, ny;
			if(stroke.length == 2 && stroke[1].last){
				context.fillRect(stroke[0].x, stroke[0].y, 1, 1);
				return;
			}
			context.moveTo(stroke[0].x, stroke[0].y);
			context.beginPath();
			for(var ii = 0, ll = stroke.length-2; ii < ll; ii++){
				context.quadraticCurveTo(x = (point = stroke[ii]).x, y = point.y, (x + (nx = (nextPoint = stroke[ii + 1]).x)) >> 1, (y + (ny = nextPoint.y)) >> 1);
			}
			context.quadraticCurveTo(x, y, nx, ny);
			context.stroke();
		}
	};
});