Impakt.Playbook.Editor.Sidelines = function(canvas, options) {
	var self;
	var options = options || {};

	this.canvas = canvas;
	this.paper = canvas.paper;
	var defaults = {
		color: options.color || 'black'
	}

	this.draw = function() {
		var leftStart = this.canvas.center.x - (25 * this.canvas.grid.GRIDSIZE);
		var leftSidelinePathStr = this.paper.getPathString(
			leftStart, 0, leftStart, this.paper.height
		);
		this.leftSideline = this.paper.path(leftSidelinePathStr).attr({
			'stroke-width': 4,
			'stroke': defaults.color,
			'stroke-opacity': 0.25
		});

		var rightStart = this.canvas.center.x + (25 * this.canvas.grid.GRIDSIZE);
		var rightSidelinePathStr = this.paper.getPathString(
			rightStart, 0, rightStart, this.paper.height
		);
		this.rightSideline = this.paper.path(rightSidelinePathStr).attr({
			'stroke-width': 4,
			'stroke': 'black',
			'stroke-opacity': 0.25
		});
	}

	self = this;
	return this;
}