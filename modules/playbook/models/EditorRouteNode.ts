/// <reference path='./models.ts' />

module Playbook.Models {

    export class EditorRouteNode 
    extends Common.Models.RouteNode
    implements Common.Interfaces.IRouteNode {

        constructor(
            context: Common.Interfaces.IPlayer, 
            relativeCoordinates: Common.Models.RelativeCoordinates, 
            type: Common.Enums.RouteNodeTypes
        ) {
            super(context, relativeCoordinates, type); 
            this.layer.graphics.enable();
            this.contextmenuTemplateUrl = Common.Constants.EDITOR_ROUTENODE_CONTEXTMENU_TEMPLATE_URL;
           
            // Related route node graphics
            this.routeAction = new Playbook.Models.EditorRouteAction(this, Common.Enums.RouteNodeActions.None);           
            this.routeControlPath = new Playbook.Models.EditorRouteControlPath(this);

            // Add layers
            this.layer.addLayer(this.routeAction.layer);
            this.layer.addLayer(this.routeControlPath.layer);            
        }

        public draw() {
            super.draw();

            this.layer.graphics.setAttribute('class', 'grab');
            
            this.layer.graphics.onclick(
                this.click, 
                this
            );

            this.layer.graphics.ondrag(
                this.dragMove, 
                this.dragStart, 
                this.dragEnd, 
                this // drag end context
            );
            
            this.layer.graphics.onhover(
                this.hoverIn, 
                this.hoverOut,
                this
            );

            this.layer.graphics.oncontextmenu(
                this.contextmenu, 
                this
            );

            if (this.type == Common.Enums.RouteNodeTypes.CurveControl) {
                // TODO @theBull
            }
        }

        public click(e: any) {
            console.log('route node clicked');
        }

        public contextmenu(e: any) {
            this.paper.canvas.listener.invoke(
                Playbook.Enums.Actions.RouteNodeContextmenu, 
                this
            );
        }

        public dragMove(dx, dy, posx, posy, e) {
            if (this.layer.graphics.disabled) {
                return;
            }

            // (snapping) only adjust the positioning of the player
            // for every grid-unit worth of movement
            let snapDx = this.grid.snapPixel(dx);
            let snapDy = this.grid.snapPixel(dy);

            // Update RouteNode graphical position
            this.layer.graphics.moveByDelta(snapDx, snapDy);
            
            // Update RouteAction graphical position (if applicable)
            if (this.routeAction) {
                this.routeAction.layer.moveByDelta(snapDx, snapDy);

                // Rotate the route action to stay perpendicular to the node/route orientation
                let theta = Common.Drawing.Utilities.theta(
                    this.node.prev.data.layer.graphics.location.ax, 
                    this.node.prev.data.layer.graphics.location.ay,
                    this.layer.graphics.location.ax, 
                    this.layer.graphics.location.ay
                );
                let thetaDegrees = Common.Drawing.Utilities.toDegrees(theta);
                this.routeAction.layer.graphics.rotate(90 - thetaDegrees);
            }

            // redraw the path
            if (this.isCurveNode()) {
                console.log('dragging control:', this.type);
            }

            this.context.draw();

            this.setModified(true);
        }
        
        public dragStart(x, y, e) {}

        public dragEnd(e) {
            this.drop();
        }

        public drop(): void {
            super.drop();

            if (this.routeAction)
                this.routeAction.drop();

            // route node has been modified
            this.setModified();
        }
    }
}
