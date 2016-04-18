/// <reference path='./models.ts' />

module Common.Models {

    export class CanvasListener {
        public actions: any;
        constructor(context: Common.Interfaces.ICanvas) {
            this.actions = {};
        }
        public listen(actionId: string | number, fn: Function) {
            if (!this.actions.hasOwnProperty[actionId])
                this.actions[actionId] = [];
            this.actions[actionId].push(fn);
        }
        public invoke(actionId: string | number, data: any, context: Common.Interfaces.ICanvas) {
            if (!this.actions[actionId])
                return;
            for (var i = 0; i < this.actions[actionId].length; i++) {
                this.actions[actionId][i](data, context);
            }
        }
    }
}