/**
 * Created by mohammed on 30/8/17.
 */

var request = require('request');
var request_method = require('request_method');

const google_API_KEY = '*************'; // google maps API key
const google_URL_BASE = 'https://maps.googleapis.com/maps/api/directions/json?';
const google_OPTIONAL_PARAMETER = '&avoid=ferries|indoor&region=au&departure_time=now&alternatives=true';

var locationArray = [
    {locationId: 0, gps: {lat: '-37.756231', long: '145.060292'}, name: 'Austin Hospital Heidelberg VIC 3084', type: 'destination'},
    {locationId: 1, gps: {lat: '-37.731421', long: '144.937676'}, name: 'Ambulance Victoria, Coburg Branch, Gaffney St, Pascoe Vale VIC 3044', type: 'origin'},

    {locationId: 2, gps: {lat: '-37.792372', long: '145.058171'}, name: '6 Arden Ct Kew East VIC 3102', type: 'scene'},
    {locationId: 3, gps: {lat: '-37.828304', long: '145.056133'}, name: '58 Harold St Hawthorn East VIC 3123', type: 'scene'},
    {locationId: 4, gps: {lat: '-37.864169', long: '145.053412'}, name: '16 Willoby Ave, Glen Iris VIC 3146', type: 'scene'},
    {locationId: 5, gps: {lat: '-37.757093', long: '145.105767'}, name: '2 Ians Grove Templestowe Lower VIC 3107', type: 'scene'},
    {locationId: 6, gps: {lat: '-37.757691', long: '145.151321'}, name: '31-33 McDonald Ave Templestowe VIC 3106', type: 'scene'},
    {locationId: 7, gps: {lat: '-37.757945', long: '145.196442'}, name: '294 Tindals Rd Warrandyte VIC 3113', type: 'scene'},
    {locationId: 8, gps: {lat: '-37.792939', long: '145.104361'}, name: '99 Winfield Rd Balwyn North VIC 3104', type: 'scene'},
    {locationId: 9, gps: {lat: '-37.829002', long: '145.102333'}, name: '20 Florence Rd Surrey Hills VIC 3127', type: 'scene'},
    {locationId: 10, gps: {lat: '-37.721026', long: '145.107652'}, name: '4 Ross Ct Yallambie VIC 3085', type: 'scene'},
    {locationId: 11, gps: {lat: '-37.684762', long: '145.109081'}, name: '4 Larcom Ct Greensborough VIC 3088', type: 'scene'},
    {locationId: 12, gps: {lat: '-37.720481', long: '145.062339'}, name: 'Macleod Victoria 3085', type: 'scene'},
    {locationId: 13, gps: {lat: '-37.684757', long: '145.064435'}, name: '39 Betula Ave Bundoora VIC 3083', type: 'scene'},
    {locationId: 14, gps: {lat: '-37.649161', long: '145.066101'}, name: 'Epping Victoria 3076', type: 'scene'},
    {locationId: 15, gps: {lat: '-37.754486', long: '145.014399'}, name: '370 Victoria Rd Thornbury VIC 3071', type: 'scene'},
    {locationId: 16, gps: {lat: '-37.752981', long: '144.969517'}, name: '76 The Avenue Coburg VIC 3058', type: 'scene'},
    {locationId: 17, gps: {lat: '-37.751975', long: '144.923788'}, name: '50 Hoddle St Essendon VIC 3040', type: 'scene'},
    {locationId: 18, gps: {lat: '-37.718061', long: '145.015707'}, name: '185 Broadway Reservoir VIC 3073', type: 'scene'},
    {locationId: 19, gps: {lat: '-37.682645', long: '145.017755'}, name: 'TOTAL EXPRESS 23A Heyington Ave, Thomastown VIC 3074', type: 'scene'},
    {locationId: 20, gps: {lat: '-37.791148', long: '145.013159'}, name: 'M3 Fairfield VIC 3078', type: 'scene'},
    {locationId: 21, gps: {lat: '-37.826183', long: '145.010897'}, name: '2 Queen St Richmond VIC 3121', type: 'scene'}
];



exports.makeDirectionRequest = function () {

    var origin = locationArray[1].gps.lat + ',' + locationArray[1].gps.long;
    var destination = locationArray[0].gps.lat + ',' + locationArray[0].gps.long;

    for (var i = 2; i < locationArray.length; i++)
    {
        var scene = locationArray[i].gps.lat + ',' + locationArray[i].gps.long;

        var url = google_URL_BASE + 'origin=' + origin + '&destination=' + scene + google_OPTIONAL_PARAMETER + '&key=' + google_API_KEY;
        makeGoogleAPIRequest(url);
    }

    for (var i = 2; i < locationArray.length; i++)
    {
        var scene = locationArray[i].gps.lat + ',' + locationArray[i].gps.long;

        var url = google_URL_BASE + 'origin=' + scene + '&destination=' + destination + google_OPTIONAL_PARAMETER + '&key=' + google_API_KEY;
        makeGoogleAPIRequest(url);
    }
};



function makeGoogleAPIRequest(url) {
    request(
        url , function (error, response, data) {
            if (error) {
                console.log('[ERROR] ' + error);
                return;
            }

            console.log('Data received.');
            const directionsData = JSON.parse(data);
            //console.log(JSON.stringify(directionsData, undefined, 2));

            request_method.setDirectionsResponse(directionsData);

        });
}
