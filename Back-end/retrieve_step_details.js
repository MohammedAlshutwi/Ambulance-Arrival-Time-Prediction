/**
 * Created by mohammed on 27/8/17.
 */

var ROAD_DETAILS = require('retrieve_Road_details');
var ERC_DETAILS = require('check_ERC');

exports.retrieve_step_details = function (step, speedSignsResponse, ERCResponse) {

    var stepDetails = {
        "start_location": {
            "lat": step.start_location.lat.toString(),
            "lng": step.start_location.lng.toString()
        },
        "end_location": {
            "lat": step.end_location.lat.toString(),
            "lng": step.end_location.lng.toString()
        },
        "distance": {
            "text": step.distance.text,
            "value": step.distance.value
        },
        "speedLimit": 0,
        "numberOfLanes": 0,
        "duration": {
            "text": step.duration.text,
            "value": step.duration.value
        },
        "html_instructions": step.html_instructions,
        "ERC": null,
        "polyline": {
            "points": step.polyline.points
        }
    };

    var bbox = [{
                    x: parseFloat(stepDetails.start_location.lng),
                    y: parseFloat(stepDetails.start_location.lat)
                },
                {
                    x: parseFloat(stepDetails.end_location.lng),
                    y: parseFloat(stepDetails.end_location.lat)
                }];

    stepDetails.speedLimit = ROAD_DETAILS.retrieve_speed_limit(bbox, speedSignsResponse);
    stepDetails.numberOfLanes = ROAD_DETAILS.get_number_of_lanes(bbox, speedSignsResponse);
    stepDetails.ERC = ERC_DETAILS.check_ERC(bbox, ERCResponse);

    var distance = stepDetails.distance.value;
    var speedLimit = stepDetails.speedLimit * (5/18);
    var duration = parseInt(distance/speedLimit);

    stepDetails.duration.value = duration;
    stepDetails.duration.text= (duration/60) + " mins";

    return stepDetails;
};