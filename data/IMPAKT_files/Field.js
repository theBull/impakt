Impakt.Playbook.Editor.Field = function(canvas, options) {
	
	var self;
	var options = options || {};

	this.canvas = canvas
	this.paper = canvas.paper;
	this.width = this.paper.width;
	this.height = this.paper.height;

	this.zoom = 1;
	this.leftSideline = null;
	this.rightSideline = null;
	this.los = null;
	this.ball = null;
	this.players = [];
	this.hashmarks = null;
	this.sidelines = null;

	var defaults = {
		id: options.id || 0
	}

	// sidelines
	this.draw = function() {

		this.sidelines = new Impakt.Playbook.Editor.Sidelines(this.canvas);
		this.sidelines.draw();

		this.hashmarks = new Impakt.Playbook.Editor.Hashmarks(this.canvas);
		this.hashmarks.draw();
		
		this.los = new Impakt.Playbook.Editor.LineOfScrimmage(this.canvas);
		this.los.draw();
		
		this.ball = new Impakt.Playbook.Editor.Ball(this.canvas);
		this.ball.draw();
	}

	this.drawFromPlay = function(playData) {
		if(playData && playData.players) {
			var tempPlayers = playData.players;
			for(var i = 0; i < tempPlayers.length; i++) {
				var player = new Impakt.Playbook.Models.Player(
					this.canvas,
					{
						id: tempPlayers[i].id || debug.randomId(),
						x: tempPlayers[i].coordinates.x,
						y: tempPlayers[i].coordinates.y
					}
				);
	    		player.draw();
	    		this.players.push(player);
			}
		}
	}

	this.getSaveData = function() {
		// todo: attach additional data
		var data = {
			id: defaults.id,
			ball: this.ball.getSaveData(), 
			lineOfScrimmage: this.los.getSaveData(),
			players: getPlayerSaveData(this.players), // todo: create player schema
		}
		return data;
	}

	this.getPlayerById = function(id) {
		var playerMatches = this.players.filter(function(player) {
			return player.id == id;
		});
		return playerMatches && playerMatches.length > 0 ? playerMatches[0] : null;
	}

	function getPlayerSaveData(players) {
		var data = [];
		if(players) {
			for(var i = 0; i < players.length; i++) {
				data.push(players[i].getSaveData());
			}
		}
		return data;
	}

	self = this;
	return this;
}