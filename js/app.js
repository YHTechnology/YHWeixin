/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize"
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/
/**
`$controller` will no longer look for controllers on `window`.
The old behavior of looking on `window` for controllers was originally intended
for use in examples, demos, and toy apps. We found that allowing global controller
functions encouraged poor practices, so we resolved to disable this behavior by
default.

To migrate, register your controllers with modules rather than exposing them
as globals:

Before:

```javascript
function MyController() {
  // ...
}
```

After:

```javascript
angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

Although it's not recommended, you can re-enable the old behavior like this:

```javascript
angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
**/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function ($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function () {
        Metronic.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController',
    ['$scope',
     '$window',
     '$location',
     function ($scope, $window, $location) {
         //if ($window.sessionStorage.isLogin == undefined
         //   || $window.sessionStorage.isLogin == null
         //   || $window.sessionStorage.isLogin == false) {
         //    var mainUrl = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/login.html";
         //    window.location.replace(mainUrl);
         //}

         $scope.userCName = $window.sessionStorage.userCName;
         $scope.userGroup = $window.sessionStorage.userGroup;
         $scope.userDepartment = $window.sessionStorage.userDepartment;



         $scope.$on('$includeContentLoaded', function () {
             Layout.initHeader(); // init header
         });
     }]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        setTimeout(function () {
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/dashboard.html");

    $stateProvider
        // Dashboard
        .state('dashboard', {
            url: "/dashboard.html",
            //templateUrl: "QSViews/dashboard.html",
            data: { pageTitle: '系统总览' },
            //controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                        //    'js/controllers/DashboardController.js'
                        ]
                    });
                }]
            }
        })

        .state('clientrequire', {
            url: '/clientrequrie.html',
            templateUrl: 'QSViews/clientrequrie.html',
            data: { pageTitle: '客户需求' },
            controller: 'ClientRequireController',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/controllers/ClientRequireController.js'
                        ]
                    });
                }]
            }
        })

        // Technical Design
        .state('technicaldesign', {
            url: '/technicaldesign.html',
            templateUrl: 'QSViews/technicaldesign.html',
            data: { pageTitle: '技术设计' },
            controller: 'TechnicalDesignController',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/controllers/TechnicalDesignController.js'
                        ]
                    });
                }]
            }
        })

        // busnessquote
        .state('bussnessquote', {
            url: '/bussnessquote.html',
            templateUrl: 'QSViews/bussnessquote.html',
            data: { pageTitle: '商务合同' },
            controller: 'BussnessQuoteController',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/controllers/BussnessQuoteController.js'
                        ]
                    });
                }]
            }
        })

        // meteriel
        .state('materielmanager', {
            url: '/materielmanager.aspx',
            templateUrl: "QSViews/materielmanager.aspx",
            data: { pageTitle: "物料数据维护" },
            controller: 'BussnessQuoteController',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/controllers/BussnessQuoteController.js'
                        ]
                    });
                }]
            }
        })

        // component
        .state('componentmanager', {
            url: '/componentmanager.html',
            templateUrl: "QSViews/componentmanager.html",
            data: { pageTitle: "部件数据维护" },
            controller: 'BussnessQuoteController',
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/controllers/BussnessQuoteController.js'
                        ]
                    });
                }]
            }
        })

        // User Profile Dashboard
        .state("profile.dashboard", {
            url: "/dashboard",
            templateUrl: "views/profile/dashboard.html",
            data: { pageTitle: 'User Profile' }
        })

        // User Profile Account
        .state("profile.account", {
            url: "/account",
            templateUrl: "views/profile/account.html",
            data: { pageTitle: 'User Account' }
        })

        // User Profile Help
        .state("profile.help", {
            url: "/help",
            templateUrl: "views/profile/help.html",
            data: { pageTitle: 'User Help' }
        })

        // Todo
        .state('todo', {
            url: "/todo",
            templateUrl: "views/todo.html",
            data: { pageTitle: 'Todo' },
            controller: "TodoController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',
                            '../../../assets/global/plugins/select2/select2.css',
                            '../../../assets/admin/pages/css/todo.css',

                            '../../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '../../../assets/global/plugins/select2/select2.min.js',

                            '../../../assets/admin/pages/scripts/todo.js',

                            'js/controllers/TodoController.js'
                        ]
                    });
                }]
            }
        })

}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function ($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
}]);