﻿/// <reference path='../definitions/references.d.ts' />

module InspiralWeb.UI {
    'use strict';

    var containerSize = 35,
        fixedContainer = '#gear-options-selector .fixed-container .scroll-container',
        rotatingContainer = '#gear-options-selector .rotating-container .scroll-container';

    // add all the gear sizes to both lists
    var gearSize = 5;
    Enumerable.from((new Shapes.GearOptionsFactory()).createAllOptions())
        .select(x => {

            var gearOption: Shapes.GearOptions = {
                holeCount: 0,
                holePositionBuffer: 0,
                holeRadius: 0,
                holeSweepAngle: 0,
                radius: gearSize,
                toothCount: Math.floor(gearSize + 4),
                toothHeight: 3
            };

            gearSize += .4;

            return { originalGear: x, modifiedGear: gearOption };
        })
        .orderBy((x) => x.originalGear.toothCount)
        .forEach((gear) => {

            [fixedContainer, rotatingContainer].forEach((container) => {
                var gearContainer = d3.select(container).append('div').attr({
                    'class': 'gear-container',
                    'data-tooth-count-1': gear.originalGear.toothCount,
                    'gear-type': 'gear'
                });

                var svgContainer = gearContainer.append("svg").attr({
                    width: containerSize,
                    height: containerSize
                });

                gearContainer.append('div').attr('class', 'gear-label color-changing').html(gear.originalGear.toothCount);

                svgContainer.append('g')
                    .attr('class', 'gear color-changing')
                    .attr("transform", "translate(" + containerSize / 2 + "," + containerSize / 2 + ")")
                    .datum(gear.modifiedGear)
                    .append("path")
                    .attr("d", Shapes.Gear);
            });
        });

    // add all the beam options to the list of fixed gears
    var endCapsToothCount = 8,
        totalToothCount = 16
    Enumerable.from((new Shapes.BeamOptionsFactory()).createAllOptions())
        .select(x => {
            var beamOption: Shapes.BeamOptions = {
                endCapsToothCount: endCapsToothCount,
                toothHeight: 2,
                totalToothCount: totalToothCount,
                toothWidth: 4
            };

            endCapsToothCount += 2;
            totalToothCount += 2;

            return { originalGear: x, modifiedGear: beamOption };
        })
        .orderBy((x) => x.originalGear.totalToothCount)
        .forEach((beam) => {
            var gearContainer = d3.select(fixedContainer).append('div').attr({
                'class': 'gear-container',
                'data-tooth-count-1': beam.originalGear.totalToothCount,
                'data-tooth-count-2': beam.originalGear.endCapsToothCount,
                'gear-type': 'beam'
            });

            var svgContainer = gearContainer.append("svg").attr({
                width: containerSize,
                height: containerSize
            });

            gearContainer.append('div').attr('class', 'gear-label color-changing' + (beam.originalGear.totalToothCount > 99 ? ' small-label' : '')).html(beam.originalGear.totalToothCount);

            svgContainer.append('g')
                .attr('class', 'gear color-changing')
                .attr("transform", "translate(" + containerSize / 2 + "," + containerSize / 2 + ")")
                .datum(beam.modifiedGear)
                .append("path")
                .attr("d", Shapes.Beam);

            // append a placeholder to the rotating gear list to keep the lists the same length visually
            var placeholderGearContainer = d3.select(rotatingContainer).append('div').attr({
                'class': 'gear-container placeholder',
                'placeholder': 'true'
            });
        });

    // add all the ring gear options to the list of fixed gears
    var innerToothCount = 11,
        innerRadius = 5,
        outerToothCount = 16,
        outerRadius = 13;
    Enumerable.from((new Shapes.RingGearOptionsFactory()).createAllOptions())
        .select(x => {
            var ringGearOption: Shapes.RingGearOptions = {
                innerRadius: innerRadius,
                innerToothCount: innerToothCount,
                innerToothHeight: 3,
                outerRadius: outerRadius,
                outerToothCount: outerToothCount,
                outerToothHeight: 3
            };

            innerToothCount += 2;
            innerRadius += 2;
            outerToothCount += 2;
            outerRadius += 2;

            return { originalGear: x, modifiedGear: ringGearOption };
        })
        .orderBy((x) => x.originalGear.innerToothCount)
        .forEach((ringGear) => {
            var gearContainer = d3.select(fixedContainer).append('div').attr({
                'class': 'gear-container',
                'data-tooth-count-1': ringGear.originalGear.outerToothCount,
                'data-tooth-count-2': ringGear.originalGear.innerToothCount,
                'gear-type': 'ring-gear'
            });

            var svgContainer = gearContainer.append("svg").attr({
                width: containerSize,
                height: containerSize
            });

            gearContainer.append('div')
                .attr('class', 'gear-label color-changing ring-gear-label')
                .html('<div>' + ringGear.originalGear.outerToothCount + '</div><hr /><div>' + ringGear.originalGear.innerToothCount + '</div>');

            svgContainer.append('g')
                .attr('class', 'gear color-changing')
                .attr("transform", "translate(" + containerSize / 2 + "," + containerSize / 2 + ")")
                .datum(ringGear.modifiedGear)
                .append("path")
                .attr("d", Shapes.RingGear);

            // append a placeholder to the rotating gear list to keep the lists the same length visually
            var placeholderGearContainer = d3.select(rotatingContainer).append('div').attr({
                'class': 'gear-container placeholder',
                'placeholder': 'true'
            });
        });

    // add an extra placeholder onto the bottom of each container for breathing room
    [fixedContainer, rotatingContainer].forEach((container) => {
        d3.select(container).append('div').attr({
            'class': 'gear-container placeholder',
            'placeholder': 'true'
        });
    });

    // add click events for all gear options
    $('#gear-options-selector').on('click', '.gear-container', (ev) => {
        var $target = $(ev.currentTarget);
        var gearSizes = [parseInt($target.attr('data-tooth-count-1'), 10), parseInt($target.attr('data-tooth-count-2'), 10)];
        var isPlaceholder = $target.is('[placeholder]');

        if (!isPlaceholder) {

            switch ($target.attr('gear-type')) {
                case 'gear':
                    var gearType = Shapes.GearType.Gear;
                    break;
                case 'beam':
                    var gearType = Shapes.GearType.Beam;
                    break;
                case 'ring-gear':
                    var gearType = Shapes.GearType.RingGear;
                    break;
                default:
                    throw 'Unknown type on gear-type attribute: ' + $target.attr('gear-type');
            }

            $target.addClass('selected').siblings().removeClass('selected');
            var fixedOrRotating = $target.parents('.fixed-container').length !== 0 ? Shapes.GearRole.Fixed : Shapes.GearRole.Rotating;

            EventAggregator.publish('gearSelected', fixedOrRotating, gearType, gearSizes[0], gearSizes[1]);
        }
    });
}
