/// <reference path='./models.ts' />

module Playbook.Models {
    
	export class PreviewRouteAction
	extends Common.Models.RouteAction
    implements Common.Interfaces.IRouteAction {

		constructor(action: Common.Enums.RouteNodeActions) {
			super(action);
		}

		public initialize(field: Common.Interfaces.IField, relativeElement: Common.Interfaces.IFieldElement): void {
			super.initialize(field, relativeElement);
		}

        public draw(): void {
            // preview route action is not visible
        }
	}
}