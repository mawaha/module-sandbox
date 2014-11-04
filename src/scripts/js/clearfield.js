(function($){
	CC.registerModule("clearfield", function(options){

		var methods, settings, onBlur, onFocus;

		options = options || [];

		settings = CC.extend({
			target: '[data-clearfield]'
		}, options);

		onFocus = function() {
			if (this.defaultValue === this.value) {
				this.value = '';
			}
		};
		onBlur = function() {
			if (!this.value.length) {
				this.value = this.defaultValue;
			}
		};
		var stuff = $(settings.target).focus(onFocus).blur(onBlur);

		return {
			clearAll: function(){
				$(settings.target).each(function(){
					this.value = '';
				});
			}
		};
	});
})(jQuery);