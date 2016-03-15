(function($) {
	$(function() {

		var BASE_SIZE = 10;
		var GRID_VISIBLE = false;

		// create debugging grid
		function createGrid() {
			var w = $(window).width();
			var h = $(window).height();
	
			var html = '<div id="blueprint-debug-grid">';
			for(var r = 0; r < parseInt(h / BASE_SIZE); r++) {
				html += '<div class="row blueprint-debug-grid-row"';
				html += ' style="top: ' + r + 'em;"></div>';
			}
			for(var c = 0; c < parseInt(w / BASE_SIZE); c++) {
				html += '<div class="col blueprint-debug-grid-col"';
				html += ' style="left: ' + c + 'em;"></div>';
			}
			html += '</div>';
			$('body').prepend(html);
		}

		// set initially
		if(GRID_VISIBLE)
			createGrid();	

		// update grid during window resize
		$(window).resize(function() {
			if(GRID_VISIBLE) {
				var w = $(window).width();
				var h = $(window).height();
		
				//console.log(w, h);
				
				$('#blueprint-debug-grid').remove();
				createGrid();
			}
		});

		// dev mode
		$(window).keypress(function(e) {
			
			if(e.ctrlKey && e.keyCode == 100) {
				console.log('ctrl pressed');
				$('#blueprint-debug-grid').toggle();
			}
		})
	});
})(jQuery);