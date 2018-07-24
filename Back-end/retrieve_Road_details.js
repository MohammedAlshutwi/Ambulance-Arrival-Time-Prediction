/**
 * Created by mohammed on 27/8/17.
 */

var checkPlace = require('isInside_polygon_method');

var RoadDetailsResponse;

exports.retrieve_speed_limit = function (bbox, speedSignsResponse) {

    RoadDetailsResponse = speedSignsResponse;
    var speedLimit = 0;
    var count = 0;

    var features = RoadDetailsResponse.features;
    var featuresLength = features.length;

    for (var i = 0; i < featuresLength; i++)
    {
        var signLocation = {
            x: features[i].geometry.coordinates[0],
            y: features[i].geometry.coordinates[1]
        };

        //speedSignEnabled = features[i].properties.enabled;

        if (checkPlace.isInside(bbox, signLocation)) //&& speedSignEnabled)
        {
            var speedSignValue = parseInt(features[i].properties.current_panelvalue.trim());

            if (! isNaN(speedSignValue))
            {
                speedLimit += speedSignValue;
                count++;
            }
        }
    }

    if (count === 0)
    {
        /*
        returning 50 as it's the default speed limit in built-up areas - according to civRoads website
        https://www.vicroads.vic.gov.au/safety-and-road-rules/driver-safety/speeding/victorias-speed-limits-
        */
        return 50;
    }
    return (speedLimit/count);
};

exports.get_number_of_lanes = function (bbox, speedSignsResponse) {

    RoadDetailsResponse = speedSignsResponse;
    var numberOfLanes = 0;

    var features = RoadDetailsResponse.features;
    var featuresLength = features.length;

    for (var i = 0; i < featuresLength; i++)
    {
        var geometry = {
            x: features[i].geometry.coordinates[0],
            y: features[i].geometry.coordinates[1]
        };

        if (checkPlace.isInside(bbox, geometry))
        {
            numberOfLanes = features[i].properties.current_lanenumber;
        }
    }
    return numberOfLanes;
};