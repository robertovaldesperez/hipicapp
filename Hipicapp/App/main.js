﻿requirejs.config({
    paths: {
        'text': '../Scripts/text',
        'i18next': '../Scripts/i18next.min',
        'durandal': '../Scripts/durandal',
        'plugins': '../Scripts/durandal/plugins',
        'transitions': '../Scripts/durandal/transitions'
    },
    i18next: {
        ns: "app",
        fallbackLng: "es",
        detectLngQS: "locale",
        lowerCaseLng: true,
        useCookie: false,
        resGetPath: "__lng__/__ns__.json",
        supportedLngs: {
            es: [
                "app"
            ]
        }
    }
});

define('jquery', function () { return jQuery; });
define('knockout', ko);

define(["bindings/compareBinding", "bindings/datetimepickerValueBinding", "bindings/epochAfterBinding", "bindings/epochFutureBinding", "bindings/epochValueBinding", "bindings/fileuploadBinding", "bindings/imageHolderBinding", "bindings/popoverBinding",
  "core/authentication/authenticationBroker", "core/authentication/securityContext", "durandal/system", "durandal/app",
  "durandal/viewLocator", "durandal/binder", "i18next", "core/router"]
    , function (compareBinding, datetimepickerValueBinding, epochAfterBinding, epochFutureBinding, epochValueBinding,
        fileuploadBinding, imageHolderBinding, popoverBinding, authenticationBroker, securityContext, system, app, viewLocator,
        binder, i18n, router) {
        //>>excludeStart("build", true);
        system.debug(true);
        //>>excludeEnd("build");

        var i18NOptions = {
            detectFromHeaders: false,
            //lng: window.navigator.userLanguage || window.navigator.language || 'es-ES',
            lng: 'es-ES',
            fallbackLang: 'es',
            ns: 'app',
            resGetPath: 'App_Administrator/nls/__lng__/__ns__.json',
            useCookie: false
        };

        // setup knockout
        // custom binding handlers
        ko.bindingHandlers.compare = compareBinding;
        ko.bindingHandlers.datetimepickerValue = datetimepickerValueBinding;
        ko.bindingHandlers.epochAfter = epochAfterBinding;
        ko.bindingHandlers.epochFuture = epochFutureBinding;
        ko.bindingHandlers.epochValue = epochValueBinding;
        ko.bindingHandlers.fileupload = fileuploadBinding;
        ko.bindingHandlers.imageHolder = imageHolderBinding;
        ko.bindingHandlers.popover = popoverBinding;

        app.title = 'Hipicapp';

        app.configurePlugins({
            router: true,
            dialog: true
        });

        app.start().then(function () {
            i18n.init(i18NOptions, function () {
                //app.title = i18n.t('app:title');

                //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
                //Look for partial views in a 'views' folder in the root.
                viewLocator.useConvention();

                //Call localization on view before binding...
                binder.binding = function (obj, view) {
                    //$(view).i18n();
                };

                //Show the app by setting the root view model for our application with a transition.
                //app.adaptToDevice();

                // shell
                authenticationBroker.setup();
                if (securityContext.isAuthenticated()) {
                    app.setRoot("viewmodels/shell", "entrance");
                } else {
                    app.setRoot("viewmodels/login", "entrance");
                }
            });
        });
    });