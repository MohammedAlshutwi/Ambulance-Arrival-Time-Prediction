'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}]);

app.controller("myController", function($scope, $http, $window, $route) {

    $scope.showMain = false;
    $scope.showResponse = false;

    $scope.ambulanceLocationModel = "";
    $scope.patientLocationModel = "";
    $scope.hospitalLocationModel = "";

    $scope.ambulanceLocation = "";
    $scope.patientLocation = "";
    $scope.hospitalLocation = "";

    $scope.possibleRoutesA2P = [];
    $scope.possibleRoutesP2H = [];

    $scope.selectedA2PRoute = {};
    $scope.selectedP2HRoute = {};

    $scope.totalNormalDuration = 0;
    $scope.totalLightSirensDuration = 0;



    $scope.reset = function()
    {
        $scope.showMain = false;
        $scope.showResponse = false;
    };

    $scope.setSelectedA2PRoute = function(A2PRoute)
    {
        $scope.selectedA2PRoute = A2PRoute;
        $scope.calculateNormalTotal();
        $scope.calculateLightSirensTotal();
    };

    $scope.setSelectedP2HRoute = function(P2HRoute)
    {
        $scope.selectedP2HRoute = P2HRoute;
        $scope.calculateNormalTotal();
        $scope.calculateLightSirensTotal();
    };

    $scope.calculateNormalTotal = function()
    {
        if (isEmpty($scope.selectedA2PRoute) || isEmpty($scope.selectedP2HRoute))
        {
            $scope.totalNormalDuration = 0;
        }
        else
        {
            var A2PValue = $scope.selectedA2PRoute.predicted_travel_duration.value;
            var P2HValue = $scope.selectedP2HRoute.predicted_travel_duration.value;

            $scope.totalNormalDuration = ((A2PValue + P2HValue) / 60).toFixed(2);
        }
    };

    $scope.calculateLightSirensTotal = function()
    {
        if (isEmpty($scope.selectedA2PRoute) || isEmpty($scope.selectedP2HRoute))
        {
            $scope.totalLightSirensDuration = 0;
        }
        else
        {
            var A2PValue = $scope.selectedA2PRoute.predicted_travel_duration_Lights_Sirens.value;
            var P2HValue = $scope.selectedP2HRoute.predicted_travel_duration_Lights_Sirens.value;

            $scope.totalLightSirensDuration = ((A2PValue + P2HValue) / 60).toFixed(2);
        }
    };

    $scope.reloadPage = function () {

        $scope.reloadPage = function(){window.location.reload();}
    };

    $scope.openMain = function()
    {
        $scope.ambulanceLocation = "";
        $scope.patientLocation = "";
        $scope.hospitalLocation = "";

        $scope.possibleRoutesA2P = [];
        $scope.possibleRoutesP2H = [];

        $scope.selectedA2PRoute = {};
        $scope.selectedP2HRoute = {};

        $scope.totalNormalDuration = 0;
        $scope.totalLightSirensDuration = 0;

        $scope.reset();
        $scope.showMain = true;
    };

    $scope.openResponse = function()
    {
        $scope.reset();
        $scope.showResponse = true;
    };

    $scope.getPrediction = function()
    {

        var URL_BASE = "http://localhost:3000/api/predict";

        var ambulanceLocation = '/' + $scope.ambulanceLocation;
        var patientLocation = '/' + $scope.patientLocation;
        var hospitalLocation = '/' + $scope.hospitalLocation;
        var day = '/' + document.forms["form"]["day"].value;
        var travelDate = '/' + document.forms["form"]["travelDate"].value;
        var TravelTime = '/' + document.forms["form"]["TravelTime"].value;
        var Month = '/' + document.forms["form"]["month"].value;

        var URLString = URL_BASE + ambulanceLocation + patientLocation + hospitalLocation + TravelTime + day + travelDate + Month;

        //$http.get("http://localhost:3000/api/predict/-37.731421+144.937676/-37.792372+145.058171/-37.756231+145.060292/23:37/6/23/9")
        $http.get(URLString)

            .then(function(response){

                $scope.possibleRoutesA2P = response.data.origin_to_scene_routes;
                $scope.possibleRoutesP2H = response.data.scene_to_destination_routes;

                //console.log(JSON.stringify($scope.possibleRoutesA2P, undefined, 2));

                $scope.openResponse();

            })

            .catch(function(response){

                alert("ERROR: " + "Please fill up required field");

            });
    };


    $scope.assignAmbulanceLocation = function () {

        $scope.ambulanceLocation = document.forms["form"]["ambulanceLocation"].value;
        $scope.requestNewMap();
    };

    $scope.assignPatientLocation = function () {

        $scope.patientLocation = document.forms["form"]["patientLocation"].value;
        $scope.requestNewMap();
    };

    $scope.assignHospitalLocation = function () {

        $scope.hospitalLocation = document.forms["form"]["hospitalLocation"].value;
        $scope.requestNewMap();
    };


    $scope.requestNewMap = function () {

        if (isEmpty($scope.ambulanceLocation) && isEmpty($scope.patientLocation) && isEmpty($scope.hospitalLocation))
        {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "https://maps.googleapis.com/maps/api/staticmap?size=512x512&center=-37.756412,145.060245&zoom=11&key=AIzaSyA8aHJRbGGB5-ka39eWw_QXugoYeyj7J-o");
            xhr.responseType = "blob";
            xhr.onload = response;
            xhr.send();
        }
        else
        {
            var MAP_URL_BASE = "https://maps.googleapis.com/maps/api/staticmap?size=512x512&center=-37.756412,145.060245&zoom=11";
            var MAP_API_KEY = "&key=AIzaSyA8aHJRbGGB5-ka39eWw_QXugoYeyj7J-o";
            var markerA = "";
            var markerP = "";
            var markerH = "";


            if (!isEmpty($scope.ambulanceLocation))
            {
                markerA = "&markers=color:green%7Clabel:A%7C" + $scope.ambulanceLocation;
            }


            if (!isEmpty($scope.patientLocation))
            {
                markerP = "&markers=color:red%7Clabel:P%7C" + $scope.patientLocation;
            }


            if (!isEmpty($scope.hospitalLocation))
            {
                markerH = "&markers=color:blue%7Clabel:H%7C" + $scope.hospitalLocation;
            }


            var imageUrl = MAP_URL_BASE + markerA + markerP + markerH + MAP_API_KEY;

            var xhr = new XMLHttpRequest();
            xhr.open("GET", imageUrl);
            xhr.responseType = "blob";
            xhr.onload = response;
            xhr.send();
        }
    };

    function response(e) {
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(this.response);
        document.querySelector("#image").src = imageUrl;
    }

    function isEmpty(myObject) {
        for(var key in myObject) {
            if (myObject.hasOwnProperty(key)) {
                return false;
            }
        }

        return true;
    }

});