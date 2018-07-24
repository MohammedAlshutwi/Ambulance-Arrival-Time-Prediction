/**
 * Created by mohammed on 27/8/17.
 */

var STEP = require('retrieve_step_details');
var lookup = require('check_nearest_location');
var moment = require('moment');

exports.check_route = function (route, speedSignsResponse, ERCResponse) {

    var ts = Date.now();

    var now = moment(ts);

    var record = {
        "query_time_in_milliseconds": ts,
        "query_time_in_hours": now.hours(),
        "query_time_in_minutes": now.minutes(),
        "query_time_in_day": now.day(),
        "query_time_in_date": now.date(),
        "query_time_in_month": now.month() + 1,
        "origin" : {
            "start_address": route.legs[0].start_address,
            "start_location": {
                "lat": route.legs[0].start_location.lat.toString().trim().substring(0,10),
                "lng": route.legs[0].start_location.lng.toString().trim().substring(0,10)
            },
            "nearest_location_to_origin": []
        },
        "destination" : {
            "end_address": route.legs[0].end_address,
            "end_location": {
                "lat": route.legs[0].end_location.lat.toString().trim().substring(0,10),
                "lng": route.legs[0].end_location.lng.toString().trim().substring(0,10)
            },
            "nearest_location_to_destination": []
        },
        "distance": {
            "text": route.legs[0].distance.text,
            "value": route.legs[0].distance.value
        },
        "duration": {
            "text": route.legs[0].duration.text,
            "value": route.legs[0].duration.value
        },
        "duration_in_traffic": {
            "text": route.legs[0].duration_in_traffic.text,
            "value": route.legs[0].duration_in_traffic.value
        },
        "steps": [],
        "ERC": "No Emergency Road Closure",
        "route_summary": route.summary,
        "overview_polyline": {
            "points": route.overview_polyline.points
        }
    };


    var routeSteps = route.legs[0].steps;
    var routeStepsLength = routeSteps.length;

    for (var i = 0; i < routeStepsLength; i++)
    {
        record.steps.push(
            STEP.retrieve_step_details(routeSteps[i], speedSignsResponse, ERCResponse)
        );
    }


    var steps = record.steps;
    var stepsLength = steps.length;
    var totalDuration = 0;

    for (var j = 0; j < stepsLength; j++)
    {
        totalDuration += steps[j].duration.value;

        if (steps[j].ERC !== null)
        {
            record.ERC = steps[j].ERC;
        }
    }

    record.duration.value = totalDuration;
    record.duration.text = (totalDuration/60) + " mins";


    record.origin.nearest_location_to_origin = lookup.check_nearest_location({

        lat: parseFloat(record.origin.start_location.lat),
        lng: parseFloat(record.origin.start_location.lng)
    });

    record.destination.nearest_location_to_destination = lookup.check_nearest_location({

        lat: parseFloat(record.destination.end_location.lat),
        lng: parseFloat(record.destination.end_location.lng)
    });


    return record;
};