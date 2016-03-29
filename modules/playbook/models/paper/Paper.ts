/// <reference path='../models.ts' />

module Playbook.Models {
    export class Paper {

        public canvas: Playbook.Interfaces.ICanvas;
        public field: Playbook.Interfaces.IField;
        public grid: Playbook.Interfaces.IGrid;
        public Raphael: any;
        public sizingMode: Playbook.Editor.PaperSizingModes;
        public x: number;
        public y: number;
        public scrollSpeed: number;
        public zoomSpeed: number;
        public showBorder: boolean;
        public viewOutline: any;

        constructor(canvas: Playbook.Interfaces.ICanvas) {
            this.canvas = this.canvas || canvas;
            // By default, paper should be scaled based on max canvas width
            this.sizingMode = this.sizingMode || Playbook.Editor.PaperSizingModes.MaxCanvasWidth;
            this.x = 0;
            this.y = 0;
            this.scrollSpeed = 0.5;
            this.zoomSpeed = 100;
            this.showBorder = this.showBorder === true;
            // Grid will help the paper determine its sizing
            // and will be the basis for drawing objects' lengths and
            // dimensions.
            this.grid = this.grid || new Playbook.Models.Grid(this, Playbook.Constants.FIELD_COLS_FULL, Playbook.Constants.FIELD_ROWS_FULL);
            // this is the actual Raphael paper
            this.Raphael = this.Raphael || new Raphael(this.canvas.container, this.grid.width, this.grid.height // * 2
            );
            // Paper methods within field are dependent on 
            // this.Raphael
            this.field = this.field || new Playbook.Models.Field(this, this.canvas.playPrimary, this.canvas.playOpponent);
        }
        public draw() {
            this.clear();
            if (this.showBorder)
                this.drawOutline();
            this.field.draw();
        }
        public updatePlay(playPrimary, playOpponent) {
            this.field.updatePlay(playPrimary, playOpponent);
        }
        public getWidth() {
            return this.grid.width;
        }
        public getHeight() {
            return this.grid.height;
        }
        public getXOffset() {
            return -Math.round((this.canvas.width - this.grid.width) / 2);
        }
        public resize() {
            this.grid.resize(this.sizingMode);
            this.setViewBox();
            this.draw();
        }
        public clear() {
            return this.Raphael.clear();
        }
        public setViewBox() {
            this.Raphael.canvas.setAttribute('width', this.grid.width);
            //this.x = this.getXOffset();
            var setting = this.Raphael.setViewBox(this.x, this.y, this.grid.width, this.grid.height, true);
        }
        public drawOutline() {
            var self = this;
            if (this.showBorder) {
                // paper view port
                if (!this.viewOutline) {
                    this.viewOutline = this.Raphael.rect(
                        this.x + 5,
                        this.y + 5,
                        this.canvas.width - 10,
                        this.canvas.height - 10
                    );
                }
                this.viewOutline.attr({
                    x: self.x + 5,
                    y: self.y + 5,
                    width: self.canvas.width - 10,
                    height: self.canvas.height - 10,
                    stroke: 'red'
                });
            }
        }
        public zoom(deltaY) {
            if (deltaY < 0)
                this.zoomOut();
            if (deltaY > 0)
                this.zoomIn();
        }
        public zoomToFit() {
            //Math.round(this.contextWidth / (this.grid.GRIDSIZE * 50));
        }
        public zoomIn(speed?: number) {
        }
        public zoomOut(speed?: number) {
        }
        public scroll(scrollToX, scrollToY) {
            this.y = scrollToY;
            return this.setViewBox();
        }
        public path(path) {
            return this.Raphael.path(path);
        }
        public bump(x, y, raphael) {
            var currX = raphael.attrs.x;
            var currY = raphael.attrs.y;
            return raphael.attr({ x: currX + x, y: currY + y });
        }
        public alignToGrid(x, y, absolute) {
            var coords = new Playbook.Models.Coordinates(x, y);
            return !absolute ?
                this.grid.getAbsoluteFromCoordinates(coords.x, coords.y) :
                coords;
        }
        public rect(x, y, width, height, absolute) {
            var pixels = this.alignToGrid(x, y, absolute);
            var rect = this.Raphael.rect(pixels.x, pixels.y, width, height).attr({
                x: pixels.x,
                y: pixels.y
            });
            return rect;
        }
        public ellipse(x, y, width, height, absolute) {
            var pixels = this.alignToGrid(x, y, absolute);
            var ellipse = this.Raphael.ellipse(pixels.x, pixels.y, width, height).attr({
                cx: pixels.x,
                cy: pixels.y
            });
            return ellipse;
        }
        public circle(x, y, radius, absolute) {
            var pixels = this.alignToGrid(x, y, absolute);
            var circle = this.Raphael.circle(pixels.x, pixels.y, radius).attr({
                cx: pixels.x,
                cy: pixels.y
            });
            return circle;
        }
        public text(x, y, text, absolute) {
            var pixels = this.alignToGrid(x, y, absolute);
            return this.Raphael.text(pixels.x, pixels.y, text);
        }
        public print(x, y, text, font, size, origin, letterSpacing) {
            var pixels = this.alignToGrid(x, y, false);
            return this.Raphael.print(pixels.x, pixels.y, text, font, size, origin, letterSpacing);
        }
        public getFont(family, weight, style, stretch) {
            return this.Raphael.getFont(family, weight, stretch);
        }
        public set() {
            return this.Raphael.set();
        }
        public remove(element) {
            element && element[0] && element[0].remove();
        }
        public pathMoveTo(ax, ay) {
            return ['M', ax, ' ', ay].join('');
        }
        public getPathString(initialize: boolean, coords: number[]) {
            // arguments must be passed; must be at least 4 arguments; number of arguments must be even
            if (!coords ||
                coords.length < 4 ||
                coords.length % 2 != 0)
                return undefined;
            var str = initialize ? this.pathMoveTo(coords[0], coords[1]) : '';
            for (var i = 2; i < coords.length; i += 2) {
                str += this.pathLineTo(coords[i], coords[i + 1]);
            }
            return str;
        }
        public pathLineTo(x, y) {
            return ['L', x, ' ', y].join('');
        }
        public getPathStringFromNodes(initialize, nodeArray) {
            var coords = [];
            for (var i = 0; i < nodeArray.length; i++) {
                var node = nodeArray[i];
                coords.push(node.placement.coordinates.ax, node.placement.coordinates.ay);
            }
            return this.getPathString(initialize, coords);
        }
        public getClosedPathString(...args: number[]) {
            return Playbook.Utilities.getPathString(...args) + ' Z';
        }
        /**
         *
         * ---
         * From the W3C SVG specification:
         * Draws a quadratic Bézier curve from the current point to (x,y)
         * using (x1,y1) as the control point.
         * Q (uppercase) indicates that absolute coordinates will follow;
         * q (lowercase) indicates that relative coordinates will follow.
         * Multiple sets of coordinates may be specified to draw a polybézier.
         * At the end of the command, the new current point becomes
         * the final (x,y) coordinate pair used in the polybézier.
         * ---
         *
         * @param  {any[]}  ...args [description]
         * @return {string}         [description]
         */
        public getCurveString(initialize, coords) {
            // arguments must be passed; must be at least 4 arguments; 
            // number of arguments must be even
            if (!coords || coords.length % 2 != 0) {
                throw new Error([
                    'You must pass an even number',
                    ' of coords to getCurveString()'
                ].join(''));
            }
            ;
            // current (start) point
            var str = '';
            if (initialize) {
                if (coords.length != 6) {
                    throw new Error([
                        'You must pass at least 6 coords to initialize',
                        ' a curved path'
                    ].join(''));
                }
                var initialCoords = coords.splice(0, 2);
                str = this.pathMoveTo(initialCoords[0], initialCoords[1]);
            }
            if (coords.length < 4) {
                throw new Error([
                    'There must be 4 coords to create a curved path:',
                    ' control -> (x, y); end -> (x, y);',
                    ' [control.x, control.y, end.x, end.y]'
                ].join(''));
            }
            for (var i = 0; i < coords.length; i += 4) {
                str += this.quadraticCurveTo(coords[i], // x1 (control x)
                    coords[i + 1], // y1 (control y)
                    coords[i + 2], // x (end x)
                    coords[i + 3] // y (end y)
                );
            }
            return str;
        }
        public quadraticCurveTo(x1, y1, x, y) {
            return ['Q', x1, ',', y1, ' ', x, ',', y].join('');
        }
        public getCurveStringFromNodes(initialize: boolean, nodeArray: Playbook.Models.RouteNode[]) {
            var coords = [];
            for (var i = 0; i < nodeArray.length; i++) {
                var node = nodeArray[i];
                coords.push(node.placement.coordinates.ax, node.placement.coordinates.ay);
            }
            return this.getCurveString(initialize, coords);
        }
        public buildPath(fromGrid, toGrid, width) {
            //console.log(from, to, width);
            var from = this.grid.getAbsoluteFromCoordinates(fromGrid.x, fromGrid.y);
            var to = this.grid.getAbsoluteFromCoordinates(toGrid.x, toGrid.y);
            var dist = this.distance(from.x, from.y, to.x, to.y);
            var theta = this.theta(from.x, from.y, to.x, to.y);
            var p1 = {
                x: (Math.cos(theta + (Math.PI / 2)) * (width / 2)) + from.x,
                y: (Math.sin(theta + (Math.PI / 2)) * (width / 2)) + from.y
            }
            var p2 = {
                x: (Math.cos(theta) * dist) + p1.x,
                y: (Math.sin(theta) * dist) + p1.y
            }
            var p3 = {
                x: (Math.cos(theta + (1.5 * Math.PI)) * width) + p2.x,
                y: (Math.sin(theta + (1.5 * Math.PI)) * width) + p2.y
            }
            var p4 = {
                x: (Math.cos(theta + Math.PI) * dist) + p3.x,
                y: (Math.sin(theta + Math.PI) * dist) + p3.y
            }
            var pathStr = this.getClosedPathString(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
            //console.log(pathStr);
            return pathStr;
        }
        public distance(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
        }
        // returns radians
        public theta(x1, y1, x2, y2) {
            return Math.atan2((y1 - y2), (x2 - x1));
        }
        public toDegrees(angle) {
            return angle * (180 / Math.PI);
        }
        public toRadians(angle) {
            return angle * (Math.PI / 180);
        }
    }
}