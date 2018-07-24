/**
 * Created by mohammed on 21/9/17.
 */

var moment = require('moment');


exports.prepareResponse = function (classifiedRoutes, predictedTimeArray, travelTime) {

    var preparedResponse = [];

    for (var i = 0; i < classifiedRoutes.length; i++)
    {
        preparedResponse.push(setRecord(classifiedRoutes[i], predictedTimeArray[i], travelTime));
    }

    return preparedResponse;
};

function setRecord(routesGroup, predictedTime, travelTime) {

    var latestRecord = routesGroup[0];

    for (var i = 0; i < routesGroup.length; i++)
    {
        if (routesGroup[i].query_time_in_milliseconds > latestRecord.query_time_in_milliseconds)
        {
            latestRecord = routesGroup[i];
        }
    }

    return prepareRecord(latestRecord, predictedTime, travelTime);
}

function prepareRecord(latestRecord, predictedTime, travelTime) {

    var predictedTravelTimeWithLightsAndSirens = 0;
    var predictedTimeInMin = predictedTime[0] / 60;
    var timeDifference = predictedTime[0] - latestRecord.duration.value;

    if (predictedTimeInMin > 8.8)
    {
        predictedTravelTimeWithLightsAndSirens =
            predictedTime[0] - (timeDifference * 0.28);
    }
    else
    {
        predictedTravelTimeWithLightsAndSirens =
            predictedTime[0] - (timeDifference * 0.47);
    }

    var arrivalTime = moment(travelTime);
    arrivalTime.add(predictedTime[0], 'seconds');

    var predictedArrivalTimeWithLightsAndSirens = moment(travelTime);
    predictedArrivalTimeWithLightsAndSirens.add(predictedTravelTimeWithLightsAndSirens, 'seconds');

    var route = {

        "origin" : {
            "start_address": latestRecord.origin.start_address,
            "start_location": {
                "lat": latestRecord.origin.start_location.lat.toString().trim().substring(0,10),
                "lng": latestRecord.origin.start_location.lng.toString().trim().substring(0,10)
            },
            "nearest_location_to_origin": latestRecord.origin.nearest_location_to_origin
        },
        "destination" : {
            "end_address": latestRecord.destination.end_address,
            "end_location": {
                "lat": latestRecord.destination.end_location.lat.toString().trim().substring(0,10),
                "lng": latestRecord.destination.end_location.lng.toString().trim().substring(0,10)
            },
            "nearest_location_to_destination": latestRecord.destination.nearest_location_to_destination
        },
        //"travel_time": travelTime.toString(),
        //"travel_time_in_milliseconds": travelTime.valueOf(),
        //"predicted_arrival_time": arrivalTime.toString(),
        //"predicted_arrival_time_in_milliseconds": arrivalTime.valueOf(),
        "predicted_travel_duration": {
            "text": (predictedTime[0] / 60).toFixed(2) + " mins",
            "value": predictedTime[0]                           //toFixed(2)
        },
        //"predicted_arrival_time_Lights_Sirens": predictedArrivalTimeWithLightsAndSirens.toString(),
        //"predicted_arrival_time_in_milliseconds_Lights_Sirens": predictedArrivalTimeWithLightsAndSirens.valueOf(),
        "predicted_travel_duration_Lights_Sirens": {
            "text": (predictedTravelTimeWithLightsAndSirens / 60).toFixed(2) + " mins",
            "value": predictedTravelTimeWithLightsAndSirens
        },
        "distance": {
            "text": latestRecord.distance.text,
            "value": latestRecord.distance.value
        },
        "duration": {
            "text": latestRecord.duration.text,
            "value": latestRecord.duration.value
        },
        "steps": latestRecord.steps,
        "ERC": latestRecord.ERC,
        "route_summary": latestRecord.route_summary,
        "overview_polyline": {
            "points": latestRecord.overview_polyline.points
        }
    };

    return route;
}
