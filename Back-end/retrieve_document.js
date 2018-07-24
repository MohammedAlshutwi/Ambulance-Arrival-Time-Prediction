/**
 * Created by mohammed on 16/9/17.
 */
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://54.252.190.235:27017/RoutesDataset"; // Dataset url

const options = {

    keepAlive: 300000,
    connectTimeoutMS: 30000
};


exports.retrieve_document = function (query) {

    return new Promise(function (resolve, reject) {

            MongoClient.connect(url, options, function(err, db) {

                if (err) throw err;

                //console.log(JSON.stringify(query, undefined, 2));
                //db.collection("routes").find({}).toArray(function(err, result) {

                db.collection("routes").find(query).toArray(function(err, foundResult) {

                    if (err) throw err;

                    console.log("1 document retrieved");
                    //console.log(JSON.stringify(foundResult, undefined, 2));
                    db.close();
                    resolve(foundResult);
                    //result = foundResult;
                });
            });
    });
};