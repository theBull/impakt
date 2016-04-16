/// <reference path='./factories.ts' />

module Common.Factories {
	export class RouteActionFactory {

		public static draw(routeAction: Common.Interfaces.IRouteAction) {
			if (Common.Utilities.isNullOrUndefined(routeAction))
				throw new Error('RouteActionFactory draw(): route action is null or undefined');

			switch (routeAction.action) {

                case Common.Enums.RouteNodeActions.None:
                    Common.Factories.RouteActionFactory.none(
                    	routeAction.getGraphics()
                    );
                    break;

                case Common.Enums.RouteNodeActions.Block:
                    Common.Factories.RouteActionFactory.block(
                    	routeAction.routeNode.getGraphics(), 
                    	routeAction.getGraphics()
                   	);
                    break;

                case Common.Enums.RouteNodeActions.Delay:
                    Common.Factories.RouteActionFactory.delay(
                    	routeAction.routeNode.getGraphics(), 
                    	routeAction.getGraphics()
                    );
                    break;
            }
		}

		public static none(routeActionGraphics: Common.Models.Graphics) {
			if (Common.Utilities.isNullOrUndefined(routeActionGraphics))
				throw new Error('RouteActionFactory none(): route action graphics is null');

			return routeActionGraphics.remove();
		}

		public static block(routeNodeGraphics: Common.Models.Graphics, routeActionGraphics: Common.Models.Graphics) {
			if (Common.Utilities.isNullOrUndefined(routeActionGraphics))
				throw new Error('RouteActionFactory block(): route action graphics is null');
			if (Common.Utilities.isNullOrUndefined(routeNodeGraphics))
				throw new Error('RouteActionFactory block(): route node graphics is null');

			let theta = Common.Drawing.Utilities.theta(
				routeNodeGraphics.location.ax,
				routeNodeGraphics.location.ay,
				routeActionGraphics.location.ax,
				routeActionGraphics.location.ay
			);
			let thetaDegrees = Common.Drawing.Utilities.toDegrees(theta);

			routeActionGraphics.placement.coordinates.x = routeNodeGraphics.placement.coordinates.x;
			routeActionGraphics.placement.coordinates.y = routeNodeGraphics.placement.coordinates.y;
			routeActionGraphics.dimensions.offset.x = 0.5;
			routeActionGraphics.location.ax = routeNodeGraphics.location.ax - routeActionGraphics.dimensions.getWidth();
			routeActionGraphics.location.ay = routeNodeGraphics.location.ay;
			routeActionGraphics.setFill('blue');
			routeActionGraphics.setStrokeWidth(2);

			routeActionGraphics.dimensions.width = routeNodeGraphics.dimensions.getWidth() * 2;
			routeActionGraphics.dimensions.height = routeNodeGraphics.dimensions.getHeight() * 2;
			
			let pathStr = Common.Drawing.Utilities.getPathString(true, [
				routeActionGraphics.location.ax,
				routeActionGraphics.location.ay,
				routeActionGraphics.location.ax + (routeActionGraphics.dimensions.getWidth() * 2),
				routeActionGraphics.location.ay
			]);
			routeActionGraphics.path(pathStr);
			routeActionGraphics.setAttribute('class', 'painted-fill');
			routeActionGraphics.rotate(90 - thetaDegrees);
		}

		public static delay(routeNodeGraphics: Common.Models.Graphics, routeActionGraphics: Common.Models.Graphics) {
			if (Common.Utilities.isNullOrUndefined(routeActionGraphics))
				throw new Error('RouteActionFactory block(): route action graphics is null');
			if (Common.Utilities.isNullOrUndefined(routeNodeGraphics))
				throw new Error('RouteActionFactory block(): route node graphics is null');
			
			routeActionGraphics.dimensions.offset.x = 0.5;
			routeActionGraphics.dimensions.offset.y = 0.5;
			routeActionGraphics.dimensions.width = routeNodeGraphics.dimensions.getWidth() * 2;
			routeActionGraphics.dimensions.height = routeNodeGraphics.dimensions.getHeight() * 2;
			routeActionGraphics.setFill('orange');
			routeActionGraphics.setStrokeWidth(1);
			routeActionGraphics.rect();
			routeActionGraphics.setAttribute('class', 'painted-fill');
		}
	}
}