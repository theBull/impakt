/// <reference path='./models.ts' />

module Common.Drawing {

	export class Utilities {

        public grid: Common.Interfaces.IGrid;
        public canvas: Common.Interfaces.ICanvas;
        public Raphael: any;

        constructor(canvas: Common.Interfaces.ICanvas, grid: Common.Interfaces.IGrid) {
            this.grid = grid;
            this.canvas = canvas;
            this.Raphael = this.Raphael || new Raphael(
                this.canvas.container,
                this.grid.dimensions.width,
                this.grid.dimensions.height // * 2
            );
        }

        public clear() {
            this.Raphael.clear();
        }

        public setAttribute(attribute: string, value: any) {
            this.Raphael.canvas.setAttribute(attribute, value);
        }

        public setViewBox(x: number, y: number, width: number, height: number, fit: boolean) {
            this.Raphael.setViewBox(
                x,
                y,
                width,
                height,
                fit
            );
        }

        public alignToGrid(x: number, y: number, absolute: boolean) {
            let coords = new Common.Models.Coordinates(x, y);
            return !absolute ?
                this.grid.getAbsoluteFromCoordinates(coords.x, coords.y) :
                coords;
        }

        public path(path: string) {
            return this.Raphael.path(path);
        }

        public rect(
            x: number,
            y: number,
            width: number,
            height: number,
            absolute: boolean,
            offsetX?: number,
            offsetY?: number
        ) {
            let pixels = this.alignToGrid(x, y, absolute);
            offsetX = offsetX || 0;
            offsetY = offsetY || 0;
            let rect = this.Raphael.rect(
                pixels.x + offsetX, 
                pixels.y + offsetY, 
                width, 
                height
            ).attr({
                x: pixels.x + offsetX,
                y: pixels.y + offsetY
            });
            return rect;
        }

        public ellipse(x, y, width, height, absolute: boolean, offsetX?: number, offsetY?: number) {
            let pixels = this.alignToGrid(x, y, absolute);
            offsetX = offsetX || 0;
            offsetY = offsetY || 0;
            let ellipse = this.Raphael.ellipse(
                pixels.x + offsetX, 
                pixels.y + offsetY, 
                width, 
                height
            ).attr({
                cx: pixels.x + offsetX,
                cy: pixels.y + offsetY
            });
            return ellipse;
        }

        public circle(x, y, radius: number, absolute: boolean, offsetX?: number, offsetY?: number) {
            let pixels = this.alignToGrid(x, y, absolute);
            offsetX = offsetX || 0;
            offsetY = offsetY || 0;
            let circle = this.Raphael.circle(
                pixels.x + offsetX, 
                pixels.y + offsetY, 
                radius
            ).attr({
                cx: pixels.x + offsetX,
                cy: pixels.y + offsetY
            });
            return circle;
        }

        public text(x: number, y: number, text: string, absolute: boolean, offsetX?: number, offsetY?: number) {
            let pixels = this.alignToGrid(x, y, absolute);
            offsetX = offsetX || 0;
            offsetY = offsetY || 0;
            return this.Raphael.text(
                pixels.x + offsetX, 
                pixels.y + offsetY, 
                text
            ).attr({
                'x': pixels.x + offsetX,
                'y': pixels.y + offsetY
            });
        }

        public print(x: number, y: number, text: string, font, size, origin, letterSpacing, offsetX?: number, offsetY?: number) {
            let pixels = this.alignToGrid(x, y, false);
            offsetX = offsetX || 0;
            offsetY = offsetY || 0;
            return this.Raphael.print(
                pixels.x + offsetX,
                pixels.y + offsetY,
                text,
                font,
                size,
                origin,
                letterSpacing
            ).attr({
                'x': pixels.x + offsetX,
                'y': pixels.y + offsetY
            });
        }

        public getFont(family: string, weight?: string, style?: string, stretch?: string) {
            let fontWeight = weight || 100;
            let fontStyle = style || 'normal';
            let fontStretch = stretch || null;
            return this.Raphael.getFont(family, fontWeight, fontStyle, fontStretch);
        }

        public set(): any {
            return this.Raphael.set();
        }
		
        public static pathMoveTo(ax: number, ay: number): string {
            return ['M', ax, ' ', ay].join('');
        }

        public static getPathString(initialize: boolean, coords: number[]): string {
            // arguments must be passed; must be at least 4 arguments; number of arguments must be even
            if (!coords ||
                coords.length < 4 ||
                coords.length % 2 != 0)
                return undefined;
            let str = initialize ? Common.Drawing.Utilities.pathMoveTo(coords[0], coords[1]) : '';
            for (let i = 2; i < coords.length; i += 2) {
                str += Common.Drawing.Utilities.pathLineTo(coords[i], coords[i + 1]);
            }
            return str;
        }

        public static pathLineTo(x: number, y: number) {
            return ['L', x, ' ', y].join('');
        }

        public static getClosedPathString(initialize: boolean, coords: number[]): string {
            return Common.Drawing.Utilities.getPathString(initialize, coords) + ' Z';
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
        public static getCurveString(initialize: boolean, coords: number[]): string {
            // arguments must be passed; must be at least 4 arguments; 
            // number of arguments must be even
            if (!coords || coords.length % 2 != 0) {
                throw new Error([
                    'You must pass an even number',
                    ' of coords to getCurveString()'
                ].join(''));
            }

            // current (start) point
            let str = '';
            if (initialize) {
                if (coords.length != 6) {
                    throw new Error([
                        'You must pass at least 6 coords to initialize',
                        ' a curved path'
                    ].join(''));
                }
                let initialCoords = coords.splice(0, 2);
                str = Common.Drawing.Utilities.pathMoveTo(initialCoords[0], initialCoords[1]);
            }
            if (coords.length < 4) {
                throw new Error([
                    'There must be 4 coords to create a curved path:',
                    ' control -> (x, y); end -> (x, y);',
                    ' [control.x, control.y, end.x, end.y]'
                ].join(''));
            }
            for (let i = 0; i < coords.length; i += 4) {
                str += Common.Drawing.Utilities.quadraticCurveTo(coords[i], // x1 (control x)
                    coords[i + 1], // y1 (control y)
                    coords[i + 2], // x (end x)
                    coords[i + 3] // y (end y)
                );
            }
            return str;
        }

        public static quadraticCurveTo(x1: number, y1: number, x: number, y: number) {
            return ['Q', x1, ',', y1, ' ', x, ',', y].join('');
        }

        public static buildPath(from: Common.Models.Coordinates, to: Common.Models.Coordinates, width: number) {
            //console.log(from, to, width);
            let dist = this.distance(from.x, from.y, to.x, to.y);
            let theta = this.theta(from.x, from.y, to.x, to.y);
            let p1 = {
                x: (Math.cos(theta + (Math.PI / 2)) * (width / 2)) + from.x,
                y: (Math.sin(theta + (Math.PI / 2)) * (width / 2)) + from.y
            }
            let p2 = {
                x: (Math.cos(theta) * dist) + p1.x,
                y: (Math.sin(theta) * dist) + p1.y
            }
            let p3 = {
                x: (Math.cos(theta + (1.5 * Math.PI)) * width) + p2.x,
                y: (Math.sin(theta + (1.5 * Math.PI)) * width) + p2.y
            }
            let p4 = {
                x: (Math.cos(theta + Math.PI) * dist) + p3.x,
                y: (Math.sin(theta + Math.PI) * dist) + p3.y
            }
            let pathStr = Common.Drawing.Utilities.getClosedPathString(true, [p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y]);
            console.log(pathStr);
            return pathStr;
        }

        public static distance = function(x1: number, y1: number, x2: number, y2: number) {
            return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
        }

        public static theta = function(x1: number, y1: number, x2: number, y2: number) {
            let t = Math.atan2((y2 - y1), (x2 - x1));
            return t == Math.PI ? 0 : t;
        }

        public static toDegrees = function(angle: number) {
            return angle * (180 / Math.PI);
        }

        public static toRadians = function(angle: number) {
            return angle * (Math.PI / 180);
        }
	}

}