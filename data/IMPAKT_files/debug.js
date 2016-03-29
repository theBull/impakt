var debug = {
	senders : [
		'LineOfScrimmage',
	],

	log: function(sender) {
		var args = Array.prototype.slice.call(arguments, 1);
		if(this.senders.indexOf(sender) >= 0)
			console.log(sender, args.toString());
	},

	randomId: function() {
		return (Math.floor(Math.random() * (9999999999 - 1000000000)) + 999999999);
	}
}