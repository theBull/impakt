declare var $: any;
declare var angular: any;
declare var Raphael: any;
declare var async: any;
declare var sjcl: any;
declare var impakt: any;
declare module Common {
    module Base {
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
        static parseData(data: any): any;
        static guid(): string;
        static randomId(): number;
        static camelCaseToSpace(string: string, capitalizeFirst?: boolean): string;
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
    }
}
declare var impakt: any, angular: any;
declare var impakt: any;
declare var impakt: any;
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
    interface IModifiable {
        onModified(callback: Function): void;
        isModified(): void;
        setModified(): boolean;
    }
}
declare module Common.Interfaces {
    interface IStorable {
        guid: string;
        toJson(): any;
        fromJson(json: any): any;
    }
}
declare module Common {
    module Interfaces {
    }
}
declare module Common.Models {
    class Storable {
        guid: string;
        constructor();
    }
}
declare module Common.Models {
    class Modifiable extends Common.Models.Storable implements Common.Interfaces.IModifiable {
        callbacks: Function[];
        modified: boolean;
        checksum: string;
        lastModified: number;
        context: any;
        constructor(context: any);
        onModified(callback: Function): void;
        isModified(): void;
        /**
         * alias for generateChecksum()
         * @return {string} the updated checksum
         */
        setModified(): boolean;
        /**
         * Generates a new checksum from the current object
         * @return {string} the newly generated checksum
         */
        private _generateChecksum();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Common.Models {
    class Collection<T extends Common.Models.Storable> extends Common.Models.Storable {
        private _count;
        private _keys;
        constructor();
        private _ensureKeyType(key);
        size(): number;
        isEmpty(): boolean;
        get<T>(key: string | number): T;
        getOne<T>(): T;
        getIndex(index: number): T;
        set<T>(key: string | number, data: T): void;
        replace<T>(replaceKey: string | number, key: string | number, data: T): void;
        setAtIndex<T>(index: number, data: T): void;
        add<T>(key: string | number, data: T): void;
        addAtIndex(key: string | number, data: T, index: number): void;
        append(collection: Common.Models.Collection<T>): void;
        forEach<T>(iterator: Function): void;
        filter<T>(predicate: Function): T[];
        filterFirst<T>(predicate: Function): T;
        remove<T>(key: string | number): T;
        removeAll<T>(): void;
        /**
         * Allows you to run an iterator method over each item
         * in the collection before the collection is completely
         * emptied.
         */
        removeEach<T>(iterator: any): void;
        contains<T>(key: string | number): boolean;
        getAll(): {
            any?: T;
        };
        getLast<T>(): T;
        toArray<T>(): T[];
        toJsonArray(): any[];
        /**
         * Alias for toJsonArray, since the collection should be
         * represented as an array
         * @return {any} returns an array of objects
         */
        toJson(): any;
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
        toJsonArray(): any[];
        toDataArray<T>(): T[];
        toArray(): Common.Models.LinkedListNode<T>[];
        getLast(): Common.Models.LinkedListNode<T>;
        remove(guid: string): Common.Models.LinkedListNode<T>;
        size(): number;
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
    class ModifiableCollection<T extends Common.Models.Modifiable> extends Common.Models.Collection<T> implements Common.Interfaces.IModifiable {
        private _modifiable;
        constructor();
        setModified(): boolean;
        onModified(callback: Function): void;
        isModified(): void;
        size(): number;
        isEmpty(): boolean;
        get<T>(key: string | number): T;
        getOne<T>(): T;
        getIndex(index: number): T;
        set<T>(key: string | number, data: T): void;
        replace<T>(replaceKey: string | number, key: string | number, data: T): void;
        setAtIndex<T>(index: number, data: T): void;
        add<T>(key: string | number, data: T): void;
        addAtIndex(key: string | number, data: T, index: number): void;
        append(collection: Common.Models.Collection<T>): void;
        forEach<T>(iterator: Function): void;
        filter<T>(predicate: Function): T[];
        filterFirst<T>(predicate: Function): T;
        remove<T>(key: string | number): T;
        removeAll<T>(): void;
        /**
         * Allows you to run an iterator method over each item
         * in the collection before the collection is completely
         * emptied.
         */
        removeEach<T>(iterator: any): void;
        contains<T>(key: string | number): boolean;
        getAll(): {
            any?: T;
        };
        getLast<T>(): T;
        toArray<T>(): T[];
        toJsonArray(): any[];
        toJson(): any;
    }
}
declare module Common.Models {
    class ModifiableLinkedList<T extends Common.Models.Modifiable> extends Common.Models.LinkedList<T> {
        private _modifiable;
        constructor();
        add(node: Common.Models.LinkedListNode<T>): void;
        getIndex(index: number): Common.Models.LinkedListNode<T>;
        forEach(iterator: Function): void;
        toJsonArray(): any[];
        toDataArray<T>(): T[];
        toArray(): Common.Models.LinkedListNode<T>[];
        getLast(): Common.Models.LinkedListNode<T>;
        remove(guid: string): Common.Models.LinkedListNode<T>;
        size(): number;
    }
}
declare module Common.Models {
    class ModifiableLinkedListNode extends Common.Models.LinkedListNode<Common.Models.Modifiable> {
        constructor(data: any, next: Common.Models.ModifiableLinkedListNode, prev?: Common.Models.ModifiableLinkedListNode);
        toJson(): any;
    }
}
declare module Common.Models {
    class Notification implements Common.Interfaces.ICollectionItem {
        guid: string;
        message: string;
        type: Common.Models.NotificationType;
        constructor(message: string, type: Common.Models.NotificationType);
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
declare module Common.Input {
    class KeyboardInput {
        shiftPressed(): void;
        ctrlPressed(): void;
        altPressed(): void;
        metaPressed(): void;
    }
}
declare module Common.Models {
}
declare module Common.Models {
    /**
     * Associates an element with one or more other elements
     * by guid.
     */
    class Association extends Common.Models.Modifiable {
        unitTypes: string[];
        playbooks: string[];
        formations: string[];
        personnel: string[];
        assignments: string[];
        plays: string[];
        guid: string;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare var impakt: any;
declare module Playbook.Interfaces {
    interface IListener {
        listen(actionId: Playbook.Editor.CanvasActions, fn: any): void;
        invoke(actionId: Playbook.Editor.CanvasActions, data: any, context: any): void;
    }
}
declare module Playbook.Interfaces {
    interface IEditorObject {
        key: any;
        name: string;
        type: Playbook.Editor.UnitTypes;
        editorType: Playbook.Editor.EditorTypes;
        parentRK: number;
        personnel: Playbook.Models.Personnel;
        assignments: Playbook.Models.AssignmentCollection;
        formation: Playbook.Models.Formation;
        draw(field: Playbook.Models.Field): void;
    }
}
declare module Playbook.Interfaces {
    interface IFieldContext {
        context: Playbook.Interfaces.IFieldContext;
        grid: Playbook.Models.Grid;
        field: Playbook.Models.Field;
        paper: Playbook.Models.Paper;
    }
}
declare module Playbook.Models {
    class Assignment extends Common.Models.Modifiable {
        routes: Playbook.Models.RouteCollection;
        positionIndex: number;
        setType: Playbook.Editor.PlaybookSetTypes;
        constructor();
        erase(): void;
        setContext(context: Playbook.Models.Player): void;
        fromJson(json: any): void;
        toJson(): any;
    }
}
declare module Playbook.Models {
    class AssignmentCollection extends Common.Models.ModifiableCollection<Playbook.Models.Assignment> {
        unitType: Playbook.Editor.UnitTypes;
        setType: Playbook.Editor.PlaybookSetTypes;
        name: string;
        constructor(count?: number);
        hasAssignments(): boolean;
        toJson(): any;
        fromJson(json: any): void;
        getAssignmentByPositionIndex(index: number): Playbook.Models.Assignment;
    }
}
declare module Playbook.Models {
    class FieldElement extends Common.Models.Modifiable implements Playbook.Interfaces.IFieldContext {
        context: any;
        canvas: Playbook.Models.Canvas;
        field: Playbook.Models.Field;
        paper: Playbook.Models.Paper;
        grid: Playbook.Models.Grid;
        ball: Playbook.Models.Ball;
        id: number;
        guid: string;
        name: string;
        position: Playbook.Models.Position;
        coords: Playbook.Models.Coordinate;
        x: number;
        y: number;
        ax: number;
        ay: number;
        bx: number;
        by: number;
        cx: number;
        cy: number;
        dx: number;
        dy: number;
        ox: number;
        oy: number;
        radius: number;
        transformString: string;
        width: number;
        height: number;
        raphael: any;
        positionAbsolutely: boolean;
        selected: boolean;
        disabled: boolean;
        dragging: boolean;
        draggable: boolean;
        dragged: boolean;
        clickable: boolean;
        hoverable: boolean;
        opacity: number;
        color: string;
        contextmenuTemplateUrl: string;
        constructor(context: Playbook.Interfaces.IFieldContext, canvas?: Playbook.Models.Canvas);
        toJson(): any;
        fromJson(json: any): void;
        disable(): void;
        select(): void;
        show(): any;
        hide(): any;
        glow(): any;
        getSaveData(): any;
        draw(...args: any[]): any;
        getBBoxCoordinates(): any;
        mouseDown(fn: any, context: any): void;
        hover(hoverIn: any, hoverOut: any, context: any): void;
        hoverIn(e: any, context?: any): void;
        hoverOut(e: any, context?: any): void;
        click(fn: any, context: any): void;
        mousedown(fn: any, context: any): void;
        contextmenu(fn: any, context: any): void;
        drag(dragMove: any, dragStart: any, dragEnd: any, dragMoveContext: any, dragStartContext: any, dragEndContext: any): void;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
        drop(): void;
        setFillOpacity(opacity: number): FieldElement;
        setStrokeColor(color: string): FieldElement;
        setFillColor(color: string): FieldElement;
        setCoordinates(): void;
    }
}
declare module Playbook.Models {
    class FieldElementSet extends Playbook.Models.FieldElement {
        items: Array<FieldElement>;
        length: number;
        constructor(context: any, ...args: FieldElement[]);
        size(): number;
        push(...args: FieldElement[]): void;
        pop(): FieldElement;
        exclude(element: FieldElement): any;
        forEach(callback: any, context: any): any;
        getByGuid(guid: string): Playbook.Models.FieldElement;
        splice(index: number, count: number): FieldElement[];
        removeAll(): void;
        clear(): void;
        dragOne(guid: string, dx: number, dy: number): void;
        dragAll(dx: number, dy: number): void;
        drop(): void;
        setOriginalPositions(): void;
    }
}
declare module Playbook.Models {
    class Ball extends Playbook.Models.FieldElement {
        width: number;
        height: number;
        offset: number;
        color: string;
        data: any;
        constructor(context: Playbook.Models.Field);
        draw(): any;
        click(e: any, self: any): void;
        mousedown(e: any, self: any): void;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
        getGridCoordinates(): Playbook.Models.Coordinate;
        getRelativeCoordinatesInPixels(coords: Playbook.Models.Coordinate): any;
        isWhichSideOf(coords: Playbook.Models.Coordinate): Playbook.Models.Coordinate;
        isLeftOf(x: number): boolean;
        isRightOf(x: number): boolean;
        isAbove(y: number): boolean;
        isBelow(y: number): boolean;
        getSaveData(): any;
    }
}
declare module Playbook.Models {
    class Canvas implements Playbook.Interfaces.ICanvas, Playbook.Interfaces.IListener, Playbook.Interfaces.IFieldContext {
        context: any;
        container: HTMLElement;
        $container: any;
        tab: Playbook.Models.Tab;
        paper: Playbook.Models.Paper;
        field: Playbook.Models.Field;
        grid: Playbook.Models.Grid;
        center: Playbook.Models.Coordinate;
        type: Playbook.Editor.UnitTypes;
        editorType: Playbook.Editor.EditorTypes;
        play: Playbook.Models.Play;
        editorMode: Playbook.Editor.EditorModes;
        key: string;
        width: number;
        height: number;
        minWidth: number;
        minHeight: number;
        rows: number;
        cols: number;
        gridsize: number;
        active: boolean;
        OFFSET: number;
        _scrollable: any;
        private listener;
        constructor(play: Playbook.Models.Play, gridsize?: number, width?: number, height?: number, cols?: number, rows?: number);
        initialize($container: any): void;
        resize(): void;
        setScrollable(_scrollable: any): void;
        resetHeight(): void;
        listen(actionId: Playbook.Editor.CanvasActions, fn: any): void;
        invoke(actionId: Playbook.Editor.CanvasActions, data: any, context: any): void;
        zoomIn(): void;
        zoomOut(): void;
        getEditorMode(): string;
        getPaperWidth(): number;
        getPaperHeight(): number;
    }
}
declare module Playbook.Models {
    class CanvasListener {
        actions: any;
        constructor(context: Playbook.Models.Canvas);
        listen(actionId: Playbook.Editor.CanvasActions, fn: any): void;
        invoke(actionId: Playbook.Editor.CanvasActions, data: any, context: any): void;
    }
}
declare module Playbook.Models {
    class Coordinate {
        x: number;
        y: number;
        constructor(x: number, y: number);
    }
}
declare module Playbook.Models {
    class Endzone extends FieldElement {
        context: Playbook.Models.Field;
        canvas: Playbook.Models.Canvas;
        paper: Playbook.Models.Paper;
        color: string;
        opacity: number;
        width: number;
        height: number;
        x: number;
        y: number;
        constructor(context: Playbook.Models.Field, gridOffset?: number);
        draw(): void;
    }
}
declare module Playbook.Models {
    class Field extends FieldElement implements Playbook.Interfaces.IFieldContext {
        ground: Playbook.Models.FieldElement;
        ball: Playbook.Models.Ball;
        los: Playbook.Models.LineOfScrimmage;
        endzone_top: Playbook.Models.Endzone;
        endzone_bottom: Playbook.Models.Endzone;
        hashmark_left: Playbook.Models.Hashmark;
        hashmark_right: Playbook.Models.Hashmark;
        sideline_left: Playbook.Models.Sideline;
        sideline_right: Playbook.Models.Sideline;
        type: Playbook.Editor.UnitTypes;
        editorType: Playbook.Editor.EditorTypes;
        play: Playbook.Models.Play;
        zoom: number;
        playData: any;
        id: number;
        players: Playbook.Models.PlayerCollection;
        selectedPlayers: Playbook.Models.PlayerCollection;
        opacity: number;
        offset: Playbook.Models.Coordinate;
        clickDisabled: boolean;
        constructor(context: Playbook.Models.Canvas, play: Playbook.Models.Play);
        draw(): any;
        placeAtYardline(element: FieldElement, yardline: number): void;
        setOffset(offsetX: number, offsetY: number): void;
        getCoordinates(): Playbook.Models.Coordinate;
        remove(): void;
        click(e: any, self: any): void;
        hoverIn(e: any, self: any): void;
        hoverOut(e: any, self: any): void;
        mouseDown(e: any, self: any): any;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
        getBBoxCoordinates(): any;
        getPositionRelativeToBall(from: FieldElement): Playbook.Models.RelativePosition;
        getPositionRelativeToElement(from: FieldElement, to: FieldElement): Playbook.Models.RelativePosition;
        getPositionRelativeToCoordinate(from: FieldElement, to: Playbook.Models.Coordinate): Playbook.Models.RelativePosition;
        getPositionRelativeToWindow(from: FieldElement): Playbook.Models.RelativePosition;
        addPlayer(placement: Playbook.Models.Placement, position: Playbook.Models.Position, assignment: Playbook.Models.Assignment): Playbook.Models.Player;
        getPlayerWithPositionIndex(index: number): Playbook.Models.Player;
        applyFormation(formation: Playbook.Models.Formation): void;
        applyAssignments(assignments: Playbook.Models.AssignmentCollection): void;
        applyPersonnel(personnel: Playbook.Models.Personnel): void;
        deselectAll(): void;
        togglePlayerSelection(player: Player): void;
    }
}
declare module Playbook.Models {
    class Grid {
        GRIDSIZE: number;
        private GRIDBASE;
        context: Playbook.Models.Canvas;
        canvas: Playbook.Models.Canvas;
        paper: Playbook.Models.Paper;
        dimensions: any;
        dashArray: Array<string>;
        verticalStrokeOpacity: number;
        horizontalStrokeOpacity: number;
        strokeWidth: number;
        width: number;
        height: number;
        divisor: number;
        constructor(context: Playbook.Models.Canvas, cols: number, rows: number, gridsize?: number);
        setGridsize(gridsize: number, paper: Playbook.Models.Paper): void;
        draw(): any;
        bottom(): number;
        right(): number;
        getCenter(): Playbook.Models.Coordinate;
        getCenterInPixels(): Playbook.Models.Coordinate;
        getCoordinates(): Playbook.Models.Coordinate;
        getDimensions(): any;
        gridProportion(): number;
        computeGridZoom(val: number): number;
        getPixelsFromCoordinate(val: number): number;
        getPixelsFromCoordinates(coords: Playbook.Models.Coordinate): Playbook.Models.Coordinate;
        getGridCoordinatesFromPixels(coords: Playbook.Models.Coordinate): Playbook.Models.Coordinate;
        snapToNearest(coords: Playbook.Models.Coordinate): Playbook.Models.Coordinate;
        snap(coords: Playbook.Models.Coordinate): Playbook.Models.Coordinate;
        snapPixel(val: number): number;
        isDivisible(val: number): boolean;
        moveToPixels(from: Playbook.Models.Coordinate, toX: number, toY: number): Playbook.Models.Coordinate;
    }
}
declare module Playbook.Models {
    class GridSquare {
        x: number;
        y: number;
        constructor(x: number, y: number);
    }
}
declare module Playbook.Models {
    class Hashmark extends FieldElement {
        offset: number;
        constructor(context: Playbook.Models.Field, offset?: number);
        draw(): void;
    }
}
declare module Playbook.Models {
    class LineOfScrimmage extends FieldElement {
        context: Playbook.Models.Field;
        canvas: Playbook.Models.Canvas;
        paper: Playbook.Models.Paper;
        LOS_Y_OFFSET: number;
        y: number;
        x: number;
        width: number;
        height: number;
        color: string;
        opacity: number;
        data: any;
        constructor(context: Playbook.Models.Field, y?: number);
        draw(): void;
        getSaveData(): any;
    }
}
declare module Playbook.Models {
    class Listener {
        actions: any;
        constructor(context: any);
        listen(actionId: any, fn: any): void;
        invoke(actionId: any, data: any, context: any): void;
    }
}
declare module Playbook.Models {
    class Paper {
        Raphael: any;
        private container;
        private $container;
        width: number;
        height: number;
        viewWidth: number;
        viewHeight: number;
        x: number;
        y: number;
        scrollSpeed: number;
        zoomSpeed: number;
        grid: Playbook.Models.Grid;
        showBorder: boolean;
        outline: any;
        paperOutline: any;
        protected canvas: Playbook.Models.Canvas;
        constructor(canvas: Playbook.Models.Canvas, width: number, height: number);
        getXOffset(): number;
        drawOutline(): void;
        resize(width: any): void;
        setDimensions(width: number, height: number): void;
        setViewBox(): any;
        zoom(deltaY: number): void;
        zoomToFit(): void;
        zoomIn(speed?: number): void;
        zoomOut(speed?: number): void;
        scroll(scrollToX: number, scrollToY: number): any;
        clear(): any;
        path(path: string): any;
        bump(x: number, y: number, raphael: any): any;
        private alignToGrid(x, y, absolute);
        rect(x: number, y: number, width: number, height: number, absolute?: boolean): any;
        ellipse(x: number, y: number, width: number, height: number, absolute?: boolean): any;
        circle(x: number, y: number, radius: number, absolute?: boolean): any;
        text(x: number, y: number, text: string, absolute?: boolean): any;
        print(x: number, y: number, text: string, font: string, size?: number, origin?: string, letterSpacing?: number): any;
        getFont(family: string, weight?: string, style?: string, stretch?: string): any;
        set(): any;
        remove(element: any): void;
        pathMoveTo(ax: number, ay: number): string;
        getPathString(initialize: boolean, coords: number[]): string;
        pathLineTo(x: any, y: any): string;
        getPathStringFromNodes(initialize: boolean, nodeArray: Playbook.Models.FieldElement[]): string;
        getClosedPathString(...args: any[]): string;
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
        getCurveString(initialize: boolean, coords: number[]): string;
        quadraticCurveTo(x1: any, y1: any, x: any, y: any): string;
        getCurveStringFromNodes(initialize: boolean, nodeArray: Playbook.Models.FieldElement[]): string;
        buildPath(fromGrid: Playbook.Models.Coordinate, toGrid: Playbook.Models.Coordinate, width: number): string;
        distance(x1: number, y1: number, x2: number, y2: number): number;
        theta(x1: number, y1: number, x2: number, y2: number): number;
        toDegrees(angle: number): number;
        toRadians(angle: number): number;
    }
}
declare module Playbook.Models {
    class RelativePosition extends Playbook.Models.Coordinate {
        distance: number;
        theta: number;
        constructor(from: Playbook.Models.Player, to: Playbook.Models.FieldElement);
        grid(from: Playbook.Models.Coordinate, to: Playbook.Models.Coordinate): Playbook.Models.Coordinate;
        absolute(): Playbook.Models.Coordinate;
        window(): Playbook.Models.Coordinate;
    }
}
declare module Playbook.Models {
    class Sideline extends FieldElement {
        context: Playbook.Models.Field;
        canvas: Playbook.Models.Canvas;
        paper: Playbook.Models.Paper;
        color: string;
        opacity: number;
        width: number;
        height: number;
        x: number;
        y: number;
        offset: number;
        constructor(context: Playbook.Models.Field, offset?: number);
        draw(): void;
    }
}
declare module Playbook {
    class Utilities {
        static getPathString(...args: any[]): string;
        static getClosedPathString(...args: any[]): string;
        static buildPath(from: Playbook.Models.Coordinate, to: Playbook.Models.Coordinate, width: number): string;
        static distance(x1: number, y1: number, x2: number, y2: number): number;
        static theta(x1: number, y1: number, x2: number, y2: number): number;
        static toDegrees(angle: number): number;
        static toRadians(angle: number): number;
    }
}
declare module Playbook.Models {
    class Formation extends Common.Models.Modifiable {
        field: Playbook.Models.Field;
        placements: Playbook.Models.PlacementCollection;
        name: string;
        key: any;
        parentRK: number;
        unitType: Playbook.Editor.UnitTypes;
        editorType: Playbook.Editor.EditorTypes;
        associated: Common.Models.Association;
        constructor(name?: string);
        toJson(): any;
        fromJson(json: any): void;
        setDefault(): void;
        isValid(): boolean;
    }
}
declare module Playbook.Models {
    class FormationCollection extends Common.Models.ModifiableCollection<Playbook.Models.Formation> {
        parentRK: number;
        unitType: Playbook.Editor.UnitTypes;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Playbook.Models {
    class Personnel extends Common.Models.Modifiable {
        positions: Playbook.Models.PositionCollection;
        unitType: Playbook.Editor.UnitTypes;
        key: number;
        name: string;
        setType: Playbook.Editor.PlaybookSetTypes;
        constructor();
        hasPositions(): boolean;
        update(personnel: Playbook.Models.Personnel): void;
        fromJson(json: any): void;
        toJson(): any;
        setDefault(): void;
        setUnitType(unitType: Playbook.Editor.UnitTypes): void;
    }
}
declare module Playbook.Models {
    class PersonnelCollection extends Common.Models.ModifiableCollection<Playbook.Models.Personnel> {
        unitType: Playbook.Editor.UnitTypes;
        setType: Playbook.Editor.PlaybookSetTypes;
        guid: string;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Playbook.Models {
    class Placement extends Common.Models.Modifiable {
        x: number;
        y: number;
        constructor(options?: any);
        toJson(): any;
        fromJson(json: any): void;
        getCoordinates(): Playbook.Models.Coordinate;
    }
}
declare module Playbook.Models {
    class PlacementCollection extends Common.Models.ModifiableCollection<Playbook.Models.Placement> {
        constructor();
        fromJson(json: any): void;
        toJson(): any;
    }
}
declare module Playbook.Models {
    class Play extends Common.Models.Modifiable implements Playbook.Interfaces.IEditorObject {
        field: Playbook.Models.Field;
        assignments: Playbook.Models.AssignmentCollection;
        personnel: Playbook.Models.Personnel;
        formation: Playbook.Models.Formation;
        name: string;
        key: number;
        type: Playbook.Editor.UnitTypes;
        editorType: Playbook.Editor.EditorTypes;
        parentRK: number;
        guid: string;
        constructor();
        draw(field: Playbook.Models.Field): void;
        fromJson(json: any): void;
        toJson(): any;
        hasAssignments(): boolean;
        setDefault(): void;
    }
}
declare module Playbook.Models {
    class PlayCollection extends Common.Models.ModifiableCollection<Playbook.Models.Play> {
        constructor();
        addAllRaw(plays: any[]): void;
    }
}
declare module Playbook.Models {
    class PlaybookModel extends Common.Models.Modifiable {
        key: number;
        name: string;
        unitType: Playbook.Editor.UnitTypes;
        active: boolean;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Playbook.Models {
    class PlaybookModelCollection extends Common.Models.ModifiableCollection<Playbook.Models.PlaybookModel> {
        unitType: Playbook.Editor.UnitTypes;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Playbook.Models {
    class UnitType extends Common.Models.Modifiable {
        unitType: Playbook.Editor.UnitTypes;
        name: string;
        active: boolean;
        playbooks: Playbook.Models.PlaybookModelCollection;
        formations: Playbook.Models.FormationCollection;
        personnel: Playbook.Models.PersonnelCollection;
        assignments: Playbook.Models.AssignmentCollection;
        constructor(unitType: Playbook.Editor.UnitTypes, name: string);
        static getUnitTypes(): {};
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Playbook.Models {
    class UnitTypeCollection extends Common.Models.ModifiableCollection<Playbook.Models.UnitType> {
        constructor();
        getByUnitType(unitTypeValue: Playbook.Editor.UnitTypes): Playbook.Models.UnitType;
        getAllPlaybooks(): Playbook.Models.PlaybookModelCollection;
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Playbook.Models {
    class Player extends FieldElement {
        placement: Playbook.Models.Placement;
        position: Playbook.Models.Position;
        assignment: Playbook.Models.Assignment;
        teamMember: TeamMember;
        data: any;
        font: any;
        selectedColor: string;
        unselectedColor: string;
        selectedOpacity: number;
        label: any;
        private _isCreatedNewFromAltDisabled;
        private _newFromAlt;
        private _isDraggingNewFromAlt;
        set: any;
        icon: FieldElement;
        box: FieldElement;
        text: FieldElement;
        constructor(context: Playbook.Models.Field, placement: Playbook.Models.Placement, position: Playbook.Models.Position, assignment: Playbook.Models.Assignment);
        draw(): void;
        mousedown(e: any, self: any): void;
        hoverIn(e: any, self: any): void;
        hoverOut(e: any, self: any): void;
        click(e: any, self: any): any;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
        getPositionRelativeToBall(): RelativePosition;
        getCoordinatesFromAbsolutePosition(): Playbook.Models.Coordinate;
        getCoordinates(px: number, py: number): Playbook.Models.Coordinate;
        select(isSelected?: boolean): void;
        clearRoute(): void;
        setRouteFromDefaults(routeTitle: string): void;
        getSaveData(): void;
        onkeypress(): void;
        hasPlacement(): boolean;
        hasPosition(): boolean;
    }
}
declare module Playbook.Models {
    class PlayerCollection extends Common.Models.ModifiableCollection<Playbook.Models.Player> {
        constructor();
    }
}
declare class TeamMember {
}
declare module Playbook.Models {
    class Position extends Common.Models.Modifiable {
        positionListValue: Playbook.Models.PositionList;
        label: string;
        title: string;
        unitType: Playbook.Editor.UnitTypes;
        eligible: boolean;
        index: number;
        constructor(options?: any);
        toJson(): any;
        fromJson(json: any): void;
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
        getPosition(positionListValue: Playbook.Models.PositionList): Playbook.Models.Position;
        switchPosition(fromPosition: Playbook.Models.Position, toPositionEnum: Playbook.Models.PositionList): Playbook.Models.Position;
        static getBlank(type: Playbook.Editor.UnitTypes): Playbook.Models.PositionCollection;
        getByUnitType(type: Playbook.Editor.UnitTypes): Playbook.Models.PositionCollection;
    }
}
declare module Playbook.Models {
    class PositionCollection extends Common.Models.ModifiableCollection<Playbook.Models.Position> {
        constructor();
        toJson(): any;
        fromJson(positions: any): void;
        setDefault(): void;
    }
}
declare module Playbook.Models {
    class Route extends Common.Models.Modifiable implements Playbook.Interfaces.IFieldContext {
        context: Playbook.Models.Player;
        grid: Playbook.Models.Grid;
        field: Playbook.Models.Field;
        paper: Playbook.Models.Paper;
        path: Playbook.Models.FieldElement;
        set: Playbook.Models.FieldElementSet;
        nodes: Common.Models.ModifiableLinkedList<Playbook.Models.RouteNode>;
        dragInitialized: boolean;
        constructor(context: Playbook.Models.Player, dragInitialized?: boolean);
        setContext(context: Playbook.Models.Player): void;
        fromJson(json: any): void;
        toJson(): any;
        erase(): void;
        draw(): void;
        drawCurve(node: Playbook.Models.RouteNode): void;
        drawLine(): void;
        initializeCurve(coords: Playbook.Models.Coordinate, flip: boolean): void;
        addNode(coords: Playbook.Models.Coordinate, type: Playbook.Models.RouteNodeType, render?: boolean): Common.Models.LinkedListNode<Playbook.Models.RouteNode>;
        getLastNode(): Playbook.Models.FieldElement;
        getMixedStringFromNodes(nodeArray: Common.Models.LinkedListNode<Playbook.Models.RouteNode>[]): string;
        moveNodesByDelta(dx: number, dy: number): void;
    }
}
declare module Playbook.Editor {
    enum RouteTypes {
        None = 0,
        Block = 1,
        Scan = 2,
        Run = 3,
        Route = 4,
        Cover = 5,
        Zone = 6,
        Spy = 7,
        Option = 8,
        HandOff = 9,
        Pitch = 10,
    }
}
declare module Playbook.Models {
    class RouteCollection extends Common.Models.ModifiableCollection<Playbook.Models.Route> {
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Playbook.Models {
    enum RouteNodeType {
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
    class RouteNode extends Playbook.Models.FieldElement {
        context: Playbook.Models.Route;
        paper: Playbook.Models.Paper;
        grid: Playbook.Models.Grid;
        field: Playbook.Models.Field;
        node: Common.Models.LinkedListNode<Playbook.Models.RouteNode>;
        type: Playbook.Models.RouteNodeType;
        action: Playbook.Models.RouteNodeActions;
        disabled: boolean;
        selected: boolean;
        controlList: Common.Models.LinkedList<any>;
        actionGraphic: Playbook.Models.FieldElement;
        actionable: boolean;
        opacity: number;
        controlPath: Playbook.Models.FieldElement;
        constructor(context: Playbook.Models.Route, coords: Playbook.Models.Coordinate, type: Playbook.Models.RouteNodeType);
        setContext(context: Playbook.Models.Route): void;
        fromJson(json: any): void;
        toJson(): any;
        getCoordinates(): Playbook.Models.Coordinate;
        erase(): void;
        draw(): void;
        drawAction(): void;
        contextmenuHandler(e: any, self: any): void;
        hoverIn(e: any, self: any): void;
        hoverOut(e: any, self: any): void;
        drawControlPaths(): any;
        click(e: any, self: any): void;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
        moveByDelta(dx: number, dy: number): void;
        isCurveNode(): boolean;
        setAction(action: Playbook.Models.RouteNodeActions): void;
        toggleSelect(): void;
        select(): void;
        deselect(): void;
        toggleOpacity(): void;
    }
}
declare module Playbook.Models {
    class Tab implements Common.Interfaces.ICollectionItem {
        title: string;
        guid: string;
        key: number;
        active: boolean;
        play: Playbook.Models.Play;
        type: Playbook.Editor.UnitTypes;
        editorType: Playbook.Editor.EditorTypes;
        canvas: Playbook.Models.Canvas;
        constructor(play: Playbook.Models.Play);
    }
}
declare module Playbook.Models {
    class TabCollection extends Common.Models.Collection<Playbook.Models.Tab> {
        constructor();
        getByPlayGuid(guid: string): Playbook.Models.Tab;
    }
}
declare module Playbook.Models {
}
declare module Playbook.Interfaces {
    interface ICanvas {
        container: HTMLElement;
        $container: any;
        paper: any;
        grid: Playbook.Models.Grid;
        center: Playbook.Models.Coordinate;
        width: number;
        height: number;
    }
}
declare module Playbook.Interfaces {
}
declare module Playbook {
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
    module Editor {
        enum CanvasActions {
            FieldElementContextmenu = 0,
            PlayerContextmenu = 1,
            RouteNodeContextmenu = 2,
            RouteTreeSelection = 3,
        }
        class CursorTypes {
            static pointer: string;
            static crosshair: string;
        }
        enum PlaybookSetTypes {
            None = 0,
            Personnel = 1,
            Assignment = 2,
        }
        enum UnitTypes {
            Offense = 0,
            Defense = 1,
            SpecialTeams = 2,
            Other = 3,
            Mixed = 4,
        }
        enum EditorModes {
            None = 0,
            Select = 1,
            Formation = 2,
            Assignment = 3,
            Zoom = 4,
        }
        enum EditorTypes {
            Formation = 0,
            Assignment = 1,
            Play = 2,
            Set = 3,
        }
    }
}
declare module Icon {
    class Glyphicon {
        prefix: string;
        icon: string;
        name: string;
        constructor(icon?: string);
    }
}
declare var impakt: any;
declare var impakt: any;
declare var impakt: any, playbook: any;
declare var impakt: any, angular: any;
declare var impakt: any, angular: any;
declare var impakt: any;
declare var impakt: any;
declare var impakt: any;
declare var impakt: any, angular: any;
declare var impakt: any, angular: any;
declare module Playbook.Editor {
    class Tool {
        title: string;
        guid: string;
        tooltip: string;
        glyphicon: Icon.Glyphicon;
        action: Playbook.Editor.ToolActions;
        cursor: string;
        editorMode: Playbook.Editor.EditorModes;
        selected: boolean;
        constructor(title?: string, action?: Playbook.Editor.ToolActions, glyphiconIcon?: string, tooltip?: string, cursor?: string, editorMode?: Playbook.Editor.EditorModes, selected?: boolean);
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
}
declare var impakt: any, angular: any;
declare var impakt: any;
declare var impakt: any, angular: any;
declare module Playbook.Models {
    class PlaybookData extends Common.Models.Modifiable {
        types: Playbook.Models.UnitTypeCollection;
        private _hasTypes;
        isPrivate: boolean;
        constructor();
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Playbook.Models {
    class RoutePath extends FieldElement {
        static ROUTE_WIDTH: number;
        context: Playbook.Models.Route;
        paper: Playbook.Models.Paper;
        title: string;
        width: number;
        startNode: Playbook.Models.RouteNode;
        endNode: Playbook.Models.RouteNode;
        path: any;
        constructor(context: Playbook.Models.Route, startNode: Playbook.Models.RouteNode, endNode: Playbook.Models.RouteNode);
        draw(): any;
        click(e: any, self: any): void;
        hoverIn(e: any, self: any): void;
        hoverOut(e: any, self: any): void;
        mousedown(e: any, self: any): any;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
        getSaveData(): any;
        getBBoxCoordinates(): any;
        remove(): void;
    }
}
declare var impakt: any, angular: any;
declare var impakt: any;
declare module Team {
}
