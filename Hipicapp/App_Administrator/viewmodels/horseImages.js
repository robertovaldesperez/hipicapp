/* global define: false */
define([
    "core/i18n", "core/util/validationUtils", "domain/file/fileBroker",
    "domain/horse/horseBroker", "viewmodels/horse"
], function horseImages(i18n, validationUtils, fileBroker, horseBroker, horseViewModel) {
    "use strict";

    // state definition
    var viewModel = $.extend(false, {}, horseViewModel), superActivate = viewModel.activate;

    function activate(athleteId, horseId) {
        return superActivate(athleteId, horseId).done(refreshNav);
    }

    function refreshNav() {
        viewModel.nav(viewModel.navs.IMAGES);
    }

    // module revelation
    viewModel.fileBroker = fileBroker;
    viewModel.horseBroker = horseBroker;

    // behaviour revelation
    viewModel.activate = activate;

    return viewModel;
});