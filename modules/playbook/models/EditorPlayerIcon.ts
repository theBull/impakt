/// <reference path='./models.ts' />

module Playbook.Models {

	export class EditorPlayerIcon
	extends Common.Models.PlayerIcon {

		constructor(player: Common.Interfaces.IPlayer) {
			super(player);

			this.layer.graphics.hoverOpacity = 0.6;
			this.layer.graphics.dimensions.setRadius(this.grid.getSize() / 2);
			this.layer.graphics.dimensions.setWidth(this.layer.graphics.dimensions.getDiameter());
			this.layer.graphics.dimensions.setHeight(this.layer.graphics.dimensions.getDiameter());
		}

		public draw(): void {
			super.draw();
			this.layer.graphics.setAttribute('class', 'pointer');

			// Attach event handlers
			this.layer.graphics.onclick(super.click, this);
			this.layer.graphics.onhover(super.hoverIn, super.hoverOut, this);
			this.layer.graphics.onmousedown(super.mousedown, this);
		}
	}
}