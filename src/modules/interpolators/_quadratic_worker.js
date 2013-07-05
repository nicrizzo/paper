onmessage = function(oEvent){
	var stroke = oEvent.data, point, nextPoint, x, y, nx, ny, res = [];
	for(var ii = 0, ll = stroke.length-2; ii < ll; ii++){
		res[res.length] = (x = (point = stroke[ii]).x);
		res[res.length] = (y = point.y);
		res[res.length] = ((x + (nx = (nextPoint = stroke[ii + 1]).x)) >> 1);
		res[res.length] = ((y + (ny = nextPoint.y)) >> 1);
//		context.quadraticCurveTo(x = (point = stroke[ii]).x, y = point.y, (x + (nx = (nextPoint = stroke[ii + 1]).x)) >> 1, (y + (ny = nextPoint.y)) >> 1);
	}
	postMessage(res);
}