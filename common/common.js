/// <reference path='../js/impakt.ts' />
var Common;
(function (Common) {
    var API;
    (function (API) {
        (function (Actions) {
            Actions[Actions["Nothing"] = 0] = "Nothing";
            Actions[Actions["Create"] = 1] = "Create";
            Actions[Actions["Overwrite"] = 2] = "Overwrite";
            Actions[Actions["Copy"] = 3] = "Copy";
        })(API.Actions || (API.Actions = {}));
        var Actions = API.Actions;
    })(API = Common.API || (Common.API = {}));
    var Base;
    (function (Base) {
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
        var Component = (function () {
            function Component(name, type, waitingOn) {
                this.name = name;
                this.type = type;
                this.guid = Common.Utilities.guid();
                this.waitingOn = waitingOn || [];
                this.loaded = this.waitingOn && this.waitingOn.length == 0;
                this.dependencies = new ComponentMap();
                this.onReadyCallback = function () {
                    //console.log('Component ready', this);
                };
            }
            Component.prototype.ready = function () {
                //console.log('component ready', this);
                this.loaded = true;
                this.onReadyCallback(this);
            };
            Component.prototype.onready = function (callback) {
                this.onReadyCallback = callback;
                // even when attaching the ready event listener,
                // if the component has no dependencies, and hence loaded,
                // fire off the ready callback
                if (this.loaded)
                    this.ready();
            };
            Component.prototype.loadDependency = function (dependency) {
                //console.log('loading dependency', dependency, this);
                this.dependencies.add(dependency);
                var index = this.waitingOn.indexOf(dependency.name);
                this.waitingOn.splice(index, 1);
                if (dependency.loaded)
                    dependency.ready();
                if (this.waitingOn.length == 0) {
                    this.ready();
                }
            };
            Component.prototype.registerDependencies = function () {
                for (var i = 0; i < this.waitingOn.length; i++) {
                    this.dependencies.add(new Component(this.waitingOn[i], Common.Base.ComponentType.Null));
                }
            };
            return Component;
        })();
        Base.Component = Component;
        (function (ComponentType) {
            ComponentType[ComponentType["Null"] = 0] = "Null";
            ComponentType[ComponentType["Service"] = 1] = "Service";
            ComponentType[ComponentType["Controller"] = 2] = "Controller";
            ComponentType[ComponentType["Directive"] = 3] = "Directive";
        })(Base.ComponentType || (Base.ComponentType = {}));
        var ComponentType = Base.ComponentType;
        var ComponentMap = (function () {
            function ComponentMap() {
                this.obj = {};
                this.count = 0;
            }
            /**
             * Adds a new component to the list or updates
             * the component if it already exists.
             * @param {Component} component The component to be added
             */
            ComponentMap.prototype.add = function (component) {
                if (this.obj[component.guid]) {
                    this.set(component);
                    return;
                }
                this.obj[component.guid] = component;
                this.count++;
            };
            ComponentMap.prototype.remove = function (guid) {
                var component = this.obj[guid];
                delete this.obj[guid];
                this.count--;
                return component;
            };
            ComponentMap.prototype.get = function (guid) {
                return this.obj[guid];
            };
            ComponentMap.prototype.set = function (component) {
                this.obj[component.guid] = component;
            };
            return ComponentMap;
        })();
        Base.ComponentMap = ComponentMap;
    })(Base = Common.Base || (Common.Base = {}));
    var Utilities = (function () {
        function Utilities() {
        }
        Utilities.exportToPng = function (canvas, svgElement) {
            if (!svgElement)
                throw new Error('play-preview: Corresponding SVG element not found');
            // Serialize the SVG XML into a string
            var svgString = Common.Utilities.serializeXMLToString(svgElement);
            // canvg javascript library takes the canvas HTML element and the SVG
            // in string form
            canvg(canvas.exportCanvas, svgString);
            // the exportCanvas is a <canvas/> element, which possesses a method
            // to export its data as a PNG data URL
            var pngDataURI = canvas.exportCanvas.toDataURL("image/png");
            return pngDataURI;
        };
        /**
         * Compresses the given SVG element into a compressed string
         * @param  {HTMLElement} svg SVG element to handle
         * @return {string}          the compressed SVG string
         */
        Utilities.compressSVG = function (svg) {
            var serialized = Common.Utilities.serializeXMLToString(svg);
            var encoded = Common.Utilities.toBase64(serialized);
            // TODO: NEED TO FIX COMPRESSION ISSUE. USING THIS METHOD CAUSES 
            // THE COMPRESSED CHARACTERS (NON UTF-8) TO BE CONVERTED TO '?'
            // WHICH BREAKS PARSING
            //return Common.Utilities.compress(encoded);
            return encoded;
        };
        /**
         * Compresses the given string
         * @param  {string} svg String to compress
         * @return {any}        a compressed svg string
         */
        Utilities.compress = function (str) {
            return LZString.compress(str);
        };
        /**
         * Takes a compressed SVG data and decompresses it
         * @param  {string} compressed The compressed SVG data to decompress
         * @return {string}            The decompressed string of SVG
         */
        Utilities.decompressSVG = function (compressed) {
            // TO-DO: COMPRESSION BROKEN; SEE COMPRESSSVG ABOVE FOR NOTES
            //let decompressed = Common.Utilities.decompress(compressed);
            //return Common.Utilities.fromBase64(decompressed); 
            return Common.Utilities.fromBase64(compressed);
        };
        /**
         * Decompresses the given string
         * @param  {string} compressed The (compressed) string to decompress
         * @return {string}            the decompressed string
         */
        Utilities.decompress = function (compressed) {
            return LZString.decompress(compressed);
        };
        /**
         * Encodes the given string of SVG into base64
         * @param  {string} svgString svg string
         * @return {string}           base64 encoded svg string
         */
        Utilities.toBase64 = function (str) {
            return window.btoa(str);
        };
        /**
         * Decodes the given base64 encoded svg string
         * @param  {string} base64Svg base64 encoded svg string
         * @return {string}           decoded svg string
         */
        Utilities.fromBase64 = function (str) {
            return window.atob(str);
        };
        /**
         * Converts the given SVG HTML element into a string
         * @param  {HTMLElement} svg Element to convert to string
         * @return {string}          returns the stringified SVG element
         */
        Utilities.serializeXMLToString = function (xml) {
            return (new XMLSerializer()).serializeToString(xml);
        };
        Utilities.parseData = function (data) {
            for (var i = 0; i < data.length; i++) {
                try {
                    data[i].data = JSON.parse(data[i].data);
                }
                catch (error) {
                    console.log(error);
                }
            }
            return data;
        };
        Utilities.guid = function () {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        };
        Utilities.randomId = function () {
            return (Math.floor(Math.random() * (9999999999 - 1000000000)) + 999999999);
        };
        Utilities.camelCaseToSpace = function (string, capitalizeFirst) {
            var result = string.replace(/([A-Z])/g, " $1");
            // capitalize the first letter - as an example.
            if (capitalizeFirst)
                result = Common.Utilities.sentenceCase(result);
            return result;
        };
        Utilities.sentenceCase = function (str) {
            return (str.charAt(0).toUpperCase() + str.slice(1)).trim();
        };
        Utilities.convertEnumToList = function (obj) {
            var list = {};
            for (var key in obj) {
                if (!isNaN(key)) {
                    list[parseInt(key)] = Common.Utilities.camelCaseToSpace(obj[key], true);
                }
            }
            return list;
        };
        Utilities.getEnumerationsOnly = function (obj) {
            var enums = {};
            for (var key in obj) {
                if (!!isNaN(key)) {
                    enums[key] = obj[key];
                }
            }
            return enums;
        };
        Utilities.getEnumerationsAsArray = function (obj) {
            var enums = [];
            for (var key in obj) {
                if (!isNaN(key)) {
                    enums.push(parseInt(key));
                }
            }
            return enums;
        };
        Utilities.isArray = function (obj) {
            return Object.prototype.toString.call(obj) == '[object Array]';
        };
        Utilities.isObject = function (obj) {
            return typeof obj === 'object';
        };
        Utilities.isFunction = function (obj) {
            typeof obj === 'function';
        };
        Utilities.toJson = function (obj) {
            var results = null;
            if (Common.Utilities.isObject(obj)) {
                results = Common.Utilities.toJsonRecursive(obj, {});
            }
            else if (Common.Utilities.isArray(obj)) {
                results = Common.Utilities.toJsonArrayRecursive(obj);
            }
            else {
                results = obj;
            }
            return results;
        };
        Utilities.toJsonArrayRecursive = function (arr) {
            var jsonArr = [];
            for (var i = 0; i < arr.length; i++) {
                var raw = arr[i];
                var results = null;
                if (Common.Utilities.isArray(raw)) {
                    results = Common.Utilities.toJsonArrayRecursive(raw);
                }
                else if (Common.Utilities.isObject(raw)) {
                    results = Common.Utilities.toJson(raw);
                }
                else {
                    results = raw;
                }
                jsonArr.push(results);
            }
            return jsonArr;
        };
        Utilities.toJsonRecursive = function (obj, results) {
            var keys = Object.keys(obj);
            if (!keys)
                return null;
            if (obj.toJson) {
                results = obj.toJson();
            }
            else {
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    if (!Common.Utilities.isFunction(obj[key])) {
                        if (Common.Utilities.isObject(obj[key])) {
                            if (obj[key].toJson) {
                                // recurse
                                results[key] = Common.Utilities.toJsonRecursive(obj[key].toJson(), {});
                            }
                        }
                        else if (Common.Utilities.isArray(obj[key])) {
                            results[key] = Common.Utilities.toJsonArrayRecursive(obj[key]);
                        }
                        else {
                            results[key] = obj[key];
                        }
                    }
                }
            }
            return results;
        };
        /**
         * Generates and returns a hashed string from the given JSON object
         * @param {any} json The object to be hashed
         */
        Utilities.generateChecksum = function (json) {
            return objectHash(json, {});
        };
        Utilities.prepareObjectForEncoding = function (obj) {
            var output = null;
            if (Array.isArray(obj)) {
                var arr = obj;
                for (var i_1 = 0; i_1 < arr.length; i_1++) {
                    var arrItem = arr[i_1];
                    output = Common.Utilities.prepareObjectForEncoding(arrItem);
                }
            }
            else {
                var keys = Object.keys(obj).sort();
                output = [];
                var prop;
                for (var i = 0; i < keys.length; i++) {
                    prop = keys[i];
                    output.push(prop);
                    output.push(obj[prop]);
                }
            }
            return output;
        };
        return Utilities;
    })();
    Common.Utilities = Utilities;
})(Common || (Common = {}));
var Common;
(function (Common) {
    var UI;
    (function (UI) {
        UI.SCROLL_BAR_SIZE = 12;
    })(UI = Common.UI || (Common.UI = {}));
})(Common || (Common = {}));
