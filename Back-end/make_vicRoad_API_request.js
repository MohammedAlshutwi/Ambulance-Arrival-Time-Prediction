/**
 * Created by mohammed on 30/8/17.
 */

var request = require('request');
var request_method = require('request_method');

const vicRoadsAPI_Header = { 'Ocp-Apim-Subscription-Key' : '***************' }; // vicRoads API key
const vicRoadsAPI_URL_BASE = 'https://vrdepprototype.azure-api.net/vicroads_open_data/wfs?SERVICE=WFS&VERSION=1.1.0&REQUEST=GetFeature';
const vicRoadsAPI_OUTPUTFORMAT = '&OUTPUTFORMAT=application/json';



exports.makeSpeedSignsRequest = function () {

    var TYPENAMES = '&TYPENAMES=vicroads:variable_speed_signs';
    var options = {
        url: vicRoadsAPI_URL_BASE + TYPENAMES + vicRoadsAPI_OUTPUTFORMAT,
        method: 'GET',
        headers: vicRoadsAPI_Header
    };

    request(
        options , function (error, response, data) {
            if (error) {
                console.log('[ERROR] ' + error);
                return;
            }

            console.log('Data received.');
            const speedSigns_responce = JSON.parse(data);
            //console.log(JSON.stringify(speedSigns_responce, undefined, 2));

            request_method.setSpeedSignsResponce(speedSigns_responce);
        });
};



exports.makeERCRequest = function () {

    var TYPENAMES = '&TYPENAMES=vicroads:erc_line';
    var options = {
        url: vicRoadsAPI_URL_BASE + TYPENAMES + vicRoadsAPI_OUTPUTFORMAT,
        method: 'GET',
        headers: vicRoadsAPI_Header
    };

    request(
        options , function (error, response, data) {
            if (error) {
                console.log('[ERROR] ' + error);
                return;
            }

            console.log('Data received.');
            const ERC_responce = JSON.parse(data);
            //console.log(JSON.stringify(ERC_responce, undefined, 2));

            request_method.setERCResponce(ERC_responce);
        });
};