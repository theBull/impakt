/// <reference path='./common-contextmenu.mdl.ts' />

// contextmenu factory
declare var impakt: any;

impakt.common.contextmenu.factory('__contextmenu', function() {

	console.log('creating contextmenu factory');

	var context: any = null;
	var closeCallbacks: Array<any> = [];
	var updateCallbacks: Array<any> = [];

	var self = {
		getContext: function() {
			return context;
		},
		setContext: function(obj: any) {
			console.log('set context', obj);
			context = obj;
			
			if (!obj)
				return;

			for (let i = 0; i < updateCallbacks.length; i++) {
				updateCallbacks[i](context);
			}
		},
		onContextUpdate: function(callback: any) {
			updateCallbacks.push(callback);
		},
		onclose: function(callback: any) {
			closeCallbacks.push(callback);
		},
		close: function() {
			console.log('closing contextmenu');
			self.setContext(null);

			while(closeCallbacks.length > 0) {
				var callback = closeCallbacks.pop();
				callback();
			}
			// updateCallbacks = [];
		},
		calculatePosition: function(
			left: number, 
			top: number,
			$element: any
		) {
			var target = context;
			console.log('calculating contextmenu position', target);
			var canvasWidth = target.canvas.$container.width();
			var canvasHeight = target.canvas.$container.height();
			var contextmenuWidth = $element.width();
			var contextmenuHeight = $element.height();

			if(left + contextmenuWidth > canvasWidth) {
				left -= contextmenuWidth;
			}
			if (top + contextmenuHeight > canvasHeight) {
				top -= contextmenuHeight;
			}

			$element.css({ 'left': left + 'px', 'top': top + 'px'});

		}
	};

	return self;
});
