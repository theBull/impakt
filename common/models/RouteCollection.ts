/// <reference path='./models.ts' />

module Common.Models {
    export class RouteCollection
        extends Common.Models.ModifiableCollection<Common.Interfaces.IRoute> {

        constructor() {
            super();
        }
        public toJson(): any {
            return {
                guid: this.guid,
                rotues: super.toJson()
            };
        }
        public fromJson(json: any) {
            let routes = json.routes || [];
            for (let i = 0; i < routes.length; i++) {
                let rawRoute = routes[i];
                let routeModel;
                if(rawRoute.type == Common.Enums.RouteTypes.Preview) {
                    routeModel = new Playbook.Models.PreviewRoute(null);
                } else {
                    routeModel = new Playbook.Models.EditorRoute(null);
                }
                routeModel.fromJson(rawRoute);
                this.add(routeModel);
            }
        }
    }
}