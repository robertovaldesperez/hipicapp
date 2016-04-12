/* global $: false, amplify: false, define: false, ko: false */
define(["core/authentication/securityContext", "core/i18n", "core/util/csrfUtils",
    "core/exceptionHandler", "plugins/router", "viewmodels/alerts"
], function brokerUtils(securityContext, i18n, csrfUtils, exceptionHandler, router, alerts) {
    "use strict";

    var utils = {}, HASH_CHAR = "#", requestMappings = {
        BACKEND: "api",
        AUTHENTICATION: "authentication",
        ID: "{id}",
        USERS: "users",
        USER: "user",
        JUDGES: "judges",
        JUDGE: "judge",
        ATHLETES: "athletes",
        ATHLETE: "athlete",
        HORSES: "horses",
        HORSE: "horse",
        COMPETITIONS: "competitions",
        COMPETITION: "competition",
        COMPETITION_CATEGORIES: "competitionCategories",
        COMPETITION_CATEGORY: "competitionCategory",
        CATEGORIES: "categories",
        CATEGORY: "category",
        HANDLERS: "Handlers/AjaxFileUploaderHandler.upload",
        URL_TITLE: "{urlTitle}",
        TOKEN: "token",
        SETUP: "setup",
        GET: "get",
        LOGIN: "login",
        LOGOUT: "logout",
        UPLOAD: "upload",
        FIND: "find",
        FIND_ALL: "findAll",
        FILES: "files",
        FILE: "file",
        DOWNLOAD: "download",
        IMAGES: "images",
        SIGN_IN: "signIn",
        RESET_PASSWORD: "resetPassword",
        CHECK_TICKET: "checkTicket",
        UPDATE_PASSWORD: "updatePassword",
        ENABLE: "enable",
        DISABLE: "disable",
        SAVE: "save",
        UPDATE: "update"
    }, REQUEST_TYPE = "ajax", verb = {
        HEAD: "HEAD",
        GET: "GET",
        POST: "POST",
        PUT: "PUT",
        DELETE: "DELETE"
    }, CONTENT_TYPE = "application/json; charset=utf-8", DATA_TYPE = "json", DEFAULT_CACHE_TIMEOUT =
        300000, EXCEPTION_HANDLER_DECODER = "exceptionHandler", requestCount = ko.observable(0);

    /*ko.mapping.defaultOptions().ignore = [
        "getIconTitle", "getIconClass"
    ];*/

    amplify.subscribe("request.before.ajax", function incrementRequestCount() {
        requestCount(requestCount() + 1);
    });

    function doBefore(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + securityContext.getAuthenticationToken());

        return csrfUtils.appendXsrfToXhr(xhr) && csrfUtils.appendCsrfToXhr(xhr);
    }

    function beforeWrite(xhr) {
        xhr.readonly = false;

        return doBefore(xhr);
    }

    function beforeRead(xhr) {
        xhr.readonly = true;

        return doBefore(xhr);
    }

    function beforeLogin(xhr) {
        xhr.login = true;

        return doBefore(xhr);
    }

    function dataMap(data) {
        return _.isEmpty(data) ? undefined : ko.toJSON(data);
    }

    function entityDataMap(data) {
        return ko.toJSON({ d: data });
    }
    /* jshint camelcase: false */
    amplify.request_original.decoders.exceptionHandler =
        function handler(data, status, xhr, success, error) {
            requestCount(requestCount() - 1);

            csrfUtils.extractCsrfFromXhr(xhr);

            if (status === "success") {
                handleOk(data, status, xhr, success);
            } else if (xhr.status === 401) {
                handleUnauthorized(xhr);
            } else if (xhr.status === 500) {
                handleInternalServerError(data, status, error);
            } else if (status !== "nocontent") {
                $("html").html(xhr.responseText);
            }
        };

    function handleOk(data, status, xhr, success) {
        success(data, status);
        if (!(xhr.readonly)) {
            //alerts.success(i18n.SUCCESS_ALERT_TEXT);
        }
    }

    function handleUnauthorized(xhr) {
        securityContext.clear();

        if (xhr.login) {
            exceptionHandler.handle({
                status: "fail",
                data: {
                    key: "org.springframework.security.authentication.BadCredentialsException"
                }
            });
        } else {
            router.navigate("");
            router.reloadCurrentLocation();
        }
    }

    function handleInternalServerError(data, status, error) {
        error(data, status);
        exceptionHandler.handle(data);
    }

    function getReadOnlyRequestSettings(url, verb, cacheName) {
        return {
            url: url,
            beforeSend: beforeRead,
            type: verb,
            contentType: CONTENT_TYPE,
            dataType: DATA_TYPE,
            cache: {
                type: cacheName,
                expires: DEFAULT_CACHE_TIMEOUT
            },
            dataMap: dataMap,
            decoder: EXCEPTION_HANDLER_DECODER
        };
    }

    function getWriteRequestSettings(url, verb) {
        return {
            url: url,
            beforeSend: beforeWrite,
            type: verb,
            contentType: CONTENT_TYPE,
            dataType: DATA_TYPE,
            dataMap: dataMap,
            decoder: EXCEPTION_HANDLER_DECODER
        };
    }

    function getLoginRequestSettings(url, verb) {
        return {
            url: url,
            beforeSend: beforeLogin,
            contentType: CONTENT_TYPE,
            dataType: DATA_TYPE,
            type: verb,
            decoder: EXCEPTION_HANDLER_DECODER
        };
    }

    utils.HASH_CHAR = HASH_CHAR;
    utils.requestMappings = requestMappings;
    utils.REQUEST_TYPE = REQUEST_TYPE;
    utils.verb = verb;
    utils.CONTENT_TYPE = CONTENT_TYPE;
    utils.DATA_TYPE = DATA_TYPE;
    utils.EXCEPTION_HANDLER_DECODER = EXCEPTION_HANDLER_DECODER;
    utils.requestCount = requestCount;

    utils.DATA_MAP_CALLBACK = dataMap;
    utils.getLoginRequestSettings = getLoginRequestSettings;
    utils.getReadOnlyRequestSettings = getReadOnlyRequestSettings;
    utils.getWriteRequestSettings = getWriteRequestSettings;

    return utils;
});