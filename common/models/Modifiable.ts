/// <reference path='./models.ts' />

module Common.Models {

	export class Modifiable 
	extends Common.Models.Storable
	implements Common.Interfaces.IModifiable {
		
		public callbacks: Function[];
		public modified: boolean;
		public checksum: string;
		public lastModified: number;
		public context: any;

		constructor(context: any) {
			super();
			this.context = context;
			this.callbacks = [];
			this.lastModified = null;
			this.modified = false;
		}
		public onModified(callback: Function): void {
			this.callbacks.push(callback);
		}
		public isModified(): void {
			for (let i = 0; i < this.callbacks.length; i++) {
				let callback = this.callbacks[i];
				callback(this);
			}
		}

		/**
		 * alias for generateChecksum()
		 * @return {string} the updated checksum
		 */
		public setModified(): boolean {
			let cs = this._generateChecksum();
			if(cs !== this.checksum) {
				// current checksum and stored checksum mismatch; modified
				this.modified = true;

				// track the modification date/time
				this.lastModified = Date.now();

				// trigger all callbacks listening for changes
				this.isModified();
			} else {
				this.modified = false;
			}
			this.checksum = cs;
			return this.modified;
		}

		/**
		 * Generates a new checksum from the current object
		 * @return {string} the newly generated checksum
		 */
		private _generateChecksum(): string {
			// determine current checksum
			return Common.Utilities.generateChecksum(this.context.toJson());
		}

		public toJson(): any {
			return {
				modified: this.modified,
				guid: this.guid
			};
		}
		public fromJson(json: any) {
			this.modified = json.modified;
			this.guid = json.guid;
		}
	}
}