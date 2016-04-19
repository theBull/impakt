/// <reference path='./models.ts' />

module Common.Models {
	export class Graphics
    extends Common.Models.Modifiable
    implements Common.Interfaces.ISelectable,
    Common.Interfaces.IDrawable,
    Common.Interfaces.IHoverable {

        public guid: string;
        public paper: Common.Interfaces.IPaper;
        public grid: Common.Interfaces.IGrid;
		public raphael: any;
        public placement: Common.Models.Placement;
        public location: Common.Models.Location;
		public dimensions: Common.Models.Dimensions;
        public containment: Common.Models.Containment;
        public drawingHandler: Common.Models.DrawingHandler;
        public font: any;
        public set: Common.Models.GraphicsSet;

        /**
         * 
         * Color information
         * 
         */
		public opacity: number;
        public fill: string;
        public stroke: string;
        public strokeWidth: number;

        /**
         * 
         * Original color information to retain states during toggle/disable/select
         * 
         */
        public originalOpacity: number;
        public originalFill: string;
        public originalStroke: string;
        public originalStrokeWidth: number;

        /**
         *
         * Selection color information
         *
         */
        public selectedFill: string;
        public selectedStroke: string;
        public selectedOpacity: number;
        public disabledFill: string;
        public disabledStroke: string;
        public disabledOpacity: number;
        public hoverOpacity: number;

        /**
         * 
         * Selection information
         * 
         */
        public disabled: boolean;
        public selected: boolean;
        public selectable: boolean;
        public clickable: boolean;

        /**
         * 
         * Hoverable information
         * 
         */
        public hoverable: boolean;

        /**
         * 
         * Draggable attributes
         * 
         */
        public dragging: boolean;
        public draggable: boolean;
        public dragged: boolean;
		
		constructor(paper: Common.Interfaces.IPaper) {
            super();
            super.setContext(this);

            this.guid = Common.Utilities.guid();
            this.paper = paper;
            this.grid = paper.grid;
            this.set = new Common.Models.GraphicsSet(this);
            this.location = new Common.Models.Location(0, 0);
            this.placement = new Common.Models.Placement(0, 0);
			this.dimensions = new Common.Models.Dimensions();
            this.containment = new Common.Models.Containment(
                0,
                this.grid.getWidth(),
                0,
                this.grid.getHeight()
            );

            this.disabled = false;
            this.selected = false;
            this.clickable = true;
            this.hoverable = true;
            this.dragging = false;
            this.draggable = true;
            this.dragged = false;
            this.selectable = true;
            
            this.originalFill = 'white';
            this.originalStroke = 'black';
            this.originalOpacity = 1;
            this.originalStrokeWidth = 1;

            this.fill = this.originalFill;
            this.stroke = this.originalStroke; 
            this.opacity = this.originalOpacity;
            this.strokeWidth = this.originalStrokeWidth;
            
            this.selectedFill = 'white';
            this.selectedStroke = 'red'; 
            this.selectedOpacity = 1;
            
            this.disabledFill = '#aaaaaa';
            this.disabledStroke = '#777777'; 
            this.disabledOpacity = 0.5;

            this.hoverOpacity = 0.4;

            this.font = this.paper.drawing.getFont('Arial');
            this.drawingHandler = new Common.Models.DrawingHandler(this);
            this.set = new Common.Models.GraphicsSet(this);

		}

        public toJson(): any {
            return {
                dimensions: this.dimensions.toJson(),
                opacity: this.opacity,
                fill: this.fill,
                stroke: this.stroke,
                strokeWidth: this.strokeWidth,
                originalOpacity: this.originalOpacity,
                originalFill: this.originalFill,
                originalStroke: this.originalStroke,
                originalStrokeWidth: this.originalStrokeWidth,
                selectedFill: this.selectedFill,
                selectedStroke: this.selectedStroke,
                selectedOpacity: this.selectedOpacity,
                disabledFill: this.disabledFill,
                disabledStroke: this.disabledStroke,
                disabledOpacity: this.disabledOpacity,
                hoverOpacity: this.hoverOpacity,
                disabled: this.disabled,
                selected: this.selected,
                clickable: this.clickable,
                hoverable: this.hoverable,
                dragging: this.dragging,
                draggable: this.draggable,
                dragged: this.dragged
            }
        }

        public fromJson(json: any): any {
            if (!json)
                return;

            this.dimensions.fromJson(json.dimensions);
            this.opacity = json.opacity;
            this.fill = json.fill;
            this.stroke = json.stroke;
            this.strokeWidth = json.strokeWidth;
            this.placement.fromJson(json.placement);
            this.location.fromJson(json.location);
            this.originalOpacity = json.originalOpacity;
            this.originalFill = json.originalFill;
            this.originalStroke = json.originalStroke;
            this.originalStrokeWidth = json.originalStrokeWidth;
            this.selectedFill = json.selectedFill;
            this.selectedStroke = json.selectedStroke;
            this.selectedOpacity = json.selectedOpacity;
            this.disabledFill = json.disabledFill;
            this.disabledStroke = json.disabledStroke;
            this.disabledOpacity = json.disabledOpacity;
            this.hoverOpacity = json.hoverOpacity;
            this.disabled = json.disabled;
            this.selected = json.selected;
            this.clickable = json.clickable;
            this.hoverable = json.hoverable;
            this.dragging = json.dragging;
            this.draggable = json.draggable;
            this.dragged = json.dragged;
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
        public hasLocation(): boolean {
            return !Common.Utilities.isNullOrUndefined(this.location);
        }
        public hasPlacement(): boolean {
            return !Common.Utilities.isNullOrUndefined(this.placement);
        }
        public setPlacement(placement: Common.Models.Placement): void {
            this.placement = placement;
            this.updateFromCoordinates(
                placement.coordinates.x, 
                placement.coordinates.y
            );
        }
        public hasSet(): boolean {
            return !Common.Utilities.isNullOrUndefined(this.set);
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

        /**
         *
         * Dimension pass-through methods
         * 
         */
        public setOffsetXY(x: number, y: number): void {
            this.dimensions.setOffsetXY(x, y);
            this.updateLocation();
        }

        /**
         * Gets the current opacity
         * @return {number} [description]
         */
        public getOpacity(): number {
            return this.opacity;
        }

        /**
         * Sets the opacity to the given value
         * @param {number} value The opacity to set
         */
        public setOpacity(opacity: number): Common.Models.Graphics {
            if (opacity > 1 || opacity < 0)
                throw new Error('Graphics setOpacity(): opacity must be between 0 and 1');

            let self = this;
            this.opacity = opacity;
            return this.attr({'opacity': opacity});
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
            if (!this.disabled && !this.selected && this.hoverable) {
                this.setOpacity(
                    this.opacity == this.originalOpacity ? 
                        this.hoverOpacity : this.originalOpacity
                    );
            }
        }

        /**
         * Generic selection toggle
         */
        public toggleSelect(): void {
            if(this.disabled || !this.selectable)
                return;

            if(this.selected)
                this.deselect();
            else
                this.select();
        }
        /**
         * Generic selection method
         */
        public select(): void {
            if (this.disabled || !this.selectable)
                return;

            this.selected = true;
            this.fill = this.selectedFill;
            this.stroke = this.selectedStroke;
            this.opacity = this.selectedOpacity;
            
            let self = this;
            this.attr({
                'fill': self.fill,
                'stroke': self.stroke,
                'opacity': self.opacity
            });
        }
        /**
         * Generic deselection method
         */
        public deselect(): void {
            if (this.disabled || !this.selectable)
                return;

            this.selected = false;
            this.fill = this.originalFill;
            this.stroke = this.originalStroke;
            this.opacity = this.originalOpacity;
            
            let self = this;
            this.attr({
                'fill': self.fill,
                'stroke': self.stroke,
                'opacity': self.opacity
            });
        }
        /**
         * Generic disable method
         */
        public disable(): void {
            this.disabled = true;
            this.fill = this.disabledFill;
            this.stroke = this.disabledStroke;
            this.opacity = this.disabledOpacity;
            
            let self = this;
            this.attr({
                'fill': self.fill,
                'stroke': self.stroke,
                'opacity': self.opacity
            });
        }
        /**
         * Generic enable method
         */
        public enable(): void {
            this.disabled = false;
            this.fill = this.originalFill;
            this.stroke = this.originalStroke;
            this.opacity = this.originalOpacity;
            
            let self = this;
            this.attr({
                'fill': self.fill,
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
            if (!this.hasRaphael())
                return;

            if (!this.location)
                throw new Error('Graphics moveByDelta(): location is null or undefined');

            // Update graphical location
            this.location.moveByDelta(dx, dy);

            // Update placement when dropping
            let coords = this.grid.getCoordinatesFromAbsolute(
                this.location.ax, 
                this.location.ay
            );
            this.placement.updateFromCoordinates(coords.x, coords.y); 

            // Transform (move to updateAbsolute/Coordinates methods?)
            this.transform(this.location.dx, this.location.dy);
        }

        public moveByDeltaX(dx: number): void {
            if(this.canMoveByDeltaX(dx)) {
                this.moveByDelta(dx, 0);
            }
        }

        public moveByDeltaY(dy: number): void {
            if(this.canMoveByDeltaY(dy)) {
                this.moveByDelta(0, dy);
            }
        }

        public updatePlacement(x?: number, y?: number) {
            this.updateFromCoordinates(
                Common.Utilities.isNullOrUndefined(x) ? this.placement.coordinates.x : x, 
                Common.Utilities.isNullOrUndefined(y) ? this.placement.coordinates.y : y
            );
        }

        public updateLocation(ax?: number, ay?: number): void {
            let setAx = Common.Utilities.isNullOrUndefined(ax) ? this.location.ax : ax;
            let setAy = Common.Utilities.isNullOrUndefined(ay) ? this.location.ay : ay;

            this.updateFromAbsolute(setAx, setAy);
        }

        public updateFromAbsolute(ax: number, ay: number): void {
            // Update location
            this.location.updateFromAbsolute(
                ax, 
                ay
            );

            // convert absolute coordinates into grid coordinates & update placement
            let coords = this.grid.getCoordinatesFromAbsolute(ax, ay);
            this.placement.updateFromCoordinates(coords.x, coords.y);

            this.refresh();
        }

        public updateFromCoordinates(x: number, y: number) {
            // convert grid coordinates to absolute & update location
            let absCoords = this.grid.getAbsoluteFromCoordinates(x, y);
            this.location.updateFromAbsolute(
                absCoords.x + this.dimensions.offset.x, 
                absCoords.y + this.dimensions.offset.y
            );

            // Update graphical location
            this.placement.updateFromCoordinates(x, y);

            this.refresh();
        }

        /**
         *
         * DRAWING METHODS
         * 
         */
        public path(path: string): Common.Models.Graphics {
            this.remove();
            this.raphael = this.paper.drawing.path(path);
            return this;
        }

        public rect(): Common.Models.Graphics {            
            this.remove();
            this.raphael = this.paper.drawing.rect(
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

        public ellipse(): Common.Models.Graphics {            
            this.remove();
            this.raphael = this.paper.drawing.ellipse(
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
            this.raphael = this.paper.drawing.circle(
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

        public text(text: string): Common.Models.Graphics {
            this.remove();
            this.raphael = this.paper.drawing.text(
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
                attrs['opacity'] = this.opacity;
                attrs['stroke'] = this.stroke;
                attrs['stroke-width'] = this.strokeWidth;
            }

            this.attr(attrs);
        }

        public attr(attrs: any): Common.Models.Graphics {
            if (!this.hasRaphael())
                return;

            return this.raphael.attr(attrs);
        }

        public setAttribute(attribute: string, value: string): void {
            if (!this.hasRaphael())
                return;

            this.raphael.node.setAttribute(attribute, value);
        }

        public getBBox(isWithoutTransforms?: boolean) {
            if (!this.hasRaphael())
                return;

            this.raphael.getBBox(isWithoutTransforms === true);
        }

        public transform(ax: number, ay: number) {
            if (!this.hasRaphael())
                return;

            this.raphael.transform(['t', ax, ', ', ay].join(''));
        }

        public toFront(): void {
            this.raphael.toFront();
        }

        public toBack(): void {
            this.raphael.toBack();
        }

        public rotate(degrees: number): void {
            if (!this.hasRaphael())
                return;

            this.raphael.rotate(degrees);
        }

        public remove() {
            if (!this.hasRaphael())
                return;

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
        public onhover(hoverIn: any, hoverOut: any, context: Common.Interfaces.IFieldElement): void {
            if (!this.hasRaphael())
                return;

            let self = this;
            this.raphael.hover(
                function(e: any) {
                    hoverIn(e, context);
                },
                function(e: any) {
                    hoverOut(e, context);
                }
            )
        }
        public hoverIn(e: any, context: Common.Interfaces.IFieldElement) {
            if (!this.hasRaphael())
                return;

            // Generic hover in functionality
            console.log('graphics hoverIn');
            this.toggleOpacity();
        }
        public hoverOut(e: any, context: Common.Interfaces.IFieldElement) {
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
        public onclick(fn: any, context: Common.Interfaces.IFieldElement): void {
            if (!this.hasRaphael())
                return;
            
            //console.log('fieldElement click');
            this.raphael.click(function(e: any) {
                fn(e, context);
            });
        }
        public click(e: any, context: Common.Interfaces.IFieldElement): void {
            console.log('graphics click');
        }

        public oncontextmenu(fn: any, context: Common.Interfaces.IFieldElement): void {
            if (!this.hasRaphael())
                return;

            this.raphael.mousedown(function(e: any) {
                if (e.which == Common.Input.Which.RightClick) {
                    fn(e, context);
                }
            });
        }
        public contextmenu(e: any, context: Common.Interfaces.IFieldElement): void {
            console.log('graphics contextmenu');
        }

        /**
         * Mouse down event handler registration method
         * @param {any}                             fn      [description]
         * @param {Common.Interfaces.IFieldElement} context [description]
         */
        public onmousedown(fn: any, context: Common.Interfaces.IFieldElement): void {
            if (!this.hasRaphael())
                return;

            this.raphael.mousedown(function(e: any) {
                fn(e, context);
            })
        }
        /**
         * Mouse up event handler registration method
         * @param {any}                             fn      [description]
         * @param {Common.Interfaces.IFieldElement} context [description]
         */
        public onmouseup(fn: any, context: Common.Interfaces.IFieldElement): void {
            if (!this.hasRaphael())
                return;
            
            this.raphael.mouseup(function(e: any) {
                fn(e, context);
            })
        }
        /**
         * Default mousedown handler to be called if no other handlers are 
         * registered with onmousedown
         * @param {any}                             e       [description]
         * @param {Common.Interfaces.IFieldElement} context [description]
         */
        public mousedown(e: any, context: Common.Interfaces.IFieldElement): void {
            if (!this.hasRaphael())
                return;

            console.log('graphics mousedown');
        }

        /**
         * Mouse move event handler registration method; attaches listeners
         * to be fired when the cursor moves over an element (such as for cursor tracking)
         * @param {any}                             fn      [description]
         * @param {Common.Interfaces.IFieldElement} context [description]
         */
        public onmousemove(fn: any, context: Common.Interfaces.IFieldElement): void {
            if (!this.hasRaphael())
                return;
            
            this.raphael.mousemove(function(e: any) {
                fn(e, context);
            })
        }
        /**
         * Default mouse move handler to be called if no other handlers are
         * registered with onmousedown
         * @param {any}                             e       [description]
         * @param {Common.Interfaces.IFieldElement} context [description]
         */
        public mousemove(e: any, context: Common.Interfaces.IFieldElement): void {
            if (!this.hasRaphael())
                return;

            console.log('graphics mousemove');
        }

        public ondrag(
            dragMove: Function,
            dragStart: Function,
            dragEnd: Function,
            context: Common.Interfaces.IFieldElement
        ): void {
            if (!this.hasRaphael())
                return;

            this.raphael.drag(dragMove, dragStart, dragEnd, context, context, context);
        }

        public drop(): void {
            if (!this.hasRaphael())
                return;

            this.dragged = false;
            this.dragging = false;

            if (this.location.hasChanged())
                this.setModified(true);

            // Apply snap on drop
            this.updateLocation(
                this.grid.snapPixel(this.location.ax),
                this.grid.snapPixel(this.location.ay)
            );
            this.transform(0, 0);
        }
	}
}