/// <reference path='./models.ts' />

module Playbook.Models {

    export class PreviewRouteNode 
    extends Common.Models.RouteNode
    implements Common.Interfaces.IRouteNode {

        constructor(
            relativeCoordinates: Common.Models.RelativeCoordinates, 
            type: Common.Enums.RouteNodeTypes
        ) {
            super(relativeCoordinates, type);

            this.routeAction = new Playbook.Models.PreviewRouteAction(Common.Enums.RouteNodeActions.None);
            this.routeControlPath = new Playbook.Models.PreviewRouteControlPath();
            this.renderType = Common.Enums.RenderTypes.Preview;
        }

        public initialize(field: Common.Interfaces.IField, route: Common.Interfaces.IFieldElement): void {
            super.initialize(field, route);
            // preview route node does not have a contextmenu
            this.contextmenuTemplateUrl = null;

            // Related route node graphics
            this.routeAction.initialize(this.field, this);
            this.routeControlPath.initialize(this.field, this);

            this.layer.addLayer(this.routeAction.layer);
            this.layer.addLayer(this.routeControlPath.layer);
            this.route.layer.addLayer(this.layer);
            this.disable();
        }
    }
}
