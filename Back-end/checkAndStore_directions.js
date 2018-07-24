/**
 * Created by mohammed on 27/8/17.
 */

var ROUTE = require('check_route');
var DATASET = require('insert_document');

exports.checkAndStore = function (googleResponse, speedSignsResponse, ERCResponse) {

    var routes = googleResponse.routes;
    var routesLength = routes.length;

    for (var i = 0; i < routesLength; i++)
    {
        try {
            var record = ROUTE.check_route(routes[i], speedSignsResponse, ERCResponse);
            //console.log(JSON.stringify(record, undefined, 2));

            DATASET.insert_document(record);
        }
        catch (err) {
            console.log('[ERROR] ' + err);
        }
    }
};
