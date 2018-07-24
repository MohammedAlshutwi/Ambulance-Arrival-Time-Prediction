/**
 * Created by mohammed on 28/8/17.
 */

var checkPlace = require('isInside_polygon_method');

exports.check_ERC = function (bbox, ERCLocations) {

    var ERCDetails = null;
    var features = ERCLocations.features;
    var featuresLength = features.length;

    for (var i = 0; i < featuresLength; i++)
    {
        var geometry = features[i].geometry.coordinates;
        var geometryLength = geometry.length;

        for (var j = 0; j < geometryLength; j++)
        {
            var location = {
                x: geometry[j][0],
                y: geometry[j][1]
            };

            if (checkPlace.isInside(bbox, location)) //&& speedSignEnabled)
            {
                var properties = features[i].properties;

                ERCDetails = {
                    "incident_type": properties.incident_type,
                    "incident_status": properties.incident_status,
                    "comms_comment": properties.comms_comment,
                    "road_closure_type": properties.road_closure_type,
                    "incident_publish": properties.incident_publish,
                    "declared_road_number": properties.declared_road_number,
                    "declared_road_direction": properties.declared_road_direction,
                    "closed_road_name": properties.closed_road_name,
                    "closed_road_rma_class": properties.closed_road_rma_class,
                    "incident_distance": properties.incident_distance,
                    "incident_direction": properties.incident_direction,
                    "incident_locality": properties.incident_locality,
                    "start_int_road_name": properties.start_int_road_name,
                    "start_int_locality": properties.start_int_locality,
                    "end_int_roadname": properties.end_int_roadname
                };

                return ERCDetails;
            }
        }
    }
    return ERCDetails;
};