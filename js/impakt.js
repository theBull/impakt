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
    function ($stateProvider, $urlRouterProvider, $httpProvider) {
        console.log('impakt - config');
        //$urlRouterProvider.otherwise('/');
        // impakt module states - should these be module-specific?
        $stateProvider
            .state('film', {
            url: '/film',
            templateUrl: 'modules/film/film.tpl.html'
        })
            .state('team', {
            url: '/team',
            templateUrl: 'modules/team/team.tpl.html'
        })
            .state('stats', {
            url: '/stats',
            templateUrl: 'modules/stats/stats.tpl.html'
        });
        console.debug('impakt - config');
    }])
    .run([
    '$http', '$window', '__auth', '__localStorage', '__context',
    function ($http, $window, __auth, __localStorage, __context) {
        console.debug('impakt - running');
        // TODO: Change to application/json?
        $http.defaults.headers.common =
            { 'Content-Type': 'application/json' };
        var accessToken = __localStorage.getAccessToken();
        if (accessToken) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
        }
        else {
            $window.location.href = '/signin.html';
        }
        // make application context requests
        __context.initialize(impakt.context).then(function (results) {
            console.log('Context initialization complete.');
        }, function (err) {
            console.log(err);
        });
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
    var Base;
    (function (Base) {
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
                result = (result.charAt(0).toUpperCase() + result.slice(1)).trim();
            return result;
        };
        Utilities.convertEnumToList = function (obj) {
            var list = {};
            for (var key in obj) {
                if (!isNaN(key)) {
                    list[key] = Common.Utilities.camelCaseToSpace(obj[key], true);
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
            return sjcl.hash.sha256.hash(JSON.stringify(json));
        };
        return Utilities;
    })();
    Common.Utilities = Utilities;
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
    'HOST_URL': 'http://test.impaktathletics.com',
    'ENDPOINT': '/api',
});
/// <reference path='./api.mdl.ts' />
impakt.common.api.factory('__api', [
    'API', 'AUTH', '$http', '$q',
    function (API, AUTH, $http, $q) {
        var self = {
            post: post,
            get: get,
            path: path
        };
        function post(endpointUrl, data) {
            var d = $q.defer();
            $http.post(path(API.HOST_URL, API.ENDPOINT, endpointUrl), JSON.stringify(data)).then(function (data) {
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
            $http.get(path(API.HOST_URL, API.ENDPOINT, endpointUrl)).then(function (data) {
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
    'HANDSHAKE_DUMMY': 'grant_type=password&username=fredf@imanufacture.com&Password=Abc123'
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
                    '&Password=', password].join('');
                $http.post(__api.path(API.HOST_URL, AUTH.TOKEN_ENDPOINT), data, { 'Content-Type': 'application/x-www-form-urlencoded' }).then(function (data) {
                    // TODO: handle statuses manually
                    console.log(data);
                    d.resolve(data);
                }, function (err) {
                    console.error(err);
                    d.reject(err);
                });
                return d.promise;
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
    'PLAYBOOK',
    function ($q, __api, __localStorage, __notifications, PLAYBOOK) {
        var self = {
            initialize: initialize
        };
        function initialize(context) {
            var d = $q.defer();
            console.log('Making application context initialization requests');
            if (!context.Playbook)
                context.Playbook = {};
            context.Playbook.positionDefaults = new Playbook.Models.PositionDefault();
            context.Playbook.unitTypes = getUnitTypes();
            context.Playbook.unitTypesEnum = getUnitTypesEnum();
            async.parallel([
                // Retrieve playbooks
                // Retrieve playbooks
                function (callback) {
                    getPlaybooks().then(function (playbooks) {
                        context.Playbook.playbooks = playbooks;
                        __notifications.notify('Playbooks successfully loaded', Common.Models.NotificationType.Success);
                        callback(null, playbooks);
                    }, function (err) {
                        callback(err);
                    });
                },
                // Retrieve formations
                // Retrieve formations
                function (callback) {
                    getFormations().then(function (formations) {
                        context.Playbook.formations = formations;
                        __notifications.notify('Formations successfully loaded', Common.Models.NotificationType.Success);
                        callback(null, formations);
                    }, function (err) {
                        callback(err);
                    });
                },
                // Retrieve personnel sets
                // Retrieve personnel sets
                function (callback) {
                    getPlaybookDataSets().then(function (personnel, assignments) {
                        context.Playbook.personnel = personnel;
                        context.Playbook.assignments = assignments;
                        __notifications.notify('Personnel successfully loaded', Common.Models.NotificationType.Success);
                        __notifications.notify('Assignments successfully loaded', Common.Models.NotificationType.Success);
                        callback(null, personnel, assignments);
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
                    __notifications.notify('Initial data loaded successfully', Common.Models.NotificationType.Success);
                    d.resolve(context);
                }
            });
            return d.promise;
        }
        function getUnitTypes() {
            return new Playbook.Models.UnitTypeCollection();
        }
        function getUnitTypesEnum() {
            var typeEnums = {};
            for (var unitType in Playbook.Editor.UnitTypes) {
                if (unitType >= 0)
                    typeEnums[parseInt(unitType)]
                        = Common.Utilities.camelCaseToSpace(Playbook.Editor.UnitTypes[unitType], true);
            }
            return typeEnums;
        }
        function getPlaybooks() {
            var d = $q.defer();
            __api.get(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.GET_PLAYBOOKS))
                .then(function (response) {
                if (response && response.data && response.data.results) {
                    var playbookResults = Common.Utilities.parseData(response.data.results);
                    for (var i = 0; i < playbookResults.length; i++) {
                        var playbookResult = playbookResults[i];
                        if (playbookResult && playbookResult.data && playbookResult.data.model) {
                            var playbookModel = new Playbook.Models.PlaybookModel();
                            playbookResult.data.model.key = playbookResult.key;
                            playbookModel.fromJson(playbookResult.data.model);
                            var contextUnitType = impakt.context.Playbook.unitTypes.getByUnitType(playbookModel.unitType);
                            if (contextUnitType && contextUnitType.playbooks) {
                                contextUnitType.playbooks.add(playbookModel.guid, playbookModel);
                            }
                        }
                    }
                }
                var playbookCollection = impakt.context.Playbook.unitTypes.getAllPlaybooks();
                // High fiv3
                d.resolve(playbookCollection);
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        }
        /**
         * Retrieve all formations for use throughout the application
         */
        function getFormations() {
            var playbookKey = __localStorage.getDefaultPlaybookKey();
            var playbookUnitType = __localStorage.getDefaultPlaybookUnitType();
            var d = $q.defer();
            __api.get(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.GET_FORMATIONS, '?$filter=ParentRK gt 0'))
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
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
                var collection = new Playbook.Models.FormationCollection();
                collection.fromJson(formations);
                collection.forEach(function (formation, index) {
                });
                d.resolve(collection);
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        }
        /**
         * Retrieve all personnel sets for use throughout the application
         */
        function getPlaybookDataSets() {
            var d = $q.defer();
            __api.get(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.GET_SETS))
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var personnelResults = [];
                var assignmentResults = [];
                // get personnel & assignments from `sets`
                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    if (result && result.data) {
                        var data = result.data;
                        switch (data.setType) {
                            case Playbook.Editor.PlaybookSetTypes.Personnel:
                                data.personnel.key = result.key;
                                personnelResults.push(data.personnel);
                                break;
                            case Playbook.Editor.PlaybookSetTypes.Assignment:
                                data.assignment.key = result.key;
                                assignmentResults.push(data.assignment);
                                break;
                        }
                    }
                }
                var personnelCollection = new Playbook.Models.PersonnelCollection();
                var assignmentCollection = new Playbook.Models.AssignmentCollection();
                for (var i_1 = 0; i_1 < personnelResults.length; i_1++) {
                    var personnel = personnelResults[i_1];
                    var personnelModel = new Playbook.Models.Personnel();
                    personnelModel.fromJson(personnel);
                    personnelCollection.add(personnelModel.guid, personnelModel);
                }
                for (var i_2 = 0; i_2 < assignmentResults.length; i_2++) {
                    var assignment = assignmentResults[i_2];
                    var assignmentModel = new Playbook.Models.Assignment();
                    assignmentModel.fromJson(assignment);
                    assignmentCollection.add(assignmentModel.guid, assignmentModel);
                }
                d.resolve(personnelCollection, assignmentCollection);
            }, function (error) {
                d.reject(error);
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
        function getUserName() {
            return localStorage.getItem(LOCAL_STORAGE.USER_NAME);
        }
        function getOrganizationKey() {
            return localStorage.getItem(LOCAL_STORAGE.ORGANIZATION_KEY);
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
                this.callbacks = [];
                this.lastModified = null;
                this.modified = false;
            }
            Modifiable.prototype.onModified = function (callback) {
                this.callbacks.push(callback);
            };
            Modifiable.prototype.isModified = function () {
                for (var i = 0; i < this.callbacks.length; i++) {
                    var callback = this.callbacks[i];
                    callback(this);
                }
            };
            /**
             * alias for generateChecksum()
             * @return {string} the updated checksum
             */
            Modifiable.prototype.setModified = function () {
                var cs = this._generateChecksum();
                if (cs !== this.checksum) {
                    // current checksum and stored checksum mismatch; modified
                    this.modified = true;
                    // track the modification date/time
                    this.lastModified = Date.now();
                    // trigger all callbacks listening for changes
                    this.isModified();
                }
                else {
                    this.modified = false;
                }
                this.checksum = cs;
                return this.modified;
            };
            /**
             * Generates a new checksum from the current object
             * @return {string} the newly generated checksum
             */
            Modifiable.prototype._generateChecksum = function () {
                // determine current checksum
                return Common.Utilities.generateChecksum(this.context.toJson());
            };
            Modifiable.prototype.toJson = function () {
                return {
                    modified: this.modified,
                    guid: this.guid
                };
            };
            Modifiable.prototype.fromJson = function (json) {
                this.modified = json.modified;
                this.guid = json.guid;
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
            Collection.prototype.get = function (key) {
                key = this._ensureKeyType(key);
                return this[key];
            };
            Collection.prototype.getOne = function () {
                return this[this._keys[0]];
            };
            Collection.prototype.getIndex = function (index) {
                return this.get(this._keys[index]);
            };
            Collection.prototype.set = function (key, data) {
                if (!this.hasOwnProperty(key.toString()))
                    throw Error('Object does not have key ' + key + '. Use the add(key) method.');
                this[key] = data;
                this._keys.push(key);
            };
            Collection.prototype.replace = function (replaceKey, key, data) {
                this._keys[this._keys.indexOf(replaceKey)] = key;
                this[key] = data;
                delete this[replaceKey];
            };
            Collection.prototype.setAtIndex = function (index, data) {
            };
            Collection.prototype.add = function (key, data) {
                if (this[key] && this._keys.indexOf(key) > -1) {
                    this.set(key, data);
                }
                else {
                    this[key] = data;
                    this._keys.push(key);
                    this._count++;
                }
            };
            Collection.prototype.addAtIndex = function (key, data, index) {
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
                        self.add(item.guid, item);
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
                    console.log('removing key', key);
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
            Collection.prototype.getAll = function () {
                var obj = {};
                for (var i = 0; i < this._keys.length; i++) {
                    var key = this._keys[i];
                    // shitty way of hiding private properties
                    obj[key] = this.get(key);
                }
                return obj;
            };
            Collection.prototype.getLast = function () {
                var key = this._keys[this._keys.length - 1];
                return this.get(key);
            };
            Collection.prototype.toArray = function () {
                var arr = [];
                for (var i = 0; i < this._keys.length; i++) {
                    arr.push(this.get(this._keys[i]));
                }
                return arr;
            };
            Collection.prototype.toJsonArray = function () {
                var results = [];
                this.forEach(function (element, index) {
                    results.push(Common.Utilities.toJson(element));
                });
                return results;
            };
            /**
             * Alias for toJsonArray, since the collection should be
             * represented as an array
             * @return {any} returns an array of objects
             */
            Collection.prototype.toJson = function () {
                return this.toJsonArray();
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
            LinkedList.prototype.toJsonArray = function () {
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
        var ModifiableCollection = (function (_super) {
            __extends(ModifiableCollection, _super);
            function ModifiableCollection() {
                _super.call(this);
                this._modifiable = new Common.Models.Modifiable(this);
            }
            ModifiableCollection.prototype.setModified = function () {
                return this._modifiable.setModified();
            };
            ModifiableCollection.prototype.onModified = function (callback) {
                this._modifiable.onModified(callback);
            };
            ModifiableCollection.prototype.isModified = function () {
                this._modifiable.isModified();
            };
            ModifiableCollection.prototype.size = function () {
                return _super.prototype.size.call(this);
            };
            ModifiableCollection.prototype.isEmpty = function () {
                return _super.prototype.isEmpty.call(this);
            };
            ModifiableCollection.prototype.get = function (key) {
                return _super.prototype.get.call(this, key);
            };
            ModifiableCollection.prototype.getOne = function () {
                return _super.prototype.getOne.call(this);
            };
            ModifiableCollection.prototype.getIndex = function (index) {
                return _super.prototype.getIndex.call(this, index);
            };
            ModifiableCollection.prototype.set = function (key, data) {
                _super.prototype.set.call(this, key, data);
                this._modifiable.setModified();
            };
            ModifiableCollection.prototype.replace = function (replaceKey, key, data) {
                _super.prototype.replace.call(this, replaceKey, key, data);
                this._modifiable.setModified();
            };
            ModifiableCollection.prototype.setAtIndex = function (index, data) {
                _super.prototype.setAtIndex.call(this, index, data);
                this._modifiable.setModified();
            };
            ModifiableCollection.prototype.add = function (key, data) {
                _super.prototype.add.call(this, key, data);
                this._modifiable.setModified();
            };
            ModifiableCollection.prototype.addAtIndex = function (key, data, index) {
                _super.prototype.addAtIndex.call(this, key, data, index);
                this._modifiable.setModified();
            };
            ModifiableCollection.prototype.append = function (collection) {
                _super.prototype.append.call(this, collection);
                this._modifiable.setModified();
            };
            ModifiableCollection.prototype.forEach = function (iterator) {
                _super.prototype.forEach.call(this, iterator);
            };
            ModifiableCollection.prototype.filter = function (predicate) {
                return _super.prototype.filter.call(this, predicate);
            };
            ModifiableCollection.prototype.filterFirst = function (predicate) {
                return _super.prototype.filterFirst.call(this, predicate);
            };
            ModifiableCollection.prototype.remove = function (key) {
                var results = _super.prototype.remove.call(this, key);
                this._modifiable.setModified();
                return results;
            };
            ModifiableCollection.prototype.removeAll = function () {
                _super.prototype.removeAll.call(this);
                this._modifiable.setModified();
            };
            /**
             * Allows you to run an iterator method over each item
             * in the collection before the collection is completely
             * emptied.
             */
            ModifiableCollection.prototype.removeEach = function (iterator) {
                _super.prototype.removeEach.call(this, iterator);
                this._modifiable.setModified();
            };
            ModifiableCollection.prototype.contains = function (key) {
                return _super.prototype.contains.call(this, key);
            };
            ModifiableCollection.prototype.getAll = function () {
                return _super.prototype.getAll.call(this);
            };
            ModifiableCollection.prototype.getLast = function () {
                return _super.prototype.getLast.call(this);
            };
            ModifiableCollection.prototype.toArray = function () {
                return _super.prototype.toArray.call(this);
            };
            ModifiableCollection.prototype.toJsonArray = function () {
                return _super.prototype.toJsonArray.call(this);
            };
            ModifiableCollection.prototype.toJson = function () {
                return _super.prototype.toJson.call(this);
            };
            return ModifiableCollection;
        })(Common.Models.Collection);
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
            ModifiableLinkedList.prototype.toJsonArray = function () {
                return _super.prototype.toJsonArray.call(this);
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
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Notification = (function () {
            function Notification(message, type) {
                this.guid = Common.Utilities.guid();
                this.message = message;
                this.type = type;
            }
            return Notification;
        })();
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
/// <reference path='../interfaces/ICollectionItem.ts' />
/// <reference path='../interfaces/ILinkedListItem.ts' />
/// <reference path='../interfaces/IModifiable.ts' />
/// <reference path='../interfaces/IStorable.ts' />
/// <reference path='./Storable.ts' />
/// <reference path='./Modifiable.ts' />
/// <reference path='./Collection.ts' />
/// <reference path='./LinkedList.ts' />
/// <reference path='./LinkedListNode.ts' />
/// <reference path='./ModifiableCollection.ts' />
/// <reference path='./ModifiableLinkedList.ts' />
/// <reference path='./ModifiableLinkedListNode.ts' />
/// <reference path='./Association.ts' />
/// <reference path='./Notification.ts' />
/// <reference path='./NotificationCollection.ts' />
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
                this.unitTypes = [];
                this.playbooks = [];
                this.formations = [];
                this.personnel = [];
                this.assignments = [];
                this.plays = [];
            }
            Association.prototype.toJson = function () {
                return {
                    unitTypes: this.unitTypes,
                    playbooks: this.playbooks,
                    formations: this.formations,
                    personnel: this.personnel,
                    assignments: this.assignments,
                    plays: this.plays,
                    guid: this.guid
                };
            };
            Association.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.unitTypes = json.unitTypes || this.unitTypes;
                this.playbooks = json.playbooks || this.playbooks;
                this.formations = json.formations || this.formations;
                this.personnel = json.personnel || this.personnel;
                this.assignments = json.assignments || this.assignments;
                this.plays = json.plays || this.plays;
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
        this.removeAll = function () {
            this.notifications.removeAll();
        };
        this.remove = function (guid) {
            this.notifications.remove(guid);
        };
        this.notify = function (message, type) {
            var notificationModel = new Common.Models.Notification(message, type);
            this.notifications.add(notificationModel.guid, notificationModel);
        };
        this.update = function (notification, message, type) {
            var notificationModel = this.notifications.get(notification.guid);
            notificationModel.message = message;
            notificationModel.type = type;
        };
        this.success = function (notification, message) {
            this.update(notification, message, Common.Models.NotificationType.Success);
        };
        this.error = function (notification, message) {
            this.update(notification, message, Common.Models.NotificationType.Error);
        };
        this.warning = function (notification, message) {
            this.update(notification, message, Common.Models.NotificationType.Warning);
        };
        this.info = function (notification, message) {
            this.update(notification, message, Common.Models.NotificationType.Info);
        };
        this.pending = function (notification, message) {
            this.update(notification, message, Common.Models.NotificationType.Pending);
        };
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
            this.contentHeight = content.height;
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
impakt.common.signin.constant('SIGNIN', {});
/// <reference path='./signin.mdl.ts' />
impakt.common.signin.controller('signin.ctrl', ['$scope', '__signin',
    function ($scope, __signin) {
        $scope.data = {
            username: 'fredf@imanufacture.com',
            password: 'Abc123'
        };
        $scope.signin = function () {
            __signin.signin($scope.data.username, $scope.data.password);
        };
    }]);
/// <reference path='./signin.mdl.ts' />
impakt.common.signin.factory('__signin', [
    '$window',
    '__auth',
    '__localStorage',
    'SIGNIN',
    function ($window, __auth, __localStorage, SIGNIN) {
        var self = {
            signin: signin,
            logout: logout
        };
        function signin(username, password) {
            // send a handshake
            __auth.getToken(username, password).then(function (data) {
                console.log(data);
                __localStorage.setAccessToken(data.data);
                $window.location.href = 'index.html';
            }, function (err) {
                console.error(err);
            });
        }
        function logout() {
            __localStorage.signout();
            $window.location.href = 'signin.html';
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
        $scope.direction = '';
        $scope.min = 3; // in em's
        $scope.max = 34; // in em's
        $scope.$element = null;
        $scope.em = parseInt($('body').css('font-size'));
        $scope.collapsed = false;
        $scope.toggle = function () {
            $scope.collapsed = !$scope.collapsed;
            var toWidth = 0;
            if ($scope.collapsed) {
                toWidth = $scope.getWidth($scope.min);
                $scope.$element.width(toWidth);
                console.log('collapse panel', toWidth);
            }
            else {
                toWidth = $scope.getWidth($scope.max);
                $scope.$element.width(toWidth);
                console.log('expand panel', toWidth);
            }
        };
        $scope.getWidth = function (value) {
            return $scope.em * parseInt(value);
        };
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
            scope: {
                direction: '@direction',
                min: '@min',
                max: '@max'
            },
            compile: function ($element, attrs) {
                return {
                    pre: function ($scope, $element, attrs, controller, transcludeFn) {
                    },
                    post: function ($scope, $element, attrs, controller, transcludeFn) {
                        $scope.$element = $element;
                        var init = function () {
                            $element.width($scope.getInitialWidth());
                            var $handle = $('<div />', {
                                'class': 'expandable-handle expandable-handle-vertical'
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
                                    var toWidth = elementWidth + deltaX;
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
                            $element.append($handle);
                        };
                        $timeout(init, 0);
                        var toggleIcon = $compile([
                            "<div class='pad top0 right0 dark-bg-hover pointer font-white zIndexTop' ",
                            'ng-click="toggle()">',
                            '<div class="glyphicon"',
                            'ng-class="{',
                            "'glyphicon-chevron-left': !collapsed,",
                            "'glyphicon-chevron-right': collapsed",
                            '}">',
                            '</div>',
                            '</div>'
                        ].join(''))($scope);
                        $element.prepend(toggleIcon);
                    }
                };
            }
        };
    }]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui
    .controller('impakt.common.ui.slidingPanel.ctrl', [
    '$scope',
    function ($scope) {
        $scope.layers = [];
        $scope.index = 0;
        $scope.isVisibleLayer = function (i) {
            return i == $scope.index;
        };
        $scope.next = function () {
            var oldIndex = $scope.index;
            if ($scope.hasLayers()) {
                $scope.index = $scope.hasNextLayer() ? $scope.index + 1 : 0;
            }
            console.log('next layer:', oldIndex, '->', $scope.index, $scope.layers);
        };
        $scope.prev = function () {
            if ($scope.hasLayers()) {
                $scope.index = $scope.hasPrevLayer() ? $scope.index - 1 : $scope.layers.length - 1;
            }
        };
        $scope.to = function (index) {
            if ($scope.hasLayers() && index >= 0 && index < $scope.layers.length - 1) {
                $scope.index = index;
            }
        };
        $scope.hasLayers = function () {
            return $scope.layers && $scope.layers.length > 0;
        };
        $scope.hasNextLayer = function () {
            return $scope.index < $scope.layers.length - 1;
        };
        $scope.hasPrevLayer = function () {
            return $scope.index > 0;
        };
    }
])
    .directive('slidingPanel', ['$compile',
    function ($compile) {
        console.debug('directive: impakt.common.ui.slidingPanel - register');
        return {
            restrict: 'E',
            controller: 'impakt.common.ui.slidingPanel.ctrl',
            link: function ($scope, $element, attrs) {
                var layers = [];
                // get all child slidingPanelLayers
                var layer = $element.find('sliding-panel-layer');
                console.log('sliding panel layer', layer);
                console.log('sliding panel layers', layers);
                // panel template
                // content template
            }
        };
    }])
    .directive('slidingPanelLayer', ['$compile', function ($compile) {
        return {
            restrict: 'E',
            link: function ($scope, $element, attrs) {
                console.log('slidingPanelLayer', attrs, $scope);
                var guid = Common.Utilities.guid();
                $element.attr('guid', guid);
                $scope.layers.push(guid);
                console.log(guid, $scope.layers);
            }
        };
    }])
    .directive('slidingPanelNav', [function () {
        return {
            restrict: 'A',
            link: function ($scope, $element, attrs) {
            }
        };
    }]);
/// <reference path='../js/impakt.ts' />
impakt.modules = angular.module('impakt.modules', [
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
    '$window',
    '$location',
    '__notifications',
    function ($scope, $window, $location, __notifications) {
        $scope.isOnline = navigator.onLine;
        $window.addEventListener("offline", function (e) {
            console.log('offline');
            $scope.isOnline = false;
        });
        $window.addEventListener("online", function (e) {
            console.log('online');
            $scope.isOnline = true;
        });
        // Default menu visiblity
        $scope.isMenuCollapsed = true;
        $scope.notifications = __notifications.notifications;
        $scope.menuItems = [
            {
                label: 'Playbook',
                glyphicon: 'book',
                path: '/playbook',
                isActive: true
            },
            {
                label: 'Team Management',
                glyphicon: 'list-alt',
                path: '/team',
                isActive: false
            },
            {
                label: 'Film',
                glyphicon: 'film',
                path: '/film',
                isActive: false
            },
            {
                label: 'Stats',
                glyphicon: 'signal',
                path: '/stats',
                isActive: false
            }
        ];
        // set default view
        $location.path('/playbook');
        $scope.navigatorNavSelection = getActiveNavItemLabel();
        $scope.menuVisibilityToggle = function () {
            $scope.isMenuCollapsed = !$scope.isMenuCollapsed;
        };
        $scope.menuItemClick = function (item) {
            var activeNavItem = getActiveNavItem();
            if (activeNavItem)
                activeNavItem.isActive = false;
            item.isActive = true;
            $location.path(item.path);
            $scope.navigatorNavSelection = item.label;
        };
        function getActiveNavItem() {
            // pre-assumption, we can only have 1 active menu item
            var activeItem = $scope.menuItems.filter(function (item) {
                return item.isActive === true;
            });
            return activeItem.length > 0 ? activeItem[0] : null;
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
        return {};
    }]);
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
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
                this.setType = Playbook.Editor.PlaybookSetTypes.Assignment;
            }
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
                    routes: this.routes.toJsonArray(),
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
                        this.add(assignment.guid, assignment);
                    }
                }
                this.setType = Playbook.Editor.PlaybookSetTypes.Assignment;
                this.unitType = Playbook.Editor.UnitTypes.Other;
                this.name = 'Untitled';
            }
            AssignmentCollection.prototype.hasAssignments = function () {
                return this.size() > 0;
            };
            AssignmentCollection.prototype.toJson = function () {
                return {
                    unitType: this.unitType,
                    setType: this.setType,
                    guid: this.guid,
                    assignments: _super.prototype.toJson.call(this)
                };
            };
            AssignmentCollection.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.guid = json.guid;
                this.unitType = json.unitType;
                this.setType = json.setType;
                var assignments = json.assignments || [];
                for (var i = 0; i < assignments.length; i++) {
                    var rawAssignment = assignments[i];
                    var assignmentModel = new Playbook.Models.Assignment();
                    assignmentModel.fromJson(rawAssignment);
                    this.add(assignmentModel.guid, assignmentModel);
                }
            };
            AssignmentCollection.prototype.getAssignmentByPositionIndex = function (index) {
                var result = null;
                if (this.hasAssignments()) {
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
            function FieldElement(context, canvas) {
                _super.call(this, this);
                this.context = context;
                this.canvas = canvas || this.context.canvas;
                this.field = this.context.field;
                this.paper = this.context.paper;
                this.grid = this.context.grid;
                this.raphael = null;
                this.dx = 0;
                this.dy = 0;
                // guid set by parent (Modifiable)
            }
            FieldElement.prototype.toJson = function () {
                var self = {
                    //id: this.id, // TODO: deprecate?
                    guid: this.guid,
                    name: this.name,
                    //coords: this.coords, // TODO: deprecate?
                    x: this.x,
                    y: this.y,
                    ax: this.ax,
                    ay: this.ay,
                    bx: this.bx,
                    by: this.by,
                    cx: this.cx,
                    cy: this.cy,
                    dx: this.dx,
                    dy: this.dy,
                    ox: this.ox,
                    oy: this.oy,
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
                    contextmenuTemplateUrl: this.contextmenuTemplateUrl
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
                console.log('getSaveData() not implemented');
            };
            FieldElement.prototype.draw = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                console.log('draw() not implemented');
            };
            FieldElement.prototype.getBBoxCoordinates = function () {
                console.log('getBBoxCoordinates() not implemented');
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
                console.log('hoverIn() not implemented');
            };
            FieldElement.prototype.hoverOut = function (e, context) {
                console.log('hoverOut() not implemented');
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
                var currentCoords = new Playbook.Models.Coordinate(this.x, this.y);
                console.log(this.x, this.y);
            };
            FieldElement.prototype.dragStart = function (x, y, e) {
                console.log('dragStart() not implemented');
            };
            FieldElement.prototype.dragEnd = function (e) {
                console.log('dragEnd() not implemented');
            };
            FieldElement.prototype.drop = function () {
                console.log('drop element: ', this.ax, this.ay, this.dx, this.dy);
                this.ax += this.dx;
                this.ay += this.dy;
                this.ox = this.ax;
                this.oy = this.ay;
                this.cx = this.ax;
                this.cy = this.ay;
                this.dx = 0;
                this.dy = 0;
                if (this.raphael) {
                    var coords = new Playbook.Models.Coordinate(this.ax, this.ay);
                    this.setCoordinates();
                    var attrs;
                    console.log(this.raphael);
                    if (this.raphael.type != 'circle') {
                        attrs = {
                            x: this.ax,
                            y: this.ay
                        };
                    }
                    else {
                        attrs = {
                            cx: this.ax,
                            cy: this.ay
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
            // Coordinates
            FieldElement.prototype.setCoordinates = function () {
                this.x; // x grid coordinate
                this.y; // y grid coordinate
                this.ax; // x absolute pixel value relative to paper
                this.ay; // y absolute pixel value relative to paper
                this.bx; // x coord relative to ball
                this.by; // y coord relative to ball
                this.cx; // x coord for circle
                this.cy; // y coord for circle
                this.dx; // x abs. delta for dragging
                this.dy; // y abs. delta for dragging
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
            FieldElementSet.prototype.pop = function () {
                this.length--;
                this.raphael.pop();
                return this.items.pop();
            };
            FieldElementSet.prototype.exclude = function (element) {
                this.length--;
                return this.raphael.exclude(element);
            };
            FieldElementSet.prototype.forEach = function (callback, context) {
                return this.raphael.forEach(callback, context);
            };
            FieldElementSet.prototype.getByGuid = function (guid) {
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    if (item && item.guid && item.guid == guid)
                        return item;
                }
                return null;
            };
            FieldElementSet.prototype.splice = function (index, count) {
                this.length -= count;
                this.raphael.splice(index, count);
                return this.items.splice(index, count);
            };
            FieldElementSet.prototype.removeAll = function () {
                while (this.raphael.length > 0) {
                    this.pop();
                }
            };
            FieldElementSet.prototype.clear = function () {
                this.raphael.clear();
            };
            FieldElementSet.prototype.dragOne = function (guid, dx, dy) {
                var item = this.getByGuid(guid);
                item.dx = dx;
                item.dy = dy;
                item.raphael.transform(['t', dx, ', ', dy].join(''));
            };
            FieldElementSet.prototype.dragAll = function (dx, dy) {
                console.log('dragging ' + this.length + ' items');
                // for each item in the set, update its drag position
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    item.dx = dx;
                    item.dy = dy;
                }
                this.raphael.transform(['t', dx, ', ', dy].join(''));
            };
            FieldElementSet.prototype.drop = function () {
                this.raphael.transform(['t', 0, ', ', 0].join(''));
                // iterate over each item and update its final position
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    item.drop();
                }
            };
            FieldElementSet.prototype.setOriginalPositions = function () {
                // for each item in the set, update its drag position
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    item.ax = item.ax;
                    item.ay = item.ay;
                }
            };
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
                this.x = this.grid.getCenter().x;
                this.y = this.grid.getCenter().y;
                var absCoords = this.grid.getPixelsFromCoordinates(new Playbook.Models.Coordinate(this.x, this.y));
                this.ax = absCoords.x;
                this.ay = absCoords.y;
                this.bx = 0;
                this.by = 0;
                this.width = this.grid.GRIDSIZE * 0.15;
                this.height = this.grid.GRIDSIZE * 0.25;
                this.offset = this.grid.getCenter().x;
            }
            Ball.prototype.draw = function () {
                console.log('drawing football...');
                this.raphael = this.paper.ellipse(this.x, this.y, this.width, this.height).attr({
                    'fill': this.color
                });
                _super.prototype.click.call(this, this.click, this);
                _super.prototype.mousedown.call(this, this.mousedown, this);
                this.drag(this.dragMove, this.dragStart, this.dragEnd, this, this, this);
                console.log(this.raphael);
                // constrain x/y directions
                // move LOS and all players with ball
            };
            Ball.prototype.click = function (e, self) {
                console.log('Ball at (', self.x, self.y, ')');
            };
            Ball.prototype.mousedown = function (e, self) {
                console.log('football mousedown');
            };
            Ball.prototype.dragMove = function (dx, dy, posx, posy, e) {
                console.log('football drag not implemented');
            };
            Ball.prototype.dragStart = function (x, y, e) {
                console.log('footabll drag (start) not implemented');
            };
            Ball.prototype.dragEnd = function (e) {
                console.log('football drag (end) not implemented');
            };
            Ball.prototype.getGridCoordinates = function () {
                return new Playbook.Models.Coordinate(this.x, this.y);
            };
            // coords is a grid-based number (not an absolute pixel value),
            // returns absolute x/y coordinates as pixel values
            Ball.prototype.getRelativeCoordinatesInPixels = function (coords) {
                var ballCoords = new Playbook.Models.Coordinate(this.x, this.y);
                var itemX, itemY;
                if (coords.x && coords.y) {
                    var itemDistance = this.grid.getPixelsFromCoordinates(coords);
                    itemX = ballCoords.x + itemDistance.x;
                    itemY = ballCoords.y - itemDistance.y;
                }
                else if (!coords.x && coords.y) {
                    itemX = ballCoords.x;
                    // convert y coord argument into pixel-based coords (from grid-based)
                    var itemYDistance = this.grid.getPixelsFromCoordinate(coords.y);
                    itemY = ballCoords.y - itemDistance.y;
                }
                else if (coords.x && !coords.y) {
                    itemY = ballCoords.y;
                    // convert x coord argument into pixel-based coords (from grid-based)
                    var itemXDistance = this.grid.getPixelsFromCoordinate(coords.x);
                    itemX = ballCoords.x + itemDistance.x;
                }
                else {
                    itemX = ballCoords.x;
                    itemY = ballCoords.y;
                }
                return new Playbook.Models.Coordinate(itemX, itemY);
            };
            Ball.prototype.isWhichSideOf = function (coords) {
                return new Playbook.Models.Coordinate(this.isLeftOf(coords.x) ? -1 : 1, this.isAbove(coords.y) ? 1 : -1);
            };
            Ball.prototype.isLeftOf = function (x) {
                return this.x > x;
            };
            Ball.prototype.isRightOf = function (x) {
                return this.x <= x;
            };
            Ball.prototype.isAbove = function (y) {
                return this.y > y;
            };
            Ball.prototype.isBelow = function (y) {
                return this.y <= y;
            };
            Ball.prototype.getSaveData = function () {
                // todo: attach additional data
                var data = {
                    coordinates: new Playbook.Models.Coordinate(this.x, this.y)
                };
                return data;
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
        var Canvas = (function () {
            function Canvas(play, gridsize, width, height, cols, rows) {
                this.play = play;
                this.type = this.play.type;
                this.editorType = this.play.editorType;
                // todo - right now, can only set this explicitly 
                // and not through initialization. Enable as initialization setting?
                this.editorMode = Playbook.Editor.EditorModes.Select;
                this.active = true;
                // need to set tab explicitly if it's within an editor
                this.tab = null;
                this.key = Common.Utilities.guid();
                this.gridsize = gridsize || 16;
                this.rows = rows || 120;
                this.cols = cols || 52;
                this.width = width || 0;
                this.height = height || 0;
                this.minWidth = 500;
                this.minHeight = 500;
                this.listener = new Playbook.Models.CanvasListener(this);
                this.OFFSET = 50;
            }
            Canvas.prototype.initialize = function ($container) {
                var self = this;
                this.container = $container[0]; // jquery lite converted to raw html
                this.$container = $container; // jquery lite object
                this.width = this.width || this.$container.width();
                this.height = this.height || this.$container.height();
                // +2 for sidelines
                // take the lowest number to allow for spacing around the field
                this.gridsize = Math.floor(this.width / this.cols);
                // allows for an extra grid units of spacing around the field
                var paperWidth = this.cols * this.gridsize;
                var paperHeight = this.rows * this.gridsize;
                this.paper = new Playbook.Models.Paper(this, paperWidth, paperHeight);
                // console.log('paper dimensions: ', this.paper.width, this.paper.height);
                this.grid = new Playbook.Models.Grid(this, this.cols, this.rows, this.gridsize);
                // $(window).resize(function() {
                // 	self.resize();
                // });
                var i = setInterval(function () {
                    if (self.width != self.$container.width()) {
                        self.width = self.$container.width();
                        self.height = self.$container.height();
                        console.log('container size changed', self.$container.width(), ' -> ', self.width, self.$container.height(), ' -> ', self.height);
                        //self.paper.resize(self.width);
                        //self.paper.setViewBox();
                        self.resize();
                    }
                }, 1);
                // clear any existing contents 
                this.paper.clear();
                this.paper.setViewBox();
                // @todo - abstract this. not every canvas will implement
                this.field = new Playbook.Models.Field(this, this.play);
                this.field.draw();
                this.grid.draw();
            };
            Canvas.prototype.resize = function () {
                var self = this;
                this.width = this.$container.width();
                this.height = this.$container.height();
                // +2 for sidelines
                // take the lowest number to allow for spacing around the field
                this.gridsize = Math.floor(this.width / this.cols);
                // remove the svg element from the DOM
                this.paper.Raphael.remove();
                // allows for an extra grid units of spacing around the field
                var paperWidth = this.cols * this.gridsize;
                var paperHeight = this.rows * this.gridsize;
                this.paper = new Playbook.Models.Paper(this, paperWidth, paperHeight);
                // console.log('paper dimensions: ', this.paper.width, this.paper.height);
                this.grid = new Playbook.Models.Grid(this, this.cols, this.rows, this.gridsize);
                // clear any existing contents 
                this.paper.clear();
                this.paper.setViewBox();
                // @todo - abstract this. not every canvas will implement
                this.field = new Playbook.Models.Field(this, this.play);
                this.field.draw();
                this.grid.draw();
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
                if (this.grid.GRIDSIZE < 25) {
                    this.grid.GRIDSIZE += 2;
                }
            };
            Canvas.prototype.zoomOut = function () {
                if (this.grid.GRIDSIZE > 12) {
                    this.grid.GRIDSIZE -= 2;
                }
            };
            Canvas.prototype.getEditorMode = function () {
                return Playbook.Editor.EditorModes[this.editorMode];
            };
            Canvas.prototype.getPaperWidth = function () {
                var width = Math.max(this.$container.width(), this.minWidth);
                var paperWidth = (Math.ceil(width / this.gridsize) * this.gridsize) - (4 * this.gridsize);
                return paperWidth;
            };
            Canvas.prototype.getPaperHeight = function () {
                var height = Math.max(this.$container.height(), this.minHeight);
                var paperHeight = (Math.ceil(height / this.gridsize) * this.gridsize) - (4 * this.gridsize);
                return paperHeight;
            };
            return Canvas;
        })();
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
                //super(context);
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
        var Coordinate = (function () {
            function Coordinate(x, y) {
                this.x = x;
                this.y = y;
            }
            return Coordinate;
        })();
        Models.Coordinate = Coordinate;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Endzone = (function (_super) {
            __extends(Endzone, _super);
            function Endzone(context, gridOffset) {
                _super.call(this, context);
                this.context = context;
                this.canvas = this.context.canvas;
                this.paper = this.context.paper;
                this.grid = this.context.grid;
                this.color = 'black';
                this.opacity = 0.25;
                this.x = 1;
                this.y = gridOffset || 0;
                this.width = this.paper.width - (2 * this.grid.GRIDSIZE);
                this.height = 10 * this.grid.GRIDSIZE;
            }
            Endzone.prototype.draw = function () {
                var rect = this.paper.rect(this.x, this.y, this.width, this.height).attr({
                    'fill': this.color,
                    'fill-opacity': this.opacity
                });
            };
            return Endzone;
        })(Models.FieldElement);
        Models.Endzone = Endzone;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Field = (function (_super) {
            __extends(Field, _super);
            function Field(context, play) {
                console.log('creating field');
                _super.call(this, context, context);
                this.canvas = context;
                this.play = play;
                this.type = this.play.type;
                this.editorType = this.play.editorType;
                this.paper = this.canvas.paper;
                this.grid = this.canvas.grid;
                this.ground = new Playbook.Models.FieldElement(this);
                this.ball = new Playbook.Models.Ball(this);
                this.los = new Playbook.Models.LineOfScrimmage(this);
                this.endzone_top = new Playbook.Models.Endzone(this, 0);
                this.endzone_bottom = new Playbook.Models.Endzone(this, 110);
                this.sideline_left = new Playbook.Models.Sideline(this, -25);
                this.sideline_right = new Playbook.Models.Sideline(this, 25);
                this.hashmark_left = new Playbook.Models.Hashmark(this, -8);
                this.hashmark_right = new Playbook.Models.Hashmark(this, 8);
                this.zoom = 1;
                this.playData = {};
                this.id = Common.Utilities.randomId();
                this.players = new Playbook.Models.PlayerCollection();
                this.selectedPlayers = new Playbook.Models.PlayerCollection();
                this.offset = new Playbook.Models.Coordinate(0, 0);
                this.opacity = 0.1;
                this.clickDisabled = false;
            }
            Field.prototype.draw = function () {
                var self = this;
                this.endzone_top.draw();
                this.endzone_bottom.draw();
                this.sideline_left.draw();
                this.sideline_right.draw();
                this.hashmark_left.draw();
                this.hashmark_right.draw();
                // draws a border around the field
                this.ground.raphael = this.paper.rect(0, 0, 
                // subtract spacing for sidelines
                this.grid.GRIDSIZE * this.canvas.cols, this.paper.height).attr({
                    'fill': '#113311',
                    'opacity': self.opacity
                });
                this.ground.click(this.click, this);
                this.ground.drag(this.dragMove, this.dragStart, this.dragEnd, this, this, this);
                this.los.draw();
                //this.ball.draw();
                // debugging
                // this.paper.circle(25, 60, 3).attr({ 'fill': 'red' });
                //this.paper.centerView(this.grid);
                // draw the editor data onto the field
                this.play.draw(this);
            };
            Field.prototype.placeAtYardline = function (element, yardline) {
            };
            Field.prototype.setOffset = function (offsetX, offsetY) {
                this.offset.x = offsetX;
                this.offset.y = offsetY;
                console.log('updated field cursor offset position', this.offset, this.getCoordinates());
            };
            Field.prototype.getCoordinates = function () {
                return this.grid.getGridCoordinatesFromPixels(new Playbook.Models.Coordinate(this.offset.x - Math.abs(this.paper.x), Math.abs(this.paper.y) + this.offset.y));
            };
            Field.prototype.remove = function () { };
            Field.prototype.click = function (e, self) {
                self.setOffset(e.offsetX, e.offsetY);
                var coords = self.getCoordinates();
                console.log('field clicked', self.clickDisabled ? 'disabled' : 'enabled', e, coords);
                var editorMode = self.canvas.editorMode;
                switch (editorMode) {
                    case Playbook.Editor.EditorModes.Select:
                        console.log('selection mode');
                        self.deselectAll();
                        break;
                    case Playbook.Editor.EditorModes.None:
                        console.log('no mode');
                        self.deselectAll();
                        break;
                    case Playbook.Editor.EditorModes.Assignment:
                        if (self.selectedPlayers.size() == 1) {
                            var player = self.selectedPlayers.getOne();
                            // initialize a new route, ensures a route is available
                            // for the following logic.
                            if (player.assignment.routes &&
                                player.assignment.routes.size() == 0) {
                                var route = new Playbook.Models.Route(player);
                                player.assignment.routes.add(route.guid, route);
                            }
                            // TODO: this will only get the first route, implement
                            // route switching
                            var playerRoute = player.assignment.routes.getOne();
                            if (playerRoute.dragInitialized)
                                break;
                            // route exists, append the node
                            playerRoute.addNode(coords);
                            console.log('set player route', player.label, playerRoute);
                            self.play.assignments.addAtIndex(player.assignment.guid, player.assignment, player.position.index);
                        }
                        else if (self.selectedPlayers.size() <= 0) {
                            console.log('select a player first');
                        }
                        else {
                            console.log('apply routes in bulk...?');
                        }
                        break;
                }
            };
            Field.prototype.hoverIn = function (e, self) { };
            Field.prototype.hoverOut = function (e, self) { };
            Field.prototype.mouseDown = function (e, self) {
                self.setOffset(e.offsetX, e.offsetY);
            };
            Field.prototype.dragMove = function (dx, dy, posx, posy, e) {
                console.log('field drag', dx, dy, posx, posy);
            };
            Field.prototype.dragStart = function (x, y, e) {
            };
            Field.prototype.dragEnd = function (e) {
            };
            Field.prototype.getBBoxCoordinates = function () { };
            Field.prototype.getPositionRelativeToBall = function (from) {
                return this.getPositionRelativeToElement(from, this.ball);
            };
            Field.prototype.getPositionRelativeToElement = function (from, to) {
                return null;
            };
            Field.prototype.getPositionRelativeToCoordinate = function (from, to) {
                return null;
            };
            Field.prototype.getPositionRelativeToWindow = function (from) {
                return null;
            };
            Field.prototype.addPlayer = function (placement, position, assignment) {
                var player = new Playbook.Models.Player(this, placement, position, assignment);
                player.draw();
                this.players.add(player.guid, player);
                return player;
            };
            Field.prototype.getPlayerWithPositionIndex = function (index) {
                var matchingPlayer = this.players.filterFirst(function (player) {
                    return player.hasPosition() && (player.position.index == index);
                });
                return matchingPlayer;
            };
            Field.prototype.applyFormation = function (formation) {
                console.log(formation);
                throw new Error('Field.applyFormation() not implemented...');
            };
            Field.prototype.applyAssignments = function (assignments) {
                var self = this;
                if (assignments.hasAssignments()) {
                    assignments.forEach(function (assignment, index) {
                        var player = self.getPlayerWithPositionIndex(assignment.positionIndex);
                        if (player) {
                            assignment.setContext(player);
                            player.assignment.erase();
                            player.assignment = assignment;
                            player.draw();
                        }
                    });
                    this.play.assignments = assignments;
                }
            };
            Field.prototype.applyPersonnel = function (personnel) {
                var self = this;
                this.players.forEach(function (player, index) {
                    var newPosition = personnel.positions.getIndex(index);
                    if (self.play.personnel && self.play.personnel.hasPositions()) {
                        self.play.personnel.positions.getIndex(index).fromJson(newPosition.toJson());
                    }
                    player.position.fromJson(newPosition.toJson());
                    player.draw();
                });
                this.play.personnel = personnel;
            };
            Field.prototype.deselectAll = function () {
                if (this.selectedPlayers.size() == 0)
                    return;
                this.selectedPlayers.removeEach(function (player, key) {
                    // will effectively tell the player to de-select itself
                    player.select();
                });
                console.log('All players de-selected', this.selectedPlayers);
            };
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
                    this.selectedPlayers.add(player.guid, player);
                }
                console.log(this.selectedPlayers);
            };
            return Field;
        })(Models.FieldElement);
        Models.Field = Field;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Grid = (function () {
            function Grid(context, cols, rows, gridsize) {
                this.context = context;
                this.canvas = this.context;
                this.paper = this.context.paper;
                this.dimensions = { cols: 0, rows: 0 };
                this.dashArray = ['- '];
                this.verticalStrokeOpacity = 0.1;
                this.horizontalStrokeOpacity = 0.3;
                this.strokeWidth = 0.5;
                this.GRIDSIZE = gridsize || 15;
                this.GRIDBASE = 10; // value must always be 10, do not change
                // TODO - want to set this to 2 to allow snapping in between grid lines
                this.divisor = 2;
                this.width = this.paper.width;
                this.height = this.paper.height;
                this.dimensions.cols = cols;
                this.dimensions.rows = rows;
            }
            Grid.prototype.setGridsize = function (gridsize, paper) {
                this.GRIDSIZE = gridsize;
                this.paper = paper;
                this.width = this.paper.width;
                this.height = this.paper.height;
            };
            Grid.prototype.draw = function () {
                var cols = this.dimensions.cols;
                var rows = this.dimensions.rows;
                for (var c = 1; c < cols; c++) {
                    var colX = c * this.GRIDSIZE;
                    var pathStr = Playbook.Utilities.getPathString(colX, 0, colX, rows * this.GRIDSIZE);
                    var p = this.paper.path(pathStr).attr({
                        'stroke-dasharray': this.dashArray,
                        'stroke-opacity': this.verticalStrokeOpacity,
                        'stroke-width': this.strokeWidth
                    });
                }
                for (var r = 1; r < rows; r++) {
                    var rowY = r * this.GRIDSIZE;
                    var pathStr = Playbook.Utilities.getPathString(0, rowY, this.width, rowY);
                    var opacity, dashes;
                    if (r % 10 == 0) {
                        if (r > 10 && r < 110) {
                            var value = (r - 10);
                            if (value > 50)
                                value = value - ((value - 50) * 2);
                            var str = value.toString();
                            var lineNumbersLeft = this.paper.text(2, r, str, false);
                            var lineNumbersRight = this.paper.text(50, r, str, false);
                        }
                        opacity = 1;
                        dashes = ['-'];
                    }
                    else {
                        opacity = this.horizontalStrokeOpacity;
                        dashes = this.dashArray;
                    }
                    var p = this.paper.path(pathStr).attr({
                        'stroke-dasharray': dashes,
                        'stroke-opacity': opacity,
                        'stroke-width': this.strokeWidth
                    });
                }
            };
            // returns the grid value for the bottom-most grid line (horizontal)
            Grid.prototype.bottom = function () {
                return this.dimensions.rows;
            };
            // returns the grid value for the right-most grid line (vertical)
            Grid.prototype.right = function () {
                return this.dimensions.cols;
            };
            Grid.prototype.getCenter = function () {
                return new Playbook.Models.Coordinate(Math.round(this.dimensions.cols / 2), Math.round(this.dimensions.rows / 2));
            };
            Grid.prototype.getCenterInPixels = function () {
                return this.getPixelsFromCoordinates(this.getCenter());
            };
            Grid.prototype.getCoordinates = function () {
                return new Playbook.Models.Coordinate(-1, -1); // TODO
            };
            Grid.prototype.getDimensions = function () {
                return this.dimensions;
            };
            Grid.prototype.gridProportion = function () {
                return this.GRIDSIZE / this.GRIDBASE;
            };
            Grid.prototype.computeGridZoom = function (val) {
                return val * this.gridProportion();
            };
            Grid.prototype.getPixelsFromCoordinate = function (val) {
                return val * this.GRIDSIZE;
            };
            Grid.prototype.getPixelsFromCoordinates = function (coords) {
                var c = new Playbook.Models.Coordinate(this.getPixelsFromCoordinate(coords.x), this.getPixelsFromCoordinate(coords.y));
                return c;
            };
            Grid.prototype.getGridCoordinatesFromPixels = function (coords) {
                // TODO: add in paper scroll offset
                var x = Math.round((coords.x / this.GRIDSIZE) * this.divisor) / this.divisor;
                var y = Math.round((coords.y / this.GRIDSIZE) * this.divisor) / this.divisor;
                return new Playbook.Models.Coordinate(x, y);
            };
            Grid.prototype.snapToNearest = function (coords) {
                return this.getGridCoordinatesFromPixels(coords);
            };
            Grid.prototype.snap = function (coords) {
                var snapX = this.snapPixel(coords.x);
                var snapY = this.snapPixel(coords.y);
                return new Playbook.Models.Coordinate(snapX, snapY);
            };
            // takes a pixel value and translates it into a corresponding
            // number of grid units
            Grid.prototype.snapPixel = function (val) {
                return Math.round(val / (this.GRIDSIZE / this.divisor)) * (this.GRIDSIZE / this.divisor);
            };
            Grid.prototype.isDivisible = function (val) {
                return val % (this.GRIDSIZE / this.divisor) == 0;
            };
            Grid.prototype.moveToPixels = function (from, toX, toY) {
                return null;
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
        var Hashmark = (function (_super) {
            __extends(Hashmark, _super);
            function Hashmark(context, offset) {
                _super.call(this, context);
                // hash marks should be -x- grid units from center
                this.offset = offset || 3;
                this.x = this.grid.getCenter().x + this.offset;
                this.y = 0;
                this.width = (this.grid.GRIDSIZE / 2);
                this.height = 1;
                this.opacity = 0.9;
                this.color = 'black';
            }
            Hashmark.prototype.draw = function () {
                for (var i = 11; i < 110; i++) {
                    this.raphael = this.paper.rect(this.x, i, this.width, this.height).attr({
                        'fill': this.color,
                        'fill-opacity': this.opacity,
                        'stroke-width': 0
                    });
                    this.paper.bump(-(this.width / 2), 0, this.raphael);
                }
            };
            return Hashmark;
        })(Models.FieldElement);
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
            function LineOfScrimmage(context, y) {
                _super.call(this, context);
                this.context = context;
                this.canvas = this.context.canvas;
                this.paper = this.context.paper;
                this.grid = this.canvas.grid;
                this.LOS_Y_OFFSET = 8;
                this.x = 1;
                this.y = this.grid.getCenter().y;
                this.width = this.paper.width - (2 * this.grid.GRIDSIZE);
                this.height = 4;
                this.color = 'blue';
                this.opacity = 0.25;
            }
            LineOfScrimmage.prototype.draw = function () {
                this.paper.rect(this.x, this.y, this.width, this.height).click(this.click).attr({
                    'fill': this.color,
                    'fill-opacity': this.opacity,
                    'stroke-width': 0
                });
                // todo: attach drag functionality
                // drag when moving ball
            };
            LineOfScrimmage.prototype.getSaveData = function () {
                return this.y;
            };
            return LineOfScrimmage;
        })(Models.FieldElement);
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
        var Paper = (function () {
            function Paper(canvas, width, height) {
                this.canvas = canvas;
                this.container = this.canvas.container;
                this.$container = this.canvas.$container;
                this.grid = this.canvas.grid;
                this.width = width; // account for border widths
                this.height = height;
                this.viewWidth = this.canvas.width;
                this.viewHeight = this.canvas.height;
                this.x = this.getXOffset();
                this.y = 0;
                this.scrollSpeed = 0.5;
                this.zoomSpeed = 100;
                this.Raphael = Raphael(canvas.container, this.width, this.height // * 2
                );
                // debugging
                this.showBorder = false;
            }
            Paper.prototype.getXOffset = function () {
                return -Math.round((this.viewWidth - this.width) / 2);
            };
            Paper.prototype.drawOutline = function () {
                var self = this;
                if (this.showBorder) {
                    // paper view port
                    if (!this.outline) {
                        this.outline = this.Raphael.rect(this.x + 5, this.y + 5, this.viewWidth - 10, this.viewHeight - 10);
                    }
                    this.outline.attr({
                        x: self.x + 5,
                        y: self.y + 5,
                        width: self.viewWidth - 10,
                        height: self.viewHeight - 10,
                        'fill': 'red',
                        'opacity': 0.2
                    });
                    // actual paper
                    if (!this.paperOutline) {
                        this.paperOutline = this.Raphael.rect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);
                    }
                    this.paperOutline.attr({
                        x: self.x + 1,
                        y: self.y + 1,
                        width: self.width - 2,
                        height: self.height - 2,
                        fill: 'blue',
                        opacity: 0.15
                    });
                }
            };
            Paper.prototype.resize = function (width) {
                console.log('resize paper', width);
                this.Raphael.canvas.setAttribute('width', width);
                this.viewWidth = width;
                this.x = this.getXOffset();
                var setting = this.Raphael.setViewBox(this.x, this.y, this.viewWidth, this.height, true);
                this.drawOutline();
            };
            Paper.prototype.setDimensions = function (width, height) {
                this.width = width;
                this.height = height;
                this.viewWidth = this.canvas.width;
                this.viewHeight = this.canvas.height;
                this.setViewBox();
            };
            Paper.prototype.setViewBox = function () {
                this.Raphael.canvas.setAttribute('width', this.viewWidth);
                var setting = this.Raphael.setViewBox(this.x, this.y, this.viewWidth, this.height, true);
                //this.Raphael.canvas.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                this.drawOutline();
                return setting;
            };
            Paper.prototype.zoom = function (deltaY) {
                if (deltaY < 0)
                    this.zoomOut();
                if (deltaY > 0)
                    this.zoomIn();
            };
            Paper.prototype.zoomToFit = function () {
                //Math.round(this.viewWidth / (this.grid.GRIDSIZE * 50));
            };
            Paper.prototype.zoomIn = function (speed) {
            };
            Paper.prototype.zoomOut = function (speed) {
            };
            Paper.prototype.scroll = function (scrollToX, scrollToY) {
                this.y = scrollToY;
                return this.setViewBox();
            };
            Paper.prototype.clear = function () {
                return this.Raphael.clear();
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
                var coords = new Playbook.Models.Coordinate(x, y);
                return !absolute ?
                    this.canvas.grid.getPixelsFromCoordinates(coords) :
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
                return this.Raphael.print(x, y, text, font, size, origin, letterSpacing);
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
                    coords.push(node.ax, node.ay);
                }
                return this.getPathString(initialize, coords);
            };
            Paper.prototype.getClosedPathString = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return this.getPathString.apply(this, args) + ' Z';
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
                    coords.push(node.ax, node.ay);
                }
                return this.getCurveString(initialize, coords);
            };
            Paper.prototype.buildPath = function (fromGrid, toGrid, width) {
                //console.log(from, to, width);
                var from = this.canvas.grid.getPixelsFromCoordinates(fromGrid);
                var to = this.canvas.grid.getPixelsFromCoordinates(toGrid);
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
        var RelativePosition = (function (_super) {
            __extends(RelativePosition, _super);
            function RelativePosition(from, to) {
                var fromCoords = new Playbook.Models.Coordinate(from.placement.x, from.placement.y);
                var toCoords = new Playbook.Models.Coordinate(to.x, to.y);
                var relativeCoords = this.grid(fromCoords, toCoords);
                this.distance = Playbook.Utilities.distance(fromCoords.x, fromCoords.y, toCoords.x, toCoords.y);
                this.theta = Playbook.Utilities.theta(fromCoords.x, fromCoords.y, toCoords.x, toCoords.y);
                _super.call(this, relativeCoords.x, relativeCoords.y);
            }
            RelativePosition.prototype.grid = function (from, to) {
                // returns values as grid units
                return new Playbook.Models.Coordinate(from.x - to.x, to.y - from.y);
            };
            RelativePosition.prototype.absolute = function () {
                // returns values as absolute pixels
                // 
                return null;
            };
            RelativePosition.prototype.window = function () {
                // returns pixel position relative to the window in pixels
                return null;
            };
            return RelativePosition;
        })(Playbook.Models.Coordinate);
        Models.RelativePosition = RelativePosition;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Sideline = (function (_super) {
            __extends(Sideline, _super);
            function Sideline(context, offset) {
                _super.call(this, context);
                this.context = context;
                this.canvas = this.context.canvas;
                this.paper = this.context.paper;
                this.color = '#111111'; //offset ? (offset < 0 ? 'red' : 'green'): 'black';
                this.opacity = 1;
                this.x = this.grid.getCenter().x;
                this.y = 0;
                this.width = this.grid.GRIDSIZE;
                this.height = this.paper.height;
                this.offset = offset || 0;
            }
            Sideline.prototype.draw = function () {
                // adjust the left sideline so that it does not overlap the grid
                // by shifting it left by its width so that its right edge aligns
                // with the gridline
                var bumpX = this.offset < 0 ? -this.width : 0;
                var rect = this.paper.rect(this.x + this.offset, this.y, this.width, this.height).attr({
                    'fill': this.color,
                    'fill-opacity': this.opacity,
                    'stroke-width': 0
                });
                this.paper.bump(bumpX, 0, rect);
            };
            return Sideline;
        })(Models.FieldElement);
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
            return this.getPathString.apply(this, args) + ' Z';
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
            var pathStr = this.getClosedPathString(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
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
        var Formation = (function (_super) {
            __extends(Formation, _super);
            function Formation(name) {
                _super.call(this, this);
                this.field = null;
                this.unitType = Playbook.Editor.UnitTypes.Other;
                this.parentRK = 1;
                this.editorType = Playbook.Editor.EditorTypes.Formation;
                this.name = name || 'untitled';
                this.associated = new Common.Models.Association();
                this.placements = new Playbook.Models.PlacementCollection();
                this.setDefault();
            }
            Formation.prototype.toJson = function () {
                return {
                    name: this.name,
                    key: this.key,
                    parentRK: this.parentRK,
                    unitType: this.unitType,
                    editorType: this.editorType,
                    guid: this.guid,
                    associated: this.associated.toJson(),
                    placements: this.placements.toJson()
                };
            };
            Formation.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.parentRK = json.parentRK;
                this.editorType = Playbook.Editor.EditorTypes.Formation;
                this.name = json.name;
                this.guid = json.guid;
                this.unitType = json.unitType;
                this.placements.fromJson(json.placements);
                this.key = json.key;
                this.associated.fromJson(json.associated);
            };
            Formation.prototype.setDefault = function () {
                this.placements.removeAll();
                var p1 = new Playbook.Models.Placement({ x: 26, y: 61 });
                var p2 = new Playbook.Models.Placement({ x: 27.5, y: 61 });
                var p3 = new Playbook.Models.Placement({ x: 24.5, y: 61 });
                var p4 = new Playbook.Models.Placement({ x: 23, y: 61 });
                var p5 = new Playbook.Models.Placement({ x: 29, y: 61 });
                var p6 = new Playbook.Models.Placement({ x: 26, y: 62 });
                var p7 = new Playbook.Models.Placement({ x: 22, y: 62 });
                var p8 = new Playbook.Models.Placement({ x: 10, y: 61 });
                var p9 = new Playbook.Models.Placement({ x: 40, y: 61 });
                var p10 = new Playbook.Models.Placement({ x: 26, y: 64 });
                var p11 = new Playbook.Models.Placement({ x: 26, y: 66 });
                this.placements.add(p1.guid, p1);
                this.placements.add(p2.guid, p2);
                this.placements.add(p3.guid, p3);
                this.placements.add(p4.guid, p4);
                this.placements.add(p5.guid, p5);
                this.placements.add(p6.guid, p6);
                this.placements.add(p7.guid, p7);
                this.placements.add(p8.guid, p8);
                this.placements.add(p9.guid, p9);
                this.placements.add(p10.guid, p10);
                this.placements.add(p11.guid, p11);
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
                var formations = json || [];
                for (var i = 0; i < formations.length; i++) {
                    var rawFormation = formations[i];
                    var formationModel = new Playbook.Models.Formation();
                    formationModel.fromJson(rawFormation);
                    this.add(formationModel.guid, formationModel);
                }
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
                this.setType = Playbook.Editor.PlaybookSetTypes.Personnel;
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
            Personnel.prototype.fromJson = function (json) {
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
                    positions: this.positions.toJsonArray(),
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
                this.setType = Playbook.Editor.PlaybookSetTypes.Personnel;
                this.guid = Common.Utilities.guid();
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
                    this.add(personnelModel.key, personnelModel);
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
            function Placement(options) {
                _super.call(this, this);
                if (!options)
                    options = {};
                this.x = options.x || 25;
                this.y = options.y || 60;
            }
            Placement.prototype.toJson = function () {
                return {
                    x: this.x,
                    y: this.y,
                    guid: this.guid
                };
            };
            Placement.prototype.fromJson = function (json) {
                this.x = json.x;
                this.y = json.y;
                this.guid = json.guid;
            };
            Placement.prototype.getCoordinates = function () {
                return new Playbook.Models.Coordinate(this.x, this.y);
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
            PlacementCollection.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.guid = json.guid;
                var placements = json.placements || [];
                for (var i = 0; i < placements.length; i++) {
                    var rawPlacement = placements[i];
                    var placementModel = new Playbook.Models.Placement();
                    placementModel.fromJson(rawPlacement);
                    this.add(placementModel.guid, placementModel);
                }
            };
            PlacementCollection.prototype.toJson = function () {
                return _super.prototype.toJsonArray.call(this);
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
                this.name = 'Default';
                this.assignments = new Playbook.Models.AssignmentCollection();
                this.formation = new Playbook.Models.Formation();
                this.personnel = new Playbook.Models.Personnel();
                this.type = Playbook.Editor.UnitTypes.Other;
            }
            Play.prototype.draw = function (field) {
                this.field = field;
                var self = this;
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
                this.assignments = new Playbook.Models.AssignmentCollection();
                this.assignments.fromJson(json.assignments);
                this.personnel = new Playbook.Models.Personnel();
                this.personnel.fromJson(json.personnel);
                this.type = json.type;
            };
            Play.prototype.toJson = function () {
                return {
                    key: this.key,
                    name: this.name,
                    assignmentsGuid: this.assignments.guid,
                    personnelGuid: this.personnel.guid,
                    formationGuid: this.formation.guid,
                    type: this.type,
                    guid: this.guid
                };
            };
            Play.prototype.hasAssignments = function () {
                return this.assignments && this.assignments.size() > 0;
            };
            Play.prototype.setDefault = function () {
                // empty what's already there, if anything...
                this.personnel.setDefault();
                this.formation.setDefault();
                // assignments?
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
        var PlayCollection = (function (_super) {
            __extends(PlayCollection, _super);
            function PlayCollection() {
                _super.call(this);
            }
            PlayCollection.prototype.addAllRaw = function (plays) {
                if (!plays)
                    plays = [];
                for (var i = 0; i < plays.length; i++) {
                    var obj = plays[i];
                    var rawPlay = obj.data.play;
                    rawPlay.key = obj.key;
                    // TODO
                    var playModel = new Playbook.Models.Play();
                    playModel.fromJson(rawPlay);
                    this.add(rawPlay.key, playModel);
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
                this.unitType = Playbook.Editor.UnitTypes.Other;
                this.active = false;
            }
            PlaybookModel.prototype.toJson = function () {
                return {
                    key: this.key,
                    name: this.name,
                    unitType: this.unitType,
                    active: this.active,
                    guid: this.guid
                };
            };
            PlaybookModel.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.key = json.key || this.key;
                this.name = json.name || this.name;
                this.unitType = json.type || this.unitType;
                this.active = json.active || this.active;
                this.guid = json.guid || this.guid;
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
                this.unitType = Playbook.Editor.UnitTypes.Other;
            }
            PlaybookModelCollection.prototype.toJson = function () {
                return {
                    unitType: this.unitType,
                    guid: this.guid,
                    playbooks: _super.prototype.toJson.call(this)
                };
            };
            PlaybookModelCollection.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.unitType = json.unitType || this.unitType;
                this.guid = json.guid || this.guid;
                var playbooks = json.playbooks || [];
                for (var i = 0; i < playbooks.length; i++) {
                    var rawPlaybook = playbooks[i];
                    var playbookModel = new Playbook.Models.PlaybookModel();
                    playbookModel.fromJson(rawPlaybook);
                    this.add(playbookModel.guid, playbookModel);
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
                this.playbooks = new Playbook.Models.PlaybookModelCollection();
                this.playbooks.unitType = unitType;
                this.formations = new Playbook.Models.FormationCollection();
                this.formations.unitType = unitType;
                this.personnel = new Playbook.Models.PersonnelCollection();
                this.personnel.unitType = unitType;
                this.assignments = new Playbook.Models.AssignmentCollection();
                this.assignments.unitType = unitType;
                this.name = name;
                this.active = false;
            }
            UnitType.getUnitTypes = function () {
                return Common.Utilities.convertEnumToList(Playbook.Editor.UnitTypes);
            };
            UnitType.prototype.toJson = function () {
                var json = {
                    playbooks: this.playbooks.toJson(),
                    formations: this.formations.toJson(),
                    personnel: this.personnel.toJson(),
                    assignments: this.assignments.toJson(),
                    unitType: this.unitType,
                    name: this.name,
                    active: this.active,
                    guid: this.guid
                };
                return json;
            };
            UnitType.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.unitType = json.unitType;
                this.name = json.name;
                this.active = json.active;
                this.guid = json.guid;
                this.playbooks.fromJson(json.playbooks);
                this.formations.fromJson(json.formations);
                this.personnel.fromJson(json.personnel);
                this.assignments.fromJson(json.assignments);
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
                this.add(offense.guid, offense);
                var defense = new Playbook.Models.UnitType(Playbook.Editor.UnitTypes.Defense, 'defense');
                this.add(defense.guid, defense);
                var specialTeams = new Playbook.Models.UnitType(Playbook.Editor.UnitTypes.SpecialTeams, 'special teams');
                this.add(specialTeams.guid, specialTeams);
                var other = new Playbook.Models.UnitType(Playbook.Editor.UnitTypes.Other, 'other');
                this.add(other.guid, other);
                var mixed = new Playbook.Models.UnitType(Playbook.Editor.UnitTypes.Mixed, 'mixed');
                this.add(mixed.guid, mixed);
            }
            UnitTypeCollection.prototype.getByUnitType = function (unitTypeValue) {
                return this.filterFirst(function (unitType) {
                    return unitType.unitType == unitTypeValue;
                });
            };
            UnitTypeCollection.prototype.getAllPlaybooks = function () {
                var collection = new Playbook.Models.PlaybookModelCollection();
                this.forEach(function (unitType, index) {
                    if (unitType && unitType.playbooks && unitType.playbooks.size()) {
                        collection.append(unitType.playbooks);
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
                // console.log('constructing player...');
                this.context = context;
                this.field = context;
                this.ball = this.field.ball;
                this.grid = this.field.grid;
                this.canvas = this.field.canvas;
                this.paper = this.field.paper;
                this.font = this.paper.getFont('Arial');
                this.placement = placement;
                this.position = position;
                this.assignment = assignment || new Playbook.Models.Assignment();
                this.assignment.positionIndex = this.position.index;
                // assign options
                this.id = Common.Utilities.randomId();
                this.guid = Common.Utilities.guid();
                var absCoords = this.grid.getPixelsFromCoordinates(new Playbook.Models.Coordinate(this.placement.x, this.placement.y));
                this.ax = absCoords.x;
                this.ay = absCoords.y;
                var ballCoords = this.getPositionRelativeToBall();
                this.bx = ballCoords.x;
                this.by = ballCoords.y;
                this.radius = this.field.grid.GRIDSIZE / 2;
                this.color = 'grey';
                this.width = this.field.grid.GRIDSIZE;
                this.height = this.field.grid.GRIDSIZE;
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
                this.box = new Models.FieldElement(this);
                this.icon = new Models.FieldElement(this);
                this.text = new Models.FieldElement(this);
                this.label = new Models.FieldElement(this);
                this.set = new Models.FieldElementSet(this);
                this.set.push(this);
            }
            Player.prototype.draw = function () {
                //TODO: all of these hard-coded integers are a problem
                this.paper.remove(this.box.raphael);
                this.box.ax = this.ax - (this.width / 2);
                this.box.ay = this.ay - (this.width / 2);
                this.box.raphael = this.paper.rect(this.box.ax, this.box.ay, this.width, this.height, true).attr({
                    'stroke-width': 0
                });
                this.box.x = this.box.raphael.attr('x');
                this.box.y = this.box.raphael.attr('y');
                this.box.width = this.width;
                this.box.height = this.height;
                this.paper.remove(this.icon.raphael);
                this.icon.raphael = this.paper.circle(this.placement.x, this.placement.y, this.radius).attr({
                    fill: 'white',
                    'stroke': this.unselectedColor,
                    'stroke-width': 1,
                });
                this.icon.x = this.box.raphael.attr('x');
                this.icon.y = this.box.raphael.attr('y');
                this.icon.radius = this.radius;
                this.icon.ax = this.icon.x + this.radius;
                this.icon.ay = this.icon.y + this.radius;
                this.icon.width = this.radius * 2;
                this.icon.height = this.radius * 2;
                this.icon.hover(this.hoverIn, this.hoverOut, this);
                this.icon.drag(this.dragMove, this.dragStart, this.dragEnd, this, this, this // drag end context
                );
                this.icon.mousedown(this.mousedown, this);
                this.paper.remove(this.text.raphael);
                this.text.ax = this.ax;
                this.text.ay = this.ay + 20; // TODO
                this.text.raphael = this.paper.text(this.text.ax, this.text.ay, [this.bx, ', ', this.by].join(''), true);
                this.text.raphael.node.setAttribute('class', 'no-highlight');
                this.paper.remove(this.label.raphael);
                this.label.ax = this.ax;
                this.label.ay = this.ay;
                this.label.raphael = this.paper.text(this.label.ax, this.label.ay, this.position.label, true);
                this.label.raphael.node.setAttribute('class', 'no-highlight');
                this.set.push.apply(this.set, [
                    this.icon,
                    this.box,
                    this.label,
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
            Player.prototype.mousedown = function (e, self) {
                // TODO: enumerate e.which (Event.SHIFT_)
                if (e.which == 3) {
                    console.log('right click');
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
                console.log('player set', self.set);
                console.log('player click+shift: ', e.shiftKey);
                console.log('player click+ctrl: ', e.ctrlKey);
                console.log('player click+alt: ', e.altKey);
                console.log('player click+meta: ', e.metaKey);
                self.field.togglePlayerSelection(self);
                var editorMode = self.canvas.editorMode;
                switch (editorMode) {
                    case Playbook.Editor.EditorModes.Select:
                        console.log('Select player');
                        break;
                    case Playbook.Editor.EditorModes.Assignment:
                        console.log('Set player assignment');
                        break;
                }
                return e.returnValue;
            };
            Player.prototype.dragMove = function (dx, dy, posx, posy, e) {
                // (snapping) only adjust the positioning of the player
                // for every grid-unit worth of movement
                var snapDx = this.grid.snapPixel(dx);
                var snapDy = this.grid.snapPixel(dy);
                this.dx = snapDx;
                this.dy = snapDy;
                // do not allow dragging while in route mode
                if (this.canvas.editorMode == Playbook.Editor.EditorModes.Assignment) {
                    console.log('drawing route', dx, dy, posx, posy);
                    if (!this.assignment) {
                        this.assignment = new Playbook.Models.Assignment();
                        this.assignment.positionIndex = this.position.index;
                    }
                    var route = this.assignment.routes.getOne();
                    // TODO: Implement route switching
                    if (!route) {
                        console.log('creating route');
                        var newRoute = new Playbook.Models.Route(this, true);
                        this.assignment.routes.add(newRoute.guid, newRoute);
                        route = this.assignment.routes.get(newRoute.guid);
                    }
                    if (route.dragInitialized) {
                        var coords = new Playbook.Models.Coordinate(this.ax + snapDx, this.ay + snapDy);
                        route.initializeCurve(coords, e.shiftKey);
                    }
                    return;
                }
                else if (this.canvas.editorMode == Playbook.Editor.EditorModes.Select) {
                    console.log('dragging player & route');
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
                    if (this.grid.isDivisible(dx) && this.grid.isDivisible(dy))
                        console.log('snap:', snapDx, snapDy);
                    if (context.set) {
                        // apply the transform to the group
                        context.set.dragAll(snapDx, snapDy);
                    }
                    var coords = context.getCoordinates(context.ax + snapDx, context.ay + snapDy);
                    if (context.placement) {
                        context.placement.x = coords.x;
                        context.placement.y = coords.y;
                    }
                    var toBall = context.getPositionRelativeToBall();
                    context.bx = toBall.x;
                    context.by = toBall.y;
                    if (context.text) {
                        context.text.raphael.attr({
                            text: [
                                context.bx,
                                ', ',
                                context.by
                            ].join('')
                        });
                    }
                }
                else if (e.shiftKey) {
                }
                else if (e.which == 3) {
                    console.log('left click, do not drag');
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
            Player.prototype.getPositionRelativeToBall = function () {
                return new Playbook.Models.RelativePosition(this, this.ball);
            };
            Player.prototype.getCoordinatesFromAbsolutePosition = function () {
                return new Playbook.Models.Coordinate(this.ax, this.ay);
            };
            Player.prototype.getCoordinates = function (px, py) {
                var toPixelCoords = new Playbook.Models.Coordinate(px, py);
                var toGridCoords = this.grid.getGridCoordinatesFromPixels(toPixelCoords);
                return toGridCoords;
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
            Player.prototype.getSaveData = function () {
            };
            Player.prototype.onkeypress = function () {
            };
            Player.prototype.hasPlacement = function () {
                return this.placement != null;
            };
            Player.prototype.hasPosition = function () {
                return this.position != null;
            };
            return Player;
        })(Models.FieldElement);
        Models.Player = Player;
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
var TeamMember = (function () {
    function TeamMember() {
    }
    return TeamMember;
})();
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
                    collection.add(blank.guid, blank);
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
            PositionCollection.prototype.toJson = function () {
                return {
                    guid: this.guid,
                    positions: _super.prototype.toJson.call(this)
                };
            };
            PositionCollection.prototype.fromJson = function (positions) {
                if (!positions)
                    return;
                for (var i = 0; i < positions.length; i++) {
                    var rawPosition = positions[i];
                    var positionModel = new Playbook.Models.Position();
                    positionModel.fromJson(rawPosition);
                    this.add(positionModel.guid, positionModel);
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
            function Route(context, dragInitialized) {
                _super.call(this, this);
                if (context) {
                    this.context = context;
                    this.grid = this.context.grid;
                    this.field = this.context.field;
                    this.paper = this.context.paper;
                    this.nodes = new Common.Models.ModifiableLinkedList();
                    // add root node
                    var root = this.addNode(this.context.placement.getCoordinates(), Playbook.Models.RouteNodeType.Root, false);
                    root.data.disabled = true;
                }
                this.dragInitialized = dragInitialized === true;
                this.path = new Playbook.Models.FieldElement(this);
            }
            Route.prototype.setContext = function (context) {
                if (context) {
                    this.context = context;
                    this.grid = this.context.grid;
                    this.field = this.context.field;
                    this.paper = this.context.paper;
                    var self_1 = this;
                    this.nodes.forEach(function (node, index) {
                        node.data.setContext(self_1);
                        // Pushing this onto the fieldElementSet maintained
                        // by 'self.context', which is a Player. This fieldElementSet
                        // is a Raphael set, which allows bulk transformations.
                        if (!self_1.context.set.getByGuid(node.data.guid)) {
                            self_1.context.set.push(node.data);
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
                        var coords = new Playbook.Models.Coordinate(rawNode.x, rawNode.y);
                        var routeNodeModel = new Playbook.Models.RouteNode(null, coords, rawNode.type);
                        routeNodeModel.fromJson(rawNode);
                        this.addNode(routeNodeModel.getCoordinates(), routeNodeModel.type, false);
                    }
                }
            };
            Route.prototype.toJson = function () {
                return {
                    nodes: this.nodes.toJsonArray(),
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
                if (!this.context) {
                    throw new Error('Route context is not set');
                }
                var pathStr = this.getMixedStringFromNodes(this.nodes.toArray());
                console.log(pathStr);
                this.paper.remove(this.path.raphael);
                this.path.raphael = this.paper.path(pathStr).attr({
                    'stroke': 'green',
                    'stroke-width': 2
                });
                this.path.raphael.node.setAttribute('class', 'painted-fill');
                this.context.set.exclude(this.path);
                this.context.set.push(this.path);
            };
            Route.prototype.drawCurve = function (node) {
                if (!this.context) {
                    throw new Error('Route context is not set');
                }
                if (node) {
                }
                // update path
                var dataArray = this.nodes.toDataArray();
                var pathStr = this.paper.getCurveStringFromNodes(true, dataArray);
                this.paper.remove(this.path.raphael);
                this.path.raphael = this.paper.path(pathStr).attr({
                    'stroke': '#22CFA7',
                    'stroke-width': 2
                });
                this.path.raphael.node.setAttribute('class', 'painted-fill');
                this.context.set.exclude(this.path);
                this.context.set.push(this.path);
            };
            Route.prototype.drawLine = function () {
                if (!this.context) {
                    throw new Error('Route context is not set');
                }
                var pathStr = this.paper.getPathStringFromNodes(true, this.nodes.toDataArray());
                this.paper.remove(this.path.raphael);
                this.path.raphael = this.paper.path(pathStr).attr({
                    'stroke': '#B82500',
                    'stroke-width': 2
                });
                this.path.raphael.node.setAttribute('class', 'painted-fill');
                this.context.set.exclude(this.path);
                this.context.set.push(this.path);
            };
            Route.prototype.initializeCurve = function (coords, flip) {
                // if(coords.x != this.context.x && coords.y != this.context.y) {
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
                    control = this.addNode(new Playbook.Models.Coordinate(this.nodes.root.data.x, this.nodes.root.data.y), Playbook.Models.RouteNodeType.CurveControl, false); // false: do not render
                    end = this.addNode(this.grid.getGridCoordinatesFromPixels(coords), Playbook.Models.RouteNodeType.CurveEnd, false); // false: do not render
                }
                if (!this.nodes || !this.nodes.root || !this.nodes.root.data)
                    throw new Error('failed to get control and end nodes');
                // get control and end nodes
                control = this.nodes.getIndex(1);
                console.log('root: ', flip, this.nodes.root.data, this.nodes.root.data.ax, this.nodes.root.data.ay);
                if (flip) {
                    control.data.ax = coords.x;
                    control.data.ay = this.nodes.root.data.ay;
                }
                else {
                    control.data.ax = this.nodes.root.data.ax;
                    control.data.ay = coords.y;
                }
                control.data.ox = control.data.ax;
                control.data.oy = control.data.ay;
                var controlGridCoords = this.grid.getGridCoordinatesFromPixels(new Playbook.Models.Coordinate(control.data.ax, control.data.ay));
                control.data.x = controlGridCoords.x;
                control.data.y = controlGridCoords.y;
                if (control.data.raphael) {
                    control.data.raphael.attr({
                        cx: control.data.ax,
                        cy: control.data.ay
                    });
                }
                end = this.nodes.getIndex(2);
                end.data.ax = coords.x;
                end.data.ay = coords.y;
                end.data.ox = end.data.ax;
                end.data.oy = end.data.ay;
                var endGridCoords = this.grid.getGridCoordinatesFromPixels(new Playbook.Models.Coordinate(end.data.ax, end.data.ay));
                end.data.x = endGridCoords.x;
                end.data.y = endGridCoords.y;
                if (end.data.raphael) {
                    end.data.raphael.attr({
                        cx: end.data.ax,
                        cy: end.data.ay
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
                //let fromNode = this.getLastNode();
                var routeNode = new Playbook.Models.RouteNode(this, coords, type);
                // let self = this;
                // routeNode.onModified(function(data: any) {
                // 	self.generateChecksum();
                // });
                var node = new Common.Models.LinkedListNode(routeNode, null);
                this.nodes.add(node);
                //this.player.set.push(path, node);
                if (render !== false) {
                    node.data.draw();
                    this.context.set.push(node.data);
                    this.draw();
                }
                return node;
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
                    this.add(routeModel.guid, routeModel);
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
        // Maintains a list of actions that can be taken
        // at each route node
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
            function RouteNode(context, coords, type) {
                _super.call(this, this);
                if (context) {
                    this.context = context;
                    this.field = this.context.field;
                    this.grid = this.context.grid;
                    this.paper = this.context.paper;
                }
                if (coords) {
                    this.x = coords.x;
                    this.y = coords.y;
                    if (this.grid) {
                        var absCoords = this.grid.getPixelsFromCoordinates(coords);
                        this.ax = absCoords.x;
                        this.ay = absCoords.y;
                        this.cx = this.ax;
                        this.cy = this.ay;
                        this.ox = this.ax;
                        this.oy = this.ay;
                        this.radius = this.grid.GRIDSIZE / 4;
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
                // route node has been modified
                this.setModified();
            }
            RouteNode.prototype.setContext = function (context) {
                this.context = context;
                this.field = this.context.field;
                this.grid = this.context.grid;
                this.paper = this.context.paper;
                var coords = new Playbook.Models.Coordinate(this.x, this.y);
                var absCoords = this.context.grid.getPixelsFromCoordinates(coords);
                this.ax = absCoords.x;
                this.ay = absCoords.y;
                this.cx = this.ax;
                this.cy = this.ay;
                this.ox = this.ax;
                this.oy = this.ay;
                this.radius = this.grid.GRIDSIZE / 4;
                this.width = this.radius * 2;
                this.height = this.radius * 2;
                this.draw();
            };
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
                this.ax = json.ax;
                this.ay = json.ay;
                this.dx = json.dx;
                this.dy = json.dy;
                this.ox = json.ox;
                this.oy = json.oy;
                this.cx = json.cx;
                this.cy = json.cy;
                this.x = json.x;
                this.y = json.y;
                // route node has been modified
                this.setModified();
            };
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
            RouteNode.prototype.getCoordinates = function () {
                return new Playbook.Models.Coordinate(this.x, this.y);
            };
            RouteNode.prototype.erase = function () {
                this.paper.remove(this.raphael);
                this.paper.remove(this.actionGraphic.raphael);
            };
            RouteNode.prototype.draw = function () {
                console.log('draw node');
                this.raphael = this.context.paper.circle(this.x, this.y, this.radius).attr({
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
                        var theta = this.paper.theta(this.node.prev.data.ax, this.node.prev.data.ay, this.ax, this.ay);
                        var thetaDegrees = this.paper.toDegrees(theta);
                        console.log('theta: ', theta, thetaDegrees);
                        this.actionGraphic.x = this.x - 0.5;
                        this.actionGraphic.y = this.y;
                        this.actionGraphic.width = this.width * 2;
                        this.actionGraphic.height = this.height * 2;
                        this.actionGraphic.ax = this.ax - this.width;
                        this.actionGraphic.ay = this.ay;
                        var pathStr = this.paper.getPathString(true, [
                            this.actionGraphic.ax,
                            this.actionGraphic.ay,
                            this.actionGraphic.ax + (this.width * 2),
                            this.actionGraphic.ay
                        ]);
                        this.actionGraphic.raphael = this.context.paper.path(pathStr).attr({
                            'stroke': 'blue',
                            'stroke-width': 2
                        });
                        this.actionGraphic.raphael.node.setAttribute('class', 'painted-fill');
                        this.actionGraphic.raphael.rotate((90 - thetaDegrees));
                        break;
                    case Playbook.Models.RouteNodeActions.Delay:
                        console.log('drawing block action');
                        this.paper.remove(this.actionGraphic.raphael);
                        this.actionGraphic.x = this.x - 0.5;
                        this.actionGraphic.y = this.y - 0.5;
                        this.actionGraphic.width = this.width * 2;
                        this.actionGraphic.height = this.height * 2;
                        this.actionGraphic.raphael = this.context.paper.rect(this.actionGraphic.x, this.actionGraphic.y, this.actionGraphic.width, this.actionGraphic.height).attr({
                            'stroke': 'orange',
                            'stroke-width': 1
                        });
                        this.actionGraphic.raphael.node.setAttribute('class', 'painted-fill');
                        break;
                }
            };
            RouteNode.prototype.contextmenuHandler = function (e, self) {
                console.log('route node contextmenu');
                self.field.canvas.invoke(Playbook.Editor.CanvasActions.RouteNodeContextmenu, 'open route node context menu...', self);
            };
            RouteNode.prototype.hoverIn = function (e, self) {
                if (!this.disabled && !this.selected) {
                    self.toggleOpacity();
                    self.raphael.attr({
                        'opacity': self.opacity
                    });
                }
            };
            RouteNode.prototype.hoverOut = function (e, self) {
                if (!this.disabled && !this.selected) {
                    self.toggleOpacity();
                    self.raphael.attr({
                        'opacity': self.opacity
                    });
                }
            };
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
                    'opacity': 0.2,
                });
                this.context.context.set.exclude(start.controlPath);
                this.context.context.set.push(start.controlPath);
            };
            RouteNode.prototype.click = function (e, self) {
                console.log('route node:', self);
                self.select();
                self.toggleOpacity();
                self.raphael.attr({ 'opacity': self.opacity });
            };
            RouteNode.prototype.dragMove = function (dx, dy, posx, posy, e) {
                if (this.disabled) {
                    return;
                }
                // (snapping) only adjust the positioning of the player
                // for every grid-unit worth of movement
                var snapDx = this.grid.snapPixel(dx);
                var snapDy = this.grid.snapPixel(dy);
                this.moveByDelta(snapDx, snapDy);
                var gridCoords = this.grid.getGridCoordinatesFromPixels(new Playbook.Models.Coordinate(this.ax, this.ay));
                this.x = gridCoords.x;
                this.y = gridCoords.y;
                console.log(this.ox, this.oy, this.ax, this.ay, this.cx, this.cy, this.dx, this.dy, this.x, this.y);
                this.raphael.transform(['t', this.dx, ', ', this.dy].join(''));
                if (this.actionGraphic.raphael) {
                    this.actionGraphic.dx = snapDx - 0.5;
                    this.actionGraphic.dy = snapDy - 0.5;
                    this.actionGraphic.ax = this.ox + this.dx - 0.5;
                    this.actionGraphic.ay = this.oy + this.dy - 0.5;
                    this.actionGraphic.x = gridCoords.x - 0.5;
                    this.actionGraphic.y = gridCoords.y - 0.5;
                    this.actionGraphic.raphael.transform(['t', this.actionGraphic.dx, ', ', this.actionGraphic.dy].join(''));
                    var theta = this.paper.theta(this.node.prev.data.ax, this.node.prev.data.ay, this.ax, this.ay);
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
            RouteNode.prototype.dragStart = function (x, y, e) {
                console.log('dragStart() not implemented');
            };
            RouteNode.prototype.dragEnd = function (e) {
                this.raphael.transform(['t', 0, ', ', 0].join(''));
                this.ox = this.ax;
                this.oy = this.ay;
                this.dx = 0;
                this.dy = 0;
                this.raphael.attr({
                    cx: this.ax,
                    cy: this.ay
                });
                if (this.actionGraphic.raphael) {
                    this.actionGraphic.raphael.transform(['t', 0, ', ', 0].join(''));
                    this.actionGraphic.ox = this.actionGraphic.ax;
                    this.actionGraphic.oy = this.actionGraphic.ay;
                    this.actionGraphic.dx = 0;
                    this.actionGraphic.dy = 0;
                    // this.actionGraphic.raphael.attr({
                    // 	x: this.actionGraphic.ax - (this.actionGraphic.width / 2),
                    // 	y: this.actionGraphic.ay - (this.actionGraphic.height / 2)
                    // });
                    this.drawAction();
                }
                // route node has been modified
                this.setModified();
            };
            RouteNode.prototype.moveByDelta = function (dx, dy) {
                this.dx = dx;
                this.dy = dy;
                this.ax = this.ox + this.dx;
                this.ay = this.oy + this.dy;
                this.cx = this.ax;
                this.cy = this.ay;
                // route node has been modified
                this.setModified();
            };
            RouteNode.prototype.isCurveNode = function () {
                return this.type == Playbook.Models.RouteNodeType.CurveControl ||
                    this.type == Playbook.Models.RouteNodeType.CurveEnd ||
                    this.type == Playbook.Models.RouteNodeType.CurveStart;
            };
            RouteNode.prototype.setAction = function (action) {
                this.action = action;
                console.log('updating action', this.action);
                this.drawAction();
                // route node has been modified
                this.setModified();
            };
            RouteNode.prototype.toggleSelect = function () {
                this.selected = !this.selected;
            };
            RouteNode.prototype.select = function () {
                this.selected = true;
            };
            RouteNode.prototype.deselect = function () {
                this.selected = false;
            };
            RouteNode.prototype.toggleOpacity = function () {
                this.opacity = this.opacity == 1 ? 0 : 1;
            };
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
        var Tab = (function () {
            function Tab(play) {
                this.title = 'Untitled';
                this.guid = Common.Utilities.guid();
                this.active = true;
                this.play = play;
                this.key = play.key;
                this.type = play.type;
                this.editorType = play.editorType;
                this.title = play.name;
            }
            return Tab;
        })();
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
                var results = null;
                this.forEach(function (tab, index) {
                    if (tab && tab.play && tab.play.guid == guid) {
                        results = tab;
                    }
                });
                return results;
            };
            return TabCollection;
        })(Common.Models.Collection);
        Models.TabCollection = TabCollection;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../playbook.ts' />
/// <reference path='../../../common/models/models.ts' />
/// <reference path='../interfaces/ICanvas.ts' />
/// <reference path='../interfaces/IListener.ts' />
/// <reference path='../interfaces/IEditorObject.ts' />
/// <reference path='../interfaces/IFieldContext.ts' />
/// <reference path='./assignment/Assignment.ts' />
/// <reference path='./assignment/AssignmentCollection.ts' />
/// <reference path='./field/FieldElement.ts' />
/// <reference path='./field/FieldElementSet.ts' />
/// <reference path='./field/Ball.ts' />
/// <reference path='./field/Canvas.ts' />
/// <reference path='./field/CanvasListener.ts' />
/// <reference path='./field/Coordinate.ts' />
/// <reference path='./field/Endzone.ts' />
/// <reference path='./field/Field.ts' />
/// <reference path='./field/Grid.ts' />
/// <reference path='./field/GridSquare.ts' />
/// <reference path='./field/Hashmark.ts' />
/// <reference path='./field/LineOfScrimmage.ts' />
/// <reference path='./field/Listener.ts' />
/// <reference path='./field/Paper.ts' />
/// <reference path='./field/RelativePosition.ts' />
/// <reference path='./field/Sideline.ts' />
/// <reference path='./field/Utilities.ts' />
/// <reference path='./formation/Formation.ts' />
/// <reference path='./formation/FormationCollection.ts' />
/// <reference path='./personnel/Personnel.ts' />
/// <reference path='./personnel/PersonnelCollection.ts' />
/// <reference path='./placement/Placement.ts' />
/// <reference path='./placement/PlacementCollection.ts' />
/// <reference path='./play/Play.ts' />
/// <reference path='./play/PlayCollection.ts' />
/// <reference path='./playbook/PlaybookModel.ts' />
/// <reference path='./playbook/PlaybookModelCollection.ts' />
/// <reference path='./playbook/UnitType.ts' />
/// <reference path='./playbook/UnitTypeCollection.ts' />
/// <reference path='./player/Player.ts' />
/// <reference path='./player/PlayerCollection.ts' />
/// <reference path='./player/TeamMember.ts' />
/// <reference path='./position/Position.ts' />
/// <reference path='./position/PositionCollection.ts' />
/// <reference path='./route/Route.ts' />
/// <reference path='./route/RouteCollection.ts' />
/// <reference path='./route/RouteNode.ts' />
/// <reference path='./tab/Tab.ts' />
/// <reference path='./tab/TabCollection.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='../models/models.ts' />
/// <reference path='./ICanvas.ts' />
/// <reference path='./IEditorObject.ts' />
/// <reference path='./IListener.ts' />
/// <reference path='./IFieldContext.ts' />
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
        (function (PlaybookSetTypes) {
            PlaybookSetTypes[PlaybookSetTypes["None"] = 0] = "None";
            PlaybookSetTypes[PlaybookSetTypes["Personnel"] = 1] = "Personnel";
            PlaybookSetTypes[PlaybookSetTypes["Assignment"] = 2] = "Assignment";
        })(Editor.PlaybookSetTypes || (Editor.PlaybookSetTypes = {}));
        var PlaybookSetTypes = Editor.PlaybookSetTypes;
        (function (UnitTypes) {
            UnitTypes[UnitTypes["Offense"] = 0] = "Offense";
            UnitTypes[UnitTypes["Defense"] = 1] = "Defense";
            UnitTypes[UnitTypes["SpecialTeams"] = 2] = "SpecialTeams";
            UnitTypes[UnitTypes["Other"] = 3] = "Other";
            UnitTypes[UnitTypes["Mixed"] = 4] = "Mixed";
        })(Editor.UnitTypes || (Editor.UnitTypes = {}));
        var UnitTypes = Editor.UnitTypes;
        (function (EditorModes) {
            EditorModes[EditorModes["None"] = 0] = "None";
            EditorModes[EditorModes["Select"] = 1] = "Select";
            EditorModes[EditorModes["Formation"] = 2] = "Formation";
            EditorModes[EditorModes["Assignment"] = 3] = "Assignment";
            EditorModes[EditorModes["Zoom"] = 4] = "Zoom";
        })(Editor.EditorModes || (Editor.EditorModes = {}));
        var EditorModes = Editor.EditorModes;
        (function (EditorTypes) {
            EditorTypes[EditorTypes["Formation"] = 0] = "Formation";
            EditorTypes[EditorTypes["Assignment"] = 1] = "Assignment";
            EditorTypes[EditorTypes["Play"] = 2] = "Play";
            EditorTypes[EditorTypes["Set"] = 3] = "Set";
        })(Editor.EditorTypes || (Editor.EditorTypes = {}));
        var EditorTypes = Editor.EditorTypes;
    })(Editor = Playbook.Editor || (Playbook.Editor = {}));
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
    'impakt.playbook.details',
    'impakt.playbook.editor',
    'impakt.playbook.layout',
    'impakt.playbook.nav',
])
    .config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        console.debug('impakt.playbook - config');
        // impakt module states
        $stateProvider
            .state('playbook', {
            url: '/playbook',
            templateUrl: 'modules/playbook/playbook.tpl.html',
            controller: 'playbook.ctrl'
        })
            .state('playbook.drilldown', {
            url: '/{key:int}'
        })
            .state('playbook.editor', {
            url: '/editor',
            templateUrl: 'modules/playbook/editor/playbook-editor.tpl.html',
            controller: 'playbook.editor.ctrl',
            params: {
                data: null
            }
        })
            .state('playbook.layout', {
            url: '/layout',
            templateUrl: 'modules/playbook/layout/playbook-layout.tpl.html'
        });
    }])
    .run(['$stateParams', '__localStorage', function ($stateParams, __localStorage) {
        console.debug('impakt.playbook - run');
    }]);
/// <reference path='../playbook.mdl.ts' />
impakt.playbook.browser = angular.module('impakt.playbook.browser', [])
    .config(function () {
    console.debug('impakt.playbook.browser - config');
})
    .run(function () {
    console.debug('impakt.playbook.browser - run');
});
/// <reference path='./playbook-browser.mdl.ts' />
impakt.playbook.browser.controller('playbook.browser.ctrl', ['$scope', '__modals', '_playbookBrowser',
    function ($scope, __modals, _playbookBrowser) {
        $scope.isCollapsed = _playbookBrowser.isCollapsed;
        $scope.unitTypes = impakt.context.Playbook.unitTypes;
        $scope.unitTypesEnum = impakt.context.Playbook.unitTypesEnum;
        $scope.playbooks = impakt.context.Playbook.playbooks;
        $scope.selectedUnitType = null;
        $scope.selectedPlaybook = null;
        $scope.formations = impakt.context.Playbook.formations;
        $scope.associatedFormations = new Playbook.Models.FormationCollection();
        _playbookBrowser.onready(function () {
            console.log($scope.playbookData);
        });
        $scope.selectUnitType = function (unitType) {
            console.log('selected unit type', unitType.name, unitType);
            $scope.selectedUnitType = unitType;
        };
        $scope.selectPlaybook = function (playbook) {
            console.log('selected playbook', playbook);
            $scope.selectedPlaybook = playbook;
            $scope.formations.forEach(function (formation, index) {
                if (formation.associated.playbooks.indexOf($scope.selectedPlaybook.guid) > -1) {
                    $scope.associatedFormations.add(formation.guid, formation);
                }
            });
        };
        $scope.getPlaybook = function (playbookKey) {
            _playbookBrowser.getPlaybook(playbookKey);
        };
        $scope.refreshPlaybook = function (playbookKey) {
            _playbookBrowser.refreshPlaybook(playbookKey);
        };
        $scope.getPlaybooks = function () {
            _playbookBrowser.getPlaybooks();
        };
        $scope.createPlaybook = function () {
            console.log('create playbook');
            var modalInstance = __modals.open('', 'modules/playbook/modals/create-playbook/create-playbook.tpl.html', 'playbook.modals.createPlaybook.ctrl', {});
            modalInstance.result.then(function (createdPlaybook) {
                console.log(createdPlaybook);
            }, function (results) {
                console.log('dismissed');
            });
        };
        $scope.deletePlaybook = function (playbook) {
            console.log('delete playbook');
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
        $scope.getFormations = function (playbook) {
            _playbookBrowser.getFormations(playbook);
        };
        $scope.createFormation = function () {
            var modalInstance = __modals.open('', 'modules/playbook/modals/create-formation/create-formation.tpl.html', 'playbook.modals.createFormation.ctrl', {
                playbook: function () {
                    return $scope.selectedPlaybook;
                },
                unitType: function () {
                    return $scope.selectedUnitType;
                }
            });
            modalInstance.result.then(function (createdFormation) {
                $scope.associatedFormations.add(createdFormation.guid, createdFormation);
            }, function (results) {
                console.log('dismissed');
            });
        };
        $scope.deleteFormation = function (formation) {
            console.log('delete formation');
            var modalInstance = __modals.open('', 'modules/playbook/modals/delete-formation/delete-formation.tpl.html', 'playbook.modals.deleteFormation.ctrl', {
                formation: function () {
                    return formation;
                }
            });
            modalInstance.result.then(function (results) {
                $scope.associatedFormations.remove(formation.guid);
            }, function (results) {
                console.log('dismissed');
            });
        };
        $scope.editFormation = function (formation) {
            console.log('open for editing', formation);
            formation.active = !formation.active;
            _playbookBrowser.editFormation(formation);
        };
        $scope.createSet = function (formation) {
            console.log('create set', formation.key);
            var modalInstance = __modals.open('', 'modules/playbook/modals/create-set/create-set.tpl.html', 'playbook.modals.createSet.ctrl', {
                formation: function () {
                    return formation;
                }
            });
            modalInstance.result.then(function (createdSet) {
                console.log(createdSet);
            }, function (results) {
                console.log('dismissed');
            });
        };
        $scope.deleteSet = function (formation, set) {
            console.log('delete set');
            var modalInstance = __modals.open('', 'modules/playbook/modals/delete-set/delete-set.tpl.html', 'playbook.modals.deleteSet.ctrl', {
                set: function () {
                    return set;
                },
                formation: function () {
                    return formation;
                }
            });
            modalInstance.result.then(function (results) {
                console.log(results);
            }, function (results) {
                console.log('dismissed');
            });
        };
    }]);
/// <reference path='./playbook-browser.mdl.ts' />
impakt.playbook.browser.service('_playbookBrowser', [
    '$rootScope',
    '$q',
    '$state',
    '__localStorage',
    '_playbook',
    function ($rootScope, $q, $state, __localStorage, _playbook) {
        console.debug('service: impakt.playbook.browser');
        var self = this;
        // playbook data by playbook type
        this.playbookData = new Playbook.Models.PlaybookData();
        // Set browser to expanded or collapsed by default
        this.isCollapsed = false;
        this.init = function () {
            // TODO - issue #43 raised for faulty getFormation response
            this.checkForDefaultItem();
            this.getPlaybooks();
        };
        this.getPositionList = function (type) {
            return impakt.context.positionDefaults.getByUnitType(type);
        };
        this.checkForDefaultItem = function () {
            var d = $q.defer();
            if (__localStorage.isDefaultEditorInfoSet()) {
                var editorInfo = __localStorage.getDefaultEditorInfo();
            }
            return d.promise;
        };
        this.resetDefaultPlaybook = function () {
            $state.transitionTo('playbook');
            __localStorage.resetDefaultPlaybook();
        };
        this.refreshPlaybook = function (key) {
            var d = $q.defer();
            this.getPlaybook(key).then(function (playbook) {
                d.resolve(playbook);
            }, function (err) {
                d.reject(err);
            });
            return d.promise;
        };
        this.getPlaybooks = function () {
            return _playbook.getPlaybooks().then(function (playbooks) {
                console.log(playbooks);
                self.playbookData.fromJson(playbooks);
                self.ready(self.playbookData);
            }, function (err) {
                console.error(err);
            });
        };
        this.getPlaybook = function (key) {
            var d = $q.defer();
            _playbook.getPlaybook(key).then(function (playbook) {
                self.playbookData.get(playbook.type).set(key, playbook);
                self.getFormations(key)
                    .then(function (formations) {
                    // to do
                    d.resolve(playbook);
                }, function (err) {
                    d.reject(err);
                });
            }, function (err) {
                console.error(err);
                d.reject(err);
            });
            return d.promise;
        };
        this.createPlaybook = function (name, unitType) {
            var d = $q.defer();
            var playbookModel = new Playbook.Models.PlaybookModel();
            playbookModel.fromJson({
                key: -1,
                name: name,
                unitType: unitType
            });
            _playbook.createPlaybook({
                version: 1,
                name: playbookModel.name,
                data: {
                    version: 1,
                    model: playbookModel,
                    unitType: playbookModel.unitType
                }
            }).then(function (createdPlaybook) {
                impakt.context.Playbook.playbooks.add(createdPlaybook.guid, createdPlaybook);
                d.resolve(createdPlaybook);
            }, function (err) {
                console.error(err);
                d.reject(err);
            });
            return d.promise;
        };
        this.deletePlaybook = function (playbook) {
            var d = $q.defer();
            _playbook.deletePlaybook({
                key: playbook.key
            })
                .then(function (deletedPlaybook) {
                console.log('Playbook deleted: ', deletedPlaybook);
                self.playbookData.get(playbook.type).remove(playbook.key);
                d.resolve(playbook);
            }, function (err) {
                console.error(err);
                d.reject(err);
            });
            return d.promise;
        };
        this.getFormations = function (playbook) {
            var d = $q.defer();
            _playbook.getFormations(playbook).then(function (formationCollection) {
                self.playbookData.setFormationCollection(formationCollection);
                d.resolve(formationCollection);
            }, function (err) {
                d.reject(err);
            });
            return d.promise;
        };
        this.createFormation = function (name, playbookGuid, unitTypeGuid) {
            var d = $q.defer();
            _playbook.createFormation(name, playbookGuid, unitTypeGuid)
                .then(function (formation) {
                // open the formation in the editor
                self.editFormation(formation);
                d.resolve(formation);
            }, function (err) {
                console.error(err);
                d.reject(err);
            });
            return d.promise;
        };
        this.deleteFormation = function (formation) {
            var d = $q.defer();
            _playbook.deleteFormation(formation)
                .then(function (deletedFormation) {
                d.resolve(deletedFormation);
            }, function (err) {
                console.error(err);
                d.reject(err);
            });
            return d.promise;
        };
        this.editFormation = function (formation) {
            __localStorage.setDefaultEditorInfo(formation.parentRK, formation.editorType, formation.key, formation.unitType);
            var play = new Playbook.Models.Play();
            play.formation = formation;
            if ($state.is('playbook.editor')) {
                console.log('Editor is open');
                $rootScope.$broadcast('playbook-editor-tab.open', play);
            }
            else {
                $state.transitionTo('playbook.editor', {
                    data: play
                });
            }
        };
        this.getSets = function (playbook) {
            throw new Error('playbook.browser.srv getSets() not implemented');
        };
        this.createSet = function (set) {
            throw new Error('playbook.browser.srv createSet() not implemented');
        };
        this.toggleUnitType = function (unitType) {
            unitType.active = !unitType.active;
            if (unitType.active) {
                __localStorage.setDefaultPlaybookUnitType(unitType.unitType);
            }
            else {
                // reset the current playbook type
                __localStorage.resetDefaultPlaybookUnitType();
                // reset the current playbook key
                __localStorage.resetDefaultPlaybookKey();
            }
        };
        this.togglePlaybook = function (playbook) {
            playbook.active = !playbook.active;
            if (playbook.active) {
                __localStorage.setDefaultPlaybookKey(playbook.key);
            }
            else {
                __localStorage.resetDefaultPlaybookKey();
            }
        };
        this.ready = function (data) {
            this.readyCallback(data);
        };
        this.onready = function (callback) {
            this.readyCallback = callback;
        };
        this.readyCallback = function (data) {
            console.log('playbook browser ready...data: ', data);
        };
        this.collapseCallback = function () {
            console.log('playbook browser collapse (default)');
        };
        this.expandCallback = function () {
            console.log('playbook browser expand (default)');
        };
        this.toggleCallback = function (isCollapsed) {
            console.log('playbook browser toggle (default)', isCollapsed);
        };
        this.collapse = function () {
            this.collapseCallback();
        };
        this.oncollapse = function (callback) {
            this.collapseCallback = callback;
        };
        this.toggle = function () {
            this.isCollapsed = !this.isCollapsed;
            this.isCollapsed ? this.collapse() : this.expand();
            this.toggleCallback(this.isCollapsed);
        };
        this.ontoggle = function (callback) {
            this.toggleCallback = callback;
        };
        this.expand = function () {
            this.isCollapsed = false;
            this.expandCallback();
        };
        this.onexpand = function (callback) {
            this.expandCallback = callback;
        };
        $rootScope.$on('playbook-browser.toggle', function (e, data) {
        });
        $rootScope.$on('playbook-browser.collapse', function (e, data) {
            self.collapse();
        });
        this.init();
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
impakt.playbook.details = angular.module('impakt.playbook.details', [])
    .config(function () {
    console.debug('impakt.playbook.details - config');
})
    .run(function () {
    console.debug('impakt.playbook.details - run');
});
/// <reference path='./playbook-details.mdl.ts' />
impakt.playbook.details.controller('playbook.details.ctrl', ['$scope', '__modals', '_playbookDetails',
    function ($scope, __modals, _playbookDetails) {
        $scope.isCollapsed = true;
        _playbookDetails.ontoggle(function (isCollapsed) {
            $scope.isCollapsed = isCollapsed;
        });
        $scope.toggle = function () {
            _playbookDetails.toggle();
        };
        $scope.toggleUnitType = function (unitType) {
            console.log('toggle playbook type', unitType);
            _playbookDetails.toggleUnitType(unitType);
        };
        $scope.togglePlaybook = function (playbook) {
            console.log('toggle playbook key', playbook);
            _playbookDetails.togglePlaybook(playbook);
        };
    }]);
/// <reference path='./playbook-details.mdl.ts' />
impakt.playbook.browser.service('_playbookDetails', [
    '$rootScope',
    '$q',
    '$state',
    '__localStorage',
    '__parser',
    '_playbook',
    function ($rootScope, $q, $state, __localStorage, __parser, _playbook) {
        console.debug('service: impakt.playbook.browser');
        var self = this;
        // Set browser to expanded or collapsed by default
        this.isCollapsed = true;
        this.init = function () { };
        this.collapseCallback = function () {
            console.log('playbook details collapse (default)');
        };
        this.expandCallback = function () {
            console.log('playbook details expand (default)');
        };
        this.toggleCallback = function (isCollapsed) {
            console.log('playbook browser toggle (default)', isCollapsed);
        };
        this.collapse = function () {
            this.collapseCallback();
        };
        this.oncollapse = function (callback) {
            this.collapseCallback = callback;
        };
        this.toggle = function () {
            this.isCollapsed = !this.isCollapsed;
            this.isCollapsed ? this.collapse() : this.expand();
            this.toggleCallback(this.isCollapsed);
        };
        this.ontoggle = function (callback) {
            this.toggleCallback = callback;
        };
        this.expand = function () {
            this.isCollapsed = false;
            this.expandCallback();
        };
        this.onexpand = function (callback) {
            this.expandCallback = callback;
        };
        $rootScope.$on('playbook-details.toggle', function (e, data) {
        });
        $rootScope.$on('playbook-details.collapse', function (e, data) {
            self.collapse();
        });
        this.init();
    }]);
/// <reference path='../playbook.mdl.ts' />
impakt.playbook.editor = angular.module('impakt.playbook.editor', [
    'impakt.playbook.editor.tabs',
    'impakt.playbook.editor.tools',
    'impakt.playbook.editor.mode',
    'impakt.playbook.editor.canvas'
])
    .config(function () {
    console.debug('impakt.playbook.editor - config');
})
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
        _playbookEditorCanvas.onready(function () {
            console.log('playbook.editor.canvas.ctrl ready');
        });
        console.debug('controller: playbook.editor.canvas');
        $scope.applyFormation = function (formation) {
            console.log('apply formation to editor');
            _playbookEditorCanvas.applyFormation(formation);
        };
        $scope.applyPersonnel = function (personnel) {
            _playbookEditorCanvas.applyPersonnel(personnel);
        };
        $scope.applyPlay = function (play) {
            _playbookEditorCanvas.applyPlay(play);
        };
    }]);
///<reference path='./playbook-editor-canvas.mdl.ts' />
// TODO - needed?
impakt.playbook.editor.canvas.directive('playbookEditorCanvas', ['$rootScope',
    '$compile',
    '$templateCache',
    '$timeout',
    '__contextmenu',
    '_playbookEditorCanvas',
    '_scrollable',
    function ($rootScope, $compile, $templateCache, $timeout, __contextmenu, _playbookEditorCanvas, _scrollable) {
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
/// <reference path='../../models/field/Canvas.ts' />
/// <reference path='../../../../common/common.ts' />
/// <reference path='./playbook-editor-canvas.mdl.ts' />
impakt.playbook.editor.canvas.service('_playbookEditorCanvas', [
    '$rootScope',
    '$timeout',
    '_base',
    '_playbook',
    '_playbookEditor',
    function ($rootScope, $timeout, _base, _playbook, _playbookEditor) {
        console.debug('service: impakt.playbook.editor.canvas');
        var self = this;
        this.playbookData = _playbookEditor.playbookData;
        this.playbooks = impakt.context.Playbook.playbooks;
        this.personnelCollection = impakt.context.Playbook.personnel;
        this.plays = impakt.context.Playbook.assignments;
        this.readyCallback = function () { console.log('canvas ready'); };
        this.component = new Common.Base.Component('_playbookEditorCanvas', Common.Base.ComponentType.Service, []);
        function init() {
            _playbookEditor.component.loadDependency(self.component);
        }
        this.onready = function (callback) {
            this.readyCallback = callback;
        };
        this.ready = function () {
            this.readyCallback();
        };
        this.create = function (tab) {
            var canvas = new Playbook.Models.Canvas(tab.play);
            canvas.tab = tab;
            _playbookEditor.addCanvas(canvas);
        };
        this.initialize = function ($element, editorType, guid) {
            var canvas = _playbookEditor.canvases[guid];
            self.formations = impakt.context.Playbook.formations;
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
            this.ready();
            return canvas;
        };
        /**
         * Applies the given formation to the field
         * @param {Playbook.Models.Formation} formation The Formation to apply
         */
        this.applyFormation = function (formation) {
            var activeCanvas = _playbookEditor.activeCanvas;
            activeCanvas.field.applyFormation(formation);
        };
        /**
         * Applies the given personnel data to the field
         * @param {Playbook.Models.Personnel} personnel The Personnel to apply
         */
        this.applyPersonnel = function (personnel) {
            var activeCanvas = _playbookEditor.activeCanvas;
            activeCanvas.field.applyPersonnel(personnel);
        };
        /**
         * Applies the given play data to the field
         * @param {Playbook.Models.Play} play The Play to apply
         */
        this.applyPlay = function (play) {
            var activeCanvas = _playbookEditor.activeCanvas;
            activeCanvas.field.applyPlay(play);
        };
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
        this.activate = function (activateCanvas) {
            _playbookEditor.activateCanvas(activateCanvas);
        };
        this.scrollTo = function (x, y) {
            console.log(x, y);
            this.active.canvas.paper.scroll(x, y);
        };
        /*****
        *
        *
        *	RECEIVE EXTERNAL COMMANDS
        *
        *
        ******/
        $rootScope.$on('playbook-editor-canvas.zoomIn', function (e, data) {
            self.active.canvas.paper.zoomIn();
        });
        $rootScope.$on('playbook-editor-canvas.zoomOut', function (e, data) {
            self.active.canvas.paper.zoomOut();
        });
        // receives command from playbook.editor to create a new canvas
        $rootScope.$on('playbook-editor-canvas.create', function (e, tab) {
            console.log('creating canvas...');
            self.create(tab);
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
        $scope.activeCanvas = _playbookEditor.activeCanvas;
    }]);
/// <reference path='./playbook-editor.mdl.ts' />
impakt.playbook.editor.controller('playbook.editor.ctrl', [
    '$scope',
    '$stateParams',
    '_playbookEditor',
    '_playbookBrowser',
    function ($scope, $stateParams, _playbookEditor, _playbookBrowser) {
        _playbookEditor.initializeData = $stateParams.data;
        $scope.canvases = _playbookEditor.canvases;
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
    '__modals',
    '_base',
    '_playbook',
    '_playbookBrowser',
    function ($rootScope, __modals, _base, _playbook, _playbookBrowser) {
        console.debug('service: impakt.playbook.editor');
        var self = this;
        this.component = new Common.Base.Component('_playbookEditor', Common.Base.ComponentType.Service, [
            '_playbookEditorTools',
            '_playbookEditorTabs',
            '_playbookEditorCanvas'
        ]);
        this.tabs = new Playbook.Models.TabCollection();
        this.canvases = {};
        this.activeCanvas = null;
        this.editorMode = Playbook.Editor.EditorModes[Playbook.Editor.EditorModes.None];
        this.playbookData = _playbookBrowser.playbookData;
        this.initializeData = null;
        function init() {
            self.component.onready(function (c) {
                console.debug('service: impakt.playbook.editor - load complete');
                if (self.initializeData) {
                    // load data into a new tab
                    $rootScope.$broadcast('playbook-editor-tab.open', self.initializeData);
                }
                else {
                }
            });
            _base.loadComponent(self.component);
        }
        this.addTab = function (play) {
            var existingTab = this.tabs.getByPlayGuid(play.guid);
            // ignore if it is already open
            if (existingTab) {
                this.activateTab(existingTab, true);
                return;
            }
            var tab = new Playbook.Models.Tab(play);
            this.tabs.add(tab.guid, tab);
            // activate this tab (will activate the canvas as well)
            this.activateTab(tab, false);
            // create a new canvas in the editor
            $rootScope.$broadcast('playbook-editor-canvas.create', tab);
        };
        this.activateTab = function (tab, activateCanvas) {
            this.inactivateOtherTabs(tab);
            this.tabs.get(tab.guid).active = true;
            if (activateCanvas) {
                var canvas = this.canvases[tab.guid];
                this.activateCanvas(canvas);
            }
        };
        this.closeTab = function (tab) {
            this.tabs.remove(tab.guid);
            var canvas = this.canvases[tab.guid];
            if (canvas.active) {
                this.activeCanvas = null;
            }
            delete this.canvases[tab.guid];
        };
        this.inactivateOtherTabs = function (tab) {
            this.tabs.forEach(function (currentTab, index) {
                if (currentTab.guid != tab.guid)
                    currentTab.active = false;
            });
        };
        this.addCanvas = function (canvas) {
            this.canvases[canvas.tab.guid] = canvas;
            this.activateCanvas(canvas);
        };
        this.activateCanvas = function (canvas) {
            this.inactivateOtherCanvases(canvas);
            this.canvases[canvas.tab.guid].active = true;
            this.activeCanvas = canvas;
        };
        this.getActiveCanvas = function () {
            return this.activeCanvas;
        };
        this.inactivateOtherCanvases = function (canvas) {
            for (var tabGuid in this.canvases) {
                var someCanvas = this.canvases[tabGuid];
                if (someCanvas.tab.guid != canvas.tab.guid)
                    someCanvas.active = false;
            }
        };
        // this.createCanvas = function(tab: Playbook.Editor.Tab) {
        // 	console.info('create canvas: ', tab.guid);
        // 	$rootScope.$broadcast('playbook-editor-canvas.create', { tab: tab });
        // }
        // this.closeCanvas = function(tab: Playbook.Editor.Tab) {
        // 	console.info('close tab: ', tab.guid);
        // 	$rootScope.$broadcast('playbook-editor-canvas.close', { tab: tab });
        // }
        $rootScope.$on('playbook.deleteFormation', function (e, formationKey) {
            throw new Error('remove tab on delete of formation not implemented');
        });
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
            var activeCanvas = this.getActiveCanvas();
            console.log(activeCanvas);
            if (activeCanvas) {
                var data = activeCanvas.play;
                var modalInstance = __modals.open('', 'modules/playbook/modals/save-play/save-play.tpl.html', 'playbook.modals.savePlay.ctrl', {
                    personnel: function () {
                        return data.personnel;
                    },
                    assignmentCollection: function () {
                        return data.assignments;
                    },
                    formation: function () {
                        return data.formation;
                    }
                });
                modalInstance.result.then(function (createdPlay) {
                    console.log(createdPlay);
                }, function (results) {
                    console.log('dismissed');
                });
            }
        };
        this.zoomIn = function () {
            $rootScope.$broadcast('playbook-editor-canvas.zoomIn');
        };
        this.zoomOut = function () {
            $rootScope.$broadcast('playbook-editor-canvas.zoomOut');
        };
        this.setCursor = function (cursor) {
            if (this.activeCanvas && this.activeCanvas.$container) {
                this.activeCanvas.$container.css({ 'cursor': cursor });
            }
        };
        this.setEditorMode = function (editorMode) {
            console.log('Change editor mode: ', editorMode, Playbook.Editor.EditorModes[editorMode]);
            if (this.activeCanvas) {
                this.activeCanvas.editorMode = editorMode;
                this.editorMode = Playbook.Editor.EditorModes[editorMode];
            }
        };
        init();
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
/// <reference path='../../models/field/Canvas.ts' />
/// <reference path='../../../../common/common.ts' />
/// <reference path='../../playbook.ts' />
impakt.playbook.editor.tabs.controller('playbook.editor.tabs.ctrl', [
    '$scope',
    '$stateParams',
    '__modals',
    '_base',
    '_playbookEditorTabs',
    function ($scope, $stateParams, __modals, _base, _playbookEditorTabs) {
        $scope.play = $stateParams.data;
        console.debug('controller: playbook.editor.tabs', $stateParams.data);
        this.component = new Common.Base.Component('playbook.editor.tabs.ctrl', Common.Base.ComponentType.Controller);
        function init(self) {
            _playbookEditorTabs.component.loadDependency(self.component);
        }
        // this creates a reference to the tabs within the service;
        // when it changes, $scope is automatically updated
        $scope.tabs = _playbookEditorTabs.getTabs();
        // open new tab by default
        //_playbookEditorTabs.new(0, true);
        $scope.new = function () {
            console.log('new editor');
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
            //_playbookEditorTabs.new(0, true);
        };
        $scope.close = function (tab) {
            _playbookEditorTabs.close(tab);
        };
        $scope.activate = function (tab) {
            _playbookEditorTabs.activate(tab, true);
        };
        init(this);
    }]);
/// <reference path='../../playbook.ts' />
/// <reference path='./playbook-editor-tabs.mdl.ts' />
impakt.playbook.editor.tabs.service('_playbookEditorTabs', ['$rootScope', '_base', '_playbookEditor',
    function ($rootScope, _base, _playbookEditor) {
        console.debug('service: impakt.playbook.editor.tabs');
        var self = this;
        this.component = new Common.Base.Component('_playbookEditorTabs', Common.Base.ComponentType.Service, [
            'playbook.editor.tabs.ctrl'
        ]);
        function init() {
            _playbookEditor.component.loadDependency(self.component);
        }
        this.open = function (play) {
            console.log('open tab with data: ', play);
            _playbookEditor.addTab(play);
        };
        $rootScope.$on('playbook-editor-tab.open', function (e, play) {
            self.open(play);
        });
        this.newFormation = function (formationName) {
            console.log('new formation', formationName);
        };
        this.new = function () {
            console.log('creating new tab...');
            // Step 2: build a generic model from that response
            this.open(null);
        };
        $rootScope.$on('playbook-editor-tab.new', function (e, data) {
            self.new();
        });
        this.close = function (tab) {
            // remove the tab from the array			
            _playbookEditor.closeTab(tab);
        };
        this.activate = function (tab, activateCanvas) {
            _playbookEditor.activateTab(tab, true);
        };
        this.getTabs = function () {
            return _playbookEditor.tabs;
        };
        this.getCanvases = function () {
            return _playbookEditor.canvases;
        };
        init();
    }]);
var Playbook;
(function (Playbook) {
    var Editor;
    (function (Editor) {
        var Tool = (function () {
            function Tool(title, action, glyphiconIcon, tooltip, cursor, editorMode, selected) {
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
                this.editorMode = editorMode || Playbook.Editor.EditorModes.Select;
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
            new Playbook.Editor.Tool('Select', Playbook.Editor.ToolActions.Select, 'hand-up', 'Select', Playbook.Editor.CursorTypes.pointer, Playbook.Editor.EditorModes.Select, true),
            new Playbook.Editor.Tool('Add player', Playbook.Editor.ToolActions.AddPlayer, 'user'),
            new Playbook.Editor.Tool('Save', Playbook.Editor.ToolActions.Save, 'floppy-save'),
            new Playbook.Editor.Tool('Zoom in', Playbook.Editor.ToolActions.ZoomIn, 'zoom-in'),
            new Playbook.Editor.Tool('Zoom out', Playbook.Editor.ToolActions.ZoomOut, 'zoom-out'),
            new Playbook.Editor.Tool('Assignment', Playbook.Editor.ToolActions.Assignment, 'screenshot', '', Playbook.Editor.CursorTypes.crosshair, Playbook.Editor.EditorModes.Assignment)
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
            this.setEditorMode(tool.editorMode);
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
        this.setEditorMode = function (mode) {
            _playbookEditor.setEditorMode(mode);
        };
        init(this);
    }]);
/// <reference path='../playbook.mdl.ts' />
impakt.playbook.layout = angular.module('impakt.playbook.layout', [])
    .config(function () {
    console.debug('impakt.playbook.layout - config');
})
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
    '_playbookBrowser',
    'playbook',
    'unitType',
    function ($scope, $uibModalInstance, _playbookBrowser, playbook, unitType) {
        $scope.formation = new Playbook.Models.Formation();
        $scope.unitType = unitType;
        $scope.playbook = playbook;
        $scope.ok = function () {
            $scope.formation.associated.playbooks.push($scope.playbook.guid);
            $scope.formation.associated.unitTypes.push($scope.unitType.guid);
            $scope.formation.unitType = $scope.unitType.unitType;
            $scope.formation.parentRK = $scope.playbook.key;
            console.log($scope.formation.toJson());
            _playbookBrowser.createFormation($scope.formation)
                .then(function (createdFormation) {
                $uibModalInstance.close(createdFormation);
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
impakt.playbook.modals.controller('playbook.modals.createPersonnelSet.ctrl', [
    '$scope',
    '$uibModalInstance',
    '__parser',
    '_playbookBrowser',
    function ($scope, $uibModalInstance, __parser, _playbookBrowser) {
    }]);
/// <reference path='../playbook-modals.mdl.ts' />
impakt.playbook.modals.controller('playbook.modals.createPlaybook.ctrl', [
    '$scope', '$uibModalInstance', '_playbookBrowser',
    function ($scope, $uibModalInstance, _playbookBrowser) {
        $scope.playbookName = '';
        $scope.unitType = Playbook.Editor.UnitTypes.Other;
        $scope.unitTypes = impakt.context.Playbook.unitTypes;
        $scope.selectedUnitType = $scope.unitTypes.getByUnitType($scope.unitType);
        $scope.selectUnitType = function (unitTypeValue) {
            $scope.selectedUnitType = $scope.unitTypes.getByUnitType(unitTypeValue);
        };
        $scope.ok = function () {
            _playbookBrowser.createPlaybook($scope.playbookName, $scope.unitType)
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
    '_playbookBrowser',
    'formation',
    function ($scope, $uibModalInstance, _playbookBrowser, formation) {
        $scope.formation = formation;
        $scope.ok = function () {
            _playbookBrowser.deleteFormation($scope.formation)
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
    '$scope', '$uibModalInstance', '_playbookBrowser', 'playbook',
    function ($scope, $uibModalInstance, _playbookBrowser, playbook) {
        $scope.playbook = playbook;
        $scope.ok = function () {
            _playbookBrowser.deletePlaybook($scope.playbook)
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
    '_playbookBrowser',
    '_playbookEditorTabs',
    'data',
    function ($scope, $uibModalInstance, _playbookBrowser, _playbookEditorTabs, data) {
        $scope.playbooks = impakt.context.Playbook.playbooks;
        $scope.unitTypes = impakt.context.Playbook.unitTypes;
        $scope.formationName = '';
        console.log($scope.playbooks);
        $scope.ok = function () {
            _playbookEditorTabs.newFormation($scope.formationName)
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
impakt.playbook.modals.controller('playbook.modals.savePlay.ctrl', [
    '$scope',
    '$uibModalInstance',
    '_playbook',
    'formation',
    'personnel',
    'assignmentCollection',
    function ($scope, $uibModalInstance, _playbook, formation, personnel, assignmentCollection) {
        $scope.playName = '';
        $scope.formation = formation;
        $scope.personnel = personnel;
        $scope.assignmentCollection = assignmentCollection;
        $scope.assignments = assignmentCollection.toJsonArray();
        console.log('play assignments: ', $scope.assignments);
        $scope.ok = function () {
            var play = new Playbook.Models.Play();
            play.name = $scope.playName;
            play.formation = $scope.formation;
            play.personnel = $scope.personnel;
            play.assignments = $scope.assignmentCollection;
            console.log($scope.playName, $scope.assignments);
            // _playbook.updateFormation(data)
            // .then(function(response) {
            // 	console.log(response);
            // }, function(err) {
            // 	console.error(err);
            // });
            // _playbook.createPlay(play).then(function(data) {
            // 	console.log(data);
            // }, function(error) {
            // 	console.error(error);
            // });
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
        var PlaybookData = (function (_super) {
            __extends(PlaybookData, _super);
            function PlaybookData() {
                _super.call(this, this);
                this.types = new Playbook.Models.UnitTypeCollection();
                this.isPrivate = true;
                this._hasTypes = true;
            }
            PlaybookData.prototype.toJson = function () {
                return {
                    isPrivate: this.isPrivate,
                    types: this.types.toJson()
                };
            };
            PlaybookData.prototype.fromJson = function (json) {
                if (!json)
                    return;
            };
            return PlaybookData;
        })(Common.Models.Modifiable);
        Models.PlaybookData = PlaybookData;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var RoutePath = (function (_super) {
            __extends(RoutePath, _super);
            function RoutePath(context, startNode, endNode) {
                _super.call(this, context);
                this.startNode = startNode;
                this.endNode = endNode;
                this.title = 'route';
                this.width = RoutePath.ROUTE_WIDTH;
            }
            RoutePath.prototype.draw = function () {
                // console.log(
                // 	'draw route from: ',
                // 	this.startNode.x,
                // 	this.startNode.y,
                // 	this.endNode.x,
                // 	this.endNode.y
                // );
                var pathString = this.paper.buildPath(new Playbook.Models.Coordinate(this.startNode.x, this.startNode.y), new Playbook.Models.Coordinate(this.endNode.x, this.endNode.y), this.width);
                this.path = new Playbook.Models.FieldElement(this);
                this.path.raphael = this.paper.path(pathString).attr({
                    'fill': 'red',
                    'title': this.title
                });
                return this.path;
            };
            RoutePath.prototype.click = function (e, self) {
                console.log('route path clicked');
            };
            RoutePath.prototype.hoverIn = function (e, self) { };
            RoutePath.prototype.hoverOut = function (e, self) { };
            RoutePath.prototype.mousedown = function (e, self) { };
            RoutePath.prototype.dragMove = function (dx, dy, posx, posy, e) { };
            RoutePath.prototype.dragStart = function (x, y, e) { };
            RoutePath.prototype.dragEnd = function (e) { };
            RoutePath.prototype.getSaveData = function () { };
            RoutePath.prototype.getBBoxCoordinates = function () { };
            RoutePath.prototype.remove = function () {
                console.log('not implemented');
                //this.path.remove();
            };
            RoutePath.ROUTE_WIDTH = 5;
            return RoutePath;
        })(Models.FieldElement);
        Models.RoutePath = RoutePath;
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
    GET_PLAY: '/getPlay',
    GET_PLAYS: '/getPlays'
});
/// <reference path='./playbook.mdl.ts' />
impakt.playbook.controller('playbook.ctrl', ['$scope', '$state', '$stateParams', '_playbook',
    function ($scope, $state, $stateParams, _playbook) {
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
    function (PLAYBOOK, $rootScope, $q, $state, __api, __localStorage) {
        var self = this;
        this.playbooks = [];
        this.browser = {
            open: function (id) {
            },
            drilldown: function (key) {
            },
            collapse: function () {
                console.info('collapse playbook browser');
                $rootScope.$broadcast('playbook-browser.collapse', {});
            },
            toggle: function () {
                console.log('toggle playbook browser');
                $rootScope.$broadcast('playbook-browser.toggle', {});
            }
        };
        this.editor = {
            openCallback: function (id, parentId) { },
            onOpen: function (callback) {
                self.editor.openCallback = callback;
            },
            open: function (id, parentId) {
            }
        };
        // retrieves all playbook data
        // TODO: implement *for the given user*
        this.getPlaybooks = function () {
            var d = $q.defer();
            __api.get(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.GET_PLAYBOOKS))
                .then(function (response) {
                var playbooks = Common.Utilities.parseData(response.data.results);
                var collection = new Playbook.Models.PlaybookModelCollection();
                collection.fromJson(playbooks);
                d.resolve(collection);
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        };
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
        this.createPlaybook = function (data) {
            var d = $q.defer();
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.CREATE_PLAYBOOK), data)
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var playbook = new Playbook.Models.PlaybookModel();
                if (results && results.data && results.data.model) {
                    playbook.fromJson(results.data.model);
                }
                else {
                    throw new Error('CreatePlaybook did not return a valid playbook model');
                }
                d.resolve(playbook);
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        };
        this.deletePlaybook = function (data) {
            var d = $q.defer();
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.DELETE_PLAYBOOK), data)
                .then(function (response) {
                var playbook = Common.Utilities.parseData(response.data.results);
                d.resolve(playbook);
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        };
        this.createFormation = function (newFormation) {
            var d = $q.defer();
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
                impakt.context.Playbook.formations.add(formationModel.guid, formationModel);
                d.resolve(formationModel);
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        };
        this.deleteFormation = function (formation) {
            var d = $q.defer();
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.DELETE_FORMATION), {
                key: formation.key
            })
                .then(function (response) {
                var formationKey = response.data.results.key;
                $rootScope.$broadcast('playbook.deleteFormation', formationKey);
                impakt.context.Playbook.formations.remove(formation.guid);
                d.resolve(formationKey);
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        };
        this.getFormations = function (playbook) {
            var d = $q.defer();
            __api.get(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.GET_FORMATIONS, '?$filter=ParentRK eq ' + playbook.key))
                .then(function (response) {
                var formations = Common.Utilities.parseData(response.data.results);
                var collection = new Playbook.Models.FormationCollection();
                collection.fromJson(formations);
                d.resolve(collection);
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        };
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
        this.updateFormation = function (formation) {
            var d = $q.defer();
            // update assignment collection to json object
            var formationData = formation.toJson();
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
                var formations = Common.Utilities.parseData(response.data.results);
                d.resolve(formations);
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        };
        this.getSets = function (playbook) {
            throw new Error('playbook.srv getSets() Not implemented');
        };
        this.createSet = function (set) {
            var d = $q.defer();
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
                d.resolve(null);
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        };
        this.createPlay = function (play) {
            var d = $q.defer();
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
                    play: play
                }
            })
                .then(function (response) {
                d.resolve(response);
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        };
        this.getPlays = function () {
            var d = $q.defer();
            __api.get(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.GET_PLAYS))
                .then(function (response) {
                var data = Common.Utilities.parseData(response.data.results);
                console.log(data);
                d.resolve(data);
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        };
    }]);
// declare var impakt: any;
// impakt.search.controller('searchController', 
// ['$scope', '$log', '$location', function($scope: any, $log: any, $location: any) {
// 	// $scope.navItems = [
// 	// 	{
// 	// 		label: 'Browser',
// 	// 		view: 'browser', // case sensitive
// 	// 		isActive: true,
// 	// 		href: '#/playbook?view=browser'
// 	// 	},
// 	// 	{
// 	// 		label: 'Editor',
// 	// 		view: 'editor', // case sensitive
// 	// 		isActive: false,
// 	// 		href: '#/playbook?view=editor'
// 	// 	},
// 	// 	{
// 	// 		label: 'Plan',
// 	// 		view: 'plan', // case sensitive
// 	// 		isActive: false,
// 	// 		href: '#/playbook?view=plan'
// 	// 	},
// 	// 	// {
// 	// 	// 	label: 'Layout',
// 	// 	// 	isActive: false,
// 	// 	// 	href: '#'
// 	// 	// }
// 	// ]
// 	// $scope.navClick = function(nav: any) {
// 	// 	console.log(nav.view);
// 	// 	$location.search({view: nav.view});
// 	// }
// }]); 
/// <reference path='../modules.mdl.ts' />
impakt.search = angular.module('impakt.search', []);
/// <reference path='../playbook/playbook.ts' />
/// <reference path='../modules.mdl.ts' />
/// <reference path='./team.ts' />
impakt.team = angular.module('impakt.team', [
    'impakt.team.personnel'
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
            unitType: $scope.personnel.unitType
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
                $scope.selectedPersonnel.unitType = $scope.personnel.unitType;
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
            $scope.personnel.positions.replace(position.guid, updated.guid, updated);
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
// TODO 
/// <reference path='./team.mdl.ts' />
impakt.team.controller('team.ctrl', ['$scope', '_team',
    function ($scope, _team) {
        $scope.title = 'Team Management';
    }]);
/// <reference path='./team.mdl.ts' />
// Team service
impakt.team.service('_team', ['$q', 'PLAYBOOK', '__api', function ($q, PLAYBOOK, __api) {
        this.personnel = impakt.context.Playbook.personnel;
        this.savePersonnel = function (personnelModel, createNew) {
            var d = $q.defer();
            var result;
            if (createNew) {
                personnelModel.key = 0;
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
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.CREATE_SET), {
                version: 1,
                ownerRK: 1,
                parentRK: 1,
                name: personnelJson.name,
                data: {
                    setType: Playbook.Editor.PlaybookSetTypes.Personnel,
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
                    personnelModel.fromJson(results.data.personnel);
                }
                impakt.context.Playbook.personnel.add(personnelModel.guid, personnelModel);
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
                    setType: Playbook.Editor.PlaybookSetTypes.Personnel,
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
        this.deletePersonnel = function (personnelModel) {
            var d = $q.defer();
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.DELETE_SET), { key: personnelModel.key }).then(function (response) {
                d.resolve(response);
            }, function (err) {
                d.reject(err);
            });
            return d.promise;
        };
    }]);
/// <reference path='../modules.mdl.ts' />
impakt.user = angular.module('impakt.user', [
    'impakt.user.login'
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
/// <reference path='./user.mdl.ts' />
impakt.user.controller('impakt.user.ctrl', [
    '$scope',
    '$http',
    '$window',
    '__signin',
    function ($scope, $http, $window, __signin) {
        console.log('user controller');
        $scope.profileClick = function () {
            // TODO
        };
        $scope.logout = function () {
            __signin.logout();
        };
    }]);
//# sourceMappingURL=impakt.js.map