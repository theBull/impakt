
// Control access to object properties by using explicit
// getters and setters.
Impakt.View = function(name, options) {
	var self;
	var options = options || {};
	var name = name;
	var defaults = {
		keepAlive: options.isKeepAlive || true // keep views alive by default
	}
	var data = options.data || {};

	// returns the name of the view
	this.getName = function() {
		return name;
	}

	// destroy the view (particluarly if it's keep alive)
	this.destroy = function() {
		// TODO
	}

	// get existing data
	this.getData = function() {
		return data;
	}

	// add new data to the existing data
	this.extendData = function(extendData) {
		return $.extend(data, extendData);
	}

	// overwrite existing data
	this.setData = function(setData) {
		data = setData;
		return data;
	}

	this.isKeepAlive = function() {
		return defaults.keepAlive;
	}


	self = this;
	return this;
}