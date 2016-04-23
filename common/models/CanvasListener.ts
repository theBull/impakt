/// <reference path='./models.ts' />

module Common.Models {

    export class CanvasListener {
        
        public context: Common.Interfaces.ICanvas;
        public actions: any;

        constructor(context: Common.Interfaces.ICanvas) {
            this.context = context;
            this.actions = {};
        }
        public listen(actionId: string | number, fn: Function) {
            if (!this.actions.hasOwnProperty[actionId])
                this.actions[actionId] = [];
            this.actions[actionId].push(fn);
        }
        public invoke(actionId: string | number, data: any) {
            if (!this.actions[actionId])
                return;
            for (var i = 0; i < this.actions[actionId].length; i++) {
                this.actions[actionId][i](data, this.context);
            }
        }
    }
}