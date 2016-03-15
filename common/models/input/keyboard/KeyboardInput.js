var Common;
(function (Common) {
    var Input;
    (function (Input) {
        var KeyboardInput = (function () {
            function KeyboardInput() {
            }
            // TODO
            KeyboardInput.prototype.shiftPressed = function () {
            };
            KeyboardInput.prototype.ctrlPressed = function () {
            };
            KeyboardInput.prototype.altPressed = function () {
            };
            KeyboardInput.prototype.metaPressed = function () {
            };
            return KeyboardInput;
        })();
        Input.KeyboardInput = KeyboardInput;
    })(Input = Common.Input || (Common.Input = {}));
})(Common || (Common = {}));
