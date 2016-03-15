/// <reference path='./notifications.mdl.ts' />

impakt.common.notifications.service('__notifications', [
	function() {
		this.notifications = new Common.Models.NotificationCollection();
		this.notificationTypes = Common.Utilities.getEnumerationsAsArray(
			Common.Models.NotificationType
		);

		this.removeAll = function() {
			this.notifications.removeAll();
		}

		this.remove = function(guid: string) {
			this.notifications.remove(guid);
		}
		
		this.notify = function(
			message: string, type: Common.Models.NotificationType
		) {
			let notificationModel = new Common.Models.Notification(
				message, type
			);
			this.notifications.add(
				notificationModel.guid,
				notificationModel
			)
		}
		this.update = function(
			notification: Common.Models.Notification,
			message: string,
			type: Common.Models.NotificationType
		) {
			let notificationModel = this.notifications.get(notification.guid);
			notificationModel.message = message;
			notificationModel.type = type;
		}

		this.success = function(
			notification: Common.Models.Notification,
			message: string
		) {
			this.update(
				notification, 
				message, 
				Common.Models.NotificationType.Success
			);
		}
		this.error = function(
			notification: Common.Models.Notification,
			message: string
		) {
			this.update(
				notification, 
				message, 
				Common.Models.NotificationType.Error
			);
		}
		this.warning = function(
			notification: Common.Models.Notification,
			message: string
		) {
			this.update(
				notification, 
				message, 
				Common.Models.NotificationType.Warning
			);
		}
		this.info = function(
			notification: Common.Models.Notification,
			message: string
		) {
			this.update(
				notification, 
				message, 
				Common.Models.NotificationType.Info
			);
		}
		this.pending = function(
			notification: Common.Models.Notification,
			message: string
		) {
			this.update(
				notification,
				message,
				Common.Models.NotificationType.Pending
			);
		}
	}
]);