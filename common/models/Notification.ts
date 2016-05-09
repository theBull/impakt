/// <reference path='./models.ts' />

module Common.Models {
	export class Notification
	extends Common.Models.Modifiable {
		
		public message: string;
		public type: Common.Models.NotificationType;
		
		constructor(message: string, type: Common.Models.NotificationType) {
			super();
			super.setContext(this);
			
			this.message = message;
			this.type = type;
		}

		/**
		 * Updates this notification with the given message and type
		 * @param  {string}                         updatedMessage New message to display
		 * @param  {Common.Models.NotificationType} updatedType    New type to display as
		 * @return {Common.Models.Notification}                    This updated notification
		 */
		public update(updatedMessage: string, updatedType: Common.Models.NotificationType): Common.Models.Notification {
			this.message = updatedMessage;
			this.type = updatedType;

			return this;
		}

		/**
		 * Shorthand to update this notification as successful
		 * @param  {string}                     message The updated message to display
		 * @return {Common.Models.Notification}         This updated success notification
		 */
		public success(...args: string[]): Common.Models.Notification {
			return this.update(this._concat(args), Common.Models.NotificationType.Success);
		}

		/**
		 * Shorthand to update this notification as an error
		 * @param  {string}                     message The updated error message to display
		 * @return {Common.Models.Notification}         This updated error notification
		 */
		public error(...args: string[]): Common.Models.Notification {
			return this.update(this._concat(args), Common.Models.NotificationType.Error);	
		}

		/**
		 * Shorthand to update this notification as a warning
		 * @param  {string}                     message The updated warning message to display
		 * @return {Common.Models.Notification}         This updated warning notification
		 */
		public warning(...args: string[]): Common.Models.Notification {
			return this.update(this._concat(args), Common.Models.NotificationType.Warning);
		}

		/**
		 * Shorthand to update this notification as an info notification
		 * @param  {string}                     message The updated info message to display
		 * @return {Common.Models.Notification}         This updated info notification
		 */
		public info(...args: string[]): Common.Models.Notification {
			return this.update(this._concat(args), Common.Models.NotificationType.Info);
		}

		/**
		 * Shorthand to update this notification as pending
		 * @param  {string}                     message The updated pending message to display
		 * @return {Common.Models.Notification}         This updated pending notification
		 */
		public pending(...args: string[]): Common.Models.Notification {
			return this.update(this._concat(args), Common.Models.NotificationType.Pending);
		}

		private _concat(args: string[]): string {
			return !args || !args.length || args.length <= 0 ? '' : args.join('');
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