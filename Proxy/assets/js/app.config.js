'use strict';

require.config({
    //Defines the loading time for modules. Depending on the complexity of the
    //dependencies and the size of the involved libraries, increasing the wait
    //interval may be required. Default is 7 seconds. Setting the value to 0
    //disables the waiting interval.
    waitSeconds: 7,

    //There is a common need to pass configuration info to a module. That configuration
    //info is usually known as part of the application, and there needs to be a way to pass that down
    //to a module. In RequireJS, that is done with the config option for requirejs.config().
    //Modules can then read that info by asking for the special dependency "module" and
    //calling module.config().
    config: {
    },

    //Configure CommonJS packages. See http://requirejs.org/docs/api.html#packages
    //for more information.
    packages: [

        'core',

    ],

    //Set paths for modules. If relative paths, set relative to baseUrl above.
    //If a special value of "empty:" is used for the path value, then that
    //acts like mapping the path to an empty file. It allows the optimizer to
    //resolve the dependency to path, but then does not include it in the output.
    //Useful to map module names that are to resources on a CDN or other
    //http: URL when running in the browser and during an optimization that
    //file should be skipped because it has no dependencies.
    paths: {
        'angular': 'bower_components/angular/angular.min',

        'angularRoute': 'bower_components/angular-route/angular-route',

        'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap.min',

        'jquery': 'bower_components/jquery/dist/jquery.min',

        'moment': 'bower_components/moment/min/moment.min',

        'webshims': 'bower_components/webshim/js-webshim/minified/polyfiller',

        'modernizr': 'bower_components/modernizr/modernizr',

        'lodash': 'bower_components/lodash/dist/lodash.compat.min',
        
        'theme': 'lib/theme',

        'style-switcher': 'lib/style-switcher',

        'socketio': 'lib/socket.io',

        'webrtcAdapter': 'lib/adapter'
    },

    //List the modules that will be optimized. All their immediate and deep
    //dependencies will be included in the module's file when the build is
    //done. If that module or any of its dependencies includes i18n bundles,
    //only the root bundles will be included unless the locale: section is set above.
    modules: [
        {
            name: 'main'
        }
    ],

    //Full docs on shim: http://requirejs.org/docs/api.html#config-shim
    //
    //If shim config is used in the app during runtime, duplicate the config
    //here. Necessary if shim config is used, so that the shim's dependencies
    //are included in the build. Using "mainConfigFile" is a better way to
    //pass this information though, so that it is only listed in one place.
    //However, if mainConfigFile is not an option, the shim config can be
    //inlined in the build config.
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angularRoute': {
            deps: ['angular']
        },
        'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        'jquery': {
            init: function () {
                window.$ = jQuery;
            }
        },
        'webshims': {
            deps: ['jquery', 'modernizr'],
            init: function () {
                $.webshims.setOptions({
                    basePath: '/bower_components/webshim/js-webshim/minified/shims/',
                    waitReady: false
                });
            }
        },
        'socketio': {
            exports: 'io'
        },
        'moment': {
            exports: 'moment'
        },
        'style-switcher': {
            deps: ['jquery']
        },
        'theme': {
            deps: ['jquery'],
            exports: 'theme'
        },
        'main': {
            deps: [
                'angular',
                'bootstrap',
                'webshims',
                'webrtcAdapter',
                'theme'
            ]
        }
    }
});
