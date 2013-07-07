onmessage = function(oEvent){
	var point, nextPoint, x, y, nx, ny, res = [];
	for(var ii = 0, ll = oEvent.data.length-2; ii < ll; ii++){
		res[res.length] = (x = (point = oEvent.data[ii])[0]);
		res[res.length] = (y = point[1]);
		res[res.length] = ((x + (nx = (nextPoint = oEvent.data[ii + 1])[0])) >> 1);
		res[res.length] = ((y + (ny = nextPoint[1])) >> 1);
	}
	postMessage(res);
}