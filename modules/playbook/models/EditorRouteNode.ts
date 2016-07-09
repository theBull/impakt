/// <reference path='./models.ts' />

module Playbook.Models {

    export class EditorRouteNode 
    extends Common.Models.RouteNode
    implements Common.Interfaces.IRouteNode {

        constructor(
            relativeCoordinates: Common.Models.RelativeCoordinates, 
            type: Common.Enums.RouteNodeTypes
        ) {
            super(relativeCoordinates, type); 
            
            this.routeAction = new Playbook.Models.EditorRouteAction(Common.Enums.RouteNodeActions.None);
            this.routeControlPath = new Playbook.Models.EditorRouteControlPath();
            this.renderType = Common.Enums.RenderTypes.Editor;  
            this.contextmenuTemplateUrl = Common.Constants.EDITOR_ROUTENODE_CONTEXTMENU_TEMPLATE_URL;
        }

        public initialize(field: Common.Interfaces.IField, route: Common.Interfaces.IFieldElement): void {
            super.initialize(field, route);

            this.graphics.enable();
            this.graphics.setOriginalFill('#222222');
            this.graphics.setHoverOpacity(1);
            this.graphics.setOriginalOpacity(0.05);
            this.graphics.setSelectedFillOpacity(1);
            this.graphics.setSelectedFill('#222222');

            // Related route node graphics
            this.routeAction.initialize(this.field, this);
            this.routeControlPath.initialize(this.field, this);

            // Add layers
            this.layer.addLayer(this.routeAction.layer);
            this.layer.addLayer(this.routeControlPath.layer);
            this.route.layer.addLayer(this.layer);
        }

        public draw() {
            super.draw();

            this.graphics.setAttribute('class', 'grab');
            
            this.graphics.onclick(
                this.click, 
                this
            );

            this.graphics.ondrag(
                this.dragMove, 
                this.dragStart, 
                this.dragEnd, 
                this // drag end context
            );
            
            this.graphics.onhover(
                this.hoverIn, 
                this.hoverOut,
                this
            );

            this.graphics.oncontextmenu(
                this.contextmenu, 
                this
            );

            if (this.type == Common.Enums.RouteNodeTypes.CurveControl) {
                // TODO @theBull
            }
        }

        public hoverIn(e: any) {
            this.graphics.toggleOpacity();
        }

        public hoverOut(e: any) {
            this.graphics.toggleOpacity();
        }

        public click(e: any) {
            // Toggle the selection of this routeNode
            this.field.toggleSelection(this);
        }

        public contextmenu(e: any) {
            this.canvas.listener.invoke(
                Playbook.Enums.Actions.RouteNodeContextmenu, 
                new Common.Models.ContextmenuData(this, e.pageX, e.pageY)
            );
        }

        public dragMove(dx, dy, posx, posy, e) {
            if (this.disabled) {
                return;
            }

            // Update RouteNode graphical position
            this.graphics.moveByDelta(dx, dy);
            
            // Update RouteAction graphical position (if applicable)
            if (this.routeAction) {
                this.routeAction.layer.moveByDelta(dx, dy);

                // Rotate the route action to stay perpendicular to the node/route orientation
                let theta = Common.Drawing.Utilities.theta(
                    this.prev.graphics.location.ax, 
                    this.prev.graphics.location.ay,
                    this.graphics.location.ax, 
                    this.graphics.location.ay
                );
                let thetaDegrees = Common.Drawing.Utilities.toDegrees(theta);
                this.routeAction.graphics.rotate(90 - thetaDegrees);
            }

            // redraw the path
            if (this.isCurveNode()) {
                console.log('dragging control:', this.type);
            }

            this.route.draw();
        }
        
        public dragStart(x: number, y: number, e: any) {
            super.dragStart(x, y, e);
            this.listen(false);
        }

        public dragEnd(e: any) {
            super.dragEnd(e);
            this.listen(true);
            this.drop();

            // re-draw the route again after dropping,
            // since .drop() will force the absolute
            // coordinates to snap to a grid point, which
            // doesn't happen during the onDrag method
            this.route.draw();
            this.setModified(true);
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
