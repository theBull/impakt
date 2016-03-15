Impakt.Playbook.Editor.Hashmarks = function(canvas, options) {
	var self;
	var options = options || {};
	var HASH_X_OFFSET = 10; // hash marks should be -x- grid units from center

	this.canvas = canvas;
	this.paper = canvas.paper;
	this.leftHash = null;
	this.rightHash = null;

	var defaults = {
		color: options.color || 'grey',
	}
	
	this.draw = function() {
		// left & right hash
		var leftHashStart = this.canvas.center.x - (HASH_X_OFFSET * this.canvas.grid.GRIDSIZE);
		var leftHashPathStr = this.paper.getPathString(
			leftHashStart, 0, leftHashStart, this.paper.height
		);
		this.leftHash = this.paper.path(leftHashPathStr).attr({
			'stroke-dasharray': ['- '],
			'stroke-width': 2,
			'stroke': defaults.color,
			'stroke-opacity': 0.25
		});

		var rightHashStart = this.canvas.center.x + (HASH_X_OFFSET * this.canvas.grid.GRIDSIZE);
		var rightHashPathStr = this.paper.getPathString(
			rightHashStart, 0, rightHashStart, this.paper.height
		);
		this.rightHash = this.paper.path(rightHashPathStr).attr({
			'stroke-dasharray': ['- '],
			'stroke-width': 2,
			'stroke': 'grey',
			'stroke-opacity': 0.25
		});
	}

	self = this;
	return this;
}