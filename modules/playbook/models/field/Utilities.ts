/// <reference path='../models.ts' />

module Playbook {
	export class Utilities {
		public static getPathString(...args: any[]): string {
			// arguments must be passed; must be at least 4 arguments; number of arguments must be even
			if (!args || args.length < 4 || args.length % 2 != 0) return undefined;

			var str = 'M' + args[0] + ' ' + args[1];
			for (var i = 2; i < args.length; i += 2) {
				if (!args[i] || typeof args[i] != 'number') return undefined;

				var arg = args[i];
				str += ', L' + arg + ' ' + args[i + 1];
			}
			return str;
		}

		public static getClosedPathString(...args: any[]): string {
			return this.getPathString.apply(this, args) + ' Z';
		}

		public static buildPath(
			from: Playbook.Models.Coordinate,
			to: Playbook.Models.Coordinate, width: number) {
			//console.log(from, to, width);
			
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
			console.log(pathStr);
			return pathStr;
		}

		public static distance(x1: number, y1: number, x2: number, y2: number): number {
			return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
		}

		public static theta(x1: number, y1: number, x2: number, y2: number): number {
			let t = Math.atan2((y2 - y1), (x2 - x1));
			return t == Math.PI ? 0 : t;
		}

		public static toDegrees(angle: number): number {
			return angle * (180 / Math.PI);
		}

		public static toRadians(angle: number): number {
			return angle * (Math.PI / 180);
		}
	}
}