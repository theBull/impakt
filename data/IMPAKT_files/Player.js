Impakt.Playbook.Models.Player = function(canvas, options) {
	var self;
	var options = options || {};

	this.canvas = canvas;
	this.paper = canvas.paper;
	this.grid = this.canvas.grid;
	this.field = this.canvas.field;
	this.obj = this.paper.set();
	this.icon;
	this.box;
	this.assignment = null;
	this.teamMember = 'N/A';
	this.name = 'N/A';
	this.id = options.id;

	var options = options || {};

	this.isCreatedNewFromAltDisabled = false;
	this.newFromAlt = null;
	this.isDraggingNewFromAlt = false;

	var defaults = {
		height: options.height || this.grid.GRIDSIZE * 2,
		width:  options.width || this.grid.GRIDSIZE * 2,
		radius: options.radius || this.grid.GRIDSIZE * 0.5,
		x: options.x || 30,
		y: options.y || 30,
		color: options.color || 'grey',
		name: options.name || 'player'
	}
	this.coordinates = {
		x: defaults.x,
		y: defaults.y
	};

	/**
	* Creates the player, SVG, renders the graphics on the paper
	* and sets the current Object's property reference	
	*/
	this.draw = function() {

		// the circle's location is determined by cx and cy - the center
		// of the circle. We need to compute the difference between the
		// box's x/y and the circle's cx/cy to center the circle in the box.
		var boxOffset = computeBoxIconOffset(defaults.x, defaults.y);
	    var boxOffsetX = boxOffset.x;
	    var boxOffsetY = boxOffset.y;

	    this.box = this.paper.rect(boxOffsetX, boxOffsetY, defaults.width, defaults.height).attr({
	    	'stroke': 'orange',
	    	'stroke-width': 0.5,
	    	'fill': 'grey',
	    	'fill-opacity': 0.1,
	    	x: boxOffsetX,
	    	y: boxOffsetY
	    });

	    this.icon = this.paper.circle(defaults.x, defaults.y, defaults.radius).attr({
	      	fill: defaults.color,
	      	x: defaults.x,
	      	y: defaults.y
	    });

	    this.obj.push(this.icon, this.box);


	    // attach event handlers
	    this.obj.click(handleClick);
	    this.icon.drag(this.drag_move, this.drag_start, this.drag_end);
	}

	// drag
	this.drag_move = function(dx, dy, posx, posy, e) {

		var context = self.newFromAlt ? self.newFromAlt : self;
		var dragIcon = this;
		var grid = self.grid;

		//console.log(this.attrs.fill, dx, dy);

		if(e.altKey && !self.isCreatedNewFromAltDisabled) {
			var options = {
				x: dragIcon.ox, 
				y: dragIcon.oy,
				color: 'blue'
			};
			var n = new Impakt.Playbook.Models.Player(self.canvas, options, 'new');
			n.draw();
			dragIcon = n.icon;

			self.newFromAlt = n;
			self.isCreatedNewFromAltDisabled = true;
			self.isDraggingNewFromAlt = true;
			context = n;
		}
	
		var toX = (dragIcon.ox) + dx;
		var toY = (dragIcon.oy) + dy;
		var snapX = Math.round(toX / grid.GRIDSIZE) * grid.GRIDSIZE;
		var snapY = Math.round(toY / grid.GRIDSIZE) * grid.GRIDSIZE;

		// update box position
		context.box.attr({x: snapX, y: snapY});

		// update icon position
		var iconOffset = computeBoxIconOffset(snapX, snapY);
		context.icon.attr({cx: snapX + grid.GRIDSIZE, cy: snapY + grid.GRIDSIZE});

		var getPlayer = self.field.getPlayerById(self.id);
		getPlayer.coordinates.x = snapX + grid.GRIDSIZE;
		getPlayer.coordinates.y = snapY + grid.GRIDSIZE;
		console.log(getPlayer.coordinates.x, getPlayer.coordinates.y);
    }
    this.drag_start = function(x, y, e) {
		var bbox = self.obj.getBBox();
		this.ox = bbox.x;
		this.oy = bbox.y;
		this.dragging = true;
		//console.log('drag start', this.ox, this.oy);
    }
    this.drag_end = function(e) {
    	self.isCreatedNewFromAltDisabled = false;
		self.isDraggingNewFromAlt = true;
    	self.newFromAlt = null;

    	// update x and y values for box
    	var bbox = self.obj.getBBox();
		this.ox = bbox.x;
		this.oy = bbox.y;

		//self.box.attr({x: bbox.x, y: bbox.y});

		// update x, y, cx, cy values for icon
		// TODO: compute offset
		//self.icon.attr({x: bbox.x, y: bbox.y});

    	console.log('drag end');
    }

    this.getSaveData = function() {
    	var data = {
    		coordinates: this.coordinates,
    		assignment: this.assignment,
    		teamMember: this.teamMember,
    		name: this.name
    	}
    	return data;
    }

	// click
	var handleClick = function(e) {
		self.box.attr({'stroke': 'red'});

	}

	this.getBoxCoordinates = function() {

	}

	function computeBoxIconOffset(ox, oy) {
		return {
			x: ox - self.grid.GRIDSIZE,
			y: oy - self.grid.GRIDSIZE
		}
	}

	self = this;
	return this;
}