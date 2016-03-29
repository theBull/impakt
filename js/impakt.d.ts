declare var $: any;
declare var angular: any;
declare var Raphael: any;
declare var async: any;
declare var objectHash: any;
declare var LZString: any;
declare var canvg: any;
declare var impakt: any;
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
        static exportToPng(canvas: Playbook.Interfaces.ICanvas, svgElement: HTMLElement): string;
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
    }
}
declare module Common.UI {
    const SCROLL_BAR_SIZE: number;
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
        listen(startListening: boolean): any;
    }
}
declare module Common.Interfaces {
    interface IScrollable {
        scrollSpeed: number;
        zoomSpeed: number;
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
        constructor(context: any);
        /**
         * Allows for switching the listening mechanism on or off
         * within a method chain. listen(false) would prevent
         * any mutation from triggering a rehash.
         *
         * @param {boolean} startListening true or false
         */
        listen(startListening: boolean): Modifiable;
        private _clearListeners();
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
        private _generateChecksum();
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
    class ModifiableCollection<T extends Common.Models.Modifiable> implements Common.Interfaces.IModifiable {
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
        append(collection: Common.Models.Collection<T>): ModifiableCollection<T>;
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
declare module Navigation {
}
declare module Navigation {
    class NavigationItemCollection extends Common.Models.Collection<Navigation.NavigationItem> {
        constructor();
    }
}
declare module Navigation {
    class NavigationItem extends Common.Models.Storable {
        name: string;
        label: string;
        glyphicon: string;
        path: string;
        isActive: boolean;
        constructor(name: string, label: string, glyphicon: string, path: string, isActive: boolean);
    }
}
declare var impakt: any;
declare module Playbook.Models {
    class Assignment extends Common.Models.Modifiable {
        routes: Playbook.Models.RouteCollection;
        positionIndex: number;
        setType: Playbook.Editor.SetTypes;
        constructor();
        clear(): void;
        erase(): void;
        setContext(context: any): void;
        fromJson(json: any): void;
        toJson(): {
            routes: {
                guid: string;
                rotues: any;
            };
            positionIndex: number;
            guid: string;
        };
    }
}
declare module Playbook.Models {
    class AssignmentCollection extends Common.Models.ModifiableCollection<Playbook.Models.Assignment> {
        setType: Playbook.Editor.SetTypes;
        unitType: Playbook.Editor.UnitTypes;
        name: string;
        key: number;
        constructor(count?: number);
        toJson(): any;
        fromJson(json: any): any;
        getAssignmentByPositionIndex(index: number): any;
    }
}
declare module Playbook.Models {
    class FieldElement extends Common.Models.Modifiable implements Playbook.Interfaces.IFieldElement {
        context: Playbook.Interfaces.IField | Playbook.Interfaces.IFieldElement | Playbook.Interfaces.IRoute;
        canvas: Playbook.Interfaces.ICanvas;
        grid: Playbook.Interfaces.IGrid;
        field: Playbook.Interfaces.IField;
        paper: Playbook.Interfaces.IPaper;
        name: string;
        placement: Playbook.Models.Placement;
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
        constructor(context: Playbook.Interfaces.IField | Playbook.Interfaces.IFieldElement | Playbook.Interfaces.IRoute);
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
    }
}
declare module Playbook.Models {
    class FieldElementSet extends Playbook.Models.FieldElement {
        context: Playbook.Interfaces.IFieldElement;
        items: Playbook.Interfaces.IFieldElement[];
        length: number;
        constructor(context: Playbook.Interfaces.IFieldElement, ...args: Playbook.Interfaces.IFieldElement[]);
        size(): number;
        push(...args: Playbook.Interfaces.IFieldElement[]): void;
        pop(): Playbook.Interfaces.IFieldElement;
        exclude(element: Playbook.Interfaces.IFieldElement): Playbook.Interfaces.IFieldElement;
        forEach(callback: Function, context: any): any;
        getByGuid(guid: string): Playbook.Interfaces.IFieldElement;
        splice(index: number, count: number): Playbook.Interfaces.IFieldElement[];
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
        offset: number;
        constructor(context: Playbook.Interfaces.IField);
        draw(): void;
        click(e: any, self: any): void;
        mousedown(e: any, self: any): void;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
        isWhichSideOf(coords: Playbook.Models.Coordinates): Playbook.Models.Coordinates;
        isLeftOf(x: any): boolean;
        isRightOf(x: any): boolean;
        isAbove(y: any): boolean;
        isBelow(y: any): boolean;
    }
}
declare module Playbook.Models {
    class Coordinates extends Common.Models.Storable {
        x: number;
        y: number;
        ax: number;
        ay: number;
        ox: number;
        oy: number;
        dx: number;
        dy: number;
        constructor(x: number, y: number);
        drop(): void;
        toJson(): any;
        fromJson(json: any): any;
    }
}
declare module Playbook.Models {
    class Endzone extends Playbook.Models.FieldElement {
        constructor(context: Playbook.Interfaces.IField, offsetY: number);
        draw(): void;
    }
}
declare module Playbook.Models {
    class Field implements Playbook.Interfaces.IField {
        paper: Playbook.Interfaces.IPaper;
        grid: Playbook.Interfaces.IGrid;
        playPrimary: Playbook.Models.PlayPrimary;
        playOpponent: Playbook.Models.PlayOpponent;
        type: Playbook.Editor.UnitTypes;
        editorType: Playbook.Editor.EditorTypes;
        zoom: number;
        players: Playbook.Models.PlayerCollection;
        selectedPlayers: Playbook.Models.PlayerCollection;
        ball: Playbook.Models.Ball;
        los: Playbook.Models.LineOfScrimmage;
        ground: Playbook.Models.Ground;
        endzone_top: Playbook.Models.Endzone;
        endzone_bottom: Playbook.Models.Endzone;
        sideline_left: Playbook.Models.Sideline;
        sideline_right: Playbook.Models.Sideline;
        hashmark_left: Playbook.Models.Hashmark;
        hashmark_right: Playbook.Models.Hashmark;
        hashmark_sideline_left: Playbook.Models.Hashmark;
        hashmark_sideline_right: Playbook.Models.Hashmark;
        constructor(paper: any, playPrimary: any, playOpponent: any);
        draw(): void;
        clearPlay(): void;
        drawPlay(): void;
        updatePlay(playPrimary: any, playOpponent: any): void;
        useAssignmentTool(coords: Playbook.Models.Coordinates): void;
        export(): any;
        placeAtYardline(element: any, yardline: any): void;
        remove(): void;
        getBBoxCoordinates(): void;
        addPlayer(placement: Playbook.Models.Placement, position: Playbook.Models.Position, assignment: Playbook.Models.Assignment): Playbook.Interfaces.IPlayer;
        getPlayerWithPositionIndex(index: any): Player;
        applyPrimaryPlay(play: any): void;
        applyPrimaryFormation(formation: any): void;
        applyPrimaryAssignments(assignments: any): void;
        applyPrimaryPersonnel(personnel: any): void;
        deselectAll(): void;
        togglePlayerSelection(player: any): void;
    }
}
declare module Playbook.Models {
    class PreviewField extends Playbook.Models.Field {
        constructor(paper: Playbook.Interfaces.IPaper, playPrimary: Playbook.Models.PlayPrimary, playOpponent: Playbook.Models.PlayOpponent);
        draw(): void;
        addPlayer(placement: Playbook.Models.Placement, position: Playbook.Models.Position, assignment: Playbook.Models.Assignment): Playbook.Interfaces.IPlayer;
        togglePlayerSelection(player: Playbook.Models.Player): void;
        deselectAll(): void;
        useAssignmentTool(coords: Playbook.Models.Coordinates): void;
    }
}
declare module Playbook.Models {
    class Grid implements Playbook.Interfaces.IGrid {
        paper: Playbook.Interfaces.IPaper;
        cols: number;
        rows: number;
        width: number;
        height: number;
        divisor: number;
        size: number;
        dashArray: Array<string>;
        verticalStrokeOpacity: number;
        horizontalStrokeOpacity: number;
        color: string;
        strokeWidth: number;
        protected base: number;
        constructor(paper: Playbook.Interfaces.IPaper, cols: number, rows: number);
        getSize(): number;
        getWidth(): number;
        getHeight(): number;
        /**
         * TODO @theBull - document this
         * @return {any} [description]
         */
        draw(): void;
        /**
         * recalculates the width and height of the grid
         * with the context width and height
         */
        resize(sizingMode: Playbook.Editor.PaperSizingModes): number;
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
        getCenter(): Playbook.Models.Coordinates;
        /**
         * TODO @theBull - document this
         * @return {Playbook.Models.Coordinate} [description]
         */
        getCenterInPixels(): Playbook.Models.Coordinates;
        /**
         * TODO @theBull - document this
         * @return {Playbook.Models.Coordinate} [description]
         */
        getCoordinates(): Playbook.Models.Coordinates;
        /**
         * TODO @theBull - document this
         * @return {Playbook.Models.Coordinate} [description]
         */
        getDimensions(): Playbook.Models.Coordinates;
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
         * @param  {Playbook.Models.Coordinate} coords the grid coords to calculate
         * @return {Playbook.Models.Coordinate}        the absolute pixel coords
         */
        getAbsoluteFromCoordinates(x: number, y: number): Playbook.Models.Coordinates;
        /**
         * Calculates grid coords from the given pixel values
         * @param {Playbook.Models.Coordinate} coords coordinates in raw pixel form
         * @return {Playbook.Models.Coordinate}		the matching grid pixels as coords
         */
        getCoordinatesFromAbsolute(x: number, y: number): Playbook.Models.Coordinates;
        /**
         * Takes the given coords and snaps them to the nearest grid coords
         *
         * @param {Playbook.Models.Coordinate} coords Coordinates to snap
         * @return {Playbook.Models.Coordinate}		The nearest snapped coordinates
         */
        snapToNearest(ax: number, ay: number): Playbook.Models.Coordinates;
        /**
         * Snaps the given coords to the grid
         * @param {Playbook.Models.Coordinate} coords assumed non-snapped coordinates
         * @return {Playbook.Models.Coordinate}		the snapped coordinates
         */
        snap(x: number, y: number): Playbook.Models.Coordinates;
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
declare module Playbook.Models {
    class GridSquare {
        x: number;
        y: number;
        constructor(x: number, y: number);
    }
}
declare module Playbook.Models {
    class Ground extends Playbook.Models.FieldElement {
        offset: Playbook.Models.Coordinates;
        constructor(field: Playbook.Interfaces.IField);
        draw(): void;
        getClickCoordinates(offsetX: number, offsetY: number): Playbook.Models.Coordinates;
        click(e: any): void;
        hoverIn(e: any, self: any): void;
        hoverOut(e: any, self: any): void;
        mouseDown(e: any, self: any): void;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
        getOffset(): Playbook.Models.Coordinates;
        getOffsetX(): number;
        getOffsetY(): number;
        setOffset(offsetX: number, offsetY: number): void;
        setOffsetX(value: number): void;
        setOffsetY(value: number): void;
    }
}
declare module Playbook.Models {
    class Hashmark extends Playbook.Models.FieldElement {
        offset: number;
        start: number;
        yards: number;
        constructor(field: Playbook.Interfaces.IField, offset: number);
        draw(): void;
    }
}
declare module Playbook.Models {
    class LineOfScrimmage extends Playbook.Models.FieldElement {
        field: Playbook.Interfaces.IField;
        y: number;
        LOS_Y_OFFSET: number;
        constructor(field: Playbook.Interfaces.IField);
        draw(): void;
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
declare module Playbook.Models {
    class RelativeCoordinates extends Common.Models.Storable {
        relativeElement: Playbook.Interfaces.IFieldElement;
        distance: number;
        theta: number;
        rx: number;
        ry: number;
        constructor(rx: number, ry: number, relativeElement?: Playbook.Interfaces.IFieldElement);
        toJson(): any;
        fromJson(json: any): any;
        getDistance(): number;
        getTheta(): number;
        updateFromGridCoordinates(x: number, y: number): void;
        updateFromAbsoluteCoordinates(ax: number, ay: number): void;
    }
}
declare module Playbook.Models {
    class Sideline extends Playbook.Models.FieldElement {
        offset: number;
        constructor(field: Playbook.Interfaces.IField, offset: number);
        draw(): void;
    }
}
declare module Playbook {
    class Utilities {
        static getPathString(...args: number[]): string;
        static getClosedPathString: (...args: number[]) => string;
        static buildPath: (from: any, to: any, width: any) => string;
        static distance: (x1: any, y1: any, x2: any, y2: any) => number;
        static theta: (x1: any, y1: any, x2: any, y2: any) => number;
        static toDegrees: (angle: any) => number;
        static toRadians: (angle: any) => number;
    }
}
declare module Playbook.Models {
    class Canvas extends Common.Models.Storable implements Playbook.Interfaces.ICanvas {
        paper: Playbook.Interfaces.IPaper;
        playPrimary: Playbook.Models.PlayPrimary;
        playOpponent: Playbook.Models.PlayOpponent;
        $container: any;
        container: HTMLElement;
        $exportCanvas: any;
        exportCanvas: HTMLCanvasElement;
        private _scrollable;
        unitType: Playbook.Editor.UnitTypes;
        editorType: Playbook.Editor.EditorTypes;
        width: number;
        height: number;
        minWidth: number;
        minHeight: number;
        listener: Playbook.Models.CanvasListener;
        toolMode: Playbook.Editor.ToolModes;
        tab: Playbook.Models.Tab;
        readyCallbacks: Function[];
        widthChangeInterval: any;
        constructor(playPrimary: Playbook.Models.PlayPrimary, playOpponent: Playbook.Models.PlayOpponent, width?: number, height?: number);
        /**
         * Converts this canvas's SVG graphics element into a data-URI
         * which can be used in an <img/> src attribute to render the image
         * as a PNG. Allows for retrieval and storage of the image as well.
         *
         * 3/9/2016: https://css-tricks.com/data-uris/
         * @return {string} [description]
         */
        exportToPng(): any;
        initialize($container: any): void;
        updatePlay(playPrimary: Playbook.Models.PlayPrimary, playOpponent: Playbook.Models.PlayOpponent, redraw?: boolean): void;
        onready(callback: any): void;
        _ready(): void;
        getSvg(): string;
        resize(): void;
        setScrollable(_scrollable: any): void;
        resetHeight(): void;
        listen(actionId: any, fn: any): void;
        invoke(actionId: any, data: any, context: any): void;
        zoomIn(): void;
        zoomOut(): void;
        getToolMode(): Editor.ToolModes;
        getToolModeName(): string;
        getPaperWidth(): number;
        getPaperHeight(): number;
        getGridSize(): number;
    }
}
declare module Playbook.Models {
    class CanvasListener {
        actions: any;
        constructor(context: Playbook.Interfaces.ICanvas);
        listen(actionId: string | number, fn: Function): void;
        invoke(actionId: string | number, data: any, context: Playbook.Interfaces.ICanvas): void;
    }
}
declare module Playbook.Models {
    class PreviewCanvas extends Playbook.Models.Canvas {
        constructor(playPrimary: Playbook.Models.PlayPrimary, playOpponent: Playbook.Models.PlayOpponent);
        initialize($container: any): void;
        refresh(): void;
    }
}
declare module Playbook.Models {
    class Paper {
        canvas: Playbook.Interfaces.ICanvas;
        field: Playbook.Interfaces.IField;
        grid: Playbook.Interfaces.IGrid;
        Raphael: any;
        sizingMode: Playbook.Editor.PaperSizingModes;
        x: number;
        y: number;
        scrollSpeed: number;
        zoomSpeed: number;
        showBorder: boolean;
        viewOutline: any;
        constructor(canvas: Playbook.Interfaces.ICanvas);
        draw(): void;
        updatePlay(playPrimary: any, playOpponent: any): void;
        getWidth(): number;
        getHeight(): number;
        getXOffset(): number;
        resize(): void;
        clear(): any;
        setViewBox(): void;
        drawOutline(): void;
        zoom(deltaY: any): void;
        zoomToFit(): void;
        zoomIn(speed?: number): void;
        zoomOut(speed?: number): void;
        scroll(scrollToX: any, scrollToY: any): void;
        path(path: any): any;
        bump(x: any, y: any, raphael: any): any;
        alignToGrid(x: any, y: any, absolute: any): Coordinates;
        rect(x: any, y: any, width: any, height: any, absolute: any): any;
        ellipse(x: any, y: any, width: any, height: any, absolute: any): any;
        circle(x: any, y: any, radius: any, absolute: any): any;
        text(x: any, y: any, text: any, absolute: any): any;
        print(x: any, y: any, text: any, font: any, size: any, origin: any, letterSpacing: any): any;
        getFont(family: any, weight: any, style: any, stretch: any): any;
        set(): any;
        remove(element: any): void;
        pathMoveTo(ax: any, ay: any): string;
        getPathString(initialize: boolean, coords: number[]): string;
        pathLineTo(x: any, y: any): string;
        getPathStringFromNodes(initialize: any, nodeArray: any): string;
        getClosedPathString(...args: number[]): string;
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
        getCurveString(initialize: any, coords: any): string;
        quadraticCurveTo(x1: any, y1: any, x: any, y: any): string;
        getCurveStringFromNodes(initialize: boolean, nodeArray: Playbook.Models.RouteNode[]): string;
        buildPath(fromGrid: any, toGrid: any, width: any): string;
        distance(x1: any, y1: any, x2: any, y2: any): number;
        theta(x1: any, y1: any, x2: any, y2: any): number;
        toDegrees(angle: any): number;
        toRadians(angle: any): number;
    }
}
declare module Playbook.Models {
    class FullPaper extends Playbook.Models.Paper {
        constructor(canvas: Playbook.Interfaces.ICanvas);
    }
}
declare module Playbook.Models {
    class PreviewPaper extends Playbook.Models.Paper {
        constructor(previewCanvas: Playbook.Interfaces.ICanvas);
    }
}
declare module Playbook.Models {
    class Formation extends Common.Models.Modifiable {
        unitType: Playbook.Editor.UnitTypes;
        parentRK: number;
        editorType: Playbook.Editor.EditorTypes;
        name: string;
        associated: Common.Models.Association;
        placements: Playbook.Models.PlacementCollection;
        key: number;
        png: string;
        constructor(name?: string);
        copy(newFormation?: Playbook.Models.Formation): Playbook.Models.Formation;
        toJson(): any;
        fromJson(json: any): any;
        setDefault(ball: Playbook.Models.Ball): void;
        isValid(): boolean;
    }
}
declare module Playbook.Models {
    class FormationCollection extends Common.Models.ModifiableCollection<Playbook.Models.Formation> {
        parentRK: number;
        unitType: Playbook.Editor.UnitTypes;
        constructor();
        toJson(): {
            formations: any;
            unitType: Editor.UnitTypes;
            guid: string;
        };
        fromJson(json: any): any;
    }
}
declare module Playbook.Models {
    class Personnel extends Common.Models.Modifiable {
        unitType: Playbook.Editor.UnitTypes;
        parentRK: number;
        editorType: Playbook.Editor.EditorTypes;
        name: string;
        associated: Common.Models.Association;
        positions: Playbook.Models.PositionCollection;
        setType: Playbook.Editor.SetTypes;
        key: number;
        constructor();
        hasPositions(): boolean;
        update(personnel: Playbook.Models.Personnel): void;
        copy(newPersonnel: Playbook.Models.Personnel): Playbook.Models.Personnel;
        fromJson(json: any): any;
        toJson(): any;
        setDefault(): void;
        setUnitType(unitType: Playbook.Editor.UnitTypes): void;
    }
}
declare module Playbook.Models {
    class PersonnelCollection extends Common.Models.ModifiableCollection<Playbook.Models.Personnel> {
        unitType: Playbook.Editor.UnitTypes;
        setType: Playbook.Editor.SetTypes;
        constructor();
        toJson(): {
            unitType: Editor.UnitTypes;
            setType: Editor.SetTypes;
            personnel: any;
        };
        fromJson(json: any): void;
    }
}
declare module Playbook.Models {
    class Placement extends Common.Models.Modifiable implements Common.Interfaces.IModifiable {
        relative: Playbook.Models.RelativeCoordinates;
        coordinates: Playbook.Models.Coordinates;
        relativeElement: Playbook.Interfaces.IFieldElement;
        grid: Playbook.Interfaces.IGrid;
        index: number;
        constructor(rx: number, ry: number, relativeElement: Playbook.Interfaces.IFieldElement, index?: number);
        toJson(): any;
        fromJson(json: any): any;
        moveByDelta(dx: number, dy: number): void;
        drop(): void;
        refresh(): void;
        /**
         * Updates this placement with the given placement
         *
         * @param {number} placement The new placement
         */
        update(placement: Playbook.Models.Placement): void;
        updateCoordinatesFromAbsolute(ax: number, ay: number): void;
        updateCoordinates(x: number, y: number): void;
    }
}
declare module Playbook.Models {
    class PlacementCollection extends Common.Models.ModifiableCollection<Playbook.Models.Placement> {
        constructor();
        fromJson(placements: any): void;
        toJson(): any;
    }
}
declare module Playbook.Models {
    class Play extends Common.Models.Modifiable {
        field: Playbook.Interfaces.IField;
        name: string;
        associated: Common.Models.Association;
        assignments: Playbook.Models.AssignmentCollection;
        formation: Playbook.Models.Formation;
        personnel: Playbook.Models.Personnel;
        unitType: Playbook.Editor.UnitTypes;
        editorType: Playbook.Editor.EditorTypes;
        png: string;
        key: number;
        constructor();
        setPlaybook(playbook: any): void;
        setFormation(formation: any): void;
        setAssignments(assignments: any): void;
        setPersonnel(personnel: any): void;
        draw(field: Playbook.Interfaces.IField): void;
        fromJson(json: any): any;
        toJson(): any;
        hasAssignments(): boolean;
        setDefault(field: Playbook.Interfaces.IField): void;
    }
}
declare module Playbook.Models {
    class PlayPrimary extends Playbook.Models.Play {
        playType: Playbook.Editor.PlayTypes;
        constructor();
    }
}
declare module Playbook.Models {
    class PlayOpponent extends Playbook.Models.Play {
        playType: Playbook.Editor.PlayTypes;
        constructor();
        draw(field: Playbook.Interfaces.IField): void;
    }
}
declare module Playbook.Models {
    class PlayCollection extends Common.Models.ModifiableCollection<Playbook.Models.Play> {
        constructor();
        toJson(): any;
        fromJson(plays: any[]): void;
    }
}
declare module Playbook.Models {
    class PlaybookModel extends Common.Models.Modifiable {
        key: number;
        name: string;
        associated: Common.Models.Association;
        unitType: Playbook.Editor.UnitTypes;
        constructor();
        toJson(): any;
        fromJson(json: any): any;
    }
}
declare module Playbook.Models {
    class PlaybookModelCollection extends Common.Models.ModifiableCollection<Playbook.Models.PlaybookModel> {
        constructor();
        toJson(): any;
        fromJson(json: any): any;
    }
}
declare module Playbook.Models {
    class UnitType extends Common.Models.Modifiable {
        unitType: Playbook.Editor.UnitTypes;
        associated: Common.Models.Association;
        name: string;
        constructor(unitType: Playbook.Editor.UnitTypes, name: string);
        static getUnitTypes(): {};
        toJson(): any;
        fromJson(json: any): any;
    }
}
declare module Playbook.Models {
    class UnitTypeCollection extends Common.Models.ModifiableCollection<Playbook.Models.UnitType> {
        constructor();
        getByUnitType(unitTypeValue: Playbook.Editor.UnitTypes): UnitType;
        getAssociatedPlaybooks(): PlaybookModelCollection;
        toJson(): any;
        fromJson(json: any): void;
    }
}
declare module Playbook.Models {
    class Player extends Playbook.Models.FieldElement implements Playbook.Interfaces.IPlayer, Playbook.Interfaces.IFieldElement, Playbook.Interfaces.IPlaceable {
        placement: Playbook.Models.Placement;
        position: Playbook.Models.Position;
        assignment: Playbook.Models.Assignment;
        data: any;
        font: any;
        selectedColor: string;
        unselectedColor: string;
        selectedOpacity: number;
        label: any;
        indexLabel: any;
        private _isCreatedNewFromAltDisabled;
        private _newFromAlt;
        private _isDraggingNewFromAlt;
        set: Playbook.Models.FieldElementSet;
        icon: FieldElement;
        box: FieldElement;
        text: FieldElement;
        constructor(context: Playbook.Models.Field, placement: Playbook.Models.Placement, position: Playbook.Models.Position, assignment: Playbook.Models.Assignment);
        draw(): void;
        clear(): void;
        mousedown(e: any, self: any): void;
        hoverIn(e: any, self: any): void;
        hoverOut(e: any, self: any): void;
        click(e: any, self: any): any;
        dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
        dragStart(x: number, y: number, e: any): void;
        dragEnd(e: any): void;
        select(isSelected?: boolean): void;
        clearRoute(): void;
        setRouteFromDefaults(routeTitle: string): void;
        onkeypress(): void;
        getPositionRelativeToBall(): Playbook.Models.RelativeCoordinates;
        getCoordinatesFromAbsolute(): Playbook.Models.Coordinates;
        hasPlacement(): boolean;
        hasPosition(): boolean;
    }
}
declare module Playbook.Models {
    class PreviewPlayer extends Playbook.Models.Player {
        constructor(context: Playbook.Models.Field, placement: Playbook.Models.Placement, position: Playbook.Models.Position, assignment: Playbook.Models.Assignment);
        draw(): void;
    }
}
declare module Playbook.Models {
    class PlayerCollection extends Common.Models.ModifiableCollection<Playbook.Models.Player> {
        constructor();
    }
}
declare module Playbook.Models {
    class Position extends Common.Models.Modifiable {
        positionListValue: Playbook.Models.PositionList;
        title: string;
        label: string;
        eligible: boolean;
        index: number;
        unitType: Playbook.Editor.UnitTypes;
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
        static getBlank(type: Playbook.Editor.UnitTypes): PositionCollection;
        getByUnitType(type: Playbook.Editor.UnitTypes): any;
    }
}
declare module Playbook.Models {
    class PositionCollection extends Common.Models.ModifiableCollection<Playbook.Models.Position> {
        constructor();
        listPositions(): any[];
        toJson(): any;
        fromJson(positions: any): any;
        setDefault(): void;
    }
}
declare module Playbook.Models {
    class Route extends Common.Models.Modifiable implements Playbook.Interfaces.IRoute {
        player: Playbook.Interfaces.IPlayer;
        paper: Playbook.Interfaces.IPaper;
        grid: Playbook.Interfaces.IGrid;
        field: Playbook.Interfaces.IField;
        nodes: Common.Models.ModifiableLinkedList<Playbook.Models.RouteNode>;
        dragInitialized: boolean;
        path: Playbook.Interfaces.IFieldElement;
        color: string;
        constructor(player: Playbook.Interfaces.IPlayer, dragInitialized?: boolean);
        setContext(player: Playbook.Interfaces.IPlayer): void;
        fromJson(json: any): any;
        toJson(): any;
        erase(): void;
        draw(): void;
        clear(): void;
        getDataArray(): Playbook.Models.RouteNode[];
        drawCurve(node: Playbook.Models.RouteNode): void;
        drawLine(): void;
        initializeCurve(coords: any, flip: any): void;
        addNode(coords: Playbook.Models.Coordinates, type?: Playbook.Models.RouteNodeType, render?: boolean): Common.Models.LinkedListNode<Playbook.Models.RouteNode>;
        getLastNode(): any;
        getMixedStringFromNodes(nodeArray: any): string;
        moveNodesByDelta(dx: any, dy: any): void;
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
        toJson(): {
            guid: string;
            rotues: any;
        };
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
        node: Common.Models.LinkedListNode<Playbook.Models.RouteNode>;
        type: Playbook.Models.RouteNodeType;
        action: Playbook.Models.RouteNodeActions;
        actionable: boolean;
        actionGraphic: Playbook.Models.FieldElement;
        controlPath: Playbook.Models.FieldElement;
        controlList: any;
        player: Playbook.Interfaces.IPlayer;
        constructor(context: Playbook.Interfaces.IRoute, relativeCoordinates: Playbook.Models.RelativeCoordinates, type: Playbook.Models.RouteNodeType);
        setContext(context: Playbook.Interfaces.IRoute): void;
        fromJson(json: any): void;
        toJson(): any;
        getCoordinates(): Coordinates;
        erase(): void;
        draw(): void;
        clear(): void;
        drawAction(): void;
        contextmenuHandler(e: any, self: any): void;
        hoverIn(e: any, self: any): void;
        hoverOut(e: any, self: any): void;
        drawControlPaths(): any;
        click(e: any, self: any): void;
        dragMove(dx: any, dy: any, posx: any, posy: any, e: any): void;
        dragStart(x: any, y: any, e: any): void;
        dragEnd(e: any): void;
        moveByDelta(dx: any, dy: any): void;
        isCurveNode(): boolean;
        setAction(action: any): void;
        toggleSelect(): void;
        select(): void;
        deselect(): void;
        toggleOpacity(): void;
    }
}
declare module Playbook.Models {
    class Tab extends Common.Models.Storable implements Common.Interfaces.ICollectionItem {
        title: string;
        key: number;
        active: boolean;
        playPrimary: Playbook.Models.PlayPrimary;
        playOpponent: Playbook.Models.PlayOpponent;
        unitType: Playbook.Editor.UnitTypes;
        canvas: Playbook.Models.Canvas;
        private _closeCallbacks;
        constructor(playPrimary: Playbook.Models.PlayPrimary, playOpponent: Playbook.Models.PlayOpponent);
        onclose(callback: Function): void;
        close(): void;
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
        paper: Playbook.Interfaces.IPaper;
        container: HTMLElement;
        $container: any;
        exportCanvas: HTMLCanvasElement;
        $exportCanvas: any;
        playPrimary: Playbook.Models.PlayPrimary;
        playOpponent: Playbook.Models.PlayOpponent;
        toolMode: Playbook.Editor.ToolModes;
        width: number;
        height: number;
        exportToPng(): string;
    }
}
declare module Playbook.Interfaces {
    interface IEditorObject {
        key: any;
        name: string;
        unitType: Playbook.Editor.UnitTypes;
        editorType: Playbook.Editor.EditorTypes;
        parentRK: number;
        personnel: Playbook.Models.Personnel;
        assignments: Playbook.Models.AssignmentCollection;
        formation: Playbook.Models.Formation;
        draw(field: Playbook.Models.Field): void;
    }
}
declare module Playbook.Interfaces {
    interface IListener {
        listen(actionId: Playbook.Editor.CanvasActions, fn: any): void;
        invoke(actionId: Playbook.Editor.CanvasActions, data: any, context: any): void;
    }
}
declare module Playbook.Interfaces {
    interface IField {
        paper: Playbook.Interfaces.IPaper;
        grid: Playbook.Interfaces.IGrid;
        playPrimary: Playbook.Models.PlayPrimary;
        playOpponent: Playbook.Models.PlayOpponent;
        ball: Playbook.Models.Ball;
        players: Playbook.Models.PlayerCollection;
        draw(): void;
        addPlayer(placement: Playbook.Models.Placement, position: Playbook.Models.Position, assignment: Playbook.Models.Assignment): Playbook.Interfaces.IPlayer;
        togglePlayerSelection(player: Playbook.Models.Player): void;
        deselectAll(): void;
        useAssignmentTool(coords: Playbook.Models.Coordinates): void;
        updatePlay(playPrimary: Playbook.Models.PlayPrimary, playOpponent: Playbook.Models.PlayOpponent): void;
    }
}
declare module Playbook.Interfaces {
    interface IBall {
        canvas: Playbook.Interfaces.ICanvas;
        context: Playbook.Interfaces.IField;
        grid: Playbook.Interfaces.IGrid;
        placement: Playbook.Models.Placement;
        draw(): any;
        getRelativeCoordinates(coordinates: Playbook.Models.Coordinates): Playbook.Models.Coordinates;
        getCoordinatesRelativeTo(bx: number, by: number): Playbook.Models.Coordinates;
    }
}
declare module Playbook.Interfaces {
    interface IFieldElement {
        context: Playbook.Interfaces.IField | Playbook.Interfaces.IFieldElement | Playbook.Interfaces.IRoute;
        paper: Playbook.Interfaces.IPaper;
        grid: Playbook.Interfaces.IGrid;
        field: Playbook.Interfaces.IField;
        raphael: any;
        placement: Playbook.Models.Placement;
        guid: string;
        width: number;
        height: number;
        draw(): void;
        drop(): void;
        click(e: any, self: any): void;
    }
}
declare module Playbook.Interfaces {
    interface IPaper {
        canvas: Playbook.Interfaces.ICanvas;
        grid: Playbook.Interfaces.IGrid;
        field: Playbook.Interfaces.IField;
        Raphael: any;
        x: number;
        y: number;
        zoomSpeed: number;
        showBorder: boolean;
        viewOutline: any;
        sizingMode: Playbook.Editor.PaperSizingModes;
        draw(): void;
        updatePlay(playPrimary: Playbook.Models.PlayPrimary, playOpponent: Playbook.Models.PlayOpponent, redraw?: boolean): void;
        getWidth(): number;
        getHeight(): number;
        getXOffset(): number;
        drawOutline(): void;
        resize(): void;
        setViewBox(): void;
        zoom(deltaY: number): void;
        zoomToFit(): void;
        zoomIn(speed?: number): void;
        zoomOut(speed?: number): void;
        scroll(scrollToX: number, scrollToY: number): void;
        clear(): any;
        path(path: string): any;
        bump(x: number, y: number, raphael: any): any;
        alignToGrid(x: number, y: number, absolute: boolean): Playbook.Models.Coordinates;
        rect(x: number, y: number, width: number, height: number, absolute?: boolean): any;
        ellipse(x: number, y: number, width: number, height: number, absolute?: boolean): any;
        circle(x: number, y: number, radius: number, absolute?: boolean): any;
        text(x: number, y: number, text: string, absolute?: boolean): any;
        print(x: number, y: number, text: string, font: string, size?: number, origin?: string, letterSpacing?: number): any;
        getFont(family: string, weight?: string, style?: string, stretch?: string): any;
        set(): any;
        remove(element: any): any;
        pathMoveTo(ax: number, ay: number): string;
        getPathString(initialize: boolean, coords: number[]): string;
        pathLineTo(x: any, y: any): any;
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
        buildPath(fromGrid: Playbook.Models.Coordinates, toGrid: Playbook.Models.Coordinates, width: number): string;
        distance(x1: number, y1: number, x2: number, y2: number): number;
        theta(x1: number, y1: number, x2: number, y2: number): number;
        toDegrees(angle: number): number;
        toRadians(angle: number): number;
    }
}
declare module Playbook.Interfaces {
    interface IGrid {
        paper: Playbook.Interfaces.IPaper;
        size: number;
        cols: number;
        rows: number;
        width: number;
        height: number;
        divisor: number;
        draw(): void;
        resize(sizingMode: Playbook.Editor.PaperSizingModes): number;
        getSize(): number;
        getWidth(): number;
        getHeight(): number;
        getCenter(): Playbook.Models.Coordinates;
        getAbsoluteFromCoordinate(val: number): number;
        getAbsoluteFromCoordinates(x: number, y: number): Playbook.Models.Coordinates;
        getCoordinatesFromAbsolute(ax: number, ay: number): Playbook.Models.Coordinates;
        snapPixel(pixel: number): number;
        isDivisible(value: number): boolean;
    }
}
declare module Playbook.Interfaces {
    interface IRoute {
        player: Playbook.Interfaces.IPlayer;
        paper: Playbook.Interfaces.IPaper;
        grid: Playbook.Interfaces.IGrid;
        field: Playbook.Interfaces.IField;
        draw(): void;
    }
}
declare module Playbook.Interfaces {
    interface IPlayer extends Playbook.Interfaces.IFieldElement {
        guid: string;
        set: Playbook.Models.FieldElementSet;
        placement: Playbook.Models.Placement;
        assignment: Playbook.Models.Assignment;
        position: Playbook.Models.Position;
    }
}
declare module Playbook.Interfaces {
    interface IPlaceable {
        placement: Playbook.Models.Placement;
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
}
declare module Playbook.Editor {
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
    enum SetTypes {
        None = 0,
        Personnel = 1,
        Assignment = 2,
        UnitType = 3,
    }
    enum UnitTypes {
        Offense = 0,
        Defense = 1,
        SpecialTeams = 2,
        Other = 3,
    }
    enum ToolModes {
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
    }
    enum PlayTypes {
        Any = 0,
        Primary = 1,
        Opponent = 2,
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
declare var impakt: any, playbook: any;
declare var impakt: any, angular: any;
declare var impakt: any, angular: any;
declare var impakt: any;
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
        mode: Playbook.Editor.ToolModes;
        selected: boolean;
        constructor(title?: string, action?: Playbook.Editor.ToolActions, glyphiconIcon?: string, tooltip?: string, cursor?: string, mode?: Playbook.Editor.ToolModes, selected?: boolean);
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
    class Dimensions {
        width: number;
        height: number;
        constructor(width: number, height: number);
        setWidth(width: number): number;
        setHeight(height: number): number;
        setDimensions(width: number, height: number): Playbook.Models.Dimensions;
        getWidth(): number;
        getHeight(): number;
    }
}
declare var impakt: any, angular: any;
declare var impakt: any;
declare module Team {
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
declare module User {
}
