/// <reference path='./models.ts' />

module Playbook.Models {

    export class EditorRouteNode 
    extends Common.Models.RouteNode
    implements Common.Interfaces.IRouteNode {

        constructor(
            route: Common.Interfaces.IRoute, 
            relativeCoordinates: Common.Models.RelativeCoordinates, 
            type: Common.Enums.RouteNodeTypes
        ) {
            super(route, relativeCoordinates, type); 
            this.layer.graphics.enable();
            this.layer.graphics.setOriginalFill('#222222');
            this.layer.graphics.setHoverOpacity(1);
            this.layer.graphics.setOriginalOpacity(0.05);

            this.contextmenuTemplateUrl = Common.Constants.EDITOR_ROUTENODE_CONTEXTMENU_TEMPLATE_URL;
           
            // Related route node graphics
            this.routeAction = new Playbook.Models.EditorRouteAction(
                this, Common.Enums.RouteNodeActions.None
            );           
            this.routeControlPath = new Playbook.Models.EditorRouteControlPath(this);

            // Add layers
            this.layer.addLayer(this.routeAction.layer);
            this.layer.addLayer(this.routeControlPath.layer);
            this.route.layer.addLayer(this.layer);           
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

        public hoverIn(e: any) {
            this.layer.graphics.toggleOpacity();
        }

        public hoverOut(e: any) {
            this.layer.graphics.toggleOpacity();
        }

        public click(e: any) {
            // Toggle the selection of this routeNode
            this.field.toggleSelection(this);
        }

        public contextmenu(e: any) {
            this.paper.canvas.listener.invoke(
                Playbook.Enums.Actions.RouteNodeContextmenu, 
                new Common.Models.ContextmenuData(this, e.pageX, e.pageY)
            );
        }

        public dragMove(dx, dy, posx, posy, e) {
            if (this.layer.graphics.disabled) {
                return;
            }

            // Update RouteNode graphical position
            this.layer.graphics.moveByDelta(dx, dy);
            
            // Update RouteAction graphical position (if applicable)
            if (this.routeAction) {
                this.routeAction.layer.moveByDelta(dx, dy);

                // Rotate the route action to stay perpendicular to the node/route orientation
                let theta = Common.Drawing.Utilities.theta(
                    this.prev.layer.graphics.location.ax, 
                    this.prev.layer.graphics.location.ay,
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

            this.route.draw();

            this.setModified(true);
        }
        
        public dragStart(x: number, y: number, e: any) {
            super.dragStart(x, y, e);
        }

        public dragEnd(e: any) {
            super.dragEnd(e);

            this.drop();

            // re-draw the route again after dropping,
            // since .drop() will force the absolute
            // coordinates to snap to a grid point, which
            // doesn't happen during the onDrag method
            this.route.draw();
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
