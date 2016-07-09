declare module Common.Interfaces {
    interface ICollection<T extends Common.Interfaces.IModifiable> {
        size(): number;
        isEmpty(): boolean;
        hasElements(): boolean;
        get(key: string | number): T;
        exists(key: string | number): boolean;
        first(): T;
        indexOf(key: string | number): number;
        isFirst(key: string | number): boolean;
        isLast(key: string | number): boolean;
        getOne(): T;
        getIndex(index: number): T;
        getAll(): {
            any?: T;
        };
        getLast(): T;
        getNext(key: string | number): T;
        getPrevious(key: string | number): T;
        set(key: string | number, data: T): void;
        replace(replaceKey: string | number, data: T): void;
        setAtIndex(index: number, data: T): void;
        add(data: T): void;
        addAll(elements: T[]): void;
        addAtIndex(data: T, index: number): void;
        only(data: T): void;
        append(collection: Common.Interfaces.ICollection<T>): void;
        forEach(iterator: Function): void;
        hasElementWhich(predicate: Function): boolean;
        filter(predicate: Function): T[];
        filterFirst(predicate: Function): T;
        empty(listen?: boolean): void;
        remove(key: string | number, listen?: boolean): T;
        removeAll(listen?: boolean): void;
        removeEach(iterator: Function, listen?: boolean): void;
        removeWhere(predicate: Function, listen?: boolean): void;
        contains(key: string | number): boolean;
        toArray(): T[];
        toJson(): any[];
        getGuids(): Array<string | number>;
    }
}
declare module Common.Interfaces {
    interface ICollectionItem {
        guid: string;
    }
}
declare module Common.Interfaces {
    interface ILinkedListNode<T> extends Common.Interfaces.IModifiable {
        next: T;
        prev: T;
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
        listeners: any;
        copy(newElement: Common.Interfaces.IModifiable, context: Common.Interfaces.IModifiable): Common.Interfaces.IModifiable;
        checkContextSet(): void;
        setContext(context: any): void;
        onModified(callback: Function): void;
        isModified(): void;
        setModified(isModified?: boolean): boolean;
        listen(startListening: boolean): any;
        setListener(actionId: string, callback: Function): void;
        hasListeners(): boolean;
        clearListeners(): void;
        invokeListener(actionId: string, data?: any): void;
        generateChecksum(): string;
    }
}
declare module Common.Interfaces {
    interface IModifiableCollection<T extends Common.Models.Modifiable> extends Common.Interfaces.ICollection<T> {
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
    interface IInvokableCallback {
        callback: Function;
        persist: boolean;
    }
}
declare module Common.Interfaces {
    interface IActionable extends Common.Interfaces.IModifiable {
        impaktDataType: Common.Enums.ImpaktDataTypes;
        graphics: Common.Models.Graphics;
        disabled: boolean;
        clickable: boolean;
        hoverable: boolean;
        hovered: boolean;
        selected: boolean;
        selectable: boolean;
        draggable: boolean;
        dragging: boolean;
        flipped: boolean;
        flippable: boolean;
        visible: boolean;
        contextmenuTemplateUrl: string;
        actions: Common.Models.ActionRegistry;
        hasGraphics(): boolean;
        toggleOpacity(): void;
        isSelectable(): boolean;
        select(): void;
        deselect(): void;
        toggleSelect(metaKey?: boolean): void;
        disable(): void;
        enable(): void;
        show(): void;
        hide(): void;
        toggleVisibility(): void;
        getContextmenuUrl(): string;
        drop(): void;
        onhover(hoverIn: any, hoverOut: any, context: Common.Interfaces.IActionable): void;
        hoverIn(e: any): void;
        hoverOut(e: any): void;
        onclick(fn: any, context: Common.Interfaces.IActionable): void;
        click(e: any): void;
        oncontextmenu(fn: any, context: Common.Interfaces.IActionable): void;
        contextmenu(e: any): void;
        onmousedown(fn: any, context: Common.Interfaces.IActionable): void;
        onmouseup(fn: any, context: Common.Interfaces.IActionable): void;
        mousedown(e: any): void;
        onmousemove(fn: any, context: Common.Interfaces.IActionable): void;
        mousemove(e: any): void;
        ondrag(dragMove: Function, dragStart: Function, dragEnd: Function, context: Common.Interfaces.IActionable): void;
    }
}
declare module Common.Interfaces {
    interface IActionableCollection extends Common.Interfaces.ICollection<Common.Interfaces.IActionable> {
        toggleSelect(element: Common.Interfaces.IActionable): void;
        deselectAll(): void;
        selectAll(): void;
        select(element: Common.Interfaces.IActionable): void;
        deselect(element: Common.Interfaces.IActionable): void;
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
    interface ISelectable extends Common.Interfaces.IStorable, Common.Interfaces.IActionable {
        selectedFill: string;
        selectedStroke: string;
        selectedOpacity: number;
        onhover(hoverIn: any, hoverOut: any, context: any): void;
        hoverIn(e: any): void;
        hoverOut(e: any): void;
        onclick(fn: any, context: any): void;
        click(e: any): void;
        onmousedown(fn: any, context: any): void;
        onmouseup(fn: any, context: any): void;
        mousedown(e: any): void;
        oncontextmenu(fn: any, context: any): void;
        contextmenu(e: any): void;
    }
}
declare module Common.Interfaces {
    interface IDraggable extends Common.Interfaces.IActionable {
        dragging: boolean;
        ondrag(dragStart: Function, dragMove: Function, dragEnd: Function, context: Common.Interfaces.IFieldElement): void;
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
        actions: Common.Models.ActionRegistry;
    }
}
declare module Common.Interfaces {
    interface IHoverable extends Common.Interfaces.IActionable {
        hoverIn(e: any, context?: any): void;
        hoverOut(e: any, context?: any): void;
    }
}
declare module Common.Interfaces {
    interface IAssociable extends Common.Interfaces.IModifiable {
        key: number;
        impaktDataType: Common.Enums.ImpaktDataTypes;
        guid: string;
        associationKey: string;
        name: string;
    }
}
declare module Common.Interfaces {
    interface IPlay extends Common.Interfaces.IActionable, Common.Interfaces.IAssociable {
        playType: Playbook.Enums.PlayTypes;
        unitType: Team.Enums.UnitTypes;
        assignmentGroup: Common.Models.AssignmentGroup;
        formation: Common.Models.Formation;
        personnel: Team.Models.Personnel;
        name: string;
        key: number;
        setField(field: Common.Interfaces.IField): void;
        copy(newElement?: Common.Interfaces.IPlay): Common.Interfaces.IPlay;
    }
}
declare module Common.Interfaces {
    interface IScenario extends Common.Interfaces.IActionable {
    }
}
declare module Common.Interfaces {
    interface IGrid {
        canvas: Common.Interfaces.ICanvas;
        dimensions: Common.Models.Dimensions;
        size: number;
        cols: number;
        rows: number;
        divisor: number;
        snapping: boolean;
        draw(): void;
        setSnapping(snapping: boolean): void;
        toggleSnapping(): void;
        resize(sizingMode: Common.Enums.CanvasSizingModes): number;
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
        field: Common.Interfaces.IField;
        grid: Common.Interfaces.IGrid;
        drawing: Common.Drawing.Utilities;
        sizingMode: Common.Enums.CanvasSizingModes;
        $container: any;
        container: HTMLElement;
        $exportCanvas: any;
        exportCanvas: HTMLCanvasElement;
        tab: Common.Models.Tab;
        dimensions: Common.Models.Dimensions;
        x: number;
        y: number;
        listener: Common.Models.CanvasListener;
        readyCallbacks: Function[];
        widthChangeInterval: any;
        active: boolean;
        editorType: Playbook.Enums.EditorTypes;
        toolMode: Playbook.Enums.ToolModes;
        state: Common.Enums.State;
        exportToPng(): string;
        setDimensions(): void;
        clear(): void;
        getWidth(): number;
        getHeight(): number;
    }
}
declare module Common.Interfaces {
    interface IField extends Common.Interfaces.IActionable {
        canvas: Common.Interfaces.ICanvas;
        grid: Common.Interfaces.IGrid;
        scenario: Common.Models.Scenario;
        ball: Common.Interfaces.IBall;
        primaryPlayers: Common.Models.PlayerCollection;
        opponentPlayers: Common.Models.PlayerCollection;
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
        selectedElements: Common.Interfaces.ICollection<Common.Interfaces.IFieldElement>;
        cursorCoordinates: Common.Models.Coordinates;
        layer: Common.Models.Layer;
        state: Common.Enums.State;
        initialize(): void;
        draw(): void;
        drawScenario(): void;
        addPrimaryPlayer(placement: Common.Models.Placement, position: Team.Models.Position, assignment: Common.Models.Assignment): Common.Interfaces.IPlayer;
        addOpponentPlayer(placement: Common.Models.Placement, position: Team.Models.Position, assignment: Common.Models.Assignment): Common.Interfaces.IPlayer;
        clearPrimaryPlayers(): void;
        clearOpponentPlayers(): void;
        clearScenario(): void;
        clearPrimaryPlay(): void;
        clearOpponentPlay(): void;
        clearPlayers(): void;
        updateScenario(scenario: Common.Models.Scenario): void;
        getSelectedByLayerType(layerType: Common.Enums.LayerTypes): Common.Models.Collection<Common.Interfaces.IFieldElement>;
        toggleSelectionByLayerType(layerType: Common.Enums.LayerTypes): void;
        toggleSelection(element: Common.Interfaces.IFieldElement): void;
        setSelection(element: Common.Interfaces.IFieldElement): void;
        deselectAll(): any;
        useAssignmentTool(coords: Common.Models.Coordinates): any;
        setCursorCoordinates(pageX: number, pageY: number): void;
        getLOSAbsolute(): number;
    }
}
declare module Common.Interfaces {
    interface IFieldElement extends Common.Interfaces.IActionable {
        field: Common.Interfaces.IField;
        ball: Common.Interfaces.IBall;
        relativeElement: Common.Interfaces.IFieldElement;
        canvas: Common.Interfaces.ICanvas;
        grid: Common.Interfaces.IGrid;
        layer: Common.Models.Layer;
        initialize(field: Common.Interfaces.IField, relativeElement: Common.Interfaces.IFieldElement): void;
        draw(): void;
        hoverIn(e: any): void;
        hoverOut(e: any): void;
        click(e: any): void;
        deselect(): void;
        select(): void;
        toggleSelect(metaKey: boolean): void;
        mousedown(e: any): void;
        mousemove(e: any): void;
        contextmenu(e: any): void;
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
        renderType: Common.Enums.RenderTypes;
        unitType: Team.Enums.UnitTypes;
        flip(): void;
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
    interface IRoute extends Common.Interfaces.IFieldElement {
        player: Common.Interfaces.IPlayer;
        field: Common.Interfaces.IField;
        layer: Common.Models.Layer;
        canvas: Common.Interfaces.ICanvas;
        grid: Common.Interfaces.IGrid;
        nodes: Common.Models.LinkedList<Common.Interfaces.IRouteNode>;
        routePath: Common.Interfaces.IRoutePath;
        dragInitialized: boolean;
        type: Common.Enums.RouteTypes;
        renderType: Common.Enums.RenderTypes;
        flipped: boolean;
        unitType: Team.Enums.UnitTypes;
        draw(): void;
        flip(): void;
        initializeCurve(coords: Common.Models.Coordinates, flip?: boolean): any;
        addNode(routeNode: Common.Interfaces.IRouteNode, render?: boolean): Common.Interfaces.IRouteNode;
        getMixedStringFromNodes(nodeArray: Common.Interfaces.IRouteNode[]): string;
        getPathStringFromNodes(initialize: boolean, nodeArray: Common.Interfaces.IRouteNode[]): string;
        getCurveStringFromNodes(initialize: boolean, nodeArray: Common.Interfaces.IRouteNode[]): string;
        setPlacement(placement: Common.Models.Placement): void;
        refresh(): void;
    }
}
declare module Common.Interfaces {
    interface IRouteAction extends Common.Interfaces.IFieldElement {
        routeNode: Common.Interfaces.IRouteNode;
        action: Common.Enums.RouteNodeActions;
    }
}
declare module Common.Interfaces {
    interface IRouteControlPath extends Common.Interfaces.IFieldElement {
    }
}
declare module Common.Interfaces {
    interface IRouteNode extends Common.Interfaces.IFieldElement, Common.Interfaces.ILinkedListNode<Common.Interfaces.IRouteNode> {
        type: Common.Enums.RouteNodeTypes;
        routeAction: Common.Interfaces.IRouteAction;
        routeControlPath: Common.Interfaces.IRouteControlPath;
        route: Common.Interfaces.IRoute;
        flipped: boolean;
        flip(): void;
        setPlacement(placement: Common.Models.Placement): void;
        refresh(): void;
    }
}
declare module Common.Interfaces {
    interface IRoutePath extends Common.Interfaces.IFieldElement {
        pathString: string;
        unitType: Team.Enums.UnitTypes;
        draw(): void;
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
        listeners: any;
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
         * any mutation from triggering a rehash. Does not
         * trigger a modification event when setting to true,
         * you must invoke the modification event directly and
         * separately if needed.
         *
         * @param {boolean} startListening true or false
         */
        listen(startListening: boolean): Common.Interfaces.IModifiable;
        /**
         * Takes an action id ('onready', 'onclose', etc.) and a callback function to invoke
         * when the action occurs. Optionally, you can pass a `persist` flag, which specifies
         * whether to keep the callback in the array after it's been invoked (persist = true)
         * or to remove the callback after it is called the first time (!persist).
         *
         * @param {string}   actionId [description]
         * @param {Function} callback [description]
         * @param {boolean}  persist    default = false
         */
        setListener(actionId: string, callback: Function, persist?: boolean): void;
        hasListeners(): boolean;
        clearListeners(): void;
        invokeListener(actionId: string, data?: any): void;
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
        copy(newElement: Common.Interfaces.IModifiable, context: Common.Interfaces.IModifiable): Common.Interfaces.IModifiable;
        toJson(): any;
        fromJson(json: any, ...args: any[]): void;
    }
}
declare module Common.Models {
    class Collection<T extends Common.Interfaces.IModifiable> extends Common.Models.Modifiable implements Common.Interfaces.ICollection<T> {
        private _count;
        private _keys;
        constructor(size?: number);
        copy(newCollection?: Common.Models.Collection<T>): Common.Models.Collection<T>;
        private _getKey(data);
        private _ensureKeyType(key);
        size(): number;
        isEmpty(): boolean;
        hasElements(): boolean;
        exists(key: string | number): boolean;
        first(): T;
        indexOf(key: string | number): number;
        isLast(key: string | number): boolean;
        isFirst(key: string | number): boolean;
        get(key: string | number): T;
        getNext(key: string | number): T;
        getPrevious(key: string | number): T;
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
        set(key: string | number, data: T, listen?: boolean): void;
        replace(replaceKey: string | number, data: T): void;
        setAtIndex(index: number, data: T): any;
        add(data: T, listen?: boolean): void;
        addAll(elements: T[]): void;
        addAtIndex(data: T, index: number): void;
        only(data: T): void;
        append(collection: Common.Models.Collection<T>): void;
        forEach(iterator: Function): void;
        hasElementWhich(predicate: Function): boolean;
        filter(predicate: Function): T[];
        filterFirst(predicate: Function): T;
        /**
         * Assumes a 1-deep object: {A: 1, B: 2, C: 3}
         *
         * @param {any} obj [description]
         */
        filterCollection(obj: any): Collection<T>;
        remove(key: string | number, listen?: boolean): T;
        pop(): T;
        empty(listen?: boolean): void;
        removeAll(listen?: boolean): void;
        /**
         * Allows you to run an iterator method over each item
         * in the collection before the collection is completely
         * emptied.
         */
        removeEach(iterator: Function, listen?: boolean): void;
        removeWhere(predicate: Function, listen?: boolean): void;
        contains(key: string | number): boolean;
        toArray(): T[];
        toJson(): any;
        getGuids(): Array<string | number>;
    }
}
declare module Common.Models {
    class LinkedList<T extends Common.Interfaces.ILinkedListNode<Common.Interfaces.IModifiable>> extends Common.Models.Storable {
        root: T;
        last: T;
        private _length;
        private _modifiable;
        callbacks: Function[];
        modified: boolean;
        checksum: string;
        original: string;
        lastModified: number;
        context: any;
        isContextSet: boolean;
        listening: boolean;
        constructor();
        setModified(forciblyModify?: boolean): boolean;
        onModified(callback: Function): void;
        isModified(): void;
        /**
         * When commanding the collection whether to listen,
         * apply the true/false argument to all of its contents as well
         * @param {boolean} startListening true to start listening, false to stop
         */
        listen(startListening: boolean): LinkedList<T>;
        add(node: T, listen?: boolean): void;
        getIndex(index: number): T;
        first(): T;
        forEach(iterator: Function): void;
        toJson(): any[];
        toArray(): T[];
        getLast(): T;
        getRoot(): T;
        remove(guid: string): T;
        size(): number;
        hasElements(): boolean;
        isEmpty(): boolean;
    }
}
/**
 *
 *
 *
 *
 *
 *
 *   DEPRECATED!!
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
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
        constructor(size?: number);
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
        exists(key: string | number): boolean;
        get(key: string | number): T;
        first(): T;
        getOne(): T;
        getIndex(index: number): T;
        set(key: string | number, data: T): ModifiableCollection<T>;
        replace(replaceKey: string | number, data: T): ModifiableCollection<T>;
        setAtIndex(index: number, data: T): ModifiableCollection<T>;
        add(data: T): ModifiableCollection<T>;
        addAll(elements: T[]): ModifiableCollection<T>;
        addAtIndex(data: T, index: number): ModifiableCollection<T>;
        only(data: T): ModifiableCollection<T>;
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
        fromJson(json: any): void;
        copy(newElement: Common.Models.ModifiableCollection<T>, context: Common.Models.ModifiableCollection<T>): Common.Models.ModifiableCollection<T>;
        getGuids(): Array<string | number>;
    }
}
declare module Common.Models {
    class Datetime {
        date: Date;
        time: number;
        meridian: string;
        timezone: string;
        options: any;
        popup: any;
        format: string;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
        openPopup(): void;
        closePopup(): void;
        togglePopup(open?: boolean): void;
        getFormatted(): string;
    }
}
declare module Common.Models {
    class NotImplementedClass extends Common.Models.Storable {
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Common.Models {
    abstract class APIOptions {
    }
}
declare module Common.Models {
    class Expandable extends Common.Models.Modifiable {
        direction: string;
        min: number;
        max: number;
        $element: any;
        em: number;
        collapsed: boolean;
        ready: boolean;
        url: string;
        label: string;
        handle: Common.Models.ExpandableHandle;
        expandable: boolean;
        openCallbacks: Function[];
        closeCallbacks: Function[];
        constructor($element: any);
        setHandleClass(): void;
        /**
         * Deprecated
         * @param {[type]} value [description]
         */
        getWidth(width: number): number;
        /**
         * Deprecated
         */
        getInitialWidth(): number;
        getInitialClass(): string;
        toggle(): void;
        open(): void;
        onopen(callback: Function): void;
        close(): void;
        onclose(callback: Function): void;
        getMinClass(): string;
        getMaxClass(): string;
        setInitialClass(): void;
        initializeToggleHandle(): void;
    }
    class ExpandableHandle {
        position: string;
        collapsed: string;
        expanded: string;
        class: string;
        constructor();
    }
}
declare module Common.Models {
    class ContextmenuData {
        data: Common.Interfaces.IContextual;
        url: string;
        pageX: number;
        pageY: number;
        message: string;
        constructor(data: Common.Interfaces.IContextual, pageX: number, pageY: number, message?: string);
    }
}
declare module Common.Models {
    class ActionRegistry {
        delete: Function[];
        edit: Function[];
        save: Function[];
        update: Function[];
        create: Function[];
        details: Function[];
        constructor();
    }
}
declare module Common.Models {
    abstract class Actionable extends Common.Models.Modifiable implements Common.Interfaces.IActionable, Common.Interfaces.IContextual, Common.Interfaces.IHoverable {
        impaktDataType: Common.Enums.ImpaktDataTypes;
        graphics: Common.Models.Graphics;
        disabled: boolean;
        clickable: boolean;
        hoverable: boolean;
        hovered: boolean;
        selected: boolean;
        selectable: boolean;
        dragging: boolean;
        draggable: boolean;
        flipped: boolean;
        flippable: boolean;
        visible: boolean;
        contextmenuTemplateUrl: string;
        actions: Common.Models.ActionRegistry;
        constructor(impaktDataType: Common.Enums.ImpaktDataTypes);
        toJson(): any;
        fromJson(json: any): void;
        hasGraphics(): boolean;
        /**
         * Toggles the opacity for show/hide effect
         */
        toggleOpacity(): void;
        /**
         * Generic selection toggle
         */
        isSelectable(): boolean;
        toggleSelect(metaKey?: boolean): void;
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
        /**
         * Generic show method
         */
        show(): void;
        /**
         * Generic hide method
         */
        hide(): void;
        /**
         * Toggle show/hide
         */
        toggleVisibility(): void;
        getContextmenuUrl(): string;
        drop(): void;
        onhover(hoverIn: any, hoverOut: any, context: Common.Interfaces.IActionable): void;
        hoverIn(e: any): void;
        hoverOut(e: any): void;
        onclick(fn: any, context: Common.Interfaces.IActionable): void;
        click(e: any): void;
        oncontextmenu(fn: any, context: Common.Interfaces.IActionable): void;
        contextmenu(e: any): void;
        onmousedown(fn: any, context: Common.Interfaces.IActionable): void;
        onmouseup(fn: any, context: Common.Interfaces.IActionable): void;
        mousedown(e: any): void;
        onmousemove(fn: any, context: Common.Interfaces.IActionable): void;
        mousemove(e: any): void;
        ondrag(dragMove: Function, dragStart: Function, dragEnd: Function, context: Common.Interfaces.IActionable): void;
    }
}
declare module Common.Models {
    class ActionableCollection<T extends Common.Models.Actionable> extends Common.Models.Collection<T> implements Common.Interfaces.IActionableCollection {
        constructor();
        toJson(): any;
        fromJson(json: any): void;
        deselectAll(): void;
        selectAll(): void;
        select(element: Common.Interfaces.IActionable): void;
        deselect(element: Common.Interfaces.IActionable): void;
        toggleSelect(element: Common.Interfaces.IActionable): void;
        hoverIn(element: Common.Interfaces.IActionable): void;
        hoverOut(element: Common.Interfaces.IActionable): void;
        hoverOutAll(): void;
    }
}
declare module Common.Models {
    class AssociableEntity extends Common.Models.Actionable implements Common.Interfaces.IAssociable {
        key: number;
        impaktDataType: Common.Enums.ImpaktDataTypes;
        associationKey: string;
        associable: string[];
        name: string;
        constructor(impaktDataType: Common.Enums.ImpaktDataTypes);
        generateAssociationKey(): void;
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Common.Models {
    abstract class AssociableEntityCollection<T extends Common.Interfaces.IAssociable> extends Common.Models.Collection<T> {
        protected _associableEntity: Common.Models.AssociableEntity;
        constructor(impaktDataType: Common.Enums.ImpaktDataTypes, size?: number);
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Common.Models {
    class AssociationCollection extends Common.Models.Modifiable {
        private _data;
        private _size;
        contextId: number;
        constructor(contextId: number);
        /**
         * Returns the size of the association collection
         * @return {number} size
         */
        size(): number;
        /**
         * Returns whether the association collection has elements
         * @return {boolean} true or false
         */
        isEmpty(): boolean;
        /**
         * Returns whether the array has elements
         * @return {boolean} true or false
         */
        hasElements(): boolean;
        /**
         * Creates an association, and an inverse association, between
         * the two given entities.
         *
         * @param {Common.Interfaces.IAssociable} fromEntity [description]
         * @param {Common.Interfaces.IAssociable} toEntity   [description]
         */
        add(fromEntity: Common.Interfaces.IAssociable, toEntity: Common.Interfaces.IAssociable): void;
        /**
         * Creates an association between the given entity and all of the
         * given array of entities.
         *
         * @param {Common.Interfaces.IAssociable}   fromEntity [description]
         * @param {Common.Interfaces.IAssociable[]} entities   [description]
         */
        addAll(fromEntity: Common.Interfaces.IAssociable, entities: Common.Interfaces.IAssociable[]): void;
        /**
         * Creates an 'inverse' association with the given association, and
         * adds both to the association collection
         *
         * @param {Common.Models.Association} association the 'from' association
         */
        addAssociation(association: Common.Models.Association): void;
        addInternalKey(internalKey: string, associations: string[]): void;
        /**
         * Merges another association collection into this association collection;
         * ignores any duplicate entries.
         *
         * @param {Common.Models.AssociationCollection} associationCollection association collection to merge
         */
        merge(associationCollection: Common.Models.AssociationCollection): void;
        getByInternalKey(internalKey: string): string[];
        hasAssociations(internalKey: string): boolean;
        empty(): void;
        delete(internalKey: string): Common.Models.AssociationCollection;
        /**
         * Removes the association ONLY between the two entities, and only
         * completely removes them if their respective association arrays
         * are empty as a result.
         *
         * @param {Common.Interfaces.IAssociable} fromEntity [description]
         * @param {Common.Interfaces.IAssociable} toEntity   [description]
         */
        disassociate(fromEntity: Common.Interfaces.IAssociable, toEntity: Common.Interfaces.IAssociable): void;
        /**
         * Returns whether the given guid exists
         * @param  {string}  guid the guid to check
         * @return {boolean}      true if it exists, otherwise false
         */
        exists(internalKey: string): boolean;
        /**
         * Returns whether there is an existing association between the given
         * 'from' internalKey, 'to' the given internal key
         * @param  {string}  fromInternalKey [description]
         * @param  {string}  toInternalKey   [description]
         * @return {boolean}                 [description]
         */
        associationExists(fromInternalKey: string, toInternalKey: string): boolean;
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
        toArray(toJson?: boolean): any[];
        toJson(): any;
        fromJson(json: any): void;
        getInternalKeys(): string[];
    }
}
declare module Common.Models {
    /**
     * Associates an element with one or more other elements
     * by guid.
     */
    class Association extends Common.Models.Modifiable {
        fromKey: number;
        fromType: Common.Enums.ImpaktDataTypes;
        fromGuid: string;
        toKey: number;
        toType: Common.Enums.ImpaktDataTypes;
        toGuid: string;
        contextId: number;
        internalKey: string;
        version: number;
        data: any;
        associationType: Common.Enums.AssociationTypes;
        protected static KEY_PART_LENGTH: number;
        constructor(fromKey: number, fromType: Common.Enums.ImpaktDataTypes, fromGuid: string, toKey: number, toType: Common.Enums.ImpaktDataTypes, toGuid: string, contextId: number);
        static buildKey(association: Common.Models.Association): string;
        static parse(internalKey: string): Common.Models.AssociationParts;
        toJson(): any;
        fromJson(json: any): void;
    }
    class AssociationParts {
        entityKey: number;
        entityType: Common.Enums.ImpaktDataTypes;
        entityGuid: string;
        constructor(entityType: Common.Enums.ImpaktDataTypes, entityKey: number, guid: string);
    }
}
declare module Common.Models {
    class AssociationResults {
        playbooks: Common.Models.PlaybookModelCollection;
        scenarios: Common.Models.ScenarioCollection;
        plays: Common.Models.PlayCollection;
        formations: Common.Models.FormationCollection;
        personnel: Team.Models.PersonnelCollection;
        assignmentGroups: Common.Models.AssignmentGroupCollection;
        leagues: League.Models.LeagueModelCollection;
        conferences: League.Models.ConferenceCollection;
        divisions: League.Models.DivisionCollection;
        locations: League.Models.LocationCollection;
        teams: Team.Models.TeamModelCollection;
        seasons: Season.Models.SeasonModelCollection;
        games: Season.Models.GameCollection;
        plans: Planning.Models.PlanCollection;
        practicePlans: Planning.Models.PracticePlanCollection;
        practiceSchedules: Planning.Models.PracticeScheduleCollection;
        gamePlans: Planning.Models.GamePlanCollection;
        scoutCards: Planning.Models.ScoutCardCollection;
        QBWristbands: Planning.Models.QBWristbandCollection;
        constructor();
        count(): number;
        hasAssociations(): boolean;
        isEmpty(): boolean;
        getPopulatedAssociationKeys(): string[];
    }
}
declare module Common.Models {
    class Notification extends Common.Models.Modifiable {
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
    class Situation {
        name: string;
        yardline: number;
        hashmark: Playbook.Enums.Hashmark;
        constructor();
    }
}
declare module Common.Models {
    class Assignment extends Common.Models.AssociableEntity {
        routes: Common.Models.RouteCollection;
        routeArray: any[];
        positionIndex: number;
        setType: Common.Enums.SetTypes;
        unitType: Team.Enums.UnitTypes;
        layer: Common.Models.Layer;
        constructor(unitType: Team.Enums.UnitTypes);
        toJson(): any;
        fromJson(json: any): void;
        copy(newAssignment?: Common.Models.Assignment): Common.Models.Assignment;
        remove(): void;
        setContext(context: any): void;
        draw(): void;
        drop(): void;
        addRoute(route: Common.Interfaces.IRoute): void;
        setRoutes(player: Common.Interfaces.IPlayer, renderType: Common.Enums.RenderTypes): void;
        hasRouteArray(): boolean;
        updateRouteArray(): void;
        flip(): void;
        moveByDelta(dx: number, dy: number): void;
        refresh(): void;
    }
}
declare module Common.Models {
    class AssignmentGroup extends Common.Models.AssociableEntity {
        unitType: Team.Enums.UnitTypes;
        assignments: Common.Models.Collection<Common.Models.Assignment>;
        constructor(unitType: Team.Enums.UnitTypes, count?: number);
        copy(newAssignmentGroup?: Common.Models.AssignmentGroup): Common.Models.AssignmentGroup;
        toJson(): any;
        fromJson(json: any): any;
        getAssignmentByPositionIndex(index: number): any;
        flip(): void;
    }
}
declare module Common.Models {
    class AssignmentGroupCollection extends Common.Models.ActionableCollection<Common.Models.AssignmentGroup> {
        unitType: Team.Enums.UnitTypes;
        constructor(unitType: Team.Enums.UnitTypes);
        toJson(): any;
        fromJson(json: any): any;
    }
}
declare module Common.Models {
    class Formation extends Common.Models.AssociableEntity {
        unitType: Team.Enums.UnitTypes;
        parentRK: number;
        editorType: Playbook.Enums.EditorTypes;
        placements: Common.Models.PlacementCollection;
        png: string;
        constructor(unitType: Team.Enums.UnitTypes);
        copy(newFormation?: Common.Models.Formation): Common.Models.Formation;
        toJson(): any;
        fromJson(json: any): any;
        setDefault(ball: Common.Interfaces.IBall): void;
        isValid(): boolean;
        setPlacements(placements: Common.Models.PlacementCollection): void;
        setUnitType(unitType: Team.Enums.UnitTypes): void;
        flip(): void;
    }
}
declare module Common.Models {
    class FormationCollection extends Common.Models.ActionableCollection<Common.Models.Formation> {
        parentRK: number;
        unitType: Team.Enums.UnitTypes;
        constructor(unitType: Team.Enums.UnitTypes);
        toJson(): {
            formations: any;
            unitType: Team.Enums.UnitTypes;
            guid: string;
        };
        fromJson(json: any): any;
    }
}
declare module Common.Models {
    abstract class Play extends Common.Models.AssociableEntity {
        field: Common.Interfaces.IField;
        assignmentGroup: Common.Models.AssignmentGroup;
        formation: Common.Models.Formation;
        personnel: Team.Models.Personnel;
        unitType: Team.Enums.UnitTypes;
        playType: Playbook.Enums.PlayTypes;
        png: string;
        constructor(unitType: Team.Enums.UnitTypes);
        copy(newPlay: Common.Interfaces.IPlay): Common.Interfaces.IPlay;
        toJson(): any;
        fromJson(json: any): any;
        setPlaybook(playbook: Common.Models.PlaybookModel): void;
        setFormation(formation: Common.Models.Formation): void;
        setAssignmentGroup(assignmentGroup: Common.Models.AssignmentGroup): void;
        setPersonnel(personnel: Team.Models.Personnel): void;
        setUnitType(unitType: Team.Enums.UnitTypes): void;
        hasAssignments(): boolean;
        setDefault(field: Common.Interfaces.IField): void;
        getOpposingUnitType(): Team.Enums.UnitTypes;
        isFieldSet(field: Common.Interfaces.IField): boolean;
        isBallSet(ball: Common.Interfaces.IBall): boolean;
        setField(field: Common.Interfaces.IField): void;
        static toPrimary(play: Common.Interfaces.IPlay): Common.Models.PlayPrimary;
        static toOpponent(play: Common.Interfaces.IPlay): Common.Models.PlayOpponent;
        flip(): void;
    }
}
declare module Common.Models {
    class PlayPrimary extends Common.Models.Play implements Common.Interfaces.IPlay {
        constructor(unitType: Team.Enums.UnitTypes);
        copy(newPlay?: Common.Interfaces.IPlay): Common.Models.PlayPrimary;
        draw(field: Common.Interfaces.IField): void;
    }
}
declare module Common.Models {
    class PlayOpponent extends Common.Models.Play implements Common.Interfaces.IPlay {
        constructor(unitType: Team.Enums.UnitTypes);
        copy(newPlay?: Common.Interfaces.IPlay): Common.Models.PlayOpponent;
        draw(field: Common.Interfaces.IField): void;
    }
}
declare module Common.Models {
    class PlayCollection extends Common.Models.ActionableCollection<Common.Interfaces.IPlay> {
        unitType: Team.Enums.UnitTypes;
        constructor(unitType: Team.Enums.UnitTypes);
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Common.Models {
    class PlaybookModel extends Common.Models.AssociableEntity {
        unitType: Team.Enums.UnitTypes;
        constructor(unitType: Team.Enums.UnitTypes);
        toJson(): any;
        fromJson(json: any): any;
    }
}
declare module Common.Models {
    class PlaybookModelCollection extends Common.Models.ActionableCollection<Common.Models.PlaybookModel> {
        unitType: Team.Enums.UnitTypes;
        constructor(unitType: Team.Enums.UnitTypes);
        toJson(): any;
        fromJson(json: any): any;
    }
}
declare module Common.Models {
    class Scenario extends Common.Models.AssociableEntity {
        unitType: Team.Enums.UnitTypes;
        playPrimary: Common.Models.PlayPrimary;
        playOpponent: Common.Models.PlayOpponent;
        playPrimaryGuid: string;
        playOpponentGuid: string;
        editorType: Playbook.Enums.EditorTypes;
        png: string;
        key: number;
        constructor();
        copy(newScenario?: Common.Models.Scenario): Common.Models.Scenario;
        toJson(): void;
        fromJson(json: any): void;
        setPlayPrimary(play: Common.Interfaces.IPlay): void;
        setPlayOpponent(play: Common.Interfaces.IPlay): void;
        clear(): void;
        draw(field: Common.Interfaces.IField): void;
    }
}
declare module Common.Models {
    class ScenarioCollection extends Common.Models.ActionableCollection<Common.Interfaces.IScenario> {
        unitType: Team.Enums.UnitTypes;
        constructor(unitType: Team.Enums.UnitTypes);
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Common.Models {
    class Tab extends Common.Models.Modifiable implements Common.Interfaces.ICollectionItem {
        title: string;
        key: number;
        active: boolean;
        scenario: Common.Models.Scenario;
        canvas: Common.Models.Canvas;
        private _closeCallbacks;
        constructor(scenario: Common.Models.Scenario);
        onclose(callback: Function): void;
        close(): void;
    }
}
declare module Common.Models {
    class TabCollection extends Common.Models.Collection<Common.Models.Tab> {
        constructor();
        getByPlayGuid(guid: string): Common.Models.Tab;
        close(tab: Common.Models.Tab): void;
    }
}
declare module Common.Models {
    class Template extends Common.Models.Modifiable {
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
        Backspace = 8,
        Enter = 13,
        Esc = 27,
        Left = 37,
        Up = 38,
        Right = 39,
        Down = 40,
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
declare module Common.Models {
    abstract class Canvas extends Common.Models.Modifiable implements Common.Interfaces.ICanvas {
        field: Common.Interfaces.IField;
        grid: Common.Interfaces.IGrid;
        drawing: Common.Drawing.Utilities;
        sizingMode: Common.Enums.CanvasSizingModes;
        $container: any;
        container: HTMLElement;
        $exportCanvas: any;
        exportCanvas: HTMLCanvasElement;
        tab: Common.Models.Tab;
        dimensions: Common.Models.Dimensions;
        x: number;
        y: number;
        listener: Common.Models.CanvasListener;
        readyCallbacks: Function[];
        widthChangeInterval: any;
        active: boolean;
        editorType: Playbook.Enums.EditorTypes;
        toolMode: Playbook.Enums.ToolModes;
        state: Common.Enums.State;
        constructor(width?: number, height?: number);
        abstract initialize($container: any): void;
        abstract setDimensions(): void;
        clear(): void;
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
        resize(): void;
        getWidth(): number;
        getHeight(): number;
        getXOffset(): number;
        setViewBox(center?: boolean): void;
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
        rhombus(x: number, y: number, width: number, height: number, absolute: boolean, offsetX?: number, offsetY?: number): any;
        ellipse(x: any, y: any, width: any, height: any, absolute: boolean, offsetX?: number, offsetY?: number): any;
        circle(x: number, y: number, radius: number, absolute: boolean, offsetX?: number, offsetY?: number): any;
        triangle(x: number, y: number, height: number, absolute: boolean, offsetX?: number, offsetY?: number): any;
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
        actionable: Common.Interfaces.IActionable;
        type: Common.Enums.LayerTypes;
        zIndex: number;
        layers: Common.Models.LayerCollection;
        visible: boolean;
        name: string;
        constructor(actionable: Common.Interfaces.IActionable, layerType: Common.Enums.LayerTypes);
        containsLayer(layer: Common.Models.Layer): boolean;
        containsLayerType(type: Common.Enums.LayerTypes): boolean;
        addLayer(layer: Common.Models.Layer, unique?: boolean): void;
        removeLayer(layer: Common.Models.Layer): void;
        removeLayerByType(type: Common.Enums.LayerTypes): void;
        removeAllLayers(): void;
        toFront(): void;
        toBack(): void;
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
        flip(): void;
    }
}
declare module Common.Models {
    class LayerCollection extends Common.Models.Collection<Common.Models.Layer> {
        constructor();
        dragAll(dx: number, dy: number): void;
        removeAll(): void;
        drop(): void;
        hide(): void;
    }
}
declare module Common.Models {
    class CanvasListener {
        context: Common.Interfaces.ICanvas;
        actions: any;
        constructor(context: Common.Interfaces.ICanvas);
        listen(actionId: string | number, fn: Function): void;
        invoke(actionId: string | number, data: any): void;
    }
}
declare module Common.Models {
    class Grid implements Common.Interfaces.IGrid {
        canvas: Common.Interfaces.ICanvas;
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
        constructor(canvas: Common.Interfaces.ICanvas, cols: number, rows: number);
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
        resize(sizingMode: Common.Enums.CanvasSizingModes): number;
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
    abstract class Field extends Common.Models.Actionable {
        canvas: Common.Interfaces.ICanvas;
        grid: Common.Interfaces.IGrid;
        scenario: Common.Models.Scenario;
        primaryPlayers: Common.Models.PlayerCollection;
        opponentPlayers: Common.Models.PlayerCollection;
        selectedElements: Common.Models.Collection<Common.Interfaces.IFieldElement>;
        layer: Common.Models.Layer;
        state: Common.Enums.State;
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
        constructor(canvas: Common.Interfaces.ICanvas);
        abstract initialize(): void;
        /**
         *
         * ABSTRACT METHODS
         *
         */
        abstract addPrimaryPlayer(placement: Common.Models.Placement, position: Team.Models.Position, assignment: Common.Models.Assignment): Common.Interfaces.IPlayer;
        abstract addOpponentPlayer(placement: Common.Models.Placement, position: Team.Models.Position, assignment: Common.Models.Assignment): Common.Interfaces.IPlayer;
        abstract useAssignmentTool(coords: Common.Models.Coordinates): any;
        draw(): void;
        clearPlayers(): void;
        clearPrimaryPlayers(): void;
        clearOpponentPlayers(): void;
        clearScenario(): void;
        clearPrimaryPlay(): void;
        clearOpponentPlay(): void;
        drawScenario(): void;
        updateScenario(scenario: Common.Models.Scenario): void;
        updatePlacements(): void;
        setCursorCoordinates(offsetX: number, offsetY: number): void;
        getPrimaryPlayerWithPositionIndex(index: number): Common.Interfaces.IPlayer;
        getOpponentPlayerWithPositionIndex(index: number): Common.Interfaces.IPlayer;
        applyPrimaryPlay(play: any): void;
        applyFormation(formation: Common.Models.Formation, playType: Playbook.Enums.PlayTypes): void;
        applyAssignmentGroup(assignmentGroup: Common.Models.AssignmentGroup, playType: Playbook.Enums.PlayTypes): void;
        applyPersonnel(personnel: Team.Models.Personnel, playType: Playbook.Enums.PlayTypes): void;
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
        /**
         * Returns the absolute y-coordinate of the line of scrimmage
         * @return {number} [description]
         */
        getLOSAbsolute(): number;
    }
}
declare module Common.Models {
    abstract class FieldElement extends Common.Models.Actionable implements Common.Interfaces.IFieldElement, Common.Interfaces.ILayerable {
        field: Common.Interfaces.IField;
        ball: Common.Interfaces.IBall;
        canvas: Common.Interfaces.ICanvas;
        grid: Common.Interfaces.IGrid;
        layer: Common.Models.Layer;
        relativeElement: Common.Interfaces.IFieldElement;
        name: string;
        private _originalScreenPositionX;
        private _originalScreenPositionY;
        constructor();
        initialize(field: Common.Interfaces.IField, relativeElement: Common.Interfaces.IFieldElement): void;
        getContextmenuUrl(): string;
        hasLayer(): boolean;
        getLayer(): Common.Models.Layer;
        getGraphics(): Common.Models.Graphics;
        hasPlacement(): boolean;
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
        hoverIn(e: any): void;
        hoverOut(e: any): void;
        click(e: any): void;
        toggleSelect(metaKey?: boolean): void;
        mousedown(e: any): void;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
        drop(): void;
        getOriginalScreenPosition(): {
            x: number;
            y: number;
        };
        setOriginalDragPosition(x: number, y: number): void;
        isOriginalDragPositionSet(): boolean;
        isOverDragThreshold(x: any, y: any): boolean;
    }
}
declare module Common.Models {
    abstract class Ball extends Common.Models.FieldElement {
        offset: number;
        constructor();
        initialize(field: Common.Interfaces.IField): void;
        draw(): void;
    }
}
declare module Common.Models {
    abstract class Ground extends Common.Models.FieldElement {
        constructor();
        initialize(field: Common.Interfaces.IField, relativeElement: Common.Interfaces.IFieldElement): void;
        draw(): void;
        click(e: any): void;
        getClickCoordinates(offsetX: number, offsetY: number): Common.Models.Coordinates;
        getClickAbsolute(offsetX: number, offsetY: number): Common.Models.Coordinates;
    }
}
declare module Common.Models {
    abstract class LineOfScrimmage extends Common.Models.FieldElement {
        constructor();
        initialize(field: Common.Interfaces.IField): void;
    }
}
declare module Common.Models {
    abstract class Endzone extends Common.Models.FieldElement {
        offsetY: number;
        constructor(offsetY: number);
        initialize(field: Common.Interfaces.IField): void;
        draw(): void;
    }
}
declare module Common.Models {
    abstract class Hashmark extends Common.Models.FieldElement {
        offsetX: number;
        start: number;
        yards: number;
        constructor(offsetX: number);
        initialize(field: Common.Interfaces.IField): void;
        draw(): void;
    }
}
declare module Common.Models {
    abstract class Sideline extends Common.Models.FieldElement {
        offsetX: number;
        constructor(offsetX: number);
        initialize(field: Common.Interfaces.IField): void;
        draw(): void;
    }
}
declare module Common.Models {
    class FieldSelectionBox extends Common.Models.FieldElement {
        constructor();
        initialize(field: Common.Interfaces.IField, relativeElement: Common.Interfaces.IFieldElement): void;
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
        placement: Common.Models.Placement;
        renderType: Common.Enums.RenderTypes;
        unitType: Team.Enums.UnitTypes;
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
        constructor(placement: Common.Models.Placement, position: Team.Models.Position, assignment: Common.Models.Assignment);
        initialize(field: Common.Interfaces.IField): void;
        flip(): void;
        remove(): void;
        drop(): void;
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
    class PlayerCollection extends Common.Models.Collection<Common.Interfaces.IPlayer> {
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
        canvas: Common.Interfaces.ICanvas;
        grid: Common.Interfaces.IGrid;
        nodes: Common.Models.LinkedList<Common.Interfaces.IRouteNode>;
        field: Common.Interfaces.IField;
        player: Common.Interfaces.IPlayer;
        routePath: Common.Interfaces.IRoutePath;
        layer: Common.Models.Layer;
        dragInitialized: boolean;
        type: Common.Enums.RouteTypes;
        renderType: Common.Enums.RenderTypes;
        unitType: Team.Enums.UnitTypes;
        constructor(dragInitialized?: boolean);
        abstract moveNodesByDelta(dx: number, dy: number): any;
        abstract setContext(player: Common.Interfaces.IPlayer): any;
        abstract initializeCurve(coords: Common.Models.Coordinates, flip?: boolean): any;
        toJson(): any;
        fromJson(json: any): any;
        setPlayer(player: Common.Interfaces.IPlayer): void;
        setPlacement(placement: Common.Models.Placement): void;
        refresh(): void;
        remove(): void;
        draw(): void;
        drawCurve(node: Common.Models.RouteNode): void;
        drawLine(): void;
        bringNodesToFront(): void;
        addNode(routeNode: Common.Interfaces.IRouteNode, render?: boolean): Common.Interfaces.IRouteNode;
        disableRootNode(routeNode: Common.Interfaces.IRouteNode): void;
        getLastNode(): any;
        flip(): void;
        getMixedStringFromNodes(nodeArray: Common.Interfaces.IRouteNode[]): string;
        getPathStringFromNodes(initialize: boolean, nodeArray: Common.Interfaces.IRouteNode[]): string;
        getCurveStringFromNodes(initialize: boolean, nodeArray: Common.Interfaces.IRouteNode[]): string;
        private _prepareNodesForPath(nodeArray);
    }
}
declare module Common.Models {
    abstract class RouteAction extends Common.Models.FieldElement {
        routeNode: Common.Interfaces.IRouteNode;
        action: Common.Enums.RouteNodeActions;
        constructor(action: Common.Enums.RouteNodeActions);
        initialize(field: Common.Interfaces.IField, routeNode: Common.Interfaces.IFieldElement): void;
        draw(): void;
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Common.Models {
    class RouteCollection extends Common.Models.Collection<Common.Interfaces.IRoute> {
        constructor();
        toJson(): any;
        fromJson(routes: any[]): void;
    }
}
declare module Common.Models {
    abstract class RouteControlPath extends Common.Models.FieldElement {
        routeNode: Common.Interfaces.IRouteNode;
        pathString: string;
        constructor();
        initialize(field: Common.Interfaces.IField, routeNode: Common.Interfaces.IFieldElement): void;
        toJson(): any;
        fromJson(json: any): void;
        draw(): void;
    }
}
declare module Common.Models {
    abstract class RouteNode extends Common.Models.FieldElement implements Common.Interfaces.IRouteNode, Common.Interfaces.ILinkedListNode<Common.Interfaces.IRouteNode> {
        next: Common.Interfaces.IRouteNode;
        prev: Common.Interfaces.IRouteNode;
        type: Common.Enums.RouteNodeTypes;
        routeAction: Common.Interfaces.IRouteAction;
        routeControlPath: Common.Interfaces.IRouteControlPath;
        route: Common.Interfaces.IRoute;
        renderType: Common.Enums.RenderTypes;
        relativeCoordinates: Common.Models.RelativeCoordinates;
        constructor(relativeCoordinates: Common.Models.RelativeCoordinates, type: Common.Enums.RouteNodeTypes);
        initialize(field: Common.Interfaces.IField, route: Common.Interfaces.IFieldElement): void;
        draw(): void;
        fromJson(json: any): void;
        toJson(): {
            relative: any;
            type: Enums.RouteNodeTypes;
            routeAction: any;
            renderType: Enums.RenderTypes;
            guid: string;
        };
        isCurveNode(): boolean;
        setPlacement(placement: Common.Models.Placement): void;
        refresh(): void;
        setAction(action: Common.Enums.RouteNodeActions): void;
        flip(): void;
    }
}
declare module Common.Models {
    abstract class RoutePath extends Common.Models.FieldElement {
        route: Common.Interfaces.IRoute;
        pathString: string;
        unitType: Team.Enums.UnitTypes;
        constructor();
        initialize(field: Common.Interfaces.IField, route: Common.Interfaces.IFieldElement): void;
        toJson(): any;
        remove(): void;
        fromJson(json: any): void;
        /**
         * Draws a RoutePath graphic onto the paper;
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
        flipped: boolean;
        index: number;
        constructor(rx: number, ry: number, relativeElement?: Common.Interfaces.IFieldElement, index?: number);
        copy(newPlacement?: Common.Models.Placement): Common.Models.Placement;
        toJson(): any;
        fromJson(json: any): any;
        refresh(): void;
        setRelativeElement(relativeElement: Common.Interfaces.IFieldElement): void;
        update(placement: Common.Models.Placement): void;
        updateFromAbsolute(ax: number, ay: number): void;
        updateFromCoordinates(x: number, y: number): void;
        updateFromRelative(rx: number, ry: number, relativeElement?: Common.Interfaces.IFieldElement): void;
        flip(): void;
    }
}
declare module Common.Models {
    class PlacementCollection extends Common.Models.Collection<Common.Models.Placement> {
        flipped: boolean;
        constructor();
        fromJson(placements: any): void;
        toJson(): any;
        flip(): void;
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
        /**
         * Gets the relative coordinates from this' coordinates TO the given coordinates.
         * Example: An element 3 grid squares to the right of 'this' would result in an x value of -3
         * @param {Common.Models.Coordinates}       coords  [description]
         * @param {Common.Interfaces.IFieldElement} element [description]
         */
        getRelativeTo(coords: Common.Models.Coordinates, element: Common.Interfaces.IFieldElement): Common.Models.RelativeCoordinates;
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
    class Graphics extends Common.Models.Modifiable implements Common.Interfaces.IDrawable {
        canvas: Common.Interfaces.ICanvas;
        grid: Common.Interfaces.IGrid;
        raphael: any;
        placement: Common.Models.Placement;
        location: Common.Models.Location;
        dimensions: Common.Models.Dimensions;
        containment: Common.Models.Containment;
        drawingHandler: Common.Models.DrawingHandler;
        font: any;
        set: Common.Models.GraphicsSet;
        snapping: boolean;
        /**
         *
         * Color information
         *
         */
        opacity: number;
        fill: string;
        fillOpacity: number;
        stroke: string;
        strokeWidth: number;
        /**
         *
         * Original color information to retain states during toggle/disable/select
         *
         */
        originalOpacity: number;
        originalFillOpacity: number;
        originalFill: string;
        originalStroke: string;
        originalStrokeWidth: number;
        /**
         *
         * Selection color information
         *
         */
        selectedFill: string;
        selectedFillOpacity: number;
        selectedStroke: string;
        selectedOpacity: number;
        disabledFill: string;
        disabledFillOpacity: number;
        disabledStroke: string;
        disabledOpacity: number;
        hoverOpacity: number;
        hoverFillOpacity: number;
        constructor(canvas: Common.Interfaces.ICanvas);
        toJson(): any;
        fromJson(json: any): any;
        /**
         * Alias for hasRaphael()
         * @return {boolean} [description]
         */
        hasGraphics(): boolean;
        hasRaphael(): boolean;
        hasSet(): boolean;
        getFill(): string;
        setFill(fill: string): Common.Models.Graphics;
        setOriginalFill(fill: string): Common.Models.Graphics;
        getFillOpacity(): number;
        setFillOpacity(opacity: number): Common.Models.Graphics;
        setOriginalFillOpacity(opacity: number): Common.Models.Graphics;
        getSelectedFill(): string;
        setSelectedFill(fill: string): Common.Models.Graphics;
        getSelectedFillOpacity(): number;
        setSelectedFillOpacity(opacity: number): Common.Models.Graphics;
        getStroke(): string;
        setStroke(stroke: string): Common.Models.Graphics;
        setOriginalStroke(stroke: string): Common.Models.Graphics;
        setSelectedStroke(stroke: string): Common.Models.Graphics;
        getStrokeWidth(): number;
        setStrokeWidth(width: number): Common.Models.Graphics;
        setOriginalStrokeWidth(width: number): Common.Models.Graphics;
        setHoverOpacity(opacity: number): Common.Models.Graphics;
        setHoverFillOpacity(opacity: number): Common.Models.Graphics;
        setHeight(height: number): Common.Models.Graphics;
        /**
         * Gets the current opacity
         * @return {number} [description]
         */
        getOpacity(): number;
        setOpacity(opacity: number): Common.Models.Graphics;
        setOriginalOpacity(opacity: number): Common.Models.Graphics;
        /**
         * Toggles the opacity for show/hide effect
         */
        toggleOpacity(): void;
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
        hasLocation(): boolean;
        hasPlacement(): boolean;
        setOffsetXY(x: number, y: number): void;
        initializePlacement(placement: Common.Models.Placement): void;
        updatePlacement(): void;
        updateFromAbsolute(ax: number, ay: number): void;
        updateFromRelative(rx: number, ry: number, relativeElement?: Common.Interfaces.IFieldElement): void;
        updateFromCoordinates(x: number, y: number): void;
        /**
         *
         * DRAWING METHODS
         *
         */
        path(path: string): Common.Models.Graphics;
        rect(): Common.Models.Graphics;
        rhombus(): Common.Models.Graphics;
        ellipse(): Common.Models.Graphics;
        circle(): Common.Models.Graphics;
        triangle(): Common.Models.Graphics;
        text(text: string): Common.Models.Graphics;
        refresh(): void;
        toFront(): Common.Models.Graphics;
        toBack(): Common.Models.Graphics;
        attr(attrs: any): Common.Models.Graphics;
        attrKeyValue(key: string, value: string): Common.Models.Graphics;
        setAttribute(attribute: string, value: string): void;
        getBBox(isWithoutTransforms?: boolean): {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        transform(ax: number, ay: number): void;
        resetTransform(): void;
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
        onhover(hoverIn: any, hoverOut: any, context: Common.Interfaces.IActionable): void;
        hoverIn(e: any): void;
        hoverOut(e: any): void;
        /**
         * Click events
         * @param {any} fn      [description]
         * @param {any} context [description]
         */
        onclick(fn: any, context: Common.Interfaces.IActionable): void;
        click(e: any): void;
        oncontextmenu(fn: any, context: Common.Interfaces.IActionable): void;
        contextmenu(e: any): void;
        /**
         * Mouse down event handler registration method
         * @param {any}                             fn      [description]
         * @param {Common.Interfaces.IActionable} context [description]
         */
        onmousedown(fn: any, context: Common.Interfaces.IActionable): void;
        /**
         * Mouse up event handler registration method
         * @param {any}                             fn      [description]
         * @param {Common.Interfaces.IActionable} context [description]
         */
        onmouseup(fn: any, context: Common.Interfaces.IActionable): void;
        /**
         * Default mousedown handler to be called if no other handlers are
         * registered with onmousedown
         * @param {any}                             e       [description]
         * @param {Common.Interfaces.IActionable} context [description]
         */
        mousedown(e: any): void;
        /**
         * Mouse move event handler registration method; attaches listeners
         * to be fired when the cursor moves over an element (such as for cursor tracking)
         * @param {any}                             fn      [description]
         * @param {Common.Interfaces.IActionable} context [description]
         */
        onmousemove(fn: any, context: Common.Interfaces.IActionable): void;
        /**
         * Default mouse move handler to be called if no other handlers are
         * registered with onmousedown
         * @param {any}                             e       [description]
         * @param {Common.Interfaces.IActionable} context [description]
         */
        mousemove(e: any): void;
        ondrag(dragMove: Function, dragStart: Function, dragEnd: Function, context: Common.Interfaces.IActionable): void;
        flip(rotate?: boolean): void;
        drop(): void;
        private cleanTransform();
    }
}
declare module Common.Models {
    class GraphicsSet {
        context: Common.Models.Graphics;
        canvas: Common.Interfaces.ICanvas;
        grid: Common.Interfaces.IGrid;
        items: Common.Models.Graphics[];
        length: number;
        raphaelSet: any;
        constructor(context: Common.Models.Graphics, ...args: Common.Models.Graphics[]);
        size(): number;
        push(...args: Common.Models.Graphics[]): void;
        empty(): void;
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
        rotation: number;
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
    class Quote {
        quote: string;
        author: string;
        constructor(quote: string, author: string);
    }
}
declare module Common.Models {
}
declare module Common.Enums {
    enum ImpaktDataTypes {
        Unknown = 0,
        PlaybookView = 1,
        Playbook = 2,
        Formation = 3,
        Set = 4,
        Play = 10,
        PlayTemplate = 98,
        Variant = 99,
        Team = 200,
        GenericEntity = 1000,
        League = 1010,
        Season = 1011,
        Opponent = 1012,
        Game = 1013,
        Position = 1014,
        PersonnelGroup = 1015,
        TeamMember = 1016,
        UnitType = 1017,
        Conference = 1018,
        Division = 1019,
        Scenario = 1020,
        MatchupPlaybook = 1021,
        Situation = 1022,
        Assignment = 1023,
        AssignmentGroup = 1024,
        GamePlan = 1030,
        PracticePlan = 1031,
        PracticeSchedule = 1032,
        ScoutCard = 1033,
        Drill = 1034,
        QBWristband = 1035,
        Plan = 1039,
        GameAnalysis = 1050,
        PlayByPlayAnalysis = 1051,
        Location = 1101,
        GenericSetting = 2000,
        User = 2010,
        SecureUser = 2011,
        Account = 2020,
        Organization = 2021,
    }
    enum State {
        Unknown = 0,
        Ready = 1,
        Loaded = 2,
        Initialized = 3,
        Constructed = 4,
        Updating = 5,
    }
    enum AssociationTypes {
        Any = -1,
        Unknown = 0,
        Peer = 1,
        Dependency = 2,
    }
    enum DimensionTypes {
        Square = 0,
        Circle = 1,
        Ellipse = 2,
    }
    /**
     * Allows the canvas to be scaled/sized differently.
     * To specify an initial canvas size, for example,
     * Canvas is initialized with MaxContainerWidth,
     * which causes the canvas to determine its width based
     * on the current maximum width of its parent container. On the
     * contrary, the canvas can be told to set its width based
     * on a given, target grid cell size. For example, if the target
     * grid width is 20px and the grid is 50 cols, the resulting
     * canvas width will calculate to 1000px.
     */
    enum CanvasSizingModes {
        TargetGridWidth = 0,
        MaxContainerWidth = 1,
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
        PlayerIcon = 3,
        PlayerPersonnelLabel = 4,
        PlayerIndexLabel = 5,
        PlayerCoordinates = 6,
        PlayerRelativeCoordinatesLabel = 7,
        PlayerSelectionBox = 8,
        PlayerRoute = 9,
        PlayerSecondaryRoutes = 10,
        PlayerAlternateRoutes = 11,
        PlayerRouteAction = 12,
        PlayerRouteNode = 13,
        PlayerRoutePath = 14,
        PlayerRouteControlPath = 15,
        PrimaryPlayer = 16,
        PrimaryPlayerIcon = 17,
        PrimaryPlayerLabel = 18,
        PrimaryPlayerCoordinates = 19,
        PrimaryPlayerRelativeCoordinatesLabel = 20,
        PrimaryPlayerSelectionBox = 21,
        PrimaryPlayerRoute = 22,
        PrimaryPlayerSecondaryRoutes = 23,
        PrimaryPlayerAlternateRoutes = 24,
        PrimaryPlayerRouteAction = 25,
        PrimaryPlayerRouteNode = 26,
        PrimaryPlayerRoutePath = 27,
        PrimaryPlayerRouteControlPath = 28,
        OpponentPlayer = 29,
        OpponentPlayerIcon = 30,
        OpponentPlayerLabel = 31,
        OpponentPlayerCoordinates = 32,
        OpponentPlayerRelativeCoordinatesLabel = 33,
        OpponentPlayerSelectionBox = 34,
        OpponentPlayerRoute = 35,
        OpponentPlayerSecondaryRoutes = 36,
        OpponentPlayerAlternateRoutes = 37,
        OpponentPlayerRouteAction = 38,
        OpponentPlayerRouteNode = 39,
        OpponentPlayerRoutePath = 40,
        OpponentPlayerRouteControlPath = 41,
        Ball = 42,
        Field = 43,
        Sideline = 44,
        Hashmark = 45,
        SidelineHashmark = 46,
        Endzone = 47,
        LineOfScrimmage = 48,
        Assignment = 49,
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
    }
    enum RenderTypes {
        Preview = 0,
        Editor = 1,
        Unknown = 2,
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
    enum Actions {
        None = 0,
        Create = 1,
        Save = 2,
        Overwrite = 3,
        Copy = 4,
        Edit = 5,
        Update = 6,
        Delete = 7,
        View = 8,
        Details = 9,
        Select = 10,
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
    const PLAY_CONTEXTMENU_TEMPLATE_URL: string;
    const PLAYER_CONTEXTMENU_TEMPLATE_URL: string;
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
        /**
         * Returns a random number between min (inclusive) and max (inclusive)
         * @param  {number} min [description]
         * @param  {number} max [description]
         * @return {number}     [description]
         */
        static randomInt(min: number, max: number): number;
        static randomId(): number;
        static camelCaseToSpace(string: string, capitalizeFirst?: boolean): string;
        static sentenceCase(str: string): string;
        static convertEnumToList(obj: any): {};
        static getEnumerationsOnly(obj: any): {};
        static getEnumerationsAsArray(obj: any): any[];
        static parseEnumFromString(enumString: string): Window;
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
        static isNotNullOrUndefined(obj: any): boolean;
        static isNullOrUndefined(obj: any): boolean;
        static isNull(obj: any): boolean;
        static isUndefined(obj: any): boolean;
        static isEmptyString(str: string): boolean;
        static isNotEmptyString(str: string): boolean;
        /**
         * Iterates over the given array and removes any
         * duplicate entries
         *
         * @param  {any[]} array [description]
         * @return {any[]}       [description]
         */
        static uniqueArray(array: any[]): any[];
    }
}
declare module Common.UI {
    const SCROLL_BAR_SIZE: number;
}
declare module Playbook.Models {
    class PlaybookAPIOptions extends Common.Models.APIOptions {
        scenario: Common.API.Actions;
        play: Common.API.Actions;
        formation: Common.API.Actions;
        assignmentGroup: Common.API.Actions;
        constructor();
    }
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
        constructor(offsetY: number);
        initialize(field: Common.Interfaces.IField): void;
    }
}
declare module Playbook.Models {
    class PreviewEndzone extends Common.Models.Endzone implements Common.Interfaces.IEndzone {
        constructor(offsetY: number);
        initialize(field: Common.Interfaces.IField): void;
    }
}
declare module Playbook.Models {
    class EditorBall extends Common.Models.Ball implements Common.Interfaces.IBall {
        constructor();
        initialize(field: Common.Interfaces.IField): void;
        draw(): void;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
    }
}
declare module Playbook.Models {
    class PreviewBall extends Common.Models.Ball implements Common.Interfaces.IBall {
        constructor();
        initialize(field: Common.Interfaces.IField): void;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
    }
}
declare module Playbook.Models {
    class EditorField extends Common.Models.Field implements Common.Interfaces.IField {
        type: Team.Enums.UnitTypes;
        zoom: number;
        constructor(canvas: Common.Interfaces.ICanvas);
        initialize(): void;
        draw(): void;
        useAssignmentTool(coords: Common.Models.Coordinates): void;
        private _addAssignmentToPlayer(player, relativeCoords);
        export(): any;
        placeAtYardline(element: any, yardline: any): void;
        remove(): void;
        getBBoxCoordinates(): void;
        addPrimaryPlayer(placement: Common.Models.Placement, position: Team.Models.Position, assignment: Common.Models.Assignment): Common.Interfaces.IPlayer;
        addOpponentPlayer(placement: Common.Models.Placement, position: Team.Models.Position, assignment: Common.Models.Assignment): Common.Interfaces.IPlayer;
    }
}
declare module Playbook.Models {
    class EditorCanvas extends Common.Models.Canvas implements Common.Interfaces.ICanvas {
        constructor(width?: number, height?: number);
        initialize($container?: any): void;
        setDimensions(): void;
        resetHeight(): void;
        getToolMode(): Enums.ToolModes;
        getToolModeName(): string;
    }
}
declare module Playbook.Models {
    class PreviewField extends Common.Models.Field implements Common.Interfaces.IField {
        constructor(canvas: Common.Interfaces.ICanvas);
        initialize(): void;
        draw(): void;
        addPrimaryPlayer(placement: Common.Models.Placement, position: Team.Models.Position, assignment: Common.Models.Assignment): Common.Interfaces.IPlayer;
        addOpponentPlayer(placement: Common.Models.Placement, position: Team.Models.Position, assignment: Common.Models.Assignment): Common.Interfaces.IPlayer;
        useAssignmentTool(coords: Common.Models.Coordinates): void;
    }
}
declare module Playbook.Models {
    class PreviewCanvas extends Common.Models.Canvas implements Common.Interfaces.ICanvas {
        constructor();
        initialize($container: any): void;
        setDimensions(): void;
    }
}
declare module Playbook.Models {
    class PreviewLineOfScrimmage extends Common.Models.LineOfScrimmage {
        constructor();
        initialize(field: Common.Interfaces.IField): void;
        draw(): void;
    }
}
declare module Playbook.Models {
    class EditorLineOfScrimmage extends Common.Models.LineOfScrimmage {
        constructor();
        initialize(field: Common.Interfaces.IField): void;
        draw(): void;
        hoverIn(e: any): void;
        hoverOut(e: any): void;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
    }
}
declare module Playbook.Models {
    class PreviewGround extends Common.Models.Ground {
        constructor();
        draw(): void;
        hoverIn(e: any): void;
        hoverOut(e: any): void;
        click(e: any): void;
        mousedown(e: any): void;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
    }
}
declare module Playbook.Models {
    class EditorGround extends Common.Models.Ground {
        selectionBox: Common.Models.FieldSelectionBox;
        constructor();
        initialize(field: Common.Interfaces.IField, relativeElement: Common.Interfaces.IFieldElement): void;
        draw(): void;
        mousemove(e: any): void;
        click(e: any): void;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
    }
}
declare module Playbook.Models {
    class PreviewHashmark extends Common.Models.Hashmark implements Common.Interfaces.IHashmark {
        constructor(offsetX: number);
    }
}
declare module Playbook.Models {
    class EditorHashmark extends Common.Models.Hashmark implements Common.Interfaces.IHashmark {
        constructor(offsetX: number);
    }
}
declare module Playbook.Models {
    class PreviewSideline extends Common.Models.Sideline {
        constructor(offsetX: number);
        initialize(field: Common.Interfaces.IField): void;
    }
}
declare module Playbook.Models {
    class EditorSideline extends Common.Models.Sideline {
        constructor(offsetX: number);
    }
}
declare module Playbook.Models {
    class EditorPlayer extends Common.Models.Player implements Common.Interfaces.IPlayer {
        constructor(placement: Common.Models.Placement, position: Team.Models.Position, assignment: Common.Models.Assignment);
        initialize(field: Common.Interfaces.IField): void;
        draw(): void;
        remove(): void;
        mousedown(e: any): void;
        click(e: any): any;
        toggleSelect(metaKey: boolean): void;
        deselect(): void;
        select(): void;
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
        setAssignment(assignment: Common.Models.Assignment): void;
    }
}
declare module Playbook.Models {
    class PreviewPlayer extends Common.Models.Player implements Common.Interfaces.IPlayer, Common.Interfaces.IPlaceable, Common.Interfaces.ILayerable {
        constructor(placement: Common.Models.Placement, position: Team.Models.Position, assignment: Common.Models.Assignment);
        initialize(field: Common.Interfaces.IField): void;
        draw(): void;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
        setAssignment(assignment: Common.Models.Assignment): void;
    }
}
declare module Playbook.Models {
    class EditorPlayerIcon extends Common.Models.PlayerIcon {
        constructor(player: Common.Interfaces.IPlayer);
        draw(): void;
        click(e: any): void;
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
        constructor();
        setPlayer(player: Common.Interfaces.IPlayer): void;
        addNode(routeNode: Common.Interfaces.IRouteNode, render?: boolean): Common.Interfaces.IRouteNode;
        setContext(player: Common.Interfaces.IPlayer): void;
        moveNodesByDelta(dx: number, dy: number): void;
        initializeCurve(coords: Common.Models.Coordinates, flip?: boolean): void;
    }
}
declare module Playbook.Models {
    class EditorRoute extends Common.Models.Route implements Common.Interfaces.IRoute {
        constructor(dragInitialized?: boolean);
        setPlayer(player: Common.Interfaces.IPlayer): void;
        setContext(player: Common.Interfaces.IPlayer): void;
        addNode(routeNode: Common.Interfaces.IRouteNode, render?: boolean): Common.Interfaces.IRouteNode;
        initializeCurve(coords: Common.Models.Coordinates, flip?: boolean): void;
        moveNodesByDelta(dx: number, dy: number): void;
    }
}
declare module Playbook.Models {
    class PreviewRouteNode extends Common.Models.RouteNode implements Common.Interfaces.IRouteNode {
        constructor(relativeCoordinates: Common.Models.RelativeCoordinates, type: Common.Enums.RouteNodeTypes);
        initialize(field: Common.Interfaces.IField, route: Common.Interfaces.IFieldElement): void;
    }
}
declare module Playbook.Models {
    class EditorRouteNode extends Common.Models.RouteNode implements Common.Interfaces.IRouteNode {
        constructor(relativeCoordinates: Common.Models.RelativeCoordinates, type: Common.Enums.RouteNodeTypes);
        initialize(field: Common.Interfaces.IField, route: Common.Interfaces.IFieldElement): void;
        draw(): void;
        hoverIn(e: any): void;
        hoverOut(e: any): void;
        click(e: any): void;
        contextmenu(e: any): void;
        dragMove(dx: any, dy: any, posx: any, posy: any, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
        drop(): void;
    }
}
declare module Playbook.Models {
    class PreviewRoutePath extends Common.Models.RoutePath implements Common.Interfaces.IRoutePath {
        constructor();
        initialize(field: Common.Interfaces.IField, route: Common.Interfaces.IFieldElement): void;
    }
}
declare module Playbook.Models {
    class EditorRoutePath extends Common.Models.RoutePath implements Common.Interfaces.IRoutePath {
        constructor();
        initialize(field: Common.Interfaces.IField, route: Common.Interfaces.IFieldElement): void;
        draw(): void;
        hoverIn(e: any): void;
        hoverOut(e: any): void;
    }
}
declare module Playbook.Models {
    class PreviewRouteAction extends Common.Models.RouteAction implements Common.Interfaces.IRouteAction {
        constructor(action: Common.Enums.RouteNodeActions);
        initialize(field: Common.Interfaces.IField, relativeElement: Common.Interfaces.IFieldElement): void;
        draw(): void;
    }
}
declare module Playbook.Models {
    class EditorRouteAction extends Common.Models.RouteAction implements Common.Interfaces.IRouteAction {
        constructor(action: Common.Enums.RouteNodeActions);
        initialize(field: Common.Interfaces.IField, relativeElement: Common.Interfaces.IFieldElement): void;
    }
}
declare module Playbook.Models {
    class PreviewRouteControlPath extends Common.Models.RouteControlPath implements Common.Interfaces.IRouteControlPath {
        constructor();
        draw(): void;
    }
}
declare module Playbook.Models {
    class EditorRouteControlPath extends Common.Models.RouteControlPath implements Common.Interfaces.IRouteControlPath {
        constructor();
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
        Any = 0,
        Formation = 1,
        Assignment = 2,
        Play = 3,
        Scenario = 4,
    }
    enum PlayTypes {
        Any = 0,
        Primary = 1,
        Opponent = 2,
        Unknown = 3,
    }
    enum PlayerIconTypes {
        CircleEditor = 0,
        SquareEditor = 1,
        TriangleEditor = 2,
        CirclePreview = 3,
        SquarePreview = 4,
        TrianglePreview = 5,
    }
    enum Hashmark {
        Left = 0,
        Center = 1,
        Right = 2,
    }
    enum FieldZones {
        Goalline = 0,
        Redzone = 1,
        Midfield = 2,
        Endzone = 3,
        LineOfScrimmage = 4,
    }
}
declare module Playbook.Constants {
    const FIELD_COLS_FULL: number;
    const FIELD_ROWS_FULL: number;
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
    class TeamModel extends Common.Models.AssociableEntity {
        teamType: Team.Enums.TeamTypes;
        records: Team.Models.TeamRecordCollection;
        division: League.Models.Division;
        divisionGuid: string;
        location: League.Models.Location;
        locationGuid: string;
        constructor();
        toJson(): any;
        fromJson(json: any): any;
        setDivision(division: League.Models.Division): void;
        setLocation(location: League.Models.Location): void;
    }
}
declare module Team.Models {
    class TeamModelCollection extends Common.Models.ActionableCollection<Team.Models.TeamModel> {
        teamType: Team.Enums.TeamTypes;
        constructor();
        toJson(): {
            teamType: Enums.TeamTypes;
            guid: string;
            teams: any;
        };
        fromJson(json: any): void;
    }
}
declare module Team.Models {
    class TeamRecord extends Common.Models.Modifiable {
        wins: number;
        losses: number;
        season: number;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Team.Models {
    class TeamRecordCollection extends Common.Models.Collection<Team.Models.TeamRecord> {
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Team.Models {
    class PrimaryTeam extends Team.Models.TeamModel {
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Team.Models {
    class OpponentTeam extends Team.Models.TeamModel {
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Team.Models {
    class Personnel extends Common.Models.AssociableEntity {
        unitType: Team.Enums.UnitTypes;
        parentRK: number;
        editorType: Playbook.Enums.EditorTypes;
        positions: Team.Models.PositionCollection;
        setType: Common.Enums.SetTypes;
        constructor(unitType: Team.Enums.UnitTypes);
        copy(newPersonnel?: Team.Models.Personnel): Team.Models.Personnel;
        hasPositions(): boolean;
        update(personnel: Team.Models.Personnel): void;
        fromJson(json: any): any;
        toJson(): any;
        setDefault(): void;
        setUnitType(unitType: Team.Enums.UnitTypes): void;
    }
}
declare module Team.Models {
    class PersonnelCollection extends Common.Models.Collection<Team.Models.Personnel> {
        unitType: Team.Enums.UnitTypes;
        setType: Common.Enums.SetTypes;
        constructor(unitType: Team.Enums.UnitTypes);
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
        constructor(unitType: Team.Enums.UnitTypes, options?: any);
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
        getByUnitType(type: Team.Enums.UnitTypes): PositionCollection;
    }
}
declare module Team.Models {
    class PositionCollection extends Common.Models.Collection<Team.Models.Position> {
        unitType: Team.Enums.UnitTypes;
        constructor(unitType: Team.Enums.UnitTypes);
        listPositions(): any[];
        toJson(): any;
        fromJson(positions: any): any;
        setDefault(): void;
    }
}
declare module Team.Models {
    class UnitType extends Common.Models.Modifiable {
        unitType: Team.Enums.UnitTypes;
        name: string;
        constructor(unitType: Team.Enums.UnitTypes, name: string);
        static getUnitTypes(): {};
        toJson(): any;
        fromJson(json: any): any;
    }
}
declare module Team.Models {
    class UnitTypeCollection extends Common.Models.Collection<Team.Models.UnitType> {
        constructor();
        getByUnitType(unitTypeValue: Team.Enums.UnitTypes): UnitType;
        getAssociatedPlaybooks(): Common.Models.PlaybookModelCollection;
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Team.Interfaces {
}
declare module Team.Enums {
    enum UnitTypes {
        Offense = 0,
        Defense = 1,
        SpecialTeams = 2,
        Other = 3,
        Mixed = 4,
    }
    enum TeamTypes {
        Primary = 0,
        Opponent = 1,
        Other = 2,
        Mixed = 3,
    }
}
declare module Team {
}
declare module Analysis {
}
declare module Home {
}
declare module Planning.Interfaces {
    interface IPlanningEditorToggleItem {
        label: string;
        type: Planning.Enums.PlanningEditorToggleTypes;
    }
}
declare module Planning.Interfaces {
}
declare module Planning.Models {
    abstract class PlanningEditorToggleItem extends Common.Models.Actionable implements Planning.Interfaces.IPlanningEditorToggleItem {
        label: string;
        type: Planning.Enums.PlanningEditorToggleTypes;
        constructor(label: string);
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Planning.Models {
    class PlanningEditorToggleItemCollection extends Common.Models.ActionableCollection<Planning.Models.PlanningEditorToggleItem> {
        constructor();
        fromJson(json: any): void;
    }
}
declare module Planning.Models {
    class Plan extends Common.Models.AssociableEntity {
        game: Season.Models.Game;
        gameGuid: string;
        start: Common.Models.Datetime;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
        setGame(game: Season.Models.Game): void;
    }
}
declare module Planning.Models {
    class PlanCollection extends Common.Models.ActionableCollection<Planning.Models.Plan> {
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Planning.Models {
    class PracticePlan extends Common.Models.AssociableEntity {
        plan: Planning.Models.Plan;
        planGuid: string;
        start: Common.Models.Datetime;
        titleData: Planning.Models.PracticePlanTitleData;
        situationData: Planning.Models.PracticePlanSituationData;
        offensiveData: Planning.Models.PracticePlanOffensiveData;
        defensiveData: Planning.Models.PracticePlanDefensiveData;
        items: Planning.Models.PracticePlanItemCollection;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
        private _populateItems();
        setPlan(plan: Planning.Models.Plan): void;
    }
}
declare module Planning.Models {
    class PracticePlanCollection extends Common.Models.ActionableCollection<Planning.Models.PracticePlan> {
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Planning.Models {
    class PracticePlanItem extends Common.Models.Modifiable {
        index: number;
        situationData: Planning.Models.PracticePlanSituationData;
        offensiveData: Planning.Models.PracticePlanOffensiveData;
        defensiveData: Planning.Models.PracticePlanDefensiveData;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
        getNumber(): number;
    }
}
declare module Planning.Models {
    class PracticePlanItemCollection extends Common.Models.Collection<Planning.Models.PracticePlanItem> {
        constructor(count?: number);
        fromJson(json: any): void;
    }
}
declare module Planning.Models {
    class PracticePlanTitleData extends Common.Models.Storable {
        periodName: Planning.Models.PracticePlanPeriodName;
        periodNumber: Planning.Models.PracticePlanPeriodNumber;
        periodReps: Planning.Models.PracticePlanPeriodReps;
        periodStart: Planning.Models.PracticePlanPeriodStart;
        periodFinish: Planning.Models.PracticePlanPeriodFinish;
        date: Planning.Models.PracticePlanDate;
        location: Planning.Models.PracticePlanLocation;
        opponent: Planning.Models.PracticePlanOpponent;
        duration: Planning.Models.PracticePlanDuration;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
        toCollection(): Planning.Models.PlanningEditorToggleItemCollection;
    }
    class PracticePlanPeriodName extends Planning.Models.PlanningEditorToggleItem {
        name: string;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
    class PracticePlanPeriodNumber extends Planning.Models.PlanningEditorToggleItem {
        number: number;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
    class PracticePlanPeriodReps extends Planning.Models.PlanningEditorToggleItem {
        reps: number;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
    class PracticePlanPeriodStart extends Planning.Models.PlanningEditorToggleItem {
        start: number;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
    class PracticePlanPeriodFinish extends Planning.Models.PlanningEditorToggleItem {
        finish: number;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
    class PracticePlanDate extends Planning.Models.PlanningEditorToggleItem {
        date: Common.Models.Datetime;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
    class PracticePlanLocation extends Planning.Models.PlanningEditorToggleItem {
        location: League.Models.Location;
        locationGuid: string;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
        setLocation(location: League.Models.Location): void;
    }
    class PracticePlanOpponent extends Planning.Models.PlanningEditorToggleItem {
        opponent: Team.Models.TeamModel;
        opponentGuid: string;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
        setOpponent(opponent: Team.Models.TeamModel): void;
    }
    class PracticePlanDuration extends Planning.Models.PlanningEditorToggleItem {
        duration: number;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Planning.Models {
    class PracticePlanSituationData extends Common.Models.Storable {
        playCount: Planning.Models.PracticePlanPlayCount;
        hashmark: Planning.Models.PracticePlanHashmark;
        down: Planning.Models.PracticePlanDown;
        distance: Planning.Models.PracticePlanDistance;
        yardline: Planning.Models.PracticePlanYardline;
        fieldZone: Planning.Models.PracticePlanFieldZone;
        time: Planning.Models.PracticePlanTime;
        tempo: Planning.Models.PracticePlanTempo;
        scoreDifference: Planning.Models.PracticePlanScoreDifference;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
        toCollection(): Planning.Models.PlanningEditorToggleItemCollection;
    }
    class PracticePlanPlayCount extends Planning.Models.PlanningEditorToggleItem {
        count: number;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
    class PracticePlanHashmark extends Planning.Models.PlanningEditorToggleItem {
        hashmark: Playbook.Enums.Hashmark;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
    class PracticePlanDown extends Planning.Models.PlanningEditorToggleItem {
        down: number;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
    class PracticePlanDistance extends Planning.Models.PlanningEditorToggleItem {
        distance: number;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
    class PracticePlanYardline extends Planning.Models.PlanningEditorToggleItem {
        yardline: number;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
    class PracticePlanFieldZone extends Planning.Models.PlanningEditorToggleItem {
        fieldZone: Playbook.Enums.FieldZones;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
    class PracticePlanTime extends Planning.Models.PlanningEditorToggleItem {
        time: number;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
    class PracticePlanTempo extends Planning.Models.PlanningEditorToggleItem {
        tempo: Planning.Enums.Tempo;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
    class PracticePlanScoreDifference extends Planning.Models.PlanningEditorToggleItem {
        difference: number;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Planning.Models {
    class PracticePlanOffensiveData extends Common.Models.Storable {
        personnel: Planning.Models.PracticePlanPersonnel;
        formation: Planning.Models.PracticePlanFormation;
        play: Planning.Models.PracticePlanPlay;
        wristband: Planning.Models.PracticePlanWristband;
        depth: Planning.Models.PracticePlanDepth;
        read: Planning.Models.PracticePlanRead;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
        toCollection(): Planning.Models.PlanningEditorToggleItemCollection;
    }
    class PracticePlanWristband extends Planning.Models.PlanningEditorToggleItem {
        wristband: Common.Models.NotImplementedClass;
        wristbandGuid: string;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
        setWristband(wristband: Common.Models.NotImplementedClass): void;
    }
    class PracticePlanRead extends Planning.Models.PlanningEditorToggleItem {
        read: Common.Models.NotImplementedClass;
        readGuid: string;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
        setRead(read: Common.Models.NotImplementedClass): void;
    }
    class PracticePlanDepth extends Planning.Models.PlanningEditorToggleItem {
        depth: Common.Models.NotImplementedClass;
        depthGuid: string;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
        setDepth(depth: Common.Models.NotImplementedClass): void;
    }
    class PracticePlanPlay extends Planning.Models.PlanningEditorToggleItem {
        play: Common.Interfaces.IPlay;
        playGuid: string;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
        setPlay(play: Common.Models.Play): void;
    }
    class PracticePlanFormation extends Planning.Models.PlanningEditorToggleItem {
        formation: Common.Models.Formation;
        formationGuid: string;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
        setFormation(formation: Common.Models.Formation): void;
    }
    class PracticePlanPersonnel extends Planning.Models.PlanningEditorToggleItem {
        personnel: Team.Models.Personnel;
        personnelGuid: string;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
        setPersonnel(personnel: Team.Models.Personnel): void;
    }
}
declare module Planning.Models {
    class PracticePlanDefensiveData extends Common.Models.Storable {
        personnel: Planning.Models.PracticePlanPersonnel;
        formation: Planning.Models.PracticePlanFormation;
        play: Planning.Models.PracticePlanPlay;
        pressure: Planning.Models.PracticePlanPressure;
        coverage: Planning.Models.PracticePlanCoverage;
        read: Planning.Models.PracticePlanRead;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
        toCollection(): Planning.Models.PlanningEditorToggleItemCollection;
    }
    class PracticePlanPressure extends Planning.Models.PlanningEditorToggleItem {
        pressure: Common.Models.NotImplementedClass;
        pressureGuid: string;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
        setPressure(pressure: Common.Models.NotImplementedClass): void;
    }
    class PracticePlanCoverage extends Planning.Models.PlanningEditorToggleItem {
        coverage: Common.Models.NotImplementedClass;
        coverageGuid: string;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
        setCoverage(coverage: Common.Models.NotImplementedClass): void;
    }
}
declare module Planning.Models {
    class GamePlan extends Common.Models.AssociableEntity {
        plan: Planning.Models.Plan;
        planGuid: string;
        start: Common.Models.Datetime;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
        setPlan(plan: Planning.Models.Plan): void;
    }
}
declare module Planning.Models {
    class GamePlanCollection extends Common.Models.ActionableCollection<Planning.Models.GamePlan> {
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Planning.Models {
    class PracticeSchedule extends Common.Models.AssociableEntity {
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Planning.Models {
    class PracticeScheduleCollection extends Common.Models.ActionableCollection<Planning.Models.PracticeSchedule> {
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Planning.Models {
    class ScoutCard extends Common.Models.AssociableEntity {
        plan: Planning.Models.Plan;
        planGuid: string;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
        setPlan(plan: Planning.Models.Plan): void;
    }
}
declare module Planning.Models {
    class ScoutCardCollection extends Common.Models.ActionableCollection<Planning.Models.ScoutCard> {
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Planning.Models {
    class QBWristband extends Common.Models.AssociableEntity {
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Planning.Models {
    class QBWristbandCollection extends Common.Models.ActionableCollection<Planning.Models.QBWristband> {
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Planning.Models {
    class PlanningEditorTab extends Common.Models.Actionable implements Common.Interfaces.ICollectionItem {
        data: Common.Interfaces.IActionable;
        private _closeCallbacks;
        constructor(data: Common.Interfaces.IActionable);
    }
}
declare module Planning.Models {
    class PlanningEditorTabCollection extends Common.Models.ActionableCollection<Planning.Models.PlanningEditorTab> {
        constructor();
        close(tab: Common.Models.Tab): void;
    }
}
declare module Planning.Models {
}
declare module Planning.Enums {
    enum PlanningEditorToggleTypes {
        Unknown = 0,
        PeriodName = 1,
        PeriodNumber = 2,
        PeriodReps = 3,
        PeriodStart = 4,
        PeriodFinish = 5,
        Date = 6,
        Location = 7,
        Opponent = 8,
        Duration = 9,
        PlayCount = 10,
        Hashmark = 11,
        Down = 12,
        Distance = 13,
        Yardline = 14,
        FieldZone = 15,
        Time = 16,
        Tempo = 17,
        ScoreDifference = 18,
        Personnel = 19,
        Formation = 20,
        Play = 21,
        Wristband = 22,
        Depth = 23,
        Read = 24,
        Pressure = 25,
        Coverage = 26,
    }
    enum Tempo {
        Normal = 0,
        HurryUp = 1,
        NoHuddle = 2,
    }
}
declare module Planning.Constants {
    const DEFAULT_PRACTICE_PLAN_ITEMS_LENGTH: number;
}
declare module Planning {
}
declare module Navigation {
}
declare module Navigation.Models {
    class NavigationItem extends Common.Models.Modifiable {
        name: string;
        label: string;
        glyphicon: string;
        path: string;
        active: boolean;
        activationCallback: Function;
        constructor(name: string, label: string, glyphicon: string, path: string, active: boolean, activationCallback: Function);
        activate(): void;
        deactivate(): void;
        toggleActivation(): void;
    }
}
declare module Navigation.Models {
    class NavigationItemCollection extends Common.Models.Collection<Navigation.Models.NavigationItem> {
        constructor();
        activate(navItem: Navigation.Models.NavigationItem): void;
        getActive(): Navigation.Models.NavigationItem;
    }
}
declare module Nav {
}
declare module Search {
}
declare module Season.Models {
    class SeasonModel extends Common.Models.AssociableEntity {
        year: number;
        start: Common.Models.Datetime;
        weeks: Season.Models.WeekCollection;
        constructor();
        copy(newSeason?: Season.Models.SeasonModel): Season.Models.SeasonModel;
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Season.Models {
    class SeasonModelCollection extends Common.Models.ActionableCollection<Season.Models.SeasonModel> {
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Season.Models {
    class Week extends Common.Models.Actionable {
        name: string;
        number: number;
        season: Season.Models.SeasonModel;
        seasonGuid: string;
        start: Common.Models.Datetime;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
        getFormattedName(): string;
        setSeason(season: Season.Models.SeasonModel): void;
        /**
         * Takes the given start Datetime and then increments the created
         * date with the given number of weeks (weekOffset)
         *
         * @param {Date}   start      [description]
         * @param {number} weekOffset [description]
         */
        incrementWeek(start: Common.Models.Datetime, addWeeks: number): void;
        /**
         * Takes the given start Datetime and subtracts the given number of
         * weeks from that date.
         *
         * @param {Common.Models.Datetime} start         [description]
         * @param {number}                 subtractWeeks [description]
         */
        decrementWeek(start: Common.Models.Datetime, subtractWeeks: number): void;
        getFormattedDate(): string;
    }
}
declare module Season.Models {
    class WeekCollection extends Common.Models.ActionableCollection<Season.Models.Week> {
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Season.Models {
    class Game extends Common.Models.AssociableEntity {
        season: Season.Models.SeasonModel;
        seasonGuid: string;
        outcome: any;
        home: Team.Models.TeamModel;
        homeGuid: string;
        away: Team.Models.TeamModel;
        awayGuid: string;
        location: League.Models.Location;
        locationGuid: string;
        week: Season.Models.Week;
        weekGuid: string;
        start: Common.Models.Datetime;
        constructor();
        copy(newGame?: Season.Models.Game): Season.Models.Game;
        toJson(): any;
        fromJson(json: any): void;
        getFormattedName(): string;
        setSeason(season: Season.Models.SeasonModel): void;
        setWeek(week: Season.Models.Week): void;
        setLocation(location: League.Models.Location): void;
        setHome(home: Team.Models.TeamModel): void;
        setAway(away: Team.Models.TeamModel): void;
    }
}
declare module Season.Models {
    class GameCollection extends Common.Models.ActionableCollection<Season.Models.Game> {
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Season.Models {
}
declare module Season {
}
declare module League.Models {
    class LeagueModel extends Common.Models.AssociableEntity implements Common.Interfaces.IAssociable {
        constructor();
        copy(newLeague?: League.Models.LeagueModel): League.Models.LeagueModel;
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module League.Models {
    class LeagueModelCollection extends Common.Models.ActionableCollection<League.Models.LeagueModel> {
        constructor();
    }
}
declare module League.Models {
    class Conference extends Common.Models.AssociableEntity {
        png: string;
        league: League.Models.LeagueModel;
        leagueGuid: string;
        constructor();
        copy(newConference?: League.Models.Conference): League.Models.Conference;
        toJson(): any;
        fromJson(json: any): void;
        setLeague(league: League.Models.LeagueModel): void;
    }
}
declare module League.Models {
    class ConferenceCollection extends Common.Models.ActionableCollection<League.Models.Conference> {
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module League.Models {
    class Division extends Common.Models.AssociableEntity {
        png: string;
        conference: League.Models.Conference;
        conferenceGuid: string;
        constructor();
        copy(newDivision?: League.Models.Division): League.Models.Division;
        toJson(): any;
        fromJson(json: any): void;
        setConference(conference: League.Models.Conference): void;
    }
}
declare module League.Models {
    class DivisionCollection extends Common.Models.ActionableCollection<League.Models.Division> {
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module League.Models {
}
declare module League {
}
declare module Stats {
}
declare module User.Models {
    class Organization extends Common.Models.Modifiable {
        accountKey: number;
        address1: string;
        address2: string;
        address3: string;
        city: string;
        country: string;
        faxPrimary: string;
        inactive: boolean;
        name: string;
        notes: any;
        organizationKey: number;
        otherDetails: any;
        phonePrimary: string;
        postalCode: string;
        primaryEmail: string;
        stateProvince: string;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
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
declare var moment: any;
declare var impakt: any;
declare module League.Models {
    class Location extends Common.Models.AssociableEntity {
        constructor();
        copy(newLocation?: League.Models.Location): League.Models.Location;
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module League.Models {
    class LocationCollection extends Common.Models.ActionableCollection<League.Models.Location> {
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare var impakt: any;
declare var impakt: any, playbook: any;
declare var impakt: any;
declare var impakt: any;
declare var impakt: any, angular: any;
declare var impakt: any, angular: any;
declare var impakt: any, angular: any;
declare var impakt: any;
declare var impakt: any, angular: any;
declare var impakt: any, angular: any;
declare var impakt: any;
declare module Team.Interfaces {
    interface ITeam {
        teamType: Team.Enums.TeamTypes;
    }
}
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
