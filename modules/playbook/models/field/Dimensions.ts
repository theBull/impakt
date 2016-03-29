/// <reference path='../models.ts' />

module Playbook.Models {

    export class Dimensions {
        public width: number;
        public height: number;
        constructor(width: number, height: number) {
            this.width = width || 0;
            this.height = height || 0;
        }
        public setWidth(width: number): number {
            return this.setDimensions(width, this.height).width;
        };
        public setHeight(height: number): number {
            return this.setDimensions(this.width, height).height;
        };
        public setDimensions(width: number, height: number): Playbook.Models.Dimensions {
            if (width <= 0) {
                throw new Error('Width cannot be negative');
            }
            if (height <= 0) {
                throw new Error('Height cannot be negative');
            }
            this.width = width;
            this.height = height;
            return this;
        };
        public getWidth(): number {
            return this.width;
        };
        public getHeight(): number {
            return this.height;
        };
    }
}
