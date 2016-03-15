Impakt.Playbook.Editor.LineOfScrimmage = function(canvas, options) {
	var self;
	var options = options || {};
	// Line of scrimmage should be between gridlines - 
	// not directly on them
	var LOS_Y_OFFSET = 8;

	this.debugName = 'LineOfScrimmage';
	this.canvas = canvas;
	this.paper = this.canvas.paper;
	this.field = this.canvas.field;
	
	var defaults = {
		y: options.y || (this.canvas.center.y - LOS_Y_OFFSET),
		color: options.color || 'green',
		opacity: options.opacity || 0.25,
	}

	this.coordinates = {
		x: 0, // this should always only be 0
		y: defaults.y
	}

	

	this.draw = function() {

		this.paper.rect(
			0, 
			defaults.y, 
			this.field.width, 
			4
		).click(handleLOSClick).attr({
			'fill': defaults.color,
			'fill-opacity': defaults.opacity,
			'stroke-width': 0
		});

		// todo: attach drag functionality
		// drag when moving ball
	}

	this.getSaveData = function() {
		var data = {
			coordinates: this.coordinates
		}
		return data;
	}

	var handleLOSClick = function(e) {
		debug.log(self.debugName, 'los clicked');
	}

	self = this;
	return this;
}