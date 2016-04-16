declare module Common.Interfaces {
    interface ICollectionItem {
        guid: string;
    }
}
declare module Common.Interfaces {
    interface ILinkedListItem {
        guid: string;
    }
}
declare module Common.Interfaces {
    interface IModifiable extends Common.Interfaces.IStorable {
        callbacks: Function[];
        modified: boolean;
        checksum: string;
        original: string;
        lastModified: number;
        context: any;
        isContextSet: boolean;
        listening: boolean;
        copy(newElement: Common.Models.Modifiable, context: Common.Models.Modifiable): Common.Models.Modifiable;
        checkContextSet(): void;
        setContext(context: any): void;
        onModified(callback: Function): void;
        isModified(): void;
        setModified(isModified?: boolean): boolean;
        listen(startListening: boolean): any;
        clearListeners(): void;
        generateChecksum(): string;
    }
}
declare module Common.Interfaces {
    interface IStorable {
        guid: string;
        toJson(): any;
        fromJson(json: any): any;
    }
}
declare module Common.Interfaces {
    interface IScrollable {
        scrollSpeed: number;
        zoomSpeed: number;
    }
}
declare module Playbook.Interfaces {
    interface IListener {
        listen(actionId: Playbook.Enums.Actions, fn: any): void;
        invoke(actionId: Playbook.Enums.Actions, data: any, context: any): void;
    }
}
declare module Common.Interfaces {
    interface IPlaceable {
        grid: Common.Interfaces.IGrid;
    }
}
declare module Common.Interfaces {
    interface ISelectable extends Common.Interfaces.IStorable {
        disabled: boolean;
        clickable: boolean;
        hoverable: boolean;
        selected: boolean;
        selectedFill: string;
        selectedStroke: string;
        selectedOpacity: number;
        selectable: boolean;
        select(): void;
        deselect(): void;
        toggleSelect(): void;
        disable(): void;
        enable(): void;
        onhover(hoverIn: any, hoverOut: any, context: any): void;
        hoverIn(e: any, context?: any): void;
        hoverOut(e: any, context?: any): void;
        onclick(fn: any, context: any): void;
        click(e: any, context: any): void;
        onmousedown(fn: any, context: any): void;
        onmouseup(fn: any, context: any): void;
        mousedown(e: any, context: any): void;
        oncontextmenu(fn: any, context: any): void;
        contextmenu(e: any, context: any): void;
    }
}
declare module Common.Interfaces {
    interface IDraggable {
        dragging: boolean;
        draggable: boolean;
        dragged: boolean;
        ondrag(dragStart: Function, dragMove: Function, dragEnd: Function, context: Common.Interfaces.IDraggable): void;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
        drop(): void;
    }
}
declare module Common.Interfaces {
    interface ILayerable extends Common.Interfaces.IStorable {
        layer: Common.Models.Layer;
        hasLayer(): boolean;
    }
}
declare module Common.Interfaces {
    interface IDrawable {
        ondraw(callback: Function): void;
        draw(): void;
    }
}
declare module Common.Interfaces {
    interface IContextual extends Common.Interfaces.IStorable {
        contextmenuTemplateUrl: string;
        getContextmenuUrl(): string;
    }
}
declare module Common.Interfaces {
    interface IHoverable {
        hoverable: boolean;
        hoverIn(e: any, context?: any): void;
        hoverOut(e: any, context?: any): void;
    }
}
declare module Common.Interfaces {
    interface IPaper {
        canvas: Common.Interfaces.ICanvas;
        field: Common.Interfaces.IField;
        grid: Common.Interfaces.IGrid;
        sizingMode: Common.Enums.PaperSizingModes;
        drawing: Common.Drawing.Utilities;
        x: number;
        y: number;
        zoomSpeed: number;
        showBorder: boolean;
        viewOutline: any;
        getWidth(): number;
        getHeight(): number;
        initialize(): void;
        draw(): void;
        drawOutline(): void;
        resize(): void;
        setViewBox(): void;
        scroll(scrollToX: number, scrollToY: number): void;
        updatePlay(playPrimary: Common.Models.PlayPrimary, playOpponent: Common.Models.PlayOpponent): any;
    }
}
declare module Common.Interfaces {
    interface IGrid {
        paper: Common.Interfaces.IPaper;
        dimensions: Common.Models.Dimensions;
        size: number;
        cols: number;
        rows: number;
        divisor: number;
        snapping: boolean;
        draw(): void;
        setSnapping(snapping: boolean): void;
        toggleSnapping(): void;
        resize(sizingMode: Common.Enums.PaperSizingModes): number;
        getSize(): number;
        getWidth(): number;
        getHeight(): number;
        getCenter(): Common.Models.Coordinates;
        getAbsoluteFromCoordinate(val: number): number;
        getAbsoluteFromCoordinates(x: number, y: number): Common.Models.Coordinates;
        getCoordinatesFromAbsolute(ax: number, ay: number): Common.Models.Coordinates;
        snapPixel(pixel: number): number;
        isDivisible(value: number): boolean;
        getCursorOffset(pageX: number, pageY: number): Common.Models.Coordinates;
        getCursorPositionAbsolute(pageX: number, pageY: number): Common.Models.Coordinates;
        getCursorPositionCoordinates(pageX: number, pageY: number): Common.Models.Coordinates;
    }
}
declare module Common.Interfaces {
    interface ICanvas {
        paper: Common.Interfaces.IPaper;
        container: HTMLElement;
        $container: any;
        exportCanvas: HTMLCanvasElement;
        $exportCanvas: any;
        dimensions: Common.Models.Dimensions;
        toolMode: Playbook.Enums.ToolModes;
        unitType: Team.Enums.UnitTypes;
        editorType: Playbook.Enums.EditorTypes;
        tab: Common.Models.Tab;
        scrollable: any;
        playPrimary: Common.Models.PlayPrimary;
        playOpponent: Common.Models.PlayOpponent;
        exportToPng(): string;
    }
}
declare module Common.Interfaces {
    interface IField extends Common.Interfaces.IModifiable {
        paper: Common.Interfaces.IPaper;
        grid: Common.Interfaces.IGrid;
        playPrimary: Common.Models.PlayPrimary;
        playOpponent: Common.Models.PlayOpponent;
        ball: Common.Interfaces.IBall;
        players: Common.Models.PlayerCollection;
        ground: Common.Interfaces.IGround;
        los: Common.Interfaces.ILineOfScrimmage;
        endzone_top: Common.Interfaces.IEndzone;
        endzone_bottom: Common.Interfaces.IEndzone;
        sideline_left: Common.Interfaces.ISideline;
        sideline_right: Common.Interfaces.ISideline;
        hashmark_left: Common.Interfaces.IHashmark;
        hashmark_right: Common.Interfaces.IHashmark;
        hashmark_sideline_left: Common.Interfaces.IHashmark;
        hashmark_sideline_right: Common.Interfaces.IHashmark;
        selected: Common.Models.ModifiableCollection<Common.Interfaces.IFieldElement>;
        cursorCoordinates: Common.Models.Coordinates;
        initialize(): void;
        draw(): void;
        registerLayer(layer: Common.Models.Layer): any;
        addPlayer(placement: Common.Models.Placement, position: Team.Models.Position, assignment: Common.Models.Assignment): Common.Interfaces.IPlayer;
        updatePlay(playPrimary: Common.Models.PlayPrimary, playOpponent: Common.Models.PlayOpponent): void;
        getSelectedByLayerType(layerType: Common.Enums.LayerTypes): Common.Models.Collection<Common.Interfaces.IFieldElement>;
        toggleSelectionByLayerType(layerType: Common.Enums.LayerTypes): void;
        toggleSelection(element: Common.Interfaces.IFieldElement): void;
        setSelection(element: Common.Interfaces.IFieldElement): void;
        deselectAll(): any;
        useAssignmentTool(coords: Common.Models.Coordinates): any;
        setCursorCoordinates(pageX: number, pageY: number): void;
    }
}
declare module Common.Interfaces {
    interface IFieldElement extends Common.Interfaces.IModifiable {
        field: Common.Interfaces.IField;
        ball: Common.Interfaces.IBall;
        relativeElement: Common.Interfaces.IFieldElement;
        paper: Common.Interfaces.IPaper;
        grid: Common.Interfaces.IGrid;
        layer: Common.Models.Layer;
        contextmenuTemplateUrl: string;
        draw(): void;
        hoverIn(e: any, context: Common.Interfaces.IFieldElement): void;
        hoverOut(e: any, context: Common.Interfaces.IFieldElement): void;
        click(e: any, context: Common.Interfaces.IFieldElement): void;
        mousedown(e: any, context: Common.Interfaces.IFieldElement): void;
        mousemove(e: any, context: Common.Interfaces.IFieldElement): void;
        contextmenu(e: any, context: Common.Interfaces.IFieldElement): void;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
        drop(): void;
        getGraphics(): Common.Models.Graphics;
        getLayer(): Common.Models.Layer;
    }
}
declare module Common.Interfaces {
    interface IPlayer extends Common.Interfaces.IFieldElement {
        ball: Common.Interfaces.IBall;
        assignment: Common.Models.Assignment;
        position: Team.Models.Position;
        icon: Common.Interfaces.IPlayerIcon;
        selectionBox: Common.Interfaces.IPlayerSelectionBox;
        relativeCoordinatesLabel: Common.Interfaces.IPlayerRelativeCoordinatesLabel;
        personnelLabel: Common.Interfaces.IPlayerPersonnelLabel;
        indexLabel: any;
    }
}
declare module Common.Interfaces {
    interface IBall extends Common.Interfaces.IFieldElement {
    }
}
declare module Common.Interfaces {
    interface IGround extends Common.Interfaces.IFieldElement {
        getClickCoordinates(offsetX: number, offsetY: number): Common.Models.Coordinates;
    }
}
declare module Common.Interfaces {
    interface IEndzone extends Common.Interfaces.IFieldElement {
    }
}
declare module Common.Interfaces {
    interface ILineOfScrimmage extends Common.Interfaces.IFieldElement {
    }
}
declare module Common.Interfaces {
    interface IHashmark extends Common.Interfaces.IFieldElement {
        start: number;
        yards: number;
    }
}
declare module Common.Interfaces {
    interface ISideline extends Common.Interfaces.IFieldElement {
    }
}
declare module Common.Interfaces {
    interface IPlayerSelectionBox extends Common.Interfaces.IFieldElement {
    }
}
declare module Common.Interfaces {
    interface IPlayerIcon extends Common.Interfaces.IFieldElement {
    }
}
declare module Common.Interfaces {
    interface IPlayerRelativeCoordinatesLabel extends Common.Interfaces.IFieldElement {
        player: Common.Interfaces.IPlayer;
    }
}
declare module Common.Interfaces {
    interface IPlayerPersonnelLabel extends Common.Interfaces.IFieldElement {
    }
}
declare module Common.Interfaces {
    interface IPlayerIndexLabel extends Common.Interfaces.IFieldElement {
    }
}
declare module Common.Interfaces {
    interface IRoute extends Common.Interfaces.IModifiable {
        player: Common.Interfaces.IPlayer;
        field: Common.Interfaces.IField;
        paper: Common.Interfaces.IPaper;
        grid: Common.Interfaces.IGrid;
        nodes: Common.Models.ModifiableLinkedList<Common.Interfaces.IRouteNode>;
        routePath: Common.Interfaces.IRoutePath;
        dragInitialized: boolean;
        draw(): void;
        initializeCurve(coords: Common.Models.Coordinates, flip?: boolean): any;
        addNode(routeNode: Common.Interfaces.IRouteNode, render?: boolean): Common.Models.LinkedListNode<Common.Models.RouteNode>;
        getMixedStringFromNodes(nodeArray: Common.Models.LinkedListNode<Common.Models.RouteNode>[]): string;
        getPathStringFromNodes(initialize: boolean, nodeArray: Common.Models.LinkedListNode<Common.Models.RouteNode>[]): string;
        getCurveStringFromNodes(initialize: boolean, nodeArray: Common.Models.LinkedListNode<Common.Models.RouteNode>[]): string;
    }
}
declare module Common.Interfaces {
    interface IRouteAction extends Common.Interfaces.IFieldElement {
        routeNode: Common.Interfaces.IRouteNode;
        action: Common.Enums.RouteNodeActions;
        actionable: boolean;
    }
}
declare module Common.Interfaces {
    interface IRouteControlPath extends Common.Interfaces.IFieldElement {
    }
}
declare module Common.Interfaces {
    interface IRouteNode extends Common.Interfaces.IFieldElement {
        node: Common.Models.LinkedListNode<Common.Interfaces.IRouteNode>;
        type: Common.Enums.RouteNodeTypes;
        routeAction: Common.Interfaces.IRouteAction;
        routeControlPath: Common.Interfaces.IRouteControlPath;
        player: Common.Interfaces.IPlayer;
    }
}
declare module Common.Interfaces {
    interface IRoutePath {
        remove(): void;
    }
}
declare module Common.Interfaces {
}
declare module Common.Models {
    class Storable {
        guid: string;
        constructor();
        toJson(): any;
        fromJson(json: any): any;
    }
}
declare module Common.Models {
    class Modifiable extends Common.Models.Storable implements Common.Interfaces.IModifiable {
        callbacks: Function[];
        modified: boolean;
        checksum: string;
        original: string;
        lastModified: number;
        context: any;
        isContextSet: boolean;
        /**
         * NOTE: Allows dynamically setting whether the given Modifiable
         * is actively listening for changes. I.e., if true,
         * every modification to the object will trigger a rehash
         * of the checksum and modification info; otherwise,
         * the rehash will be ignored, effectively causing the object
         * to ignore changes to itself.
         *
         * @type {Boolean}
         */
        listening: boolean;
        constructor();
        checkContextSet(): void;
        setContext(context: any): void;
        /**
         * Allows for switching the listening mechanism on or off
         * within a method chain. listen(false) would prevent
         * any mutation from triggering a rehash.
         *
         * @param {boolean} startListening true or false
         */
        listen(startListening: boolean): Modifiable;
        clearListeners(): void;
        /**
         * Register listeners to be fired when this object is modified.
         * NOTE: the modifier will only keep the listener passed in if
         * listening == true; otherwise, listeners will be ignored.
         *
         * @param {Function} callback function to invoke when a modification
         * occurs to this object.
         */
        onModified(callback: Function): void;
        isModified(): void;
        /**
         * Determines whether there are any changes to the object,
         * or allows for explicitly committing a modification to the
         * object to trigger its modification listeners to fire.
         *
         * @param  {boolean} isModified (optional) true forces modification
         * @return {boolean}            returns whether the object is modified
         */
        setModified(forciblyModify?: boolean): boolean;
        /**
         * Generates a new checksum from the current object
         * @return {string} the newly generated checksum
         */
        generateChecksum(): string;
        copy(newElement: Common.Models.Modifiable, context: Common.Models.Modifiable): Common.Models.Modifiable;
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Common.Models {
    class Collection<T extends Common.Models.Storable> extends Common.Models.Storable {
        private _count;
        private _keys;
        constructor();
        private _getKey(data);
        private _ensureKeyType(key);
        size(): number;
        isEmpty(): boolean;
        hasElements(): boolean;
        get(key: string | number): T;
        exists(key: string | number): boolean;
        first(): T;
        getOne(): T;
        getIndex(index: number): T;
        getAll(): {
            any?: T;
        };
        /**
         * Retrieves the last element in the collection
         * @return {T} [description]
         */
        getLast(): T;
        set(key: string | number, data: T): void;
        replace(replaceKey: string | number, data: T): void;
        setAtIndex(index: number, data: T): void;
        add(data: T): void;
        addAll(...args: T[]): void;
        addAtIndex(data: T, index: number): void;
        append(collection: Common.Models.Collection<T>): void;
        forEach(iterator: Function): void;
        hasElementWhich(predicate: Function): boolean;
        filter(predicate: Function): T[];
        filterFirst(predicate: Function): T;
        remove(key: string | number): T;
        removeAll(): void;
        /**
         * Allows you to run an iterator method over each item
         * in the collection before the collection is completely
         * emptied.
         */
        removeEach(iterator: any): void;
        contains(key: string | number): boolean;
        toArray(): T[];
        toJson(): any[];
    }
}
declare module Common.Models {
    class LinkedList<T extends Common.Models.Storable> extends Common.Models.Storable {
        root: Common.Models.LinkedListNode<T>;
        last: Common.Models.LinkedListNode<T>;
        private _length;
        constructor();
        add(node: Common.Models.LinkedListNode<T>): void;
        getIndex(index: number): Common.Models.LinkedListNode<T>;
        forEach(iterator: Function): void;
        toJson(): any[];
        toDataArray<T>(): T[];
        toArray(): Common.Models.LinkedListNode<T>[];
        getLast(): Common.Models.LinkedListNode<T>;
        remove(guid: string): Common.Models.LinkedListNode<T>;
        size(): number;
        hasElements(): boolean;
    }
}
declare module Common.Models {
    class LinkedListNode<T extends Common.Models.Storable> extends Common.Models.Storable {
        data: any;
        next: LinkedListNode<T>;
        prev: LinkedListNode<T>;
        constructor(data: any, next: LinkedListNode<T>, prev?: LinkedListNode<T>);
        toJson(): any;
    }
}
declare module Common.Models {
    class ModifiableCollection<T extends Common.Models.Modifiable> {
        callbacks: Function[];
        modified: boolean;
        checksum: string;
        original: string;
        lastModified: number;
        context: any;
        isContextSet: boolean;
        listening: boolean;
        private _modifiable;
        private _collection;
        guid: string;
        constructor();
        setModified(forciblyModify?: boolean): boolean;
        onModified(callback: Function): void;
        isModified(): void;
        /**
         * When commanding the collection whether to listen,
         * apply the true/false argument to all of its contents as well
         * @param {boolean} startListening true to start listening, false to stop
         */
        listen(startListening: boolean): ModifiableCollection<T>;
        size(): number;
        isEmpty(): boolean;
        hasElements(): boolean;
        get(key: string | number): T;
        first(): T;
        getOne(): T;
        getIndex(index: number): T;
        set(key: string | number, data: T): ModifiableCollection<T>;
        replace(replaceKey: string | number, data: T): ModifiableCollection<T>;
        setAtIndex(index: number, data: T): ModifiableCollection<T>;
        add(data: T): ModifiableCollection<T>;
        addAll(...args: T[]): ModifiableCollection<T>;
        addAtIndex(data: T, index: number): ModifiableCollection<T>;
        append(collection: Common.Models.Collection<T>, clearListeners?: boolean): ModifiableCollection<T>;
        forEach(iterator: Function): void;
        hasElementWhich(predicate: Function): boolean;
        filter(predicate: Function): T[];
        filterFirst(predicate: Function): T;
        remove(key: string | number): T;
        removeAll(): void;
        empty(): void;
        /**
         * Allows you to run an iterator method over each item
         * in the collection before the collection is completely
         * emptied.
         */
        removeEach(iterator: any): void;
        contains(key: string | number): boolean;
        getAll(): {
            any?: T;
        };
        getLast(): T;
        toArray(): T[];
        toJson(): any;
        copy(newElement: Common.Models.ModifiableCollection<T>, context: Common.Models.ModifiableCollection<T>): Common.Models.ModifiableCollection<T>;
    }
}
declare module Common.Models {
    class ModifiableLinkedList<T extends Common.Models.Modifiable> extends Common.Models.LinkedList<T> {
        private _modifiable;
        constructor();
        add(node: Common.Models.LinkedListNode<T>): void;
        getIndex(index: number): Common.Models.LinkedListNode<T>;
        forEach(iterator: Function): void;
        toJson(): any[];
        toDataArray<T>(): T[];
        toArray(): Common.Models.LinkedListNode<T>[];
        getLast(): Common.Models.LinkedListNode<T>;
        remove(guid: string): Common.Models.LinkedListNode<T>;
        size(): number;
        hasElements(): boolean;
    }
}
declare module Common.Models {
    class ModifiableLinkedListNode extends Common.Models.LinkedListNode<Common.Models.Modifiable> {
        constructor(data: any, next: Common.Models.ModifiableLinkedListNode, prev?: Common.Models.ModifiableLinkedListNode);
        toJson(): any;
    }
}
declare module Common.Models {
    class AssociationArray extends Common.Models.Modifiable {
        private _array;
        constructor();
        size(): number;
        add(guid: string): void;
        addAll(guids: string[]): void;
        addAtIndex(guid: string, index: number): void;
        primary(): string;
        getAtIndex(index: number): string;
        first(guid: string): void;
        only(guid: string): void;
        empty(): void;
        remove(guid: string): string;
        /**
         * Returns whether the given guid exists
         * @param  {string}  guid the guid to check
         * @return {boolean}      true if it exists, otherwise false
         */
        exists(guid: string): boolean;
        /**
         * Returns whether the array has elements
         * @return {boolean} true or false
         */
        hasElements(): boolean;
        /**
         * Replaces guid1, if found, with guid2
         * @param  {string} guid1 guid to be replaced
         * @param  {string} guid2 guid to replace with
         */
        replace(guid1: string, guid2: string): void;
        /**
         * Iterates over each element in the array
         * @param {Function} iterator the iterator function to call per element
         */
        forEach(iterator: Function): void;
        toArray(): any;
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Common.Models {
    /**
     * Associates an element with one or more other elements
     * by guid.
     */
    class Association extends Common.Models.Modifiable {
        playbooks: Common.Models.AssociationArray;
        formations: Common.Models.AssociationArray;
        personnel: Common.Models.AssociationArray;
        assignments: Common.Models.AssociationArray;
        plays: Common.Models.AssociationArray;
        guid: string;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Common.Models {
    class Notification extends Common.Models.Storable implements Common.Interfaces.ICollectionItem {
        message: string;
        type: Common.Models.NotificationType;
        constructor(message: string, type: Common.Models.NotificationType);
        /**
         * Updates this notification with the given message and type
         * @param  {string}                         updatedMessage New message to display
         * @param  {Common.Models.NotificationType} updatedType    New type to display as
         * @return {Common.Models.Notification}                    This updated notification
         */
        update(updatedMessage: string, updatedType: Common.Models.NotificationType): Common.Models.Notification;
        /**
         * Shorthand to update this notification as successful
         * @param  {string}                     message The updated message to display
         * @return {Common.Models.Notification}         This updated success notification
         */
        success(...args: string[]): Common.Models.Notification;
        /**
         * Shorthand to update this notification as an error
         * @param  {string}                     message The updated error message to display
         * @return {Common.Models.Notification}         This updated error notification
         */
        error(...args: string[]): Common.Models.Notification;
        /**
         * Shorthand to update this notification as a warning
         * @param  {string}                     message The updated warning message to display
         * @return {Common.Models.Notification}         This updated warning notification
         */
        warning(...args: string[]): Common.Models.Notification;
        /**
         * Shorthand to update this notification as an info notification
         * @param  {string}                     message The updated info message to display
         * @return {Common.Models.Notification}         This updated info notification
         */
        info(...args: string[]): Common.Models.Notification;
        /**
         * Shorthand to update this notification as pending
         * @param  {string}                     message The updated pending message to display
         * @return {Common.Models.Notification}         This updated pending notification
         */
        pending(...args: string[]): Common.Models.Notification;
        private _concat(args);
    }
    enum NotificationType {
        None = 0,
        Success = 1,
        Error = 2,
        Warning = 3,
        Info = 4,
        Pending = 5,
    }
}
declare module Common.Models {
    class NotificationCollection extends Common.Models.Collection<Common.Models.Notification> {
        constructor();
    }
}
declare module Common.Icons {
    class Glyphicon {
        prefix: string;
        icon: string;
        name: string;
        constructor(icon?: string);
    }
}
declare module Common.Models {
    class Assignment extends Common.Models.Modifiable {
        routes: Common.Models.RouteCollection;
        positionIndex: number;
        setType: Common.Enums.SetTypes;
        constructor();
        remove(): void;
        setContext(context: any): void;
        fromJson(json: any): void;
        toJson(): {
            routes: any;
            positionIndex: number;
            guid: string;
        };
    }
}
declare module Common.Models {
    class AssignmentCollection extends Common.Models.ModifiableCollection<Common.Models.Assignment> {
        setType: Common.Enums.SetTypes;
        unitType: Team.Enums.UnitTypes;
        name: string;
        key: number;
        constructor(count?: number);
        toJson(): any;
        fromJson(json: any): any;
        getAssignmentByPositionIndex(index: number): any;
    }
}
declare module Common.Models {
    class Formation extends Common.Models.Modifiable {
        unitType: Team.Enums.UnitTypes;
        parentRK: number;
        editorType: Playbook.Enums.EditorTypes;
        name: string;
        associated: Common.Models.Association;
        placements: Common.Models.PlacementCollection;
        key: number;
        png: string;
        constructor(name?: string);
        copy(newFormation?: Common.Models.Formation): Common.Models.Formation;
        toJson(): any;
        fromJson(json: any): any;
        setDefault(ball: Common.Interfaces.IBall): void;
        isValid(): boolean;
        setPlacements(placements: Common.Models.PlacementCollection): void;
    }
}
declare module Common.Models {
    class FormationCollection extends Common.Models.ModifiableCollection<Common.Models.Formation> {
        parentRK: number;
        unitType: Team.Enums.UnitTypes;
        constructor();
        toJson(): {
            formations: any;
            unitType: Team.Enums.UnitTypes;
            guid: string;
        };
        fromJson(json: any): any;
    }
}
declare module Common.Models {
    class Play extends Common.Models.Modifiable {
        field: Common.Interfaces.IField;
        name: string;
        associated: Common.Models.Association;
        assignments: Common.Models.AssignmentCollection;
        formation: Common.Models.Formation;
        personnel: Team.Models.Personnel;
        unitType: Team.Enums.UnitTypes;
        editorType: Playbook.Enums.EditorTypes;
        png: string;
        key: number;
        constructor();
        setPlaybook(playbook: any): void;
        setFormation(formation: any): void;
        setAssignments(assignments: any): void;
        setPersonnel(personnel: any): void;
        draw(field: Common.Interfaces.IField): void;
        fromJson(json: any): any;
        toJson(): any;
        hasAssignments(): boolean;
        setDefault(field: Common.Interfaces.IField): void;
    }
}
declare module Common.Models {
    class PlayPrimary extends Common.Models.Play {
        playType: Playbook.Enums.PlayTypes;
        constructor();
    }
}
declare module Common.Models {
    class PlayOpponent extends Common.Models.Play {
        playType: Playbook.Enums.PlayTypes;
        constructor();
        draw(field: Common.Interfaces.IField): void;
    }
}
declare module Common.Models {
    class PlayCollection extends Common.Models.ModifiableCollection<Common.Models.Play> {
        constructor();
        toJson(): any;
        fromJson(plays: any[]): void;
    }
}
declare module Common.Models {
    class PlaybookModel extends Common.Models.Modifiable {
        key: number;
        name: string;
        associated: Common.Models.Association;
        unitType: Team.Enums.UnitTypes;
        constructor();
        toJson(): any;
        fromJson(json: any): any;
    }
}
declare module Common.Models {
    class PlaybookModelCollection extends Common.Models.ModifiableCollection<Common.Models.PlaybookModel> {
        constructor();
        toJson(): any;
        fromJson(json: any): any;
    }
}
declare module Common.Models {
    class Tab extends Common.Models.Storable implements Common.Interfaces.ICollectionItem {
        title: string;
        key: number;
        active: boolean;
        playPrimary: Common.Models.PlayPrimary;
        playOpponent: Common.Models.PlayOpponent;
        unitType: Team.Enums.UnitTypes;
        canvas: Common.Models.Canvas;
        private _closeCallbacks;
        constructor(playPrimary: Common.Models.PlayPrimary, playOpponent: Common.Models.PlayOpponent);
        onclose(callback: Function): void;
        close(): void;
    }
}
declare module Common.Models {
    class TabCollection extends Common.Models.Collection<Common.Models.Tab> {
        constructor();
        getByPlayGuid(guid: string): Common.Models.Tab;
    }
}
declare module Common.Models {
    class Template extends Common.Models.Storable {
        url: string;
        name: string;
        data: any;
        constructor(name: string, url: string);
    }
}
declare module Common.Models {
    class TemplateCollection extends Common.Models.Collection<Common.Models.Template> {
        name: string;
        constructor(name: string);
    }
}
declare module Common.Input {
    class KeyboardInputListener {
        shiftPressed(): void;
        ctrlPressed(): void;
        altPressed(): void;
        metaPressed(): void;
    }
    class MouseInputListener {
    }
    enum Which {
        LeftClick = 1,
        RightClick = 3,
        /**
         *
         * Uppercase (shift pressed)
         *
         */
        A = 65,
        B = 66,
        C = 67,
        D = 68,
        E = 69,
        F = 70,
        G = 71,
        H = 72,
        I = 73,
        J = 74,
        K = 75,
        L = 76,
        M = 77,
        N = 78,
        O = 79,
        P = 80,
        Q = 81,
        R = 82,
        S = 83,
        T = 84,
        U = 85,
        V = 86,
        W = 87,
        X = 88,
        Y = 89,
        Z = 90,
        /**
         *
         * Lowercase (shift key not pressed)
         *
         */
        a = 97,
        b = 98,
        c = 99,
        d = 100,
        e = 101,
        f = 102,
        g = 103,
        h = 104,
        i = 105,
        j = 106,
        k = 107,
        l = 108,
        m = 109,
        n = 110,
        o = 111,
        p = 112,
        q = 113,
        r = 114,
        s = 115,
        t = 116,
        u = 117,
        v = 118,
        w = 119,
        x = 120,
        y = 121,
        z = 122,
    }
}
declare module Playbook.Models {
    class Listener {
        actions: any;
        constructor(context: any);
        listen(actionId: string | number, fn: Function): void;
        invoke(actionId: string | number, data: any, context: any): void;
    }
}
declare module Common.Models {
    abstract class Canvas extends Common.Models.Modifiable implements Common.Interfaces.ICanvas {
        paper: Common.Interfaces.IPaper;
        playPrimary: Common.Models.PlayPrimary;
        playOpponent: Common.Models.PlayOpponent;
        $container: any;
        container: HTMLElement;
        $exportCanvas: any;
        exportCanvas: HTMLCanvasElement;
        scrollable: any;
        toolMode: Playbook.Enums.ToolModes;
        unitType: Team.Enums.UnitTypes;
        editorType: Playbook.Enums.EditorTypes;
        tab: Common.Models.Tab;
        dimensions: Common.Models.Dimensions;
        listener: Common.Models.CanvasListener;
        readyCallbacks: Function[];
        widthChangeInterval: any;
        constructor(width?: number, height?: number);
        remove(): void;
        /**
         * Converts this canvas's SVG graphics element into a data-URI
         * which can be used in an <img/> src attribute to render the image
         * as a PNG. Allows for retrieval and storage of the image as well.
         *
         * 3/9/2016: https://css-tricks.com/data-uris/
         * @return {string} [description]
         */
        exportToPng(): any;
        getSvg(): string;
        refresh(): void;
        onready(callback: any): void;
        _ready(): void;
    }
}
declare module Common.Drawing {
    class Utilities {
        grid: Common.Interfaces.IGrid;
        canvas: Common.Interfaces.ICanvas;
        Raphael: any;
        constructor(canvas: Common.Interfaces.ICanvas, grid: Common.Interfaces.IGrid);
        clear(): void;
        setAttribute(attribute: string, value: any): void;
        setViewBox(x: number, y: number, width: number, height: number, fit: boolean): void;
        alignToGrid(x: number, y: number, absolute: boolean): Models.Coordinates;
        path(path: string): any;
        rect(x: number, y: number, width: number, height: number, absolute: boolean, offsetX?: number, offsetY?: number): any;
        ellipse(x: any, y: any, width: any, height: any, absolute: boolean, offsetX?: number, offsetY?: number): any;
        circle(x: any, y: any, radius: number, absolute: boolean, offsetX?: number, offsetY?: number): any;
        text(x: number, y: number, text: string, absolute: boolean, offsetX?: number, offsetY?: number): any;
        print(x: number, y: number, text: string, font: any, size: any, origin: any, letterSpacing: any, offsetX?: number, offsetY?: number): any;
        getFont(family: string, weight?: string, style?: string, stretch?: string): any;
        set(): any;
        static pathMoveTo(ax: number, ay: number): string;
        static getPathString(initialize: boolean, coords: number[]): string;
        static pathLineTo(x: number, y: number): string;
        static getClosedPathString(initialize: boolean, coords: number[]): string;
        /**
         *
         * ---
         * From the W3C SVG specification:
         * Draws a quadratic Bézier curve from the current point to (x,y)
         * using (x1,y1) as the control point.
         * Q (uppercase) indicates that absolute coordinates will follow;
         * q (lowercase) indicates that relative coordinates will follow.
         * Multiple sets of coordinates may be specified to draw a polybézier.
         * At the end of the command, the new current point becomes
         * the final (x,y) coordinate pair used in the polybézier.
         * ---
         *
         * @param  {any[]}  ...args [description]
         * @return {string}         [description]
         */
        static getCurveString(initialize: boolean, coords: number[]): string;
        static quadraticCurveTo(x1: number, y1: number, x: number, y: number): string;
        static buildPath(from: Common.Models.Coordinates, to: Common.Models.Coordinates, width: number): string;
        static distance: (x1: number, y1: number, x2: number, y2: number) => number;
        static theta: (x1: number, y1: number, x2: number, y2: number) => number;
        static toDegrees: (angle: number) => number;
        static toRadians: (angle: number) => number;
    }
}
declare module Common.Models {
    class Layer extends Common.Models.Modifiable {
        paper: Common.Interfaces.IPaper;
        graphics: Common.Models.Graphics;
        type: Common.Enums.LayerTypes;
        zIndex: number;
        layers: Common.Models.LayerCollection;
        visible: boolean;
        constructor(paper: Common.Interfaces.IPaper, layerType: Common.Enums.LayerTypes);
        containsLayer(layer: Common.Models.Layer): boolean;
        addLayer(layer: Common.Models.Layer): void;
        removeLayer(layer: Common.Models.Layer): Common.Models.Layer;
        removeAllLayers(): void;
        show(): void;
        showLayers(): void;
        hide(): void;
        hideLayers(): void;
        remove(): void;
        removeGraphics(): void;
        moveByDelta(dx: number, dy: number): void;
        drop(): void;
        hasLayers(): boolean;
        hasGraphics(): boolean;
        hasPlacement(): boolean;
        /**
         * Draws the current layer and its nested layers (recursive)
         */
        draw(): void;
    }
}
declare module Common.Models {
    class LayerCollection extends Common.Models.ModifiableCollection<Common.Models.Layer> {
        constructor();
        dragAll(dx: number, dy: number): void;
        removeAll(): void;
        drop(): void;
        hide(): void;
    }
}
declare module Common.Models {
    class CanvasListener {
        actions: any;
        constructor(context: Common.Interfaces.ICanvas);
        listen(actionId: string | number, fn: Function): void;
        invoke(actionId: string | number, data: any, context: Common.Interfaces.ICanvas): void;
    }
}
declare module Common.Models {
    abstract class Paper {
        canvas: Common.Interfaces.ICanvas;
        grid: Common.Interfaces.IGrid;
        field: Common.Interfaces.IField;
        drawing: Common.Drawing.Utilities;
        sizingMode: Common.Enums.PaperSizingModes;
        x: number;
        y: number;
        scrollSpeed: number;
        zoomSpeed: number;
        showBorder: boolean;
        viewOutline: any;
        constructor(canvas: Common.Interfaces.ICanvas);
        getWidth(): number;
        getHeight(): number;
        getXOffset(): number;
        draw(): void;
        resize(): void;
        clear(): void;
        setViewBox(): void;
        drawOutline(): void;
        scroll(scrollToX: number, scrollToY: number): void;
    }
}
declare module Common.Models {
    class Grid implements Common.Interfaces.IGrid {
        paper: Common.Interfaces.IPaper;
        cols: number;
        rows: number;
        dimensions: Common.Models.Dimensions;
        divisor: number;
        size: number;
        dashArray: Array<string>;
        verticalStrokeOpacity: number;
        horizontalStrokeOpacity: number;
        color: string;
        strokeWidth: number;
        protected base: number;
        snapping: boolean;
        constructor(paper: Common.Interfaces.IPaper, cols: number, rows: number);
        getSize(): number;
        getWidth(): number;
        getHeight(): number;
        setSnapping(snapping: boolean): void;
        toggleSnapping(): void;
        /**
         * TODO @theBull - document this
         * @return {any} [description]
         */
        draw(): void;
        /**
         * recalculates the width and height of the grid
         * with the context width and height
         */
        resize(sizingMode: Common.Enums.PaperSizingModes): number;
        /**
         * TODO @theBull - document this
         * returns the grid value for the bottom-most grid line (horizontal)
         * @return {number} [description]
         */
        bottom(): number;
        /**
         * TODO @theBull - document this
         * returns the grid value for the right-most grid line (vertical)
         * @return {number} [description]
         */
        right(): number;
        /**
         * TODO @theBull - document this
         * @return {Playbook.Models.Coordinate} [description]
         */
        getCenter(): Common.Models.Coordinates;
        /**
         * TODO @theBull - document this
         * @return {Playbook.Models.Coordinate} [description]
         */
        getCenterInPixels(): Common.Models.Coordinates;
        getCursorOffset(offsetX: number, offsetY: number): Common.Models.Coordinates;
        getCursorPositionAbsolute(offsetX: number, offsetY: number): Common.Models.Coordinates;
        getCursorPositionCoordinates(offsetX: number, offsetY: number): Common.Models.Coordinates;
        /**
         * TODO @theBull - document this
         * @return {Playbook.Models.Coordinate} [description]
         */
        getCoordinates(): Common.Models.Coordinates;
        /**
         * TODO @theBull - document this
         * @return {Playbook.Models.Coordinate} [description]
         */
        getDimensions(): Common.Models.Dimensions;
        /**
         * TODO @theBull - document this
         * @return {number} [description]
         */
        gridProportion(): number;
        /**
         * TODO @theBull - document this
         * @param  {number} val [description]
         * @return {number}     [description]
         */
        computeGridZoom(val: number): number;
        /**
         * Calculates a single absolute pixel value from the given grid value
         * @param  {number} val the coord value to calculate
         * @return {number}     The calculated absolute pixel
         */
        getAbsoluteFromCoordinate(val: number): number;
        /**
         * Returns the absolute pixel values of the given grid coords
         * @param  {Common.Models.Coordinate} coords the grid coords to calculate
         * @return {Common.Models.Coordinate}        the absolute pixel coords
         */
        getAbsoluteFromCoordinates(x: number, y: number): Common.Models.Coordinates;
        /**
         * Calculates grid coords from the given pixel values
         * @param {Playbook.Models.Coordinate} coords coordinates in raw pixel form
         * @return {Playbook.Models.Coordinate}		the matching grid pixels as coords
         */
        getCoordinatesFromAbsolute(x: number, y: number): Common.Models.Coordinates;
        getRelativeFromAbsolute(ax: number, ay: number, relativeElement: Common.Models.FieldElement): Common.Models.RelativeCoordinates;
        /**
         * Takes the given coords and snaps them to the nearest grid coords
         *
         * @param {Playbook.Models.Coordinate} coords Coordinates to snap
         * @return {Playbook.Models.Coordinate}		The nearest snapped coordinates
         */
        snapToNearest(ax: number, ay: number): Common.Models.Coordinates;
        /**
         * Snaps the given coords to the grid
         * @param {Playbook.Models.Coordinate} coords assumed non-snapped coordinates
         * @return {Playbook.Models.Coordinate}		the snapped coordinates
         */
        snap(x: number, y: number): Common.Models.Coordinates;
        /**
         * takes a pixel value and translates it into a corresponding
         * number of grid units
         *
         * @param  {number} val value to calculate
         * @return {number}     calculated value
         */
        snapPixel(val: number): number;
        /**
         * Determines whether the given value is equally divisible
         * by the gridsize
         *
         * @param {number} val The value to calculate
         * @return {boolean}	true if divisible, otherwise false
         */
        isDivisible(val: number): boolean;
    }
}
declare module Common.Models {
    abstract class Field extends Common.Models.Modifiable {
        paper: Common.Interfaces.IPaper;
        grid: Common.Interfaces.IGrid;
        playPrimary: Common.Models.PlayPrimary;
        playOpponent: Common.Models.PlayOpponent;
        players: Common.Models.PlayerCollection;
        selected: Common.Models.ModifiableCollection<Common.Interfaces.IFieldElement>;
        layers: Common.Models.LayerCollection;
        cursorCoordinates: Common.Models.Coordinates;
        ball: Common.Interfaces.IBall;
        ground: Common.Interfaces.IGround;
        los: Common.Interfaces.ILineOfScrimmage;
        endzone_top: Common.Interfaces.IEndzone;
        endzone_bottom: Common.Interfaces.IEndzone;
        sideline_left: Common.Interfaces.ISideline;
        sideline_right: Common.Interfaces.ISideline;
        hashmark_left: Common.Interfaces.IHashmark;
        hashmark_right: Common.Interfaces.IHashmark;
        hashmark_sideline_left: Common.Interfaces.IHashmark;
        hashmark_sideline_right: Common.Interfaces.IHashmark;
        constructor(paper: Common.Interfaces.IPaper, playPrimary: Common.Models.PlayPrimary, playOpponent: Common.Models.PlayOpponent);
        abstract initialize(): void;
        /**
         *
         * ABSTRACT METHODS
         *
         */
        abstract addPlayer(placement: Common.Models.Placement, position: Team.Models.Position, assignment: Common.Models.Assignment): Common.Interfaces.IPlayer;
        abstract useAssignmentTool(coords: Common.Models.Coordinates): any;
        registerLayer(layer: Common.Models.Layer): void;
        draw(): void;
        clearPlay(): void;
        drawPlay(): void;
        updatePlay(playPrimary: any, playOpponent: any): void;
        updatePlacements(): void;
        setCursorCoordinates(offsetX: number, offsetY: number): void;
        getPlayerWithPositionIndex(index: any): Interfaces.IPlayer;
        applyPrimaryPlay(play: any): void;
        applyPrimaryFormation(formation: any): void;
        applyPrimaryAssignments(assignments: any): void;
        applyPrimaryPersonnel(personnel: any): void;
        deselectAll(): void;
        getSelectedByLayerType(layerType: Common.Enums.LayerTypes): Common.Models.Collection<Common.Interfaces.IFieldElement>;
        toggleSelectionByLayerType(layerType: Common.Enums.LayerTypes): void;
        /**
         * Sets the selected items to a single selected element; removes and deselects any
         * other currently selected elements.
         * @param {Common.Interfaces.IFieldElement} element [description]
         */
        setSelection(element: Common.Interfaces.IFieldElement): void;
        /**
         * Toggles the selection state of the given element; adds it to the
         * list of selected elements if it isn't already added; if it's already
         * selected, deselects the element and removes it from the selected
         * @param {Common.Interfaces.IFieldElement} element [description]
         */
        toggleSelection(element: Common.Interfaces.IFieldElement): void;
    }
}
declare module Common.Models {
    abstract class FieldElement extends Common.Models.Modifiable implements Common.Interfaces.IFieldElement, Common.Interfaces.ILayerable, Common.Interfaces.IContextual {
        field: Common.Interfaces.IField;
        ball: Common.Interfaces.IBall;
        canvas: Common.Interfaces.ICanvas;
        paper: Common.Interfaces.IPaper;
        grid: Common.Interfaces.IGrid;
        layer: Common.Models.Layer;
        relativeElement: Common.Interfaces.IFieldElement;
        name: string;
        /**
         *
         * contextual attributes
         *
         */
        contextmenuTemplateUrl: string;
        constructor(field: Common.Interfaces.IField, relativeElement: Common.Interfaces.IFieldElement);
        hasLayer(): boolean;
        getLayer(): Common.Models.Layer;
        hasGraphics(): boolean;
        getGraphics(): Common.Models.Graphics;
        hasPlacement(): boolean;
        getContextmenuUrl(): string;
        toggleSelect(metaKey: boolean): void;
        /**
         *
         *
         * DEFAULT METHOD
         * Each field element will inherit the following default methods.
         *
         * Because of the wide variety of field elements, it is difficult to
         * provide default event handlers that fit for every one of them.
         * Abstract or Implementing Classes that do not execute the same
         * event logic must define an override method to override the default method.
         *
         *
         */
        /**
         * Draw is abstract, as it will be different for every field element;
         * each field element must implement a draw method.
         */
        abstract draw(): void;
        hoverIn(e: any, context: Common.Interfaces.IFieldElement): void;
        hoverOut(e: any, context: Common.Interfaces.IFieldElement): void;
        click(e: any, context: Common.Interfaces.IFieldElement): void;
        mouseup(e: any, context: Common.Interfaces.IFieldElement): void;
        mousedown(e: any, context: Common.Interfaces.IFieldElement): void;
        mousemove(e: any, context: Common.Interfaces.IFieldElement): void;
        contextmenu(e: any, context: Common.Interfaces.IFieldElement): void;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
        drop(): void;
    }
}
declare module Common.Models {
    abstract class Ball extends Common.Models.FieldElement {
        offset: number;
        constructor(field: Common.Interfaces.IField);
        draw(): void;
    }
}
declare module Common.Models {
    abstract class Ground extends Common.Models.FieldElement {
        constructor(field: Common.Interfaces.IField);
        draw(): void;
        click(e: any, context: Common.Interfaces.IFieldElement): void;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
        getClickCoordinates(offsetX: number, offsetY: number): Common.Models.Coordinates;
    }
}
declare module Common.Models {
    abstract class LineOfScrimmage extends Common.Models.FieldElement {
        constructor(field: Common.Interfaces.IField);
    }
}
declare module Common.Models {
    abstract class Endzone extends Common.Models.FieldElement {
        constructor(context: Common.Interfaces.IField, offsetY: number);
        draw(): void;
    }
}
declare module Common.Models {
    abstract class Hashmark extends Common.Models.FieldElement {
        start: number;
        yards: number;
        constructor(field: Common.Interfaces.IField, x: number);
        draw(): void;
    }
}
declare module Common.Models {
    abstract class Sideline extends Common.Models.FieldElement {
        constructor(field: Common.Interfaces.IField, x: number);
        draw(): void;
    }
}
declare module Common.Models {
    abstract class Player extends Common.Models.FieldElement {
        /**
         *
         * Data structures
         *
         */
        position: Team.Models.Position;
        assignment: Common.Models.Assignment;
        /**
         *
         * Graphics layers
         *
         */
        layer: Common.Models.Layer;
        icon: Common.Interfaces.IPlayerIcon;
        selectionBox: Common.Interfaces.IPlayerSelectionBox;
        relativeCoordinatesLabel: Common.Interfaces.IPlayerRelativeCoordinatesLabel;
        personnelLabel: Common.Interfaces.IPlayerPersonnelLabel;
        indexLabel: any;
        constructor(field: Common.Interfaces.IField, placement: Common.Models.Placement, position: Team.Models.Position, assignment: Common.Models.Assignment);
        abstract draw(): void;
        getPositionRelativeToBall(): Common.Models.RelativeCoordinates;
        getCoordinatesFromAbsolute(): Common.Models.Coordinates;
        /**
         *
         * Assignment
         *
         */
        hasAssignment(): boolean;
        getAssignment(): Common.Models.Assignment;
        setAssignment(assignment: Common.Models.Assignment): void;
        /**
         *
         * Position
         *
         */
        hasPosition(): boolean;
        getPosition(): Team.Models.Position;
        setPosition(position: Team.Models.Position): void;
        /**
         *
         * Placement
         *
         */
        hasPlacement(): boolean;
        getPlacement(): Common.Models.Placement;
        setPlacement(placement: Common.Models.Placement): void;
    }
}
declare module Common.Models {
    class PlayerCollection extends Common.Models.ModifiableCollection<Common.Interfaces.IPlayer> {
        constructor();
    }
}
declare module Common.Models {
    abstract class PlayerSelectionBox extends Common.Models.FieldElement {
        player: Common.Interfaces.IPlayer;
        constructor(player: Common.Interfaces.IPlayer);
        draw(): void;
    }
}
declare module Common.Models {
    abstract class PlayerIcon extends Common.Models.FieldElement {
        player: Common.Interfaces.IPlayer;
        constructor(player: Common.Interfaces.IPlayer);
        draw(): void;
    }
}
declare module Common.Models {
    abstract class PlayerRelativeCoordinatesLabel extends Common.Models.FieldElement {
        player: Common.Interfaces.IPlayer;
        constructor(player: Common.Interfaces.IPlayer);
        draw(): void;
    }
}
declare module Common.Models {
    abstract class PlayerPersonnelLabel extends Common.Models.FieldElement {
        player: Common.Interfaces.IPlayer;
        constructor(player: Common.Interfaces.IPlayer);
        draw(): void;
    }
}
declare module Common.Models {
    abstract class PlayerIndexLabel extends Common.Models.FieldElement {
        player: Common.Interfaces.IPlayer;
        constructor(player: Common.Interfaces.IPlayer);
        draw(): void;
    }
}
declare module Common.Models {
    abstract class Route extends Common.Models.FieldElement {
        paper: Common.Interfaces.IPaper;
        grid: Common.Interfaces.IGrid;
        nodes: Common.Models.ModifiableLinkedList<Common.Models.RouteNode>;
        field: Common.Interfaces.IField;
        player: Common.Interfaces.IPlayer;
        routePath: Common.Models.RoutePath;
        layer: Common.Models.Layer;
        dragInitialized: boolean;
        type: Common.Enums.RouteTypes;
        constructor(player: Common.Interfaces.IPlayer);
        abstract moveNodesByDelta(dx: number, dy: number): any;
        abstract setContext(player: Common.Interfaces.IPlayer): any;
        abstract initializeCurve(coords: Common.Models.Coordinates, flip?: boolean): any;
        fromJson(json: any): any;
        toJson(): any;
        remove(): void;
        draw(): void;
        drawCurve(node: Common.Models.RouteNode): void;
        drawLine(): void;
        addNode(routeNode: Common.Interfaces.IRouteNode, render?: boolean): Common.Models.LinkedListNode<Common.Models.RouteNode>;
        getLastNode(): any;
        getMixedStringFromNodes(nodeArray: Common.Models.LinkedListNode<Common.Models.RouteNode>[]): string;
        getPathStringFromNodes(initialize: boolean, nodeArray: Common.Models.LinkedListNode<Common.Models.RouteNode>[]): string;
        getCurveStringFromNodes(initialize: boolean, nodeArray: Common.Models.LinkedListNode<Common.Models.RouteNode>[]): string;
        private _prepareNodesForPath(nodeArray);
    }
}
declare module Common.Models {
    abstract class RouteAction extends Common.Models.FieldElement {
        routeNode: Common.Interfaces.IRouteNode;
        action: Common.Enums.RouteNodeActions;
        actionable: boolean;
        constructor(routeNode: Common.Models.RouteNode, action: Common.Enums.RouteNodeActions);
        draw(): void;
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Common.Models {
    class RouteCollection extends Common.Models.ModifiableCollection<Common.Interfaces.IRoute> {
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Common.Models {
    abstract class RouteControlPath extends Common.Models.FieldElement {
        routeNode: Common.Models.RouteNode;
        pathString: string;
        constructor(routeNode: Common.Models.RouteNode);
        toJson(): any;
        fromJson(json: any): void;
        draw(): void;
    }
}
declare module Common.Models {
    abstract class RouteNode extends Common.Models.FieldElement {
        node: Common.Models.LinkedListNode<Common.Interfaces.IRouteNode>;
        type: Common.Enums.RouteNodeTypes;
        routeAction: Common.Interfaces.IRouteAction;
        routeControlPath: Common.Interfaces.IRouteControlPath;
        player: Common.Interfaces.IPlayer;
        constructor(context: Common.Interfaces.IPlayer, relativeCoordinates: Common.Models.RelativeCoordinates, type: Common.Enums.RouteNodeTypes);
        draw(): void;
        setContext(context: Common.Interfaces.IPlayer): void;
        fromJson(json: any): void;
        toJson(): any;
        isCurveNode(): boolean;
        setAction(action: Common.Enums.RouteNodeActions): void;
    }
}
declare module Common.Models {
    abstract class RoutePath extends Common.Models.FieldElement {
        route: Common.Interfaces.IRoute;
        pathString: string;
        constructor(route: Common.Interfaces.IRoute);
        toJson(): any;
        remove(): void;
        fromJson(json: any): void;
        /**
         * Draws a RoutePath graphic onto thhe paper;
         * NOTE: assumes the pathString is already set to a valid SVG path string
         */
        draw(): void;
    }
}
declare module Common.Models {
    class Placement extends Common.Models.Modifiable implements Common.Interfaces.IModifiable {
        grid: Common.Interfaces.IGrid;
        relative: Common.Models.RelativeCoordinates;
        coordinates: Common.Models.Coordinates;
        relativeElement: Common.Interfaces.IFieldElement;
        index: number;
        constructor(rx: number, ry: number, relativeElement?: Common.Interfaces.IFieldElement, index?: number);
        toJson(): any;
        fromJson(json: any): any;
        updateFromCoordinates(x: number, y: number): void;
    }
}
declare module Common.Models {
    class PlacementCollection extends Common.Models.ModifiableCollection<Common.Models.Placement> {
        constructor();
        fromJson(placements: any): void;
        toJson(): any;
    }
}
declare module Common.Models {
    class Coordinates extends Common.Models.Modifiable {
        x: number;
        y: number;
        constructor(x: number, y: number);
        toJson(): any;
        fromJson(json: any): any;
        update(x: number, y: number): void;
    }
}
declare module Common.Models {
    class RelativeCoordinates extends Common.Models.Storable {
        relativeElement: Common.Interfaces.IFieldElement;
        distance: number;
        theta: number;
        rx: number;
        ry: number;
        constructor(rx: number, ry: number, relativeElement?: Common.Interfaces.IFieldElement);
        drop(): void;
        toJson(): any;
        fromJson(json: any): any;
        getDistance(): number;
        getTheta(): number;
        updateFromGridCoordinates(x: number, y: number): void;
        updateFromAbsoluteCoordinates(ax: number, ay: number): void;
        /**
         * Takes a set of relative x,y coordinates and returns the exact grid
         * coordinates; assumes the rx/ry values passed in are value grid coordinates
         *
         * @param  {number}                    rx relative x (grid coordinate)
         * @param  {number}                    ry relative y (grid coordinate)
         * @return {Common.Models.Coordinates}    The calculated coordinate
         */
        getCoordinatesFromRelative(rx: number, ry: number): Common.Models.Coordinates;
        getCoordinates(): Common.Models.Coordinates;
    }
}
declare module Common.Models {
    class Location extends Common.Models.Modifiable {
        ax: number;
        ay: number;
        ox: number;
        oy: number;
        dx: number;
        dy: number;
        constructor(ax: number, ay: number);
        toJson(): any;
        fromJson(json: any): void;
        drop(): void;
        moveByDelta(dx: number, dy: number): void;
        updateFromAbsolute(ax?: number, ay?: number): void;
        hasChanged(): boolean;
    }
}
declare module Common.Models {
    class Graphics extends Common.Models.Modifiable implements Common.Interfaces.ISelectable, Common.Interfaces.IDrawable, Common.Interfaces.IHoverable {
        guid: string;
        paper: Common.Interfaces.IPaper;
        grid: Common.Interfaces.IGrid;
        raphael: any;
        placement: Common.Models.Placement;
        location: Common.Models.Location;
        dimensions: Common.Models.Dimensions;
        containment: Common.Models.Containment;
        drawingHandler: Common.Models.DrawingHandler;
        font: any;
        set: Common.Models.GraphicsSet;
        /**
         *
         * Color information
         *
         */
        opacity: number;
        fill: string;
        stroke: string;
        strokeWidth: number;
        /**
         *
         * Original color information to retain states during toggle/disable/select
         *
         */
        originalOpacity: number;
        originalFill: string;
        originalStroke: string;
        originalStrokeWidth: number;
        /**
         *
         * Selection color information
         *
         */
        selectedFill: string;
        selectedStroke: string;
        selectedOpacity: number;
        disabledFill: string;
        disabledStroke: string;
        disabledOpacity: number;
        hoverOpacity: number;
        /**
         *
         * Selection information
         *
         */
        disabled: boolean;
        selected: boolean;
        selectable: boolean;
        clickable: boolean;
        /**
         *
         * Hoverable information
         *
         */
        hoverable: boolean;
        /**
         *
         * Draggable attributes
         *
         */
        dragging: boolean;
        draggable: boolean;
        dragged: boolean;
        constructor(paper: Common.Interfaces.IPaper);
        toJson(): any;
        fromJson(json: any): any;
        /**
         * Alias for hasRaphael()
         * @return {boolean} [description]
         */
        hasGraphics(): boolean;
        hasRaphael(): boolean;
        hasLocation(): boolean;
        hasPlacement(): boolean;
        setPlacement(placement: Common.Models.Placement): void;
        hasSet(): boolean;
        getFill(): string;
        setFill(fill: string): Common.Models.Graphics;
        setOriginalFill(fill: string): Common.Models.Graphics;
        getStroke(): string;
        setStroke(stroke: string): Common.Models.Graphics;
        setOriginalStroke(stroke: string): Common.Models.Graphics;
        getStrokeWidth(): number;
        setStrokeWidth(width: number): Common.Models.Graphics;
        setOriginalStrokeWidth(width: number): Common.Models.Graphics;
        /**
         *
         * Dimension pass-through methods
         *
         */
        setOffsetXY(x: number, y: number): void;
        /**
         * Gets the current opacity
         * @return {number} [description]
         */
        getOpacity(): number;
        /**
         * Sets the opacity to the given value
         * @param {number} value The opacity to set
         */
        setOpacity(opacity: number): Common.Models.Graphics;
        setOriginalOpacity(opacity: number): Common.Models.Graphics;
        /**
         * Toggles the opacity for show/hide effect
         */
        toggleOpacity(): void;
        /**
         * Generic selection toggle
         */
        toggleSelect(): void;
        /**
         * Generic selection method
         */
        select(): void;
        /**
         * Generic deselection method
         */
        deselect(): void;
        /**
         * Generic disable method
         */
        disable(): void;
        /**
         * Generic enable method
         */
        enable(): void;
        setContainment(left: number, right: number, top: number, bottom: number): void;
        getCoordinates(): Common.Models.Coordinates;
        /**
         * Returns whether the given difference in absolute x/y location
         * from the current absolute location is within the graphic's
         * containment area.
         *
         * @param  {number}  dx The potential move-to ax location
         * @param  {number}  dy The potential move-to ay location
         * @return {boolean}    true if the location to move to is within
         *                           the containment area
         */
        canMoveByDelta(dx: number, dy: number): boolean;
        canMoveByDeltaX(dx: number): boolean;
        canMoveByDeltaY(dy: number): boolean;
        /**
         * [moveByDelta description]
         * @param {number} dx [description]
         * @param {number} dy [description]
         */
        moveByDelta(dx: number, dy: number): void;
        moveByDeltaX(dx: number): void;
        moveByDeltaY(dy: number): void;
        updatePlacement(x?: number, y?: number): void;
        updateLocation(ax?: number, ay?: number): void;
        updateFromAbsolute(ax: number, ay: number): void;
        updateFromCoordinates(x: number, y: number): void;
        /**
         *
         * DRAWING METHODS
         *
         */
        path(path: string): Common.Models.Graphics;
        rect(): Common.Models.Graphics;
        ellipse(): Common.Models.Graphics;
        circle(): Common.Models.Graphics;
        text(text: string): Common.Models.Graphics;
        refresh(): void;
        attr(attrs: any): Common.Models.Graphics;
        setAttribute(attribute: string, value: string): void;
        getBBox(isWithoutTransforms?: boolean): void;
        transform(ax: number, ay: number): void;
        toFront(): void;
        toBack(): void;
        rotate(degrees: number): void;
        remove(): void;
        show(): void;
        hide(): void;
        glow(): void;
        getType(): any;
        /**
         * Handles drawing of graphical element
         * @param  {any[]} ...args [description]
         * @return {any}           [description]
         */
        ondraw(callback: Function): any;
        draw(): void;
        /**
         * Hover in/out handler registration method;
         * handles generic opacity toggling for all field elements.
         *
         * @param {any} hoverIn  [description]
         * @param {any} hoverOut [description]
         * @param {any} context  [description]
         */
        onhover(hoverIn: any, hoverOut: any, context: Common.Interfaces.IFieldElement): void;
        hoverIn(e: any, context: Common.Interfaces.IFieldElement): void;
        hoverOut(e: any, context: Common.Interfaces.IFieldElement): void;
        /**
         * Click events
         * @param {any} fn      [description]
         * @param {any} context [description]
         */
        onclick(fn: any, context: Common.Interfaces.IFieldElement): void;
        click(e: any, context: Common.Interfaces.IFieldElement): void;
        oncontextmenu(fn: any, context: Common.Interfaces.IFieldElement): void;
        contextmenu(e: any, context: Common.Interfaces.IFieldElement): void;
        /**
         * Mouse down event handler registration method
         * @param {any}                             fn      [description]
         * @param {Common.Interfaces.IFieldElement} context [description]
         */
        onmousedown(fn: any, context: Common.Interfaces.IFieldElement): void;
        /**
         * Mouse up event handler registration method
         * @param {any}                             fn      [description]
         * @param {Common.Interfaces.IFieldElement} context [description]
         */
        onmouseup(fn: any, context: Common.Interfaces.IFieldElement): void;
        /**
         * Default mousedown handler to be called if no other handlers are
         * registered with onmousedown
         * @param {any}                             e       [description]
         * @param {Common.Interfaces.IFieldElement} context [description]
         */
        mousedown(e: any, context: Common.Interfaces.IFieldElement): void;
        /**
         * Mouse move event handler registration method; attaches listeners
         * to be fired when the cursor moves over an element (such as for cursor tracking)
         * @param {any}                             fn      [description]
         * @param {Common.Interfaces.IFieldElement} context [description]
         */
        onmousemove(fn: any, context: Common.Interfaces.IFieldElement): void;
        /**
         * Default mouse move handler to be called if no other handlers are
         * registered with onmousedown
         * @param {any}                             e       [description]
         * @param {Common.Interfaces.IFieldElement} context [description]
         */
        mousemove(e: any, context: Common.Interfaces.IFieldElement): void;
        ondrag(dragMove: Function, dragStart: Function, dragEnd: Function, context: Common.Interfaces.IFieldElement): void;
        drop(): void;
    }
}
declare module Common.Models {
    class GraphicsSet {
        context: Common.Models.Graphics;
        canvas: Common.Interfaces.ICanvas;
        paper: Common.Interfaces.IPaper;
        grid: Common.Interfaces.IGrid;
        items: Common.Models.Graphics[];
        length: number;
        raphaelSet: any;
        constructor(context: Common.Models.Graphics, ...args: Common.Models.Graphics[]);
        size(): number;
        push(...args: Common.Models.Graphics[]): void;
        pop(): Common.Models.Graphics;
        exclude(graphics: Common.Models.Graphics): Common.Models.Graphics;
        forEach(iterator: Function, context: any): any;
        getByGuid(guid: string): Common.Models.Graphics;
        splice(index: number, count: number): Common.Models.Graphics[];
        removeAll(): void;
        dragOne(guid: string, dx: number, dy: number): void;
        dragAll(dx: number, dy: number): void;
        show(): void;
        hide(): void;
        drop(): void;
        setOriginalPositions(): void;
    }
}
declare module Common.Models {
    class Dimensions extends Common.Models.Modifiable {
        width: number;
        height: number;
        minWidth: number;
        minHeight: number;
        length: number;
        depth: number;
        radius: number;
        diameter: number;
        perimeter: number;
        circumference: number;
        area: number;
        circularArea: number;
        offset: Common.Models.Offset;
        constructor();
        toJson(): any;
        fromJson(json: any): any;
        calculateDimensions(): void;
        getHeight(): number;
        setHeight(height: number): void;
        getWidth(): number;
        setWidth(width: number): void;
        getMinWidth(): number;
        setMinWidth(minWidth: number): void;
        getMinHeight(): number;
        setMinHeight(minHeight: number): void;
        /**
         * Mostly for line segments
         * @return {number} [description]
         */
        getLength(): number;
        setLength(length: number): void;
        getDepth(): number;
        setDepth(depth: number): void;
        getRadius(): number;
        setRadius(radius: number): void;
        getDiameter(): number;
        setDiameter(diameter: number): void;
        private _calculateDiameter();
        getPerimeter(): number;
        private _calculatePerimeter();
        getArea(): number;
        private _calculateArea();
        getCircumference(): number;
        private _calculateCircumference();
        getCircularArea(): number;
        private _calculateCircularArea();
        hasOffset(): boolean;
        getOffset(): Common.Models.Offset;
        setOffset(offset: Common.Models.Offset): void;
        getOffsetX(): number;
        setOffsetX(x: number): void;
        getOffsetY(): number;
        setOffsetY(y: number): void;
        setOffsetXY(x: number, y: number): void;
    }
}
declare module Common.Models {
    class Offset extends Common.Models.Modifiable {
        x: number;
        y: number;
        constructor(x: number, y: number);
        toJson(): any;
        fromJson(json: any): any;
        set(offset: Common.Models.Offset): void;
        hasXY(): boolean;
        hasX(): boolean;
        getX(): number;
        setX(x: number): void;
        hasY(): boolean;
        getY(): number;
        setY(y: number): void;
        setXY(x: number, y: number): void;
    }
}
declare module Common.Models {
    class Containment {
        left: number;
        right: number;
        top: number;
        bottom: number;
        constructor(left: number, right: number, top: number, bottom: number);
        isContained(coordinates: Common.Models.Coordinates): boolean;
        isContainedX(x: number): boolean;
        isContainedY(y: number): boolean;
    }
}
declare module Common.Models {
    class RelativeContainment extends Common.Models.Containment {
        constructor(left: number, right: number, top: number, bottom: number);
    }
}
declare module Common.Models {
    class DrawingHandler {
        callbacks: Function[];
        graphics: Common.Models.Graphics;
        constructor(graphics: Common.Models.Graphics);
        ondraw(callback: Function): void;
        draw(): void;
    }
}
declare module Common.Models {
}
declare module Common.Enums {
    enum ImpaktTypes {
        Unknown = 0,
        PlaybookView = 1,
        Playbook = 2,
        PlayFormation = 3,
        PlaySet = 4,
        PlayTemplate = 98,
        Variant = 99,
        Play = 100,
        Player = 101,
        PlayPlayer = 102,
        PlayPosition = 103,
        PlayAssignment = 104,
        Team = 200,
    }
    enum DimensionTypes {
        Square = 0,
        Circle = 1,
        Ellipse = 2,
    }
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
    enum PaperSizingModes {
        TargetGridWidth = 0,
        MaxCanvasWidth = 1,
        PreviewWidth = 2,
    }
    class CursorTypes {
        static pointer: string;
        static crosshair: string;
    }
    enum SetTypes {
        None = 0,
        Personnel = 1,
        Assignment = 2,
        UnitType = 3,
    }
    enum LayerTypes {
        Generic = 0,
        FieldElement = 1,
        Player = 2,
        Icon = 3,
        Label = 4,
        Coordinates = 5,
        RelativeCoordinates = 6,
        SelectionBox = 7,
        Route = 8,
        SecondaryRoutes = 9,
        AlternateRoutes = 10,
        RouteAction = 11,
        RouteNode = 12,
        RoutePath = 13,
        RouteControlPath = 14,
        PrimaryPlayer = 15,
        PrimaryPlayerIcon = 16,
        PrimaryPlayerLabel = 17,
        PrimaryPlayerCoordinates = 18,
        PrimaryPlayerRelativeCoordinates = 19,
        PrimaryPlayerSelectionBox = 20,
        PrimaryPlayerRoute = 21,
        PrimaryPlayerSecondaryRoutes = 22,
        PrimaryPlayerAlternateRoutes = 23,
        PrimaryPlayerRouteAction = 24,
        PrimaryPlayerRouteNode = 25,
        PrimaryPlayerRoutePath = 26,
        PrimaryPlayerRouteControlPath = 27,
        OpponentPlayer = 28,
        OpponentPlayerIcon = 29,
        OpponentPlayerLabel = 30,
        OpponentPlayerCoordinates = 31,
        OpponentPlayerRelativeCoordinates = 32,
        OpponentPlayerSelectionBox = 33,
        OpponentPlayerRoute = 34,
        OpponentPlayerSecondaryRoutes = 35,
        OpponentPlayerAlternateRoutes = 36,
        OpponentPlayerRouteAction = 37,
        OpponentPlayerRouteNode = 38,
        OpponentPlayerRoutePath = 39,
        OpponentPlayerRouteControlPath = 40,
        Ball = 41,
        Field = 42,
        Sideline = 43,
        Hashmark = 44,
        SidelineHashmark = 45,
        Endzone = 46,
        LineOfScrimmage = 47,
    }
    enum RouteTypes {
        None = 0,
        Generic = 1,
        Block = 2,
        Scan = 3,
        Run = 4,
        Route = 5,
        Cover = 6,
        Zone = 7,
        Spy = 8,
        Option = 9,
        HandOff = 10,
        Pitch = 11,
        Preview = 12,
    }
    enum RouteNodeTypes {
        None = 0,
        Normal = 1,
        Root = 2,
        CurveStart = 3,
        CurveControl = 4,
        CurveEnd = 5,
        End = 6,
    }
    enum RouteNodeActions {
        None = 0,
        Block = 1,
        Delay = 2,
        Continue = 3,
        Juke = 4,
        ZigZag = 5,
    }
}
declare module Common.Constants {
    const DEFAULT_GRID_COLS: number;
    const DEFAULT_GRID_ROWS: number;
    const COMMON_URL: string;
    const MODULES_URL: string;
    const PLAYBOOK_URL: string;
    const CONTEXTMENUS_URL: string;
    /**
     *
     * Contextmenu template URLs
     *
     */
    const DEFAULT_CONTEXTMENU_TEMPLATE_URL: string;
    const EDITOR_ROUTENODE_CONTEXTMENU_TEMPLATE_URL: string;
}
declare module Common.Factories {
    class PlayerIconFactory {
        static getPlayerIcon(player: Common.Interfaces.IPlayer): void;
    }
}
declare module Common.Factories {
    class RouteActionFactory {
        static draw(routeAction: Common.Interfaces.IRouteAction): void;
        static none(routeActionGraphics: Common.Models.Graphics): void;
        static block(routeNodeGraphics: Common.Models.Graphics, routeActionGraphics: Common.Models.Graphics): void;
        static delay(routeNodeGraphics: Common.Models.Graphics, routeActionGraphics: Common.Models.Graphics): void;
    }
}
declare module Common.Factories {
}
declare module Common {
    module API {
        enum Actions {
            Nothing = 0,
            Create = 1,
            Overwrite = 2,
            Copy = 3,
        }
    }
    module Base {
        /**
         * The Common.Base.Component class allows you to dynamically
         * track when angular controllers, services, factories, etc. are
         * being loaded as dependencies of one another.
         *
         * TODO: Investigate this further; I implemented this early on
         * during development and may not have had a firm grasp on
         * the loading order of various angular components. I didn't
         * really take clear note of why I implemented this in the first place;
         * I believe it was necessary. I just need to validate my initial
         * assumptions.
         *
         */
        class Component {
            type: ComponentType;
            name: string;
            guid: string;
            waitingOn: string[];
            dependencies: ComponentMap;
            parent: Component;
            loaded: boolean;
            private onReadyCallback;
            constructor(name: string, type: ComponentType, waitingOn?: string[]);
            ready(): void;
            onready(callback: any): void;
            loadDependency(dependency: Common.Base.Component): void;
            registerDependencies(): void;
        }
        enum ComponentType {
            Null = 0,
            Service = 1,
            Controller = 2,
            Directive = 3,
        }
        class ComponentMap {
            count: number;
            obj: any;
            constructor();
            /**
             * Adds a new component to the list or updates
             * the component if it already exists.
             * @param {Component} component The component to be added
             */
            add(component: Component): void;
            remove(guid: string): Component;
            get(guid: string): Component;
            set(component: Component): void;
        }
    }
    class Utilities {
        static notImplementedException(): void;
        static exportToPng(canvas: Common.Interfaces.ICanvas, svgElement: HTMLElement): string;
        /**
         * Compresses the given SVG element into a compressed string
         * @param  {HTMLElement} svg SVG element to handle
         * @return {string}          the compressed SVG string
         */
        static compressSVG(svg: HTMLElement): string;
        /**
         * Compresses the given string
         * @param  {string} svg String to compress
         * @return {any}        a compressed svg string
         */
        static compress(str: string): string;
        /**
         * Takes a compressed SVG data and decompresses it
         * @param  {string} compressed The compressed SVG data to decompress
         * @return {string}            The decompressed string of SVG
         */
        static decompressSVG(compressed: string): string;
        /**
         * Decompresses the given string
         * @param  {string} compressed The (compressed) string to decompress
         * @return {string}            the decompressed string
         */
        static decompress(compressed: string): string;
        /**
         * Encodes the given string of SVG into base64
         * @param  {string} svgString svg string
         * @return {string}           base64 encoded svg string
         */
        static toBase64(str: string): string;
        /**
         * Decodes the given base64 encoded svg string
         * @param  {string} base64Svg base64 encoded svg string
         * @return {string}           decoded svg string
         */
        static fromBase64(str: string): string;
        /**
         * Converts the given SVG HTML element into a string
         * @param  {HTMLElement} svg Element to convert to string
         * @return {string}          returns the stringified SVG element
         */
        static serializeXMLToString(xml: any): string;
        static parseData(data: any): any;
        static guid(): string;
        static randomId(): number;
        static camelCaseToSpace(string: string, capitalizeFirst?: boolean): string;
        static sentenceCase(str: string): string;
        static convertEnumToList(obj: any): {};
        static getEnumerationsOnly(obj: any): {};
        static getEnumerationsAsArray(obj: any): any[];
        static isArray(obj: any): boolean;
        static isObject(obj: any): boolean;
        static isFunction(obj: any): void;
        static toJson(obj: any): any;
        static toJsonArrayRecursive(arr: any): any[];
        private static toJsonRecursive(obj, results);
        /**
         * Generates and returns a hashed string from the given JSON object
         * @param {any} json The object to be hashed
         */
        static generateChecksum(json: any): any;
        private static prepareObjectForEncoding(obj);
        static isNullOrUndefined(obj: any): boolean;
        static isNull(obj: any): boolean;
        static isUndefined(obj: any): boolean;
    }
}
declare module Common.UI {
    const SCROLL_BAR_SIZE: number;
}
declare module Playbook.Models {
    class Tool {
        title: string;
        guid: string;
        tooltip: string;
        glyphicon: Common.Icons.Glyphicon;
        action: Playbook.Enums.ToolActions;
        cursor: string;
        mode: Playbook.Enums.ToolModes;
        selected: boolean;
        constructor(title?: string, action?: Playbook.Enums.ToolActions, glyphiconIcon?: string, tooltip?: string, cursor?: string, mode?: Playbook.Enums.ToolModes, selected?: boolean);
    }
}
declare module Playbook.Models {
    class EditorEndzone extends Common.Models.Endzone implements Common.Interfaces.IEndzone {
        constructor(context: Common.Interfaces.IField, offsetY: number);
    }
}
declare module Playbook.Models {
    class PreviewEndzone extends Common.Models.Endzone implements Common.Interfaces.IEndzone {
        constructor(context: Common.Interfaces.IField, offsetY: number);
    }
}
declare module Playbook.Models {
    class EditorBall extends Common.Models.Ball implements Common.Interfaces.IBall {
        constructor(field: Common.Interfaces.IField);
        draw(): void;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
    }
}
declare module Playbook.Models {
    class PreviewBall extends Common.Models.Ball implements Common.Interfaces.IBall {
        constructor(field: Common.Interfaces.IField);
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
    }
}
declare module Playbook.Models {
    class EditorField extends Common.Models.Field implements Common.Interfaces.IField {
        type: Team.Enums.UnitTypes;
        editorType: Playbook.Enums.EditorTypes;
        zoom: number;
        constructor(paper: Common.Interfaces.IPaper, playPrimary: Common.Models.PlayPrimary, playOpponent: Common.Models.PlayOpponent);
        debug(context: Playbook.Models.EditorField): void;
        initialize(): void;
        draw(): void;
        useAssignmentTool(coords: Common.Models.Coordinates): void;
        export(): any;
        placeAtYardline(element: any, yardline: any): void;
        remove(): void;
        getBBoxCoordinates(): void;
        addPlayer(placement: Common.Models.Placement, position: Team.Models.Position, assignment: Common.Models.Assignment): Common.Interfaces.IPlayer;
    }
}
declare module Playbook.Models {
    class EditorCanvas extends Common.Models.Canvas implements Common.Interfaces.ICanvas {
        constructor(playPrimary: Common.Models.PlayPrimary, playOpponent: Common.Models.PlayOpponent, width?: number, height?: number);
        initialize($container: any): void;
        updatePlay(playPrimary: Common.Models.PlayPrimary, playOpponent: Common.Models.PlayOpponent, redraw?: boolean): void;
        resize(): void;
        setScrollable(scrollable: any): void;
        resetHeight(): void;
        setListener(actionId: any, fn: any): void;
        invoke(actionId: any, data: any, context: any): void;
        zoomIn(): void;
        zoomOut(): void;
        getToolMode(): Enums.ToolModes;
        getToolModeName(): string;
    }
}
declare module Playbook.Models {
    class EditorPaper extends Common.Models.Paper implements Common.Interfaces.IPaper {
        drawing: Common.Drawing.Utilities;
        constructor(canvas: Common.Interfaces.ICanvas);
        initialize(): void;
        draw(): void;
        updatePlay(playPrimary: Common.Models.PlayPrimary, playOpponent: Common.Models.PlayOpponent): void;
    }
}
declare module Playbook.Models {
    class PreviewField extends Common.Models.Field implements Common.Interfaces.IField {
        constructor(paper: Common.Interfaces.IPaper, playPrimary: Common.Models.PlayPrimary, playOpponent: Common.Models.PlayOpponent);
        initialize(): void;
        draw(): void;
        addPlayer(placement: Common.Models.Placement, position: Team.Models.Position, assignment: Common.Models.Assignment): Common.Interfaces.IPlayer;
        useAssignmentTool(coords: Common.Models.Coordinates): void;
    }
}
declare module Playbook.Models {
    class PreviewCanvas extends Common.Models.Canvas implements Common.Interfaces.ICanvas {
        constructor(playPrimary: Common.Models.PlayPrimary, playOpponent: Common.Models.PlayOpponent);
        initialize($container: any): void;
    }
}
declare module Playbook.Models {
    class PreviewPaper extends Common.Models.Paper implements Common.Interfaces.IPaper {
        constructor(previewCanvas: Common.Interfaces.ICanvas);
        initialize(): void;
        updatePlay(playPrimary: any, playOpponent: any): void;
    }
}
declare module Playbook.Models {
    class PreviewLineOfScrimmage extends Common.Models.LineOfScrimmage {
        constructor(field: Common.Interfaces.IField);
        draw(): void;
    }
}
declare module Playbook.Models {
    class EditorLineOfScrimmage extends Common.Models.LineOfScrimmage {
        constructor(field: Common.Interfaces.IField);
        draw(): void;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(e: any): void;
        dragEnd(e: any): void;
    }
}
declare module Playbook.Models {
    class PreviewGround extends Common.Models.Ground {
        constructor(field: Common.Interfaces.IField);
        draw(): void;
        hoverIn(e: any, self: any): void;
        hoverOut(e: any, self: any): void;
        click(e: any, self: any): void;
        mouseDown(e: any, self: any): void;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
    }
}
declare module Playbook.Models {
    class EditorGround extends Common.Models.Ground {
        constructor(field: Common.Interfaces.IField);
        draw(): void;
        mousemove(e: any, context: Common.Interfaces.IFieldElement): void;
        click(e: any, context: Common.Interfaces.IGround): void;
    }
}
declare module Playbook.Models {
    class PreviewHashmark extends Common.Models.Hashmark implements Common.Interfaces.IHashmark {
        constructor(field: Common.Interfaces.IField, x: number);
    }
}
declare module Playbook.Models {
    class EditorHashmark extends Common.Models.Hashmark implements Common.Interfaces.IHashmark {
        constructor(field: Common.Interfaces.IField, x: number);
    }
}
declare module Playbook.Models {
    class PreviewSideline extends Common.Models.Sideline {
        constructor(field: Common.Interfaces.IField, offsetX: number);
    }
}
declare module Playbook.Models {
    class EditorSideline extends Common.Models.Sideline {
        constructor(field: Common.Interfaces.IField, offsetX: number);
    }
}
declare module Playbook.Models {
    class EditorPlayer extends Common.Models.Player implements Common.Interfaces.IPlayer {
        private _isCreatedNewFromAltDisabled;
        private _newFromAlt;
        private _isDraggingNewFromAlt;
        private _originalScreenPositionX;
        private _originalScreenPositionY;
        constructor(field: Common.Interfaces.IField, placement: Common.Models.Placement, position: Team.Models.Position, assignment: Common.Models.Assignment);
        draw(): void;
        remove(): void;
        mousedown(e: any, self: any): void;
        click(e: any, self: any): any;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
        clearRoute(): void;
        setRouteFromDefaults(routeTitle: string): void;
        onkeypress(): void;
        getPositionRelativeToBall(): Common.Models.RelativeCoordinates;
        getCoordinatesFromAbsolute(): Common.Models.Coordinates;
        hasPlacement(): boolean;
        hasPosition(): boolean;
        private _setOriginalDragPosition(x, y);
        private _isOriginalDragPositionSet();
        private _isOverDragThreshold(x, y);
    }
}
declare module Playbook.Models {
    class PreviewPlayer extends Common.Models.Player implements Common.Interfaces.IPlayer, Common.Interfaces.IPlaceable, Common.Interfaces.ILayerable {
        constructor(context: Common.Interfaces.IField, placement: Common.Models.Placement, position: Team.Models.Position, assignment: Common.Models.Assignment);
        draw(): void;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
    }
}
declare module Playbook.Models {
    class EditorPlayerIcon extends Common.Models.PlayerIcon {
        constructor(player: Common.Interfaces.IPlayer);
        draw(): void;
    }
}
declare module Playbook.Models {
    class PreviewPlayerIcon extends Common.Models.PlayerIcon {
        constructor(player: Common.Interfaces.IPlayer);
    }
}
declare module Playbook.Models {
    class PreviewPlayerRelativeCoordinatesLabel extends Common.Models.PlayerRelativeCoordinatesLabel implements Common.Interfaces.IPlayerRelativeCoordinatesLabel {
        constructor(player: Common.Interfaces.IPlayer);
    }
}
declare module Playbook.Models {
    class EditorPlayerRelativeCoordinatesLabel extends Common.Models.PlayerRelativeCoordinatesLabel implements Common.Interfaces.IPlayerRelativeCoordinatesLabel {
        constructor(player: Common.Interfaces.IPlayer);
    }
}
declare module Playbook.Models {
    class EditorPlayerPersonnelLabel extends Common.Models.PlayerPersonnelLabel {
        constructor(player: Common.Interfaces.IPlayer);
    }
}
declare module Playbook.Models {
    class PreviewPlayerPersonnelLabel extends Common.Models.PlayerPersonnelLabel {
        constructor(player: Common.Interfaces.IPlayer);
        draw(): void;
    }
}
declare module Playbook.Models {
    class EditorPlayerIndexLabel extends Common.Models.PlayerIndexLabel implements Common.Interfaces.IPlayerIndexLabel {
        constructor(player: Common.Interfaces.IPlayer);
    }
}
declare module Playbook.Models {
    class PreviewPlayerIndexLabel extends Common.Models.PlayerIndexLabel implements Common.Interfaces.IPlayerIndexLabel {
        constructor(player: Common.Interfaces.IPlayer);
        draw(): void;
    }
}
declare module Playbook.Models {
    class EditorPlayerSelectionBox extends Common.Models.PlayerSelectionBox implements Common.Interfaces.IPlayerSelectionBox {
        constructor(player: Common.Interfaces.IPlayer);
    }
}
declare module Playbook.Models {
    class PreviewPlayerSelectionBox extends Common.Models.PlayerSelectionBox implements Common.Interfaces.IPlayerSelectionBox {
        constructor(player: Common.Interfaces.IPlayer);
        draw(): void;
    }
}
declare module Playbook.Models {
    class PreviewRoute extends Common.Models.Route implements Common.Interfaces.IRoute {
        constructor(player: Common.Interfaces.IPlayer);
        draw(): void;
        setContext(player: Common.Interfaces.IPlayer): void;
        moveNodesByDelta(dx: number, dy: number): void;
        initializeCurve(coords: Common.Models.Coordinates, flip?: boolean): void;
        toJson(): any;
        fromJson(json: any): any;
    }
}
declare module Playbook.Models {
    class EditorRoute extends Common.Models.Route implements Common.Interfaces.IRoute {
        constructor(player: Common.Interfaces.IPlayer, dragInitialized?: boolean);
        setContext(player: Common.Interfaces.IPlayer): void;
        toJson(): any;
        fromJson(json: any): any;
        initializeCurve(coords: Common.Models.Coordinates, flip?: boolean): void;
        moveNodesByDelta(dx: number, dy: number): void;
    }
}
declare module Playbook.Models {
    class PreviewRouteNode extends Common.Models.RouteNode implements Common.Interfaces.IRouteNode {
        constructor(context: Common.Interfaces.IPlayer, relativeCoordinates: Common.Models.RelativeCoordinates, type: Common.Enums.RouteNodeTypes);
    }
}
declare module Playbook.Models {
    class EditorRouteNode extends Common.Models.RouteNode implements Common.Interfaces.IRouteNode {
        constructor(context: Common.Interfaces.IPlayer, relativeCoordinates: Common.Models.RelativeCoordinates, type: Common.Enums.RouteNodeTypes);
        draw(): void;
        click(e: any, self: any): void;
        contextmenuHandler(e: any, self: any): void;
        dragMove(dx: any, dy: any, posx: any, posy: any, e: any): void;
        dragStart(x: any, y: any, e: any): void;
        dragEnd(e: any): void;
        drop(): void;
    }
}
declare module Playbook.Models {
    class PreviewRoutePath extends Common.Models.RoutePath implements Common.Interfaces.IRoutePath {
        constructor(route: Common.Interfaces.IRoute);
    }
}
declare module Playbook.Models {
    class EditorRoutePath extends Common.Models.RoutePath implements Common.Interfaces.IRoutePath {
        constructor(route: Common.Interfaces.IRoute);
    }
}
declare module Playbook.Models {
    class PreviewRouteAction extends Common.Models.RouteAction implements Common.Interfaces.IRouteAction {
        constructor(routeNode: Common.Models.RouteNode, action: Common.Enums.RouteNodeActions);
        draw(): void;
    }
}
declare module Playbook.Models {
    class EditorRouteAction extends Common.Models.RouteAction implements Common.Interfaces.IRouteAction {
        constructor(routeNode: Common.Models.RouteNode, action: Common.Enums.RouteNodeActions);
    }
}
declare module Playbook.Models {
    class PreviewRouteControlPath extends Common.Models.RouteControlPath implements Common.Interfaces.IRouteControlPath {
        constructor(routeNode: Common.Models.RouteNode);
        draw(): void;
    }
}
declare module Playbook.Models {
    class EditorRouteControlPath extends Common.Models.RouteControlPath implements Common.Interfaces.IRouteControlPath {
        constructor(routeNode: Common.Models.RouteNode);
    }
}
declare module Playbook.Models {
}
declare module Playbook.Interfaces {
}
declare module Playbook.Enums {
    enum Actions {
        FieldElementContextmenu = 0,
        PlayerContextmenu = 1,
        RouteNodeContextmenu = 2,
        RouteTreeSelection = 3,
    }
    enum ToolModes {
        None = 0,
        Select = 1,
        Formation = 2,
        Assignment = 3,
        Zoom = 4,
    }
    enum ToolActions {
        Nothing = 0,
        Select = 1,
        ToggleMenu = 2,
        AddPlayer = 3,
        Save = 4,
        ZoomIn = 5,
        ZoomOut = 6,
        Assignment = 7,
    }
    enum EditorTypes {
        Formation = 0,
        Assignment = 1,
        Play = 2,
    }
    enum PlayTypes {
        Any = 0,
        Primary = 1,
        Opponent = 2,
    }
    enum PlayerIconTypes {
        CircleEditor = 0,
        SquareEditor = 1,
        TriangleEditor = 2,
        CirclePreview = 3,
        SquarePreview = 4,
        TrianglePreview = 5,
    }
}
declare module Playbook.Constants {
    const FIELD_COLS_FULL: number;
    const FIELD_ROWS_FULL: number;
    const FIELD_COLS_PREVIEW: number;
    const FIELD_ROWS_PREVIEW: number;
    const FIELD_COLOR: string;
    const GRID_SIZE: number;
    const GRID_BASE: number;
    const BALL_DEFAULT_PLACEMENT_X: number;
    const BALL_DEFAULT_PLACEMENT_Y: number;
    const PREVIEW_PLAYER_ICON_RADIUS: number;
    const DRAG_THRESHOLD_X: number;
    const DRAG_THRESHOLD_Y: number;
}
declare module Playbook {
}
declare module Team.Models {
    class Personnel extends Common.Models.Modifiable {
        unitType: Team.Enums.UnitTypes;
        parentRK: number;
        editorType: Playbook.Enums.EditorTypes;
        name: string;
        associated: Common.Models.Association;
        positions: Team.Models.PositionCollection;
        setType: Common.Enums.SetTypes;
        key: number;
        constructor();
        hasPositions(): boolean;
        update(personnel: Team.Models.Personnel): void;
        copy(newPersonnel: Team.Models.Personnel): Team.Models.Personnel;
        fromJson(json: any): any;
        toJson(): any;
        setDefault(): void;
        setUnitType(unitType: Team.Enums.UnitTypes): void;
    }
}
declare module Team.Models {
    class PersonnelCollection extends Common.Models.ModifiableCollection<Team.Models.Personnel> {
        unitType: Team.Enums.UnitTypes;
        setType: Common.Enums.SetTypes;
        constructor();
        toJson(): {
            unitType: Enums.UnitTypes;
            setType: Common.Enums.SetTypes;
            personnel: any;
        };
        fromJson(json: any): void;
    }
}
declare module Team.Models {
    class Position extends Common.Models.Modifiable {
        positionListValue: Team.Models.PositionList;
        title: string;
        label: string;
        eligible: boolean;
        index: number;
        unitType: Team.Enums.UnitTypes;
        constructor(options?: any);
        toJson(): any;
        fromJson(json: any): any;
    }
    enum PositionList {
        BlankOffense = 0,
        BlankDefense = 1,
        BlankSpecialTeams = 2,
        BlankOther = 3,
        Quarterback = 4,
        RunningBack = 5,
        FullBack = 6,
        TightEnd = 7,
        Center = 8,
        Guard = 9,
        Tackle = 10,
        WideReceiver = 11,
        SlotReceiver = 12,
        NoseGuard = 13,
        DefensiveTackle = 14,
        DefensiveGuard = 15,
        DefensiveEnd = 16,
        Linebacker = 17,
        Safety = 18,
        FreeSafety = 19,
        StrongSafety = 20,
        DefensiveBack = 21,
        Cornerback = 22,
        Kicker = 23,
        Holder = 24,
        Punter = 25,
        LongSnapper = 26,
        KickoffSpecialist = 27,
        PuntReturner = 28,
        KickReturner = 29,
        Upback = 30,
        Gunner = 31,
        Jammer = 32,
        Other = 33,
    }
    class PositionDefault {
        static defaults: any;
        constructor();
        getPosition(positionListValue: any): any;
        switchPosition(fromPosition: any, toPositionEnum: any): any;
        static getBlank(type: Team.Enums.UnitTypes): PositionCollection;
        getByUnitType(type: Team.Enums.UnitTypes): any;
    }
}
declare module Team.Models {
    class PositionCollection extends Common.Models.ModifiableCollection<Team.Models.Position> {
        constructor();
        listPositions(): any[];
        toJson(): any;
        fromJson(positions: any): any;
        setDefault(): void;
    }
}
declare module Team.Models {
    class UnitType extends Common.Models.Modifiable {
        unitType: Team.Enums.UnitTypes;
        associated: Common.Models.Association;
        name: string;
        constructor(unitType: Team.Enums.UnitTypes, name: string);
        static getUnitTypes(): {};
        toJson(): any;
        fromJson(json: any): any;
    }
}
declare module Team.Models {
    class UnitTypeCollection extends Common.Models.ModifiableCollection<Team.Models.UnitType> {
        constructor();
        getByUnitType(unitTypeValue: Team.Enums.UnitTypes): UnitType;
        getAssociatedPlaybooks(): Common.Models.PlaybookModelCollection;
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Team.Enums {
    enum UnitTypes {
        Offense = 0,
        Defense = 1,
        SpecialTeams = 2,
        Other = 3,
        Mixed = 4,
    }
}
declare module Team {
}
declare module Analysis {
}
declare module Home {
}
declare module Planning {
}
declare module Navigation {
}
declare module Navigation.Models {
    class NavigationItem extends Common.Models.Storable {
        name: string;
        label: string;
        glyphicon: string;
        path: string;
        isActive: boolean;
        constructor(name: string, label: string, glyphicon: string, path: string, isActive: boolean);
    }
}
declare module Navigation.Models {
    class NavigationItemCollection extends Common.Models.Collection<Navigation.Models.NavigationItem> {
        constructor();
    }
}
declare module Nav {
}
declare module Search {
}
declare module Season {
}
declare module Stats {
}
declare module User.Models {
    class Organization extends Common.Models.Storable {
        companyName: string;
        emailAccounting: string;
        emailOther: string;
        emailPrimary: string;
        emailSales: string;
        emailScheduling: string;
        emailWarranty: string;
        faxAccounting: string;
        faxPrimary: string;
        faxSales: string;
        faxScheduling: string;
        faxWarranty: string;
        organizationKey: number;
        phoneAccounting: string;
        phonePrimary: string;
        phoneSales: string;
        phoneScheduling: string;
        phoneWarranty: string;
        primaryAddress1: string;
        primaryAddress2: string;
        primaryAddress3: string;
        primaryCity: string;
        primaryCountry: string;
        primaryPostalCode: string;
        primaryStateProvince: string;
        secondaryAddress1: string;
        secondaryAddress2: string;
        secondaryAddress3: string;
        secondaryCity: string;
        secondaryCountry: string;
        secondaryPostalCode: string;
        secondaryStateProvince: string;
        upsFedExAddress1: string;
        upsFedExAddress2: string;
        upsFedExAddress3: string;
        upsFedExCity: string;
        upsFedExCountry: string;
        upsFedExPostalCode: string;
        upsFedExStateProvince: string;
        website: string;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module User.Models {
}
declare module User {
}
declare var $: any;
declare var angular: any;
declare var Raphael: any;
declare var async: any;
declare var objectHash: any;
declare var LZString: any;
declare var canvg: any;
declare var impakt: any;
declare var impakt: any, angular: any;
declare var impakt: any;
declare var impakt: any;
declare var impakt: any;
declare var impakt: any;
declare var impakt: any, playbook: any;
declare var impakt: any, angular: any;
declare var impakt: any, angular: any;
declare var impakt: any;
declare var impakt: any;
declare var impakt: any;
declare var impakt: any;
declare var impakt: any, angular: any;
declare var impakt: any, angular: any;
declare var impakt: any, angular: any;
declare var impakt: any;
declare var impakt: any, angular: any;
declare var impakt: any, angular: any;
declare var impakt: any;
declare module User.Models {
    class Account extends Common.Models.Storable {
        name: string;
        organizationKey: number;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module User.Models {
    class AccountUser extends Common.Models.Storable {
        constructor();
        toJson(): any;
        fromJson(): void;
    }
}
declare module User.Models {
    class OrganizationCollection extends Common.Models.Collection<User.Models.Organization> {
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module User.Models {
    class UserModel extends Common.Models.Storable {
        firstName: string;
        lastName: string;
        organizationName: number;
        organizationKey: number;
        invitationType: number;
        invitationKey: number;
        email: string;
        recaptchaChallenge: string;
        recaptchaResponse: string;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
