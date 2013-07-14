define(function(){
	var worker,
	ctx;
	return {
		setContext: function(context){
			ctx = context;
		},
		run: function(stroke){
				var point, nextPoint, x, y;
				if(stroke.length == 2 && stroke[1][2]){
					ctx.fillRect(stroke[0][0], stroke[0][1], 1, 1);
					return;
				}
				ctx.beginPath();
				ctx.moveTo(stroke[0][0], stroke[0][1]);
				for(var ii = 0, ll = stroke.length-4; ii < ll; ii+=3){
					if(ii < ll-5){
						stroke[ii+3][0] = (stroke[ii+3][0] + stroke[ii+4][0]) >> 1;
						stroke[ii+3][1] = (stroke[ii+3][1] + stroke[ii+4][1]) >> 1
					}
					ctx.bezierCurveTo(x = (point = stroke[ii+1])[0], y = point[1], (nextPoint = stroke[ii + 2])[0], nextPoint[1],
					stroke[ii+3][0], stroke[ii+3][1]);
				}
				switch(ll % 3){
					case 1:
						ctx.lineTo(stroke[stroke.length-1][0], stroke[stroke.length-1][1])
						break;
					case 2:
					ctx.quadraticCurveTo(stroke[stroke.length-2][0], stroke[stroke.length-2][1], stroke[stroke.length-1][0], stroke[stroke.length-1][1]);
						break;
					default:
						ctx.bezierCurveTo(stroke[stroke.length-3][0], stroke[stroke.length-3][1],
								stroke[stroke.length-2][0], stroke[stroke.length-2][1],
								stroke[stroke.length-1][0], stroke[stroke.length-1][1]
						);
						break;
				}
				ctx.stroke();
			}
		}
});