﻿/// <reference path='../definitions/references.d.ts' />

module Spirograph.Interaction {
    'use strict';

    var lastMouseAngle = null,
        rotationOffset = 0,
        previousTransformInfo: Shapes.TransformInfo = null;

    export function attachDragHandlers(svgContainer: D3.Selection, rotatingGear: D3.Selection, canvas: HTMLCanvasElement, rotater: Shapes.Rotater,
        rotatingGearOptions: Shapes.GearOptions, holeOptions: Shapes.HoleOptions) {

        var ctx = canvas.getContext('2d');

        rotatingGear.on("mousedown", function (d, i) {
            rotatingGear.classed('dragging', true);

            svgContainer.on("mousemove", moveGear);

            svgContainer.on("mouseup", () => {
                svgContainer.on("mousemove", null);
                rotatingGear.classed('dragging', false);

                d3.event.preventDefault()
                return false;
            });

            d3.event.preventDefault()
            return false;
        });

        function moveGear(angle?: number) {

            // if an angle is passed in, we use that to position the gear
            // otherwise we use the mouse coordinates from the d3 event
            if (typeof angle !== 'undefined') {
                var mouseAngle = angle;
            } else {
                // chrome handles CSS3 transformed SVG elementes differently - to get
                // accurate mouse coordinates, we need to multiple by the current scale factor
                if (browser.browser === Browser.Chrome) {
                    var mouseCoords = Utility.toStandardCoords({ x: d3.mouse(svgContainer.node())[0] / scaleFactor, y: d3.mouse(svgContainer.node())[1] / scaleFactor }, { x: svgWidth, y: svgHeight });
                } else {
                    var mouseCoords = Utility.toStandardCoords({ x: d3.mouse(svgContainer.node())[0], y: d3.mouse(svgContainer.node())[1] }, { x: svgWidth, y: svgHeight });
                }

                var mouseAngle = Utility.toDegrees(Math.atan2(mouseCoords.y, mouseCoords.x));

                d3.event.preventDefault()
            }

            if (lastMouseAngle != null) {
                if (lastMouseAngle < -90 && mouseAngle > 90) {
                    rotationOffset--;
                } else if (lastMouseAngle > 90 && mouseAngle < -90) {
                    rotationOffset++;
                }
            }

            lastMouseAngle = mouseAngle;
            mouseAngle += (rotationOffset * 360);

            var transformInfo = rotater.rotate(rotatingGearOptions, mouseAngle, holeOptions);

            rotatingGear.attr("transform", "translate(" + transformInfo.x + "," + transformInfo.y + ") rotate(" + transformInfo.angle + ")");

            if (previousTransformInfo !== null) {
                var previousCanvasPenCoords = Utility.svgToCanvasCoords({ x: previousTransformInfo.penX, y: previousTransformInfo.penY });
                var currentCanvasPenCoords = Utility.svgToCanvasCoords({ x: transformInfo.penX, y: transformInfo.penY });

                ctx.beginPath();
                ctx.moveTo(previousCanvasPenCoords.x, previousCanvasPenCoords.y);
                ctx.lineTo(currentCanvasPenCoords.x, currentCanvasPenCoords.y);
                ctx.stroke();
                ctx.closePath();
            }

            previousTransformInfo = transformInfo;

            return false;
        };

        EventAggregator.subscribe('holeSelected', (hole: Shapes.HoleOptions) => {
            previousTransformInfo = null;
            holeOptions = hole;
        });

        // initialize the posiiton of the gear
        moveGear(0);
    }
} 