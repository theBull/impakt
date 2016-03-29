// global impakt namespace
var impakt = {};
// global application context storage
impakt.context = {};
impakt.app = angular.module('impakt.app', [
    // module registration
    'ui.router',
    'ui.bootstrap',
    'impakt.common',
    'impakt.modules'
])
    .config([
    '$stateProvider',
    '$urlRouterProvider',
    '$httpProvider',
    '$sceDelegateProvider',
    function ($stateProvider, $urlRouterProvider, $httpProvider, $sceDelegateProvider) {
        console.log('impakt - config');
        //Reset headers to avoid OPTIONS request (aka preflight)
        $httpProvider.defaults.headers.common = {};
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
        $httpProvider.defaults.headers.patch = {};
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'https://test-impakt.azurewebsites.net/**',
            'http://test.impaktathletics.com/**',
            '*'
        ]);
        //$urlRouterProvider.otherwise('/');
        // impakt module states - should these be module-specific?
        $stateProvider
            .state('home', {
            url: '/home',
            templateUrl: 'modules/home/home.tpl.html'
        })
            .state('season', {
            url: '/season',
            templateUrl: 'modules/season/season.tpl.html'
        })
            .state('team', {
            url: '/team',
            templateUrl: 'modules/team/team.tpl.html'
        })
            .state('planning', {
            url: '/planning',
            templateUrl: 'modules/planning/planning.tpl.html'
        })
            .state('profile', {
            url: '/profile',
            templateUrl: 'modules/user/user.tpl.html'
        });
        // TODO @theBull - implement
        // .state('film', {
        // 	url: '/film',
        // 	templateUrl: 'modules/film/film.tpl.html'
        // })
        // .state('stats', {
        // 	url: '/stats',
        // 	templateUrl: 'modules/stats/stats.tpl.html'
        // });
        console.debug('impakt - config');
    }])
    .run([
    '$http',
    '$window',
    '__auth',
    '__localStorage',
    '__context',
    '__notifications',
    '_user',
    function ($http, $window, __auth, __localStorage, __context, __notifications, _user) {
        console.debug('impakt - running');
        var accessToken = __localStorage.getAccessToken();
        if (accessToken) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
            var notification = __notifications.pending('Initializing user...');
            _user.initialize().then(function () {
                notification.success('User successfully initialized');
            }, function (err) {
                notification.error('Failed to initialize user');
            });
        }
        else {
            $window.location.href = '/signin.html';
        }
    }]);
impakt.signin = angular.module('impakt.signin', [
    // module registration
    'ui.router',
    'ui.bootstrap',
    'impakt.common'
])
    .config([
    function () {
        console.debug('impakt.signin - config');
    }])
    .run([
    '$http',
    '$window',
    '$location',
    '__signin',
    function ($http, $window, $location, __signin) {
        console.debug('impakt.signin - running');
        // TODO: Change to application/json?
        $http.defaults.headers.common =
            { 'Content-Type': 'application/json' };
        // attempt login
        //__signin.signin();
    }]);
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
/// <reference path='../js/impakt.ts' />
/// <reference path='./common.ts' />
impakt.common = angular.module('impakt.common', [
    'impakt.common.api',
    'impakt.common.auth',
    'impakt.common.contextmenu',
    'impakt.common.context',
    'impakt.common.base',
    'impakt.common.scrollable',
    'impakt.common.modals',
    'impakt.common.localStorage',
    'impakt.common.parser',
    'impakt.common.signin',
    'impakt.common.locale',
    'impakt.common.ui',
    'impakt.common.notifications'
])
    .config(function () {
    console.debug('impakt.common - config');
})
    .run(function () {
    console.debug('impakt.common - run');
});
/// <reference path='../common.mdl.ts' />
impakt.common.api = angular.module('impakt.common.api', [])
    .config([function () {
        console.debug('impakt.common.api - config');
    }])
    .run([function () {
        console.debug('impakt.common.api - run');
    }]);
/// <reference path='./api.mdl.ts' />
impakt.common.api.constant('API', {
    'VERSION': 0.01,
    'HOST_URL': 'http://test.impaktathletics.com',
    //'HOST_URL': 'https://test-impakt.azurewebsites.net',
    'ENDPOINT': '/api',
});
/// <reference path='./api.mdl.ts' />
impakt.common.api.factory('__api', [
    'API',
    'AUTH',
    '$http',
    '$q',
    '__localStorage',
    function (API, AUTH, $http, $q, __localStorage) {
        var self = {
            post: post,
            get: get,
            path: path
        };
        function post(endpointUrl, data) {
            if (!data.OrganizationKey)
                data.OrganizationKey = __localStorage.getOrganizationKey();
            var d = $q.defer();
            $http({
                method: 'POST',
                url: path(API.HOST_URL, API.ENDPOINT, endpointUrl),
                data: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (data) {
                // TODO: handle statuses manually
                //console.log(data);
                d.resolve(data);
            }, function (err) {
                console.error(err);
                d.reject(err);
            });
            return d.promise;
        }
        function get(endpointUrl) {
            var d = $q.defer();
            $http({
                method: 'POST',
                url: path(API.HOST_URL, API.ENDPOINT, endpointUrl),
                headers: {
                    'X-HTTP-Method-Override': 'GET',
                    'Content-Type': 'application/json'
                },
                data: {
                    "OrganizationKey": __localStorage.getOrganizationKey()
                }
            }).then(function (data) {
                // TODO: handle statuses manually
                //console.log(data);
                d.resolve(data);
            }, function (err) {
                console.error(err);
                d.reject(err);
            });
            return d.promise;
        }
        function path() {
            var segments = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                segments[_i - 0] = arguments[_i];
            }
            return segments.join('');
        }
        return self;
    }]);
/// <reference path='../common.mdl.ts' />
impakt.common.auth = angular.module('impakt.common.auth', []);
/// <reference path='./auth.mdl.ts' />
impakt.common.auth.constant('AUTH', {
    'TOKEN_ENDPOINT': '/token',
    'HANDSHAKE_DUMMY': 'grant_type=password&username=fredf@imanufacture.com&Password=Abc123',
    'CREATE_ORGANIZATION': '/configuration/createOrganization',
});
/// <reference path='./auth.mdl.ts' />
(function () {
    var name = '__auth';
    impakt.common.auth.factory(name, [
        'AUTH', 'API', '$http', '$q', '__api',
        function (AUTH, API, $http, $q, __api) {
            var self = {
                getToken: getToken
            };
            function getToken(username, password) {
                var d = $q.defer();
                var data = [
                    'grant_type=password',
                    '&username=', encodeURIComponent(username),
                    '&Password=', password
                ].join('');
                $http({
                    method: 'POST',
                    url: __api.path(API.HOST_URL, AUTH.TOKEN_ENDPOINT),
                    data: data,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function (data) {
                    // TODO: handle statuses manually
                    console.log(data);
                    d.resolve(data);
                }, function (err) {
                    console.error(err);
                    d.reject(err);
                });
                return d.promise;
            }
            function createOrganization(organization) {
                var orgData = organization.toJson();
            }
            return self;
        }]);
})();
/// <reference path='../common.mdl.ts' />
/**
 * Defines a common base module for shared and inherited
 * components, such as base services and controllers.
 */
impakt.common.base = angular.module('impakt.common.base', [])
    .config(function () {
    console.debug('impakt.common.base - config');
})
    .run(function () {
    console.debug('impakt.common.base - run');
});
/// <reference path='./base.mdl.ts' />
/**
 * Defines a base service structure with methods that most
 * impakt module-level services will need.
 */
impakt.common.base.service('_base', ['$rootScope', function ($rootScope) {
        console.debug('service: impakt.common.base');
        /**
         * Register all components expected to be made ready.
         *
         * "Components" are other angular services, controllers,
         * or directives that need to have been loaded in order for
         * the editor to be truly ready for service.
         *
         * Components can notify to this service when they are
         * loading and when they have completely loaded. This
         * service can then in turn identify if it is
         * ready based on whether all of the components it is
         * expecting a 'componentLoaded' call from have been
         * called. Once all expected components have reported
         * that they are ready, we can use a ready event in the
         * service to initiate further commands.
         *
         * The name of each expected component should match the
         * string name given to angular to construct the given
         * component.
         */
        var components = new Common.Base.ComponentMap();
        this.loadComponent = function (component) {
            //console.log('component loaded', component);
            this.registerComponent(component);
            if (component.loaded)
                component.ready();
        };
        this.registerComponent = function (component) {
            components[component.guid] = component;
        };
    }]);
/// <reference path='../common.mdl.ts' />
impakt.common.context = angular.module('impakt.common.context', [])
    .config([function () {
        console.debug('impakt.common.context - config');
    }])
    .run([function () {
        console.debug('impakt.common.context - run');
    }]);
/// <reference path='./context.mdl.ts' />
impakt.common.context.factory('__context', ['$q',
    '__api',
    '__localStorage',
    '__notifications',
    '_playbook',
    function ($q, __api, __localStorage, __notifications, _playbook, _user) {
        var isReady = false;
        var readyCallbacks = [];
        function onReady(callback) {
            readyCallbacks.push(callback);
            if (isReady)
                ready();
        }
        function ready() {
            isReady = true;
            for (var i = 0; i < readyCallbacks.length; i++) {
                readyCallbacks[i]();
            }
        }
        var self = {
            initialize: initialize,
            onReady: onReady,
        };
        function initialize(context) {
            var d = $q.defer();
            console.log('Making application context initialization requests');
            if (!context.Playbook)
                context.Playbook = {};
            /**
             * Application-wide context data
             */
            context.Playbook.playbooks = new Playbook.Models.PlaybookModelCollection();
            context.Playbook.formations = new Playbook.Models.FormationCollection();
            context.Playbook.personnel = new Playbook.Models.PersonnelCollection();
            context.Playbook.assignments = new Playbook.Models.AssignmentCollection();
            context.Playbook.plays = new Playbook.Models.PlayCollection();
            context.Playbook.positionDefaults = new Playbook.Models.PositionDefault();
            context.Playbook.unitTypes = _playbook.getUnitTypes();
            context.Playbook.unitTypesEnum = _playbook.getUnitTypesEnum();
            /**
             * Module-specific context data; plays currently open in the editor
             */
            context.Playbook.editor = {
                plays: new Playbook.Models.PlayCollection(),
                tabs: new Playbook.Models.TabCollection()
            };
            /**
             * A creation context for new plays and formations.
             */
            context.Playbook.creation = {
                plays: new Playbook.Models.PlayCollection()
            };
            async.parallel([
                // Retrieve playbooks
                // Retrieve playbooks
                function (callback) {
                    _playbook.getPlaybooks().then(function (playbooks) {
                        context.Playbook.playbooks = playbooks;
                        __notifications.success('Playbooks successfully loaded');
                        callback(null, playbooks);
                    }, function (err) {
                        callback(err);
                    });
                },
                // Retrieve formations
                // Retrieve formations
                function (callback) {
                    _playbook.getFormations().then(function (formations) {
                        context.Playbook.formations = formations;
                        __notifications.success('Formations successfully loaded');
                        callback(null, formations);
                    }, function (err) {
                        callback(err);
                    });
                },
                // Retrieve personnel sets
                // Retrieve personnel sets
                function (callback) {
                    _playbook.getSets().then(function (results) {
                        if (results.personnel)
                            context.Playbook.personnel = results.personnel;
                        if (results.assignments)
                            context.Playbook.assignments = results.assignments;
                        __notifications.success('Personnel successfully loaded');
                        __notifications.success('Assignments successfully loaded');
                        callback(null, results.personnel, results.assignments);
                    }, function (err) {
                        callback(err);
                    });
                },
                // Retrieve plays
                // Retrieve plays
                function (callback) {
                    _playbook.getPlays().then(function (plays) {
                        context.Playbook.plays = plays;
                        context.Playbook.plays.forEach(function (play, index) {
                            var primaryAssociatedFormation = play.associated.formations.primary();
                            if (primaryAssociatedFormation) {
                                play.formation = context.Playbook.formations.get(primaryAssociatedFormation);
                            }
                            var primaryAssociatedPersonnel = play.associated.personnel.primary();
                            if (primaryAssociatedPersonnel) {
                                play.personnel = context.Playbook.personnel.get(primaryAssociatedPersonnel);
                            }
                        });
                        __notifications.success('Plays successfully loaded');
                        callback(null, plays);
                    }, function (err) {
                        callback(err);
                    });
                }], 
            // Final callback
            // Final callback
            function (err, results) {
                if (err) {
                    d.reject(err);
                }
                else {
                    __notifications.success('Initial data loaded successfully');
                    ready();
                    d.resolve(context);
                }
            });
            return d.promise;
        }
        return self;
    }]);
/// <reference path='../common.mdl.ts' />
impakt.common.contextmenu = angular.module('impakt.common.contextmenu', []);
/// <reference path='./common-contextmenu.mdl.ts' />
impakt.common.contextmenu.controller('common.contextmenu.ctrl', ['$scope', '__contextmenu',
    function ($scope, __contextmenu) {
        console.log('common.contextmenu.ctrl');
        $scope.$element = {};
        $scope.template = '';
        $scope.left = 0;
        $scope.top = 0;
        $scope.width = 200;
        $scope.height = 200;
        $scope.guid = '';
        $scope.visible = true;
        $scope.remove = function () {
            console.log('remove contextmenu');
            $scope.$destroy();
            if ($scope.$element) {
                $scope.$element.remove();
                $scope.$element = null;
            }
            $scope = null;
        };
        $scope.$on('$destroy', function () {
            // say goodbye to your controller here
            // release resources, cancel request...
            console.debug('destroying contextmenu controller');
        });
        __contextmenu.onclose(function (context) {
            $scope.remove();
        });
    }]).directive('contextmenu', ['__contextmenu',
    function (__contextmenu) {
        console.debug('directive: contextmenu - register');
        return {
            controller: 'common.contextmenu.ctrl',
            restrict: 'E',
            templateUrl: 'common/contextmenu/common-contextmenu.tpl.html',
            scope: {
                guid: '@',
                template: '@',
                left: '@',
                top: '@'
            },
            link: function ($scope, $element, attrs) {
                console.debug('directive: impakt.common.contextmenu - link');
            },
            compile: function ($element, $attrs) {
                console.debug('directive: impakt.common.contextmenu - compile');
                return {
                    pre: function ($scope, element, attrs) {
                        console.debug('directive: impakt.common.contextmenu - pre');
                    },
                    post: function ($scope, element, attrs) {
                        console.debug('directive: impakt.common.contextmenu - post');
                        $scope.$element = $element;
                        console.log('contextmenu left: ', attrs.left, 'contextmenu top: ', attrs.top);
                        __contextmenu.calculatePosition(parseInt(attrs.left), parseInt(attrs.top), $scope.$element);
                    }
                };
            }
        };
    }]);
/// <reference path='./common-contextmenu.mdl.ts' />
impakt.common.contextmenu.factory('__contextmenu', function () {
    console.log('creating contextmenu factory');
    var context = null;
    var closeCallbacks = [];
    var updateCallbacks = [];
    var self = {
        getContext: function () {
            return context;
        },
        setContext: function (obj) {
            console.log('set context', obj);
            context = obj;
            if (!obj)
                return;
            for (var i = 0; i < updateCallbacks.length; i++) {
                updateCallbacks[i](context);
            }
        },
        onContextUpdate: function (callback) {
            updateCallbacks.push(callback);
        },
        onclose: function (callback) {
            closeCallbacks.push(callback);
        },
        close: function () {
            console.log('closing contextmenu');
            self.setContext(null);
            while (closeCallbacks.length > 0) {
                var callback = closeCallbacks.pop();
                callback();
            }
            // updateCallbacks = [];
        },
        calculatePosition: function (left, top, $element) {
            var target = context;
            console.log('calculating contextmenu position', target);
            var canvasWidth = target.canvas.$container.width();
            var canvasHeight = target.canvas.$container.height();
            var contextmenuWidth = $element.width();
            var contextmenuHeight = $element.height();
            if (left + contextmenuWidth > canvasWidth) {
                left -= contextmenuWidth;
            }
            if (top + contextmenuHeight > canvasHeight) {
                top -= contextmenuHeight;
            }
            $element.css({ 'left': left + 'px', 'top': top + 'px' });
        }
    };
    return self;
});
/// <reference path='./ICollectionItem.ts' />
/// <reference path='./ILinkedListItem.ts' />
/// <reference path='./IModifiable.ts' />
/// <reference path='./IStorable.ts' />
/// <reference path='./IScrollable.ts' />
/// <reference path='../common.mdl.ts' />
impakt.common.localStorage = angular.module('impakt.common.localStorage', [])
    .config(function () {
    console.debug('impakt.common.localStorage - config');
})
    .run(function () {
    console.debug('impakt.common.localStorage - run');
});
/// <reference path='./localStorage.mdl.ts' />
impakt.common.localStorage.constant('LOCAL_STORAGE', {
    'ACCESS_TOKEN': 'access_token',
    'ACCESS_TOKEN_EXPIRES': 'access_token_expires',
    'USER_NAME': 'user_name',
    'ORGANIZATION_KEY': 'organization_key',
    'DEFAULT_PLAYBOOK_KEY': 'default_playbook_key',
    'DEFAULT_PLAYBOOK_UNIT_TYPE': 'default_playbook_unit_type',
    'DEFAULT_EDITOR_TYPE': 'default_editor_type',
    'DEFAULT_EDITOR_ITEM_KEY': 'default_editor_item_key',
    'DEFAULT_EDITOR_ITEM_TYPE': 'default_editor_item_type'
});
/// <reference path='./localStorage.mdl.ts' />
impakt.common.localStorage.factory('__localStorage', [
    'LOCAL_STORAGE',
    function (LOCAL_STORAGE) {
        var self = {
            getItem: getItem,
            setItem: setItem,
            getAccessToken: getAccessToken,
            setAccessToken: setAccessToken,
            clearAccessToken: clearAccessToken,
            getAccessTokenExpiration: getAccessTokenExpiration,
            getUserName: getUserName,
            getOrganizationKey: getOrganizationKey,
            setOrganizationKey: setOrganizationKey,
            isDefaultEditorInfoSet: isDefaultEditorInfoSet,
            getDefaultEditorInfo: getDefaultEditorInfo,
            setDefaultEditorInfo: setDefaultEditorInfo,
            getDefaultPlaybookKey: getDefaultPlaybookKey,
            setDefaultPlaybookKey: setDefaultPlaybookKey,
            resetDefaultPlaybookKey: resetDefaultPlaybookKey,
            getDefaultPlaybookUnitType: getDefaultPlaybookUnitType,
            setDefaultPlaybookUnitType: setDefaultPlaybookUnitType,
            resetDefaultPlaybookUnitType: resetDefaultPlaybookUnitType,
            resetDefaultPlaybook: resetDefaultPlaybook,
            getDefaultEditorType: getDefaultEditorType,
            setDefaultEditorType: setDefaultEditorType,
            resetDefaultEditorType: resetDefaultEditorType,
            getDefaultEditorItemKey: getDefaultEditorItemKey,
            setDefaultEditorItemKey: setDefaultEditorItemKey,
            resetDefaultEditorItemKey: resetDefaultEditorItemKey,
            getDefaultEditorItemType: getDefaultEditorItemType,
            setDefaultEditorItemType: setDefaultEditorItemType,
            resetDefaultEditorItemType: resetDefaultEditorItemType,
            resetDefaultEditorItem: resetDefaultEditorItem,
            signout: signout
        };
        function signout() {
            self.clearAccessToken();
            self.resetDefaultEditorItem();
            self.resetDefaultPlaybook();
        }
        function getItem(key) {
            return localStorage.getItem(key);
        }
        function setItem(key, value) {
            localStorage.setItem(key, value);
        }
        /**
         *
         * App-specific settings
         *
         */
        // Access token
        function getAccessToken() {
            return localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
        }
        function getAccessTokenExpiration() {
            return localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN_EXPIRES);
        }
        /**
         * Returns the username stored in localStorage, if it exists, otherwise throws
         * an exception.
         *
         * @return {string} the username (email) stored in local storage
         */
        function getUserName() {
            var userName = localStorage.getItem(LOCAL_STORAGE.USER_NAME);
            if (!userName)
                throw new Error('__localStorage getUserName(): user name could not be found!');
            return userName;
        }
        /**
         * Retrieves the current logged in user's organization key from local storage,
         * throws an exception if it doesn't exist.
         *
         * @return {number} The organization key
         */
        function getOrganizationKey() {
            var orgKey = localStorage.getItem(LOCAL_STORAGE.ORGANIZATION_KEY);
            if (!orgKey)
                throw new Error('__localStorage getOrganizationKey(): organization key could not be found!');
            return parseInt(orgKey);
        }
        /**
         * Sets the current organization key
         * @param {number} organizationKey the organization key
         */
        function setOrganizationKey(organizationKey) {
            if (isNaN(organizationKey))
                throw new Error('__localStorage setOrganizationKey(): Failed to set organization key ' + organizationKey);
            localStorage.setItem(LOCAL_STORAGE.ORGANIZATION_KEY, organizationKey.toString());
        }
        function setAccessToken(data) {
            self.setItem(LOCAL_STORAGE.ACCESS_TOKEN, data['access_token']);
            self.setItem(LOCAL_STORAGE.ACCESS_TOKEN_EXPIRES, data['.expires']);
            self.setItem(LOCAL_STORAGE.USER_NAME, data['userName']);
            self.setItem(LOCAL_STORAGE.ORGANIZATION_KEY, data['organizationKey']);
        }
        function clearAccessToken() {
            self.setItem(LOCAL_STORAGE.ACCESS_TOKEN, null);
            self.setItem(LOCAL_STORAGE.ACCESS_TOKEN_EXPIRES, null);
            self.setItem(LOCAL_STORAGE.USER_NAME, null);
            self.setItem(LOCAL_STORAGE.ORGANIZATION_KEY, null);
        }
        // Default Playbook Key
        function getDefaultPlaybookKey() {
            return parseInt(localStorage.getItem(LOCAL_STORAGE.DEFAULT_PLAYBOOK_KEY));
        }
        function setDefaultPlaybookKey(key) {
            self.setItem(LOCAL_STORAGE.DEFAULT_PLAYBOOK_KEY, key);
        }
        function resetDefaultPlaybookKey() {
            self.setDefaultPlaybookKey(-1);
        }
        function getDefaultPlaybookUnitType() {
            return parseInt(localStorage.getItem(LOCAL_STORAGE.DEFAULT_PLAYBOOK_UNIT_TYPE));
        }
        function setDefaultPlaybookUnitType(type) {
            self.setItem(LOCAL_STORAGE.DEFAULT_PLAYBOOK_UNIT_TYPE, type);
        }
        function resetDefaultPlaybookUnitType() {
            self.setDefaultPlaybookUnitType(-1);
        }
        function resetDefaultPlaybook() {
            self.resetDefaultPlaybookKey();
            self.resetDefaultPlaybookUnitType();
        }
        function isDefaultEditorInfoSet() {
            var info = self.getDefaultEditorInfo();
            return info && info.playbookKey > 0 && info.editorType >= 0
                && info.editorItemKey > 0 && info.editorItemType >= 0;
        }
        function setDefaultEditorInfo(playbookKey, editorType, editorItemKey, editorItemType) {
            self.setDefaultPlaybookKey(playbookKey);
            self.setDefaultEditorType(editorType);
            self.setDefaultEditorItemKey(editorItemKey);
            self.setDefaultEditorItemType(editorItemType);
        }
        function getDefaultEditorInfo() {
            return {
                playbookKey: self.getDefaultPlaybookKey(),
                editorType: self.getDefaultEditorType(),
                editorItemKey: self.getDefaultEditorItemKey(),
                editorItemType: self.getDefaultEditorItemType()
            };
        }
        function getDefaultEditorType() {
            return parseInt(localStorage.getItem(LOCAL_STORAGE.DEFAULT_EDITOR_TYPE));
        }
        function setDefaultEditorType(type) {
            self.setItem(LOCAL_STORAGE.DEFAULT_EDITOR_TYPE, type);
        }
        function resetDefaultEditorType() {
            self.setDefaultEditorType(-1);
        }
        function getDefaultEditorItemKey() {
            return parseInt(localStorage.getItem(LOCAL_STORAGE.DEFAULT_EDITOR_ITEM_KEY));
        }
        function setDefaultEditorItemKey(key) {
            self.setItem(LOCAL_STORAGE.DEFAULT_EDITOR_ITEM_KEY, key);
        }
        function resetDefaultEditorItemKey() {
            self.setDefaultEditorItemKey(-1);
        }
        function getDefaultEditorItemType() {
            return parseInt(localStorage.getItem(LOCAL_STORAGE.DEFAULT_EDITOR_ITEM_TYPE));
        }
        function setDefaultEditorItemType(type) {
            self.setItem(LOCAL_STORAGE.DEFAULT_EDITOR_ITEM_TYPE, type);
        }
        function resetDefaultEditorItemType() {
            self.setDefaultEditorItemType(-1);
        }
        function resetDefaultEditorItem() {
            self.resetDefaultEditorType();
            self.resetDefaultEditorItemKey();
            self.resetDefaultEditorItemType();
        }
        return self;
    }]);
/// <reference path='../common.mdl.ts' />
impakt.common.locale = angular.module('impakt.common.locale', [])
    .config([function () {
        console.debug('impakt.common.locale - config');
    }])
    .run([function () {
        console.debug('impakt.common.locale - run');
    }]);
/// <reference path='./locale.mdl.ts' />
impakt.common.locale.factory('__locale', [
    function () {
        var self = {
            states: states()
        };
        function states() {
            return [
                {
                    "name": "Alabama",
                    "abbreviation": "AL"
                },
                {
                    "name": "Alaska",
                    "abbreviation": "AK"
                },
                {
                    "name": "American Samoa",
                    "abbreviation": "AS"
                },
                {
                    "name": "Arizona",
                    "abbreviation": "AZ"
                },
                {
                    "name": "Arkansas",
                    "abbreviation": "AR"
                },
                {
                    "name": "California",
                    "abbreviation": "CA"
                },
                {
                    "name": "Colorado",
                    "abbreviation": "CO"
                },
                {
                    "name": "Connecticut",
                    "abbreviation": "CT"
                },
                {
                    "name": "Delaware",
                    "abbreviation": "DE"
                },
                {
                    "name": "District Of Columbia",
                    "abbreviation": "DC"
                },
                {
                    "name": "Federated States Of Micronesia",
                    "abbreviation": "FM"
                },
                {
                    "name": "Florida",
                    "abbreviation": "FL"
                },
                {
                    "name": "Georgia",
                    "abbreviation": "GA"
                },
                {
                    "name": "Guam",
                    "abbreviation": "GU"
                },
                {
                    "name": "Hawaii",
                    "abbreviation": "HI"
                },
                {
                    "name": "Idaho",
                    "abbreviation": "ID"
                },
                {
                    "name": "Illinois",
                    "abbreviation": "IL"
                },
                {
                    "name": "Indiana",
                    "abbreviation": "IN"
                },
                {
                    "name": "Iowa",
                    "abbreviation": "IA"
                },
                {
                    "name": "Kansas",
                    "abbreviation": "KS"
                },
                {
                    "name": "Kentucky",
                    "abbreviation": "KY"
                },
                {
                    "name": "Louisiana",
                    "abbreviation": "LA"
                },
                {
                    "name": "Maine",
                    "abbreviation": "ME"
                },
                {
                    "name": "Marshall Islands",
                    "abbreviation": "MH"
                },
                {
                    "name": "Maryland",
                    "abbreviation": "MD"
                },
                {
                    "name": "Massachusetts",
                    "abbreviation": "MA"
                },
                {
                    "name": "Michigan",
                    "abbreviation": "MI"
                },
                {
                    "name": "Minnesota",
                    "abbreviation": "MN"
                },
                {
                    "name": "Mississippi",
                    "abbreviation": "MS"
                },
                {
                    "name": "Missouri",
                    "abbreviation": "MO"
                },
                {
                    "name": "Montana",
                    "abbreviation": "MT"
                },
                {
                    "name": "Nebraska",
                    "abbreviation": "NE"
                },
                {
                    "name": "Nevada",
                    "abbreviation": "NV"
                },
                {
                    "name": "New Hampshire",
                    "abbreviation": "NH"
                },
                {
                    "name": "New Jersey",
                    "abbreviation": "NJ"
                },
                {
                    "name": "New Mexico",
                    "abbreviation": "NM"
                },
                {
                    "name": "New York",
                    "abbreviation": "NY"
                },
                {
                    "name": "North Carolina",
                    "abbreviation": "NC"
                },
                {
                    "name": "North Dakota",
                    "abbreviation": "ND"
                },
                {
                    "name": "Northern Mariana Islands",
                    "abbreviation": "MP"
                },
                {
                    "name": "Ohio",
                    "abbreviation": "OH"
                },
                {
                    "name": "Oklahoma",
                    "abbreviation": "OK"
                },
                {
                    "name": "Oregon",
                    "abbreviation": "OR"
                },
                {
                    "name": "Palau",
                    "abbreviation": "PW"
                },
                {
                    "name": "Pennsylvania",
                    "abbreviation": "PA"
                },
                {
                    "name": "Puerto Rico",
                    "abbreviation": "PR"
                },
                {
                    "name": "Rhode Island",
                    "abbreviation": "RI"
                },
                {
                    "name": "South Carolina",
                    "abbreviation": "SC"
                },
                {
                    "name": "South Dakota",
                    "abbreviation": "SD"
                },
                {
                    "name": "Tennessee",
                    "abbreviation": "TN"
                },
                {
                    "name": "Texas",
                    "abbreviation": "TX"
                },
                {
                    "name": "Utah",
                    "abbreviation": "UT"
                },
                {
                    "name": "Vermont",
                    "abbreviation": "VT"
                },
                {
                    "name": "Virgin Islands",
                    "abbreviation": "VI"
                },
                {
                    "name": "Virginia",
                    "abbreviation": "VA"
                },
                {
                    "name": "Washington",
                    "abbreviation": "WA"
                },
                {
                    "name": "West Virginia",
                    "abbreviation": "WV"
                },
                {
                    "name": "Wisconsin",
                    "abbreviation": "WI"
                },
                {
                    "name": "Wyoming",
                    "abbreviation": "WY"
                }
            ];
        }
        return self;
    }]);
/// <reference path='../common.mdl.ts' />
impakt.common.modals = angular.module('impakt.common.modals', [])
    .config([function () {
        console.debug('impakt.common.modals - config');
    }])
    .run([function () {
        console.debug('impakt.common.modals - run');
    }]);
/// <reference path='./modals.mdl.ts' />
impakt.common.modals.factory('__modals', [
    '$uibModal',
    function ($uibModal) {
        var self = {
            open: open
        };
        function open(size, templateUrl, controllerName, resolveData) {
            console.log('open modal', resolveData);
            for (var key in resolveData) {
                if (typeof resolveData[key] != 'function') {
                    throw Error(['Modal resolve data must be given ',
                        'as an anonymous function which ',
                        'returns a value.',
                        ' | key: ', key,
                        ' | data: ', resolveData[key]
                    ].join(''));
                }
            }
            return $uibModal.open({
                animation: true,
                backdrop: true,
                size: size,
                templateUrl: templateUrl,
                controller: controllerName,
                resolve: resolveData
            });
        }
        return self;
    }]);
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Storable = (function () {
            function Storable() {
                this.guid = Common.Utilities.guid();
            }
            Storable.prototype.toJson = function () {
                return {
                    guid: this.guid
                };
            };
            Storable.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.guid = json.guid;
            };
            return Storable;
        })();
        Models.Storable = Storable;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Modifiable = (function (_super) {
            __extends(Modifiable, _super);
            function Modifiable(context) {
                _super.call(this);
                this.context = context;
                this.lastModified = Date.now();
                this.modified = false;
                this.checksum = null;
                this.original = null;
                // always listening. To prevent re-hashing from occurring when initializing
                // an object, insert the .listen(false) method into the method chain prior
                // to calling a method that will trigger a modification.
                this.listening = true;
                this.callbacks = [];
            }
            /**
             * Allows for switching the listening mechanism on or off
             * within a method chain. listen(false) would prevent
             * any mutation from triggering a rehash.
             *
             * @param {boolean} startListening true or false
             */
            Modifiable.prototype.listen = function (startListening) {
                this.listening = startListening;
                return this;
            };
            Modifiable.prototype._clearListeners = function () {
                // empty all callbacks
                this.callbacks = [];
            };
            /**
             * Register listeners to be fired when this object is modified.
             * NOTE: the modifier will only keep the listener passed in if
             * listening == true; otherwise, listeners will be ignored.
             *
             * @param {Function} callback function to invoke when a modification
             * occurs to this object.
             */
            Modifiable.prototype.onModified = function (callback) {
                if (this.listening) {
                    this.callbacks.push(callback);
                }
            };
            Modifiable.prototype.isModified = function () {
                if (this.listening) {
                    // current checksum and stored checksum mismatch; modified
                    this.modified = true;
                    // track the modification date/time
                    this.lastModified = Date.now();
                    // invoke each of the modifiable's callbacks
                    for (var i = 0; i < this.callbacks.length; i++) {
                        var callback = this.callbacks[i];
                        callback(this);
                    }
                }
            };
            /**
             * Determines whether there are any changes to the object,
             * or allows for explicitly committing a modification to the
             * object to trigger its modification listeners to fire.
             *
             * @param  {boolean} isModified (optional) true forces modification
             * @return {boolean}            returns whether the object is modified
             */
            Modifiable.prototype.setModified = function (forciblyModify) {
                if (!this.listening) {
                    this.modified = false;
                    return false;
                }
                else {
                    var cs = this._generateChecksum();
                    if (forciblyModify || cs !== this.checksum) {
                        // trigger all callbacks listening for changes
                        this.isModified();
                    }
                    else {
                        this.modified = false;
                    }
                    this.checksum = cs;
                }
                return this.modified;
            };
            /**
             * Generates a new checksum from the current object
             * @return {string} the newly generated checksum
             */
            Modifiable.prototype._generateChecksum = function () {
                // determine current checksum
                var json = this.context.toJson();
                return Common.Utilities.generateChecksum(json);
            };
            Modifiable.prototype.copy = function (newElement, context) {
                var copiedJson = context.toJson();
                newElement.fromJson(copiedJson);
                newElement.setModified(true);
                return newElement;
            };
            Modifiable.prototype.toJson = function () {
                return {
                    lastModified: this.lastModified,
                    guid: this.guid,
                    checksum: this.checksum
                };
            };
            Modifiable.prototype.fromJson = function (json) {
                this.modified = json.modified;
                this.lastModified = json.lastModified;
                this.guid = json.guid || this.guid;
                this.original = json.checksum;
                this.checksum = Common.Utilities.generateChecksum(this.toJson());
            };
            return Modifiable;
        })(Common.Models.Storable);
        Models.Modifiable = Modifiable;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Collection = (function (_super) {
            __extends(Collection, _super);
            function Collection() {
                _super.call(this);
                this._count = 0;
                this._keys = [];
            }
            Collection.prototype._getKey = function (data) {
                if (data && data.guid) {
                    return data.guid;
                }
                else {
                    //throw new Error('Object does not have a guid');
                    console.error('Object does not have a guid');
                }
            };
            Collection.prototype._ensureKeyType = function (key) {
                if (typeof key == 'string') {
                    // could be valid string 'foo' or number hidden as string '2'
                    // convert '2' to 2
                    var k = key.toString();
                    var ki = parseInt(k);
                    key = isNaN(ki) || k.indexOf('-') > -1 ? k : ki;
                }
                return key;
            };
            Collection.prototype.size = function () {
                return this._count;
            };
            Collection.prototype.isEmpty = function () {
                return this.size() == 0;
            };
            Collection.prototype.hasElements = function () {
                return this.size() > 0;
            };
            Collection.prototype.get = function (key) {
                key = this._ensureKeyType(key);
                return this[key];
            };
            Collection.prototype.exists = function (key) {
                return this.contains(key);
            };
            Collection.prototype.first = function () {
                return this.getOne();
            };
            Collection.prototype.getOne = function () {
                return this[this._keys[0]];
            };
            Collection.prototype.getIndex = function (index) {
                return this.get(this._keys[index]);
            };
            Collection.prototype.getAll = function () {
                var obj = {};
                for (var i = 0; i < this._keys.length; i++) {
                    var key = this._keys[i];
                    // shitty way of hiding private properties
                    obj[key] = this.get(key);
                }
                return obj;
            };
            /**
             * Retrieves the last element in the collection
             * @return {T} [description]
             */
            Collection.prototype.getLast = function () {
                var key = this._keys[this._keys.length - 1];
                return this.get(key);
            };
            Collection.prototype.set = function (key, data) {
                if (!this.hasOwnProperty(key.toString()))
                    throw Error('Object does not have key ' + key + '. Use the add(key) method.');
                this[key] = data;
            };
            Collection.prototype.replace = function (replaceKey, data) {
                var key = this._getKey(data);
                this._keys[this._keys.indexOf(replaceKey)] = key;
                this[key] = data;
                delete this[replaceKey];
            };
            Collection.prototype.setAtIndex = function (index, data) {
            };
            Collection.prototype.add = function (data) {
                var key = this._getKey(data);
                if (this[key] && this._keys.indexOf(key) > -1) {
                    this.set(key, data);
                }
                else {
                    this[key] = data;
                    this._keys.push(key);
                    this._count++;
                }
            };
            Collection.prototype.addAll = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                if (!args)
                    return;
                for (var i = 0; i < args.length; i++) {
                    var item = args[i];
                    if (item)
                        this.add(item);
                }
            };
            Collection.prototype.addAtIndex = function (data, index) {
                var key = this._getKey(data);
                var exists = this._keys.indexOf(key) > -1;
                if (!exists || this._keys.indexOf(key) == index) {
                    // element exists at that index, update	
                    // OR, element does not exist, add at index
                    this[key] = data;
                    this._keys[index] = key;
                    if (!exists)
                        this._count++;
                }
                else {
                    // element exists at different index...
                    // ignore for now...
                    var currentIndex = this._keys.indexOf(key);
                    throw new Error([
                        'The element you want to add at this',
                        ' index already exists at index (',
                        currentIndex,
                        '). Ignoring for now...'
                    ].join(''));
                }
            };
            Collection.prototype.append = function (collection) {
                // adds the given collection onto the end of this collection
                // E.g.
                // this -> [1, 2, 3]
                // collection -> [4, 5, 6]
                // this.append(collection) -> [1, 2, 3, 4, 5, 6]
                var self = this;
                collection.forEach(function (item, index) {
                    if (item && item.guid) {
                        self.add(item);
                    }
                    else {
                        throw new Error('item is null or does not have guid');
                    }
                });
            };
            Collection.prototype.forEach = function (iterator) {
                if (!this._keys)
                    return;
                for (var i = 0; i < this._keys.length; i++) {
                    var key = this._keys[i];
                    iterator(this[key], i);
                }
            };
            Collection.prototype.hasElementWhich = function (predicate) {
                return this.filterFirst(predicate) != null;
            };
            Collection.prototype.filter = function (predicate) {
                var results = [];
                this.forEach(function (element, index) {
                    if (predicate(element)) {
                        results.push(element);
                    }
                });
                return results;
            };
            Collection.prototype.filterFirst = function (predicate) {
                var results = this.filter(predicate);
                return results && results.length > 0 ? results[0] : null;
            };
            Collection.prototype.remove = function (key) {
                if (!this[key])
                    throw Error('Object at key ' + key + ' does not exist');
                var obj = this[key];
                delete this[key];
                this._keys.splice(this._keys.indexOf(key), 1);
                this._count--;
                return obj;
            };
            Collection.prototype.removeAll = function () {
                while (this._count > 0) {
                    var key = this._keys[0];
                    this.remove(key);
                }
            };
            /**
             * Allows you to run an iterator method over each item
             * in the collection before the collection is completely
             * emptied.
             */
            Collection.prototype.removeEach = function (iterator) {
                // first, run the iterator over each item in the
                // collection
                this.forEach(iterator);
                // now remove all of them
                this.removeAll();
            };
            Collection.prototype.contains = function (key) {
                return this[key] != null && this[key] != undefined;
            };
            Collection.prototype.toArray = function () {
                var arr = [];
                for (var i = 0; i < this._keys.length; i++) {
                    arr.push(this.get(this._keys[i]));
                }
                return arr;
            };
            Collection.prototype.toJson = function () {
                var results = [];
                this.forEach(function (element, index) {
                    results.push(element.toJson());
                });
                return results;
            };
            return Collection;
        })(Common.Models.Storable);
        Models.Collection = Collection;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var LinkedList = (function (_super) {
            __extends(LinkedList, _super);
            function LinkedList() {
                _super.call(this);
                this.root = null;
                this.last = null;
                this._length = 0;
            }
            LinkedList.prototype.add = function (node) {
                if (!this.root) {
                    this.root = node;
                    this.root.prev = null;
                }
                else {
                    var temp = this.root;
                    while (temp.next != null) {
                        temp = temp.next;
                    }
                    node.prev = temp;
                    temp.next = node;
                }
                this.last = node;
                this._length++;
            };
            LinkedList.prototype.getIndex = function (index) {
                var count = 0;
                var temp = this.root;
                if (!temp)
                    return null;
                while (temp) {
                    if (count == index)
                        return temp;
                    if (temp.next) {
                        temp = temp.next;
                        count++;
                    }
                    else {
                        return null;
                    }
                }
            };
            LinkedList.prototype.forEach = function (iterator) {
                var index = 0;
                var temp = this.root;
                iterator(temp, index);
                if (!temp)
                    return;
                while (temp.next != null) {
                    temp = temp.next;
                    index++;
                    iterator(temp, index);
                }
            };
            LinkedList.prototype.toJson = function () {
                var arr = [];
                this.forEach(function (node, i) {
                    if (node && node.toJson) {
                        arr.push(node.toJson());
                    }
                    else {
                        throw new Error('node data is null or toJson not implemented');
                        arr.push(null);
                    }
                });
                return arr;
            };
            LinkedList.prototype.toDataArray = function () {
                var arr = Array();
                this.forEach(function (node, i) {
                    arr.push(node.data);
                });
                return arr;
            };
            LinkedList.prototype.toArray = function () {
                var arr = Array();
                this.forEach(function (node, i) {
                    arr.push(node);
                });
                return arr;
            };
            LinkedList.prototype.getLast = function () {
                return this.last;
            };
            LinkedList.prototype.remove = function (guid) {
                throw Error('not implemented');
            };
            LinkedList.prototype.size = function () {
                return this._length;
            };
            LinkedList.prototype.hasElements = function () {
                return this.size() > 0;
            };
            return LinkedList;
        })(Common.Models.Storable);
        Models.LinkedList = LinkedList;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var LinkedListNode = (function (_super) {
            __extends(LinkedListNode, _super);
            function LinkedListNode(data, next, prev) {
                _super.call(this);
                this.data = data;
                this.data.node = this;
                this.next = next;
                this.prev = prev || null;
            }
            LinkedListNode.prototype.toJson = function () {
                return Common.Utilities.toJson(this.data);
            };
            return LinkedListNode;
        })(Common.Models.Storable);
        Models.LinkedListNode = LinkedListNode;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var ModifiableCollection = (function () {
            function ModifiableCollection() {
                this._modifiable = new Common.Models.Modifiable(this);
                this._collection = new Common.Models.Collection();
                this.guid = this._modifiable.guid;
            }
            ModifiableCollection.prototype.setModified = function (forciblyModify) {
                return this._modifiable.setModified(forciblyModify === true);
            };
            ModifiableCollection.prototype.onModified = function (callback) {
                var self = this;
                this._modifiable.onModified(callback);
                this._collection.forEach(function (modifiableItem, index) {
                    modifiableItem.onModified(function () {
                        // child elements modified, 
                        // propegate changes up to the parent
                        self.isModified();
                    });
                });
            };
            ModifiableCollection.prototype.isModified = function () {
                this._modifiable.isModified();
            };
            /**
             * When commanding the collection whether to listen,
             * apply the true/false argument to all of its contents as well
             * @param {boolean} startListening true to start listening, false to stop
             */
            ModifiableCollection.prototype.listen = function (startListening) {
                this._modifiable.listening = startListening;
                return this;
            };
            ModifiableCollection.prototype.size = function () {
                return this._collection.size();
            };
            ModifiableCollection.prototype.isEmpty = function () {
                return this._collection.isEmpty();
            };
            ModifiableCollection.prototype.hasElements = function () {
                return this._collection.hasElements();
            };
            ModifiableCollection.prototype.get = function (key) {
                return this._collection.get(key);
            };
            ModifiableCollection.prototype.first = function () {
                return this._collection.first();
            };
            ModifiableCollection.prototype.getOne = function () {
                return this._collection.getOne();
            };
            ModifiableCollection.prototype.getIndex = function (index) {
                return this._collection.getIndex(index);
            };
            ModifiableCollection.prototype.set = function (key, data) {
                this._collection.set(key, data);
                this._modifiable.setModified();
                return this;
            };
            ModifiableCollection.prototype.replace = function (replaceKey, data) {
                this._collection.replace(replaceKey, data);
                this._modifiable.setModified();
                return this;
            };
            ModifiableCollection.prototype.setAtIndex = function (index, data) {
                this._collection.setAtIndex(index, data);
                this._modifiable.setModified();
                return this;
            };
            ModifiableCollection.prototype.add = function (data) {
                this._collection.add(data);
                this._modifiable.setModified();
                return this;
            };
            ModifiableCollection.prototype.addAll = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                (_a = this._collection).addAll.apply(_a, args);
                this._modifiable.setModified();
                return this;
                var _a;
            };
            ModifiableCollection.prototype.addAtIndex = function (data, index) {
                this._collection.addAtIndex(data, index);
                this._modifiable.setModified();
                return this;
            };
            ModifiableCollection.prototype.append = function (collection) {
                this._collection.append(collection);
                this._modifiable.setModified();
                return this;
            };
            ModifiableCollection.prototype.forEach = function (iterator) {
                this._collection.forEach(iterator);
            };
            ModifiableCollection.prototype.hasElementWhich = function (predicate) {
                return this._collection.hasElementWhich(predicate);
            };
            ModifiableCollection.prototype.filter = function (predicate) {
                return this._collection.filter(predicate);
            };
            ModifiableCollection.prototype.filterFirst = function (predicate) {
                return this._collection.filterFirst(predicate);
            };
            ModifiableCollection.prototype.remove = function (key) {
                var results = this._collection.remove(key);
                this._modifiable.setModified();
                return results;
            };
            ModifiableCollection.prototype.removeAll = function () {
                this._collection.removeAll();
                this._modifiable.setModified();
            };
            ModifiableCollection.prototype.empty = function () {
                this.removeAll();
            };
            /**
             * Allows you to run an iterator method over each item
             * in the collection before the collection is completely
             * emptied.
             */
            ModifiableCollection.prototype.removeEach = function (iterator) {
                this._collection.removeEach(iterator);
                this._modifiable.setModified();
            };
            ModifiableCollection.prototype.contains = function (key) {
                return this._collection.contains(key);
            };
            ModifiableCollection.prototype.getAll = function () {
                return this._collection.getAll();
            };
            ModifiableCollection.prototype.getLast = function () {
                return this._collection.getLast();
            };
            ModifiableCollection.prototype.toArray = function () {
                return this._collection.toArray();
            };
            ModifiableCollection.prototype.toJson = function () {
                return this._collection.toJson();
            };
            ModifiableCollection.prototype.copy = function (newElement, context) {
                console.error('ModifiableCollection copy() not implemented');
                return null;
            };
            return ModifiableCollection;
        })();
        Models.ModifiableCollection = ModifiableCollection;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var ModifiableLinkedList = (function (_super) {
            __extends(ModifiableLinkedList, _super);
            function ModifiableLinkedList() {
                _super.call(this);
                this._modifiable = new Common.Models.Modifiable(this);
            }
            ModifiableLinkedList.prototype.add = function (node) {
                _super.prototype.add.call(this, node);
                this._modifiable.setModified();
            };
            ModifiableLinkedList.prototype.getIndex = function (index) {
                return _super.prototype.getIndex.call(this, index);
            };
            ModifiableLinkedList.prototype.forEach = function (iterator) {
                _super.prototype.forEach.call(this, iterator);
            };
            ModifiableLinkedList.prototype.toJson = function () {
                return _super.prototype.toJson.call(this);
            };
            ModifiableLinkedList.prototype.toDataArray = function () {
                return _super.prototype.toDataArray.call(this);
            };
            ModifiableLinkedList.prototype.toArray = function () {
                return _super.prototype.toArray.call(this);
            };
            ModifiableLinkedList.prototype.getLast = function () {
                return _super.prototype.getLast.call(this);
            };
            ModifiableLinkedList.prototype.remove = function (guid) {
                var results = _super.prototype.remove.call(this, guid);
                this._modifiable.setModified();
                return results;
            };
            ModifiableLinkedList.prototype.size = function () {
                return _super.prototype.size.call(this);
            };
            ModifiableLinkedList.prototype.hasElements = function () {
                return _super.prototype.hasElements.call(this);
            };
            return ModifiableLinkedList;
        })(Common.Models.LinkedList);
        Models.ModifiableLinkedList = ModifiableLinkedList;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var ModifiableLinkedListNode = (function (_super) {
            __extends(ModifiableLinkedListNode, _super);
            function ModifiableLinkedListNode(data, next, prev) {
                _super.call(this, data, next, prev);
            }
            ModifiableLinkedListNode.prototype.toJson = function () {
                return _super.prototype.toJson.call(this);
            };
            return ModifiableLinkedListNode;
        })(Common.Models.LinkedListNode);
        Models.ModifiableLinkedListNode = ModifiableLinkedListNode;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var AssociationArray = (function (_super) {
            __extends(AssociationArray, _super);
            function AssociationArray() {
                _super.call(this, this);
                this._array = [];
            }
            AssociationArray.prototype.size = function () {
                return this._array.length;
            };
            AssociationArray.prototype.add = function (guid) {
                this._array.push(guid);
            };
            AssociationArray.prototype.addAll = function (guids) {
                this._array.concat(guids);
            };
            AssociationArray.prototype.addAtIndex = function (guid, index) {
                this._array[index] = guid;
            };
            AssociationArray.prototype.primary = function () {
                return this.getAtIndex(0);
            };
            AssociationArray.prototype.getAtIndex = function (index) {
                return this._array[index];
            };
            AssociationArray.prototype.first = function (guid) {
                this.addAtIndex(guid, 0);
            };
            AssociationArray.prototype.only = function (guid) {
                this._array = [];
                this.add(guid);
            };
            AssociationArray.prototype.empty = function () {
                this._array = [];
            };
            AssociationArray.prototype.remove = function (guid) {
                if (this.exists(guid)) {
                    this._array.splice(this._array.indexOf(guid), 1);
                    return guid;
                }
                else {
                    throw new Error(['Association does not exist: ', guid].join(''));
                    return null;
                }
            };
            /**
             * Returns whether the given guid exists
             * @param  {string}  guid the guid to check
             * @return {boolean}      true if it exists, otherwise false
             */
            AssociationArray.prototype.exists = function (guid) {
                return this.hasElements() && this._array.indexOf(guid) > -1;
            };
            /**
             * Returns whether the array has elements
             * @return {boolean} true or false
             */
            AssociationArray.prototype.hasElements = function () {
                return this.size() > 0;
            };
            /**
             * Replaces guid1, if found, with guid2
             * @param  {string} guid1 guid to be replaced
             * @param  {string} guid2 guid to replace with
             */
            AssociationArray.prototype.replace = function (guid1, guid2) {
                if (this.exists(guid1)) {
                    this._array[this._array.indexOf(guid1)] = guid2;
                }
            };
            /**
             * Iterates over each element in the array
             * @param {Function} iterator the iterator function to call per element
             */
            AssociationArray.prototype.forEach = function (iterator) {
                for (var i = 0; i < this._array.length; i++) {
                    var guid = this._array[i];
                    iterator(guid, i);
                }
            };
            AssociationArray.prototype.toArray = function () {
                return this._array;
            };
            AssociationArray.prototype.toJson = function () {
                return this.toArray();
            };
            AssociationArray.prototype.fromJson = function (json) {
                this._array = json;
            };
            return AssociationArray;
        })(Common.Models.Modifiable);
        Models.AssociationArray = AssociationArray;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
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
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var NotificationCollection = (function (_super) {
            __extends(NotificationCollection, _super);
            function NotificationCollection() {
                _super.call(this);
            }
            return NotificationCollection;
        })(Common.Models.Collection);
        Models.NotificationCollection = NotificationCollection;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Template = (function (_super) {
            __extends(Template, _super);
            function Template(name, url) {
                _super.call(this);
                this.name = name;
                this.url = url;
                this.data = {};
            }
            return Template;
        })(Common.Models.Storable);
        Models.Template = Template;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var TemplateCollection = (function (_super) {
            __extends(TemplateCollection, _super);
            function TemplateCollection(name) {
                _super.call(this);
                this.name = name;
            }
            return TemplateCollection;
        })(Common.Models.Collection);
        Models.TemplateCollection = TemplateCollection;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
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
/// <reference path='../common.ts' />
/// <reference path='../interfaces/interfaces.ts' />
/// <reference path='./Storable.ts' />
/// <reference path='./Modifiable.ts' />
/// <reference path='./Collection.ts' />
/// <reference path='./LinkedList.ts' />
/// <reference path='./LinkedListNode.ts' />
/// <reference path='./ModifiableCollection.ts' />
/// <reference path='./ModifiableLinkedList.ts' />
/// <reference path='./ModifiableLinkedListNode.ts' />
/// <reference path='./AssociationArray.ts' />
/// <reference path='./Association.ts' />
/// <reference path='./Notification.ts' />
/// <reference path='./NotificationCollection.ts' />
/// <reference path='./Template.ts' />
/// <reference path='./TemplateCollection.ts' />
/// <reference path='./input/keyboard/KeyboardInput.ts' />
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        /**
         * Associates an element with one or more other elements
         * by guid.
         */
        var Association = (function (_super) {
            __extends(Association, _super);
            function Association() {
                _super.call(this, this);
                this.playbooks = new Common.Models.AssociationArray();
                this.formations = new Common.Models.AssociationArray();
                this.personnel = new Common.Models.AssociationArray();
                this.assignments = new Common.Models.AssociationArray();
                this.plays = new Common.Models.AssociationArray();
            }
            Association.prototype.toJson = function () {
                var self = this;
                return {
                    playbooks: self.playbooks.toJson(),
                    formations: self.formations.toJson(),
                    personnel: self.personnel.toJson(),
                    assignments: self.assignments.toJson(),
                    plays: self.plays.toJson(),
                    guid: self.guid
                };
            };
            Association.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.playbooks.addAll(json.playbooks);
                this.formations.addAll(json.formations);
                this.personnel.addAll(json.personnel);
                this.assignments.addAll(json.assignments);
                this.plays.addAll(json.plays);
                this.guid = json.guid || this.guid;
            };
            return Association;
        })(Common.Models.Modifiable);
        Models.Association = Association;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='../common.mdl.ts' />
impakt.common.notifications = angular.module('impakt.common.notifications', [])
    .config([function () {
        console.debug('impakt.common.notifications - config');
    }])
    .run([function () {
        console.debug('impakt.common.notifications - run');
    }]);
/// <reference path='./notifications.mdl.ts' />
impakt.common.notifications.controller('notifications.ctrl', [
    '$scope',
    '__notifications',
    function ($scope, __notifications) {
        $scope.notifications = __notifications.notifications;
        $scope.notificationTypes = __notifications.notificationTypes;
        $scope.test = function () {
            var index = Math.floor((Math.random() * $scope.notificationTypes.length));
            __notifications.notify('test notification!', index);
        };
        $scope.clearAll = function () {
            __notifications.removeAll();
        };
        $scope.remove = function (guid) {
            __notifications.remove(guid);
        };
    }]).directive('notifications', [
    '$compile', '__notifications',
    function ($compile, __notifications) {
        return {
            restrict: 'E',
            templateUrl: 'common/notifications/notifications.tpl.html',
            controller: 'notifications.ctrl',
            link: function ($scope, $element, attrs) {
            }
        };
    }])
    .directive('notificationItem', [function () {
        return {
            restrict: 'E',
            templateUrl: 'common/notifications/notification-item.tpl.html',
            controller: 'notifications.ctrl',
            link: function ($scope, $element, attrs) {
                console.log('notifications type', attrs.type);
                var css = '';
                switch (attrs.type) {
                }
            }
        };
    }]);
/// <reference path='./notifications.mdl.ts' />
impakt.common.notifications.service('__notifications', [
    function () {
        this.notifications = new Common.Models.NotificationCollection();
        this.notificationTypes = Common.Utilities.getEnumerationsAsArray(Common.Models.NotificationType);
        /**
         * Removes ("Clears") all notifications
         */
        this.removeAll = function () {
            this.notifications.removeAll();
        };
        /**
         * Removes the given notification by guid
         * @param  {string}                     guid Guid of notification to remove
         * @return {Common.Models.Notification}      The removed notification
         */
        this.remove = function (guid) {
            return this.notifications.remove(guid);
        };
        /**
         * Creates a new notification with the given message and type
         * @param  {string}                         message The message to notify
         * @param  {Common.Models.NotificationType} type    The type of notification to display
         * @return {Common.Models.Notification}             The created notification
         */
        this.notify = function (message, type) {
            var notificationModel = new Common.Models.Notification(message, type);
            this.notifications.add(notificationModel);
            return notificationModel;
        };
        /**
         * Shorthand for creating a success notification
         * @param  {string}                     ...args Message strings to be concatenated
         * @return {Common.Models.Notification}         New notification created
         */
        this.success = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return this.notify(_concat(args), Common.Models.NotificationType.Success);
        };
        /**
         * Shorthand for creating an error notification
         * @param  {string}                     ...args Message strings to be concatenated
         * @return {Common.Models.Notification}         New notification created
         */
        this.error = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return this.notify(_concat(args), Common.Models.NotificationType.Error);
        };
        /**
         * Shorthand for creating a warning notification
         * @param  {string}                     ...args Message strings to be concatenated
         * @return {Common.Models.Notification}         New notification created
         */
        this.warning = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return this.notify(_concat(args), Common.Models.NotificationType.Warning);
        };
        /**
         * Shorthand for creating an info notification
         * @param  {string}                     ...args Message strings to be concatenated
         * @return {Common.Models.Notification}         New notification created
         */
        this.info = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return this.notify(_concat(args), Common.Models.NotificationType.Info);
        };
        /**
         * Shorthand for creating a pending notification; this will display a spinner
         * graphic to indicate that it is in progress (TO-DO).
         * @param  {string}                     ...args Message strings to be concatenated
         * @return {Common.Models.Notification}         New notification created
         */
        this.pending = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return this.notify(_concat(args), Common.Models.NotificationType.Pending);
        };
        function _concat(args) {
            return !args || !args.length || args.length <= 0 ? '' : args.join('');
        }
    }
]);
/// <reference path='../common.mdl.ts' />
impakt.common.parser = angular.module('impakt.common.parser', [])
    .config(function () {
    console.debug('impakt.common.parser - config');
})
    .run(function () {
    console.debug('impakt.common.parser - run');
});
/// <reference path='./parser.mdl.ts' />
impakt.common.parser.constant('PARSER', {});
/// <reference path='./parser.mdl.ts' />
impakt.common.parser.factory('__parser', [
    'PARSER',
    function (PARSER) {
        var self = {
            camelCaseToSpace: camelCaseToSpace,
            convertEnumToList: convertEnumToList,
            toJson: toJson
        };
        function camelCaseToSpace(str, capitalizeFirst) {
            return Common.Utilities.camelCaseToSpace(str, capitalizeFirst);
        }
        function convertEnumToList(obj) {
            return Common.Utilities.convertEnumToList(obj);
        }
        /**
         * takes a complex javascript object
         * (containing primitives, objects & functions)
         * and returns a json object containing entries
         * which are explicitly defined by the object's
         * implementation of a 'toJson()' method.
         *
         * If the object does not implement a 'toJson()' method,
         * the object returned by this method will be null.
         *
         * If the object contains child objects, each child object
         * will be recursively searched for a 'toJson()' method, and
         * the same logic is applied.
         *
         * Functions stored within the json object will be dropped.
         */
        function toJson(obj) {
            return Common.Utilities.toJson(obj);
        }
        return self;
    }]);
/// <reference path='../common.mdl.ts' />
impakt.common.scrollable = angular.module('impakt.common.scrollable', [])
    .config(function () {
    console.debug('impakt.common.scrollable - config');
})
    .run(function () {
    console.debug('impakt.common.scrollable - run');
});
///<reference path='./scrollable.mdl.ts' />
impakt.common.scrollable.directive('scrollable', ['_scrollable', function (_scrollable) {
        console.debug('directive: impakt.common.scrollable - register');
        return {
            restrict: 'A',
            link: function ($scope, $element, attrs) {
                console.log('scrollable element');
            }
        };
    }]);
/// <reference path='./scrollable.mdl.ts' />
impakt.common.scrollable.service('_scrollable', ['$rootScope', function ($rootScope) {
        console.debug('service: impakt.common.scrollable');
        var self = this;
        var down, up;
        this.$container;
        this.$head;
        this.headHeight;
        this.$well;
        this.content;
        this.contentHeight;
        this.HEIGHT_RATIO;
        this.deltaY;
        this.deltaX;
        this.offsetY;
        this.deltaRatioY;
        this.offsetX;
        this.deltaRatioX;
        this.speed;
        this.range;
        this.altKeyPressed;
        this.speed;
        this.readyCallback = function () {
            console.log('scrollable ready');
        };
        this.scrollCallback = function (x, y) {
            //console.log('scrolling...');
        };
        this.initialize = function ($container, content) {
            this.altKeyPressed = false;
            // main container window and inner content
            this.$container = $container;
            this.height = $container.height();
            this.content = content;
            this.contentHeight = content.getHeight();
            this.HEIGHT_RATIO = this.height / this.contentHeight;
            // console.log(
            // 	'container height: ', this.height, 
            // 	'content height: ', this.contentHeight, 
            // 	'ratio: ', this.HEIGHT_RATIO
            // );
            this.$head = $("<div class='scroll-head'></div>");
            this.$well = $("<div class='scroll'></div>").append(this.$head);
            this.$container.find('.scroll').remove();
            this.$container.addClass('scrollable-container').append(this.$well);
            this.offsetY = 0;
            this.offsetX = 0;
            this.deltaY = 0;
            this.deltaX = 0;
            this.speed = 0.25; // must be between 0 and 1!
            if (this.speed < 0 || this.speed > 1) {
                throw new Error('scroll speed must be between 0 and 1');
            }
            this.deltaRatioY = 0;
            this.deltaRatioX = 0;
            this.headHeight = Math.ceil(this.HEIGHT_RATIO * this.height);
            this.$head.height(this.headHeight);
            this.headOffsetY = 0;
            this.headOffsetX = 0;
            console.log('container height: ', this.height, 'head height: ', this.headHeight);
            this.range = this.contentHeight - this.height;
            this.headRange = this.height - this.headHeight;
            down = false;
            up = false;
            // set the event listener to the mousewheel event
            this.setListener();
            this.ready();
        };
        this.setListener = function () {
            this.$head.draggable({
                axis: 'y',
                containment: '.scrollable-container .scroll',
                drag: function (event, ui) {
                    // TODO implement
                }
            });
            this.$container[0].addEventListener('mousewheel', function (event) {
                self.scroll.call(self, event.wheelDeltaX, event.wheelDeltaY, event.altKey);
            }, false);
        };
        this.isDown = function () {
            return down && self.offsetY > -self.range;
        };
        this.isUp = function () {
            return up && self.offsetY < 0;
        };
        this.canScroll = function () {
            return this.isDown() || this.isUp();
        };
        this.setHead = function (x, y) {
            this.$head.css({ 'top': y + 'px' });
        };
        this.onready = function (callback) {
            this.readyCallback = callback;
        };
        this.ready = function () {
            this.readyCallback(this.content);
        };
        this.onscroll = function (callback) {
            this.scrollCallback = callback;
        };
        this.scrollToPercentY = function (percentY) {
            if (percentY < 0 || percentY > 1)
                throw new Error('Percent must be between 0 and 1');
            this.headOffsetY = percentY * this.headRange;
            this.offsetY = -percentY * this.range;
            this.setHead(0, this.headOffsetY);
            this.content.scroll(this.offsetX, -this.offsetY);
        };
        this.scrollToPercentX = function (percentX) {
            // TODO implement
        };
        this.scrollToPercent = function (percentX, percentY) {
            this.scrollToPercentX(percentX);
            this.scrollToPercentY(percentY);
        };
        this.scroll = function (deltaX, deltaY, altKeyPressed) {
            self.deltaX = deltaX;
            self.deltaY = deltaY;
            self.altKeyPressed = altKeyPressed;
            self.deltaRatioX = new Number(self.deltaX * self.HEIGHT_RATIO).toFixed(1);
            self.deltaRatioY = new Number(self.deltaY * self.HEIGHT_RATIO).toFixed(1);
            down = self.deltaY < 0;
            up = !down;
            if (!self.altKeyPressed) {
                if (self.canScroll()) {
                    var scrollDistanceY = self.offsetY + (self.deltaY * self.speed);
                    var scrollableY = self.isDown() ?
                        Math.max(scrollDistanceY, -self.range) :
                        Math.min(scrollDistanceY, 0);
                    if (scrollableY < -self.range ||
                        scrollableY > 0)
                        return;
                    self.headOffsetY = -scrollableY * self.HEIGHT_RATIO;
                    self.offsetY = scrollableY;
                    self.setHead.call(self, 0, self.headOffsetY);
                    self.content.scroll(self.offsetX, -self.offsetY);
                }
                else {
                    console.log('STOP');
                }
            }
            else {
            }
            this.scrollCallback(deltaX, deltaY);
        };
    }]);
/// <reference path='../common.mdl.ts' />
impakt.common.signin = angular.module('impakt.common.signin', [])
    .config([function () {
        console.debug('impakt.common.signin - config');
    }])
    .run([function () {
        console.debug('impakt.common.signin - run');
    }]);
/// <reference path='./signin.mdl.ts' />
impakt.common.signin.constant('SIGNIN', {
    'ORG_ENDPOINT': '/configuration',
    'INVITE_ENDPOINT': '/invitations',
    'REGISTER_USER': '/registerUser',
    'CREATE_ORGANIZATION': '/createOrganization'
});
/// <reference path='./signin.mdl.ts' />
impakt.common.signin.controller('signin.ctrl', ['$scope', '__signin', '__locale',
    function ($scope, __signin, __locale) {
        $scope.showSignin = true;
        $scope.showRegister = false;
        $scope.states = __locale.states;
        $scope.signinData = {
            username: '',
            password: ''
        };
        // $scope.user = new User.Models.UserModel();
        // $scope.user.firstName = 'Danny';
        // $scope.user.lastName = 'Bullis';
        // $scope.user.email = 'daniel.p.bullis@gmail.com';
        // $scope.user.organizationName = 'Test organization';
        $scope.signinMessage = '';
        $scope.organization = new User.Models.Organization();
        $scope.account = new User.Models.Account();
        $scope.toggleSignin = function (show) {
            $scope.showSignin = show === true ? show : !$scope.showSignin;
            $scope.showRegister = !$scope.showSignin;
        };
        $scope.toggleRegister = function (show) {
            $scope.showRegister = show === true ? show : !$scope.showRegister;
            $scope.showSignin = !$scope.showRegister;
        };
        $scope.createUser = function (next) {
            console.log('creating user');
            __signin.registerUser($scope.user)
                .then(function (results) {
                console.log('user created', results);
            }, function (err) {
                console.error(err);
            });
        };
        $scope.createOrganization = function (next) {
            console.log('creating organization');
            __signin.createOrganization($scope.organization)
                .then(function (results) {
                console.log('organization created', results);
            }, function (err) {
                console.error(err);
            });
            next();
        };
        $scope.createAccount = function (next) {
            console.log('creating account');
            next();
        };
        $scope.signin = function () {
            __signin.signin($scope.signinData.username, $scope.signinData.password).then(function (results) {
                $scope.signinMessage = 'signin successful.';
            }, function (err) {
                $scope.signinMessage = err && err.data && err.data.error_description || err;
            });
        };
        $scope.register = function () {
        };
    }]);
/// <reference path='./signin.mdl.ts' />
impakt.common.signin.factory('__signin', [
    '$q',
    '$window',
    '__api',
    '__auth',
    '__localStorage',
    'SIGNIN',
    function ($q, $window, __api, __auth, __localStorage, SIGNIN) {
        var self = {
            signin: signin,
            logout: logout,
            registerUser: registerUser,
            createOrganization: createOrganization
        };
        function signin(username, password) {
            var d = $q.defer();
            // send a handshake
            __auth.getToken(username, password).then(function (data) {
                console.log(data);
                __localStorage.setAccessToken(data.data);
                $window.location.href = 'index.html';
                d.resolve(data);
            }, function (err) {
                console.error(err);
                d.reject(err);
            });
            return d.promise;
        }
        function logout() {
            __localStorage.signout();
            $window.location.href = 'signin.html';
        }
        /**
         * Takes the given user information (first, last, email, org name)
         * and sends an registration confirmation email (invite) to the user
         * @param {User.Models.UserModel} userModel user to register
         */
        function registerUser(userModel) {
            var d = $q.defer();
            var userModelJson = userModel.toJson();
            __api.post(__api.path(SIGNIN.INVITE_ENDPOINT, SIGNIN.REGISTER_USER), {
                version: 1,
                FirstName: userModel.firstName,
                LastName: userModel.lastName,
                OrganizationKey: 0,
                OrganizationName: userModel.organizationName,
                Email: userModel.email,
                data: {
                    version: 1,
                    FirstName: userModel.firstName,
                    LastName: userModel.lastName,
                    OrganizationKey: 0,
                    OrganizationName: userModel.organizationName,
                    Email: userModel.email,
                    user: userModelJson
                }
            }).then(function (results) {
                // TODO - @theBull handle register user results
                d.resolve(results);
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        }
        function createOrganization(organization) {
            var d = $q.defer();
            var organizationJson = organization.toJson();
            __api.post(__api.path(SIGNIN.ORG_ENDPOINT, SIGNIN.CREATE_ORGANIZATION), {
                version: 1,
                data: {
                    version: 1,
                    organization: organizationJson
                }
            }).then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var createdOrganization = new User.Models.Organization();
                if (results) {
                    createdOrganization.fromJson(results);
                }
                else {
                    d.reject(null);
                }
                d.resolve(createdOrganization);
            }, function (err) {
                d.reject(err);
            });
            return d.promise;
        }
        return self;
    }]);
/// <reference path='../common.mdl.ts' />
impakt.common.ui = angular.module('impakt.common.ui', [])
    .config([function () {
        console.debug('impakt.common.ui - config');
    }])
    .run([function () {
        console.debug('impakt.common.ui - run');
    }]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui.controller('expandable.ctrl', [
    '$scope', function ($scope) {
        console.log('expandable.ctrl - loaded');
        var directions = ['left', 'right', 'up', 'down'];
        $scope.direction = 'left';
        $scope.min = 3; // in em's
        $scope.max = 32; // in em's
        $scope.$element = null;
        $scope.em = parseInt($('body').css('font-size'));
        $scope.collapsed = true;
        $scope.ready = false;
        $scope.toggle = function () {
            $scope.collapsed = !$scope.collapsed;
            if ($scope.collapsed) {
                $scope.$element.removeClass($scope.getMaxClass()).addClass($scope.getMinClass());
                console.log('collapse panel');
            }
            else {
                $scope.$element.removeClass($scope.getMinClass()).addClass($scope.getMaxClass());
                console.log('expand panel');
            }
        };
        $scope.getMinClass = function () {
            return 'width' + $scope.min;
        };
        $scope.getMaxClass = function () {
            return 'width' + $scope.max;
        };
        $scope.getInitialClass = function () {
            return $scope.collapsed ? $scope.getMinClass() : $scope.getMaxClass();
        };
        $scope.setInitialClass = function () {
            $scope.$element.addClass($scope.getInitialClass());
        };
        /**
         * Deprecated
         * @param {[type]} value [description]
         */
        $scope.getWidth = function (value) {
            return $scope.em * parseInt(value);
        };
        /**
         * Deprecated
         */
        $scope.getInitialWidth = function () {
            return $scope.collapsed ?
                $scope.getWidth($scope.min) :
                $scope.getWidth($scope.max);
        };
    }]).directive('expandable', [
    '$timeout', '$compile',
    function ($timeout, $compile) {
        return {
            restrict: 'E',
            controller: 'expandable.ctrl',
            compile: function ($element, attrs) {
                return {
                    pre: function ($scope, $element, attrs, controller, transcludeFn) {
                    },
                    post: function ($scope, $element, attrs, controller, transcludeFn) {
                        $element.hide();
                        $scope.$element = $element;
                        $scope.direction = attrs.direction || $scope.direction;
                        $scope.collapsed = attrs.collapsed == 'true' ||
                            attrs.collapsed == 'false' ?
                            attrs.collapsed == 'true' : $scope.collapsed;
                        var multiplier = $scope.direction == 'left' ||
                            $scope.direction == 'bottom' ?
                            -1 : 1;
                        var position = '';
                        var collapseHandle = '';
                        var expandHandle = '';
                        switch ($scope.direction) {
                            case 'left':
                                position = 'top0 left0';
                                collapseHandle = 'glyphicon-chevron-right';
                                expandHandle = 'glyphicon-chevron-left';
                                break;
                            case 'right':
                                position = 'top0 right0';
                                collapseHandle = 'glyphicon-chevron-left';
                                expandHandle = 'glyphicon-chevron-right';
                                break;
                            case 'top':
                                position = 'top0 left0';
                                collapseHandle = 'glyphicon-chevron-up';
                                expandHandle = 'glyphicon-chevron-down';
                                break;
                            case 'bottom':
                                position = 'bottom0 left0';
                                collapseHandle = 'glyphicon-chevron-down';
                                expandHandle = 'glyphicon-chevron-up';
                                break;
                        }
                        var init = function () {
                            /**
                             * Set initial class on the element for proper sizing
                             */
                            $scope.setInitialClass();
                            var $handle = $('<div />', {
                                'ng-show': '!collapsed',
                                'class': [
                                    'expandable-handle ',
                                    'expandable-handle-vertical ',
                                    'expandable-', $scope.direction, ' ',
                                    position
                                ].join('')
                            });
                            var dragging = false;
                            var startX = 0;
                            var elementWidth = $element.width();
                            $handle.mousedown(function (e1) {
                                startX = e1.pageX;
                                dragging = true;
                                var elementWidth = $element.width();
                                $('body').on('mousemove', function (e) {
                                    var deltaX = e.pageX - startX;
                                    var toWidth = elementWidth + (multiplier * deltaX);
                                    if (dragging && toWidth > $scope.min) {
                                        $element.width(toWidth);
                                    }
                                }).on('mouseup', function (e) {
                                    if (dragging) {
                                        dragging = false;
                                    }
                                });
                            }).mouseup(function (e) {
                                startX = 0;
                                dragging = false;
                                elementWidth = $element.width();
                                $('body').off('mousemove').off('mouseup');
                            });
                            $element.append($compile($handle[0])($scope));
                        };
                        $timeout(init, 0);
                        var toggleIcon = $compile([
                            "<div class='pad ",
                            position,
                            " dark-bg-hover pointer font-white zIndexTop' ",
                            'ng-click="toggle()">',
                            '<div class="glyphicon"',
                            'ng-class="{',
                            "'", collapseHandle, "': !collapsed,",
                            "'", expandHandle, "': collapsed",
                            '}">',
                            '</div>',
                            '</div>'
                        ].join(''))($scope);
                        $element.prepend(toggleIcon);
                        $scope.ready = true;
                        $element.show();
                    }
                };
            }
        };
    }]);
/// <reference path='../ui.mdl.ts' />
/**
 * DESCRIPTION:
 * will take the enumerated "value" and the
 * fully-namespaced path to the enumeration object aka "type"
 * and will format the enumerated value as a string label
 * mapped to that enumerated value.
 *
 * I.e.
 * type: Playbook.Editor.UnitTypes
 * value: 3
 * result: "Offense"
 *
 * REQUIRED:
 * type: Namespaced location of enum "Playbook.Editor.EditorTypes"
 * value: Actual enumerated value
 */
impakt.common.ui.controller('typeFormatter.ctrl', [
    '$scope', function ($scope) {
    }]).directive('typeFormatter', [function () {
        return {
            restrict: 'E',
            controller: 'typeFormatter.ctrl',
            link: function ($scope, $element, attrs) {
                if (!attrs.type) {
                    throw new Error('type-formatter directive: \
					A valid "type" attribute must be present on the element, \
					which is the fully namespaced type of the enum to evaluate.');
                }
                if (!attrs.value) {
                    throw new Error('type-formatter directive: \
					A valid "value" attribute must be present on the element, \
					which is the enum value to retrieve the string for.');
                }
                var enumValue = parseInt(attrs.value);
                // i.e. "Playbook.Editor.EditorTypes"
                var enumType = attrs.type;
                // i.e. "['Playbook', 'Editor', 'EditorTypes']"
                var namespaceComponents = enumType.split('.');
                // Drill down into namespace -> window['Playbook']['Editor']['EditorTypes']
                // returns enum object
                var namespaceRoot = window;
                for (var i = 0; i < namespaceComponents.length; i++) {
                    if (namespaceComponents[i]) {
                        // Follow the namespace path down to the node object
                        // window['Playbook']...
                        // window['Playbook']['Editor']...
                        // window['Playbook']['Editor']['EditorTypes']
                        // node reached, namespaceRoot will finally point to the node object
                        namespaceRoot = namespaceRoot[namespaceComponents[i]];
                    }
                }
                // Get the enumeration list {enum: "Label"} || {number: string}
                var enumList = Common.Utilities.convertEnumToList(namespaceRoot);
                if (enumList) {
                    // if it has values, get the Label string for the enum
                    // and append it inside of the directive element
                    var enumLabel = enumList[enumValue];
                    if (enumLabel) {
                        $element.html(enumLabel);
                    }
                    else {
                        throw new Error('type-formatter directive: \
						Something went wrong when trying to find the label for the given enum \
						"' + enumValue + '" => "' + enumLabel + '"');
                    }
                }
            }
        };
    }]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui.controller('playPreview.ctrl', [
    '$scope', function ($scope) {
        $scope.previewCanvas;
        $scope.play;
        $scope.showRefresh = false;
        $scope.guid = '';
        $scope.$element;
        $scope.refresh = function () {
            if (!$scope.play)
                throw new Error('play-preview refresh(): Play is null or undefined');
            if (!$scope.previewCanvas)
                throw new Error('play-preview refresh(): PreviewCanvas is null or undefined');
            if (!$scope.$element)
                throw new Error('play-preview refresh(): $element is null or undefined');
            $scope.$element.find('svg').show();
            $scope.previewCanvas.refresh();
            $scope.play.png = $scope.previewCanvas.exportToPng();
            $scope.$element.find('svg').hide();
        };
    }]).directive('playPreview', [
    '$compile',
    '$timeout',
    '_playPreview',
    function ($compile, $timeout, _playPreview) {
        return {
            restrict: 'E',
            controller: 'playPreview.ctrl',
            /**
             * play-preview directive renders a PNG with the given
             * play or formation* data.
             *
             * TODO @theBull - *handle formations as well
             *
             * @param {[type]} $scope   [description]
             * @param {[type]} $element [description]
             * @param {[type]} attrs    [description]
             */
            template: "<div class='positionRelative'>\
					<div class='right0 top1 height2 width2'\
						ng-show='showRefresh'>\
						<span class='glyphicon glyphicon-refresh \
							pointer font-white-hover' \
							title='Refresh preview'\
							ng-click='refresh()'>\
						</span>\
					</div>\
					<img ng-src='{{play.png}}' />\
				</div>",
            transclude: true,
            replace: true,
            link: function ($scope, $element, attrs) {
                $timeout(function () {
                    $scope.$element = $element;
                    // retrieve play data
                    $scope.guid = attrs.guid;
                    $scope.showRefresh = $element.hasClass('play-preview-refresh');
                    // play MAY be only a temporary play used for editing a formation;
                    // in which case, the temporary play should have been added to
                    // the editor context...so check there...
                    // ...if it's not there, check the creation context to see if
                    // it's a play that's currently being created
                    $scope.play = impakt.context.Playbook.plays.get($scope.guid) ||
                        impakt.context.Playbook.editor.plays.get($scope.guid) ||
                        impakt.context.Playbook.creation.plays.get($scope.guid);
                    // if there's no play at this point, there's a problem
                    if (!$scope.play) {
                        throw new Error('play-preview link(): Unable to find play');
                    }
                    // create a previewCanvas to handle preview creation. Creating
                    // a previewCanvas will insert a SVG into the <play-preview/> element
                    // after the intialization phase.
                    $scope.previewCanvas = new Playbook.Models.PreviewCanvas($scope.play, null);
                    $scope.previewCanvas.initialize($element);
                    if (!$scope.previewCanvas)
                        throw new Error('play-preview link(): Creation of previewCanvas failed');
                    // if the play has an existing png, skip the previewCanvas creation
                    // step.
                    if ($scope.play.png == null) {
                        $scope.refresh();
                    }
                    $scope.$element.find('svg').hide();
                    $scope.play.onModified(function () {
                        console.log('play-preview play.onModified(): refreshing preview');
                        $scope.refresh();
                    });
                });
            }
        };
    }]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui.service('_playPreview', [function () {
        var self = this;
        this.viewBox = '';
        this.setViewBox = function (x, y, width, height) {
            this.viewBox = [
                x, ' ',
                y, ' ',
                width, ' ',
                height
            ].join('');
        };
        /**
         * Compresses a SVG element into a string for storage.
         * The SVG element is encoded into a base64 string before
         * compression.
         * @param {HTMLElement} svg The element to compress
         */
        this.compress = function (svg) {
            return Common.Utilities.compressSVG(svg);
        };
        /**
         * Decompresses a compressed SVG element string; assumes
         * the decompressed string is base64 encoded, so it decodes
         * the decompressed string before returning the stringified SVG element.
         * @param  {string} compressed The string to decmopress
         * @return {string}            a stringified SVG element
         */
        this.decompress = function (compressed) {
            return Common.Utilities.decompressSVG(compressed);
        };
        function serialize(svg) {
            // take SVG HTML and convert into string
            return Common.Utilities.serializeXMLToString(svg);
        }
        function toBase64(svgString) {
            return Common.Utilities.toBase64(svgString);
        }
        function fromBase64(base64Svg) {
            return Common.Utilities.fromBase64(base64Svg);
        }
        function compress(svg) {
            return Common.Utilities.compress(svg);
        }
        function decompress(compressed) {
            return Common.Utilities.decompress(compressed);
        }
        /**
         * TO-DO: store in local db
         */
    }]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui.directive('popout', [
    '$compile',
    function ($compile) {
        // button to open with label
        // open / close icon
        // open direction (up / down / left / right)
        return {
            restrict: 'E',
            controller: function ($scope) {
                console.debug('controller: popout.ctrl');
                $scope.collapsed = true;
                $scope.data = {};
                $scope.label = 'label';
                $scope.open = 'down';
                $scope.classes = {
                    expand: '',
                    collapse: ''
                };
                $scope.toggleIconClass = 'glyphicon-chevron-down';
                function init() {
                    $scope.toggleIconClass = $scope.setToggleIconClass();
                    $scope.collapsed = true;
                }
                $scope.getCollapsed = function () {
                    return $scope.collapsed;
                };
                $scope.getData = function () {
                    return $scope.data;
                };
                $scope.getLabel = function () {
                    return $scope.label;
                };
                $scope.getToggleIconClass = function () {
                    return $scope.toggleIconClass;
                };
                $scope.toggle = function (close) {
                    $scope.collapsed = close === true ? true : !$scope.collapsed;
                    $scope.toggleIconClass = $scope.setToggleIconClass();
                    removeClickeater();
                    if (!$scope.collapsed) {
                        // add clikeater element when toggling
                        var $clickeater = angular.element($('<popout-clickeater></popout-clickeater>'));
                        $compile($clickeater)($scope);
                        $('body').append($clickeater);
                    }
                    console.log($scope.collapsed ? 'close' : 'open', 'popout');
                };
                $scope.setToggleIconClass = function () {
                    switch ($scope.open) {
                        case 'down':
                            $scope.classes.expand = 'glyphicon-chevron-down';
                            $scope.classes.collapse = 'glyphicon-chevron-up';
                            break;
                        case 'up':
                            $scope.classes.expand = 'glyphicon-chevron-up';
                            $scope.classes.collapse = 'glyphicon-chevron-down';
                            break;
                        case 'left':
                            $scope.classes.expand = 'glyphicon-chevron-left';
                            $scope.classes.collapse = 'glyphicon-chevron-right';
                            break;
                        case 'right':
                            $scope.classes.expand = 'glyphicon-chevron-right';
                            $scope.classes.collapse = 'glyphicon-chevron-left';
                            break;
                    }
                    return $scope.collapsed ? $scope.classes.expand : $scope.classes.collapse;
                };
                $scope.close = function () {
                    $scope.toggle(true);
                };
                function removeClickeater() {
                    // remove in case it already exists
                    console.log('remove popout clickeater');
                    $('.popout-clickeater').remove();
                }
                init();
            },
            // scope: {
            // 	data: '=',
            // 	open: '=',
            // 	collapsed: '=?',
            // 	label: '=',
            // },
            scope: true,
            link: function ($scope, $element, attrs) {
            }
        };
    }]).directive('popoutToggle', [
    function () {
        return {
            restrict: 'E',
            require: '^popout',
            replace: true,
            transclude: true,
            scope: true,
            template: '<div class="popout-toggle" ng-click="toggle()">\
			<span class="marginRight1">{{label}}</span>\
			<span class="glyphicon {{toggleIconClass}}"></span>\
		</div>',
            link: function ($scope, $element, attrs) {
                console.log($scope);
            }
        };
    }])
    .directive('popoutContents', [function () {
        return {
            restrict: 'E',
            require: '^popout',
            scope: true,
            replace: true,
            transclude: true,
            template: '<div class="popout-contents" ng-show="!collapsed"></div>',
            link: function ($scope, $element, attrs) {
            }
        };
    }])
    .directive('popoutClickeater', [function () {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            transclude: true,
            template: '<div class="popout-clickeater" ng-click="close()"></div>',
            link: function ($scope, $element, attrs) {
            }
        };
    }]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui.factory('__router', [function () {
        var self = {
            templates: {},
            size: 0,
            index: 0,
            current: function () {
                return self.hasTemplates() ? self.templates[self.index] : null;
            },
            get: function (parent, templateName) {
                return self.templates[parent].filterFirst(function (template, index) {
                    return templateName == template.name;
                });
            },
            add: function (parent, template) {
                if (!self.templates[parent]) {
                    self.templates[parent] = new Common.Models.TemplateCollection(parent);
                    self.size++;
                }
                self.templates[parent].add(template);
            },
            push: function (parent, templates) {
                for (var i = 0; i < templates.length; i++) {
                    self.add(parent, templates[i]);
                }
            },
            next: function () {
                var oldIndex = self.index;
                if (self.hasTemplates()) {
                    self.index = self.hasNextTemplate() ? self.index + 1 : 0;
                }
                console.log('next layer:', oldIndex, '->', self.index, self.templates);
            },
            prev: function () {
                if (self.hasTemplates()) {
                    self.index = self.hasPrevTemplate() ? self.index - 1 : self.size - 1;
                }
            },
            to: function (index) {
                if (self.hasTemplates() && index >= 0 && index < self.size - 1) {
                    self.index = index;
                }
            },
            hasTemplates: function () {
                return self.templates && self.size > 0;
            },
            hasNextTemplate: function () {
                return self.index < self.size - 1;
            },
            hasPrevTemplate: function () {
                return self.index > 0;
            }
        };
        return self;
    }]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui.controller('stepper.ctrl', [
    '$scope',
    function ($scope) {
        console.info('stepper directive controller');
        $scope.index = 0;
        $scope.steps = [];
        $scope.$element = null;
        $scope.to = function (index) {
            $($scope.$element.find('step')[index]).show();
            $($scope.$element.find('step')[$scope.index]).hide();
            $scope.index = index;
        };
        $scope.prev = function () {
            if ($scope.index - 1 >= 0)
                $scope.to($scope.index - 1);
        };
        $scope.next = function () {
            if ($scope.index + 1 < $scope.steps.length)
                $scope.to($scope.index + 1);
        };
        $scope.isVisible = function () {
            return true;
        };
    }]).directive('stepper', [
    '$compile',
    function ($compile) {
        return {
            restrict: 'E',
            controller: 'stepper.ctrl',
            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink($scope, $element, attrs, controller) {
                    },
                    post: function postLink($scope, $element, attrs, controller) {
                        var mode = attrs.mode;
                        var HTML = '<step-nav>\
									<step-nav-item ng-repeat="step in steps track by $index" \
										class="gray-bg-7-hover"\
										ng-click="to($index)">\
										{{$index + 1}}\
									</step-nav-item>\
								</step-nav>';
                        var el = angular.element($compile(HTML)($scope));
                        //$element.append(el);
                        $scope.$element = $element;
                    }
                };
            }
        };
    }]).directive('step', [
    '$compile',
    function ($compile) {
        return {
            restrict: 'E',
            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink($scope, $element, attrs, controller) {
                        var guid = Common.Utilities.guid();
                        $element.attr('guid', guid);
                        var index = $scope.steps.length;
                        var step = {
                            guid: guid,
                            visible: false,
                            index: index
                        };
                        $scope.steps.push(step);
                        if (index != 0) {
                            $element.hide();
                        }
                        //console.log($scope.steps);
                    },
                    post: function postLink($scope, $element, attrs, controller) {
                    }
                };
            }
        };
    }])
    .directive('stepNav', [
    function () {
        return {
            restrict: 'E',
            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink($scope, $element, attrs, controller) {
                    },
                    post: function postLink($scope, $element, attrs, controller) {
                    }
                };
            }
        };
    }
])
    .directive('stepNavItem', [
    function () {
        return {
            restrict: 'E',
            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink($scope, $element, attrs, controller) {
                    },
                    post: function postLink($scope, $element, attrs, controller) {
                    }
                };
            }
        };
    }
]);
/// <reference path='../js/impakt.ts' />
impakt.modules = angular.module('impakt.modules', [
    'impakt.home',
    'impakt.season',
    'impakt.planning',
    'impakt.playbook',
    'impakt.nav',
    'impakt.user',
    'impakt.search',
    'impakt.team'
])
    .config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        console.debug('impakt.modules - config');
    }])
    .run(function () {
    console.debug('impakt.modules - run');
});
/// <reference path='../modules.mdl.ts' />
impakt.modules = angular.module('impakt.home', [])
    .config([function () {
        console.debug('impakt.home - config');
    }])
    .run(function () {
    console.debug('impakt.home - run');
});
/// <reference path='./models.ts' />
var Navigation;
(function (Navigation) {
    var NavigationItemCollection = (function (_super) {
        __extends(NavigationItemCollection, _super);
        function NavigationItemCollection() {
            _super.call(this);
        }
        return NavigationItemCollection;
    })(Common.Models.Collection);
    Navigation.NavigationItemCollection = NavigationItemCollection;
})(Navigation || (Navigation = {}));
/// <reference path='./navigation.ts' />
/// <reference path='../../../common/models/models.ts' />
/// <reference path='./NavigationItem.ts' />
/// <reference path='./NavigationItemCollection.ts' /> 
/// <reference path='./models.ts' />
var Navigation;
(function (Navigation) {
    var NavigationItem = (function (_super) {
        __extends(NavigationItem, _super);
        function NavigationItem(name, label, glyphicon, path, isActive) {
            _super.call(this);
            this.name = name;
            this.label = label;
            this.glyphicon = glyphicon;
            this.path = path;
            this.isActive = isActive === true;
        }
        return NavigationItem;
    })(Common.Models.Storable);
    Navigation.NavigationItem = NavigationItem;
})(Navigation || (Navigation = {}));
/// <reference path='../modules.mdl.ts' />
impakt.nav = angular.module('impakt.nav', [
    'impakt.user',
    'impakt.playbook.nav'
])
    .config(function () {
    console.log('nav - config');
})
    .run(function () {
    console.log('nav - run');
});
/// <reference path='./nav.mdl.ts' />
impakt.nav.controller('nav.ctrl', [
    '$scope',
    '$location',
    '__nav',
    '__notifications',
    function ($scope, $location, __nav, __notifications) {
        // Default menu visiblity
        $scope.isMenuCollapsed = true;
        $scope.notifications = __notifications.notifications;
        $scope.menuItems = __nav.menuItems;
        $scope.notificationsMenuItem = __nav.notificationsMenuItem;
        $scope.searchMenuItem = __nav.searchMenuItem;
        // set default view to the Home module
        $location.path('/home');
        $scope.navigatorNavSelection = getActiveNavItemLabel();
        $scope.searchItemClick = function () {
            $scope.searchMenuItem.isActive = !$scope.searchMenuItem.isActive;
        };
        $scope.notificationItemClick = function () {
            $scope.notificationsMenuItem.isActive = !$scope.notificationsMenuItem.isActive;
            $scope.menuVisibilityToggle($scope.notificationsMenuItem, false);
        };
        $scope.menuVisibilityToggle = function (navigationItem, propagate) {
            $scope.isMenuCollapsed = !$scope.isMenuCollapsed;
            propagate && $scope.menuItemClick(navigationItem);
        };
        $scope.menuItemClick = function (navigationItem) {
            var activeNavItem = getActiveNavItem();
            if (activeNavItem)
                activeNavItem.isActive = false;
            navigationItem.isActive = true;
            if (navigationItem)
                $location.path(navigationItem.path);
            $scope.navigatorNavSelection = navigationItem.label;
        };
        function getActiveNavItem() {
            // pre-assumption, we can only have 1 active menu item
            return $scope.menuItems.filterFirst(function (menuItem) {
                return menuItem.isActive === true;
            });
        }
        function getActiveNavItemLabel() {
            var activeNavItem = getActiveNavItem();
            return activeNavItem ? activeNavItem.label : null;
        }
    }]);
/// <reference path='./nav.mdl.ts' />
// Nav factory
impakt.nav.factory('__nav', ['$http', '$q', function ($http, $q) {
        console.log('nav factory');
        var menuItems = new Navigation.NavigationItemCollection();
        // Home
        menuItems.add(new Navigation.NavigationItem('home', 'Home', 'home', '/home', true));
        // Season
        menuItems.add(new Navigation.NavigationItem('season', 'Season', 'calendar', '/season', false));
        // Playbook
        menuItems.add(new Navigation.NavigationItem('playbook', 'Playbook', 'book', '/playbook/browser', false));
        // Planning
        menuItems.add(new Navigation.NavigationItem('planning', 'Planning', 'blackboard', '/planning', false));
        // Team
        menuItems.add(new Navigation.NavigationItem('team', 'Team Management', 'list-alt', '/team', false));
        // Profile
        menuItems.add(new Navigation.NavigationItem('profile', 'Profile', 'user', '/profile', false));
        // Search
        var searchMenuItem = new Navigation.NavigationItem('search', 'Search', 'search', null, false);
        // Notifications
        var notificationsMenuItem = new Navigation.NavigationItem('notifications', 'Notifications', 'bell', null, false);
        // TODO @theBull - implement
        // ,
        // film: {
        // 	label: 'Film',
        // 	glyphicon: 'film',
        // 	path: '/film',
        // 	isActive: false
        // },
        // stats: {
        // 	label: 'Stats',
        // 	glyphicon: 'signal',
        // 	path: '/stats',
        // 	isActive: false
        // }
        return {
            menuItems: menuItems,
            searchMenuItem: searchMenuItem,
            notificationsMenuItem: notificationsMenuItem
        };
    }]);
/// <reference path='../modules.mdl.ts' />
impakt.modules = angular.module('impakt.planning', [])
    .config([function () {
        console.debug('impakt.planning - config');
    }])
    .run(function () {
    console.debug('impakt.planning - run');
});
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Assignment = (function (_super) {
            __extends(Assignment, _super);
            function Assignment() {
                _super.call(this, this);
                this.routes = new Playbook.Models.RouteCollection();
                this.positionIndex = -1;
                this.setType = Playbook.Editor.SetTypes.Assignment;
            }
            Assignment.prototype.clear = function () {
                this.routes.forEach(function (route, index) {
                    route.clear();
                });
            };
            Assignment.prototype.erase = function () {
                this.routes.forEach(function (route, index) {
                    route.erase();
                });
            };
            Assignment.prototype.setContext = function (context) {
                this.routes.forEach(function (route, index) {
                    route.setContext(context);
                });
            };
            Assignment.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.routes.fromJson(json.routes);
                this.positionIndex = json.positionIndex;
                this.guid = json.guid;
            };
            Assignment.prototype.toJson = function () {
                return {
                    routes: this.routes.toJson(),
                    positionIndex: this.positionIndex,
                    guid: this.guid
                };
            };
            return Assignment;
        })(Common.Models.Modifiable);
        Models.Assignment = Assignment;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var AssignmentCollection = (function (_super) {
            __extends(AssignmentCollection, _super);
            // at this point I'm expecting an object literal with data / count
            // properties, but not a valid AssignmentCollection; Essentially
            // this is to get around 
            function AssignmentCollection(count) {
                _super.call(this);
                if (count) {
                    for (var i = 0; i < count; i++) {
                        var assignment = new Playbook.Models.Assignment();
                        assignment.positionIndex = i;
                        this.add(assignment);
                    }
                }
                this.setType = Playbook.Editor.SetTypes.Assignment;
                this.unitType = Playbook.Editor.UnitTypes.Other;
                this.name = 'Untitled';
                this.key = -1;
            }
            AssignmentCollection.prototype.toJson = function () {
                return {
                    unitType: this.unitType,
                    setType: this.setType,
                    guid: this.guid,
                    key: this.key,
                    assignments: _super.prototype.toJson.call(this)
                };
            };
            AssignmentCollection.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.guid = json.guid;
                this.key = json.key;
                this.unitType = json.unitType;
                this.setType = json.setType;
                var assignments = json.assignments || [];
                for (var i = 0; i < assignments.length; i++) {
                    var rawAssignment = assignments[i];
                    var assignmentModel = new Playbook.Models.Assignment();
                    assignmentModel.fromJson(rawAssignment);
                    this.add(assignmentModel);
                }
            };
            AssignmentCollection.prototype.getAssignmentByPositionIndex = function (index) {
                var result = null;
                if (this.hasElements()) {
                    result = this.filterFirst(function (assignment) {
                        return assignment.positionIndex == index;
                    });
                }
                return result;
            };
            return AssignmentCollection;
        })(Common.Models.ModifiableCollection);
        Models.AssignmentCollection = AssignmentCollection;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var FieldElement = (function (_super) {
            __extends(FieldElement, _super);
            function FieldElement(context) {
                _super.call(this, this);
                this.context = context;
                this.paper = this.context.paper;
                this.canvas = this.paper.canvas;
                this.field = this.paper.field;
                this.grid = this.paper.grid;
                this.placement = new Playbook.Models.Placement(0, 0, null);
                this.raphael = null;
            }
            FieldElement.prototype.toJson = function () {
                var self = {
                    guid: this.guid,
                    name: this.name,
                    placement: this.placement.toJson(),
                    radius: this.radius,
                    transformString: this.transformString,
                    width: this.width,
                    height: this.height,
                    positionAbsolutely: this.positionAbsolutely,
                    selected: this.selected,
                    disabled: this.disabled,
                    dragging: this.dragging,
                    draggable: this.draggable,
                    dragged: this.dragged,
                    clickable: this.clickable,
                    hoverable: this.hoverable,
                    opacity: this.opacity,
                    color: this.color,
                    contextmenuTemplateUrl: this.contextmenuTemplateUrl,
                };
                return Common.Utilities.toJson(self);
            };
            FieldElement.prototype.fromJson = function (json) {
            };
            FieldElement.prototype.disable = function () {
            };
            FieldElement.prototype.select = function () {
            };
            FieldElement.prototype.show = function () {
                return this.raphael.show();
            };
            FieldElement.prototype.hide = function () {
                return this.raphael.hide();
            };
            FieldElement.prototype.glow = function () {
                return this.raphael.glow();
            };
            FieldElement.prototype.getSaveData = function () {
                //console.log('getSaveData() not implemented');
            };
            FieldElement.prototype.draw = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                //console.log('draw() not implemented');
            };
            FieldElement.prototype.getBBoxCoordinates = function () {
                //console.log('getBBoxCoordinates() not implemented');
            };
            FieldElement.prototype.mouseDown = function (fn, context) {
                this.raphael.mousedown(function (e) {
                    fn(e, context);
                });
            };
            FieldElement.prototype.hover = function (hoverIn, hoverOut, context) {
                this.raphael.hover(function (e) {
                    hoverIn(e, context);
                }, function (e) {
                    hoverOut(e, context);
                });
            };
            FieldElement.prototype.hoverIn = function (e, context) {
                //console.log('hoverIn() not implemented');
            };
            FieldElement.prototype.hoverOut = function (e, context) {
                //console.log('hoverOut() not implemented');
            };
            FieldElement.prototype.click = function (fn, context) {
                //console.log('fieldElement click');
                this.raphael.click(function (e) {
                    fn(e, context);
                });
            };
            FieldElement.prototype.mousedown = function (fn, context) {
                // console.log('inherited mousedown');
                this.raphael.mousedown(function (e) {
                    fn(e, context);
                });
            };
            FieldElement.prototype.contextmenu = function (fn, context) {
                this.raphael.mousedown(function (e) {
                    if (e.which == 3) {
                        fn(e, context);
                    }
                });
            };
            FieldElement.prototype.drag = function (dragMove, dragStart, dragEnd, dragMoveContext, dragStartContext, dragEndContext) {
                this.raphael.drag(dragMove, dragStart, dragEnd, dragMoveContext, dragStartContext, dragEndContext);
            };
            FieldElement.prototype.dragMove = function (dx, dy, posx, posy, e) {
                var currentCoords = new Playbook.Models.Coordinates(this.placement.coordinates.x, this.placement.coordinates.y);
                //console.log(this.x, this.y);
            };
            FieldElement.prototype.dragStart = function (x, y, e) {
                //console.log('dragStart() not implemented');
            };
            FieldElement.prototype.dragEnd = function (e) {
                //console.log('dragEnd() not implemented');
            };
            FieldElement.prototype.drop = function () {
                // update placement data
                this.placement.drop();
                if (this.raphael) {
                    var attrs;
                    //console.log(this.raphael);
                    if (this.raphael.type != 'circle') {
                        attrs = {
                            x: this.placement.coordinates.ax,
                            y: this.placement.coordinates.ay
                        };
                    }
                    else {
                        attrs = {
                            cx: this.placement.coordinates.ax,
                            cy: this.placement.coordinates.ay
                        };
                    }
                    this.raphael.attr(attrs);
                }
            };
            // drawing
            FieldElement.prototype.setFillOpacity = function (opacity) {
                return this.raphael.attr({ 'fill-opacity': opacity });
            };
            FieldElement.prototype.setStrokeColor = function (color) {
                return this.raphael.attr({ 'stroke': color });
            };
            FieldElement.prototype.setFillColor = function (color) {
                return this.raphael.attr({ 'fill': color });
            };
            return FieldElement;
        })(Common.Models.Modifiable);
        Models.FieldElement = FieldElement;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var FieldElementSet = (function (_super) {
            __extends(FieldElementSet, _super);
            function FieldElementSet(context) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                _super.call(this, context);
                this.context = context;
                this.items = [];
                this.raphael = this.context.paper.set();
                if (args && args.length > 0) {
                    this.push.apply(this, args);
                }
                //console.log(this.items);
                this.length = this.items.length;
            }
            FieldElementSet.prototype.size = function () {
                return this.items.length;
            };
            ;
            FieldElementSet.prototype.push = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                for (var i = 0; i < args.length; i++) {
                    this.length++;
                    this.raphael.push(args[i].raphael);
                    this.items.push(args[i]);
                }
            };
            ;
            FieldElementSet.prototype.pop = function () {
                this.length--;
                this.raphael.pop();
                return this.items.pop();
            };
            ;
            FieldElementSet.prototype.exclude = function (element) {
                this.length--;
                return this.raphael.exclude(element);
            };
            ;
            FieldElementSet.prototype.forEach = function (callback, context) {
                return this.raphael.forEach(callback, context);
            };
            ;
            FieldElementSet.prototype.getByGuid = function (guid) {
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    if (item && item.guid && item.guid == guid)
                        return item;
                }
                return null;
            };
            ;
            FieldElementSet.prototype.splice = function (index, count) {
                this.length -= count;
                this.raphael.splice(index, count);
                return this.items.splice(index, count);
            };
            ;
            FieldElementSet.prototype.removeAll = function () {
                while (this.raphael.length > 0) {
                    this.pop();
                }
            };
            ;
            FieldElementSet.prototype.clear = function () {
                this.raphael.clear();
            };
            ;
            FieldElementSet.prototype.dragOne = function (guid, dx, dy) {
                var item = this.getByGuid(guid);
                item.placement.coordinates.dx = dx;
                item.placement.coordinates.dy = dy;
                item.raphael.transform(['t', dx, ', ', dy].join(''));
            };
            ;
            FieldElementSet.prototype.dragAll = function (dx, dy) {
                //console.log('dragging ' + this.length + ' items');
                // for each item in the set, update its drag position
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    item.placement.coordinates.dx = dx;
                    item.placement.coordinates.dy = dy;
                }
                this.raphael.transform(['t', dx, ', ', dy].join(''));
            };
            ;
            FieldElementSet.prototype.drop = function () {
                this.raphael.transform(['t', 0, ', ', 0].join(''));
                // iterate over each item and update its final position
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    item.drop();
                }
            };
            ;
            FieldElementSet.prototype.setOriginalPositions = function () {
                // for each item in the set, update its drag position
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    item.placement.coordinates.ax = item.placement.coordinates.ax;
                    item.placement.coordinates.ay = item.placement.coordinates.ay;
                }
            };
            ;
            return FieldElementSet;
        })(Playbook.Models.FieldElement);
        Models.FieldElementSet = FieldElementSet;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Ball = (function (_super) {
            __extends(Ball, _super);
            function Ball(context) {
                _super.call(this, context);
                this.color = 'brown';
                this.placement = new Playbook.Models.Placement(0, 0, null);
                this.placement.coordinates = new Playbook.Models.Coordinates(Playbook.Constants.BALL_DEFAULT_PLACEMENT_X, Playbook.Constants.BALL_DEFAULT_PLACEMENT_Y);
                this.width = this.grid.getSize() * 0.15;
                this.height = this.grid.getSize() * 0.25;
                this.offset = this.grid.getCenter().x;
            }
            Ball.prototype.draw = function () {
                console.log('drawing football...');
                this.raphael = this.paper.ellipse(this.placement.coordinates.x, this.placement.coordinates.y, this.width, this.height).attr({
                    'fill': this.color
                });
                _super.prototype.click.call(this, this.click, this);
                _super.prototype.mousedown.call(this.mousedown, this);
                this.drag(this.dragMove, this.dragStart, this.dragEnd, this, this, this);
                // constrain x/y directions
                // move LOS and all players with ball
            };
            Ball.prototype.click = function (e, self) {
                console.log(['Ball at (', self.coordinates.x, self.coordinates.y, ')'].join(''));
                throw new Error('Ball click(): not implemented');
            };
            Ball.prototype.mousedown = function (e, self) {
                throw new Error('Ball mousedown(): not implemented');
            };
            Ball.prototype.dragMove = function (dx, dy, posx, posy, e) {
                throw new Error('Ball dragMove(): not implemented');
            };
            Ball.prototype.dragStart = function (x, y, e) {
                throw new Error('Ball dragStart(): not implemented');
            };
            Ball.prototype.dragEnd = function (e) {
                throw new Error('Ball dragEnd(): not implemented');
            };
            Ball.prototype.isWhichSideOf = function (coords) {
                return new Playbook.Models.Coordinates(this.isLeftOf(coords.x) ? -1 : 1, this.isAbove(coords.y) ? 1 : -1);
            };
            Ball.prototype.isLeftOf = function (x) {
                return this.placement.coordinates.x > x;
            };
            Ball.prototype.isRightOf = function (x) {
                return this.placement.coordinates.x <= x;
            };
            Ball.prototype.isAbove = function (y) {
                return this.placement.coordinates.y > y;
            };
            Ball.prototype.isBelow = function (y) {
                return this.placement.coordinates.y <= y;
            };
            return Ball;
        })(Playbook.Models.FieldElement);
        Models.Ball = Ball;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Coordinates = (function (_super) {
            __extends(Coordinates, _super);
            // x/y are grid coords
            function Coordinates(x, y) {
                _super.call(this);
                this.x = x;
                this.y = y;
                this.ax = 0;
                this.ay = 0;
                this.dx = 0;
                this.dy = 0;
                this.ox = this.ax;
                this.ay = this.ay;
            }
            Coordinates.prototype.drop = function () {
                this.ax += this.dx;
                this.ay += this.dy;
                this.ox = this.ax;
                this.oy = this.ay;
                this.dx = 0;
                this.dy = 0;
            };
            Coordinates.prototype.toJson = function () {
                return {
                    x: this.x,
                    y: this.y,
                    ax: this.ax,
                    ay: this.ay
                };
            };
            Coordinates.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.x = json.x;
                this.y = json.y;
                this.ax = json.ax;
                this.ay = json.ay;
                this.ox = this.ax;
                this.oy = this.ay;
                this.dx = 0;
                this.dy = 0;
            };
            return Coordinates;
        })(Common.Models.Storable);
        Models.Coordinates = Coordinates;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Endzone = (function (_super) {
            __extends(Endzone, _super);
            function Endzone(context, offsetY) {
                _super.call(this, context);
                this.context = context;
                this.color = 'black';
                this.opacity = 0.25;
                this.placement = new Playbook.Models.Placement(0, 0, null);
                this.placement.coordinates.x = 1;
                this.placement.coordinates.y = offsetY || 0;
                this.width = this.paper.getWidth() -
                    (2 * this.grid.getSize());
                this.height = 10 * this.grid.getSize();
            }
            Endzone.prototype.draw = function () {
                var rect = this.paper.rect(this.placement.coordinates.x, this.placement.coordinates.y, this.width, this.height).attr({
                    'fill': this.color,
                    'fill-opacity': this.opacity
                });
            };
            ;
            return Endzone;
        })(Playbook.Models.FieldElement);
        Models.Endzone = Endzone;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Field = (function () {
            function Field(paper, playPrimary, playOpponent) {
                this.paper = paper;
                this.grid = this.paper.grid;
                this.playPrimary = playPrimary;
                this.playOpponent = playOpponent;
                this.type = this.playPrimary.unitType;
                this.editorType = this.playPrimary.editorType;
                this.zoom = 1;
                this.players = new Playbook.Models.PlayerCollection();
                this.selectedPlayers = new Playbook.Models.PlayerCollection();
                /**
                 * Ensure intialization of the field is complete before attempting
                 * to initialize any field elements.
                 */
                /**
                 * TODO @theBull - refactor all of these drawing commands to a layers
                 * collection.
                 */
                this.ball = new Playbook.Models.Ball(this);
                this.ground = new Playbook.Models.Ground(this);
                this.los = new Playbook.Models.LineOfScrimmage(this);
                this.endzone_top = new Playbook.Models.Endzone(this, 0);
                this.endzone_bottom = new Playbook.Models.Endzone(this, 110);
                this.sideline_left = new Playbook.Models.Sideline(this, -25);
                this.sideline_right = new Playbook.Models.Sideline(this, 25);
                this.hashmark_left = new Playbook.Models.Hashmark(this, -3);
                this.hashmark_right = new Playbook.Models.Hashmark(this, 3);
                this.hashmark_sideline_left = new Playbook.Models.Hashmark(this, -25);
                this.hashmark_sideline_right = new Playbook.Models.Hashmark(this, 25);
            }
            Field.prototype.draw = function () {
                var self = this;
                this.ground.draw();
                this.grid.draw();
                this.endzone_top.draw();
                this.endzone_bottom.draw();
                this.sideline_left.draw();
                this.sideline_right.draw();
                this.hashmark_left.draw();
                this.hashmark_right.draw();
                this.hashmark_sideline_left.draw();
                this.hashmark_sideline_right.draw();
                this.los.draw();
                this.ball.draw();
                this.drawPlay();
            };
            ;
            Field.prototype.clearPlay = function () {
                this.players.forEach(function (player, index) {
                    player.clear();
                });
                this.players.removeAll();
                this.playPrimary = null;
                this.playOpponent = null;
            };
            ;
            Field.prototype.drawPlay = function () {
                // draw the play data onto the field
                if (this.playPrimary)
                    this.playPrimary.draw(this);
                // draw the opponent play data onto the field
                if (this.playOpponent)
                    this.playOpponent.draw(this);
            };
            ;
            Field.prototype.updatePlay = function (playPrimary, playOpponent) {
                this.clearPlay();
                this.playPrimary = playPrimary;
                this.playOpponent = playOpponent;
                this.drawPlay();
            };
            ;
            Field.prototype.useAssignmentTool = function (coords) {
                if (this.selectedPlayers.size() == 1) {
                    var player = this.selectedPlayers.getOne();
                    // initialize a new route, ensures a route is available
                    // for the following logic.
                    if (player.assignment.routes &&
                        player.assignment.routes.size() == 0) {
                        var route = new Playbook.Models.Route(player);
                        player.assignment.routes.add(route);
                    }
                    // TODO: this will only get the first route, implement
                    // route switching
                    var playerRoute = player.assignment.routes.getOne();
                    if (playerRoute.dragInitialized)
                        return;
                    // route exists, append the node
                    playerRoute.addNode(coords);
                    console.log('set player route', player.label, playerRoute);
                    this.playPrimary.assignments.addAtIndex(player.assignment, player.position.index);
                }
                else if (this.selectedPlayers.size() <= 0) {
                    console.log('select a player first');
                }
                else {
                    console.log('apply routes in bulk...?');
                }
            };
            ;
            Field.prototype.export = function () {
                return null;
            };
            ;
            Field.prototype.placeAtYardline = function (element, yardline) {
            };
            ;
            Field.prototype.remove = function () { };
            ;
            Field.prototype.getBBoxCoordinates = function () { };
            ;
            Field.prototype.addPlayer = function (placement, position, assignment) {
                var player = new Playbook.Models.Player(this, placement, position, assignment);
                player.draw();
                this.players.add(player);
                return player;
            };
            ;
            Field.prototype.getPlayerWithPositionIndex = function (index) {
                var matchingPlayer = this.players.filterFirst(function (player) {
                    return player.hasPosition() && (player.position.index == index);
                });
                return matchingPlayer;
            };
            ;
            Field.prototype.applyPrimaryPlay = function (play) {
                throw new Error('field applyPrimaryPlay() not implemented');
            };
            ;
            Field.prototype.applyPrimaryFormation = function (formation) {
                //console.log(formation);
                // the order of placements within the formation get applied straight across
                // to the order of personnel and positions.
                var self = this;
                this.players.forEach(function (player, index) {
                    // NOTE: we're not using the index from the forEach callback,
                    // because we can't assume the players collection stores the players
                    // in the order according to the player's actual index property
                    var playerIndex = player.position.index;
                    if (playerIndex < 0) {
                        throw new Error('Player must have a position index');
                    }
                    var newPlacement = formation.placements.getIndex(playerIndex);
                    if (!newPlacement) {
                        throw new Error('Updated player placement is invalid');
                    }
                    player.updatePlacement(newPlacement);
                    player.draw();
                });
                // update the field play formation
                this.playPrimary.setFormation(formation);
                // TODO @theBull - implement set formation for opponent formation
            };
            ;
            Field.prototype.applyPrimaryAssignments = function (assignments) {
                var self = this;
                if (assignments.hasElements()) {
                    assignments.forEach(function (assignment, index) {
                        var player = self.getPlayerWithPositionIndex(assignment.positionIndex);
                        if (player) {
                            assignment.setContext(player);
                            player.assignment.erase();
                            player.assignment = assignment;
                            player.draw();
                        }
                    });
                    // TODO @theBull - implement apply opponent assignments
                    this.playPrimary.setAssignments(assignments);
                }
            };
            ;
            Field.prototype.applyPrimaryPersonnel = function (personnel) {
                var self = this;
                if (personnel && personnel.hasPositions()) {
                    this.players.forEach(function (player, index) {
                        var newPosition = personnel.positions.getIndex(index);
                        if (self.playPrimary.personnel &&
                            self.playPrimary.personnel.hasPositions()) {
                            self.playPrimary.personnel.positions.getIndex(index).fromJson(newPosition.toJson());
                        }
                        player.position.fromJson(newPosition.toJson());
                        player.draw();
                    });
                    // TODO @theBull - implement apply opponent assignments
                    this.playPrimary.setPersonnel(personnel);
                }
                else {
                    var details = personnel ? '# positions: ' + personnel.positions.size() : 'Personnel is undefined.';
                    alert([
                        'There was an error applying this personnel group. ',
                        'Please inspect it in the Team Management module. \n\n',
                        details
                    ].join(''));
                }
            };
            ;
            Field.prototype.deselectAll = function () {
                if (this.selectedPlayers.size() == 0)
                    return;
                this.selectedPlayers.removeEach(function (player, key) {
                    // will effectively tell the player to de-select itself
                    player.select();
                });
                //console.log('All players de-selected', this.selectedPlayers);
            };
            ;
            Field.prototype.togglePlayerSelection = function (player) {
                // TODO - support alt/cmd/ctrl/shift selection
                // clear any selected players
                this.selectedPlayers.forEach(function (player, key) {
                    player.select(false);
                });
                this.selectedPlayers.removeAll();
                player.select();
                if (this.selectedPlayers.contains(player.guid)) {
                    this.selectedPlayers.remove(player.guid);
                }
                else {
                    this.selectedPlayers.add(player);
                }
                //console.log(this.selectedPlayers);
            };
            ;
            return Field;
        })();
        Models.Field = Field;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PreviewField = (function (_super) {
            __extends(PreviewField, _super);
            function PreviewField(paper, playPrimary, playOpponent) {
                _super.call(this, paper, playPrimary, playOpponent);
            }
            PreviewField.prototype.draw = function () {
                var self = this;
                this.ground.click = function (e) { return false; };
                this.ball.placement.coordinates.y = 20;
                this.ball.placement.coordinates.x = 26;
                this.los.placement.coordinates.y = 20;
                this.los.height = 1;
                this.hashmark_left.start = 0;
                this.hashmark_left.yards = 40;
                this.hashmark_right.start = 0;
                this.hashmark_right.yards = 40;
                this.sideline_left.opacity = 0.35;
                this.sideline_right.opacity = 0.35;
                this.ground.draw();
                this.hashmark_left.draw();
                this.hashmark_right.draw();
                this.sideline_left.draw();
                this.sideline_right.draw();
                this.los.draw();
                this.ball.draw();
                // draw the play data onto the field
                if (this.playPrimary)
                    this.playPrimary.draw(this);
                // draw the opponent play data onto the field
                if (this.playOpponent)
                    this.playOpponent.draw(this);
            };
            PreviewField.prototype.addPlayer = function (placement, position, assignment) {
                // TODO @theBull - look into this
                // adjust for no sidelines...
                //placement.x -= 1;
                var player = new Playbook.Models.PreviewPlayer(this, placement, position, assignment);
                player.draw();
                this.players.add(player);
                return player;
            };
            PreviewField.prototype.togglePlayerSelection = function (player) {
                throw new Error('PreviewField togglePlayerSelection() not implemented');
            };
            PreviewField.prototype.deselectAll = function () {
                throw new Error('PreviewField deselectAll() not implemented');
            };
            PreviewField.prototype.useAssignmentTool = function (coords) {
                throw new Error('PreviewField useAssignmentTool() not implemented');
            };
            return PreviewField;
        })(Playbook.Models.Field);
        Models.PreviewField = PreviewField;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Grid = (function () {
            function Grid(paper, cols, rows) {
                this.paper = paper;
                this.cols = cols;
                this.rows = rows;
                // sets this.width and this.height
                this.size = this.resize(this.paper.sizingMode);
                this.base = Playbook.Constants.GRID_BASE;
                this.divisor = 2; // TODO @theBull document this
                this.dashArray = ['- '];
                this.verticalStrokeOpacity = 0.2;
                this.horizontalStrokeOpacity = 0.25;
                this.strokeWidth = 0.5;
                this.color = '#000000';
            }
            Grid.prototype.getSize = function () {
                return this.size;
            };
            Grid.prototype.getWidth = function () {
                return this.width;
            };
            Grid.prototype.getHeight = function () {
                return this.height;
            };
            /**
             * TODO @theBull - document this
             * @return {any} [description]
             */
            Grid.prototype.draw = function () {
                var cols = this.cols;
                var rows = this.rows;
                //var font = this.paper.getFont('Arial');
                for (var c = 1; c < cols; c++) {
                    var colX = c * this.size;
                    var pathStr = Playbook.Utilities.getPathString(colX, 0, colX, rows * this.size);
                    var p = this.paper.path(pathStr).attr({
                        'stroke-dasharray': this.dashArray,
                        'stroke-opacity': this.verticalStrokeOpacity,
                        'stroke-width': this.strokeWidth,
                        'stroke': this.color
                    });
                }
                for (var r = 1; r < rows; r++) {
                    var rowY = r * this.size;
                    var pathStr = Playbook.Utilities.getPathString(0, rowY, this.width, rowY);
                    var opacity, dashes;
                    if (r % 10 == 0) {
                        if (r > 10 && r < 110) {
                            var value = (r - 10);
                            if (value > 50)
                                value = value - ((value - 50) * 2);
                            var str = value.toString();
                            // let lineNumbersLeft = this.paper.print(
                            // 	2,
                            // 	r,
                            // 	str,
                            // 	font,
                            // 	30
                            // );.transform('r-90');
                            var lineNumbersLeft = this.paper.text(2, r, str, false).transform('r-90');
                            // let lineNumbersRight = this.paper.print(
                            // 	50, 
                            // 	r, 
                            // 	str, 
                            // 	font, 
                            // 	30
                            // ).transform('r90');
                            var lineNumbersRight = this.paper.text(50, r, str, false).transform('r90');
                        }
                        opacity = 1;
                        this.paper.path(pathStr).attr({
                            'stroke-opacity': this.horizontalStrokeOpacity,
                            'stroke-width': 3,
                            'stroke': '#ffffff'
                        });
                    }
                    else {
                        this.paper.path(pathStr).attr({
                            'stroke-dasharray': this.dashArray,
                            'stroke-opacity': this.horizontalStrokeOpacity,
                            'stroke-width': this.strokeWidth,
                            'stroke': this.color
                        });
                    }
                }
            };
            /**
             * recalculates the width and height of the grid
             * with the context width and height
             */
            Grid.prototype.resize = function (sizingMode) {
                if (this.cols <= 0)
                    throw new Error('Grid cols must be defined and greater than 0');
                if (this.paper.canvas.width <= 0)
                    throw new Error('Canvas width must be greater than 0');
                switch (this.paper.sizingMode) {
                    case Playbook.Editor.PaperSizingModes.TargetGridWidth:
                        this.size = Playbook.Constants.GRID_SIZE;
                        break;
                    case Playbook.Editor.PaperSizingModes.MaxCanvasWidth:
                        this.size = Math.floor(this.paper.canvas.width / this.cols);
                        break;
                    case Playbook.Editor.PaperSizingModes.PreviewWidth:
                        this.size = this.paper.canvas.width / this.cols; // don't round
                        break;
                }
                this.width = this.cols * this.size;
                this.height = this.rows * this.size;
                return this.size;
            };
            /**
             * TODO @theBull - document this
             * returns the grid value for the bottom-most grid line (horizontal)
             * @return {number} [description]
             */
            Grid.prototype.bottom = function () {
                return this.rows;
            };
            /**
             * TODO @theBull - document this
             * returns the grid value for the right-most grid line (vertical)
             * @return {number} [description]
             */
            Grid.prototype.right = function () {
                return this.cols;
            };
            /**
             * TODO @theBull - document this
             * @return {Playbook.Models.Coordinate} [description]
             */
            Grid.prototype.getCenter = function () {
                return new Playbook.Models.Coordinates(Math.round(this.cols / 2), Math.round(this.rows / 2));
            };
            /**
             * TODO @theBull - document this
             * @return {Playbook.Models.Coordinate} [description]
             */
            Grid.prototype.getCenterInPixels = function () {
                var centerCoords = this.getCenter();
                return this.getAbsoluteFromCoordinates(centerCoords.x, centerCoords.y);
            };
            /**
             * TODO @theBull - document this
             * @return {Playbook.Models.Coordinate} [description]
             */
            Grid.prototype.getCoordinates = function () {
                return new Playbook.Models.Coordinates(-1, -1); // TODO
            };
            /**
             * TODO @theBull - document this
             * @return {Playbook.Models.Coordinate} [description]
             */
            Grid.prototype.getDimensions = function () {
                return new Playbook.Models.Coordinates(this.cols, this.rows);
            };
            /**
             * TODO @theBull - document this
             * @return {number} [description]
             */
            Grid.prototype.gridProportion = function () {
                return this.size / this.base;
            };
            /**
             * TODO @theBull - document this
             * @param  {number} val [description]
             * @return {number}     [description]
             */
            Grid.prototype.computeGridZoom = function (val) {
                return val * this.gridProportion();
            };
            /**
             * Calculates a single absolute pixel value from the given grid value
             * @param  {number} val the coord value to calculate
             * @return {number}     The calculated absolute pixel
             */
            Grid.prototype.getAbsoluteFromCoordinate = function (val) {
                return val * this.size;
            };
            /**
             * Returns the absolute pixel values of the given grid coords
             * @param  {Playbook.Models.Coordinate} coords the grid coords to calculate
             * @return {Playbook.Models.Coordinate}        the absolute pixel coords
             */
            Grid.prototype.getAbsoluteFromCoordinates = function (x, y) {
                var coords = new Playbook.Models.Coordinates(x, y);
                var calculatedCoords = new Playbook.Models.Coordinates(this.getAbsoluteFromCoordinate(coords.x), this.getAbsoluteFromCoordinate(coords.y));
                return calculatedCoords;
            };
            /**
             * Calculates grid coords from the given pixel values
             * @param {Playbook.Models.Coordinate} coords coordinates in raw pixel form
             * @return {Playbook.Models.Coordinate}		the matching grid pixels as coords
             */
            Grid.prototype.getCoordinatesFromAbsolute = function (x, y) {
                var coords = new Playbook.Models.Coordinates(x, y);
                // TODO: add in paper scroll offset
                var x = Math.round((coords.x / this.size) * this.divisor) / this.divisor;
                var y = Math.round((coords.y / this.size) * this.divisor) / this.divisor;
                return new Playbook.Models.Coordinates(x, y);
            };
            /**
             * Takes the given coords and snaps them to the nearest grid coords
             *
             * @param {Playbook.Models.Coordinate} coords Coordinates to snap
             * @return {Playbook.Models.Coordinate}		The nearest snapped coordinates
             */
            Grid.prototype.snapToNearest = function (ax, ay) {
                return this.getCoordinatesFromAbsolute(ax, ay);
            };
            /**
             * Snaps the given coords to the grid
             * @param {Playbook.Models.Coordinate} coords assumed non-snapped coordinates
             * @return {Playbook.Models.Coordinate}		the snapped coordinates
             */
            Grid.prototype.snap = function (x, y) {
                var coords = new Playbook.Models.Coordinates(x, y);
                var snapX = this.snapPixel(coords.x);
                var snapY = this.snapPixel(coords.y);
                return new Playbook.Models.Coordinates(snapX, snapY);
            };
            /**
             * takes a pixel value and translates it into a corresponding
             * number of grid units
             *
             * @param  {number} val value to calculate
             * @return {number}     calculated value
             */
            Grid.prototype.snapPixel = function (val) {
                return Math.round(val / (this.size / this.divisor)) * (this.size / this.divisor);
            };
            /**
             * Determines whether the given value is equally divisible
             * by the gridsize
             *
             * @param {number} val The value to calculate
             * @return {boolean}	true if divisible, otherwise false
             */
            Grid.prototype.isDivisible = function (val) {
                return val % (this.size / this.divisor) == 0;
            };
            return Grid;
        })();
        Models.Grid = Grid;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var GridSquare = (function () {
            function GridSquare(x, y) {
                this.x = x;
                this.y = y;
            }
            return GridSquare;
        })();
        Models.GridSquare = GridSquare;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Ground = (function (_super) {
            __extends(Ground, _super);
            function Ground(field) {
                _super.call(this, field);
                this.field = field;
                this.offset = new Playbook.Models.Coordinates(0, 0);
                this.placement = new Playbook.Models.Placement(0, 0, null);
                this.placement.coordinates.x = this.paper.x - 1;
                this.placement.coordinates.y = this.paper.y - 1;
                this.width = this.grid.width + 2;
                this.height = this.grid.height + 2;
                this.opacity = 1;
                this.clickable = true;
                this.color = Playbook.Constants.FIELD_COLOR;
            }
            Ground.prototype.draw = function () {
                var self = this;
                this.raphael = this.paper.Raphael.rect(this.placement.coordinates.x, this.placement.coordinates.y, this.width, this.height + 2).attr({
                    x: self.placement.coordinates.x,
                    y: self.placement.coordinates.y,
                    width: self.width + 2,
                    height: self.height + 2,
                    stroke: '#000000',
                    fill: this.color,
                    opacity: self.opacity
                });
                this.raphael.click(this.click, this);
                this.raphael.drag(this.dragMove, this.dragStart, this.dragEnd, this, this, this);
            };
            ;
            Ground.prototype.getClickCoordinates = function (offsetX, offsetY) {
                this.setOffset(offsetX, offsetY);
                return this.grid.getCoordinatesFromAbsolute(this.getOffsetX() - Math.abs(this.paper.x), Math.abs(this.paper.y) + this.getOffsetY());
            };
            ;
            Ground.prototype.click = function (e) {
                var coords = this.getClickCoordinates(e.offsetX, e.offsetY);
                var toolMode = this.paper.canvas.toolMode;
                switch (toolMode) {
                    case Playbook.Editor.ToolModes.Select:
                        console.log('selection mode');
                        this.field.deselectAll();
                        break;
                    case Playbook.Editor.ToolModes.None:
                        console.log('no mode');
                        this.field.deselectAll();
                        break;
                    case Playbook.Editor.ToolModes.Assignment:
                        this.field.useAssignmentTool(coords);
                        break;
                }
            };
            ;
            Ground.prototype.hoverIn = function (e, self) { };
            ;
            Ground.prototype.hoverOut = function (e, self) { };
            ;
            Ground.prototype.mouseDown = function (e, self) {
                self.setOffset(e.offsetX, e.offsetY);
            };
            ;
            Ground.prototype.dragMove = function (dx, dy, posx, posy, e) {
                //console.log('field drag', dx, dy, posx, posy);
            };
            ;
            Ground.prototype.dragStart = function (x, y, e) {
            };
            ;
            Ground.prototype.dragEnd = function (e) {
            };
            ;
            Ground.prototype.getOffset = function () {
                return this.offset;
            };
            ;
            Ground.prototype.getOffsetX = function () {
                return this.offset && this.offset.x;
            };
            ;
            Ground.prototype.getOffsetY = function () {
                return this.offset && this.offset.y;
            };
            ;
            Ground.prototype.setOffset = function (offsetX, offsetY) {
                this.setOffsetX(offsetX);
                this.setOffsetY(offsetY);
            };
            ;
            Ground.prototype.setOffsetX = function (value) {
                this.offset.x = value;
            };
            ;
            Ground.prototype.setOffsetY = function (value) {
                this.offset.y = value;
            };
            ;
            return Ground;
        })(Playbook.Models.FieldElement);
        Models.Ground = Ground;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Hashmark = (function (_super) {
            __extends(Hashmark, _super);
            function Hashmark(field, offset) {
                _super.call(this, field);
                // hash marks should be -x- grid units from center
                this.offset = offset || 3;
                this.placement.coordinates.x = this.grid.getCenter().x + this.offset;
                this.placement.coordinates.y = 0;
                this.width = (this.grid.getSize() / 2);
                this.height = 1;
                this.start = 11;
                this.yards = 110;
                this.opacity = 0.9;
                this.color = '#ffffff';
            }
            Hashmark.prototype.draw = function () {
                for (var i = this.start; i < this.yards; i++) {
                    this.raphael = this.paper.rect(this.placement.coordinates.x, i, this.width, this.height).attr({
                        'fill': this.color,
                        'fill-opacity': this.opacity,
                        'stroke-width': 0
                    });
                    this.paper.bump(-(this.width / 2), 0, this.raphael);
                }
            };
            return Hashmark;
        })(Playbook.Models.FieldElement);
        Models.Hashmark = Hashmark;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var LineOfScrimmage = (function (_super) {
            __extends(LineOfScrimmage, _super);
            function LineOfScrimmage(field) {
                _super.call(this, field);
                this.field = field;
                if (!this.field || !this.field.ball)
                    throw new Error('LineOfScrimmage constructor(): field/ball are null or undefined');
                this.LOS_Y_OFFSET = 8;
                this.placement.coordinates.x = 0;
                this.placement.coordinates.y = this.field.ball.placement.coordinates.y;
                this.width = this.grid.width;
                this.height = 4;
                this.color = 'yellow';
                this.opacity = 1;
            }
            LineOfScrimmage.prototype.draw = function () {
                this.paper.rect(this.placement.coordinates.x, this.placement.coordinates.y, this.width, this.height).click(this.click).attr({
                    'fill': this.color,
                    'fill-opacity': this.opacity,
                    'stroke-width': 0
                });
                // todo: attach drag functionality
                // drag when moving ball
            };
            return LineOfScrimmage;
        })(Playbook.Models.FieldElement);
        Models.LineOfScrimmage = LineOfScrimmage;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Listener = (function () {
            function Listener(context) {
                this.actions = {};
            }
            Listener.prototype.listen = function (actionId, fn) {
                if (!this.actions.hasOwnProperty[actionId])
                    this.actions[actionId] = [];
                this.actions[actionId].push(fn);
            };
            Listener.prototype.invoke = function (actionId, data, context) {
                if (!this.actions[actionId])
                    return;
                for (var i = 0; i < this.actions[actionId].length; i++) {
                    this.actions[actionId][i](data, context);
                }
            };
            return Listener;
        })();
        Models.Listener = Listener;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var RelativeCoordinates = (function (_super) {
            __extends(RelativeCoordinates, _super);
            function RelativeCoordinates(rx, ry, relativeElement) {
                _super.call(this);
                this.rx = rx;
                this.ry = ry;
                if (relativeElement) {
                    this.relativeElement = relativeElement;
                    this.distance = this.getDistance();
                    this.theta = this.getTheta();
                }
            }
            RelativeCoordinates.prototype.toJson = function () {
                return {
                    rx: this.rx,
                    ry: this.ry
                };
            };
            RelativeCoordinates.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.rx = json.rx;
                this.ry = json.ry;
            };
            RelativeCoordinates.prototype.getDistance = function () {
                return this.relativeElement ? Playbook.Utilities.distance(this.rx, this.ry, this.relativeElement.placement.coordinates.x, this.relativeElement.placement.coordinates.y) : null;
            };
            RelativeCoordinates.prototype.getTheta = function () {
                return this.relativeElement ? Playbook.Utilities.theta(this.rx, this.ry, this.relativeElement.placement.coordinates.x, this.relativeElement.placement.coordinates.y) : null;
            };
            RelativeCoordinates.prototype.updateFromGridCoordinates = function (x, y) {
                this.rx = this.relativeElement.placement.coordinates.x - x;
                this.ry = this.relativeElement.placement.coordinates.y - y;
            };
            RelativeCoordinates.prototype.updateFromAbsoluteCoordinates = function (ax, ay) {
                // snap absolute coordinates to grid coordinates first...
                var gridCoords = this.relativeElement.grid.getCoordinatesFromAbsolute(ax, ay);
                this.updateFromGridCoordinates(gridCoords.x, gridCoords.y);
            };
            return RelativeCoordinates;
        })(Common.Models.Storable);
        Models.RelativeCoordinates = RelativeCoordinates;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Sideline = (function (_super) {
            __extends(Sideline, _super);
            function Sideline(field, offset) {
                _super.call(this, field);
                this.field = field;
                this.color = 'white';
                this.opacity = 1;
                this.placement.coordinates.x = this.grid.getCenter().x;
                this.placement.coordinates.y = 0;
                this.width = this.grid.getSize();
                this.height = this.grid.getHeight();
                this.offset = offset || 0;
            }
            Sideline.prototype.draw = function () {
                // adjust the left sideline so that it does not overlap the grid
                // by shifting it left by its width so that its right edge aligns
                // with the gridline
                var bumpX = this.offset < 0 ? -this.width : 0;
                var rect = this.paper.rect(this.placement.coordinates.x + this.offset, this.placement.coordinates.y, this.width, this.height).attr({
                    'fill': this.color,
                    'fill-opacity': this.opacity,
                    'stroke-width': 0
                });
                this.paper.bump(bumpX, 0, rect);
            };
            return Sideline;
        })(Playbook.Models.FieldElement);
        Models.Sideline = Sideline;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Utilities = (function () {
        function Utilities() {
        }
        Utilities.getPathString = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            // arguments must be passed; must be at least 4 arguments; number of arguments must be even
            if (!args || args.length < 4 || args.length % 2 != 0)
                return undefined;
            var str = 'M' + args[0] + ' ' + args[1];
            for (var i = 2; i < args.length; i += 2) {
                if (!args[i] || typeof args[i] != 'number')
                    return undefined;
                var arg = args[i];
                str += ', L' + arg + ' ' + args[i + 1];
            }
            return str;
        };
        Utilities.getClosedPathString = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return (_a = Playbook.Utilities).getPathString.apply(_a, args) + ' Z';
            var _a;
        };
        Utilities.buildPath = function (from, to, width) {
            //console.log(from, to, width);
            var dist = this.distance(from.x, from.y, to.x, to.y);
            var theta = this.theta(from.x, from.y, to.x, to.y);
            var p1 = {
                x: (Math.cos(theta + (Math.PI / 2)) * (width / 2)) + from.x,
                y: (Math.sin(theta + (Math.PI / 2)) * (width / 2)) + from.y
            };
            var p2 = {
                x: (Math.cos(theta) * dist) + p1.x,
                y: (Math.sin(theta) * dist) + p1.y
            };
            var p3 = {
                x: (Math.cos(theta + (1.5 * Math.PI)) * width) + p2.x,
                y: (Math.sin(theta + (1.5 * Math.PI)) * width) + p2.y
            };
            var p4 = {
                x: (Math.cos(theta + Math.PI) * dist) + p3.x,
                y: (Math.sin(theta + Math.PI) * dist) + p3.y
            };
            var pathStr = Playbook.Utilities.getClosedPathString(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
            console.log(pathStr);
            return pathStr;
        };
        Utilities.distance = function (x1, y1, x2, y2) {
            return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
        };
        Utilities.theta = function (x1, y1, x2, y2) {
            var t = Math.atan2((y2 - y1), (x2 - x1));
            return t == Math.PI ? 0 : t;
        };
        Utilities.toDegrees = function (angle) {
            return angle * (180 / Math.PI);
        };
        Utilities.toRadians = function (angle) {
            return angle * (Math.PI / 180);
        };
        return Utilities;
    })();
    Playbook.Utilities = Utilities;
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Canvas = (function (_super) {
            __extends(Canvas, _super);
            function Canvas(playPrimary, playOpponent, width, height) {
                _super.call(this);
                /**
                 * TODO @theBull - find a better way to pass data into the canvas...
                 * it shouldn't be dependent on play data at this level..........? maybe?
                 */
                this.playPrimary = playPrimary;
                this.playOpponent = playOpponent;
                /**
                 * Note that paper is created during the initialize() method;
                 * canvas is dependent on angular directive / dynamic HTML include
                 * of the canvas, before the $container/container properties are
                 * available; these containers are required by the paper, which
                 * implements a Raphael object, that requires a container HTML element.
                 */
                //this.unitType = this.playPrimary.unitType;
                //this.editorType = this.playPrimary.editorType;
                this.toolMode = Playbook.Editor.ToolModes.Select;
                // need to set tab explicitly if it's within an editor
                this.tab = null;
                this.minWidth = 500;
                this.minHeight = 400;
                this.listener = new Playbook.Models.CanvasListener(this);
                this.readyCallbacks = [function () {
                        console.log('CANVAS READY: default canvas ready callback');
                    }];
                // TODO @theBull - look for performance improvements here
                // 
                // Maintains a window interval timer which checks every 1ms for
                // a change in container width; will fire a resize() if necessary
                this.widthChangeInterval = null;
            }
            /**
             * Converts this canvas's SVG graphics element into a data-URI
             * which can be used in an <img/> src attribute to render the image
             * as a PNG. Allows for retrieval and storage of the image as well.
             *
             * 3/9/2016: https://css-tricks.com/data-uris/
             * @return {string} [description]
             */
            Canvas.prototype.exportToPng = function () {
                if (!this.$container) {
                    throw new Error('Canvas exportToPng(): Cannot export to png; \
    			SVG parent $container is null or undefined');
                }
                var svgElement = this.$container.find('svg')[0];
                if (!svgElement) {
                    throw new Error('Canvas exportToPng(): Cannot export to png; \
    			Could not find SVG element inside of canvas $container');
                }
                return Common.Utilities.exportToPng(this, svgElement);
            };
            Canvas.prototype.initialize = function ($container) {
                var self = this;
                this.container = $container[0]; // jquery lite converted to raw html
                this.$container = $container; // jquery lite object
                this.width = this.$container.width();
                this.height = this.$container.height();
                this.paper = new Playbook.Models.Paper(this);
                this.paper.draw();
                // TODO @theBull - stop / pause this timer if the canvas is not
                // visible...
                // this.widthChangeInterval = setInterval(function() {
                // 	if(self.width != self.$container.width()) {
                // 		// width has changed; update the canvas dimensions and
                // 		// resize.
                // 		self.width = self.$container.width();
                // 		self.height = self.$container.height();
                // 		self.resize();
                // 	}
                // }, 1);
                this._ready();
            };
            Canvas.prototype.updatePlay = function (playPrimary, playOpponent, redraw) {
                this.playPrimary = playPrimary || this.playPrimary;
                this.playOpponent = playOpponent || this.playOpponent;
                this.unitType = this.playPrimary.unitType;
                this.editorType = this.playPrimary.editorType;
                this.paper.updatePlay(this.playPrimary, this.playOpponent);
            };
            Canvas.prototype.onready = function (callback) {
                if (this.readyCallbacks && this.readyCallbacks.length > 1000)
                    throw new Error('Canvas onready(): callback not added; max ready callback limit exceeded');
                this.readyCallbacks.push(callback);
            };
            Canvas.prototype._ready = function () {
                for (var i = 0; i < this.readyCallbacks.length; i++) {
                    this.readyCallbacks[i]();
                }
            };
            Canvas.prototype.getSvg = function () {
                var $svg = $('svg');
                var serializer = new XMLSerializer();
                var svg_blob = serializer.serializeToString($svg[0]);
                return svg_blob;
            };
            Canvas.prototype.resize = function () {
                var self = this;
                this.width = this.$container.width();
                this.height = this.$container.height();
                this.paper.resize();
                if (this._scrollable) {
                    this._scrollable.initialize(this.$container, this.paper);
                    this._scrollable.onready(function (content) {
                        self._scrollable.scrollToPercentY(0.5);
                    });
                }
            };
            Canvas.prototype.setScrollable = function (_scrollable) {
                this._scrollable = _scrollable;
            };
            Canvas.prototype.resetHeight = function () {
                //this.height = this.$container.height(this.$container.height());
            };
            Canvas.prototype.listen = function (actionId, fn) {
                this.listener.listen(actionId, fn);
            };
            Canvas.prototype.invoke = function (actionId, data, context) {
                console.log('invoking action: ', actionId);
                this.listener.invoke(actionId, data, context);
            };
            Canvas.prototype.zoomIn = function () {
                throw new Error('canvas zoomIn() not implemented');
            };
            Canvas.prototype.zoomOut = function () {
                throw new Error('canvas zoomOut() not implemented');
            };
            Canvas.prototype.getToolMode = function () {
                return this.toolMode;
            };
            Canvas.prototype.getToolModeName = function () {
                return Playbook.Editor.ToolModes[this.toolMode];
            };
            Canvas.prototype.getPaperWidth = function () {
                var width = Math.max(this.$container.width(), this.minWidth);
                var paperWidth = (Math.ceil(width / this.getGridSize()) *
                    this.getGridSize()) - (4 * this.getGridSize());
                return paperWidth;
            };
            Canvas.prototype.getPaperHeight = function () {
                var height = Math.max(this.$container.height(), this.minHeight);
                var paperHeight = (Math.ceil(height / this.getGridSize()) *
                    this.getGridSize()) - (4 * this.getGridSize());
                return paperHeight;
            };
            Canvas.prototype.getGridSize = function () {
                return this.paper && this.paper.grid && this.paper.grid.getSize();
            };
            return Canvas;
        })(Common.Models.Storable);
        Models.Canvas = Canvas;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var CanvasListener = (function () {
            function CanvasListener(context) {
                this.actions = {};
            }
            CanvasListener.prototype.listen = function (actionId, fn) {
                if (!this.actions.hasOwnProperty[actionId])
                    this.actions[actionId] = [];
                this.actions[actionId].push(fn);
            };
            CanvasListener.prototype.invoke = function (actionId, data, context) {
                if (!this.actions[actionId])
                    return;
                for (var i = 0; i < this.actions[actionId].length; i++) {
                    this.actions[actionId][i](data, context);
                }
            };
            return CanvasListener;
        })();
        Models.CanvasListener = CanvasListener;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PreviewCanvas = (function (_super) {
            __extends(PreviewCanvas, _super);
            function PreviewCanvas(playPrimary, playOpponent) {
                _super.call(this, playPrimary, playOpponent);
                this.minWidth = 250;
                this.minHeight = 200;
                this.toolMode = Playbook.Editor.ToolModes.None;
                this.$exportCanvas = $('<canvas/>', {
                    id: 'exportCanvas' + this.guid
                }).width(500).height(400);
                this.exportCanvas = this.$exportCanvas[0];
            }
            PreviewCanvas.prototype.initialize = function ($container) {
                this.container = $container[0]; // jquery lite converted to raw html
                this.$container = $container;
                this.width = 500; //this.$container.width();
                this.height = 400; //this.$container.height();
                this.paper = new Playbook.Models.PreviewPaper(this);
                this.paper.draw();
            };
            ;
            PreviewCanvas.prototype.refresh = function () {
                this.paper.draw();
            };
            ;
            return PreviewCanvas;
        })(Playbook.Models.Canvas);
        Models.PreviewCanvas = PreviewCanvas;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Paper = (function () {
            function Paper(canvas) {
                this.canvas = this.canvas || canvas;
                // By default, paper should be scaled based on max canvas width
                this.sizingMode = this.sizingMode || Playbook.Editor.PaperSizingModes.MaxCanvasWidth;
                this.x = 0;
                this.y = 0;
                this.scrollSpeed = 0.5;
                this.zoomSpeed = 100;
                this.showBorder = this.showBorder === true;
                // Grid will help the paper determine its sizing
                // and will be the basis for drawing objects' lengths and
                // dimensions.
                this.grid = this.grid || new Playbook.Models.Grid(this, Playbook.Constants.FIELD_COLS_FULL, Playbook.Constants.FIELD_ROWS_FULL);
                // this is the actual Raphael paper
                this.Raphael = this.Raphael || new Raphael(this.canvas.container, this.grid.width, this.grid.height // * 2
                );
                // Paper methods within field are dependent on 
                // this.Raphael
                this.field = this.field || new Playbook.Models.Field(this, this.canvas.playPrimary, this.canvas.playOpponent);
            }
            Paper.prototype.draw = function () {
                this.clear();
                if (this.showBorder)
                    this.drawOutline();
                this.field.draw();
            };
            Paper.prototype.updatePlay = function (playPrimary, playOpponent) {
                this.field.updatePlay(playPrimary, playOpponent);
            };
            Paper.prototype.getWidth = function () {
                return this.grid.width;
            };
            Paper.prototype.getHeight = function () {
                return this.grid.height;
            };
            Paper.prototype.getXOffset = function () {
                return -Math.round((this.canvas.width - this.grid.width) / 2);
            };
            Paper.prototype.resize = function () {
                this.grid.resize(this.sizingMode);
                this.setViewBox();
                this.draw();
            };
            Paper.prototype.clear = function () {
                return this.Raphael.clear();
            };
            Paper.prototype.setViewBox = function () {
                this.Raphael.canvas.setAttribute('width', this.grid.width);
                //this.x = this.getXOffset();
                var setting = this.Raphael.setViewBox(this.x, this.y, this.grid.width, this.grid.height, true);
            };
            Paper.prototype.drawOutline = function () {
                var self = this;
                if (this.showBorder) {
                    // paper view port
                    if (!this.viewOutline) {
                        this.viewOutline = this.Raphael.rect(this.x + 5, this.y + 5, this.canvas.width - 10, this.canvas.height - 10);
                    }
                    this.viewOutline.attr({
                        x: self.x + 5,
                        y: self.y + 5,
                        width: self.canvas.width - 10,
                        height: self.canvas.height - 10,
                        stroke: 'red'
                    });
                }
            };
            Paper.prototype.zoom = function (deltaY) {
                if (deltaY < 0)
                    this.zoomOut();
                if (deltaY > 0)
                    this.zoomIn();
            };
            Paper.prototype.zoomToFit = function () {
                //Math.round(this.contextWidth / (this.grid.GRIDSIZE * 50));
            };
            Paper.prototype.zoomIn = function (speed) {
            };
            Paper.prototype.zoomOut = function (speed) {
            };
            Paper.prototype.scroll = function (scrollToX, scrollToY) {
                this.y = scrollToY;
                return this.setViewBox();
            };
            Paper.prototype.path = function (path) {
                return this.Raphael.path(path);
            };
            Paper.prototype.bump = function (x, y, raphael) {
                var currX = raphael.attrs.x;
                var currY = raphael.attrs.y;
                return raphael.attr({ x: currX + x, y: currY + y });
            };
            Paper.prototype.alignToGrid = function (x, y, absolute) {
                var coords = new Playbook.Models.Coordinates(x, y);
                return !absolute ?
                    this.grid.getAbsoluteFromCoordinates(coords.x, coords.y) :
                    coords;
            };
            Paper.prototype.rect = function (x, y, width, height, absolute) {
                var pixels = this.alignToGrid(x, y, absolute);
                var rect = this.Raphael.rect(pixels.x, pixels.y, width, height).attr({
                    x: pixels.x,
                    y: pixels.y
                });
                return rect;
            };
            Paper.prototype.ellipse = function (x, y, width, height, absolute) {
                var pixels = this.alignToGrid(x, y, absolute);
                var ellipse = this.Raphael.ellipse(pixels.x, pixels.y, width, height).attr({
                    cx: pixels.x,
                    cy: pixels.y
                });
                return ellipse;
            };
            Paper.prototype.circle = function (x, y, radius, absolute) {
                var pixels = this.alignToGrid(x, y, absolute);
                var circle = this.Raphael.circle(pixels.x, pixels.y, radius).attr({
                    cx: pixels.x,
                    cy: pixels.y
                });
                return circle;
            };
            Paper.prototype.text = function (x, y, text, absolute) {
                var pixels = this.alignToGrid(x, y, absolute);
                return this.Raphael.text(pixels.x, pixels.y, text);
            };
            Paper.prototype.print = function (x, y, text, font, size, origin, letterSpacing) {
                var pixels = this.alignToGrid(x, y, false);
                return this.Raphael.print(pixels.x, pixels.y, text, font, size, origin, letterSpacing);
            };
            Paper.prototype.getFont = function (family, weight, style, stretch) {
                return this.Raphael.getFont(family, weight, stretch);
            };
            Paper.prototype.set = function () {
                return this.Raphael.set();
            };
            Paper.prototype.remove = function (element) {
                element && element[0] && element[0].remove();
            };
            Paper.prototype.pathMoveTo = function (ax, ay) {
                return ['M', ax, ' ', ay].join('');
            };
            Paper.prototype.getPathString = function (initialize, coords) {
                // arguments must be passed; must be at least 4 arguments; number of arguments must be even
                if (!coords ||
                    coords.length < 4 ||
                    coords.length % 2 != 0)
                    return undefined;
                var str = initialize ? this.pathMoveTo(coords[0], coords[1]) : '';
                for (var i = 2; i < coords.length; i += 2) {
                    str += this.pathLineTo(coords[i], coords[i + 1]);
                }
                return str;
            };
            Paper.prototype.pathLineTo = function (x, y) {
                return ['L', x, ' ', y].join('');
            };
            Paper.prototype.getPathStringFromNodes = function (initialize, nodeArray) {
                var coords = [];
                for (var i = 0; i < nodeArray.length; i++) {
                    var node = nodeArray[i];
                    coords.push(node.placement.coordinates.ax, node.placement.coordinates.ay);
                }
                return this.getPathString(initialize, coords);
            };
            Paper.prototype.getClosedPathString = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return (_a = Playbook.Utilities).getPathString.apply(_a, args) + ' Z';
                var _a;
            };
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
            Paper.prototype.getCurveString = function (initialize, coords) {
                // arguments must be passed; must be at least 4 arguments; 
                // number of arguments must be even
                if (!coords || coords.length % 2 != 0) {
                    throw new Error([
                        'You must pass an even number',
                        ' of coords to getCurveString()'
                    ].join(''));
                }
                ;
                // current (start) point
                var str = '';
                if (initialize) {
                    if (coords.length != 6) {
                        throw new Error([
                            'You must pass at least 6 coords to initialize',
                            ' a curved path'
                        ].join(''));
                    }
                    var initialCoords = coords.splice(0, 2);
                    str = this.pathMoveTo(initialCoords[0], initialCoords[1]);
                }
                if (coords.length < 4) {
                    throw new Error([
                        'There must be 4 coords to create a curved path:',
                        ' control -> (x, y); end -> (x, y);',
                        ' [control.x, control.y, end.x, end.y]'
                    ].join(''));
                }
                for (var i = 0; i < coords.length; i += 4) {
                    str += this.quadraticCurveTo(coords[i], coords[i + 1], coords[i + 2], coords[i + 3] // y (end y)
                    );
                }
                return str;
            };
            Paper.prototype.quadraticCurveTo = function (x1, y1, x, y) {
                return ['Q', x1, ',', y1, ' ', x, ',', y].join('');
            };
            Paper.prototype.getCurveStringFromNodes = function (initialize, nodeArray) {
                var coords = [];
                for (var i = 0; i < nodeArray.length; i++) {
                    var node = nodeArray[i];
                    coords.push(node.placement.coordinates.ax, node.placement.coordinates.ay);
                }
                return this.getCurveString(initialize, coords);
            };
            Paper.prototype.buildPath = function (fromGrid, toGrid, width) {
                //console.log(from, to, width);
                var from = this.grid.getAbsoluteFromCoordinates(fromGrid.x, fromGrid.y);
                var to = this.grid.getAbsoluteFromCoordinates(toGrid.x, toGrid.y);
                var dist = this.distance(from.x, from.y, to.x, to.y);
                var theta = this.theta(from.x, from.y, to.x, to.y);
                var p1 = {
                    x: (Math.cos(theta + (Math.PI / 2)) * (width / 2)) + from.x,
                    y: (Math.sin(theta + (Math.PI / 2)) * (width / 2)) + from.y
                };
                var p2 = {
                    x: (Math.cos(theta) * dist) + p1.x,
                    y: (Math.sin(theta) * dist) + p1.y
                };
                var p3 = {
                    x: (Math.cos(theta + (1.5 * Math.PI)) * width) + p2.x,
                    y: (Math.sin(theta + (1.5 * Math.PI)) * width) + p2.y
                };
                var p4 = {
                    x: (Math.cos(theta + Math.PI) * dist) + p3.x,
                    y: (Math.sin(theta + Math.PI) * dist) + p3.y
                };
                var pathStr = this.getClosedPathString(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
                //console.log(pathStr);
                return pathStr;
            };
            Paper.prototype.distance = function (x1, y1, x2, y2) {
                return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
            };
            // returns radians
            Paper.prototype.theta = function (x1, y1, x2, y2) {
                return Math.atan2((y1 - y2), (x2 - x1));
            };
            Paper.prototype.toDegrees = function (angle) {
                return angle * (180 / Math.PI);
            };
            Paper.prototype.toRadians = function (angle) {
                return angle * (Math.PI / 180);
            };
            return Paper;
        })();
        Models.Paper = Paper;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var FullPaper = (function (_super) {
            __extends(FullPaper, _super);
            function FullPaper(canvas) {
                _super.call(this, canvas);
                // Grid will help the paper determine its sizing
                // and will be the basis for drawing objects' lengths and
                // dimensions.
                this.grid = new Playbook.Models.Grid(this, Playbook.Constants.FIELD_COLS_FULL, Playbook.Constants.FIELD_ROWS_FULL);
                // this is the actual Raphael paper
                this.Raphael = Raphael(this.canvas.container, this.grid.width, this.grid.height // * 2
                );
                // Paper methods within field are dependent on 
                // this.Raphael
                this.field = new Playbook.Models.Field(this, this.canvas.playPrimary, this.canvas.playOpponent);
            }
            return FullPaper;
        })(Playbook.Models.Paper);
        Models.FullPaper = FullPaper;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PreviewPaper = (function (_super) {
            __extends(PreviewPaper, _super);
            function PreviewPaper(previewCanvas) {
                _super.call(this, previewCanvas);
                this.canvas = previewCanvas;
                this.sizingMode = Playbook.Editor.PaperSizingModes.PreviewWidth;
                this.showBorder = false;
                // NOTE: Grid size uses PREVIEW constants
                this.grid = new Playbook.Models.Grid(this, Playbook.Constants.FIELD_COLS_PREVIEW, Playbook.Constants.FIELD_ROWS_PREVIEW);
                this.Raphael = Raphael(this.canvas.container, this.grid.width, this.grid.height // * 2
                );
                // Paper methods within field are dependent on 
                // this.Raphael
                this.field = new Playbook.Models.PreviewField(this, this.canvas.playPrimary, this.canvas.playOpponent);
            }
            return PreviewPaper;
        })(Playbook.Models.Paper);
        Models.PreviewPaper = PreviewPaper;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Formation = (function (_super) {
            __extends(Formation, _super);
            function Formation(name) {
                _super.call(this, this);
                this.unitType = Playbook.Editor.UnitTypes.Other;
                this.parentRK = 1;
                this.editorType = Playbook.Editor.EditorTypes.Formation;
                this.name = name || 'untitled';
                this.associated = new Common.Models.Association();
                this.placements = new Playbook.Models.PlacementCollection();
                this.png = null;
                //this.setDefault();
            }
            Formation.prototype.copy = function (newFormation) {
                var copyFormation = newFormation || new Playbook.Models.Formation();
                return _super.prototype.copy.call(this, copyFormation, this);
            };
            Formation.prototype.toJson = function () {
                return $.extend(_super.prototype.toJson.call(this), {
                    name: this.name,
                    key: this.key,
                    parentRK: this.parentRK,
                    unitType: this.unitType,
                    editorType: this.editorType,
                    guid: this.guid,
                    associated: this.associated.toJson(),
                    placements: this.placements.toJson(),
                    png: this.png
                });
            };
            Formation.prototype.fromJson = function (json) {
                if (!json)
                    return;
                var self = this;
                _super.prototype.fromJson.call(this, json);
                this.parentRK = json.parentRK;
                this.editorType = Playbook.Editor.EditorTypes.Formation;
                this.name = json.name;
                this.guid = json.guid;
                this.unitType = json.unitType;
                this.placements.fromJson(json.placements);
                this.key = json.key;
                this.associated.fromJson(json.associated);
                this.png = json.png;
                this.placements.onModified(function () {
                    console.log('formation modified: placement collection:', self.guid);
                    self.setModified(true);
                });
                this.onModified(function () {
                    console.log('formation modified?', self.modified);
                });
            };
            Formation.prototype.setDefault = function (ball) {
                if (!ball)
                    throw new Error('Formation setDefault(): \
					Field reference is null or undefined');
                this.placements.removeAll();
                this.placements.addAll(new Playbook.Models.Placement(0, -1, ball, 0), new Playbook.Models.Placement(1.5, -1, ball, 1), new Playbook.Models.Placement(-1.5, -1, ball, 2), new Playbook.Models.Placement(-3, -1, ball, 3), new Playbook.Models.Placement(-6, -1, ball, 4), new Playbook.Models.Placement(0, -2, ball, 5), new Playbook.Models.Placement(-4, -2, ball, 6), new Playbook.Models.Placement(-16, -1, ball, 7), new Playbook.Models.Placement(14, -1, ball, 8), new Playbook.Models.Placement(0, -4, ball, 9), new Playbook.Models.Placement(0, -6, ball, 10));
            };
            Formation.prototype.isValid = function () {
                // TODO add validation for 7 players on LOS
                return this.placements.size() == 11;
            };
            return Formation;
        })(Common.Models.Modifiable);
        Models.Formation = Formation;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var FormationCollection = (function (_super) {
            __extends(FormationCollection, _super);
            // at this point I'm expecting an object literal with data / count
            // properties, but not a valid FormationCollection; Essentially
            // this is to get around 
            function FormationCollection() {
                _super.call(this);
                this.parentRK = -1;
                this.unitType = Playbook.Editor.UnitTypes.Other;
                this.onModified(function () {
                    console.log('formation collection modified');
                });
            }
            FormationCollection.prototype.toJson = function () {
                return {
                    formations: _super.prototype.toJson.call(this),
                    unitType: this.unitType,
                    guid: this.guid
                };
            };
            FormationCollection.prototype.fromJson = function (json) {
                if (!json)
                    return;
                // this.guid = json.guid || this.guid;
                // this.unitType = json.unitType || this.unitType;
                // this.parentRK = json.parentRK || this.parentRK
                var self = this;
                var formations = json || [];
                for (var i = 0; i < formations.length; i++) {
                    var rawFormation = formations[i];
                    var formationModel = new Playbook.Models.Formation();
                    formationModel.fromJson(rawFormation);
                    this.add(formationModel);
                }
                this.forEach(function (formation, index) {
                    formation.onModified(function () {
                        console.log('formation collection modified: formation');
                        self.setModified(true);
                    });
                });
            };
            return FormationCollection;
        })(Common.Models.ModifiableCollection);
        Models.FormationCollection = FormationCollection;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Personnel = (function (_super) {
            __extends(Personnel, _super);
            function Personnel() {
                _super.call(this, this);
                this.name = 'Untitled';
                this.unitType = Playbook.Editor.UnitTypes.Other;
                this.key = -1;
                this.positions = new Playbook.Models.PositionCollection();
                this.setDefault();
                this.setType = Playbook.Editor.SetTypes.Personnel;
                this.onModified(function (data) {
                    console.log('personnel changed', data);
                });
                this.positions.onModified(function (data) {
                    console.log('personnel positions changed', data);
                });
            }
            Personnel.prototype.hasPositions = function () {
                return this.positions && this.positions.size() > 0;
            };
            Personnel.prototype.update = function (personnel) {
                this.unitType = personnel.unitType;
                this.key = personnel.key;
                this.name = personnel.name;
                this.guid = personnel.guid;
            };
            Personnel.prototype.copy = function (newPersonnel) {
                return _super.prototype.copy.call(this, newPersonnel, this);
            };
            Personnel.prototype.fromJson = function (json) {
                if (!json)
                    return null;
                this.positions.removeAll();
                this.positions.fromJson(json.positions);
                this.unitType = json.unitType;
                this.key = json.key;
                this.name = json.name;
                this.guid = json.guid;
            };
            Personnel.prototype.toJson = function () {
                return {
                    name: this.name,
                    unitType: this.unitType,
                    key: this.key,
                    positions: this.positions.toJson(),
                    guid: this.guid
                };
            };
            Personnel.prototype.setDefault = function () {
                this.positions = Playbook.Models.PositionDefault.getBlank(this.unitType);
            };
            Personnel.prototype.setUnitType = function (unitType) {
                this.unitType = unitType;
                this.setDefault();
            };
            return Personnel;
        })(Common.Models.Modifiable);
        Models.Personnel = Personnel;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PersonnelCollection = (function (_super) {
            __extends(PersonnelCollection, _super);
            function PersonnelCollection() {
                _super.call(this);
                this.unitType = Playbook.Editor.UnitTypes.Other;
                this.setType = Playbook.Editor.SetTypes.Personnel;
            }
            PersonnelCollection.prototype.toJson = function () {
                return {
                    unitType: this.unitType,
                    setType: this.setType,
                    personnel: _super.prototype.toJson.call(this)
                };
            };
            PersonnelCollection.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.unitType = json.unitType;
                this.guid = json.guid;
                this.setType = json.setType;
                var personnelArray = json.personnel || [];
                for (var i = 0; i < personnelArray.length; i++) {
                    var rawPersonnel = personnelArray[i];
                    var personnelModel = new Playbook.Models.Personnel();
                    personnelModel.fromJson(rawPersonnel);
                    this.add(personnelModel);
                }
            };
            return PersonnelCollection;
        })(Common.Models.ModifiableCollection);
        Models.PersonnelCollection = PersonnelCollection;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Placement = (function (_super) {
            __extends(Placement, _super);
            function Placement(rx, ry, relativeElement, index) {
                _super.call(this, this);
                if (!relativeElement)
                    throw new Error('Placement constructor(): relativeElement is null or undefined');
                this.relativeElement = relativeElement;
                this.grid = this.relativeElement.grid;
                this.relative = new Playbook.Models.RelativeCoordinates(rx, ry, this.relativeElement);
                this.index = index >= 0 ? index : -1;
                this.onModified(function () {
                    console.log('TODO @theBull - placement modified callback');
                });
            }
            Placement.prototype.toJson = function () {
                return {
                    relativeCoordinates: this.relative.toJson(),
                    coordinates: this.coordinates.toJson(),
                    index: this.index,
                    guid: this.guid
                };
            };
            Placement.prototype.fromJson = function (json) {
                this.relative.fromJson(json.relativeCoordinates);
                this.coordinates.fromJson(json.coordinates);
                this.index = json.index;
                this.guid = json.guid;
                this.setModified(true);
            };
            Placement.prototype.moveByDelta = function (dx, dy) {
                if (!this.coordinates)
                    throw new Error('Placement moveByDelta(): coordinates are null or undefined');
                this.coordinates.dx = dx;
                this.coordinates.dy = dy;
                this.coordinates.ax = this.coordinates.ox + this.coordinates.dx;
                this.coordinates.ay = this.coordinates.oy + this.coordinates.dy;
            };
            Placement.prototype.drop = function () {
                this.coordinates.drop();
            };
            Placement.prototype.refresh = function () {
                var absCoords = this.grid.getAbsoluteFromCoordinates(this.coordinates.x, this.coordinates.y);
                this.coordinates.ax = absCoords.x;
                this.coordinates.ay = absCoords.y;
                this.coordinates.ox = this.coordinates.ax;
                this.coordinates.oy = this.coordinates.ay;
            };
            /**
             * Updates this placement with the given placement
             *
             * @param {number} placement The new placement
             */
            Placement.prototype.update = function (placement) {
                // Update this' values
                this.fromJson(placement.toJson());
            };
            Placement.prototype.updateCoordinatesFromAbsolute = function (ax, ay) {
                this.coordinates.ax = ax;
                this.coordinates.ay = ay;
                var absCoords = this.grid.getCoordinatesFromAbsolute(ax, ay);
                this.coordinates.x = absCoords.x;
                this.coordinates.y = absCoords.y;
                // update relative coordinates
                this.relative.updateFromGridCoordinates(this.coordinates.x, this.coordinates.y);
            };
            Placement.prototype.updateCoordinates = function (x, y) {
            };
            return Placement;
        })(Common.Models.Modifiable);
        Models.Placement = Placement;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PlacementCollection = (function (_super) {
            __extends(PlacementCollection, _super);
            function PlacementCollection() {
                _super.call(this);
            }
            PlacementCollection.prototype.fromJson = function (placements) {
                if (!placements)
                    return;
                var self = this;
                this.empty();
                for (var i = 0; i < placements.length; i++) {
                    var rawPlacement = placements[i];
                    var placementModel = new Playbook.Models.Placement(0, 0, null);
                    placementModel.fromJson(rawPlacement);
                    this.add(placementModel);
                }
                this.forEach(function (placement, index) {
                    placement.onModified(function () {
                        console.log('placement collection modified: placement:', placement.guid);
                        self.setModified(true);
                    });
                });
                this.setModified(true);
            };
            PlacementCollection.prototype.toJson = function () {
                return _super.prototype.toJson.call(this);
            };
            return PlacementCollection;
        })(Common.Models.ModifiableCollection);
        Models.PlacementCollection = PlacementCollection;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Play = (function (_super) {
            __extends(Play, _super);
            function Play() {
                _super.call(this, this);
                this.field = null;
                this.name = 'Default';
                this.associated = new Common.Models.Association();
                this.assignments = null;
                this.formation = null;
                this.personnel = null;
                this.unitType = Playbook.Editor.UnitTypes.Other;
                this.editorType = Playbook.Editor.EditorTypes.Play;
                this.png = null;
            }
            Play.prototype.setPlaybook = function (playbook) {
                // Unit type is key.
                if (playbook) {
                    this.associated.playbooks.only(playbook.guid);
                }
                else {
                    this.associated.playbooks.empty();
                    console.warn('Play setPlaybook(): implementation is incomplete');
                }
                // TODO @theBull
                // - add playbook field?
                // - what happens when changing to playbooks of different unit types? 
                this.setModified(true);
            };
            Play.prototype.setFormation = function (formation) {
                if (formation) {
                    this.associated.formations.only(formation.guid);
                }
                else {
                    this.associated.formations.empty();
                    this.setAssignments(null);
                    this.setPersonnel(null);
                }
                this.formation = formation;
                this.setModified(true);
            };
            Play.prototype.setAssignments = function (assignments) {
                if (assignments) {
                    this.associated.assignments.only(assignments.guid);
                }
                else {
                    this.associated.assignments.empty();
                }
                this.assignments = assignments;
                this.setModified(true);
            };
            Play.prototype.setPersonnel = function (personnel) {
                if (personnel) {
                    this.associated.personnel.only(personnel.guid);
                }
                else {
                    this.associated.personnel.empty();
                }
                this.personnel = personnel;
                this.setModified(true);
            };
            Play.prototype.draw = function (field) {
                if (!field)
                    throw new Error('Play draw(): Field is null or undefined');
                if (!field.ball)
                    throw new Error('Play draw(): Ball is null or undefined');
                this.field = field;
                var self = this;
                // set defaults, in case no assignments / personnel were assigned
                if (!this.personnel) {
                    this.personnel = new Playbook.Models.Personnel();
                }
                if (!this.assignments) {
                    this.assignments = new Playbook.Models.AssignmentCollection();
                }
                if (!this.formation || !this.formation.placements || this.formation.placements.isEmpty()) {
                    this.formation = new Playbook.Models.Formation();
                    this.formation.setDefault(this.field.ball);
                }
                this.formation.placements.forEach(function (placement, index) {
                    var position = self.personnel.positions.getIndex(index);
                    var assignment = self.assignments.getIndex(index);
                    self.field.addPlayer(placement, position, assignment);
                });
            };
            Play.prototype.fromJson = function (json) {
                // TODO
                this.key = json.key;
                this.name = json.name;
                this.guid = json.guid;
                this.associated.formations.add(json.formationGuid);
                this.associated.personnel.add(json.personnelGuid);
                this.associated.assignments.add(json.assignmentsGuid);
                this.unitType = json.unitType;
                this.editorType = json.editorType;
                this.png = json.png;
            };
            Play.prototype.toJson = function () {
                return {
                    key: this.key,
                    name: this.name,
                    associated: this.associated.toJson(),
                    assignmentsGuid: this.assignments ? this.assignments.guid : null,
                    personnelGuid: this.personnel ? this.personnel.guid : null,
                    formationGuid: this.formation ? this.formation.guid : null,
                    unitType: this.unitType,
                    editorType: this.editorType,
                    guid: this.guid,
                    png: this.png
                };
            };
            Play.prototype.hasAssignments = function () {
                return this.assignments && this.assignments.size() > 0;
            };
            Play.prototype.setDefault = function (field) {
                if (!field)
                    throw new Error('Play setDefault(): field is null or undefined');
                this.field = field;
                // empty what's already there, if anything...
                if (!this.personnel)
                    this.personnel = new Playbook.Models.Personnel();
                if (!this.formation)
                    this.formation = new Playbook.Models.Formation();
                this.personnel.setDefault();
                this.formation.setDefault(this.field.ball);
                // assignments?
                // this.draw(field);
            };
            return Play;
        })(Common.Models.Modifiable);
        Models.Play = Play;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PlayPrimary = (function (_super) {
            __extends(PlayPrimary, _super);
            function PlayPrimary() {
                _super.call(this);
                this.playType = Playbook.Editor.PlayTypes.Primary;
            }
            return PlayPrimary;
        })(Playbook.Models.Play);
        Models.PlayPrimary = PlayPrimary;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PlayOpponent = (function (_super) {
            __extends(PlayOpponent, _super);
            function PlayOpponent() {
                _super.call(this);
                this.playType = Playbook.Editor.PlayTypes.Opponent;
            }
            PlayOpponent.prototype.draw = function (field) {
                // TODO @theBull - flip the play over
                _super.prototype.draw.call(this, field);
            };
            return PlayOpponent;
        })(Playbook.Models.Play);
        Models.PlayOpponent = PlayOpponent;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PlayCollection = (function (_super) {
            __extends(PlayCollection, _super);
            function PlayCollection() {
                _super.call(this);
            }
            PlayCollection.prototype.toJson = function () {
                throw new Error('PlayCollection toJson(): not implemented');
            };
            PlayCollection.prototype.fromJson = function (plays) {
                if (!plays)
                    plays = [];
                for (var i = 0; i < plays.length; i++) {
                    var obj = plays[i];
                    var rawPlay = obj.data.play;
                    rawPlay.key = obj.key;
                    // TODO
                    var playModel = new Playbook.Models.Play();
                    playModel.fromJson(rawPlay);
                    this.add(playModel);
                }
            };
            return PlayCollection;
        })(Common.Models.ModifiableCollection);
        Models.PlayCollection = PlayCollection;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PlaybookModel = (function (_super) {
            __extends(PlaybookModel, _super);
            function PlaybookModel() {
                _super.call(this, this);
                this.key = -1;
                this.name = 'Untitled';
                this.associated = new Common.Models.Association();
                this.unitType = Playbook.Editor.UnitTypes.Other;
            }
            PlaybookModel.prototype.toJson = function () {
                return {
                    key: this.key,
                    name: this.name,
                    associated: this.associated.toJson(),
                    unitType: this.unitType,
                    guid: this.guid
                };
            };
            PlaybookModel.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.key = json.key || this.key;
                this.name = json.name || this.name;
                this.unitType = json.unitType || this.unitType;
                this.guid = json.guid || this.guid;
                if (json.associated)
                    this.associated.fromJson(json.associated);
            };
            return PlaybookModel;
        })(Common.Models.Modifiable);
        Models.PlaybookModel = PlaybookModel;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PlaybookModelCollection = (function (_super) {
            __extends(PlaybookModelCollection, _super);
            function PlaybookModelCollection() {
                _super.call(this);
            }
            PlaybookModelCollection.prototype.toJson = function () {
                return {
                    guid: this.guid,
                    playbooks: _super.prototype.toJson.call(this)
                };
            };
            PlaybookModelCollection.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.guid = json.guid || this.guid;
                var playbooks = json.playbooks || [];
                for (var i = 0; i < playbooks.length; i++) {
                    var rawPlaybook = playbooks[i];
                    var playbookModel = new Playbook.Models.PlaybookModel();
                    playbookModel.fromJson(rawPlaybook);
                    this.add(playbookModel);
                }
            };
            return PlaybookModelCollection;
        })(Common.Models.ModifiableCollection);
        Models.PlaybookModelCollection = PlaybookModelCollection;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var UnitType = (function (_super) {
            __extends(UnitType, _super);
            function UnitType(unitType, name) {
                _super.call(this, this);
                this.unitType = unitType;
                this.associated = new Common.Models.Association();
                this.name = name;
            }
            UnitType.getUnitTypes = function () {
                return Common.Utilities.convertEnumToList(Playbook.Editor.UnitTypes);
            };
            UnitType.prototype.toJson = function () {
                var json = {
                    associated: this.associated.toJson(),
                    unitType: this.unitType,
                    name: this.name,
                    guid: this.guid
                };
                return json;
            };
            UnitType.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.unitType = json.unitType;
                this.name = json.name;
                this.guid = json.guid;
                this.associated.playbooks.fromJson(json.playbooks);
                this.associated.formations.fromJson(json.formations);
                this.associated.personnel.fromJson(json.personnel);
                this.associated.assignments.fromJson(json.assignments);
            };
            return UnitType;
        })(Common.Models.Modifiable);
        Models.UnitType = UnitType;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var UnitTypeCollection = (function (_super) {
            __extends(UnitTypeCollection, _super);
            function UnitTypeCollection() {
                _super.call(this);
                var offense = new Playbook.Models.UnitType(Playbook.Editor.UnitTypes.Offense, 'offense');
                this.add(offense);
                var defense = new Playbook.Models.UnitType(Playbook.Editor.UnitTypes.Defense, 'defense');
                this.add(defense);
                var specialTeams = new Playbook.Models.UnitType(Playbook.Editor.UnitTypes.SpecialTeams, 'special teams');
                this.add(specialTeams);
                var other = new Playbook.Models.UnitType(Playbook.Editor.UnitTypes.Other, 'other');
                this.add(other);
            }
            UnitTypeCollection.prototype.getByUnitType = function (unitTypeValue) {
                return this.filterFirst(function (unitType) {
                    return unitType.unitType == unitTypeValue;
                });
            };
            UnitTypeCollection.prototype.getAssociatedPlaybooks = function () {
                var collection = new Playbook.Models.PlaybookModelCollection();
                this.forEach(function (unitType, index) {
                    if (unitType && unitType.associated &&
                        unitType.associated.playbooks &&
                        unitType.associated.playbooks.hasElements()) {
                        unitType.associated.playbooks.forEach(function (guid, i) {
                            var playbookModel = impakt.context.Playbook.playbooks.get(guid);
                            if (playbookModel) {
                                collection.add(playbookModel);
                            }
                        });
                    }
                });
                return collection;
            };
            UnitTypeCollection.prototype.toJson = function () {
                return _super.prototype.toJson.call(this);
            };
            // takes an unprocessed arry of playbooks from the server
            // and adds them into the collection and sub collections
            UnitTypeCollection.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.guid = json.guid || this.guid;
            };
            return UnitTypeCollection;
        })(Common.Models.ModifiableCollection);
        Models.UnitTypeCollection = UnitTypeCollection;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        // @todo treat Player as a FieldElementSet
        var Player = (function (_super) {
            __extends(Player, _super);
            function Player(context, placement, position, assignment) {
                _super.call(this, context);
                this.font = this.paper.getFont('Arial');
                this.placement = placement;
                this.position = position;
                this.assignment = assignment || new Playbook.Models.Assignment();
                this.assignment.positionIndex = this.position.index;
                // assign options
                this.guid = Common.Utilities.guid();
                this.radius = this.grid.getSize() / 2;
                this.color = 'grey';
                this.width = this.grid.getSize();
                this.height = this.grid.getSize();
                this.opacity = 0.2;
                this.selected = false;
                this.selectedColor = 'red';
                this.unselectedColor = 'black';
                this.selectedOpacity = 1;
                this._isCreatedNewFromAltDisabled = false;
                this._newFromAlt = null;
                this._isDraggingNewFromAlt = false;
                this.contextmenuTemplateUrl
                    = 'modules/playbook/editor/canvas/player/playbook-editor-canvas-player-contextmenu.tpl.html';
                // the set acts as a group for the other graphical elements
                this.box = new Models.FieldElement(this);
                this.icon = new Models.FieldElement(this);
                this.text = new Models.FieldElement(this);
                this.label = new Models.FieldElement(this);
                this.indexLabel = new Models.FieldElement(this);
                this.set = new Models.FieldElementSet(this);
                this.set.push(this);
            }
            Player.prototype.draw = function () {
                //TODO: all of these hard-coded integers are a problem
                this.clear();
                this.paper.remove(this.box.raphael);
                this.box.placement.coordinates.ax = this.placement.coordinates.ax - (this.width / 2);
                this.box.placement.coordinates.ay = this.placement.coordinates.ay - (this.width / 2);
                this.box.raphael = this.paper.rect(this.box.placement.coordinates.ax, this.box.placement.coordinates.ay, this.width, this.height, true).attr({
                    'stroke-width': 0
                });
                this.box.placement.coordinates.x = this.box.raphael.attr('x');
                this.box.placement.coordinates.y = this.box.raphael.attr('y');
                this.box.width = this.width;
                this.box.height = this.height;
                this.paper.remove(this.icon.raphael);
                this.icon.raphael = this.paper.circle(this.placement.coordinates.x, this.placement.coordinates.y, this.radius).attr({
                    fill: 'white',
                    'stroke': this.unselectedColor,
                    'stroke-width': 1,
                });
                this.icon.placement.coordinates.x = this.box.raphael.attr('x');
                this.icon.placement.coordinates.y = this.box.raphael.attr('y');
                this.icon.radius = this.radius;
                this.icon.placement.coordinates.ax = this.icon.placement.coordinates.x + this.radius;
                this.icon.placement.coordinates.ay = this.icon.placement.coordinates.y + this.radius;
                this.icon.width = this.radius * 2;
                this.icon.height = this.radius * 2;
                this.icon.hover(this.hoverIn, this.hoverOut, this);
                this.icon.drag(this.dragMove, this.dragStart, this.dragEnd, this, this, this // drag end context
                );
                this.icon.mousedown(this.mousedown, this);
                this.paper.remove(this.text.raphael);
                this.text.placement.coordinates.ax = this.placement.coordinates.ax;
                this.text.placement.coordinates.ay = this.placement.coordinates.ay + 20; // TODO
                this.text.raphael = this.paper.text(this.text.placement.coordinates.ax, this.text.placement.coordinates.ay, [this.placement.relative.rx, ', ', this.placement.relative.ry].join(''), true);
                this.text.raphael.node.setAttribute('class', 'no-highlight');
                this.paper.remove(this.label.raphael);
                this.label.placement.coordinates.ax = this.placement.coordinates.ax;
                this.label.placement.coordinates.ay = this.placement.coordinates.ay - ((this.height / 2) * 0.4);
                this.label.raphael = this.paper.text(this.label.placement.coordinates.ax, this.label.placement.coordinates.ay, this.position.label, true);
                this.label.raphael.node.setAttribute('class', 'no-highlight');
                // Index label - each player is indexed (0 - 10) via the personnel > position
                // assigned to the player; this index is used to correlate assignments with
                // personnel
                this.paper.remove(this.indexLabel.raphael);
                this.indexLabel.placement.coordinates.ax = this.placement.coordinates.ax;
                this.indexLabel.placement.coordinates.ay = this.placement.coordinates.ay + ((this.height / 2) * 0.4);
                this.indexLabel.raphael = this.paper.text(this.indexLabel.placement.coordinates.ax, this.indexLabel.placement.coordinates.ay, (this.position.index).toString(), true);
                this.indexLabel.raphael.node.setAttribute('class', 'no-highlight');
                this.set.push.apply(this.set, [
                    this.icon,
                    this.box,
                    this.label,
                    this.indexLabel,
                    this.text
                ]);
                this.set.click(this.click, this);
                this.text.hide();
                if (this.assignment) {
                    var route = this.assignment.routes.getOne();
                    // TODO: implement route switching
                    if (route) {
                        route.draw();
                    }
                }
                // console.log('player drawn');	
            };
            Player.prototype.clear = function () {
                this.paper.remove(this.box.raphael);
                this.paper.remove(this.icon.raphael);
                this.paper.remove(this.label.raphael);
                this.paper.remove(this.indexLabel.raphael);
                this.set.removeAll();
                this.assignment.clear();
            };
            Player.prototype.mousedown = function (e, self) {
                // TODO: enumerate e.which (Event.SHIFT_)
                if (e.which == 3) {
                    //console.log('right click');
                    self.canvas.invoke(Playbook.Editor.CanvasActions.PlayerContextmenu, 'open player context menu...', self);
                }
            };
            Player.prototype.hoverIn = function (e, self) {
                self.icon.setFillOpacity(0.5);
            };
            Player.prototype.hoverOut = function (e, self) {
                self.icon.setFillOpacity(1);
            };
            Player.prototype.click = function (e, self) {
                if (e.ctrlKey) {
                    e.preventDefault();
                    if (e.isDefaultPrevented()) {
                    }
                    else {
                        e.returnValue = false;
                    }
                }
                //console.log('player set', self.set);
                //console.log('player click+shift: ', e.shiftKey);
                //console.log('player click+ctrl: ', e.ctrlKey);
                //console.log('player click+alt: ', e.altKey);
                //console.log('player click+meta: ', e.metaKey);
                self.field.togglePlayerSelection(self);
                var toolMode = self.canvas.toolMode;
                switch (toolMode) {
                    case Playbook.Editor.ToolModes.Select:
                        //console.log('Select player');
                        break;
                    case Playbook.Editor.ToolModes.Assignment:
                        //console.log('Set player assignment');
                        break;
                }
                return e.returnValue;
            };
            Player.prototype.dragMove = function (dx, dy, posx, posy, e) {
                // (snapping) only adjust the positioning of the player
                // for every grid-unit worth of movement
                var snapDx = this.grid.snapPixel(dx);
                var snapDy = this.grid.snapPixel(dy);
                this.placement.coordinates.dx = snapDx;
                this.placement.coordinates.dy = snapDy;
                // do not allow dragging while in route mode
                if (this.canvas.toolMode == Playbook.Editor.ToolModes.Assignment) {
                    //console.log('drawing route', dx, dy, posx, posy);
                    if (!this.assignment) {
                        this.assignment = new Playbook.Models.Assignment();
                        this.assignment.positionIndex = this.position.index;
                    }
                    var route = this.assignment.routes.getOne();
                    // TODO: Implement route switching
                    if (!route) {
                        //console.log('creating route');
                        var newRoute = new Playbook.Models.Route(this, true);
                        this.assignment.routes.add(newRoute);
                        route = this.assignment.routes.get(newRoute.guid);
                    }
                    if (route.dragInitialized) {
                        var coords = new Playbook.Models.Coordinates(this.placement.coordinates.ax + snapDx, this.placement.coordinates.ay + snapDy);
                        route.initializeCurve(coords, e.shiftKey);
                    }
                    // prevent remaining logic from getting executed.
                    return;
                }
                else if (this.canvas.toolMode == Playbook.Editor.ToolModes.Select) {
                }
                // console.log(e.which);
                if (e.which == 82) {
                    // draw line from player
                    // 
                    return;
                }
                else if (!e.shiftKey && e.which != 3) {
                    var context = this._newFromAlt ? this._newFromAlt : this;
                    var grid = this.grid;
                    // alt-drag
                    if (e.altKey && !this._isCreatedNewFromAltDisabled) {
                        var newPlayer = this.field.addPlayer(this.placement, this.position, null);
                        context = this.field.players[newPlayer.guid];
                        this._newFromAlt = context;
                        this._isCreatedNewFromAltDisabled = true;
                        this._isDraggingNewFromAlt = true;
                    }
                    this.dragged = snapDx != 0 || snapDy != 0;
                    if (this.grid.isDivisible(dx) && this.grid.isDivisible(dy)) {
                    }
                    if (context.set) {
                        // apply the transform to the group
                        context.set.dragAll(snapDx, snapDy);
                    }
                    var coords = context.getCoordinates();
                    if (!context.placement)
                        throw new Error('Player dragMove(): placement is null or undefined');
                    // Update the placement to track for modification
                    context.placement.updateCoordinates(context.placement.coordinates.ax + snapDx, context.placement.coordinates.ay + snapDy);
                    if (context.text) {
                        context.text.raphael.attr({
                            text: [
                                context.placement.coordinates.rx,
                                ', ',
                                context.placement.coordinates.ry
                            ].join('')
                        });
                    }
                }
                else if (e.shiftKey) {
                }
                else if (e.which == 3) {
                }
            };
            Player.prototype.dragStart = function (x, y, e) {
                this.dragging = true;
                this.text.show();
                this.field.togglePlayerSelection(this);
                //this.set.setOriginalPositions();
                // console.log('start drag: ', this.ax, this.ay);
            };
            Player.prototype.dragEnd = function (e) {
                this.dragging = false;
                this._isCreatedNewFromAltDisabled = false;
                this._isDraggingNewFromAlt = true;
                this._newFromAlt = null;
                if (this.dragged) {
                    this.set.drop();
                    this.dragged = false;
                }
                if (this.assignment) {
                    // TODO: implement route switching
                    var route = this.assignment.routes.getOne();
                    if (route) {
                        if (route.dragInitialized) {
                            route.dragInitialized = false;
                        }
                        route.draw();
                        if (route.nodes &&
                            route.nodes.root &&
                            route.nodes.root.data.isCurveNode()) {
                        }
                    }
                }
                this.text.hide();
            };
            Player.prototype.select = function (isSelected) {
                this.selected = isSelected != null && isSelected != undefined ?
                    isSelected : !this.selected;
                var strokeColor = this.selected ?
                    this.selectedColor :
                    this.unselectedColor;
                this.icon.raphael.attr({
                    'stroke': strokeColor
                });
            };
            Player.prototype.clearRoute = function () {
            };
            Player.prototype.setRouteFromDefaults = function (routeTitle) {
            };
            Player.prototype.onkeypress = function () {
            };
            Player.prototype.getPositionRelativeToBall = function () {
                return this.placement.relative;
            };
            Player.prototype.getCoordinatesFromAbsolute = function () {
                return this.placement.coordinates;
            };
            Player.prototype.hasPlacement = function () {
                return this.placement != null;
            };
            Player.prototype.hasPosition = function () {
                return this.position != null;
            };
            return Player;
        })(Playbook.Models.FieldElement);
        Models.Player = Player;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        // @todo treat Player as a FieldElementSet
        var PreviewPlayer = (function (_super) {
            __extends(PreviewPlayer, _super);
            function PreviewPlayer(context, placement, position, assignment) {
                _super.call(this, context, placement, position, assignment);
                this.color = '#000000';
                this.opacity = 1;
                // the set acts as a group for the other graphical elements
                this.icon = new Models.FieldElement(this);
            }
            PreviewPlayer.prototype.draw = function () {
                this.paper.remove(this.icon.raphael);
                this.icon.raphael = this.paper.circle(this.placement.coordinates.x, this.placement.coordinates.y - 40, this.radius).attr({
                    'fill': this.color,
                    'stroke-width': 0,
                });
                this.icon.placement.coordinates.x = this.icon.raphael.attr('x');
                this.icon.placement.coordinates.y = this.icon.raphael.attr('y');
                this.icon.radius = this.radius;
                this.icon.placement.coordinates.ax = this.icon.placement.coordinates.x + this.radius;
                this.icon.placement.coordinates.ay = this.icon.placement.coordinates.y + this.radius;
                this.icon.width = this.radius * 2;
                this.icon.height = this.radius * 2;
                // if(this.assignment){
                // 	let route = this.assignment.routes.getOne();
                // 	// TODO: implement route switching
                // 	if (route) {
                // 		route.draw();
                // 	}	
                // }
            };
            return PreviewPlayer;
        })(Playbook.Models.Player);
        Models.PreviewPlayer = PreviewPlayer;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PlayerCollection = (function (_super) {
            __extends(PlayerCollection, _super);
            function PlayerCollection() {
                _super.call(this);
            }
            return PlayerCollection;
        })(Common.Models.ModifiableCollection);
        Models.PlayerCollection = PlayerCollection;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Position = (function (_super) {
            __extends(Position, _super);
            function Position(options) {
                _super.call(this, this);
                if (!options)
                    options = {};
                this.positionListValue = options.positionListValue || PositionList.Other;
                this.title = options.title || 'Untitled';
                this.label = options.label || '-';
                this.eligible = options.eligible || false;
                this.index = options.index >= 0 ? options.index : -1;
                this.unitType = options.unitType || Playbook.Editor.UnitTypes.Other;
            }
            Position.prototype.toJson = function () {
                return {
                    positionListValue: this.positionListValue,
                    title: this.title,
                    label: this.label,
                    eligible: this.eligible,
                    index: this.index,
                    unitType: this.unitType,
                    guid: this.guid
                };
            };
            Position.prototype.fromJson = function (json) {
                this.positionListValue = json.positionListValue;
                this.label = json.label;
                this.eligible = json.eligible;
                this.title = json.title;
                this.unitType = json.unitType;
                this.index = json.index;
                this.guid = json.guid;
            };
            return Position;
        })(Common.Models.Modifiable);
        Models.Position = Position;
        (function (PositionList) {
            PositionList[PositionList["BlankOffense"] = 0] = "BlankOffense";
            PositionList[PositionList["BlankDefense"] = 1] = "BlankDefense";
            PositionList[PositionList["BlankSpecialTeams"] = 2] = "BlankSpecialTeams";
            PositionList[PositionList["BlankOther"] = 3] = "BlankOther";
            PositionList[PositionList["Quarterback"] = 4] = "Quarterback";
            PositionList[PositionList["RunningBack"] = 5] = "RunningBack";
            PositionList[PositionList["FullBack"] = 6] = "FullBack";
            PositionList[PositionList["TightEnd"] = 7] = "TightEnd";
            PositionList[PositionList["Center"] = 8] = "Center";
            PositionList[PositionList["Guard"] = 9] = "Guard";
            PositionList[PositionList["Tackle"] = 10] = "Tackle";
            PositionList[PositionList["WideReceiver"] = 11] = "WideReceiver";
            PositionList[PositionList["SlotReceiver"] = 12] = "SlotReceiver";
            PositionList[PositionList["NoseGuard"] = 13] = "NoseGuard";
            PositionList[PositionList["DefensiveTackle"] = 14] = "DefensiveTackle";
            PositionList[PositionList["DefensiveGuard"] = 15] = "DefensiveGuard";
            PositionList[PositionList["DefensiveEnd"] = 16] = "DefensiveEnd";
            PositionList[PositionList["Linebacker"] = 17] = "Linebacker";
            PositionList[PositionList["Safety"] = 18] = "Safety";
            PositionList[PositionList["FreeSafety"] = 19] = "FreeSafety";
            PositionList[PositionList["StrongSafety"] = 20] = "StrongSafety";
            PositionList[PositionList["DefensiveBack"] = 21] = "DefensiveBack";
            PositionList[PositionList["Cornerback"] = 22] = "Cornerback";
            PositionList[PositionList["Kicker"] = 23] = "Kicker";
            PositionList[PositionList["Holder"] = 24] = "Holder";
            PositionList[PositionList["Punter"] = 25] = "Punter";
            PositionList[PositionList["LongSnapper"] = 26] = "LongSnapper";
            PositionList[PositionList["KickoffSpecialist"] = 27] = "KickoffSpecialist";
            PositionList[PositionList["PuntReturner"] = 28] = "PuntReturner";
            PositionList[PositionList["KickReturner"] = 29] = "KickReturner";
            PositionList[PositionList["Upback"] = 30] = "Upback";
            PositionList[PositionList["Gunner"] = 31] = "Gunner";
            PositionList[PositionList["Jammer"] = 32] = "Jammer";
            PositionList[PositionList["Other"] = 33] = "Other";
        })(Models.PositionList || (Models.PositionList = {}));
        var PositionList = Models.PositionList;
        var PositionDefault = (function () {
            function PositionDefault() {
                Playbook.Models.PositionDefault.defaults = {
                    blankOffense: {
                        positionListValue: Playbook.Models.PositionList.BlankOffense,
                        title: 'Blank',
                        label: '',
                        unitType: Playbook.Editor.UnitTypes.Offense,
                        eligible: false
                    },
                    blankDefense: {
                        positionListValue: Playbook.Models.PositionList.BlankDefense,
                        title: 'Blank',
                        label: '',
                        unitType: Playbook.Editor.UnitTypes.Defense,
                        eligible: false
                    },
                    blankSpecialTeams: {
                        positionListValue: Playbook.Models.PositionList.BlankSpecialTeams,
                        title: 'Blank',
                        label: '',
                        unitType: Playbook.Editor.UnitTypes.SpecialTeams,
                        eligible: false
                    },
                    blankOther: {
                        positionListValue: Playbook.Models.PositionList.BlankOther,
                        title: 'Blank',
                        label: '',
                        unitType: Playbook.Editor.UnitTypes.Other,
                        eligible: false
                    },
                    quarterback: {
                        positionListValue: Playbook.Models.PositionList.Quarterback,
                        title: 'Quarterback',
                        label: 'QB',
                        unitType: Playbook.Editor.UnitTypes.Offense,
                        eligible: false
                    },
                    runningBack: {
                        positionListValue: Playbook.Models.PositionList.RunningBack,
                        title: 'Running Back',
                        label: 'RB',
                        unitType: Playbook.Editor.UnitTypes.Offense,
                        eligible: true
                    },
                    fullBack: {
                        positionListValue: Playbook.Models.PositionList.FullBack,
                        title: 'Full Back',
                        label: 'FB',
                        unitType: Playbook.Editor.UnitTypes.Offense,
                        eligible: true
                    },
                    tightEnd: {
                        positionListValue: Playbook.Models.PositionList.TightEnd,
                        title: 'Tight End',
                        label: 'TE',
                        unitType: Playbook.Editor.UnitTypes.Offense,
                        eligible: true
                    },
                    center: {
                        positionListValue: Playbook.Models.PositionList.Center,
                        title: 'Center',
                        label: 'C',
                        unitType: Playbook.Editor.UnitTypes.Offense,
                        eligible: false
                    },
                    guard: {
                        positionListValue: Playbook.Models.PositionList.Guard,
                        title: 'Guard',
                        label: 'G',
                        unitType: Playbook.Editor.UnitTypes.Offense,
                        eligible: false
                    },
                    tackle: {
                        positionListValue: Playbook.Models.PositionList.Tackle,
                        title: 'Tackle',
                        label: 'T',
                        unitType: Playbook.Editor.UnitTypes.Offense,
                        eligible: false
                    },
                    wideReceiver: {
                        positionListValue: Playbook.Models.PositionList.WideReceiver,
                        title: 'Wide Receiver',
                        label: 'WR',
                        unitType: Playbook.Editor.UnitTypes.Offense,
                        eligible: true
                    },
                    slotReceiver: {
                        positionListValue: Playbook.Models.PositionList.SlotReceiver,
                        title: 'Slot Receiver',
                        label: 'SL',
                        unitType: Playbook.Editor.UnitTypes.Offense,
                        eligible: true
                    },
                    noseGuard: {
                        positionListValue: Playbook.Models.PositionList.NoseGuard,
                        title: 'Nose Guard',
                        label: 'N',
                        unitType: Playbook.Editor.UnitTypes.Defense,
                        eligible: false
                    },
                    defensiveGuard: {
                        positionListValue: Playbook.Models.PositionList.DefensiveGuard,
                        title: 'Guard',
                        label: 'G',
                        unitType: Playbook.Editor.UnitTypes.Defense,
                        eligible: false
                    },
                    defensiveTackle: {
                        positionListValue: Playbook.Models.PositionList.DefensiveTackle,
                        title: 'Tackle',
                        label: 'T',
                        unitType: Playbook.Editor.UnitTypes.Defense,
                        eligible: false
                    },
                    defensiveEnd: {
                        positionListValue: Playbook.Models.PositionList.DefensiveEnd,
                        title: 'Defensive End',
                        label: 'DE',
                        unitType: Playbook.Editor.UnitTypes.Defense,
                        eligible: false
                    },
                    linebacker: {
                        positionListValue: Playbook.Models.PositionList.Linebacker,
                        title: 'Linebacker',
                        label: 'LB',
                        unitType: Playbook.Editor.UnitTypes.Defense,
                        eligible: false
                    },
                    safety: {
                        positionListValue: Playbook.Models.PositionList.Safety,
                        title: 'Safety',
                        label: 'S',
                        unitType: Playbook.Editor.UnitTypes.Defense,
                        eligible: false
                    },
                    freeSafety: {
                        positionListValue: Playbook.Models.PositionList.FreeSafety,
                        title: 'Free Safety',
                        label: 'FS',
                        unitType: Playbook.Editor.UnitTypes.Defense,
                        eligible: false
                    },
                    strongSafety: {
                        positionListValue: Playbook.Models.PositionList.StrongSafety,
                        title: 'Strong Safety',
                        label: 'SS',
                        unitType: Playbook.Editor.UnitTypes.Defense,
                        eligible: false
                    },
                    defensiveBack: {
                        positionListValue: Playbook.Models.PositionList.DefensiveBack,
                        title: 'Defensive Back',
                        label: 'DB',
                        unitType: Playbook.Editor.UnitTypes.Defense,
                        eligible: false
                    },
                    cornerback: {
                        positionListValue: Playbook.Models.PositionList.Cornerback,
                        title: 'Cornerback',
                        label: 'CB',
                        unitType: Playbook.Editor.UnitTypes.Defense,
                        eligible: false
                    },
                    kicker: {
                        positionListValue: Playbook.Models.PositionList.Kicker,
                        title: 'Kicker',
                        label: 'K',
                        unitType: Playbook.Editor.UnitTypes.SpecialTeams,
                        eligible: false
                    },
                    holder: {
                        positionListValue: Playbook.Models.PositionList.Holder,
                        title: 'Holder',
                        label: 'H',
                        unitType: Playbook.Editor.UnitTypes.SpecialTeams,
                        eligible: false
                    },
                    punter: {
                        positionListValue: Playbook.Models.PositionList.Punter,
                        title: 'Punter',
                        label: 'P',
                        unitType: Playbook.Editor.UnitTypes.SpecialTeams,
                        eligible: false
                    },
                    longSnapper: {
                        positionListValue: Playbook.Models.PositionList.LongSnapper,
                        title: 'Long Snapper',
                        label: 'LS',
                        unitType: Playbook.Editor.UnitTypes.SpecialTeams,
                        eligible: false
                    },
                    kickoffSpecialist: {
                        positionListValue: Playbook.Models.PositionList.KickoffSpecialist,
                        title: 'Kickoff Specialist',
                        label: 'KS',
                        unitType: Playbook.Editor.UnitTypes.SpecialTeams,
                        eligible: false
                    },
                    puntReturner: {
                        positionListValue: Playbook.Models.PositionList.PuntReturner,
                        title: 'Punt Returner',
                        label: 'PR',
                        unitType: Playbook.Editor.UnitTypes.SpecialTeams,
                        eligible: true
                    },
                    kickReturner: {
                        positionListValue: Playbook.Models.PositionList.KickReturner,
                        title: 'Kick Returner',
                        label: 'KR',
                        unitType: Playbook.Editor.UnitTypes.SpecialTeams,
                        eligible: true
                    },
                    upback: {
                        positionListValue: Playbook.Models.PositionList.Upback,
                        title: 'Upback',
                        label: 'U',
                        unitType: Playbook.Editor.UnitTypes.SpecialTeams,
                        eligible: true
                    },
                    gunner: {
                        positionListValue: Playbook.Models.PositionList.Gunner,
                        title: 'Gunner',
                        label: 'G',
                        unitType: Playbook.Editor.UnitTypes.SpecialTeams,
                        eligible: true
                    },
                    jammer: {
                        positionListValue: Playbook.Models.PositionList.Jammer,
                        title: 'Jammer',
                        label: 'J',
                        unitType: Playbook.Editor.UnitTypes.SpecialTeams,
                        eligible: true
                    },
                    other: {
                        positionListValue: Playbook.Models.PositionList.Other,
                        title: 'Other',
                        label: '-',
                        unitType: Playbook.Editor.UnitTypes.Other,
                        eligible: false
                    }
                };
            }
            PositionDefault.prototype.getPosition = function (positionListValue) {
                var results = null;
                for (var positionKey in Playbook.Models.PositionDefault.defaults) {
                    if (Playbook.Models.PositionDefault.defaults[positionKey].positionListValue == positionListValue) {
                        var positionSeedData = Playbook.Models.PositionDefault.defaults[positionKey];
                        results = new Playbook.Models.Position(positionSeedData);
                    }
                }
                return results;
            };
            PositionDefault.prototype.switchPosition = function (fromPosition, toPositionEnum) {
                var newPosition = this.getPosition(toPositionEnum);
                newPosition.index = fromPosition.index;
                return newPosition;
            };
            PositionDefault.getBlank = function (type) {
                var collection = new Playbook.Models.PositionCollection();
                var positionSeedData = null;
                switch (type) {
                    case Playbook.Editor.UnitTypes.Offense:
                        positionSeedData = Playbook.Models.PositionDefault.defaults.blankOffense;
                        break;
                    case Playbook.Editor.UnitTypes.Defense:
                        positionSeedData = Playbook.Models.PositionDefault.defaults.blankDefense;
                        break;
                    case Playbook.Editor.UnitTypes.SpecialTeams:
                        positionSeedData = Playbook.Models.PositionDefault.defaults.blankSpecialTeams;
                        break;
                    case Playbook.Editor.UnitTypes.Other:
                        positionSeedData = Playbook.Models.PositionDefault.defaults.blankOther;
                        break;
                }
                if (!positionSeedData)
                    return null;
                for (var i = 0; i < 11; i++) {
                    var blank = new Playbook.Models.Position(positionSeedData);
                    // add an index for the position :]
                    blank.index = i;
                    collection.add(blank);
                }
                return collection;
            };
            PositionDefault.prototype.getByUnitType = function (type) {
                var results = null;
                switch (type) {
                    case Playbook.Editor.UnitTypes.Offense:
                        var offense = new Playbook.Models.PositionCollection();
                        offense.fromJson([
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.blankOffense),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.quarterback),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.runningBack),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.fullBack),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.tightEnd),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.center),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.guard),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.tackle),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.wideReceiver),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.slotReceiver)
                        ]);
                        results = offense;
                        break;
                    case Playbook.Editor.UnitTypes.Defense:
                        var defense = new Playbook.Models.PositionCollection();
                        defense.fromJson([
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.blankDefense),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.noseGuard),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.defensiveTackle),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.defensiveGuard),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.defensiveEnd),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.linebacker),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.safety),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.freeSafety),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.strongSafety),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.defensiveBack),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.cornerback)
                        ]);
                        results = defense;
                        break;
                    case Playbook.Editor.UnitTypes.SpecialTeams:
                        var specialTeams = new Playbook.Models.PositionCollection();
                        specialTeams.fromJson([
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.blankSpecialTeams),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.kicker),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.holder),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.punter),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.longSnapper),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.kickoffSpecialist),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.puntReturner),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.kickReturner),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.upback),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.gunner),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.jamme)
                        ]);
                        results = specialTeams;
                        break;
                    case Playbook.Editor.UnitTypes.Other:
                        var other = new Playbook.Models.PositionCollection();
                        other.fromJson([
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.blankOther),
                            new Playbook.Models.Position(Playbook.Models.PositionDefault.defaults.other)
                        ]);
                        results = other;
                        break;
                    default:
                        results = null;
                        break;
                }
                return results;
            };
            ;
            return PositionDefault;
        })();
        Models.PositionDefault = PositionDefault;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PositionCollection = (function (_super) {
            __extends(PositionCollection, _super);
            function PositionCollection() {
                _super.call(this);
                this.setDefault();
            }
            PositionCollection.prototype.listPositions = function () {
                var arr = [];
                this.forEach(function (position, index) {
                    arr.push(position.title);
                });
                return arr;
            };
            PositionCollection.prototype.toJson = function () {
                return _super.prototype.toJson.call(this);
            };
            PositionCollection.prototype.fromJson = function (positions) {
                if (!positions)
                    return;
                for (var i = 0; i < positions.length; i++) {
                    var rawPosition = positions[i];
                    var positionModel = new Playbook.Models.Position();
                    positionModel.fromJson(rawPosition);
                    this.add(positionModel);
                }
            };
            PositionCollection.prototype.setDefault = function () {
            };
            return PositionCollection;
        })(Common.Models.ModifiableCollection);
        Models.PositionCollection = PositionCollection;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Route = (function (_super) {
            __extends(Route, _super);
            function Route(player, dragInitialized) {
                this.player = player;
                this.paper = this.player.paper;
                this.grid = this.paper.grid;
                _super.call(this, this);
                if (player) {
                    this.nodes = new Common.Models.ModifiableLinkedList();
                    // add root node
                    var root = this.addNode(this.player.placement.coordinates, Playbook.Models.RouteNodeType.Root, false);
                    root.data.disabled = true;
                }
                this.dragInitialized = dragInitialized === true;
                this.path = new Playbook.Models.FieldElement(this);
                this.color = 'black';
            }
            Route.prototype.setContext = function (player) {
                if (player) {
                    this.player = player;
                    this.grid = this.player.grid;
                    this.field = this.player.field;
                    this.paper = this.player.paper;
                    var self_1 = this;
                    this.nodes.forEach(function (node, index) {
                        node.data.setContext(self_1);
                        // Pushing this onto the fieldElementSet maintained
                        // by 'self.context', which is a Player. This fieldElementSet
                        // is a Raphael set, which allows bulk transformations.
                        if (!self_1.player.set.getByGuid(node.data.guid)) {
                            self_1.player.set.push(node.data);
                        }
                    });
                    this.draw();
                }
            };
            Route.prototype.fromJson = function (json) {
                this.dragInitialized = json.dragInitialized;
                this.guid = json.guid;
                // initialize route nodes
                if (json.nodes) {
                    for (var i = 0; i < json.nodes.length; i++) {
                        var rawNode = json.nodes[i];
                        var relativeCoordinates = new Playbook.Models.RelativeCoordinates(rawNode.placement.coordinates.x, rawNode.placement.coordinates.y, this.player);
                        var routeNodeModel = new Playbook.Models.RouteNode(this, relativeCoordinates, rawNode.type);
                        routeNodeModel.fromJson(rawNode);
                        this.addNode(routeNodeModel.getCoordinates(), routeNodeModel.type, false);
                    }
                }
            };
            Route.prototype.toJson = function () {
                return {
                    nodes: this.nodes.toJson(),
                    guid: this.guid,
                    dragInitialized: this.dragInitialized
                };
            };
            Route.prototype.erase = function () {
                this.paper.remove(this.path.raphael);
                this.nodes.forEach(function (node, index) {
                    node.data.erase();
                });
            };
            Route.prototype.draw = function () {
                if (!this.player) {
                    throw new Error('Route player is not set');
                }
                var pathStr = this.getMixedStringFromNodes(this.nodes.toArray());
                console.log(pathStr);
                this.paper.remove(this.path.raphael);
                this.path.raphael = this.paper.path(pathStr).attr({
                    'stroke': this.color,
                    'stroke-width': 2
                });
                this.path.raphael.node.setAttribute('class', 'painted-fill');
                this.player.set.exclude(this.path);
                this.player.set.push(this.path);
            };
            Route.prototype.clear = function () {
                this.paper.remove(this.path.raphael);
                // this.nodes.forEach(function(node, index) {
                // 	if(node && node.data)
                // 		node.data.clear();
                // });
            };
            Route.prototype.getDataArray = function () {
                return this.nodes.toDataArray();
            };
            Route.prototype.drawCurve = function (node) {
                if (!this.player) {
                    throw new Error('Route player is not set');
                }
                if (node) {
                }
                // update path
                var dataArray = this.getDataArray();
                var pathStr = this.paper.getCurveStringFromNodes(true, dataArray);
                this.paper.remove(this.path.raphael);
                this.path.raphael = this.paper.path(pathStr).attr({
                    'stroke': this.color,
                    'stroke-width': 2
                });
                this.path.raphael.node.setAttribute('class', 'painted-fill');
                this.player.set.exclude(this.path);
                this.player.set.push(this.path);
            };
            Route.prototype.drawLine = function () {
                if (!this.player) {
                    throw new Error('Route player is not set');
                }
                var dataArray = this.getDataArray();
                var pathStr = this.paper.getPathStringFromNodes(true, dataArray);
                this.paper.remove(this.path.raphael);
                this.path.raphael = this.paper.path(pathStr).attr({
                    'stroke': this.color,
                    'stroke-width': 2
                });
                this.path.raphael.node.setAttribute('class', 'painted-fill');
                this.player.set.exclude(this.path);
                this.player.set.push(this.path);
            };
            Route.prototype.initializeCurve = function (coords, flip) {
                // if(coords.x != this.player.x && coords.y != this.player.y) {
                // 	console.log('draw curve');
                // }
                // pre-condition: we do not have < 1 nodes, since we
                // always create a node when we initialize the object.
                // TODO: if there are more than 3 nodes?
                if (this.nodes.size() == 0 || this.nodes.size() > 3) {
                    // ignore this command if assignment node list is empty
                    // or if there are more than 3 nodes (TODO)
                    return;
                }
                var control, end;
                if (this.nodes.size() == 1) {
                    if (this.nodes.root && this.nodes.root.data) {
                        this.nodes.root.data.type = Playbook.Models.RouteNodeType.CurveStart;
                    }
                    else {
                        throw new Error('could not initialize curve; root is invalid');
                    }
                    // we only have a root node (start node);
                    // add control node and end node;
                    // initially, control and end nodes will
                    // share the same coords
                    control = this.addNode(new Playbook.Models.Coordinates(this.nodes.root.data.coordinates.x, this.nodes.root.data.coordinates.y), Playbook.Models.RouteNodeType.CurveControl, false); // false: do not render
                    end = this.addNode(this.grid.getCoordinatesFromAbsolute(coords.x, coords.y), Playbook.Models.RouteNodeType.CurveEnd, false); // false: do not render
                }
                if (!this.nodes || !this.nodes.root || !this.nodes.root.data)
                    throw new Error('failed to get control and end nodes');
                // get control and end nodes
                control = this.nodes.getIndex(1);
                console.log('root: ', flip, this.nodes.root.data, this.nodes.root.data.placement.coordinates.ax, this.nodes.root.data.placement.coordinates.ay);
                if (flip) {
                    control.data.placement.coordinates.ax = coords.x;
                    control.data.placement.coordinates.ay = this.nodes.root.data.placement.coordinates.ay;
                }
                else {
                    control.data.placement.coordinates.ax = this.nodes.root.data.placement.coordinates.ax;
                    control.data.placement.coordinates.ay = coords.y;
                }
                control.data.ox = control.data.placement.coordinates.ax;
                control.data.oy = control.data.placement.coordinates.ay;
                var controlGridCoords = this.grid.getCoordinatesFromAbsolute(control.data.placement.coordinates.ax, control.data.placement.coordinates.ay);
                control.data.placement.coordinates.x = controlGridCoords.x;
                control.data.placement.coordinates.y = controlGridCoords.y;
                if (control.data.raphael) {
                    control.data.raphael.attr({
                        cx: control.data.placement.coordinates.ax,
                        cy: control.data.placement.coordinates.ay
                    });
                }
                end = this.nodes.getIndex(2);
                end.data.placement.coordinates.ax = coords.x;
                end.data.placement.coordinates.ay = coords.y;
                end.data.placement.coordinates.ox = end.data.ax;
                end.data.placement.coordinates.oy = end.data.ay;
                var endGridCoords = this.grid.getCoordinatesFromAbsolute(end.data.placement.coordinates.ax, end.data.placement.coordinates.ay);
                end.data.placement.coordinates.x = endGridCoords.x;
                end.data.placement.coordinates.y = endGridCoords.y;
                if (end.data.raphael) {
                    end.data.raphael.attr({
                        cx: end.data.placement.coordinates.ax,
                        cy: end.data.placement.coordinates.ay
                    });
                }
                // control node follows y value of cursor
                // update control node
                //control.node.setCoordinate(new Playbook.Editor.Coordinate(0, coords.y));
                // end node follows x,y value of cursor
                // update end node
                this.drawCurve(control.data);
            };
            Route.prototype.addNode = function (coords, type, render) {
                throw new Error('Route addNode(): implement relative coordinates for route nodes');
                // let routeNodeType = type || (
                // 	this.nodes.hasElements() ? 
                // 	Playbook.Models.RouteNodeType.Normal : 
                // 	Playbook.Models.RouteNodeType.Root
                // );
                // let routeNode = new Playbook.Models.RouteNode(
                // 	this, null, routeNodeType
                // );
                // // let self = this;
                // // routeNode.onModified(function(data: any) {
                // // 	self.generateChecksum();
                // // });
                // let node = new Common.Models.LinkedListNode(
                // 	routeNode,
                // 	null
                // );
                // this.nodes.add(node);
                // this.player.set.push(node.data);
                // if (render !== false) {
                // 	node.data.draw();
                // 	//this.player.set.push(node.data);
                // 	this.draw();
                // }
                // return node;
            };
            Route.prototype.getLastNode = function () {
                //return this.nodes.getLast<Playbook.Models.FieldElement>();
                return null;
            };
            Route.prototype.getMixedStringFromNodes = function (nodeArray) {
                if (!nodeArray || nodeArray.length == 0) {
                    throw new Error('Cannot get mixed path string on empty node array');
                }
                // must always have at least 2 nodes
                if (nodeArray.length == 1) {
                    return '';
                }
                var str = '';
                for (var i = 0; i < nodeArray.length; i++) {
                    var node = nodeArray[i];
                    if (!node.next) {
                        // just in case
                        break;
                    }
                    // must always have at least 2 nodes
                    var type = node.data.type;
                    var nextType = node.next.data.type;
                    if (type == Playbook.Models.RouteNodeType.CurveStart) {
                        if (nextType != Playbook.Models.RouteNodeType.CurveControl) {
                            throw new Error('A curve start node must be followed by a curve control node');
                        }
                        // Good: next node is curve control
                        // check for 2 subsequent nodes
                        if (!node.next.next) {
                            throw new Error('a curve must have a control and end node');
                        }
                        var endType = node.next.next.data.type;
                        if (endType != Playbook.Models.RouteNodeType.CurveEnd) {
                            throw new Error('A curve must end with a curve end node');
                        }
                        str += this.paper.getCurveStringFromNodes(true, [
                            node.data,
                            node.next.data,
                            node.next.next.data // next (end)
                        ]);
                        i++;
                    }
                    else if (type == Playbook.Models.RouteNodeType.CurveEnd) {
                        if (i == 0) {
                            throw new Error('curveEnd node cannot be the first node');
                        }
                        if (nextType == Playbook.Models.RouteNodeType.CurveControl) {
                            // check for 2 subsequent nodes
                            if (!node.next.next) {
                                throw new Error('a curve must have a control and end node');
                            }
                            var endType = node.next.next.data.type;
                            if (endType != Playbook.Models.RouteNodeType.CurveEnd) {
                                throw new Error('A curve must end with a curve end node');
                            }
                            str += this.paper.getCurveStringFromNodes(false, [
                                node.data,
                                node.next.data,
                                node.next.next.data // next (end)
                            ]);
                            i++;
                        }
                        else {
                            // next node is normal node
                            str += this.paper.getPathStringFromNodes(false, [
                                node.data,
                                node.next.data
                            ]);
                        }
                    }
                    else {
                        // assuming we are drawing a straight path
                        str += this.paper.getPathStringFromNodes(i == 0, [
                            node.data,
                            node.next.data
                        ]);
                    }
                }
                return str;
            };
            Route.prototype.moveNodesByDelta = function (dx, dy) {
                this.nodes.forEach(function (node, index) {
                    if (node && node.data) {
                        node.data.moveByDelta(dx, dy);
                    }
                });
            };
            return Route;
        })(Common.Models.Modifiable);
        Models.Route = Route;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
var Playbook;
(function (Playbook) {
    var Editor;
    (function (Editor) {
        (function (RouteTypes) {
            RouteTypes[RouteTypes["None"] = 0] = "None";
            RouteTypes[RouteTypes["Block"] = 1] = "Block";
            RouteTypes[RouteTypes["Scan"] = 2] = "Scan";
            RouteTypes[RouteTypes["Run"] = 3] = "Run";
            RouteTypes[RouteTypes["Route"] = 4] = "Route";
            RouteTypes[RouteTypes["Cover"] = 5] = "Cover";
            RouteTypes[RouteTypes["Zone"] = 6] = "Zone";
            RouteTypes[RouteTypes["Spy"] = 7] = "Spy";
            RouteTypes[RouteTypes["Option"] = 8] = "Option";
            RouteTypes[RouteTypes["HandOff"] = 9] = "HandOff";
            RouteTypes[RouteTypes["Pitch"] = 10] = "Pitch";
        })(Editor.RouteTypes || (Editor.RouteTypes = {}));
        var RouteTypes = Editor.RouteTypes;
    })(Editor = Playbook.Editor || (Playbook.Editor = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var RouteCollection = (function (_super) {
            __extends(RouteCollection, _super);
            function RouteCollection() {
                _super.call(this);
            }
            RouteCollection.prototype.toJson = function () {
                return {
                    guid: this.guid,
                    rotues: _super.prototype.toJson.call(this)
                };
            };
            RouteCollection.prototype.fromJson = function (json) {
                var routes = json.routes || [];
                for (var i = 0; i < routes.length; i++) {
                    var rawRoute = routes[i];
                    var routeModel = new Playbook.Models.Route(null);
                    routeModel.fromJson(rawRoute);
                    this.add(routeModel);
                }
            };
            return RouteCollection;
        })(Common.Models.ModifiableCollection);
        Models.RouteCollection = RouteCollection;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
/// <reference path='../field/FieldElement.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        (function (RouteNodeType) {
            RouteNodeType[RouteNodeType["None"] = 0] = "None";
            RouteNodeType[RouteNodeType["Normal"] = 1] = "Normal";
            RouteNodeType[RouteNodeType["Root"] = 2] = "Root";
            RouteNodeType[RouteNodeType["CurveStart"] = 3] = "CurveStart";
            RouteNodeType[RouteNodeType["CurveControl"] = 4] = "CurveControl";
            RouteNodeType[RouteNodeType["CurveEnd"] = 5] = "CurveEnd";
            RouteNodeType[RouteNodeType["End"] = 6] = "End";
        })(Models.RouteNodeType || (Models.RouteNodeType = {}));
        var RouteNodeType = Models.RouteNodeType;
        (function (RouteNodeActions) {
            RouteNodeActions[RouteNodeActions["None"] = 0] = "None";
            RouteNodeActions[RouteNodeActions["Block"] = 1] = "Block";
            RouteNodeActions[RouteNodeActions["Delay"] = 2] = "Delay";
            RouteNodeActions[RouteNodeActions["Continue"] = 3] = "Continue";
            RouteNodeActions[RouteNodeActions["Juke"] = 4] = "Juke";
            RouteNodeActions[RouteNodeActions["ZigZag"] = 5] = "ZigZag";
        })(Models.RouteNodeActions || (Models.RouteNodeActions = {}));
        var RouteNodeActions = Models.RouteNodeActions;
        var RouteNode = (function (_super) {
            __extends(RouteNode, _super);
            function RouteNode(context, relativeCoordinates, type) {
                _super.call(this, context);
                this.player = context.player;
                if (relativeCoordinates) {
                    this.placement = new Playbook.Models.Placement(relativeCoordinates.rx, relativeCoordinates.ry, context.player);
                    if (this.grid) {
                        this.radius = this.grid.getSize() / 4;
                        this.width = this.radius * 2;
                        this.height = this.radius * 2;
                    }
                }
                // set by default to false if not explicitly set already
                if (this.disabled == undefined || this.disabled == null)
                    this.disabled = false;
                if (this.selected == undefined || this.selected == null)
                    this.selected = false;
                this.node = new Common.Models.LinkedListNode(this, null);
                this.type = type;
                this.action = Playbook.Models.RouteNodeActions.None;
                this.actionable = !(this.type == Playbook.Models.RouteNodeType.CurveControl);
                this.actionGraphic = new Playbook.Models.FieldElement(this);
                this.opacity = 0;
                // temporary
                this.controlPath = new Playbook.Models.FieldElement(this);
                // TODO
                this.contextmenuTemplateUrl = 'modules/playbook/contextmenus/routeNode/playbook-contextmenus-routeNode.tpl.html';
            }
            RouteNode.prototype.setContext = function (context) {
                this.context = context;
                this.field = context.field;
                this.grid = this.context.grid;
                this.paper = this.context.paper;
                this.placement.refresh();
                this.radius = this.grid.getSize() / 4;
                this.width = this.radius * 2;
                this.height = this.radius * 2;
                this.draw();
            };
            ;
            RouteNode.prototype.fromJson = function (json) {
                this.action = json.action;
                this.actionable = json.actionable;
                this.contextmenuTemplateUrl = json.contextmenuTemplateUrl;
                this.controlList = json.controlList;
                this.disabled = json.disabled;
                this.guid = json.guid;
                this.height = json.height;
                this.opacity = json.opacity;
                this.radius = json.radius;
                this.selected = json.selected;
                this.type = json.type;
                this.width = json.width;
                this.placement.fromJson(json.placement);
                // route node has been modified
                this.setModified();
            };
            ;
            RouteNode.prototype.toJson = function () {
                var inherited = _super.prototype.toJson.call(this);
                var self = {
                    type: this.type,
                    action: this.action,
                    disabled: this.disabled,
                    selected: this.selected,
                    controlList: null,
                    actionable: this.actionable,
                    opacity: this.opacity
                };
                return $.extend(inherited, self);
            };
            ;
            RouteNode.prototype.getCoordinates = function () {
                return new Playbook.Models.Coordinates(this.placement.coordinates.x, this.placement.coordinates.y);
            };
            ;
            RouteNode.prototype.erase = function () {
                this.paper.remove(this.raphael);
                this.paper.remove(this.actionGraphic.raphael);
            };
            ;
            RouteNode.prototype.draw = function () {
                console.log('draw node');
                this.clear();
                this.raphael = this.paper.circle(this.placement.coordinates.x, this.placement.coordinates.y, this.radius).attr({
                    'fill': 'grey',
                    'opacity': this.opacity
                });
                this.raphael.node.setAttribute('class', 'grab');
                _super.prototype.click.call(this, this.click, this);
                this.drag(this.dragMove, this.dragStart, this.dragEnd, this, this, this // drag end context
                );
                this.hover(this.hoverIn, this.hoverOut, this);
                this.contextmenu(this.contextmenuHandler, this);
                if (this.type == Playbook.Models.RouteNodeType.CurveControl) {
                }
            };
            ;
            RouteNode.prototype.clear = function () {
                this.paper.remove(this.raphael);
            };
            ;
            RouteNode.prototype.drawAction = function () {
                console.log('drawing action');
                switch (this.action) {
                    case Playbook.Models.RouteNodeActions.None:
                        console.log('removing node action graphic');
                        this.paper.remove(this.actionGraphic.raphael);
                        this.actionGraphic.raphael = null;
                        break;
                    case Playbook.Models.RouteNodeActions.Block:
                        console.log('drawing block action');
                        this.paper.remove(this.actionGraphic.raphael);
                        var theta = this.paper.theta(this.node.prev.data.placement.coordinates.ax, this.node.prev.data.placement.coordinates.ay, this.placement.coordinates.ax, this.placement.coordinates.ay);
                        var thetaDegrees = this.paper.toDegrees(theta);
                        console.log('theta: ', theta, thetaDegrees);
                        this.actionGraphic.placement.coordinates.x = this.placement.coordinates.x - 0.5;
                        this.actionGraphic.placement.coordinates.y = this.placement.coordinates.y;
                        this.actionGraphic.width = this.width * 2;
                        this.actionGraphic.height = this.height * 2;
                        this.actionGraphic.placement.coordinates.ax = this.placement.coordinates.ax - this.width;
                        this.actionGraphic.placement.coordinates.ay = this.placement.coordinates.ay;
                        var pathStr = this.paper.getPathString(true, [
                            this.actionGraphic.placement.coordinates.ax,
                            this.actionGraphic.placement.coordinates.ay,
                            this.actionGraphic.placement.coordinates.ax + (this.width * 2),
                            this.actionGraphic.placement.coordinates.ay
                        ]);
                        this.actionGraphic.raphael = this.paper.path(pathStr).attr({
                            'stroke': 'blue',
                            'stroke-width': 2
                        });
                        this.actionGraphic.raphael.node.setAttribute('class', 'painted-fill');
                        this.actionGraphic.raphael.rotate((90 - thetaDegrees));
                        break;
                    case Playbook.Models.RouteNodeActions.Delay:
                        console.log('drawing block action');
                        this.paper.remove(this.actionGraphic.raphael);
                        this.actionGraphic.placement.coordinates.x = this.placement.coordinates.x - 0.5;
                        this.actionGraphic.placement.coordinates.y = this.placement.coordinates.y - 0.5;
                        this.actionGraphic.width = this.width * 2;
                        this.actionGraphic.height = this.height * 2;
                        this.actionGraphic.raphael = this.paper.rect(this.actionGraphic.placement.coordinates.x, this.actionGraphic.placement.coordinates.y, this.actionGraphic.width, this.actionGraphic.height).attr({
                            'stroke': 'orange',
                            'stroke-width': 1
                        });
                        this.actionGraphic.raphael.node.setAttribute('class', 'painted-fill');
                        break;
                }
            };
            ;
            RouteNode.prototype.contextmenuHandler = function (e, self) {
                console.log('route node contextmenu');
                self.paper.canvas.invoke(Playbook.Editor.CanvasActions.RouteNodeContextmenu, 'open route node context menu...', self);
            };
            ;
            RouteNode.prototype.hoverIn = function (e, self) {
                if (!this.disabled && !this.selected) {
                    self.toggleOpacity();
                    self.raphael.attr({
                        'opacity': self.opacity
                    });
                }
            };
            ;
            RouteNode.prototype.hoverOut = function (e, self) {
                if (!this.disabled && !this.selected) {
                    self.toggleOpacity();
                    self.raphael.attr({
                        'opacity': self.opacity
                    });
                }
            };
            ;
            RouteNode.prototype.drawControlPaths = function () {
                var start, control, end;
                if (this.type == Playbook.Models.RouteNodeType.CurveControl) {
                    if (!this.node.next || !this.node.prev) {
                        console.log('control does not have next and prev nodes');
                        return null;
                    }
                    start = this.node.prev.data;
                    control = this;
                    end = this.node.next.data;
                }
                else if (this.type == Playbook.Models.RouteNodeType.CurveEnd) {
                    if (!this.node.prev || !this.node.prev.prev) {
                        console.log(['end node does not have previous control or previous',
                            'curve start nodes'].join(''));
                        return null;
                    }
                    start = this.node.prev.prev.data;
                    control = this.node.prev.data;
                    end = this;
                }
                else if (this.type == Playbook.Models.RouteNodeType.CurveStart) {
                    if (!this.node.next || !this.node.next.next) {
                        console.log(['curve start node does not have subsequent',
                            'control and end nodes'].join(''));
                        return null;
                    }
                    start = this;
                    control = this.node.next.data;
                    end = this.node.next.next.data;
                }
                var pathStr = this.paper.getPathStringFromNodes(true, [start, control, end]);
                console.log(pathStr);
                start.paper.remove(start.controlPath.raphael);
                start.controlPath.raphael = start.paper.path(pathStr).attr({
                    'stroke': 'grey',
                    'stroke-width': 1,
                    'opacity': 0.2
                });
                // this is referring to the player.
                this.player.set.exclude(start.controlPath);
                this.player.set.push(start.controlPath);
            };
            ;
            RouteNode.prototype.click = function (e, self) {
                console.log('route node:', self);
                self.select();
                self.toggleOpacity();
                self.raphael.attr({ 'opacity': self.opacity });
            };
            ;
            RouteNode.prototype.dragMove = function (dx, dy, posx, posy, e) {
                if (this.disabled) {
                    return;
                }
                // (snapping) only adjust the positioning of the player
                // for every grid-unit worth of movement
                var snapDx = this.grid.snapPixel(dx);
                var snapDy = this.grid.snapPixel(dy);
                this.moveByDelta(snapDx, snapDy);
                var gridCoords = this.grid.getCoordinatesFromAbsolute(this.placement.coordinates.ax, this.placement.coordinates.ay);
                this.placement.coordinates.x = gridCoords.x;
                this.placement.coordinates.y = gridCoords.y;
                this.raphael.transform([
                    't', this.placement.coordinates.dx, ', ',
                    this.placement.coordinates.dy
                ].join(''));
                if (this.actionGraphic.raphael) {
                    this.actionGraphic.placement.coordinates.dx = snapDx - 0.5;
                    this.actionGraphic.placement.coordinates.dy = snapDy - 0.5;
                    this.actionGraphic.placement.coordinates.ax = this.placement.coordinates.ox + this.placement.coordinates.dx - 0.5;
                    this.actionGraphic.placement.coordinates.ay = this.placement.coordinates.oy + this.placement.coordinates.dy - 0.5;
                    this.actionGraphic.placement.coordinates.x = gridCoords.x - 0.5;
                    this.actionGraphic.placement.coordinates.y = gridCoords.y - 0.5;
                    this.actionGraphic.raphael.transform([
                        't', this.actionGraphic.placement.coordinates.dx, ', ',
                        this.actionGraphic.placement.coordinates.dy
                    ].join(''));
                    var theta = this.paper.theta(this.node.prev.data.placement.coordinates.ax, this.node.prev.data.placement.coordinates.ay, this.placement.coordinates.ax, this.placement.coordinates.ay);
                    var thetaDegrees = this.paper.toDegrees(theta);
                    console.log('rotating action', theta, thetaDegrees);
                    this.actionGraphic.raphael.rotate((90 - thetaDegrees));
                }
                // redraw the path
                if (this.isCurveNode()) {
                    console.log('dragging control:', this.type);
                }
                this.context.draw();
            };
            ;
            RouteNode.prototype.dragStart = function (x, y, e) {
                console.log('dragStart() not implemented');
            };
            ;
            RouteNode.prototype.dragEnd = function (e) {
                this.raphael.transform(['t', 0, ', ', 0].join(''));
                this.placement.coordinates.ox = this.placement.coordinates.ax;
                this.placement.coordinates.oy = this.placement.coordinates.ay;
                this.placement.coordinates.dx = 0;
                this.placement.coordinates.dy = 0;
                this.raphael.attr({
                    cx: this.placement.coordinates.ax,
                    cy: this.placement.coordinates.ay
                });
                if (this.actionGraphic.raphael) {
                    this.actionGraphic.raphael.transform(['t', 0, ', ', 0].join(''));
                    this.actionGraphic.placement.coordinates.ox = this.actionGraphic.placement.coordinates.ax;
                    this.actionGraphic.placement.coordinates.oy = this.actionGraphic.placement.coordinates.ay;
                    this.actionGraphic.placement.coordinates.dx = 0;
                    this.actionGraphic.placement.coordinates.dy = 0;
                    // this.actionGraphic.raphael.attr({
                    // 	x: this.actionGraphic.ax - (this.actionGraphic.width / 2),
                    // 	y: this.actionGraphic.ay - (this.actionGraphic.height / 2)
                    // });
                    this.drawAction();
                }
                // route node has been modified
                this.setModified();
            };
            ;
            RouteNode.prototype.moveByDelta = function (dx, dy) {
                this.placement.moveByDelta(dx, dy);
                // route node has been modified
                this.setModified();
            };
            ;
            RouteNode.prototype.isCurveNode = function () {
                return this.type == Playbook.Models.RouteNodeType.CurveControl ||
                    this.type == Playbook.Models.RouteNodeType.CurveEnd ||
                    this.type == Playbook.Models.RouteNodeType.CurveStart;
            };
            ;
            RouteNode.prototype.setAction = function (action) {
                this.action = action;
                console.log('updating action', this.action);
                this.drawAction();
                // route node has been modified
                this.setModified();
            };
            ;
            RouteNode.prototype.toggleSelect = function () {
                this.selected = !this.selected;
            };
            ;
            RouteNode.prototype.select = function () {
                this.selected = true;
            };
            ;
            RouteNode.prototype.deselect = function () {
                this.selected = false;
            };
            ;
            RouteNode.prototype.toggleOpacity = function () {
                this.opacity = this.opacity == 1 ? 0 : 1;
            };
            ;
            return RouteNode;
        })(Playbook.Models.FieldElement);
        Models.RouteNode = RouteNode;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Tab = (function (_super) {
            __extends(Tab, _super);
            function Tab(playPrimary, playOpponent) {
                _super.call(this);
                this.title = 'Untitled';
                this.active = true;
                this.playPrimary = playPrimary;
                this.key = this.playPrimary.key;
                this.unitType = this.playPrimary.unitType;
                this.title = this.playPrimary.name;
                this._closeCallbacks = [function () {
                        console.log('tab closed', this.guid);
                    }];
            }
            Tab.prototype.onclose = function (callback) {
                this._closeCallbacks.push(callback);
            };
            Tab.prototype.close = function () {
                for (var i = 0; i < this._closeCallbacks.length; i++) {
                    this._closeCallbacks[i]();
                }
            };
            return Tab;
        })(Common.Models.Storable);
        Models.Tab = Tab;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var TabCollection = (function (_super) {
            __extends(TabCollection, _super);
            function TabCollection() {
                _super.call(this);
            }
            TabCollection.prototype.getByPlayGuid = function (guid) {
                return this.filterFirst(function (tab, index) {
                    return tab.play.guid == guid;
                });
            };
            return TabCollection;
        })(Common.Models.Collection);
        Models.TabCollection = TabCollection;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../playbook.ts' />
/// <reference path='../../../common/models/models.ts' />
/// <reference path='../interfaces/interfaces.ts' />
/// <reference path='./assignment/Assignment.ts' />
/// <reference path='./assignment/AssignmentCollection.ts' />
/// <reference path='./field/FieldElement.ts' />
/// <reference path='./field/FieldElementSet.ts' />
/// <reference path='./field/Ball.ts' />
/// <reference path='./field/Coordinates.ts' />
/// <reference path='./field/Endzone.ts' />
/// <reference path='./field/Field.ts' />
/// <reference path='./field/PreviewField.ts' />
/// <reference path='./field/Grid.ts' />
/// <reference path='./field/GridSquare.ts' />
/// <reference path='./field/Ground.ts' />
/// <reference path='./field/Hashmark.ts' />
/// <reference path='./field/LineOfScrimmage.ts' />
/// <reference path='./field/Listener.ts' />
/// <reference path='./field/RelativeCoordinates.ts' />
/// <reference path='./field/Sideline.ts' />
/// <reference path='./field/Utilities.ts' />
/// <reference path='./canvas/Canvas.ts' />
/// <reference path='./canvas/CanvasListener.ts' />
/// <reference path='./canvas/PreviewCanvas.ts' />
/// <reference path='./paper/Paper.ts' />
/// <reference path='./paper/FullPaper.ts' />
/// <reference path='./paper/PreviewPaper.ts' />
/// <reference path='./formation/Formation.ts' />
/// <reference path='./formation/FormationCollection.ts' />
/// <reference path='./personnel/Personnel.ts' />
/// <reference path='./personnel/PersonnelCollection.ts' />
/// <reference path='./placement/Placement.ts' />
/// <reference path='./placement/PlacementCollection.ts' />
/// <reference path='./play/Play.ts' />
/// <reference path='./play/PlayPrimary.ts' />
/// <reference path='./play/PlayOpponent.ts' />
/// <reference path='./play/PlayCollection.ts' />
/// <reference path='./playbook/PlaybookModel.ts' />
/// <reference path='./playbook/PlaybookModelCollection.ts' />
/// <reference path='./playbook/UnitType.ts' />
/// <reference path='./playbook/UnitTypeCollection.ts' />
/// <reference path='./player/Player.ts' />
/// <reference path='./player/PreviewPlayer.ts' />
/// <reference path='./player/PlayerCollection.ts' />
/// <reference path='./position/Position.ts' />
/// <reference path='./position/PositionCollection.ts' />
/// <reference path='./route/Route.ts' />
/// <reference path='./route/RouteCollection.ts' />
/// <reference path='./route/RouteNode.ts' />
/// <reference path='./tab/Tab.ts' />
/// <reference path='./tab/TabCollection.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='../models/models.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./ICanvas.ts' />
/// <reference path='./IEditorObject.ts' />
/// <reference path='./IListener.ts' />
/// <reference path='./IField.ts' />
/// <reference path='./IBall.ts' />
/// <reference path='./IFieldElement.ts' />
/// <reference path='./IPaper.ts' />
/// <reference path='./IGrid.ts' />
/// <reference path='./IRoute.ts' />
/// <reference path='./IPlayer.ts' />
/// <reference path='./IPlaceable.ts' />
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
})(Playbook || (Playbook = {}));
var Playbook;
(function (Playbook) {
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
/// <reference path='./playbook.ts' />
/// <reference path='../modules.mdl.ts' />
impakt.playbook = angular.module('impakt.playbook', [
    'ui.router',
    'impakt.common',
    'impakt.playbook.contextmenus',
    'impakt.playbook.modals',
    'impakt.playbook.browser',
    'impakt.playbook.editor',
    'impakt.playbook.layout',
    'impakt.playbook.nav',
])
    .config(['$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        console.debug('impakt.playbook - config');
        // impakt module states
        $stateProvider.state('playbook', {
            url: '/playbook',
            templateUrl: 'modules/playbook/playbook.tpl.html',
            controller: 'playbook.ctrl'
        });
    }])
    .run([
    '$stateParams',
    '__localStorage',
    function ($stateParams, __localStorage) {
        console.debug('impakt.playbook - run');
    }]);
/// <reference path='../playbook.mdl.ts' />
impakt.playbook.browser = angular.module('impakt.playbook.browser', [
    'impakt.playbook.browser.sidebar',
    'impakt.playbook.browser.main',
    'impakt.playbook.browser.details'
])
    .config([
    '$stateProvider',
    function ($stateProvider) {
        console.debug('impakt.playbook.browser - config');
        $stateProvider.state('playbook.browser', {
            url: '/browser',
            views: {
                'sidebar': {
                    templateUrl: 'modules/playbook/browser/sidebar/playbook-browser-sidebar.tpl.html',
                    controller: 'playbook.browser.sidebar.ctrl'
                },
                'main': {
                    templateUrl: 'modules/playbook/browser/main/playbook-browser-main.tpl.html',
                    controller: 'playbook.browser.main.ctrl',
                },
                'details': {
                    templateUrl: 'modules/playbook/browser/details/playbook-browser-details.tpl.html',
                    controller: 'playbook.browser.details.ctrl'
                },
            }
        });
    }])
    .run(function () {
    console.debug('impakt.playbook.browser - run');
});
/// <reference path='../playbook-browser.mdl.ts' />
impakt.playbook.browser.details = angular.module('impakt.playbook.browser.details', [])
    .config(function () {
    console.debug('impakt.playbook.browser.details - config');
})
    .run(function () {
    console.debug('impakt.playbook.browser.details - run');
});
/// <reference path='./playbook-browser-details.mdl.ts' />
impakt.playbook.browser.details.controller('playbook.browser.details.ctrl', ['$scope', '__modals', '_playbookBrowserDetails',
    function ($scope, __modals, _playbookBrowserDetails) {
    }]);
/// <reference path='./playbook-browser-details.mdl.ts' />
impakt.playbook.browser.details.service('_playbookBrowserDetails', [function () {
        console.debug('service: impakt.playbook.browser.details');
    }]);
/// <reference path='../playbook-browser.mdl.ts' />
impakt.playbook.browser.main = angular.module('impakt.playbook.browser.main', [])
    .config([
    '$stateProvider',
    function ($stateProvider) {
        console.debug('impakt.playbook.browser.main - config');
    }])
    .run([function () {
        console.debug('impakt.playbook.browser.main - run');
    }]);
/// <reference path='./playbook-browser-main.mdl.ts' />
impakt.playbook.browser.main.controller('playbook.browser.main.ctrl', [
    '$scope',
    '__context',
    '__router',
    '_playbook',
    '_playbookModals',
    function ($scope, __context, __router, _playbook, _playbookModals) {
        var parent = 'playbook.browser.main';
        __router.push(parent, [
            new Common.Models.Template('playbook.browser.main.all', 'modules/playbook/browser/main/all/playbook-browser-main-all.tpl.html'),
            new Common.Models.Template('playbook.browser.main.playbook', 'modules/playbook/browser/main/playbook/playbook-browser-playbook.tpl.html')
        ]);
        $scope.template = {};
        $scope.editor = impakt.context.Playbook.editor;
        $scope.playbooks = impakt.context.Playbook.playbooks;
        $scope.formations = impakt.context.Playbook.formations;
        $scope.plays = impakt.context.Playbook.plays;
        __context.onReady(function () {
            $scope.playbooks = impakt.context.Playbook.playbooks;
            $scope.formations = impakt.context.Playbook.formations;
            $scope.plays = impakt.context.Playbook.plays;
        });
        $scope.goToAll = function () {
            $scope.template = __router.get(parent, 'playbook.browser.main.all');
        };
        $scope.goToPlaybook = function (playbook) {
            $scope.template = __router.get(parent, 'playbook.browser.main.playbook');
            $scope.template.data = playbook;
        };
        $scope.getEditorTypeClass = function (editorType) {
            return _playbook.getEditorTypeClass(editorType);
        };
        $scope.openEditor = function () {
            _playbook.toEditor();
        };
        $scope.openFormationInEditor = function (formation) {
            _playbook.editFormation(formation);
        };
        $scope.openPlayInEditor = function (play) {
            _playbook.editPlay(play);
        };
        $scope.createPlaybook = function () {
            _playbookModals.createPlaybook();
        };
        $scope.deletePlaybook = function (playbook) {
            _playbookModals.deletePlaybook(playbook);
        };
        $scope.createPlay = function () {
            _playbookModals.createPlay();
        };
        $scope.deletePlay = function (play) {
            _playbookModals.deletePlay(play);
        };
        $scope.createFormation = function () {
            _playbookModals.createFormation();
        };
        $scope.deleteFormation = function (formation) {
            _playbookModals.deleteFormation(formation);
        };
        /**
         * Navigates to the main browser 'all' view
         */
        $scope.goToAll();
    }]);
/// <reference path='./playbook-browser.mdl.ts' />
impakt.playbook.browser.controller('playbook.browser.ctrl', ['$scope',
    function ($scope) {
    }]);
/// <reference path='./playbook-browser.mdl.ts' />
impakt.playbook.browser.service('_playbookBrowser', [function () {
    }]);
/// <reference path='../playbook-browser.mdl.ts' />
impakt.playbook.browser.sidebar = angular.module('impakt.playbook.browser.sidebar', [])
    .config([
    '$stateProvider',
    function ($stateProvider) {
        console.debug('impakt.playbook.browser.sidebar - config');
    }])
    .run([function () {
        console.debug('impakt.playbook.browser.sidebar - run');
    }]);
/// <reference path='./playbook-browser-sidebar.mdl.ts' />
impakt.playbook.browser.sidebar.controller('playbook.browser.sidebar.ctrl', [
    '$scope',
    '__router',
    '_playbook',
    '_playbookModals',
    function ($scope, __router, _playbook, _playbookModals) {
        var parent = 'playbook.browser.sidebar';
        __router.push(parent, [
            new Common.Models.Template('playbook.browser.sidebar.unitTypes', 'modules/playbook/browser/sidebar/unitTypes/unitTypes.tpl.html'),
            new Common.Models.Template('playbook.browser.sidebar.playbooks', 'modules/playbook/browser/sidebar/playbook/playbooks.tpl.html'),
            new Common.Models.Template('playbook.browser.sidebar.associated', 'modules/playbook/browser/sidebar/associated/associated.tpl.html'),
            new Common.Models.Template('playbook.browser.sidebar.plays', 'modules/playbook/browser/sidebar/play/plays.tpl.html'),
            new Common.Models.Template('playbook.browser.sidebar.formations', 'modules/playbook/browser/sidebar/formation/formations.tpl.html')
        ]);
        $scope.template = {};
        $scope.unitTypes = impakt.context.Playbook.unitTypes;
        $scope.plays = impakt.context.Playbook.plays;
        $scope.formations = impakt.context.Playbook.formations;
        $scope.goToUnitTypes = function () {
            $scope.template = __router.get(parent, 'playbook.browser.sidebar.unitTypes');
        };
        $scope.goToPlaybooks = function () {
            $scope.template = __router.get(parent, 'playbook.browser.sidebar.playbooks');
        };
        $scope.goToAssociated = function () {
            $scope.template = __router.get(parent, 'playbook.browser.sidebar.associated');
        };
        $scope.goToPlays = function () {
            $scope.template = __router.get(parent, 'playbook.browser.sidebar.plays');
        };
        $scope.goToFormations = function () {
            $scope.template = __router.get(parent, 'playbook.browser.sidebar.formations');
        };
        $scope.refreshPlays = function () {
            $scope.plays = impakt.context.Playbook.plays;
        };
        $scope.refreshFormations = function () {
            $scope.formations = impakt.context.Playbook.formations;
        };
        $scope.createPlay = function () {
            _playbookModals.createPlay();
        };
        $scope.createFormation = function () {
            _playbookModals.createFormation();
        };
        $scope.openFormationInEditor = function (formation) {
            _playbook.editFormation(formation);
            _playbook.refreshEditor();
        };
        $scope.openPlayInEditor = function (play) {
            _playbook.editPlay(play);
            _playbook.refreshEditor();
        };
        $scope.goToPlays();
        console.debug('controller: playbook.browser.sidebar.ctrl', __router.templates);
    }]);
/// <reference path='../playbook.mdl.ts' />
impakt.playbook.contextmenus = angular.module('impakt.playbook.contextmenus', [
    'impakt.playbook.contextmenus.routeNode'
])
    .config(function () {
    console.debug('impakt.playbook.contextmenus - config');
})
    .run(function () {
    console.debug('impakt.playbook.contextmenus - run');
});
/// <reference path='../playbook-contextmenus.mdl.ts' />
impakt.playbook.contextmenus.routeNode =
    angular.module('impakt.playbook.contextmenus.routeNode', [])
        .config(function () {
        console.debug('impakt.playbook.contextmenus.routeNode - config');
    })
        .run(function () {
        console.debug('impakt.playbook.contextmenus.routeNode - run');
    });
/// <reference path='./playbook-contextmenus-routeNode.mdl.ts' />
impakt.playbook.contextmenus.routeNode.controller('impakt.playbook.contextmenus.routeNode.ctrl', ['$scope', '_playbookContextmenusRouteNode',
    function ($scope, _playbookContextmenusRouteNode) {
        console.log('assignment node controller', _playbookContextmenusRouteNode.context);
        $scope.context = _playbookContextmenusRouteNode.context;
        $scope.actions = _playbookContextmenusRouteNode.getActions();
        $scope.actionClick = function (action) {
            if ($scope.context.actionable) {
                _playbookContextmenusRouteNode.selectAction(action);
            }
            else {
                console.log('Route node is non-actionable');
            }
        };
    }]);
/// <reference path='./playbook-contextmenus-routeNode.mdl.ts' />
impakt.playbook.contextmenus.routeNode.service('_playbookContextmenusRouteNode', ['__contextmenu', '__parser',
    function (__contextmenu, __parser) {
        this.context = __contextmenu.getContext();
        this.actions = __parser.convertEnumToList(Playbook.Models.RouteNodeActions);
        this.init = function () {
            var self = this;
            __contextmenu.onContextUpdate(function (context) {
                self.context = context;
            });
        };
        this.getActions = function () {
            return __parser.convertEnumToList(Playbook.Models.RouteNodeActions);
        };
        this.selectAction = function (action) {
            this.context.setAction(parseInt(Playbook.Models.RouteNodeActions[action]));
            __contextmenu.close();
        };
        console.log('_playbookContextmenusRouteNode service loaded');
        this.init();
    }]);
/// <reference path='../playbook.mdl.ts' />
impakt.playbook.editor = angular.module('impakt.playbook.editor', [
    'impakt.playbook.editor.tabs',
    'impakt.playbook.editor.tools',
    'impakt.playbook.editor.mode',
    'impakt.playbook.editor.canvas',
    'impakt.playbook.editor.details'
])
    .config([
    '$stateProvider',
    function ($stateProvider) {
        console.debug('impakt.playbook.editor - config');
        $stateProvider.state('playbook.editor', {
            url: '/editor',
            views: {
                // Uses browser side bar for now
                'sidebar': {
                    templateUrl: 'modules/playbook/browser/sidebar/playbook-browser-sidebar.tpl.html',
                    controller: 'playbook.browser.sidebar.ctrl'
                },
                'main': {
                    templateUrl: 'modules/playbook/editor/playbook-editor.tpl.html',
                    controller: 'playbook.editor.ctrl'
                },
                'details': {
                    templateUrl: 'modules/playbook/editor/details/playbook-editor-details.tpl.html',
                    controller: 'playbook.editor.details.ctrl'
                }
            }
        });
    }])
    .run(function () {
    console.debug('impakt.playbook.editor - run');
});
/// <reference path='../playbook-editor.mdl.ts' />
impakt.playbook.editor.canvas =
    angular.module('impakt.playbook.editor.canvas', [])
        .config(function () {
        console.debug('impakt.playbook.editor.canvas - config');
    })
        .run(function () {
        console.debug('impakt.playbook.editor.canvas - run');
    });
/// <reference path='./playbook-editor-canvas.mdl.ts' />
impakt.playbook.editor.canvas.controller('playbook.editor.canvas.ctrl', [
    '$scope',
    '_playbookEditorCanvas',
    function ($scope, _playbookEditorCanvas) {
        $scope.formations = _playbookEditorCanvas.formations;
        $scope.personnelCollection = _playbookEditorCanvas.personnelCollection;
        $scope.plays = _playbookEditorCanvas.plays;
        $scope.tab = _playbookEditorCanvas.getActiveTab();
        $scope.hasOpenTabs = $scope.tab != null;
        // check if there are any open tabs; if not, hide the canvas and
        // clear the canvas data.
        if ($scope.tab) {
            $scope.tab.onclose(function () {
                $scope.hasOpenTabs = _playbookEditorCanvas.hasTabs();
            });
        }
        // _playbookEditorCanvas.onready(function() {
        // 	$scope.tab = _playbookEditorCanvas.activeTab;
        // });	
        $scope.formations.onModified(function () {
            // $scope.$apply();
        });
        /**
         * Toggle Editor mode
         */
        $scope.switchToPlayMode = function () {
            console.log('switch from formation mode to play mode', $scope.tab.playPrimary);
            $scope.tab.playPrimary.editorType = Playbook.Editor.EditorTypes.Play;
        };
        $scope.getEditorTypeClass = function (editorType) {
            return _playbookEditorCanvas.getEditorTypeClass(parseInt(editorType));
        };
        /**
         * Toggle Formation / Personnel / Assignments
         */
        $scope.applyFormation = function (formation) {
            console.log('apply formation to editor');
            _playbookEditorCanvas.applyPrimaryFormation(formation);
        };
        $scope.applyPersonnel = function (personnel) {
            _playbookEditorCanvas.applyPrimaryPersonnel(personnel);
        };
        $scope.applyPlay = function (play) {
            _playbookEditorCanvas.applyPrimaryPlay(play);
        };
        /**
         * Determine whether to show quick formation dropdown. Should only
         * be possible when in play- or formation-editing types.
         * @param {Playbook.Editor.EditorTypes} editorType Editor type enum to
         * determine which type of editor window we have open.
         */
        $scope.isFormationVisible = function (editorType) {
            return editorType == Playbook.Editor.EditorTypes.Formation ||
                editorType == Playbook.Editor.EditorTypes.Play;
        };
        /**
         * Personnel should be visible when setting assignments, since we need the
         * mapping information of a personnel group to determine how assignments are
         * paired with the players in the given formation.
         * @param {Playbook.Editor.EditorTypes} editorType [description]
         */
        $scope.isPersonnelVisible = function (editorType) {
            return editorType == Playbook.Editor.EditorTypes.Assignment ||
                editorType == Playbook.Editor.EditorTypes.Play;
        };
        $scope.isAssignmentVisible = function (editorType) {
            return editorType == Playbook.Editor.EditorTypes.Assignment ||
                editorType == Playbook.Editor.EditorTypes.Play;
        };
        $scope.toBrowser = function () {
            _playbookEditorCanvas.toBrowser();
        };
    }]);
///<reference path='./playbook-editor-canvas.mdl.ts' />
// TODO - needed?
impakt.playbook.editor.canvas.directive('playbookEditorCanvas', ['$rootScope',
    '$compile',
    '$templateCache',
    '$timeout',
    '__contextmenu',
    '_playPreview',
    '_playbookEditorCanvas',
    '_scrollable',
    function ($rootScope, $compile, $templateCache, $timeout, __contextmenu, _playPreview, _playbookEditorCanvas, _scrollable) {
        console.debug('directive: impakt.playbook.editor.canvas - register');
        return {
            restrict: 'E',
            scope: {
                editortype: '@editortype',
                key: '@key'
            },
            link: function ($scope, $element, attrs) {
                console.debug('directive: impakt.playbook.editor.canvas - link');
                // angular doesn't respect camel-casing in directives, hence
                // the all-lowercased editortype attribute.
                var editorType = parseInt(attrs.editortype);
                var key = attrs.key;
                $timeout(function () {
                    // $timeout NOTE:
                    // wrapping this step in a timeout due to a DOM rendering race.
                    // The angular ng-show directive kicks in when activating/
                    // deactivating the tabs, and the .col class (css-flex)
                    // needs time itself to render to the appropriate size.
                    // This timeout lets all of that finish before intializing
                    // the canvas; the canvas requires an accurate $element height
                    // value in order to get its proper dimensions.
                    var canvas = _playbookEditorCanvas.initialize($element, editorType, key);
                    canvas.setScrollable(_scrollable);
                    _scrollable.onready(function (content) {
                        _scrollable.scrollToPercentY(0.5);
                        _playPreview.setViewBox(canvas.paper.x, canvas.paper.y, canvas.paper.canvas.width, canvas.paper.canvas.height);
                    });
                    _scrollable.initialize($element, canvas.paper);
                });
                $(document).on('keydown', function (e) {
                    //console.log(e.which);
                    if (e.which == 8) {
                        console.log('backspace pressed - playbook-editor-canvas.drv.ts');
                    }
                    if (e.which == 82) {
                        console.log('R pressed - playbook-editor-canvas.drv.ts');
                    }
                    if (e.which == 65) {
                        console.log('A pressed - playbook-editor-canvas.drv.ts');
                    }
                });
                // $rootScope.$on('playbook-editor-canvas.playerContextmenu',
                // 	function(e: any, data: any) {
                // 		var player = data.player;					
                // 		console.log('playbook-editor-canvas.playerContextmenu', player);
                // 		var markup = [
                // 			'<contextmenu ',
                // 			'guid="', 
                // 			player.guid, 
                // 			'" template="', 
                // 			player.contextmenuTemplateUrl,
                // 			'" left="', data.left, 
                // 			'" top="', data.top,
                // 			'"></contextmenu>'
                // 		].join('');
                // 		var c = $compile(markup)($scope);
                // 		__contextmenu.set(player.guid, player);
                // 		$element.after(c);
                // 	});
                $rootScope.$on('playbook-editor-canvas.routeNodeContextmenu', function (e, data) {
                    var node = data.node;
                    console.log('playbook-editor-canvas.routeNodeContextmenu', node);
                    var markup = [
                        '<contextmenu ',
                        'guid="',
                        node.guid,
                        '" template="',
                        node.contextmenuTemplateUrl,
                        '" left="', data.left,
                        '" top="', data.top,
                        '"></contextmenu>'
                    ].join('');
                    var c = $compile(markup)($scope);
                    __contextmenu.setContext(node);
                    $element.after(c);
                });
            }
        };
    }]);
/// <reference path='../../playbook.ts' />
/// <reference path='../../models/canvas/Canvas.ts' />
/// <reference path='../../../../common/common.ts' />
/// <reference path='./playbook-editor-canvas.mdl.ts' />
impakt.playbook.editor.canvas.service('_playbookEditorCanvas', [
    '$rootScope',
    '$timeout',
    '_base',
    '_playPreview',
    '_playbook',
    '_playbookEditor',
    function ($rootScope, $timeout, _base, _playPreview, _playbook, _playbookEditor) {
        console.debug('service: impakt.playbook.editor.canvas');
        var self = this;
        this.activeTab = _playbookEditor.activeTab;
        this.playbooks = impakt.context.Playbook.playbooks;
        this.formations = impakt.context.Playbook.formations;
        this.personnelCollection = impakt.context.Playbook.personnel;
        this.assignments = impakt.context.Playbook.assignments;
        this.plays = impakt.context.Playbook.assignments;
        this.readyCallbacks = [function () { console.log('canvas ready'); }];
        this.component = new Common.Base.Component('_playbookEditorCanvas', Common.Base.ComponentType.Service, []);
        function init() {
            _playbookEditor.component.loadDependency(self.component);
        }
        this.onready = function (callback) {
            this.readyCallbacks.push(callback);
            _playbookEditor.onready(function () {
                self.ready();
            });
        };
        this.ready = function () {
            for (var i = 0; i < this.readyCallbacks.length; i++) {
                this.readyCallbacks[i]();
            }
            this.readyCallbacks = [];
        };
        this.create = function (tab) {
            // TODO @theBull - implement opponent play
            var canvas = new Playbook.Models.Canvas(tab.playPrimary, new Playbook.Models.PlayOpponent());
            canvas.tab = tab;
        };
        this.getActiveTab = function () {
            this.activeTab = _playbookEditor.activeTab;
            return this.activeTab;
        };
        this.hasTabs = function () {
            return _playbookEditor.hasTabs();
        };
        this.toBrowser = function () {
            _playbookEditor.toBrowser();
        };
        this.initialize = function ($element, editorType, guid) {
            var canvas = _playbookEditor.canvas;
            // attach listeners to canvas
            // canvas.listen(
            // 	Playbook.Editor.CanvasActions.PlayerContextmenu, 
            // 	function(message: any, player: Playbook.Models.Player) {
            // 		console.log('action commanded: player contextmenu');
            // 		var absCoords = getAbsolutePosition(player.set.items[1]);
            // 		$rootScope.$broadcast(
            // 			'playbook-editor-canvas.playerContextmenu', 
            // 			{ 
            // 				message: message,
            // 				player: player,
            // 				left: absCoords.left,
            // 				top: absCoords.top
            // 			}
            // 		);
            // 	});
            canvas.listen(Playbook.Editor.CanvasActions.RouteNodeContextmenu, function (message, node) {
                console.log('action commanded: route node contextmenu');
                var absCoords = getAbsolutePosition(node);
                $rootScope.$broadcast('playbook-editor-canvas.routeNodeContextmenu', {
                    message: message,
                    node: node,
                    left: absCoords.left,
                    top: absCoords.top
                });
            });
            canvas.initialize($element);
            return canvas;
        };
        /**
         * Applies the given formation to the field
         * @param {Playbook.Models.Formation} formation The Formation to apply
         */
        this.applyPrimaryFormation = function (formation) {
            if (canApplyData()) {
                _playbookEditor.canvas.paper.field.applyPrimaryFormation(formation);
            }
        };
        /**
         * Applies the given personnel data to the field
         * @param {Playbook.Models.Personnel} personnel The Personnel to apply
         */
        this.applyPrimaryPersonnel = function (personnel) {
            if (canApplyData()) {
                _playbookEditor.canvas.paper.field.applyPrimaryPersonnel(personnel);
            }
        };
        /**
         * Applies the given play data to the field
         * @param {Playbook.Models.Play} play The Play to apply
         */
        this.applyPrimaryPlay = function (playPrimary) {
            if (canApplyData()) {
                _playbookEditor.canvas.paper.field.applyPlayPrimary(playPrimary);
            }
        };
        function canApplyData() {
            if (!_playbookEditor.canvas ||
                !_playbookEditor.canvas.paper ||
                !_playbookEditor.canvas.paper.field) {
                throw new Error('Cannot apply primary formation; canvas, paper, or field is null or undefined');
                return false;
            }
            return true;
        }
        function getAbsolutePosition(element) {
            var $dom = $(element.raphael.node);
            console.log('$dom offsets: ', $dom.offset().left, $dom.offset().top, element.width, element.height);
            //let $playbookCanvas = $dom.closest('playbook-editor-canvas');
            return {
                left: $dom.offset().left,
                top: $dom.offset().top
            };
        }
        this.remove = function (tab) {
            // do something
        };
        this.scrollTo = function (x, y) {
            console.log(x, y);
            this.canvas.paper.scroll(x, y);
        };
        this.getEditorTypeClass = function (editorType) {
            return _playbookEditor.getEditorTypeClass(editorType);
        };
        /*****
        *
        *
        *	RECEIVE EXTERNAL COMMANDS
        *
        *
        ******/
        // receives command from playbook.editor to create a new canvas
        $rootScope.$on('playbook-editor-canvas.create', function (e, tab) {
            console.log('creating canvas...');
            self.create(tab);
        });
        $rootScope.$on('playbook-editor-canvas.zoomIn', function (e, data) {
            //self.active.canvas.paper.zoomIn();
        });
        $rootScope.$on('playbook-editor-canvas.zoomOut', function (e, data) {
            //self.active.canvas.paper.zoomOut();
        });
        // receives command from playbook.editor to close canvas
        $rootScope.$on('playbook-editor-canvas.close', function (e, tab) {
            console.log('closing canvas...');
            self.remove(tab);
        });
        // receives command from playbook.editor to activate canvas
        $rootScope.$on('playbook-editor-canvas.activate', function (e, tab) {
            console.log('activating canvas...');
            self.activate(tab);
        });
        // receives command from playbook.editor to add a player to canvas
        $rootScope.$on('playbook-editor-canvas.addPlayer', function (e, data) {
            //self.active.canvas.field.addPlayer({});
            console.info('add player');
        });
        // receives command from playbook.editor to zoom in canvas
        $rootScope.$on('playbook-editor-canvas.zoomIn', function (e, data) {
            console.info('zoom in');
        });
        // receives command from playbook.editor to zoom out canvas
        $rootScope.$on('playbook-editor-canvas.zoomOut', function (e, data) {
            console.info('zoom out');
        });
        init();
    }]);
/// <reference path='../playbook-editor.mdl.ts' />
impakt.playbook.editor.details = angular.module('impakt.playbook.editor.details', [])
    .config(function () {
    console.debug('impakt.playbook.editor.details - config');
})
    .run(function () {
    console.debug('impakt.playbook.editor.details - run');
});
/// <reference path='./playbook-editor-details.mdl.ts' />
impakt.playbook.editor.details.controller('playbook.editor.details.ctrl', ['$scope', '_playbookEditorDetails',
    function ($scope, _playbookEditorDetails) {
        $scope.canvas = _playbookEditorDetails.canvas;
        $scope.refreshPreview = function () {
        };
    }]);
/// <reference path='./playbook-editor-details.mdl.ts' />
impakt.playbook.editor.details.service('_playbookEditorDetails', [
    '_playbookEditor',
    function (_playbookEditor) {
        console.debug('service: impakt.playbook.browser');
        this.canvas = _playbookEditor.canvas;
    }]);
/// <reference path='../playbook-editor.mdl.ts' />
impakt.playbook.editor.mode = angular.module('impakt.playbook.editor.mode', [])
    .config(function () {
    console.debug('impakt.playbook.editor.mode - config');
})
    .run(function () {
    console.debug('impakt.playbook.editor.mode - run');
});
/// <reference path='./playbook-editor-mode.mdl.ts' />
impakt.playbook.editor.mode.controller('playbook.editor.mode.ctrl', [
    '$scope',
    '_playbookEditor',
    function ($scope, _playbookEditor) {
        $scope.canvas = _playbookEditor.canvas;
    }]);
/// <reference path='./playbook-editor.mdl.ts' />
impakt.playbook.editor.controller('playbook.editor.ctrl', [
    '$scope',
    '$stateParams',
    '_playbookEditor',
    function ($scope, $stateParams, _playbookEditor) {
        $scope.canvas = _playbookEditor.canvas;
        //_playbookEditor.init();
        var templatePrefix = 'modules/playbook/editor/';
        $scope.templates = {
            tools: [
                templatePrefix,
                'tools/playbook-editor-tools.tpl.html'
            ].join(''),
            tabs: [
                templatePrefix,
                'tabs/playbook-editor-tabs.tpl.html'
            ].join(''),
            canvas: [
                templatePrefix,
                'canvas/playbook-editor-canvas.tpl.html'
            ].join(''),
            mode: [
                templatePrefix,
                'mode/playbook-editor-mode.tpl.html'
            ].join('')
        };
    }]);
/// <reference path='./playbook-editor.mdl.ts' />
/// <reference path='../playbook.ts' />
/// <reference path='../../../common/common.ts' />
impakt.playbook.editor.service('_playbookEditor', [
    '$rootScope',
    '_base',
    '_playbook',
    '_playbookModals',
    function ($rootScope, _base, _playbook, _playbookModals) {
        console.debug('service: impakt.playbook.editor');
        var self = this;
        this.component = new Common.Base.Component('_playbookEditor', Common.Base.ComponentType.Service, [
            '_playbookEditorTools',
            '_playbookEditorTabs',
            '_playbookEditorCanvas'
        ]);
        // tabs and plays are references to the targeted application-level data collections;
        // when the data changes at the application-level; tabs and plays added through this
        // service are handled by reference, so that no copies of them are created, unless
        // a *new* play is being created, or a play is being created as a *new copy* of another.
        // This keeps the data footprint minimal, as well as prevents the redundancy of 
        // data models existing application-wide. 
        this.tabs = impakt.context.Playbook.editor.tabs;
        this.plays = impakt.context.Playbook.editor.plays;
        this.formations = impakt.context.Playbook.editor.formations;
        // sets a default tab - this should be overwritten as soon as it becomes available
        this.activeTab = null;
        this.canvas = null;
        this.toolMode = Playbook.Editor.ToolModes[Playbook.Editor.ToolModes.None];
        $rootScope.$on('playbook-editor.refresh', function (e, formationKey) {
            self.plays = impakt.context.Playbook.editor.plays;
            self.formations = impakt.context.Playbook.editor.formations;
            self.loadTabs();
        });
        this.readyCallback = function () {
            console.log('Playbook editor ready default callback');
        };
        var initialized = false;
        this.ready = function () {
            this.readyCallback();
        };
        this.init = function () {
            console.info('initializing playbook editor service');
            console.debug('service: impakt.playbook.editor - load complete');
            initialized = true;
            var initialPlay = null;
            if (self.tabs.isEmpty()) {
                self.loadTabs();
            }
            // check for active tab and initialize the canvas with that tab's play
            self.tabs.forEach(function (tab, index) {
                if (tab.active) {
                    initialPlay = self.plays.filterFirst(function (play) {
                        return play.guid == tab.playPrimary.guid;
                    });
                    var opponentPlayTest = new Playbook.Models.PlayOpponent();
                    // initialize the default formation & personnel
                    opponentPlayTest.setDefault(tab.canvas.field);
                    if (initialPlay) {
                        if (!self.canvas) {
                            self.canvas = new Playbook.Models.Canvas(initialPlay, opponentPlayTest);
                        }
                    }
                }
            });
            if (!initialPlay) {
                // Throw an error at this point; we should always have some physical play to use
                // whether it's a new play or an existing play; we shouldn't arbitrarily initialize
                // the canvas with a blank play here
                throw new Error('_playbookEditor init(): \
				Trying to create a new canvas but there are \
				no active tabs / play data to start with.');
            }
            self.canvas.onready(function () {
                self.loadTabs();
                self.ready();
            });
            _base.loadComponent(self.component);
        };
        this.onready = function (callback) {
            this.readyCallback = callback;
        };
        /**
         * Checks for open plays in the editor context, as well as the
         * corresponding tab; if the tab is active, grab the corresponding
         * play and pass it in to initialize the canvas.
         */
        this.loadTabs = function () {
            this.plays.forEach(function (play, index) {
                // loop over all plays currently 'open' in the editor context...
                // determine whether each play has a corresponding tab 
                var playExists = false;
                self.tabs.forEach(function (tab, j) {
                    if (tab.playPrimary.guid == play.guid) {
                        playExists = true;
                    }
                });
                if (!playExists) {
                    var tab = new Playbook.Models.Tab(play, null);
                    // Hmm...
                    tab.active = index == 0;
                    self.addTab(tab);
                }
            });
        };
        this.addTab = function (tab) {
            // ignore if it is already open
            if (this.tabs.contains(tab.guid)) {
                this.activateTab(tab, true);
                return;
            }
            else {
                // add the new tab...
                this.tabs.add(tab);
                if (tab.active) {
                    // ...and set it to active
                    this.activateTab(tab, false);
                }
            }
        };
        this.activateTab = function (tab) {
            this.inactivateOtherTabs(tab);
            // for redundancy to ensure tab is explicitly set to active
            tab.active = true;
            // create another pointer to always track the active tab
            this.activeTab = tab;
            if (this.canvas) {
                // pass new data to canvas
                this.canvas.updatePlay(this.activeTab.playPrimary, null, true);
            }
        };
        this.closeTab = function (tab) {
            this.tabs.remove(tab.guid);
            // remove play from editor context
            this.plays.remove(tab.playPrimary.guid);
            // get last tab
            if (this.tabs.hasElements()) {
                // activate the last tab
                this.activateTab(this.tabs.getLast());
            }
            else {
                // no remaining tabs - nullify active Tab
                this.activeTab = null;
            }
            // tell tab to close (fire off close callbacks)
            tab.close();
        };
        this.inactivateOtherTabs = function (tab) {
            this.tabs.forEach(function (currentTab, index) {
                if (currentTab.guid != tab.guid)
                    currentTab.active = false;
            });
        };
        this.hasTabs = function () {
            return this.tabs.hasElements();
        };
        this.getEditorTypeClass = function (editorType) {
            return _playbook.getEditorTypeClass(editorType);
        };
        /*
        *
        *	Tool -> Canvas bindings
        *
        */
        this.toggleMenu = function () {
            // N/A
        };
        this.addPlayer = function () {
            $rootScope.$broadcast('playbook-editor-canvas.addPlayer');
        };
        this.save = function () {
            // save the data for the active item
            var activeTab = this.activeTab;
            console.log(activeTab);
            if (activeTab) {
                var play = activeTab.playPrimary;
                _playbookModals.savePlay(play);
            }
        };
        this.zoomIn = function () {
            $rootScope.$broadcast('playbook-editor-canvas.zoomIn');
        };
        this.zoomOut = function () {
            $rootScope.$broadcast('playbook-editor-canvas.zoomOut');
        };
        this.setCursor = function (cursor) {
            if (this.canvas && this.canvas.$container) {
                this.canvas.$container.css({ 'cursor': cursor });
            }
        };
        this.setToolMode = function (toolMode) {
            console.log('Change editor tool mode: ', toolMode, Playbook.Editor.ToolModes[toolMode]);
            if (this.canvas) {
                this.canvas.toolMode = toolMode;
                this.toolMode = Playbook.Editor.ToolModes[toolMode];
            }
        };
        this.toBrowser = function () {
            _playbook.toBrowser();
        };
        this.init();
    }]);
/// <reference path='../playbook-editor.mdl.ts' />
impakt.playbook.editor.tabs =
    angular.module('impakt.playbook.editor.tabs', [
        'impakt.playbook.editor.canvas'
    ])
        .config(function () {
        console.debug('impakt.playbook.editor.tabs - config');
    })
        .run(function () {
        console.debug('impakt.playbook.editor.tabs - run');
    });
/// <reference path='./playbook-editor-tabs.mdl.ts' />
/// <reference path='../../models/canvas/Canvas.ts' />
/// <reference path='../../../../common/common.ts' />
/// <reference path='../../playbook.ts' />
impakt.playbook.editor.tabs.controller('playbook.editor.tabs.ctrl', [
    '$scope',
    '_base',
    '_playbookModals',
    '_playbookEditorTabs',
    function ($scope, _base, _playbookModals, _playbookEditorTabs) {
        this.component = new Common.Base.Component('playbook.editor.tabs.ctrl', Common.Base.ComponentType.Controller);
        function init(self) {
            _playbookEditorTabs.component.loadDependency(self.component);
        }
        $scope.tabs = _playbookEditorTabs.tabs;
        $scope.getEditorTypeClass = function (editorType) {
            return _playbookEditorTabs.getEditorTypeClass(parseInt(editorType));
        };
        $scope.new = function () {
            _playbookModals.openNewEditorTab();
        };
        $scope.close = function (tab) {
            var toClose = confirm('Are you sure you want to close?');
            if (toClose)
                _playbookEditorTabs.close(tab);
        };
        $scope.activate = function (tab) {
            _playbookEditorTabs.activate(tab, true);
        };
        $scope.toBrowser = function () {
            _playbookEditorTabs.toBrowser();
        };
        init(this);
    }]);
/// <reference path='../../playbook.ts' />
/// <reference path='./playbook-editor-tabs.mdl.ts' />
impakt.playbook.editor.tabs.service('_playbookEditorTabs', ['$rootScope',
    '_base',
    '_playbookEditor',
    function ($rootScope, _base, _playbookEditor) {
        console.debug('service: impakt.playbook.editor.tabs');
        var self = this;
        this.tabs = _playbookEditor.tabs;
        this.canvases = _playbookEditor.canvases;
        this.component = new Common.Base.Component('_playbookEditorTabs', Common.Base.ComponentType.Service, [
            'playbook.editor.tabs.ctrl'
        ]);
        function init() {
            _playbookEditor.component.loadDependency(self.component);
        }
        this.openNew = function () {
            // Step 2: build a generic model from that response
            _playbookEditor.addTab(new Playbook.Models.Play());
        };
        this.close = function (tab) {
            // remove the tab from the array			
            _playbookEditor.closeTab(tab);
        };
        this.activate = function (tab, activateCanvas) {
            _playbookEditor.activateTab(tab, true);
        };
        this.toBrowser = function () {
            _playbookEditor.toBrowser();
        };
        this.getEditorTypeClass = function (editorType) {
            return _playbookEditor.getEditorTypeClass(editorType);
        };
        init();
    }]);
var Playbook;
(function (Playbook) {
    var Editor;
    (function (Editor) {
        var Tool = (function () {
            function Tool(title, action, glyphiconIcon, tooltip, cursor, mode, selected) {
                this.title = 'Generic tool';
                this.guid = Common.Utilities.guid();
                this.tooltip = 'Generic tool';
                this.glyphicon = new Icon.Glyphicon();
                this.action = ToolActions.Nothing;
                this.title = title || this.title;
                this.action = action || this.action;
                this.tooltip = tooltip || this.tooltip;
                this.glyphicon.icon = glyphiconIcon || this.glyphicon.icon;
                this.cursor = cursor || Playbook.Editor.CursorTypes.pointer;
                this.mode = mode || Playbook.Editor.ToolModes.Select;
                this.selected = selected || false;
            }
            return Tool;
        })();
        Editor.Tool = Tool;
        (function (ToolActions) {
            ToolActions[ToolActions["Nothing"] = 0] = "Nothing";
            ToolActions[ToolActions["Select"] = 1] = "Select";
            ToolActions[ToolActions["ToggleMenu"] = 2] = "ToggleMenu";
            ToolActions[ToolActions["AddPlayer"] = 3] = "AddPlayer";
            ToolActions[ToolActions["Save"] = 4] = "Save";
            ToolActions[ToolActions["ZoomIn"] = 5] = "ZoomIn";
            ToolActions[ToolActions["ZoomOut"] = 6] = "ZoomOut";
            ToolActions[ToolActions["Assignment"] = 7] = "Assignment";
        })(Editor.ToolActions || (Editor.ToolActions = {}));
        var ToolActions = Editor.ToolActions;
    })(Editor = Playbook.Editor || (Playbook.Editor = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../playbook-editor.mdl.ts' />
impakt.playbook.editor.tools =
    angular.module('impakt.playbook.editor.tools', [])
        .config(function () {
        console.debug('impakt.playbook.editor.tools - config');
    })
        .run(function () {
        console.debug('impakt.playbook.editor.tools - run');
    });
/// <reference path='./playbook-editor-tools.mdl.ts' />
// Inherits from playbookEditorController
impakt.playbook.editor.tools.controller('playbook.editor.tools.ctrl', ['$scope', '$rootScope', '_playbookEditorTools',
    function ($scope, $rootScope, _playbookEditorTools) {
        console.debug('controller: playbook.editor.tools');
        this.component = new Common.Base.Component('playbook.editor.tools.ctrl', Common.Base.ComponentType.Controller);
        function init(self) {
            _playbookEditorTools.component.loadDependency(self.component);
        }
        $scope.tools = _playbookEditorTools.tools;
        $scope.expanded = false;
        $scope.toolClick = function (tool) {
            _playbookEditorTools.invoke(tool);
        };
        $rootScope.$on('playbook-editor-canvas.toggleMenu', function (e, data) {
            $scope.expanded = !$scope.expanded;
        });
        init(this);
    }]);
/// <reference path='./Tool.ts' />
/// <reference path='../../playbook.ts' />
/// <reference path='./playbook-editor-tools.mdl.ts' />
/// <reference path='../playbook-editor.srv.ts' />
impakt.playbook.editor.tools.service('_playbookEditorTools', ['$rootScope', '_base', '_playbookEditor',
    function ($rootScope, _base, _playbookEditor) {
        console.debug('service: impakt.playbook.editor.tools');
        this.component = new Common.Base.Component('_playbookEditorTools', Common.Base.ComponentType.Service, [
            'playbook.editor.tools.ctrl'
        ]);
        function init(self) {
            _playbookEditor.component.loadDependency(self.component);
        }
        this.tools = [
            new Playbook.Editor.Tool('Toggle menu', Playbook.Editor.ToolActions.ToggleMenu, 'menu-hamburger'),
            new Playbook.Editor.Tool('Save', Playbook.Editor.ToolActions.Save, 'floppy-disk'),
            new Playbook.Editor.Tool('Select', Playbook.Editor.ToolActions.Select, 'hand-up', 'Select', Playbook.Editor.CursorTypes.pointer, Playbook.Editor.ToolModes.Select, true),
            new Playbook.Editor.Tool('Assignment', Playbook.Editor.ToolActions.Assignment, 'screenshot', '', Playbook.Editor.CursorTypes.crosshair, Playbook.Editor.ToolModes.Assignment),
        ];
        this.deselectAll = function () {
            for (var i = 0; i < this.tools.length; i++) {
                this.tools[i].selected = false;
            }
        };
        this.invoke = function (tool) {
            this.deselectAll();
            tool.selected = true;
            switch (tool.action) {
                case Playbook.Editor.ToolActions.Select:
                    break;
                case Playbook.Editor.ToolActions.ToggleMenu:
                    this.toggleMenu();
                    break;
                case Playbook.Editor.ToolActions.AddPlayer:
                    this.addPlayer();
                    break;
                case Playbook.Editor.ToolActions.Save:
                    this.save();
                    break;
                case Playbook.Editor.ToolActions.ZoomIn:
                    this.zoomIn();
                    break;
                case Playbook.Editor.ToolActions.ZoomOut:
                    this.zoomOut();
                    break;
                case Playbook.Editor.ToolActions.Assignment:
                    break;
            }
            this.setCursor(tool.cursor);
            this.setToolMode(tool.mode);
        };
        /*
        *	TOOL BINDINGS
        */
        this.toggleMenu = function () {
            $rootScope.$broadcast('playbook-editor-canvas.toggleMenu');
        };
        this.addPlayer = function () {
            _playbookEditor.addPlayer();
        };
        this.save = function () {
            _playbookEditor.save();
        };
        this.zoomIn = function () {
            _playbookEditor.zoomIn();
        };
        this.zoomOut = function () {
            _playbookEditor.zoomOut();
        };
        this.setCursor = function (cursor) {
            _playbookEditor.setCursor(cursor);
        };
        this.setToolMode = function (mode) {
            _playbookEditor.setToolMode(mode);
        };
        init(this);
    }]);
/// <reference path='../playbook.mdl.ts' />
impakt.playbook.layout = angular.module('impakt.playbook.layout', [])
    .config([
    '$stateProvider',
    function ($stateProvider) {
        console.debug('impakt.playbook.layout - config');
        $stateProvider.state('playbook.layout', {
            url: '/layout',
            views: {
                'sidebar': {},
                'main': {
                    templateUrl: 'modules/playbook/layout/playbook-layout.tpl.html'
                },
                'details': {}
            }
        });
    }])
    .run(function () {
    console.debug('impakt.playbook.layout - run');
});
/// <reference path='../playbook.mdl.ts' />
impakt.playbook.modals = angular.module('impakt.playbook.modals', [])
    .config(function () {
    console.debug('impakt.playbook.modals - config');
})
    .run(function () {
    console.debug('impakt.playbook.modals - run');
});
/// <reference path='../playbook-modals.mdl.ts' />
impakt.playbook.modals.controller('playbook.modals.createFormation.ctrl', ['$scope',
    '$uibModalInstance',
    '_playbook',
    function ($scope, $uibModalInstance, _playbook) {
        $scope.formation = new Playbook.Models.Formation();
        $scope.unitTypes = impakt.context.Playbook.unitTypes;
        $scope.selectedUnitType = $scope.unitTypes.getByUnitType($scope.formation.unitType);
        $scope.ok = function () {
            $scope.formation.parentRK = 1; // TODO @theBull - deprecate parentRK
            _playbook.editFormation($scope.formation);
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
/// <reference path='../playbook-modals.mdl.ts' />
impakt.playbook.modals.controller('playbook.modals.createPlay.ctrl', [
    '$scope', '$uibModalInstance', '_playbook',
    function ($scope, $uibModalInstance, _playbook) {
        $scope.newPlay = new Playbook.Models.Play();
        $scope.playbooks = impakt.context.Playbook.playbooks;
        $scope.formations = impakt.context.Playbook.formations;
        $scope.assignments = impakt.context.Playbook.assignments;
        $scope.selectedPlaybook = $scope.playbooks.first();
        $scope.selectedFormation = $scope.formations.first();
        $scope.selectedAssignments = $scope.assignments.first();
        $scope.personnelCollection = impakt.context.Playbook.personnel;
        $scope.selectedPersonnel = $scope.personnelCollection.first();
        $scope.unitType = Playbook.Editor.UnitTypes.Other;
        $scope.unitTypes = impakt.context.Playbook.unitTypes;
        $scope.selectedUnitType = $scope.unitTypes.getByUnitType($scope.unitType);
        // Intialize new Play with data
        $scope.newPlay.setFormation($scope.selectedFormation);
        $scope.newPlay.setAssignments($scope.selectedAssignments);
        $scope.newPlay.setPersonnel($scope.selectedPersonnel);
        $scope.newPlay.unittype = $scope.unitType;
        // Add the new play onto the creation context, to access from
        // other parts of the application
        impakt.context.Playbook.creation.plays.add($scope.newPlay);
        $scope.selectUnitType = function (unitTypeValue) {
            $scope.selectedUnitType = $scope.unitTypes.getByUnitType(unitTypeValue);
        };
        $scope.selectPlaybook = function (playbook) {
            $scope.newPlay.setPlaybook($scope.playbooks.get(playbook.guid));
        };
        $scope.selectFormation = function (formation) {
            $scope.newPlay.setFormation($scope.formations.get(formation.guid));
        };
        $scope.selectAssignments = function (assignments) {
            $scope.newPlay.setAssignments($scope.formations.get(assignments.guid));
        };
        $scope.selectPersonnel = function (personnel) {
            $scope.newPlay.setPersonnel($scope.personnelCollection.get(personnel.guid));
        };
        $scope.ok = function () {
            $scope.newPlay.unitType = $scope.selectedUnitType.unitType;
            _playbook.createPlay($scope.newPlay)
                .then(function (createdPlay) {
                removePlayFromCreationContext();
                $uibModalInstance.close(createdPlay);
            }, function (err) {
                removePlayFromCreationContext();
                console.error(err);
                $uibModalInstance.close(err);
            });
        };
        $scope.cancel = function () {
            removePlayFromCreationContext();
            $uibModalInstance.dismiss();
        };
        // Navigates to the team module
        $scope.toTeam = function () {
            var response = confirm('You are about to navigate to the Team module. Your play will not be created. Continue?');
            if (response) {
                $scope.cancel();
                _playbook.toTeam();
            }
        };
        function removePlayFromCreationContext() {
            // Remove the play from the creation context, since we aren't
            // going to proceed with creating the play
            if ($scope.newPlay)
                impakt.context.Playbook.creation.plays.remove($scope.newPlay.guid);
        }
    }]);
/// <reference path='../playbook-modals.mdl.ts' />
impakt.playbook.modals.controller('playbook.modals.createPlaybook.ctrl', [
    '$scope', '$uibModalInstance', '_playbook',
    function ($scope, $uibModalInstance, _playbook) {
        $scope.newPlaybookModel = new Playbook.Models.PlaybookModel();
        $scope.unitType = Playbook.Editor.UnitTypes.Other;
        $scope.unitTypes = impakt.context.Playbook.unitTypes;
        $scope.selectedUnitType = $scope.unitTypes.getByUnitType($scope.unitType);
        $scope.selectUnitType = function (unitTypeValue) {
            $scope.selectedUnitType = $scope.unitTypes.getByUnitType(unitTypeValue);
        };
        $scope.ok = function () {
            $scope.newPlaybookModel.unitType = $scope.selectedUnitType.unitType;
            _playbook.createPlaybook($scope.newPlaybookModel)
                .then(function (createdPlaybook) {
                $uibModalInstance.close(createdPlaybook);
            }, function (err) {
                console.error(err);
                $uibModalInstance.close(err);
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
/// <reference path='../playbook-modals.mdl.ts' />
impakt.playbook.modals.controller('playbook.modals.deleteFormation.ctrl', [
    '$scope',
    '$uibModalInstance',
    '_playbook',
    'formation',
    function ($scope, $uibModalInstance, _playbook, formation) {
        $scope.formation = formation;
        $scope.ok = function () {
            _playbook.deleteFormation($scope.formation)
                .then(function (results) {
                $uibModalInstance.close(results);
            }, function (err) {
                console.error(err);
                $uibModalInstance.close(err);
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
/// <reference path='../playbook-modals.mdl.ts' />
impakt.playbook.modals.controller('playbook.modals.deletePlay.ctrl', [
    '$scope', '$uibModalInstance', '_playbook', 'play',
    function ($scope, $uibModalInstance, _playbook, play) {
        $scope.play = play;
        $scope.ok = function () {
            _playbook.deletePlay($scope.play)
                .then(function (results) {
                $uibModalInstance.close(results);
            }, function (err) {
                console.error(err);
                $uibModalInstance.close(err);
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
/// <reference path='../playbook-modals.mdl.ts' />
impakt.playbook.modals.controller('playbook.modals.deletePlaybook.ctrl', [
    '$scope',
    '$uibModalInstance',
    '_playbook',
    'playbook',
    function ($scope, $uibModalInstance, _playbook, playbook) {
        $scope.playbook = playbook;
        $scope.ok = function () {
            _playbook.deletePlaybook($scope.playbook)
                .then(function (results) {
                $uibModalInstance.close(results);
            }, function (err) {
                console.error(err);
                $uibModalInstance.close(err);
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
/// <reference path='../playbook-modals.mdl.ts' />
impakt.playbook.modals.controller('playbook.modals.newEditor.ctrl', [
    '$scope',
    '$uibModalInstance',
    '_playbookEditorTabs',
    'data',
    function ($scope, $uibModalInstance, _playbookEditorTabs, data) {
        $scope.playbooks = impakt.context.Playbook.playbooks;
        $scope.unitTypes = impakt.context.Playbook.unitTypes;
        $scope.formationName = '';
        console.log($scope.playbooks);
        $scope.ok = function () {
            _playbookEditorTabs.openNew();
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
/// <reference path='./playbook-modals.mdl.ts' />
impakt.playbook.modals.service('_playbookModals', [
    '__modals',
    function (__modals) {
        /**
         *
         * PLAYBOOK
         *
         */
        this.createPlaybook = function () {
            console.log('create playbook');
            var modalInstance = __modals.open('', 'modules/playbook/modals/create-playbook/create-playbook.tpl.html', 'playbook.modals.createPlaybook.ctrl', {});
            modalInstance.result.then(function (createdPlaybook) {
                console.log(createdPlaybook);
            }, function (results) {
                console.log('dismissed');
            });
        };
        this.deletePlaybook = function (playbook) {
            var modalInstance = __modals.open('', 'modules/playbook/modals/delete-playbook/delete-playbook.tpl.html', 'playbook.modals.deletePlaybook.ctrl', {
                playbook: function () {
                    return playbook;
                }
            });
            modalInstance.result.then(function (results) {
                console.log(results);
            }, function (results) {
                console.log('dismissed');
            });
        };
        /**
         *
         * PLAY
         *
         */
        this.createPlay = function () {
            console.log('create play');
            var modalInstance = __modals.open('lg', 'modules/playbook/modals/create-play/create-play.tpl.html', 'playbook.modals.createPlay.ctrl', {});
            modalInstance.result.then(function (createdPlaybook) {
                console.log(createdPlaybook);
            }, function (results) {
                console.log('dismissed');
            });
        };
        this.savePlay = function (play) {
            var template, controller, data, size;
            if (play.editorType == Playbook.Editor.EditorTypes.Play) {
                size = 'lg';
                template = 'modules/playbook/modals/save-play/save-play.tpl.html';
                controller = 'playbook.modals.savePlay.ctrl';
                data = {
                    play: function () {
                        return play;
                    }
                };
            }
            else if (play.editorType == Playbook.Editor.EditorTypes.Formation) {
                size = '';
                template = 'modules/playbook/modals/save-formation/save-formation.tpl.html';
                controller = 'playbook.modals.saveFormation.ctrl';
                data = {
                    formation: function () {
                        return play.formation;
                    }
                };
            }
            var modalInstance = __modals.open(size, template, controller, data);
            modalInstance.result.then(function (results) {
                console.log(results);
            }, function (results) {
                console.log('dismissed');
            });
        };
        this.deletePlay = function (play) {
            var modalInstance = __modals.open('', 'modules/playbook/modals/delete-play/delete-play.tpl.html', 'playbook.modals.deletePlay.ctrl', {
                play: function () {
                    return play;
                }
            });
            modalInstance.result.then(function (results) {
                console.log(results);
            }, function (results) {
                console.log('dismissed');
            });
        };
        /**
         *
         * FORMATION
         *
         */
        this.createFormation = function () {
            var modalInstance = __modals.open('', 'modules/playbook/modals/create-formation/create-formation.tpl.html', 'playbook.modals.createFormation.ctrl', {});
            modalInstance.result.then(function (createdFormation) {
            }, function (results) {
            });
        };
        this.deleteFormation = function (formation) {
            console.log('delete formation');
            var modalInstance = __modals.open('', 'modules/playbook/modals/delete-formation/delete-formation.tpl.html', 'playbook.modals.deleteFormation.ctrl', {
                formation: function () {
                    return formation;
                }
            });
            modalInstance.result.then(function (results) {
            }, function (results) {
                console.log('dismissed');
            });
        };
        this.openNewEditorTab = function () {
            console.log('new editor tab');
            var modalInstance = __modals.open('', 'modules/playbook/modals/new-editor/new-editor.tpl.html', 'playbook.modals.newEditor.ctrl', {
                data: function () {
                    return 1;
                }
            });
            modalInstance.result.then(function (data) {
                console.log(data);
            }, function (results) {
                console.log('dismissed');
            });
        };
    }]);
/// <reference path='../playbook-modals.mdl.ts' />
impakt.playbook.modals.controller('playbook.modals.saveFormation.ctrl', ['$scope',
    '$uibModalInstance',
    '_playbook',
    'formation',
    function ($scope, $uibModalInstance, _playbook, formation) {
        $scope.formation = formation;
        $scope.copyFormation = false;
        var originalFormationKey = formation.key;
        var originalFormationName = formation.name;
        var originalFormationGuid = formation.guid;
        $scope.copyFormationChange = function () {
            $scope.formation.key = $scope.copyFormation ? -1 : originalFormationKey;
            $scope.formation.name = $scope.copyFormation ?
                $scope.formation.name + ' (copy)' :
                originalFormationName;
            $scope.formation.guid = $scope.copyFormation ?
                Common.Utilities.guid() :
                originalFormationGuid;
        };
        $scope.ok = function () {
            var options = {
                formation: {
                    action: formation.modified ?
                        Common.API.Actions.Overwrite :
                        Common.API.Actions.Nothing // do nothing if no changes
                }
            };
            if ($scope.copyFormation) {
                options.formation.action = Common.API.Actions.Copy;
            }
            _playbook.saveFormation($scope.formation, options)
                .then(function (savedFormation) {
                if ($scope.copyFormation) {
                    var contextFormation = impakt.context.Playbook.formations.get(savedFormation.guid);
                    if (contextFormation) {
                        // add new copied formation as new tab in editor
                        _playbook.editFormation(contextFormation);
                    }
                }
                console.log(savedFormation);
                $uibModalInstance.close(savedFormation);
            }, function (err) {
                console.error(err);
                $uibModalInstance.close(err);
            });
        };
        $scope.cancel = function () {
            $scope.formation.key = originalFormationKey;
            $scope.formation.name = originalFormationName;
            $uibModalInstance.dismiss();
        };
    }]);
/// <reference path='../playbook-modals.mdl.ts' />
impakt.playbook.modals.controller('playbook.modals.savePlay.ctrl', [
    '$scope',
    '$uibModalInstance',
    '_playbook',
    'play',
    function ($scope, $uibModalInstance, _playbook, play) {
        $scope.play = play;
        $scope.copyPlay = false;
        $scope.copyFormation = false;
        $scope.copyPersonnel = false;
        $scope.copyAssignments = false;
        // retain the orginal keys for toggling copy state
        var originalPlayKey = $scope.play.key;
        var originalFormationKey = $scope.play.formation.key;
        var originalAssignmentsKey = $scope.play.assignments.key;
        $scope.copyPlayChange = function () {
            $scope.play.key =
                $scope.copyPlay ? -1 :
                    originalPlayKey;
        };
        $scope.copyFormationChange = function () {
            $scope.play.formation.key =
                $scope.copyFormation ? -1 :
                    originalFormationKey;
        };
        $scope.copyAssignmentsChange = function () {
            $scope.play.assignments.key =
                $scope.copyAssignments ? -1 :
                    originalAssignmentsKey;
        };
        $scope.ok = function () {
            var play = $scope.play;
            // determine whether there are changes to the entity; if so,
            // set action to overwrite, otherwise set action to nothing
            // track options for how to send the data to the server
            // TO-DO: create a better model for this
            var options = {
                play: {
                    action: play.modified ? Common.API.Actions.Overwrite : Common.API.Actions.Nothing
                },
                formation: {
                    action: play.formation.modified ? Common.API.Actions.Overwrite : Common.API.Actions.Nothing
                },
                // TO-DO: implement assignments
                assignments: {
                    action: Common.API.Actions.Nothing
                }
            };
            // If any of the following entities (play, formation, assignments)
            // exist on the play and their corresponding copy boolean
            // (copyPlay, copyFormation, copyPersonnel, copyAssignments) is set to true,
            // a new corresponding entity (Play, Formation, Assigments)
            // will be created and the new entity will have its values copied 
            // from the existing entity.
            // this new copied entity gets sent to server-side for creation.
            if ($scope.play && $scope.copyPlay) {
                originalPlayKey = $scope.play.key;
                $scope.play.key = -1;
                options.play.action = Common.API.Actions.Copy;
                play = $scope.play;
            }
            if ($scope.play.formation && $scope.copyFormation) {
                originalFormationKey = $scope.play.formation.key;
                $scope.play.formation.key = -1;
                options.formation.action = Common.API.Actions.Copy;
                play.formation = $scope.formation;
            }
            if ($scope.play.assignments && $scope.copyAssignments) {
                console.error('save play assignments not implemented');
            }
            _playbook.savePlay(play, options)
                .then(function (savedPlay) {
                $uibModalInstance.close(savedPlay);
            }, function (err) {
                console.error(err);
                $uibModalInstance.close(err);
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Dimensions = (function () {
            function Dimensions(width, height) {
                this.width = width || 0;
                this.height = height || 0;
            }
            Dimensions.prototype.setWidth = function (width) {
                return this.setDimensions(width, this.height).width;
            };
            ;
            Dimensions.prototype.setHeight = function (height) {
                return this.setDimensions(this.width, height).height;
            };
            ;
            Dimensions.prototype.setDimensions = function (width, height) {
                if (width <= 0) {
                    throw new Error('Width cannot be negative');
                }
                if (height <= 0) {
                    throw new Error('Height cannot be negative');
                }
                this.width = width;
                this.height = height;
                return this;
            };
            ;
            Dimensions.prototype.getWidth = function () {
                return this.width;
            };
            ;
            Dimensions.prototype.getHeight = function () {
                return this.height;
            };
            ;
            return Dimensions;
        })();
        Models.Dimensions = Dimensions;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../playbook.mdl.ts' />
impakt.playbook.nav = angular.module('impakt.playbook.nav', [])
    .config(function () {
    console.debug('impakt.playbook.nav - config');
})
    .run(function () {
    console.debug('impakt.playbook.nav - run');
});
/// <reference path='./playbook-nav.mdl.ts' />
impakt.playbook.nav.controller('playbook.nav.ctrl', ['$scope', '$location', '_playbook', '_playbookNav',
    function ($scope, $location, _playbook, _playbookNav) {
    }]);
/// <reference path='../../nav/nav.fct.ts' />
/// <reference path='./playbook-nav.mdl.ts' />
impakt.playbook.nav.service('_playbookNav', ['__nav', '_playbook', function (__nav, _playbook) {
        console.log('_playbookNav (component service)');
    }]);
/// <reference path='./playbook.mdl.ts' />
/**
 * Playbook constants defined here
 */
impakt.playbook.constant('PLAYBOOK', {
    //GET_PLAYBOOKS: 'data/playbook.json',
    ENDPOINT: '/playbook',
    // Playbooks
    CREATE_PLAYBOOK: '/createPlaybook',
    GET_PLAYBOOKS: '/getPlaybooks',
    GET_PLAYBOOK: '/getPlaybook',
    DELETE_PLAYBOOK: '/deletePlaybook',
    // Formations
    CREATE_FORMATION: '/createFormation',
    GET_FORMATIONS: '/getFormations',
    GET_FORMATION: '/getFormation',
    DELETE_FORMATION: '/deleteFormation',
    UPDATE_FORMATION: '/updateFormation',
    // Sets
    CREATE_SET: '/createSet',
    GET_SETS: '/getSets',
    UPDATE_SET: '/updateSet',
    DELETE_SET: '/deleteSet',
    // Plays
    CREATE_PLAY: '/createPlay',
    UPDATE_PLAY: '/updatePlay',
    GET_PLAY: '/getPlay',
    GET_PLAYS: '/getPlays',
    DELETE_PLAY: '/deletePlay'
});
/// <reference path='./playbook.mdl.ts' />
impakt.playbook.controller('playbook.ctrl', ['$scope', '$state', '$stateParams', '_playbook',
    function ($scope, $state, $stateParams, _playbook) {
        // load up the browser by default
        $state.go('playbook.browser');
    }]);
/// <reference path='./models/models.ts' />
/// <reference path='./playbook.ts' />
// Playbook service
impakt.playbook.service('_playbook', [
    'PLAYBOOK',
    '$rootScope',
    '$q',
    '$state',
    '__api',
    '__localStorage',
    '__notifications',
    function (PLAYBOOK, $rootScope, $q, $state, __api, __localStorage, __notifications) {
        var self = this;
        // TODO @theBull - ensure the 'current user' is being addressed
        // TODO @theBull - add notification handling
        /**
         * Retrieves all playbooks for the current user
         */
        this.getPlaybooks = function () {
            var d = $q.defer();
            var notification = __notifications.pending('Getting playbooks...');
            __api.get(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.GET_PLAYBOOKS))
                .then(function (response) {
                var collection = new Playbook.Models.PlaybookModelCollection();
                if (response && response.data && response.data.results) {
                    var playbookResults = Common.Utilities.parseData(response.data.results);
                    for (var i = 0; i < playbookResults.length; i++) {
                        var playbookResult = playbookResults[i];
                        if (playbookResult && playbookResult.data && playbookResult.data.model) {
                            var playbookModel = new Playbook.Models.PlaybookModel();
                            playbookResult.data.model.key = playbookResult.key;
                            playbookModel.fromJson(playbookResult.data.model);
                            collection.add(playbookModel);
                        }
                    }
                }
                notification.success([collection.size(), ' Playbooks successfully retreived'].join(''));
                d.resolve(collection);
            }, function (error) {
                notification.error('Failed to retieve Playbooks');
                console.error(error);
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Gets a single playbook with the given key
         * @param {number} key The key of the playbook to retrieve
         */
        this.getPlaybook = function (key) {
            var d = $q.defer();
            __api.get(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.GET_PLAYBOOK, '/' + key))
                .then(function (response) {
                var playbook = Common.Utilities.parseData(response.data.results);
                d.resolve(playbook);
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Sends a playbook model to the server for storage
         * @param {Playbook.Models.PlaybookModel} playbookModel The model to be created/saved
         */
        this.createPlaybook = function (playbookModel) {
            var d = $q.defer();
            // set key to -1 to ensure a new object is created server-side
            playbookModel.key = -1;
            var playbookModelJson = playbookModel.toJson();
            var notification = __notifications.pending('Creating playbook "', playbookModel.name, '"...');
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.CREATE_PLAYBOOK), {
                version: 1,
                name: playbookModel.name,
                data: {
                    version: 1,
                    model: playbookModelJson
                }
            })
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var playbook = new Playbook.Models.PlaybookModel();
                if (results && results.data && results.data.model) {
                    playbook.fromJson(results.data.model);
                    // update the context
                    impakt.context.Playbook.playbooks.add(playbook);
                }
                else {
                    throw new Error('CreatePlaybook did not return a valid playbook model');
                }
                notification.success('Successfully created playbook "', playbook.name, '"');
                d.resolve(playbook);
            }, function (error) {
                notification.error('Failed to create playbook "', playbookModel.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Deletes the given playbook for the current user
         * @param {Playbook.Models.PlaybookModel} playbook The playbook to be deleted
         */
        this.deletePlaybook = function (playbook) {
            var d = $q.defer();
            var notification = __notifications.pending('Deleting playbook "', playbook.name, '"...');
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.DELETE_PLAYBOOK), { key: playbook.key }).then(function (response) {
                // update the context
                impakt.context.Playbook.playbooks.remove(playbook.guid);
                notification.success('Deleted playbook "', playbook.name, '"');
                d.resolve(playbook);
            }, function (error) {
                notification.error('Failed to delete playbook "', playbook.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Creates the given formation for the current user
         * @param {Playbook.Models.Formation} newFormation The formation to be created
         */
        this.createFormation = function (newFormation) {
            var d = $q.defer();
            if (newFormation.key > 0) {
                throw new Error('The formation you are trying to create already exists (key > 0) key: '
                    + newFormation.key);
            }
            var notification = __notifications.pending('Creating formation "', newFormation.name, '"...');
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.CREATE_FORMATION), {
                version: 1,
                name: newFormation.name,
                ownerRK: 1,
                parentRK: 1,
                data: {
                    version: 1,
                    name: newFormation.name,
                    ownerRK: 1,
                    parentRK: 1,
                    formation: newFormation.toJson()
                }
            })
                .then(function (response) {
                var result = Common.Utilities.parseData(response.data.results);
                if (!result || !result.data || !result.data.formation) {
                    d.reject('Create playbook result was invalid');
                }
                var formationModel = new Playbook.Models.Formation();
                formationModel.fromJson(result.data.formation);
                console.log(formationModel);
                impakt.context.Playbook.formations.add(formationModel);
                notification.success('Successfully created formation "', formationModel.name, '"');
                self.editFormation(formationModel);
                d.resolve(formationModel);
            }, function (error) {
                notification.error('Failed to create formation "', newFormation.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Deletes the given formation for the current user
         * @param {Playbook.Models.Formation} formation The formation to be deleted
         */
        this.deleteFormation = function (formation) {
            var d = $q.defer();
            var notification = __notifications.pending('Deleting formation "', formation.name, '"...');
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.DELETE_FORMATION), {
                key: formation.key
            })
                .then(function (response) {
                var formationKey = response.data.results.key;
                // TODO @theBull
                // Deleting a formation will adversely impakt all plays that are
                // associated with that formation...How do we handle this?
                // update the context
                impakt.context.Playbook.formations.remove(formation.guid);
                notification.success('Successfully deleted formation "', formation.name, '"');
                d.resolve(formationKey);
            }, function (error) {
                notification.error('Failed to delete formation "', formation.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Retrieves all formations for the current user
         */
        this.getFormations = function () {
            var d = $q.defer();
            var notification = __notifications.pending('Getting Formations...');
            __api.get(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.GET_FORMATIONS, '?$filter=ParentRK gt 0'))
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var collection = new Playbook.Models.FormationCollection();
                var formations = [];
                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    if (result && result.data && result.data.formation) {
                        var formation = result.data.formation;
                        formation.key = result.key;
                        formations.push(formation);
                    }
                    else {
                        throw new Error('An invalid formation was retrieved');
                    }
                }
                collection.fromJson(formations);
                notification.success(collection.size(), ' Formations successfully retrieved');
                d.resolve(collection);
            }, function (error) {
                notification.error('Failed to retrieve Formations');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Retrieves the formation with the given key for the current user
         * @param {[type]} key The key to retrieve
         */
        this.getFormation = function (key) {
            var d = $q.defer();
            __api.get(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.GET_FORMATION, '?Key=' + key))
                .then(function (response) {
                var rawResults = Common.Utilities.parseData(response.data.results);
                var formationRaw = (JSON.parse(rawResults.data)).formation;
                var formationModel = new Playbook.Models.Formation();
                formationModel.fromJson(formationRaw);
                d.resolve(formationModel);
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        };
        this.newFormation = function () {
        };
        /**
         * Opens the given formation for editing / navigates to the play editor
         * @param {Playbook.Models.Formation} formation The formation to be edited
         */
        this.editFormation = function (formation, forceOpen) {
            // determine whether the formation is already open            
            var formationOpen = forceOpen ? forceOpen : impakt.context.Playbook.editor.plays.hasElementWhich(function (play) {
                return play.editorType == Playbook.Editor.EditorTypes.Formation &&
                    play.formation.guid == formation.guid;
            });
            // do not add a new editor play to the context if the formation
            // is already open
            if (!formationOpen) {
                // formation isn't opened yet,
                // 1. create new play for the formation to sit in
                // 2. create a working copy of the formation
                // 3. update the working copy's properties accordingly
                // 4. add the working play to the editor context
                // Set Play to formation-only editing mode
                var play = new Playbook.Models.PlayPrimary();
                // need to make a copy of the formation here
                var formationCopy = formation.copy();
                play.setFormation(formationCopy);
                play.editorType = Playbook.Editor.EditorTypes.Formation;
                play.unitType = formation.unitType;
                play.name = formation.name;
                // add the play onto the editor context
                impakt.context.Playbook.editor.plays.add(play);
            }
            // navigate to playbook editor
            //if(!$state.is('playbook.editor'))
            $state.transitionTo('playbook.editor');
        };
        /**
         * Updates the given formation for the current user
         * @param {Playbook.Models.Formation} formation The formation to update
         */
        this.updateFormation = function (formation) {
            var d = $q.defer();
            // update assignment collection to json object
            var formationData = formation.toJson();
            var notification = __notifications.pending('Updating formation');
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.UPDATE_FORMATION), {
                version: 1,
                name: formationData.name,
                key: formationData.key,
                data: {
                    version: 1,
                    name: formationData.name,
                    key: formationData.key,
                    formation: formationData
                }
            })
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var formationModel = new Playbook.Models.Formation();
                if (results && results.data && results.data.formation) {
                    formationModel.fromJson(results.data.formation);
                    // update the context
                    impakt.context.Playbook.formations.set(formationModel.guid, formationModel);
                }
                notification.success('Successfully updated formation "', formation.name, '"');
                d.resolve(formationModel);
            }, function (error) {
                notification.error('Failed to update formation "', formation.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Saves the given formation according to the options passed for the given user
         * TODO @theBull create Options model
         *
         * @param {Playbook.Models.Formation} formation    Formation to save
         * @param {any}                  options Save options
         */
        this.saveFormation = function (formation, options) {
            var d = $q.defer();
            var notification = __notifications.pending('Saving formation "', formation.name, '"...');
            if (options.formation.action == Common.API.Actions.Create ||
                options.formation.action == Common.API.Actions.Copy) {
                // ensure formation has no key
                formation.key = -1;
                // ensure formation has a unique guid
                formation.guid = Common.Utilities.guid();
                self.createFormation(formation)
                    .then(function (createdFormation) {
                    notification.success('Successfully created and saved formation "', formation.name, '"');
                    d.resolve(createdFormation);
                }, function (err) {
                    notification.error('Failed to save formation "', formation.name, '"');
                    d.reject(err);
                });
            }
            else if (options.formation.action == Common.API.Actions.Overwrite) {
                // double check that the formation is  modified
                if (formation.modified) {
                    self.updateFormation(formation)
                        .then(function (updatedFormation) {
                        notification.success('Successfully saved formation "', formation.name, '"');
                        d.resolve(updatedFormation);
                    }, function (err) {
                        notification.error('Failed to save formation "', formation.name, '"');
                        d.reject(err);
                    });
                }
                else {
                    notification.warning('Formation "', formation.name, '" was not saved; no changes were detected.');
                    d.reject(null);
                }
            }
            return d.promise;
        };
        /**
         * Retrieves all sets (for the given playbook?) of the current user
         * @param {[type]} playbook ???
         */
        this.getSets = function (playbook) {
            var d = $q.defer();
            var personnelNotification = __notifications.pending('Getting Personnel...');
            var assignmentsNotification = __notifications.pending('Getting Assignments...');
            __api.get(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.GET_SETS))
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var personnelResults = [];
                var personnelCollection = new Playbook.Models.PersonnelCollection();
                var assignmentResults = [];
                var assignmentCollection = new Playbook.Models.AssignmentCollection();
                // get personnel & assignments from `sets`
                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    if (result && result.data) {
                        var data = result.data;
                        switch (data.setType) {
                            case Playbook.Editor.SetTypes.Personnel:
                                data.personnel.key = result.key;
                                personnelResults.push(data.personnel);
                                break;
                            case Playbook.Editor.SetTypes.Assignment:
                                data.assignment.key = result.key;
                                assignmentResults.push(data.assignment);
                                break;
                        }
                    }
                }
                for (var i_2 = 0; i_2 < personnelResults.length; i_2++) {
                    var personnel = personnelResults[i_2];
                    var personnelModel = new Playbook.Models.Personnel();
                    personnelModel.fromJson(personnel);
                    personnelCollection.add(personnelModel);
                }
                for (var i_3 = 0; i_3 < assignmentResults.length; i_3++) {
                    var assignment = assignmentResults[i_3];
                    var assignmentModel = new Playbook.Models.Assignment();
                    assignmentModel.fromJson(assignment);
                    assignmentCollection.add(assignmentModel);
                }
                personnelNotification.success(personnelCollection.size(), ' Personnel groups successfully retrieved');
                assignmentsNotification.success(assignmentCollection.size(), ' Assignment sets successfully retrieved');
                d.resolve({
                    personnel: personnelCollection,
                    assignments: assignmentCollection
                });
            }, function (error) {
                personnelNotification.error('Failed to retrieve Personnel groups');
                assignmentsNotification.error('Failed to retrieve Assignment groups');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Creates a set (TO-DO)
         * @param {[type]} set The set to create
         */
        this.createSet = function (set) {
            var d = $q.defer();
            var notification = __notifications.pending('Creating set "', set.name, '"...');
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.CREATE_SET), {
                version: 1,
                name: set.name,
                ownerRK: 1,
                parentRK: 1,
                data: {
                    version: 1,
                    name: set.name,
                    ownerRK: 1,
                    parentRK: 1,
                    set: set
                }
            })
                .then(function (response) {
                var set = Common.Utilities.parseData(response.data.results);
                // let setModel = new Playbook.Models.Set(
                //     set.name, set.type, set.positions
                // );
                // setModel.fromJson(set);
                throw new Error('createSet not implemented');
                notification.success('Successfully created set "', set.name, '"');
                d.resolve(null);
            }, function (error) {
                notification.success('Failed to create set "', set.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Creates the given play for the current user
         * @param {Playbook.Models.Play} play The play to create
         */
        this.createPlay = function (play) {
            var playData = play.toJson();
            var d = $q.defer();
            var notification = __notifications.pending('Creating play "', play.name, '"...');
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.CREATE_PLAY), {
                version: 1,
                name: play.name,
                ownerRK: 1,
                parentRK: 1,
                data: {
                    version: 1,
                    name: play.name,
                    ownerRK: 1,
                    parentRK: 1,
                    play: playData
                }
            })
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var playModel = null;
                if (results && results.data && results.data.play) {
                    playModel = new Playbook.Models.Play();
                    playModel.fromJson(results.data.play);
                    playModel.key = results.key;
                    impakt.context.Playbook.plays.add(playModel);
                }
                notification.success('Successfully created play "', play.name, '"');
                d.resolve(playModel);
            }, function (error) {
                notification.error('Failed to create play "', play.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Saves the given play according to the options passed for the given user
         * TODO @theBull create Options model
         *
         * @param {Playbook.Models.Play} play    [description]
         * @param {any}                  options [description]
         */
        this.savePlay = function (play, options) {
            var d = $q.defer();
            var notification = __notifications.pending('Saving play "', play.name, '"...');
            async.parallel([
                // 
                // Save formation
                // 
                // 
                // Save formation
                // 
                function (callback) {
                    // create, copy, or overwrite?
                    if (options.formation.action == Common.API.Actions.Create ||
                        options.formation.action == Common.API.Actions.Copy) {
                        // ensure playbook.formation has no key
                        play.formation.key = -1;
                        self.createFormation(play.formation)
                            .then(function (createdFormation) {
                            play.formation = createdFormation;
                            callback(null, play);
                        }, function (err) {
                            callback(err);
                        });
                    }
                    else if (options.formation.action == Common.API.Actions.Overwrite) {
                        if (play.formation.modified) {
                            self.updateFormation(play.formation)
                                .then(function (updatedFormation) {
                                callback(null, play);
                            }, function (err) {
                                callback(err);
                            });
                        }
                        else {
                            callback(null, play);
                        }
                    }
                    else {
                        callback(null, play);
                    }
                },
                // save personnel
                // function(callback) {
                //     console.warn('Save Play > Personnel not implemented, skipping...');
                //     callback(null, play);
                // },
                // // save assignments
                // function(callback) {
                //     console.warn('Save Play > Assignments not implemented, skipping...');
                //     callback(null, play);
                // },
                // save play
                // save personnel
                // function(callback) {
                //     console.warn('Save Play > Personnel not implemented, skipping...');
                //     callback(null, play);
                // },
                // // save assignments
                // function(callback) {
                //     console.warn('Save Play > Assignments not implemented, skipping...');
                //     callback(null, play);
                // },
                // save play
                function (callback) {
                    if (options.play.action == Common.API.Actions.Create ||
                        options.play.action == Common.API.Actions.Copy) {
                        // ensure play has no key
                        play.key = -1;
                        self.createPlay(play)
                            .then(function (createdPlay) {
                            callback(null, createdPlay);
                        }, function (err) {
                            callback(err);
                        });
                    }
                    else if (options.play.action == Common.API.Actions.Overwrite) {
                        if (play.modified) {
                            self.updatePlay(play)
                                .then(function (updatedPlay) {
                                callback(null, updatedPlay);
                            }, function (err) {
                                callback(err);
                            });
                        }
                        else {
                            callback(null, play);
                        }
                    }
                    else {
                        callback(null, play);
                    }
                }
            ], function (err, results) {
                if (err) {
                    notification.error('Failed to save play "', play.name, '"');
                    d.reject(err);
                }
                else {
                    notification.success('Successfully saved play "', play.name, '"');
                    d.resolve(results);
                }
            });
            return d.promise;
        };
        /**
         * Updates the given play for the current user
         * @param {Playbook.Models.Play} play The play to update
         */
        this.updatePlay = function (play) {
            var d = $q.defer();
            var notification = __notifications.pending('Updating play "', play.name, '"...');
            var playData = play.toJson();
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.UPDATE_PLAY), {
                version: 1,
                name: play.name,
                key: play.key,
                data: {
                    version: 1,
                    name: play.name,
                    key: play.key,
                    play: playData
                }
            })
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var playModel = new Playbook.Models.Play();
                if (results && results.data && results.data.play) {
                    playModel.fromJson(results.data.play);
                    // update the context
                    impakt.context.Playbook.plays.set(playModel.guid, playModel);
                }
                notification.success('Successfully updated play "', playModel.name, '"');
                d.resolve(playModel);
            }, function (error) {
                notification.error('Failed to update play "', play.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Retrieves all plays for the current user
         */
        this.getPlays = function () {
            var d = $q.defer();
            var notification = __notifications.pending('Getting Plays...');
            __api.get(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.GET_PLAYS))
                .then(function (response) {
                var playCollection = new Playbook.Models.PlayCollection();
                if (response && response.data && response.data.results) {
                    var results = Common.Utilities.parseData(response.data.results);
                    if (results) {
                        var rawPlays = results;
                        for (var i = 0; i < results.length; i++) {
                            var result = results[i];
                            if (result && result.data && result.data.play) {
                                var playModel = new Playbook.Models.Play();
                                playModel.fromJson(result.data.play);
                                playModel.key = result.key;
                                playCollection.add(playModel);
                            }
                        }
                    }
                }
                notification.success(playCollection.size(), ' Plays successfully retrieved');
                d.resolve(playCollection);
            }, function (error) {
                notification.error('Failed to retrieve Plays');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Prepares the given play to be opened in the play editor
         * @param {Playbook.Models.Play} play The play to be edited
         */
        this.editPlay = function (play) {
            // Set Play to play editing mode
            play.editorType = Playbook.Editor.EditorTypes.Play;
            if (!play.formation) {
                var associatedFormation = play.associated.formations.primary();
                if (associatedFormation) {
                    play.formation = impakt.context.Playbook.formations.get(associatedFormation);
                }
            }
            if (!play.personnel) {
                var associatedPersonnel = play.associated.personnel.primary();
                if (associatedPersonnel) {
                    play.personnel = impakt.context.Playbook.personnel.get(associatedPersonnel);
                }
            }
            // add the play onto the editor context
            impakt.context.Playbook.editor.plays.add(play);
            // navigate to playbook editor
            //if (!$state.is('playbook.editor'))
            $state.transitionTo('playbook.editor');
        };
        /**
         * Deletes the given play for the current user
         * @param {Playbook.Models.Play} play The play to be deleted
         */
        this.deletePlay = function (play) {
            var d = $q.defer();
            var notification = __notifications.pending('Deleting play "', play.name, '"...');
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.DELETE_PLAY), {
                key: play.key
            })
                .then(function (response) {
                var playKey = response.data.results.key;
                // update the context
                impakt.context.Playbook.plays.remove(play.guid);
                notification.success('Successfully deleted play "', play.name, '"');
                d.resolve(play);
            }, function (error) {
                notification.error('Failed to delete play "', play.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Returns a list of all unit types
         */
        this.getUnitTypes = function () {
            return new Playbook.Models.UnitTypeCollection();
        };
        /**
         * Returns an list of all unit types
         */
        this.getUnitTypesEnum = function () {
            var typeEnums = {};
            for (var unitType in Playbook.Editor.UnitTypes) {
                if (unitType >= 0)
                    typeEnums[parseInt(unitType)]
                        = Common.Utilities.camelCaseToSpace(Playbook.Editor.UnitTypes[unitType], true);
            }
            return typeEnums;
        };
        /**
         * Returns a class for the given editorType
         * @param {Playbook.Editor.EditorTypes} editorType Editor Type enum
         */
        this.getEditorTypeClass = function (editorType) {
            var editorTypeClass = '';
            switch (editorType) {
                case Playbook.Editor.EditorTypes.Formation:
                    editorTypeClass = 'playbook-editor-type-formation';
                    break;
                case Playbook.Editor.EditorTypes.Assignment:
                    editorTypeClass = 'playbook-editor-type-assignment';
                    break;
                case Playbook.Editor.EditorTypes.Play:
                    editorTypeClass = 'playbook-editor-type-play';
                    break;
            }
            return editorTypeClass;
        };
        /**
         * Navigates to the playbook editor
         */
        this.toEditor = function () {
            $state.transitionTo('playbook.editor');
        };
        /**
         * Refreshes the playbook editor
         */
        this.refreshEditor = function () {
            $rootScope.$broadcast('playbook-editor.refresh');
        };
        /**
         * Navigates to the playbook browser
         */
        this.toBrowser = function () {
            $state.transitionTo('playbook.browser');
        };
        /**
         * Navigates to the team module
         */
        this.toTeam = function () {
            $state.transitionTo('team');
        };
    }]);
/// <reference path='../modules.mdl.ts' />
impakt.search = angular.module('impakt.search', []);
/// <reference path='./search.mdl.ts' />
impakt.search.controller('search.ctrl', ['$scope', function ($scope) {
        $scope.title = 'Results';
        $scope.query = '';
        $scope.results = [
            1, 2, 3, 4, 5
        ];
    }]);
/// <reference path='../modules.mdl.ts' />
impakt.modules = angular.module('impakt.season', [])
    .config([function () {
        console.debug('impakt.season - config');
    }])
    .run(function () {
    console.debug('impakt.season - run');
});
/// <reference path='../playbook/playbook.ts' />
/// <reference path='../modules.mdl.ts' />
/// <reference path='./team.ts' />
impakt.team = angular.module('impakt.team', [
    'impakt.team.personnel',
    'impakt.team.unitTypes'
])
    .config([function () {
        console.debug('impakt.team - config');
    }])
    .run(function () {
    console.debug('impakt.team - run');
});
/// <reference path='../team.mdl.ts' />
impakt.team.personnel = angular.module('impakt.team.personnel', [
    'impakt.team.personnel.create'
])
    .config([function () {
        console.debug('impakt.team.create -- config');
    }])
    .run([function () {
        console.debug('impakt.team.create -- run');
    }]);
/// <reference path='../team-personnel.mdl.ts' />
impakt.team.personnel.create = angular.module('impakt.team.personnel.create', [])
    .config([function () {
        console.debug('impakt.team.create -- config');
    }])
    .run([function () {
        console.debug('impakt.team.create -- run');
    }]);
/// <reference path='./team-personnel-create.mdl.ts' />
impakt.team.personnel.create.controller('impakt.team.personnel.create.ctrl', [
    '$scope',
    '_team',
    function ($scope, _team) {
        console.debug('impakt.team.personnel.create.ctrl');
    }
]);
/// <reference path='./team-personnel.mdl.ts' />
impakt.team.personnel.controller('impakt.team.personnel.ctrl', [
    '$scope',
    '_team',
    function ($scope, _team) {
        console.debug('impakt.team.personnel.ctrl');
        $scope.personnelCollection = _team.personnel;
        $scope.personnel = _team.personnel.getOne() || new Playbook.Models.Personnel();
        $scope.selectedPersonnel = {
            guid: $scope.personnel.guid,
            unitType: $scope.personnel.unitType.toString()
        };
        $scope.unitTypes = Playbook.Models.UnitType.getUnitTypes();
        var positionDefault = new Playbook.Models.PositionDefault();
        $scope.positionOptions = positionDefault.getByUnitType($scope.personnel.unitType);
        $scope.createNew = false;
        $scope.creating = false;
        $scope.cancelCreate = function () {
            $scope.creating = false;
        };
        $scope.createPersonnel = function () {
            $scope.personnel = new Playbook.Models.Personnel();
            $scope.creating = true;
            $scope.selectedPersonnel.unitType = $scope.personnel.unitType;
            $scope.createNew = true;
        };
        $scope.selectPersonnel = function () {
            $scope.createNew = false;
            console.log($scope.selectedPersonnel.guid);
            if ($scope.selectedPersonnel.guid) {
                $scope.personnel = null;
                $scope.personnel = $scope.personnelCollection.get($scope.selectedPersonnel.guid);
                $scope.selectedPersonnel.unitType = $scope.personnel.unitType.toString();
                $scope.positionOptions = positionDefault.getByUnitType($scope.personnel.unitType);
            }
        };
        $scope.selectUnitType = function () {
            $scope.personnel.setUnitType(parseInt($scope.selectedPersonnel.unitType));
            $scope.positionOptions = positionDefault.getByUnitType($scope.personnel.unitType);
        };
        $scope.update = function (position, index) {
            var updated = impakt.context.Playbook.positionDefaults.switchPosition(position, position.positionListValue);
            console.log(position, updated);
            $scope.personnel.positions.replace(position.guid, updated);
        };
        $scope.save = function () {
            console.log($scope.personnel);
            _team.savePersonnel($scope.personnel, $scope.createNew).then(function (results) {
                console.log(results);
            }, function (err) {
                console.error(err);
            });
        };
        $scope.deletePersonnel = function (personnelItem) {
            console.log('deleting personnel', personnelItem);
            _team.deletePersonnel(personnelItem).then(function (results) {
                console.log(results);
            }, function (err) {
                console.error(err);
            });
        };
    }
]);
/// <reference path='./team.mdl.ts' />
/**
 * Team constants defined here
 */
impakt.team.constant('TEAM', {
    ENDPOINT: '/playbook',
});
/// <reference path='./team.mdl.ts' />
impakt.team.controller('team.ctrl', ['$scope', '_team',
    function ($scope, _team) {
        $scope.title = 'Team Management';
        $scope.tabs = {
            personnel: {
                title: 'Personnel groups',
                active: true,
                src: "modules/team/personnel/team-personnel.tpl.html"
            },
            unitTypes: {
                title: 'Unit types',
                active: false,
                src: "modules/team/unit-types/team-unit-types.tpl.html"
            }
        };
        $scope.activate = function (tab) {
            for (var key in $scope.tabs) {
                var obj = $scope.tabs[key];
                if (obj.active)
                    obj.active = false;
            }
            tab.active = true;
        };
    }]);
/// <reference path='./team.mdl.ts' />
// Team service
impakt.team.service('_team', ['$q', 'PLAYBOOK', 'TEAM', '__api', '__notifications',
    function ($q, PLAYBOOK, TEAM, __api, __notifications) {
        this.personnel = impakt.context.Playbook.personnel;
        this.savePersonnel = function (personnelModel, createNew) {
            var d = $q.defer();
            var result;
            if (createNew) {
                personnelModel.key = 0;
                personnelModel.guid = Common.Utilities.guid();
                result = this.createPersonnel(personnelModel);
            }
            else {
                result = this.updatePersonnel(personnelModel);
            }
            result.then(function (results) {
                d.resolve(results);
            }, function (err) {
                d.reject(err);
            });
            return d.promise;
        };
        this.createPersonnel = function (personnelModel) {
            var d = $q.defer();
            var personnelJson = personnelModel.toJson();
            var notification = __notifications.pending('Creating personnel group "', personnelModel.name, '"...');
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.CREATE_SET), {
                version: 1,
                ownerRK: 1,
                parentRK: 1,
                name: personnelJson.name,
                data: {
                    setType: Playbook.Editor.SetTypes.Personnel,
                    personnel: personnelJson,
                    name: personnelJson.name,
                    version: 1,
                    ownerRK: 1,
                    parentRK: 1
                }
            })
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var personnelModel = new Playbook.Models.Personnel();
                if (results && results.data && results.data.personnel) {
                    results.data.personnel.key = results.key;
                    personnelModel.fromJson(results.data.personnel);
                }
                impakt.context.Playbook.personnel.add(personnelModel);
                notification.success('Personnel group "', personnelModel.name, '" successfully created');
                d.resolve(personnelModel);
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        };
        this.updatePersonnel = function (personnelModel) {
            var d = $q.defer();
            var personnelJson = personnelModel.toJson();
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.UPDATE_SET), {
                version: 1,
                name: personnelJson.name,
                key: personnelJson.key,
                data: {
                    setType: Playbook.Editor.SetTypes.Personnel,
                    personnel: personnelJson,
                    name: personnelJson.name,
                    key: personnelJson.key,
                    version: 1
                }
            })
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var personnelModel = new Playbook.Models.Personnel();
                if (results && results.data && results.data.personnel) {
                    personnelModel.fromJson(results.data.personnel);
                }
                impakt.context.Playbook.personnel.set(personnelModel.guid, personnelModel);
                d.resolve(personnelModel);
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        };
        this.deletePersonnel = function (personnel) {
            var d = $q.defer();
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.DELETE_SET), { key: personnel.key }).then(function (response) {
                impakt.context.Playbook.personnel.remove(personnel.guid);
                d.resolve(response);
            }, function (err) {
                d.reject(err);
            });
            return d.promise;
        };
    }]);
/// <reference path='../team.mdl.ts' />
impakt.team.unitTypes = angular.module('impakt.team.unitTypes', [])
    .config([function () {
        console.debug('impakt.team.unitTypes - config');
    }])
    .run([function () {
        console.debug('impakt.team.unitTypes - run');
    }]);
/// <reference path='./team-unit-types.mdl.ts' />
impakt.team.unitTypes.controller('impakt.team.unitTypes.ctrl', [
    '$scope',
    '_team',
    function ($scope, _team) {
        $scope.unitTypes = impakt.context.Playbook.unitTypes.toArray();
    }
]);
/// <reference path='../modules.mdl.ts' />
impakt.user = angular.module('impakt.user', [
    'impakt.user.login',
    'impakt.user.modals'
])
    .config(function () {
    console.log('impakt.user -- config');
})
    .run(function () {
    console.log('impakt.user -- run');
});
/// <reference path='../user.mdl.ts' />
impakt.user.login = angular.module('impakt.user.login', [])
    .config(function () {
    console.debug('impakt.user.login - config');
})
    .run(function () {
    console.debug('impakt.user.login - run');
});
/// <reference path='./user-login.mdl.ts' />
impakt.user.login.controller('user.login.ctrl', ['$scope', function ($scope) {
    }]);
/// <reference path='../user.mdl.ts' />
impakt.user.modals = angular.module('impakt.user.modals', [])
    .config(function () {
    console.debug('impakt.user.modals - config');
})
    .run(function () {
    console.debug('impakt.user.modals - run');
});
/// <reference path='../user-modals.mdl.ts' />
impakt.user.modals.controller('user.modals.selectOrganization.ctrl', [
    '$scope',
    '$uibModalInstance',
    '_user',
    function ($scope, $uibModalInstance, _user) {
        $scope.selectedOrganization = _user.selectedOrganization;
        $scope.organizations = _user.organizations;
        $scope.organizationSelected = function () {
            console.log('selected organization', $scope.selectedOrganization);
        };
        $scope.ok = function () {
            _user.selectOrganization($scope.selectedOrganization)
                .then(function (selectedOrganization) {
                $uibModalInstance.close(selectedOrganization);
            }, function (err) {
                $uibModalInstance.close(err);
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
/// <reference path='./user-modals.mdl.ts' />
impakt.user.modals.service('_userModals', [
    '__modals',
    function (__modals) {
        /**
         *
         * PLAYBOOK
         *
         */
        this.selectOrganization = function () {
            var modalInstance = __modals.open('', 'modules/user/modals/select-organization/select-organization.tpl.html', 'user.modals.selectOrganization.ctrl', {});
            modalInstance.result.then(function (selectedOrganization) {
                console.log(selectedOrganization);
            }, function (results) {
                console.log('dismissed');
            });
        };
    }]);
/// <reference path='./models.ts' />
var User;
(function (User) {
    var Models;
    (function (Models) {
        var Organization = (function (_super) {
            __extends(Organization, _super);
            function Organization() {
                _super.call(this);
                this.companyName = null;
                this.emailAccounting = null;
                this.emailOther = null;
                this.emailPrimary = null;
                this.emailSales = null;
                this.emailScheduling = null;
                this.emailWarranty = null;
                this.faxAccounting = null;
                this.faxPrimary = null;
                this.faxSales = null;
                this.faxScheduling = null;
                this.faxWarranty = null;
                this.organizationKey = -1;
                this.phoneAccounting = null;
                this.phonePrimary = null;
                this.phoneSales = null;
                this.phoneScheduling = null;
                this.phoneWarranty = null;
                this.primaryAddress1 = null;
                this.primaryAddress2 = null;
                this.primaryAddress3 = null;
                this.primaryCity = null;
                this.primaryCountry = null;
                this.primaryPostalCode = null;
                this.primaryStateProvince = null;
                this.secondaryAddress1 = null;
                this.secondaryAddress2 = null;
                this.secondaryAddress3 = null;
                this.secondaryCity = null;
                this.secondaryCountry = null;
                this.secondaryPostalCode = null;
                this.secondaryStateProvince = null;
                this.upsFedExAddress1 = null;
                this.upsFedExAddress2 = null;
                this.upsFedExAddress3 = null;
                this.upsFedExCity = null;
                this.upsFedExCountry = null;
                this.upsFedExPostalCode = null;
                this.upsFedExStateProvince = null;
                this.website = null;
            }
            Organization.prototype.toJson = function () {
                var json = {
                    companyName: this.companyName,
                    emailAccounting: this.emailAccounting,
                    emailOther: this.emailOther,
                    emailPrimary: this.emailPrimary,
                    emailSales: this.emailSales,
                    emailScheduling: this.emailScheduling,
                    emailWarranty: this.emailWarranty,
                    faxAccounting: this.faxAccounting,
                    faxPrimary: this.faxPrimary,
                    faxSales: this.faxSales,
                    faxScheduling: this.faxScheduling,
                    faxWarranty: this.faxWarranty,
                    organizationKey: this.organizationKey,
                    phoneAccounting: this.phoneAccounting,
                    phonePrimary: this.phonePrimary,
                    phoneSales: this.phoneSales,
                    phoneScheduling: this.phoneScheduling,
                    phoneWarranty: this.phoneWarranty,
                    primaryAddress1: this.primaryAddress1,
                    primaryAddress2: this.primaryAddress2,
                    primaryAddress3: this.primaryAddress3,
                    primaryCity: this.primaryCity,
                    primaryCountry: this.primaryCountry,
                    primaryPostalCode: this.primaryPostalCode,
                    primaryStateProvince: this.primaryStateProvince,
                    secondaryAddress1: this.secondaryAddress1,
                    secondaryAddress2: this.secondaryAddress2,
                    secondaryAddress3: this.secondaryAddress3,
                    secondaryCity: this.secondaryCity,
                    secondaryCountry: this.secondaryCountry,
                    secondaryPostalCode: this.secondaryPostalCode,
                    secondaryStateProvince: this.secondaryStateProvince,
                    upsFedExAddress1: this.upsFedExAddress1,
                    upsFedExAddress2: this.upsFedExAddress2,
                    upsFedExAddress3: this.upsFedExAddress3,
                    upsFedExCity: this.upsFedExCity,
                    upsFedExCountry: this.upsFedExCountry,
                    upsFedExPostalCode: this.upsFedExPostalCode,
                    upsFedExStateProvince: this.upsFedExStateProvince,
                    website: this.website
                };
                return json;
            };
            Organization.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.companyName = json.companyName;
                this.emailAccounting = json.emailAccounting;
                this.emailOther = json.emailOther;
                this.emailPrimary = json.emailPrimary;
                this.emailSales = json.emailSales;
                this.emailScheduling = json.emailScheduling;
                this.emailWarranty = json.emailWarranty;
                this.faxAccounting = json.faxAccounting;
                this.faxPrimary = json.faxPrimary;
                this.faxSales = json.faxSales;
                this.faxScheduling = json.faxScheduling;
                this.faxWarranty = json.faxWarranty;
                this.organizationKey = json.organizationKey;
                this.phoneAccounting = json.phoneAccounting;
                this.phonePrimary = json.phonePrimary;
                this.phoneSales = json.phoneSales;
                this.phoneScheduling = json.phoneScheduling;
                this.phoneWarranty = json.phoneWarranty;
                this.primaryAddress1 = json.primaryAddress1;
                this.primaryAddress2 = json.primaryAddress2;
                this.primaryAddress3 = json.primaryAddress3;
                this.primaryCity = json.primaryCity;
                this.primaryCountry = json.primaryCountry;
                this.primaryPostalCode = json.primaryPostalCode;
                this.primaryStateProvince = json.primaryStateProvince;
                this.secondaryAddress1 = json.secondaryAddress1;
                this.secondaryAddress2 = json.secondaryAddress2;
                this.secondaryAddress3 = json.secondaryAddress3;
                this.secondaryCity = json.secondaryCity;
                this.secondaryCountry = json.secondaryCountry;
                this.secondaryPostalCode = json.secondaryPostalCode;
                this.secondaryStateProvince = json.secondaryStateProvince;
                this.upsFedExAddress1 = json.upsFedExAddress1;
                this.upsFedExAddress2 = json.upsFedExAddress2;
                this.upsFedExAddress3 = json.upsFedExAddress3;
                this.upsFedExCity = json.upsFedExCity;
                this.upsFedExCountry = json.upsFedExCountry;
                this.upsFedExPostalCode = json.upsFedExPostalCode;
                this.upsFedExStateProvince = json.upsFedExStateProvince;
                this.website = json.website;
            };
            return Organization;
        })(Common.Models.Storable);
        Models.Organization = Organization;
    })(Models = User.Models || (User.Models = {}));
})(User || (User = {}));
/// <reference path='../../../common/common.ts' />
/// <reference path='../../../common/models/models.ts' />
/// <reference path='./Organization.ts' />
/// <reference path='./models.ts' />
var User;
(function (User) {
    var Models;
    (function (Models) {
        var Account = (function (_super) {
            __extends(Account, _super);
            function Account() {
                _super.call(this);
            }
            Account.prototype.toJson = function () {
                return {
                    Name: this.name,
                    OrganizationKey: this.organizationKey
                };
            };
            Account.prototype.fromJson = function (json) {
                this.name = json.name;
                this.organizationKey = json.organizationKey;
            };
            return Account;
        })(Common.Models.Storable);
        Models.Account = Account;
    })(Models = User.Models || (User.Models = {}));
})(User || (User = {}));
/// <reference path='./models.ts' />
var User;
(function (User) {
    var Models;
    (function (Models) {
        var AccountUser = (function (_super) {
            __extends(AccountUser, _super);
            function AccountUser() {
                _super.call(this);
            }
            AccountUser.prototype.toJson = function () {
                return {};
            };
            AccountUser.prototype.fromJson = function () {
            };
            return AccountUser;
        })(Common.Models.Storable);
        Models.AccountUser = AccountUser;
    })(Models = User.Models || (User.Models = {}));
})(User || (User = {}));
/// <reference path='./models.ts' />
var User;
(function (User) {
    var Models;
    (function (Models) {
        var OrganizationCollection = (function (_super) {
            __extends(OrganizationCollection, _super);
            function OrganizationCollection() {
                _super.call(this);
            }
            OrganizationCollection.prototype.toJson = function () {
                return _super.prototype.toJson.call(this);
            };
            OrganizationCollection.prototype.fromJson = function (json) {
                if (!json)
                    return;
                throw new Error('OrganizationCollection fromJson(): not implemented');
            };
            return OrganizationCollection;
        })(Common.Models.Collection);
        Models.OrganizationCollection = OrganizationCollection;
    })(Models = User.Models || (User.Models = {}));
})(User || (User = {}));
/// <reference path='./models.ts' />
var User;
(function (User) {
    var Models;
    (function (Models) {
        var UserModel = (function (_super) {
            __extends(UserModel, _super);
            function UserModel() {
                _super.call(this);
                this.firstName = null;
                this.lastName = null;
                this.organizationKey = 0;
                this.organizationName = null;
                this.invitationType = 1;
                this.invitationKey = 0;
                this.email = null;
                this.recaptchaChallenge = '';
                this.recaptchaResponse = '';
            }
            UserModel.prototype.toJson = function () {
                return {
                    FirstName: this.firstName,
                    LastName: this.lastName,
                    OrganizationName: this.organizationName,
                    OrganizationKey: this.organizationKey,
                    InvitationType: this.invitationType,
                    InvitationKey: this.invitationKey,
                    Email: this.email,
                    RecaptchaChallenge: this.recaptchaChallenge,
                    RecaptchaResponse: this.recaptchaResponse
                };
            };
            UserModel.prototype.fromJson = function (json) {
                this.firstName = json.FirstName;
                this.lastName = json.LastName;
                this.organizationName = json.OrganizationName;
                this.email = json.Email;
            };
            return UserModel;
        })(Common.Models.Storable);
        Models.UserModel = UserModel;
    })(Models = User.Models || (User.Models = {}));
})(User || (User = {}));
/// <reference path='./user.mdl.ts' />
impakt.user.constant('USER', {
    'ORG_ENDPOINT': '/configuration',
    'GET_ORGANIZATIONS': '/getOrganizations'
});
/// <reference path='./user.mdl.ts' />
impakt.user.controller('impakt.user.ctrl', [
    '$scope',
    '$http',
    '$window',
    '__signin',
    '_user',
    function ($scope, $http, $window, __signin, _user) {
        $scope.userName = _user.userName;
        $scope.organizationKey = _user.organizationKey;
        $scope.isOnline = _user.isOnline;
        $scope.onlineStatus = _user.getOnlineStatusString();
        $scope.organizations = _user.organizations;
        $scope.selectedOrganization = _user.selectedOrganization;
        $scope.$watch('isOnline', function (newVal, oldVal) {
            $scope.onlineStatus = _user.getOnlineStatusString();
        });
        $scope.selectOrganization = function () {
            _user.selectOrganization($scope.selectedOrganization);
        };
        $scope.profileClick = function () {
            // TODO
        };
        $scope.logout = function () {
            confirm('Are you sure you want to logout? You will lose any unsaved data.') && __signin.logout();
        };
    }]);
/// <reference path='./user.mdl.ts' />
impakt.user.service('_user', [
    'USER',
    '$window',
    '$q',
    '__context',
    '__api',
    '__notifications',
    '__localStorage',
    '_userModals',
    function (USER, $window, $q, __context, // TODO @theBull - might not need this after the Alpha
        __api, __notifications, __localStorage, _userModals) {
        this.userName = __localStorage.getUserName();
        this.organizationKey = __localStorage.getOrganizationKey();
        this.organizations = new User.Models.OrganizationCollection();
        this.selectedOrganization = null;
        this.isOnline = navigator ? navigator.onLine : undefined;
        var self = this;
        this.initialize = function () {
            var d = $q.defer();
            var notification = __notifications.pending('Looking for default user organization...');
            var organizationKey = __localStorage.getOrganizationKey();
            self.getOrganizations().then(function (organizations) {
                // select default organization from localStorage
                if (organizations && organizations.hasElements() &&
                    organizationKey && organizationKey > 0) {
                    var selectedOrganization = organizations.filterFirst(function (organization, index) {
                        return organization.organizationKey == organizationKey;
                    });
                    self.selectOrganization(selectedOrganization);
                    notification.success('Default user organization #', organizationKey, ' is set');
                    d.resolve(self.selectedOrganization);
                }
                else {
                    // open select organization dialog
                    notification.warning('Default organization not found. Please select \
					an organization from the Profile area.');
                    _userModals.selectOrganization();
                    d.resolve(null);
                }
            }, function (err) {
                notification.error('Failed to set default organization #', organizationKey);
                d.reject(err);
            });
            return d.promise;
        };
        $window.addEventListener("offline", function (e) {
            console.log('offline');
            self.isOnline = false;
        });
        $window.addEventListener("online", function (e) {
            console.log('online');
            self.isOnline = true;
        });
        this.selectOrganization = function (organization) {
            var d = $q.defer();
            var notification = __notifications.pending('Updating application context data...');
            if (!organization) {
                var errorMessage = 'Something went wrong while attempting to select the organization';
                notification.error(errorMessage);
                d.reject(errorMessage);
            }
            this.selectedOrganization = organization;
            __localStorage.setOrganizationKey(organization.organizationKey);
            // make application context requests
            __context.initialize(impakt.context).then(function (results) {
                notification.success('Successfully updated the application context data');
                d.resolve(self.selectedOrganization);
            }, function (err) {
                notification.error('Failed to update the application context data');
                d.reject(err);
            });
            return d.promise;
        };
        this.getOnlineStatusString = function () {
            return this.isOnline === true ? "online" :
                this.isOnline === false ? "offline" : "unknown";
        };
        this.getOrganizations = function () {
            var d = $q.defer();
            var notification = __notifications.pending('Retrieving Organizations...');
            __api.get(__api.path(USER.ORG_ENDPOINT, USER.GET_ORGANIZATIONS)).then(function (response) {
                if (response && response.data && response.data.results) {
                    var results = response.data.results;
                    for (var i = 0; i < results.length; i++) {
                        var result = response.data.results[i];
                        if (result) {
                            var organizationModel = new User.Models.Organization();
                            organizationModel.fromJson(result);
                            self.organizations.add(organizationModel);
                        }
                    }
                }
                notification.success(self.organizations.size(), ' Organizations successfully retrieved');
                d.resolve(self.organizations);
            }, function (err) {
                notification.error('Failed to retrieve Organizations');
                d.reject(err);
            });
            return d.promise;
        };
    }]);
/// <reference path='../../common/common.ts' />
//# sourceMappingURL=impakt.js.map