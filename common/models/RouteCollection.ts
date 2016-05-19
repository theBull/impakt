/// <reference path='./models.ts' />

module Common.Models {
    export class RouteCollection
        extends Common.Models.Collection<Common.Interfaces.IRoute> {

        constructor() {
            super();
        }
        public toJson(): any {
            return super.toJson();
        }
        public fromJson(routes: any[]) {
            return;
        }
    }
}