/// <reference path='./models.ts' />

module Playbook.Models {

	export class EditorPlayerIcon
	extends Common.Models.PlayerIcon {

		constructor(player: Common.Interfaces.IPlayer) {
			super(player);

			this.layer.graphics.setHoverOpacity(0.6);
		}

		public draw(): void {
			super.draw();
			this.layer.graphics.setAttribute('class', 'pointer');

			/**
			 * 
			 * Attach event handlers to the player icon, but defer the functionality and
			 * scope to the actual player object itself, not to this icon.
			 * 
			 */
			this.layer.graphics.onclick(this.click, this);
			this.layer.graphics.onhover(this.player.hoverIn, this.player.hoverOut, this.player);
			this.layer.graphics.onmousedown(this.player.mousedown, this.player);
		}

		public click(e: any) {
			super.click(e);
			this.player.click(e);
		}
	}
}