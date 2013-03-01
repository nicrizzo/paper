define(function(){
	var _targets = [],
			_data = [],
			documentElement = document.documentElement,
			mathAtan2 = Math.atan2,
			mathSqrt = Math.sqrt,
			radToDeg = 180/Math.PI,
			g = {
				gesturestart: function(e){
					var newEvt, target = e.target, touches = e.touches, dX, dY;
					if(touches.length > 1){
						dX = touches[0].clientX - touches[1].clientX;
						dY = touches[0].clientY - touches[1].clientY;
						(newEvt = document.createEvent("Event")).scale = 1;
						newEvt.rotation = radToDeg*(mathAtan2(dY, dX));
						_targets[_targets.length] = target;
						_data[_data.length] = {
							rotation: newEvt.rotation,
							delta: mathSqrt(dX*dX+dY*dY)
						};
						newEvt.initEvent("gesturestart", true, true);
						target.dispatchEvent(newEvt);
					}
				},
				gesturechange: function(e){
					var touches = e.touches, newEvt, target = e.target, idx = _targets.indexOf(target), dX, dY;
					if(~idx && touches.length > 1){
						dX = touches[0].clientX - touches[1].clientX;
						dY = touches[0].clientY - touches[1].clientY;
						_data[idx].lastScale = (newEvt = document.createEvent("Event")).scale = mathSqrt(dX*dX+dY*dY) / _data[idx].delta;
						_data[idx].lastRotation = newEvt.rotation = radToDeg*(mathAtan2(dY, dX)) - _data[idx].rotation;
						newEvt.initEvent("gesturechange", true, true);
						target.dispatchEvent(newEvt);
					}
				},
				gestureend: function(e){
					var idx = _targets.indexOf(e.target), newEvt, target = e.target, touches = e.touches;
					if(~idx && touches.length < 2){
						(newEvt = document.createEvent("Event")).scale = _data[idx].lastScale;
						newEvt.rotation = _data[idx].lastRotation;
						_targets.splice(idx, 1);
						_data.splice(idx, 1);
						newEvt.initEvent("gestureend", true, true);
						target.dispatchEvent(newEvt);
					}
				}
			};
	!("ongesturestart" in documentElement) && document.addEventListener("touchstart", g.gesturestart, false);
	!("ongesturechange" in documentElement) && document.addEventListener("touchmove", g.gesturechange, false);
	!("ongestureend" in documentElement) && document.addEventListener("touchend", g.gestureend, false);
});
