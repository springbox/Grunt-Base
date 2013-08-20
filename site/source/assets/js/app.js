var jQuery = '?';

(function($) {
	var SuperObviousVariableExample = function(event) {
		event.preventDefault();
	};
	$('.foo').click(SuperObviousVariableExample());
})(jQuery);