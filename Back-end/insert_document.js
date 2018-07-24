/**
 * Created by mohammed on 29/8/17.
 */
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://54.252.190.235:27017/RoutesDataset"; // datadet url 

const options = {

    keepAlive: 300000,
    connectTimeoutMS: 30000
};

exports.insert_document = function (document) {

    MongoClient.connect(url, options, function(err, db) {

        if (err) throw err;

        db.collection("routes").insertOne(document, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
};