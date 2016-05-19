/// <reference path='./models.ts' />

module Playbook.Models {

	export class EditorPlayerIcon
	extends Common.Models.PlayerIcon {

		constructor(player: Common.Interfaces.IPlayer) {
			super(player);
			this.graphics.setHoverOpacity(0.6);
		}

		public draw(): void {
			super.draw();
			this.graphics.setAttribute('class', 'pointer');

			/**
			 * 
			 * Attach event handlers to the player icon, but defer the functionality and
			 * scope to the actual player object itself, not to this icon.
			 * 
			 */
			this.graphics.onclick(this.click, this);
			this.graphics.onhover(this.player.hoverIn, this.player.hoverOut, this.player);
			this.graphics.onmousedown(this.player.mousedown, this.player);
		}

		public click(e: any) {
			this.player.click(e);
		}
	}
}