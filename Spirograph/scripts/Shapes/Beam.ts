﻿/// <reference path='../definitions/references.d.ts' />
'use strict';

module Spirograph.Shapes {

    export function Beam(options: BeamOptions) {

        if (options.endCapsToothCount % 2 !== 0) {
            throw 'Spirograph.Shapes.BeamOptions.endCapToothCount must be an even number';
        }
        if (options.totalToothCount % 2 !== 0) {
            throw 'Spirograph.Shapes.BeamOptions.totalToothCount must be an even number';
        }

        var pathBuilder = new SVG.PathBuilder(),
            radius = 2 * options.endCapsToothCount,
            beamToothCount = options.totalToothCount - options.endCapsToothCount,
            toothWidth = 2 * Math.PI * radius / options.endCapsToothCount,
            totalWidth = 2 * radius + toothWidth * (beamToothCount / 2),
            totalHeight = 2 * radius,
            offsetX = -1 * totalWidth / 2 + radius,
            toothAngleDelta = 360 / options.endCapsToothCount;


        pathBuilder.addCommand(new SVG.MCommand(offsetX, -1 * radius));

        // draw the top of the beam
        for (var i = 0; i < beamToothCount / 2; i++) {
            pathBuilder.addCommand(new SVG.LCommand((i + 1 / 6) * toothWidth + offsetX, -1 * radius));
            pathBuilder.addCommand(new SVG.LCommand((i + 1 / 2) * toothWidth + offsetX, (-1 * radius) + options.toothHeight));
            pathBuilder.addCommand(new SVG.LCommand((i + 4 / 6) * toothWidth + offsetX, (-1 * radius) + options.toothHeight));
            pathBuilder.addCommand(new SVG.LCommand((i + 1) * toothWidth + offsetX, -1 * radius));
        }

        // draw the right endcap
        var endCapOffsetX = offsetX *= -1;
        for (var i = 0; i < options.endCapsToothCount / 2; i++) {
            pathBuilder.addCommand(new SVG.ACommand(radius, radius, 0, false, true, radius * Math.cos(Utility.toRadians(90 - (i + 1 / 6) * toothAngleDelta)) + endCapOffsetX, -1 * radius * Math.sin(Utility.toRadians(90 - (i + 1 / 6) * toothAngleDelta))));
            pathBuilder.addCommand(new SVG.LCommand((radius - options.toothHeight) * Math.cos(Utility.toRadians(90 - (i + 1 / 2) * toothAngleDelta)) + endCapOffsetX, -1 * (radius - options.toothHeight) * Math.sin(Utility.toRadians(90 - (i + 1 / 2) * toothAngleDelta))));
            pathBuilder.addCommand(new SVG.ACommand(radius, radius, 0, false, true, (radius - options.toothHeight) * Math.cos(Utility.toRadians(90 - (i + 4 / 6) * toothAngleDelta)) + endCapOffsetX, -1 * (radius - options.toothHeight) * Math.sin(Utility.toRadians(90 - (i + 4 / 6) * toothAngleDelta))));
            pathBuilder.addCommand(new SVG.LCommand(radius * Math.cos(Utility.toRadians(90 - (i + 1) * toothAngleDelta)) + endCapOffsetX, -1 * radius * Math.sin(Utility.toRadians(90 - (i + 1) * toothAngleDelta))));
        }

        // draw the bottom of the beam
        offsetX *= -1;
        for (var i = (beamToothCount / 2); i > 0; i--) {
            pathBuilder.addCommand(new SVG.LCommand((i - 1 / 6) * toothWidth + offsetX, radius));
            pathBuilder.addCommand(new SVG.LCommand((i - 1 / 2) * toothWidth + offsetX, radius - options.toothHeight));
            pathBuilder.addCommand(new SVG.LCommand((i - 4 / 6) * toothWidth + offsetX, radius - options.toothHeight));
            pathBuilder.addCommand(new SVG.LCommand((i - 1) * toothWidth + offsetX, radius));
        }

        // draw the left endcap
        var endCapOffsetX = offsetX;
        for (var i = 0; i < options.endCapsToothCount / 2; i++) {
            pathBuilder.addCommand(new SVG.ACommand(radius, radius, 0, false, true, radius * Math.cos(Utility.toRadians(-90 - (i + 1 / 6) * toothAngleDelta)) + endCapOffsetX, -1 * radius * Math.sin(Utility.toRadians(-90 - (i + 1 / 6) * toothAngleDelta))));
            pathBuilder.addCommand(new SVG.LCommand((radius - options.toothHeight) * Math.cos(Utility.toRadians(-90 - (i + 1 / 2) * toothAngleDelta)) + endCapOffsetX, -1 * (radius - options.toothHeight) * Math.sin(Utility.toRadians(-90 - (i + 1 / 2) * toothAngleDelta))));
            pathBuilder.addCommand(new SVG.ACommand(radius, radius, 0, false, true, (radius - options.toothHeight) * Math.cos(Utility.toRadians(-90 - (i + 4 / 6) * toothAngleDelta)) + endCapOffsetX, -1 * (radius - options.toothHeight) * Math.sin(Utility.toRadians(-90 - (i + 4 / 6) * toothAngleDelta))));
            pathBuilder.addCommand(new SVG.LCommand(radius * Math.cos(Utility.toRadians(-90 - (i + 1) * toothAngleDelta)) + endCapOffsetX, -1 * radius * Math.sin(Utility.toRadians(-90 - (i + 1) * toothAngleDelta))));
        }

        pathBuilder.addCommand(new SVG.ZCommand());
        console.log(pathBuilder.toString());
        return pathBuilder.toString();
    }

    export interface BeamOptions {
        // how tall each tooth should be
        toothHeight?: number;
        // the total number of teeth that should appear on this beam; must be an even number
        totalToothCount: number;
        // how many teeth to draw on the end caps; must be an even number.
        endCapsToothCount: number;
    }
}