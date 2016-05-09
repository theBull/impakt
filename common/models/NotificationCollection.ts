/// <reference path='./models.ts' />

module Common.Models {
	export class NotificationCollection
	extends Common.Models.ModifiableCollection<Common.Models.Notification> {
		constructor() {
			super();
		}
	}
}