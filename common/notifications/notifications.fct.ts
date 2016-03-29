/// <reference path='./notifications.mdl.ts' />

impakt.common.notifications.service('__notifications', [
	function() {
		this.notifications = new Common.Models.NotificationCollection();
		this.notificationTypes = Common.Utilities.getEnumerationsAsArray(
			Common.Models.NotificationType
		);

		/**
		 * Removes ("Clears") all notifications
		 */
		this.removeAll = function() {
			this.notifications.removeAll();
		}

		/**
		 * Removes the given notification by guid
		 * @param  {string}                     guid Guid of notification to remove
		 * @return {Common.Models.Notification}      The removed notification
		 */
		this.remove = function(guid: string): Common.Models.Notification {
			return this.notifications.remove(guid);
		}
		
		/**
		 * Creates a new notification with the given message and type
		 * @param  {string}                         message The message to notify
		 * @param  {Common.Models.NotificationType} type    The type of notification to display
		 * @return {Common.Models.Notification}             The created notification
		 */
		this.notify = function(message: string, type: Common.Models.NotificationType): Common.Models.Notification {
			let notificationModel = new Common.Models.Notification(
				message, type
			);
			this.notifications.add(
				notificationModel
			);
			return notificationModel;
		}

		/**
		 * Shorthand for creating a success notification
		 * @param  {string}                     ...args Message strings to be concatenated
		 * @return {Common.Models.Notification}         New notification created
		 */
		this.success = function(...args: string[]): Common.Models.Notification {
			return this.notify(_concat(args), Common.Models.NotificationType.Success);
		}

		/**
		 * Shorthand for creating an error notification
		 * @param  {string}                     ...args Message strings to be concatenated
		 * @return {Common.Models.Notification}         New notification created
		 */
		this.error = function(...args: string[]): Common.Models.Notification {
			return this.notify(_concat(args), Common.Models.NotificationType.Error);
		}

		/**
		 * Shorthand for creating a warning notification
		 * @param  {string}                     ...args Message strings to be concatenated
		 * @return {Common.Models.Notification}         New notification created
		 */
		this.warning = function(...args: string[]): Common.Models.Notification {
			return this.notify(_concat(args), Common.Models.NotificationType.Warning);
		}

		/**
		 * Shorthand for creating an info notification
		 * @param  {string}                     ...args Message strings to be concatenated
		 * @return {Common.Models.Notification}         New notification created
		 */
		this.info = function(...args: string[]): Common.Models.Notification {
			return this.notify(_concat(args), Common.Models.NotificationType.Info);
		}

		/**
		 * Shorthand for creating a pending notification; this will display a spinner
		 * graphic to indicate that it is in progress (TO-DO).
		 * @param  {string}                     ...args Message strings to be concatenated
		 * @return {Common.Models.Notification}         New notification created
		 */
		this.pending = function(...args: string[]): Common.Models.Notification {
			return this.notify(_concat(args), Common.Models.NotificationType.Pending);
		}

		function _concat(args: string[]): string {
			return !args || !args.length || args.length <= 0 ? '' : args.join('');
		}
	}
]);