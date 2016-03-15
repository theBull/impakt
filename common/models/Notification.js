/// <reference path='./models.ts' />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Notification = (function (_super) {
            __extends(Notification, _super);
            function Notification(message, type) {
                _super.call(this);
                this.message = message;
                this.type = type;
            }
            /**
             * Updates this notification with the given message and type
             * @param  {string}                         updatedMessage New message to display
             * @param  {Common.Models.NotificationType} updatedType    New type to display as
             * @return {Common.Models.Notification}                    This updated notification
             */
            Notification.prototype.update = function (updatedMessage, updatedType) {
                this.message = updatedMessage;
                this.type = updatedType;
                return this;
            };
            /**
             * Shorthand to update this notification as successful
             * @param  {string}                     message The updated message to display
             * @return {Common.Models.Notification}         This updated success notification
             */
            Notification.prototype.success = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return this.update(this._concat(args), Common.Models.NotificationType.Success);
            };
            /**
             * Shorthand to update this notification as an error
             * @param  {string}                     message The updated error message to display
             * @return {Common.Models.Notification}         This updated error notification
             */
            Notification.prototype.error = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return this.update(this._concat(args), Common.Models.NotificationType.Error);
            };
            /**
             * Shorthand to update this notification as a warning
             * @param  {string}                     message The updated warning message to display
             * @return {Common.Models.Notification}         This updated warning notification
             */
            Notification.prototype.warning = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return this.update(this._concat(args), Common.Models.NotificationType.Warning);
            };
            /**
             * Shorthand to update this notification as an info notification
             * @param  {string}                     message The updated info message to display
             * @return {Common.Models.Notification}         This updated info notification
             */
            Notification.prototype.info = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return this.update(this._concat(args), Common.Models.NotificationType.Info);
            };
            /**
             * Shorthand to update this notification as pending
             * @param  {string}                     message The updated pending message to display
             * @return {Common.Models.Notification}         This updated pending notification
             */
            Notification.prototype.pending = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return this.update(this._concat(args), Common.Models.NotificationType.Pending);
            };
            Notification.prototype._concat = function (args) {
                return !args || !args.length || args.length <= 0 ? '' : args.join('');
            };
            return Notification;
        })(Common.Models.Storable);
        Models.Notification = Notification;
        (function (NotificationType) {
            NotificationType[NotificationType["None"] = 0] = "None";
            NotificationType[NotificationType["Success"] = 1] = "Success";
            NotificationType[NotificationType["Error"] = 2] = "Error";
            NotificationType[NotificationType["Warning"] = 3] = "Warning";
            NotificationType[NotificationType["Info"] = 4] = "Info";
            NotificationType[NotificationType["Pending"] = 5] = "Pending";
        })(Models.NotificationType || (Models.NotificationType = {}));
        var NotificationType = Models.NotificationType;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
