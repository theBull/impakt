/// <reference path='../../common/common.ts' />
/// <reference path='./interfaces/interfaces.ts' />
var Playbook;
(function (Playbook) {
    (function (ImpaktTypes) {
        ImpaktTypes[ImpaktTypes["Unknown"] = 0] = "Unknown";
        ImpaktTypes[ImpaktTypes["PlaybookView"] = 1] = "PlaybookView";
        ImpaktTypes[ImpaktTypes["Playbook"] = 2] = "Playbook";
        ImpaktTypes[ImpaktTypes["PlayFormation"] = 3] = "PlayFormation";
        ImpaktTypes[ImpaktTypes["PlaySet"] = 4] = "PlaySet";
        ImpaktTypes[ImpaktTypes["PlayTemplate"] = 98] = "PlayTemplate";
        ImpaktTypes[ImpaktTypes["Variant"] = 99] = "Variant";
        ImpaktTypes[ImpaktTypes["Play"] = 100] = "Play";
        ImpaktTypes[ImpaktTypes["Player"] = 101] = "Player";
        ImpaktTypes[ImpaktTypes["PlayPlayer"] = 102] = "PlayPlayer";
        ImpaktTypes[ImpaktTypes["PlayPosition"] = 103] = "PlayPosition";
        ImpaktTypes[ImpaktTypes["PlayAssignment"] = 104] = "PlayAssignment";
        ImpaktTypes[ImpaktTypes["Team"] = 200] = "Team";
    })(Playbook.ImpaktTypes || (Playbook.ImpaktTypes = {}));
    var ImpaktTypes = Playbook.ImpaktTypes;
    var Editor;
    (function (Editor) {
        (function (CanvasActions) {
            CanvasActions[CanvasActions["FieldElementContextmenu"] = 0] = "FieldElementContextmenu";
            CanvasActions[CanvasActions["PlayerContextmenu"] = 1] = "PlayerContextmenu";
            CanvasActions[CanvasActions["RouteNodeContextmenu"] = 2] = "RouteNodeContextmenu";
            CanvasActions[CanvasActions["RouteTreeSelection"] = 3] = "RouteTreeSelection";
        })(Editor.CanvasActions || (Editor.CanvasActions = {}));
        var CanvasActions = Editor.CanvasActions;
        var CursorTypes = (function () {
            function CursorTypes() {
            }
            CursorTypes.pointer = 'pointer';
            CursorTypes.crosshair = 'crosshair';
            return CursorTypes;
        })();
        Editor.CursorTypes = CursorTypes;
        (function (SetTypes) {
            SetTypes[SetTypes["None"] = 0] = "None";
            SetTypes[SetTypes["Personnel"] = 1] = "Personnel";
            SetTypes[SetTypes["Assignment"] = 2] = "Assignment";
            SetTypes[SetTypes["UnitType"] = 3] = "UnitType";
        })(Editor.SetTypes || (Editor.SetTypes = {}));
        var SetTypes = Editor.SetTypes;
        (function (UnitTypes) {
            UnitTypes[UnitTypes["Offense"] = 0] = "Offense";
            UnitTypes[UnitTypes["Defense"] = 1] = "Defense";
            UnitTypes[UnitTypes["SpecialTeams"] = 2] = "SpecialTeams";
            UnitTypes[UnitTypes["Other"] = 3] = "Other";
        })(Editor.UnitTypes || (Editor.UnitTypes = {}));
        var UnitTypes = Editor.UnitTypes;
        (function (ToolModes) {
            ToolModes[ToolModes["None"] = 0] = "None";
            ToolModes[ToolModes["Select"] = 1] = "Select";
            ToolModes[ToolModes["Formation"] = 2] = "Formation";
            ToolModes[ToolModes["Assignment"] = 3] = "Assignment";
            ToolModes[ToolModes["Zoom"] = 4] = "Zoom";
        })(Editor.ToolModes || (Editor.ToolModes = {}));
        var ToolModes = Editor.ToolModes;
        (function (EditorTypes) {
            EditorTypes[EditorTypes["Formation"] = 0] = "Formation";
            EditorTypes[EditorTypes["Assignment"] = 1] = "Assignment";
            EditorTypes[EditorTypes["Play"] = 2] = "Play";
        })(Editor.EditorTypes || (Editor.EditorTypes = {}));
        var EditorTypes = Editor.EditorTypes;
        (function (PlayTypes) {
            PlayTypes[PlayTypes["Any"] = 0] = "Any";
            PlayTypes[PlayTypes["Primary"] = 1] = "Primary";
            PlayTypes[PlayTypes["Opponent"] = 2] = "Opponent";
        })(Editor.PlayTypes || (Editor.PlayTypes = {}));
        var PlayTypes = Editor.PlayTypes;
        /**
         * Allows the paper to be scaled/sized differently.
         * To specify an initial paper size, for example,
         * Paper is initialized with MaxCanvasWidth,
         * which causes the paper to determine its width based
         * on the current maximum width of its parent canvas. On the
         * contrary, the paper can be told to set its width based
         * on a given, target grid cell size. For example, if the target
         * grid width is 20px and the grid is 50 cols, the resulting
         * paper width will calculate to 1000px.
         */
        (function (PaperSizingModes) {
            PaperSizingModes[PaperSizingModes["TargetGridWidth"] = 0] = "TargetGridWidth";
            PaperSizingModes[PaperSizingModes["MaxCanvasWidth"] = 1] = "MaxCanvasWidth";
            PaperSizingModes[PaperSizingModes["PreviewWidth"] = 2] = "PreviewWidth";
        })(Editor.PaperSizingModes || (Editor.PaperSizingModes = {}));
        var PaperSizingModes = Editor.PaperSizingModes;
    })(Editor = Playbook.Editor || (Playbook.Editor = {}));
})(Playbook || (Playbook = {}));
var Playbook;
(function (Playbook) {
    var Constants;
    (function (Constants) {
        Constants.FIELD_COLS_FULL = 52;
        Constants.FIELD_ROWS_FULL = 120;
        Constants.FIELD_COLS_PREVIEW = 52;
        Constants.FIELD_ROWS_PREVIEW = 40;
        Constants.FIELD_COLOR = '#638148';
        Constants.GRID_SIZE = 15;
        Constants.GRID_BASE = 10;
        Constants.BALL_DEFAULT_PLACEMENT_X = 26;
        Constants.BALL_DEFAULT_PLACEMENT_Y = 60;
    })(Constants = Playbook.Constants || (Playbook.Constants = {}));
})(Playbook || (Playbook = {}));
var Icon;
(function (Icon) {
    var Glyphicon = (function () {
        function Glyphicon(icon) {
            this.prefix = 'glyphicon glyphicon-';
            this.icon = 'asterisk';
            this.icon = icon || this.icon;
        }
        Object.defineProperty(Glyphicon.prototype, "name", {
            get: function () {
                return this.prefix + this.icon;
            },
            set: function (n) {
                this.name = n;
            },
            enumerable: true,
            configurable: true
        });
        return Glyphicon;
    })();
    Icon.Glyphicon = Glyphicon;
})(Icon || (Icon = {}));
