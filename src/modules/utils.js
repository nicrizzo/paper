define([], function(){
	return {
		bind: (function(method, context){
			var fn = typeof Function.prototype.bind === "function"
			?
					function(method, context){
						return method.bind(context);
					}
			:
				function(method, context){
					return function(){
						method.apply(context, arguments)
					}
				}
			return fn;
		})()
	}
});