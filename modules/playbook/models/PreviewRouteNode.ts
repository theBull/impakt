/// <reference path='./models.ts' />

module Playbook.Models {

    export class PreviewRouteNode 
    extends Common.Models.RouteNode
    implements Common.Interfaces.IRouteNode {

        constructor(
            route: Common.Interfaces.IRoute, 
            relativeCoordinates: Common.Models.RelativeCoordinates, 
            type: Common.Enums.RouteNodeTypes
        ) {
            super(route, relativeCoordinates, type);

            // preview route node does not have a contextmenu
            this.contextmenuTemplateUrl = null;
           
            // Related route node graphics
            this.routeAction = new Playbook.Models.PreviewRouteAction(
                this, Common.Enums.RouteNodeActions.None
            );
            this.routeControlPath = new Playbook.Models.PreviewRouteControlPath(this);

            this.layer.addLayer(this.routeAction.layer);
            this.layer.addLayer(this.routeControlPath.layer);
            this.route.layer.addLayer(this.layer);
        }
    }
}
