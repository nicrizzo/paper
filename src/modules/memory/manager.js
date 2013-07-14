define(function(){
	var
		MAX = 500,
		allocatedObjects = 0,
		objects = []
	;
	for(var i = 0, l = MAX; i < l; i++){
		objects[i] = [];
	}

	return {
		alloc: function(){
			if(allocatedObjects < MAX){
				allocatedObjects++;
				return objects.pop();
			}else{
				allocatedObjects = ++MAX;
				return [];
			}

		},
		dealloc: function(o){
			objects.push(o);
			allocatedObjects--; // use objects.length?
		}
	}
})