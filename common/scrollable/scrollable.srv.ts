/// <reference path='./scrollable.mdl.ts' />

impakt.common.scrollable.service('_scrollable',
	['$rootScope', function($rootScope: any) {
		console.debug('service: impakt.common.scrollable')

		let self = this;
		let down, up;
		this.$container;
		this.$head;
		this.headHeight;
		this.$well;
		this.content;
		this.contentHeight;
		this.HEIGHT_RATIO;
		this.deltaY;
		this.deltaX;
		this.offsetY;
		this.deltaRatioY;
		this.offsetX;
		this.deltaRatioX;
		this.speed;
		this.range;
		this.altKeyPressed;
		this.speed;
		this.thresholdX = 10;
		this.thresholdY = 10;

		this.readyCallback = function() {
			console.log('scrollable ready');
		}
		this.scrollCallback = function(x: number, y: number) {
			//console.log('scrolling...');
		}

		this.initialize = function($container, content) {
			this.altKeyPressed = false;

			// main container window and inner content
			this.$container = $container;
			this.height = $container.height();
			this.content = content;
			this.contentHeight = content.getHeight();
			this.HEIGHT_RATIO = this.height / this.contentHeight;
			// console.log(
			// 	'container height: ', this.height, 
			// 	'content height: ', this.contentHeight, 
			// 	'ratio: ', this.HEIGHT_RATIO
			// );

			this.$head = $("<div class='scroll-head'></div>");
			this.$well = $("<div class='scroll'></div>").append(this.$head);

			this.$container.find('.scroll').remove();
			this.$container.addClass('scrollable-container').append(this.$well);
			
			this.offsetY = 0;
			this.offsetX = 0;
			this.deltaY = 0;
			this.deltaX = 0;
			this.speed = 0.25; // must be between 0 and 1!
			if(this.speed < 0 || this.speed > 1) {
				throw new Error('scroll speed must be between 0 and 1');
			}
			this.deltaRatioY = 0;
			this.deltaRatioX = 0;

			this.headHeight = Math.ceil(this.HEIGHT_RATIO * this.height);
			this.$head.height(this.headHeight);
			this.headOffsetY = 0;
			this.headOffsetX = 0;

			console.log(
				'container height: ', this.height,
				'head height: ', this.headHeight
			)

			this.range = this.contentHeight - this.height;
			this.headRange = this.height - this.headHeight;

			down = false;
			up = false;

			// set the event listener to the mousewheel event
			this.setListener();

			this.ready();
		}

		this.setListener = function() {
			this.$head.draggable({
				axis: 'y',
				containment: '.scrollable-container .scroll',
				drag: function(event: any, ui: any) {
					// TODO implement
				}
			});
			this.$container[0].addEventListener('mousewheel',
				function(event: MouseWheelEvent) {
					self.scroll.call(
						self, 
						event.wheelDeltaX, 
						event.wheelDeltaY, 
						event.altKey
					);
				}, false);
		}

		this.isDown = function() {
			return down && self.offsetY > -self.range;
		}
		this.isUp = function() {
			return up && self.offsetY < 0;			
		}
		this.canScroll = function() {
			return this.isDown() || this.isUp();
		}

		this.setHead = function(x: number, y: number) {
			this.$head.css({ 'top': y + 'px' });
		}

		this.onready = function(callback) {
			this.readyCallback = callback;
		}

		this.ready = function() {
			this.readyCallback(this.content);
		}

		this.onscroll = function(callback) {
			this.scrollCallback = callback;
		}

		this.scrollToPercentY = function(percentY: number) {
			if (percentY < 0 || percentY > 1)
				throw new Error('Percent must be between 0 and 1');

			this.headOffsetY = percentY * this.headRange;
			this.offsetY = -percentY * this.range;
			this.setHead(0, this.headOffsetY);
			this.content.scroll(this.offsetX, -this.offsetY);
		}

		this.scrollToPercentX = function(percentX: number) {
			// TODO implement
		}

		this.scrollToPercent = function(percentX: number, percentY: number) {
			this.scrollToPercentX(percentX);
			this.scrollToPercentY(percentY);
		}

		this.scroll = function(deltaX: number, deltaY: number, altKeyPressed: boolean) {

			/**
			 * Seeks to prevent micro-scroll events during clicks / drags 
			 * from causing glitchy field shifting 
			 */
			if (Math.abs(deltaX) < self.thresholdX && 
				Math.abs(deltaY) < self.thresholdY)
				return;

			self.deltaX = deltaX
			self.deltaY = deltaY;
			self.altKeyPressed = altKeyPressed;
			self.deltaRatioX = new Number(self.deltaX * self.HEIGHT_RATIO).toFixed(1);
			self.deltaRatioY = new Number(self.deltaY * self.HEIGHT_RATIO).toFixed(1);

			down = self.deltaY < 0;
			up = !down;

			if (!self.altKeyPressed) {

				if (self.canScroll()) {

					let scrollDistanceY = self.offsetY + (self.deltaY * self.speed);

					let scrollableY = self.isDown() ?
						Math.max(
							scrollDistanceY,
							-self.range
						) :
						Math.min(
							scrollDistanceY,
							0
						);

					if (scrollableY < -self.range ||
						scrollableY > 0)
						return;

					self.headOffsetY = -scrollableY * self.HEIGHT_RATIO;
					self.offsetY = scrollableY;
					self.setHead.call(self, 0, self.headOffsetY);
					self.content.scroll(self.offsetX, -self.offsetY);


				} else {
					console.log('STOP');
				}

			}
			else {
				//self.content.zoom(self.deltaY);
			}

			this.scrollCallback(deltaX, deltaY);
		}

	}]);