/**
 * Created by mohammed on 17/9/17.
 */

var mongoDB = require('retrieve_document');
var lookup = require('check_nearest_location');
var classify = require('group-array');
var toArray = require('object-values-to-array');
var outlier = require('outliers-lizia').outliersRemoving;
var RESPONSE = require('prepare_response');
var moment = require('moment');

var originToSceneQuery = {};
var originToSceneRoutes = [];

var sceneToDestinationQuery = {};
var sceneToDestinationRoutes = [];

var lightsAndSirens = false;
var travelTime = moment();

exports.predict = function (req, res) {

        getMongoQuery(req);



        mongoDB.retrieve_document(originToSceneQuery)

        .then(function(foundResult) {

            return classifyRoutes(foundResult);
        })
        .then(function (classifiedRoutes) {

            return predictTime(classifiedRoutes);
        })
        .then(function (predictedRoutesObject) {

            originToSceneRoutes = predictedRoutesObject;
            //console.log(originToSceneRoutes);
        })



        .then(function () {

            return mongoDB.retrieve_document(sceneToDestinationQuery);
        })

        .then(function(foundResult) {

            return classifyRoutes(foundResult);
        })
        .then(function (classifiedRoutes) {

            return predictTime(classifiedRoutes);
        })
        .then(function (predictedRoutesObject) {

            sceneToDestinationRoutes = predictedRoutesObject;
            //console.log(sceneToDestinationRoutes);
        })



        .then(function () {

            res.send({
                "origin_to_scene_routes": originToSceneRoutes,
                "scene_to_destination_routes": sceneToDestinationRoutes
            });
        });

};

function classifyRoutes(result) {

    return new Promise(function (resolve, reject) {

        var classifiedRoutes = toArray(classify(result, 'route_summary'));

        resolve(classifiedRoutes);
    });
}

function predictTime(classifiedRoutes) {

    return new Promise(function (resolve, reject) {

        var predictedTimeArray = [];

        for (var i = 0; i < classifiedRoutes.length; i++)
        {
            predictedTimeArray.push(calculateTime(classifiedRoutes[i]));
        }

        var predictedRoutesObject = RESPONSE.prepareResponse(classifiedRoutes, predictedTimeArray, travelTime);

        resolve(predictedRoutesObject);
    });
}

function calculateTime(route) {

    var timeInTrafficArray = [];
    var predictedTimeArray = [];

    for (var i = 0; i < route.length; i++)
    {
        timeInTrafficArray.push(parseFloat(route[i].duration_in_traffic.value));
    }

    timeInTrafficArray = outlier(timeInTrafficArray);

    var totalTimeInTraffic = 0;
    var numOfRoutes = timeInTrafficArray.length;

    for (var i = 0; i < timeInTrafficArray.length; i++)
    {
        totalTimeInTraffic += parseFloat(timeInTrafficArray[i]);
    }

    predictedTimeArray.push(totalTimeInTraffic / numOfRoutes);

    return predictedTimeArray;
}

function getMongoQuery(req) {

    var request = req.params;

    var origin = request.origin.split(/[\+,]+/);
    var originLat = origin[0].trim(); //.substring(0,7);
    var originLng = origin[1].trim(); //.substring(0,7);
    var nearest_location_to_origin = lookup.check_nearest_location({lat: originLat, lng: originLng});

    var scene = request.scene.split(/[\+,]+/);
    var sceneLat = scene[0].trim(); //.substring(0,7);
    var sceneLng = scene[1].trim(); //.substring(0,7);
    var nearest_location_to_scene = lookup.check_nearest_location({lat: sceneLat, lng: sceneLng});

    var destination = request.destination.split(/[\+,]+/);
    var destinationLat = destination[0].trim(); //.substring(0,7);
    var destinationLng = destination[1].trim(); //.substring(0,7);
    var nearest_location_to_destination = lookup.check_nearest_location({lat: destinationLat, lng: destinationLng});

    var time = request.time.split(':');
    var hours = parseInt(time[0].trim());
    var minutes = parseInt(time[1].trim());
    var day = parseInt(request.day.trim());
    var date = parseInt(request.date.trim());
    var month = parseInt(request.month.trim());

    travelTime.hours(hours);
    travelTime.minute(minutes);
    travelTime.date(date);
    travelTime.month(month - 1);

    originToSceneQuery = {

        query_time_in_hours: hours,
        //query_time_in_minutes: minutes,
        query_time_in_day: day,
        //query_time_in_date: date,
        //query_time_in_month: month,

        "origin.nearest_location_to_origin": nearest_location_to_origin,

        "destination.nearest_location_to_destination": nearest_location_to_scene

    };

    sceneToDestinationQuery = {

        query_time_in_hours: hours,
        //query_time_in_minutes: minutes,
        query_time_in_day: day,
        //query_time_in_date: date,
        //query_time_in_month: month,

        "origin.nearest_location_to_origin": nearest_location_to_scene,

        "destination.nearest_location_to_destination": nearest_location_to_destination

    };
}
