/// <reference path='./models.ts' />

module Common.Models {
    export class Graphics
    extends Common.Models.Modifiable
    implements Common.Interfaces.IDrawable {

        public canvas: Common.Interfaces.ICanvas;
        public grid: Common.Interfaces.IGrid;
        public raphael: any;
        public placement: Common.Models.Placement;
        public location: Common.Models.Location;
        public dimensions: Common.Models.Dimensions;
        public containment: Common.Models.Containment;
        public drawingHandler: Common.Models.DrawingHandler;
        public font: any;
        public set: Common.Models.GraphicsSet;
        public snapping: boolean;

        /**
         * 
         * Color information
         * 
         */
        public opacity: number;
        public fill: string;
        public fillOpacity: number;
        public stroke: string;
        public strokeWidth: number;

        /**
         * 
         * Original color information to retain states during toggle/disable/select
         * 
         */
        public originalOpacity: number;
        public originalFillOpacity: number;
        public originalFill: string;
        public originalStroke: string;
        public originalStrokeWidth: number;

        /**
         *
         * Selection color information
         *
         */
        public selectedFill: string;
        public selectedFillOpacity: number;
        public selectedStroke: string;
        public selectedOpacity: number;
        public disabledFill: string;
        public disabledFillOpacity: number;
        public disabledStroke: string;
        public disabledOpacity: number;

        public hoverOpacity: number;
        public hoverFillOpacity: number;

        constructor(canvas: Common.Interfaces.ICanvas) {
            super();
            super.setContext(this);

            this.canvas = canvas;
            this.grid = canvas.grid;
            this.placement = null; // new Common.Models.Placement(0, 0);
            this.location = new Common.Models.Location(0, 0);
            this.dimensions = new Common.Models.Dimensions();
            this.containment = new Common.Models.Containment(
                0,
                this.grid.getWidth(),
                0,
                this.grid.getHeight()
            );

            this.originalFill = 'white';
            this.originalStroke = 'black';
            this.originalOpacity = 1;
            this.originalFillOpacity = 1;
            this.originalStrokeWidth = 1;

            this.fill = this.originalFill;
            this.fillOpacity = this.originalFillOpacity;
            this.stroke = this.originalStroke;
            this.opacity = this.originalOpacity;
            this.strokeWidth = this.originalStrokeWidth;

            this.selectedFill = 'white';
            this.selectedFillOpacity = 1;
            this.selectedStroke = 'red';
            this.selectedOpacity = 1;

            this.disabledFill = '#aaaaaa';
            this.disabledFillOpacity = 1;
            this.disabledStroke = '#777777';
            this.disabledOpacity = 0.5;

            this.hoverOpacity = 0.4;
            this.hoverFillOpacity = 0.4;

            this.font = this.canvas.drawing.getFont('Arial');
            this.drawingHandler = new Common.Models.DrawingHandler(this);
            this.set = new Common.Models.GraphicsSet(this);
            this.snapping = true;
        }

        public toJson(): any {
            return {
                dimensions: this.dimensions.toJson(),
                opacity: this.opacity,
                fill: this.fill,
                fillOpacity: this.fillOpacity,
                stroke: this.stroke,
                strokeWidth: this.strokeWidth,
                originalOpacity: this.originalOpacity,
                originalFill: this.originalFill,
                originalFillOpacity: this.originalFillOpacity,
                originalStroke: this.originalStroke,
                originalStrokeWidth: this.originalStrokeWidth,
                selectedFill: this.selectedFill,
                selectedFillOpacity: this.selectedFillOpacity,
                selectedStroke: this.selectedStroke,
                selectedOpacity: this.selectedOpacity,
                disabledFillOpacity: this.disabledFillOpacity,
                disabledStroke: this.disabledStroke,
                disabledOpacity: this.disabledOpacity,
                hoverOpacity: this.hoverOpacity,
                hoverFillOpacity: this.hoverFillOpacity,
                placement: this.placement ? this.placement.toJson() : null,
                location: this.location ? this.location.toJson() : null
            }
        }

        public fromJson(json: any): any {
            if (!json)
                return;

            this.dimensions.fromJson(json.dimensions);
            this.opacity = json.opacity;
            this.fill = json.fill;
            this.fillOpacity = json.fillOpacity;
            this.stroke = json.stroke;
            this.strokeWidth = json.strokeWidth;
            this.placement.fromJson(json.placement);
            this.location.fromJson(json.location);
            this.originalOpacity = json.originalOpacity;
            this.originalFill = json.originalFill;
            this.originalFillOpacity = json.originalFillOpacity;
            this.originalStroke = json.originalStroke;
            this.originalStrokeWidth = json.originalStrokeWidth;
            this.selectedFill = json.selectedFill;
            this.selectedFillOpacity = json.selectedFillOpacity;
            this.selectedStroke = json.selectedStroke;
            this.selectedOpacity = json.selectedOpacity;
            this.disabledFill = json.disabledFill;
            this.disabledFillOpacity = json.disabledFillOpacity;
            this.disabledStroke = json.disabledStroke;
            this.disabledOpacity = json.disabledOpacity;
            this.hoverOpacity = json.hoverOpacity;
            this.hoverFillOpacity = json.hoverFillOpacity;
        }

        /**
         * Alias for hasRaphael()
         * @return {boolean} [description]
         */
        public hasGraphics(): boolean {
            return this.hasRaphael();
        }
        public hasRaphael(): boolean {
            return this.raphael != null && this.raphael != undefined;
        }
        public hasSet(): boolean {
            return Common.Utilities.isNotNullOrUndefined(this.set);
        }

        public getFill(): string {
            return this.fill;
        }
        public setFill(fill: string): Common.Models.Graphics {
            this.fill = fill;
            return this.attr({ 'fill': this.fill });
        }
        public setOriginalFill(fill: string): Common.Models.Graphics {
            this.setFill(fill);
            this.originalFill = fill;
            return this;
        }

        public getFillOpacity(): number {
            return this.fillOpacity;
        }
        public setFillOpacity(opacity: number): Common.Models.Graphics {
            if (opacity > 1 || opacity < 0)
                throw new Error('Graphics setFillOpacity(): opacity must be between 0 and 1');

            this.fillOpacity = opacity;
            return this.attr({ 'fill-opacity': this.fillOpacity });
        }
        public setOriginalFillOpacity(opacity: number): Common.Models.Graphics {
            this.setFillOpacity(opacity);
            this.originalFillOpacity = opacity;
            return this;
        }

        public getSelectedFill(): string {
            return this.selectedFill;
        }
        public setSelectedFill(fill: string): Common.Models.Graphics {
            this.selectedFill = fill;
            return this;
        }
        public getSelectedFillOpacity(): number {
            return this.selectedFillOpacity;
        }
        public setSelectedFillOpacity(opacity: number): Common.Models.Graphics {
            this.selectedFillOpacity = opacity;
            return this;
        }

        public getStroke(): string {
            return this.stroke;
        }
        public setStroke(stroke: string): Common.Models.Graphics {
            this.stroke = stroke;
            return this.attr({ 'stroke': this.stroke });
        }
        public setOriginalStroke(stroke: string): Common.Models.Graphics {
            this.setStroke(stroke);
            this.originalStroke = stroke;
            return this;
        }
        public setSelectedStroke(stroke: string): Common.Models.Graphics {
            this.setStroke(stroke);
            this.selectedStroke = stroke;
            return this;
        }
        public getStrokeWidth(): number {
            return this.strokeWidth;
        }
        public setStrokeWidth(width: number): Common.Models.Graphics {
            this.strokeWidth = width;
            return this.attr({ 'stroke-width': this.strokeWidth });
        }
        public setOriginalStrokeWidth(width: number): Common.Models.Graphics {
            this.setStrokeWidth(width);
            this.originalStrokeWidth = width;
            return this;
        }
        public setHoverOpacity(opacity: number): Common.Models.Graphics {
            if (opacity < 0 || opacity > 1)
                throw new Error('Graphics setHoverOpacity(): opacity must be between 0 and 1, inclusive');

            this.hoverOpacity = opacity;
            return this;
        }
        public setHoverFillOpacity(opacity: number): Common.Models.Graphics {
            if (opacity < 0 || opacity > 1)
                throw new Error('Graphics setHoverFillOpacity(): opacity must be between 0 and 1, inclusive');

            this.hoverFillOpacity = opacity;
            return this;
        }
        public setHeight(height: number): Common.Models.Graphics {
            this.dimensions.setHeight(height);
            return this.attr({ 'height': height });
        }

        /**
         * Gets the current opacity
         * @return {number} [description]
         */
        public getOpacity(): number {
            return this.opacity;
        }
        public setOpacity(opacity: number): Common.Models.Graphics {
            if (opacity > 1 || opacity < 0)
                throw new Error('Graphics setOpacity(): opacity must be between 0 and 1');

            let self = this;
            this.opacity = opacity;
            return this.attr({ 'opacity': opacity });
        }
        public setOriginalOpacity(opacity: number): Common.Models.Graphics {
            this.setOpacity(opacity);
            this.originalOpacity = opacity;
            return this;
        }

        /**
         * Toggles the opacity for show/hide effect
         */
        public toggleOpacity() {
            this.setOpacity(
                this.opacity == this.originalOpacity ?
                    this.hoverOpacity : this.originalOpacity
            );
            this.setFillOpacity(
                this.fillOpacity == this.originalFillOpacity ?
                    this.hoverFillOpacity : this.originalFillOpacity
            );
        }

        public select(): void {
            this.fill = this.selectedFill;
            this.stroke = this.selectedStroke;
            this.opacity = this.selectedOpacity;
            this.fillOpacity = this.selectedFillOpacity;

            let self = this;
            this.attr({
                'fill': self.fill,
                'fill-opacity': self.fillOpacity,
                'stroke': self.stroke,
                'opacity': self.opacity
            });
        }
        /**
         * Generic deselection method
         */
        public deselect(): void {
            this.fill = this.originalFill;
            this.stroke = this.originalStroke;
            this.opacity = this.originalOpacity;
            this.fillOpacity = this.originalFillOpacity;

            let self = this;
            this.attr({
                'fill': self.fill,
                'fill-opacity': self.fillOpacity,
                'stroke': self.stroke,
                'opacity': self.opacity
            });
        }
        /**
         * Generic disable method
         */
        public disable(): void {
            this.fill = this.disabledFill;
            this.stroke = this.disabledStroke;
            this.opacity = this.disabledOpacity;
            this.fillOpacity = this.disabledFillOpacity;

            let self = this;
            this.attr({
                'fill': self.fill,
                'fill-opacity': self.fillOpacity,
                'stroke': self.stroke,
                'opacity': self.opacity
            });
        }
        /**
         * Generic enable method
         */
        public enable(): void {
            this.fill = this.originalFill;
            this.stroke = this.originalStroke;
            this.opacity = this.originalOpacity;
            this.fillOpacity = this.originalFillOpacity;

            let self = this;
            this.attr({
                'fill': self.fill,
                'fill-opacity': self.fillOpacity,
                'stroke': self.stroke,
                'opacity': self.opacity
            });
        }

        public setContainment(left: number, right: number, top: number, bottom: number): void {
            this.containment.left = left;
            this.containment.right = right;
            this.containment.top = top;
            this.containment.bottom = bottom;
        }

        public getCoordinates(): Common.Models.Coordinates {
            return this.placement.coordinates;
        }

        /**
         * Returns whether the given difference in absolute x/y location
         * from the current absolute location is within the graphic's
         * containment area.
         * 
         * @param  {number}  dx The potential move-to ax location
         * @param  {number}  dy The potential move-to ay location
         * @return {boolean}    true if the location to move to is within
         *                           the containment area
         */
        public canMoveByDelta(dx: number, dy: number): boolean {
            return this.canMoveByDeltaX(dx) && this.canMoveByDeltaY(dy);
        }

        public canMoveByDeltaX(dx: number): boolean {
            return this.containment.isContainedX(dx + this.dimensions.offset.x);
        }

        public canMoveByDeltaY(dy: number): boolean {
            return this.containment.isContainedY(dy + this.dimensions.offset.y);
        }

        /**
         * [moveByDelta description]
         * @param {number} dx [description]
         * @param {number} dy [description]
         */
        public moveByDelta(dx: number, dy: number) {

            // Update graphical location
            if (Common.Utilities.isNotNullOrUndefined(this.location)) {
                this.location.moveByDelta(dx, dy);

                // Update placement when dropping
                let coords = this.grid.getCoordinatesFromAbsolute(
                    this.location.ax,
                    this.location.ay
                );

                if (Common.Utilities.isNotNullOrUndefined(this.placement)) {
                    this.placement.updateFromCoordinates(coords.x, coords.y);
                }

                // Transform (move to updateAbsolute/Coordinates methods?)
                this.transform(this.location.dx, this.location.dy);
            }
        }

        public moveByDeltaX(dx: number): void {
            if (this.canMoveByDeltaX(dx)) {
                this.moveByDelta(dx, 0);
            }
        }

        public moveByDeltaY(dy: number): void {
            if (this.canMoveByDeltaY(dy)) {
                this.moveByDelta(0, dy);
            }
        }

        public hasLocation(): boolean {
            return Common.Utilities.isNotNullOrUndefined(this.location);
        }
        public hasPlacement(): boolean {
            return Common.Utilities.isNotNullOrUndefined(this.placement);
        }

        public setOffsetXY(x: number, y: number): void {
            this.dimensions.setOffsetXY(x, y);
        }

        public initializePlacement(placement: Common.Models.Placement): void {
            if (Common.Utilities.isNullOrUndefined(placement))
                throw new Error('Graphics initializePlacement(): placement is null or undefined');

            if (Common.Utilities.isNullOrUndefined(this.placement)) {
                this.placement = placement;
            } else {
                this.placement.update(placement);
            }

            // ensure there is a grid established for the placement object
            if (Common.Utilities.isNullOrUndefined(this.placement.grid))
                this.placement.grid = this.grid;

            let absCoords = this.grid.getAbsoluteFromCoordinates(this.placement.coordinates.x, this.placement.coordinates.y);
            this.location.updateFromAbsolute(
                absCoords.x + this.dimensions.offset.x, 
                absCoords.y + this.dimensions.offset.y
            );
            this.refresh();
        }

        public updatePlacement(): void {
            this.placement.refresh();
            this.updateFromCoordinates(
                this.placement.coordinates.x, 
                this.placement.coordinates.y
            );
        }

        public updateFromAbsolute(ax: number, ay: number): void {
            this.placement.updateFromAbsolute(ax, ay);
            this.location.updateFromAbsolute(ax, ay);
            this.refresh();
        }

        public updateFromRelative(rx: number, ry: number, relativeElement?: Common.Interfaces.IFieldElement) {
            this.placement.updateFromRelative(rx, ry, relativeElement);
            let absCoords = this.grid.getAbsoluteFromCoordinates(this.placement.coordinates.x, this.placement.coordinates.y);
            this.location.updateFromAbsolute(absCoords.x + this.dimensions.offset.x, absCoords.y + this.dimensions.offset.y);
            this.refresh();
        }

        public updateFromCoordinates(x: number, y: number) {
            this.placement.updateFromCoordinates(x, y);
            let absCoords = this.grid.getAbsoluteFromCoordinates(this.placement.coordinates.x, this.placement.coordinates.y);
            this.location.updateFromAbsolute(absCoords.x, absCoords.y);
            this.refresh();
        }

        /**
         *
         * DRAWING METHODS
         * 
         */
        public path(path: string): Common.Models.Graphics {
            this.remove();
            this.raphael = this.canvas.drawing.path(path);
            this.refresh();
            return this;
        }

        public rect(): Common.Models.Graphics {
            this.remove();
            this.raphael = this.canvas.drawing.rect(
                this.placement.coordinates.x,
                this.placement.coordinates.y,
                this.dimensions.getWidth(),
                this.dimensions.getHeight(),
                false,
                this.dimensions.getOffsetX(),
                this.dimensions.getOffsetY()
            );
            this.refresh();
            return this;
        }

        public rhombus(): Common.Models.Graphics {
            this.remove();
            this.dimensions.rotation = -45;
            this.rect();
            return this;
        }

        public ellipse(): Common.Models.Graphics {
            this.remove();
            this.raphael = this.canvas.drawing.ellipse(
                this.placement.coordinates.x,
                this.placement.coordinates.y,
                this.dimensions.getWidth(),
                this.dimensions.getHeight(),
                false,
                this.dimensions.getOffsetX(),
                this.dimensions.getOffsetY()
            );
            this.refresh();
            return this;
        }

        public circle(): Common.Models.Graphics {
            this.remove();
            this.raphael = this.canvas.drawing.circle(
                this.placement.coordinates.x,
                this.placement.coordinates.y,
                this.dimensions.getRadius(),
                false,
                this.dimensions.getOffsetX(),
                this.dimensions.getOffsetY()
            );
            this.refresh();
            return this;
        }

        public triangle(): Common.Models.Graphics {
            this.remove();
            this.raphael = this.canvas.drawing.triangle(
                this.placement.coordinates.x,
                this.placement.coordinates.y,
                this.dimensions.getHeight(),
                false,
                this.dimensions.getOffsetX(),
                this.dimensions.getOffsetY()
            );
            this.refresh();
            return this;
        }

        public text(text: string): Common.Models.Graphics {
            this.remove();
            this.raphael = this.canvas.drawing.text(
                this.placement.coordinates.x,
                this.placement.coordinates.y,
                text,
                false,
                this.dimensions.getOffsetX(),
                this.dimensions.getOffsetY()
            );
            return this;
        }

        public refresh(): void {
            if (!this.hasRaphael())
                return;

            let attrs = {
                x: this.location.ax,
                y: this.location.ay,
            };

            if (this.getType() == 'circle') {
                attrs['cx'] = this.location.ax;
                attrs['cy'] = this.location.ay;
            }

            if (this.getType() != 'text') {
                attrs['fill'] = this.fill;
                attrs['fill-opacity'] = this.fillOpacity;
                attrs['opacity'] = this.opacity;
                attrs['stroke'] = this.stroke;
                attrs['stroke-width'] = this.strokeWidth;
            }

            this.attr(attrs);
        }

        public toFront(): Common.Models.Graphics {
            if (!this.hasRaphael())
                return this;

            this.raphael.toFront();

            return this;
        }

        public toBack(): Common.Models.Graphics {
            if (!this.hasRaphael())
                return this;

            this.raphael.toBack();

            return this;
        }

        public attr(attrs: any): Common.Models.Graphics {
            if (!this.hasRaphael())
                return;

            return this.raphael.attr(attrs);
        }

        public attrKeyValue(key: string, value: string): Common.Models.Graphics {
            if (!this.hasRaphael())
                return;

            return this.raphael.attr(key, value);
        }

        public setAttribute(attribute: string, value: string): void {
            if (!this.hasRaphael())
                return;

            this.raphael.node.setAttribute(attribute, value);
        }

        public getBBox(isWithoutTransforms?: boolean)
        : {x: number, y: number, width: number, height: number} 
        {
            if (!this.hasRaphael())
                return;

            return this.raphael.getBBox(isWithoutTransforms === true);
        }

        public transform(ax: number, ay: number) {
            if (!this.hasRaphael())
                return;

            this.raphael.transform(['t', ax, ', ', ay, ' r', this.dimensions.rotation].join(''));
        }

        public resetTransform(): void {
            if (!this.hasRaphael())
                return;

            this.raphael.transform('t 0, 0 r', this.dimensions.rotation);
        }

        public rotate(degrees: number): void {
            if (!this.hasRaphael())
                return;

            this.dimensions.rotation = degrees;
            this.raphael.rotate(degrees);
        }

        public remove() {
            if (!this.hasRaphael())
                return;

            if(this.hasSet()) {
                this.set.empty();
            }

            this.raphael && this.raphael[0] && this.raphael[0].remove();
            this.raphael = null;
        }

        public show() {
            if (!this.hasRaphael())
                return;

            this.raphael.show();

            if (this.hasSet())
                this.set.show();
        }

        public hide() {
            if (!this.hasRaphael())
                return;

            this.raphael.hide();

            if (this.hasSet())
                this.set.hide();
        }

        public glow() {
            if (!this.hasRaphael())
                return;

            this.raphael.glow();
        }

        public getType(): any {
            if (!this.hasRaphael())
                return;

            return this.raphael.type;
        }

        /**
         * Handles drawing of graphical element
         * @param  {any[]} ...args [description]
         * @return {any}           [description]
         */
        public ondraw(callback: Function): any {
            this.drawingHandler.ondraw(callback);
        }
        public draw(): void {
            this.drawingHandler.draw();
        }

        /**
         * Hover in/out handler registration method;
         * handles generic opacity toggling for all field elements.
         * 
         * @param {any} hoverIn  [description]
         * @param {any} hoverOut [description]
         * @param {any} context  [description]
         */
        public onhover(hoverIn: any, hoverOut: any, context: Common.Interfaces.IActionable): void {
            if (!this.hasRaphael())
                return;

            let self = this;
            this.raphael.hover(
                function(e: any) {
                    hoverIn.call(context, e);
                },
                function(e: any) {
                    hoverOut.call(context, e);
                }
            );
        }
        public hoverIn(e: any) {
            if (!this.hasRaphael())
                return;

            // Generic hover in functionality
            console.log('graphics hoverIn');
            this.toggleOpacity();
        }
        public hoverOut(e: any) {
            if (!this.hasRaphael())
                return;

            // Generic hover out functionality
            console.log('graphics hoverOut');
            this.toggleOpacity();
        }

        /**
         * Click events
         * @param {any} fn      [description]
         * @param {any} context [description]
         */
        public onclick(fn: any, context: Common.Interfaces.IActionable): void {
            if (!this.hasRaphael())
                return;
            
            //console.log('fieldElement click');
            this.raphael.click(function(e: any) {
                fn.call(context, e);
            });
        }

        public click(e: any): void {}

        public oncontextmenu(fn: any, context: Common.Interfaces.IActionable): void {
            if (!this.hasRaphael())
                return;

            this.raphael.mousedown(function(e: any) {
                if (e.which == Common.Input.Which.RightClick) {
                    fn.call(context, e);
                }
            });
        }

        public contextmenu(e: any): void {}

        /**
         * Mouse down event handler registration method
         * @param {any}                             fn      [description]
         * @param {Common.Interfaces.IActionable} context [description]
         */
        public onmousedown(fn: any, context: Common.Interfaces.IActionable): void {
            if (!this.hasRaphael())
                return;

            this.raphael.mousedown(function(e: any) {
                fn.call(context, e);
            })
        }
        /**
         * Mouse up event handler registration method
         * @param {any}                             fn      [description]
         * @param {Common.Interfaces.IActionable} context [description]
         */
        public onmouseup(fn: any, context: Common.Interfaces.IActionable): void {
            if (!this.hasRaphael())
                return;
            
            this.raphael.mouseup(function(e: any) {
                fn.call(context, e);
            })
        }
        /**
         * Default mousedown handler to be called if no other handlers are 
         * registered with onmousedown
         * @param {any}                             e       [description]
         * @param {Common.Interfaces.IActionable} context [description]
         */
        public mousedown(e: any): void {
            if (!this.hasRaphael())
                return;
        }

        /**
         * Mouse move event handler registration method; attaches listeners
         * to be fired when the cursor moves over an element (such as for cursor tracking)
         * @param {any}                             fn      [description]
         * @param {Common.Interfaces.IActionable} context [description]
         */
        public onmousemove(fn: any, context: Common.Interfaces.IActionable): void {
            if (!this.hasRaphael())
                return;
            
            this.raphael.mousemove(function(e: any) {
                fn.call(context, e);
            })
        }
        /**
         * Default mouse move handler to be called if no other handlers are
         * registered with onmousedown
         * @param {any}                             e       [description]
         * @param {Common.Interfaces.IActionable} context [description]
         */
        public mousemove(e: any): void {
            if (!this.hasRaphael())
                return;
        }

        public ondrag(
            dragMove: Function,
            dragStart: Function,
            dragEnd: Function,
            context: Common.Interfaces.IActionable
        ): void {
            if (!this.hasRaphael())
                return;

            this.raphael.drag(dragMove, dragStart, dragEnd, context, context, context);
        }

        public flip(rotate?: boolean): void {       
            // update placemement
            this.placement.flip();

            this.updateFromRelative(this.placement.relative.rx, this.placement.relative.ry, this.placement.relativeElement);

            if (this.hasRaphael() && rotate === true) {
                // rotate element
                this.rotate(180);

                // need to reset the transform because the rotation
                // causes unresolved transforms that screw up the placement
                // (thanks, raphael)
                this.resetTransform();
                this.cleanTransform();
            }   
        }

        public drop(): void {
            if (this.location.hasChanged())
                this.setModified(true);

            let snapX = this.grid.snapPixel(this.location.ax);
            let snapY = this.grid.snapPixel(this.location.ay);

            // Apply snap on drop
            this.updateFromAbsolute(
                this.snapping ? snapX : this.location.ax + (snapX - this.location.ax),
                this.snapping ? snapY : this.location.ay + (snapY - this.location.ay)
            );

            if (!this.hasRaphael())
                return;

            this.resetTransform();
            this.cleanTransform();
        }

        // TRIANGLE NOTE:
        // Special case for triangle. Since the triangle is actually a `path` element,
        // the transform functionality doesn't work the same. We have to create a new
        // temporary triangle where the updated triangle's positon should be and then
        // reset the actual raphael path with the temp triangle's new coordinates.
        // For some reason, transform(0,0) doesn't work the same on a path.
        // 
        // ELLIPSE NOTE:
        // A similar issue appears to occur with an ellipse; the ellipse does not
        // respond correctly when resetting the transform to 0,0. Instead,
        // simply calling the ellipse function should just re-create a new ellipse
        // in place of the old.
        private cleanTransform(): void {
            if (this.raphael.data('element-type') == 'triangle') {
                let tempTriangle = this.canvas.drawing.triangle(
                    this.placement.coordinates.x,
                    this.placement.coordinates.y,
                    this.dimensions.getHeight(),
                    false,
                    this.dimensions.getOffsetX(),
                    this.dimensions.getOffsetY()
                );
                let pathStr = tempTriangle.attr('path').toString();
                this.raphael.attr({ 'path': pathStr });
                tempTriangle.remove();
            } else if(this.raphael.type == 'ellipse') {
                // re-draw the ellipse with the updated coordinates
                this.ellipse();
            }
        }
	}
}