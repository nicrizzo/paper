define(function(){
	return {
		run: function(strokes){
			var stroke, minY, id = 0, minStroke, oldId;
			for(var i in strokes){
				stroke = strokes[i];
				if(stroke.length){
					if((typeof minY === "undefined" || stroke[0][1] <= minY) && !stroke[stroke.length-1][2]){
						minY = stroke[0][1];
						minStroke = stroke;
						id = i;
						if(oldId){
							delete strokes[oldId];
						}
					}else{
						delete strokes[i];
					}
					oldId = i;
				}
			}
			return strokes;
		}
	};
});