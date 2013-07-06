onmessage = function(oEvent){
	var point, nextPoint, x, y, nx, ny, res = [];
	for(var ii = 0, ll = oEvent.data.length-2; ii < ll; ii++){
		res[res.length] = (x = (point = oEvent.data[ii]).x);
		res[res.length] = (y = point.y);
		res[res.length] = ((x + (nx = (nextPoint = oEvent.data[ii + 1]).x)) >> 1);
		res[res.length] = ((y + (ny = nextPoint.y)) >> 1);
//		context.quadraticCurveTo(x = (point = stroke[ii]).x, y = point.y, (x + (nx = (nextPoint = stroke[ii + 1]).x)) >> 1, (y + (ny = nextPoint.y)) >> 1);
	}
	postMessage(res);
}