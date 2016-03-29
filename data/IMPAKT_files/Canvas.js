Impakt.Playbook.Editor.Canvas = function(containerElement, options) {

	var self;
	var options = options || {};

	this.paper = Raphael(containerElement, 600, 600);
	this.paper.setViewBox(0, 0, this.paper.width, this.paper.height );
 
	// Setting preserveAspectRatio to 'none' lets you stretch the SVG
	this.paper.canvas.setAttribute('preserveAspectRatio', 'none');

	this.title = options.title || 'default';
	console.log('canvas title', this.title);

	this.center = {
		x: parseInt(this.paper.width / 2),
		y: parseInt(this.paper.height / 2)
	}

	this.paper.getPathString = function(mx, my, lx, ly) {
		return ['M', mx, ' ', my, 'L', lx, ' ', ly].join('');
	}

	this.grid = new Impakt.Playbook.Editor.Grid(this);
    this.grid.draw();

    // TODO: pass id along to field
    this.field = new Impakt.Playbook.Editor.Field(this, { id: options.playId });
    this.field.draw();

    self = this;
	return this;
}