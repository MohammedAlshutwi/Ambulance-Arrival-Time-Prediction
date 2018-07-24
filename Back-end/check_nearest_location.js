/**
 * Created by mohammed on 19/9/17.
 */

var sphereKnn = require("sphere-knn"),
    lookup    = sphereKnn([

        {lat: -37.756231, lon: 145.060292},
        {lat: -37.731421, lon: 144.937676},
        {lat: -37.792372, lon: 145.058171},
        {lat: -37.828304, lon: 145.056133},
        {lat: -37.864169, lon: 145.053412},
        {lat: -37.757093, lon: 145.105767},
        {lat: -37.757691, lon: 145.151321},
        {lat: -37.757945, lon: 145.196442},
        {lat: -37.792939, lon: 145.104361},
        {lat: -37.829002, lon: 145.102333},
        {lat: -37.721026, lon: 145.107652},
        {lat: -37.684762, lon: 145.109081},
        {lat: -37.720481, lon: 145.062339},
        {lat: -37.684757, lon: 145.064435},
        {lat: -37.649161, lon: 145.066101},
        {lat: -37.754486, lon: 145.014399},
        {lat: -37.752981, lon: 144.969517},
        {lat: -37.751975, lon: 144.923788},
        {lat: -37.718061, lon: 145.015707},
        {lat: -37.682645, lon: 145.017755},
        {lat: -37.791148, lon: 145.013159},
        {lat: -37.826183, lon: 145.010897}

]);


exports.check_nearest_location = function (point) {

    var nearestPoints = lookup(point.lat, point.lng, 1, 4000);

    //console.log(nearestPoints);

    return nearestPoints;
}
