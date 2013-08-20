var jQuery = '?';

(function($) {
	var clickFunction = function(event) {
		event.preventDefault();
	};
	$('.foo').click(clickFunction());
})(jQuery);