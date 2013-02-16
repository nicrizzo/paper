define(function(){
	return {
		run: function(context, stroke){
			var point;
			if(stroke.length == 2 && stroke[1].last){
				context.fillRect(stroke[0].x, stroke[0].y, 1, 1);
				return;
			}
			context.moveTo(stroke[0].x, stroke[0].y);
			context.beginPath();
			for(var ii = 0, ll = stroke.length; ii < ll; ii++){
				context.lineTo((point = stroke[ii]).x, point.y);
			}
			context.stroke();
		}
	};
});