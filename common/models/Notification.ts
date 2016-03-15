/// <reference path='./models.ts' />

module Common.Models {
	export class Notification
	implements Common.Interfaces.ICollectionItem {
		public guid: string;	
		public message: string;
		public type: Common.Models.NotificationType;
		constructor(message: string, type: Common.Models.NotificationType) {
			this.guid = Common.Utilities.guid();
			this.message = message;
			this.type = type;
		}
	}

	export enum NotificationType {
		None,
		Success,
		Error,
		Warning,
		Info,
		Pending
	}
}