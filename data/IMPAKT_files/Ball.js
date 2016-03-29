Impakt.Playbook.Editor.Ball = function(canvas, options) {
	
	var self;
	var options = options || {};

	// ball should be slightly above LOS to allow room for players
	var BALL_Y_OFFSET = 5;
	var BALL_WIDTH = 4;
	var BALL_HEIGHT = 6;

	this.canvas = canvas;
	this.paper = canvas.paper;

	var defaults = {
		x: options.x || this.canvas.center.x,
		y: options.y || (this.canvas.center.y - BALL_Y_OFFSET)
	}

	this.coordinates = {
		x: defaults.x,
		y: defaults.y
	};

	this.draw = function() {

		this.paper.ellipse(
			this.coordinates.x, 
			this.coordinates.y,
			BALL_WIDTH, 
			BALL_HEIGHT).attr({
				'fill': 'brown'
			});

		// todo: implement drag
		// constrain x/y directions
		// move LOS and all players with ball
	}

	this.getSaveData = function() {
		// todo: attach additional data
		var data = {
			coordinates: this.coordinates
		};
		return data;
	}

	self = this;
	return this;
}