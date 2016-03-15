Impakt.Playbook.Editor.Grid = function(canvas) {
	
	this.canvas = canvas
	this.paper = canvas.paper;
	this.dimensions = { cols: 0, rows: 0 };

	this.GRIDSIZE = 10;

	this.draw = function() {
		var width = this.paper.width;
		var height = this.paper.height;
		var cols = parseInt(width / this.GRIDSIZE);
		var rows = parseInt(height / this.GRIDSIZE);

		this.dimensions.cols = cols;
		this.dimensions.rows = rows;

		for(var c = 1; c < cols; c++) {
			var colX = c * this.GRIDSIZE;
			var pathStr = this.paper.getPathString(colX, 0, colX, height);
			var p = this.paper.path(pathStr).attr({
				'stroke-dasharray': ['- '],
				'stroke-opacity': 0.2,
				'stroke-width': 0.5
			});
		}
		for(var r = 1; r < rows; r++) {
			var rowY = r * this.GRIDSIZE;
			var pathStr = this.paper.getPathString(0, rowY, width, rowY);
			var p = this.paper.path(pathStr).attr({
				'stroke-dasharray': ['- '],
				'stroke-opacity': 0.2,
				'stroke-width': 0.5
			});
		}
	}

	this.getCoordinates = function() {
		return {x: -1, y: -1}
	}

	this.getDimensions = function() {
		return this.dimensions;
	}

	return this;
}