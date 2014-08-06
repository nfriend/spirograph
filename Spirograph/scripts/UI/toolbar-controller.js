﻿/// <reference path='../definitions/references.d.ts' />
var Spirograph;
(function (Spirograph) {
    (function (UI) {
        'use strict';

        var $toolbarContainer = $('#toolbar-container'), $clearButton = $('#clear-button'), $body = $('body'), $showHideGearsButton = $('#show-hide-gears-button'), $downloadButton = $('#download-button'), $galleryButton = $('#gallery-button');

        $downloadButton.tooltip({
            title: 'Download and save<br />to the gallery',
            placement: 'bottom',
            html: true
        });

        $showHideGearsButton.tooltip({
            title: 'Show/hide gears',
            placement: 'bottom'
        });

        $clearButton.tooltip({
            title: 'Erase everything',
            placement: 'bottom'
        });

        $galleryButton.tooltip({
            title: 'View the gallery',
            placement: 'bottom'
        });

        // closes all modals, and then removes itself
        function closeAllPopoversOnClickHandler(ev) {
            if ($(ev.target).closest('.popover').length === 0) {
                $clearButton.popover('hide');
                $body.off('click', closeAllPopoversOnClickHandler);
            }
        }

        function attachCloseAllPopoversHandler() {
            $body.on('click', closeAllPopoversOnClickHandler);
        }

        $clearButton.popover({
            trigger: 'manual',
            content: '<div class="btn btn-danger clear-button-confirmation">Yes, erase it!</div>',
            title: 'Are you sure?',
            placement: 'bottom',
            html: true
        });

        $clearButton.on('click', function (e) {
            e.stopPropagation();
            $clearButton.popover('show');
            $clearButton.tooltip('hide');
            attachCloseAllPopoversHandler();
        });

        $toolbarContainer.on('click', '.clear-button-confirmation', function (e) {
            $clearButton.popover('hide');
            Spirograph.EventAggregator.publish('clearCanvas');
        });

        $showHideGearsButton.click(function () {
            if (Spirograph.areGearsVisible) {
                $showHideGearsButton.find('i').removeClass('fa-eye').addClass('fa-eye-slash');
            } else {
                $showHideGearsButton.find('i').removeClass('fa-eye-slash').addClass('fa-eye');
            }
            Spirograph.areGearsVisible = !Spirograph.areGearsVisible;

            Spirograph.EventAggregator.publish('gearVisibilityChange', Spirograph.areGearsVisible);
        });

        $downloadButton.click(function () {
            var icon = $downloadButton.addClass('disabled').find('i').removeClass('fa-download').addClass('fa-cog fa-spin');
            Spirograph.EventAggregator.publish('downloadImage', function () {
                icon.removeClass('fa-cog fa-spin').addClass('fa-download');
                $downloadButton.removeClass('disabled');
            });
        });

        $galleryButton.click(function () {
            // there might be a better way to do this
            var $link = $('<a href="gallery.html" target="_blank" style="display: none;"></a>');
            $body.append($link);
            $link[0].click();
            $link.remove();
        });
    })(Spirograph.UI || (Spirograph.UI = {}));
    var UI = Spirograph.UI;
})(Spirograph || (Spirograph = {}));
//# sourceMappingURL=toolbar-controller.js.map
