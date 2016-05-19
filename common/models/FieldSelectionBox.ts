/// <reference path='./models.ts' />

module Common.Models {

	export class FieldSelectionBox
	extends Common.Models.FieldElement {

		constructor() {
			super();
		}

		public initialize(field: Common.Interfaces.IField, relativeElement: Common.Interfaces.IFieldElement): void {
			super.initialize(field, null);

			this.graphics.setOriginalFill('#1752FA');
			this.graphics.setOriginalStroke('#202BA2');
			this.graphics.setOriginalFillOpacity(0.3);
			this.graphics.setOriginalStrokeWidth(1);
			this.graphics.dimensions.setHeight(0);
			this.graphics.dimensions.setWidth(0);
			this.graphics.location.ax = 0;
			this.graphics.location.ay = 0;
		}

		public draw(): void {
			this.graphics.rect();
		}

	}

}