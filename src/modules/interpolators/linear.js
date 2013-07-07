define(function(){
	var context;
	return {
		setContext: function(ctx){
			context = ctx;
		},
		run: function(strokes){
			var stroke, point;
//			var rnd = (5*Math.random())|0;
//			context.strokeStyle = ["red", "black", "green", "blue", "magenta"][rnd];

			context.beginPath();
			for(var i in strokes){
				if((stroke = strokes[i]).length == 2 && stroke[1][2]){
					context.fillRect(stroke[0][0], stroke[0][1], 1, 1);
					continue;
				}
//				context.moveTo(stroke.index);
				for(var ii = stroke.index, ll = stroke.length; ii < ll; ii++){
					if(point = stroke[ii]){
						context.lineTo(point[0], point[1]);
					}
				}
//				if(point && point.last){
//					stroke.length = 0;
//					delete strokes[i];
//				}
				stroke.index = ll - 1;
			}
			context.stroke();
		}
	};
});