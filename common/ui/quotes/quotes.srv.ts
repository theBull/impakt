/// <reference path='./quotes.mdl.ts' />

impakt.common.ui.quotes.service('_quotes', [
function() {

	var quotes = [
		new Common.Models.Quote(
			"It's not whether you get knocked down; \
			it's whether you get back up.",
			"Vince Lombardi"),
		new Common.Models.Quote(
			"Winning isn't everything...it's the only thing.",
			"Vince Lombardi"),
		new Common.Models.Quote(
			"The essence of football was blocking, tackling, \
			and execution based on timing, rhythm and deception.",
			"Knute Rockne"),
		new Common.Models.Quote(
			"It's not the will to win, but the will to prepare \
			to win that makes the difference.",
			"Bear Bryant"),
		new Common.Models.Quote(
			"We love football.",
			"Impakt Athletics"),
		new Common.Models.Quote(
			"Football doesn't build character. It eliminates weak ones.",
			"Darrell Royal"),
		new Common.Models.Quote(
			"Football is like life. It requires perseverance, self denial \
			hard work, sacrifice, dedication, and respect for authority.",
			"Vince Lombardi"),
		new Common.Models.Quote(
			"If tomorrow wasn't promised, what would you give for today?",
			"Ray Lewis"),
		new Common.Models.Quote(
			"I'm just here so I don't get fined.",
			"Marshawn Lynch"),
		new Common.Models.Quote(
			"I wish I knew about [Impakt] 10 years ago, I wouldn't have so much damn gray hair now!",
			"Coach, USC"),
		new Common.Models.Quote(
			"To me, this is a no brainer.",
			"Oregon"),
		new Common.Models.Quote(
			"People are going to love this",
			"Harvard"),
		new Common.Models.Quote(
			"This is really damn cool. I know I want it.",
			"Arizona"),
		new Common.Models.Quote(
			"This is awesome. It fits perfectly with what we're trying to do.",
			"Michigan"),
		new Common.Models.Quote(
			"This is really slick. I think the way you guys approached this was brilliant.",
			"Dallas Cowboys")

	];

	this.getRandomQuote = function(): Common.Models.Quote {
		let index = Common.Utilities.randomInt(0, quotes.length - 1);
		return quotes[index];
	}

}]);
