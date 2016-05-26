/// <reference path='./models.ts' />

module Common.Models {

	export class ActionableCollection<T extends Common.Models.Actionable>
	extends Common.Models.Collection<T>
	implements Common.Interfaces.IActionableCollection {

		constructor() {
			super();
		}

		public toJson(): any {
			return super.toJson();
		}

		public fromJson(json: any): void {
			super.fromJson(json);
		}

		public deselectAll(): void {
            this.forEach(function(element: Common.Interfaces.IActionable, index: number) {
                element.deselect();
            });
        }

        public selectAll(): void {
            this.forEach(function(element: Common.Interfaces.IActionable, index: number) {
                element.select();
            });
        }

        public select(element: Common.Interfaces.IActionable): void {
            if (Common.Utilities.isNullOrUndefined(element))
                return;

            this.deselectAll();
            let selectedElement = this.get(element.guid);
            if (Common.Utilities.isNotNullOrUndefined(selectedElement))
                selectedElement.select();
        }

        public deselect(element: Common.Interfaces.IActionable): void {
            if (Common.Utilities.isNullOrUndefined(element))
                return;

            let deselectedElement = this.get(element.guid);
            if (Common.Utilities.isNotNullOrUndefined(deselectedElement))
                deselectedElement.deselect();
        }

        public toggleSelect(element: Common.Interfaces.IActionable): void {
            if (Common.Utilities.isNullOrUndefined(element))
                return;

            if (element.selected)
                this.deselect(element);
            else
                this.select(element);
        }

        public hoverIn(element: Common.Interfaces.IActionable): void {
            if (Common.Utilities.isNullOrUndefined(element))
                return;

            this.hoverOutAll();
            element.hoverIn(null);
        }

        public hoverOut(element: Common.Interfaces.IActionable): void {
            if (Common.Utilities.isNullOrUndefined(element))
                return;

            element.hoverOut(null);
        }

        public hoverOutAll(): void {
            this.forEach(function(element: Common.Interfaces.IActionable, index: number) {
                element.hoverOut(null);
            });
        }

	}

}