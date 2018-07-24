/**
 * Created by mohammed on 14/8/17.
 */

var GOOGL_API = require('make_direction_request');
var VICROAD_API = require('make_vicRoad_API_request');

var checkAndStore_directions = require('checkAndStore_directions');

var directionsResponse;
var speedSigns_responce;
var ERC_responce;


exports.makeRequest = function () {

    makeSpeedSignsRequest();
    makeERCRequest();
    //setIntervalRequests();  //remove comments from this line to make frequent requests
    setTimeout(makeDirectionRequest, 10000);  // comment this line as well
};


/*function setIntervalRequests() {     //remove comments from this function to make frequent requests

    setInterval(makeSpeedSignsRequest, 86400000);
    setInterval(makeERCRequest, 7200000);
    setInterval(makeDirectionRequest, 1800000);
}*/



function makeDirectionRequest() {

    GOOGL_API.makeDirectionRequest();
}



function makeSpeedSignsRequest() {

    VICROAD_API.makeSpeedSignsRequest();
}



function makeERCRequest() {

    VICROAD_API.makeERCRequest();
}



exports.setDirectionsResponse = function (response) {

    directionsResponse = response;
    checkAndStore();
};



exports.setSpeedSignsResponce = function (response) {

    speedSigns_responce = response;
};



exports.setERCResponce = function (response) {

    ERC_responce = response;
};



function checkAndStore() {

    checkAndStore_directions.checkAndStore(directionsResponse, speedSigns_responce, ERC_responce);
}
