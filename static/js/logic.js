// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
    console.log(data.features)
});

function createFeatures(earthquakeData) {


    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    // Define function to create the circle radius based on the magnitude
    function radiusSize(magnitude) {
        return magnitude * 18500;
    }

    // Define function to set the circle color based on the depth
    function circleColor(coordinates) {
        if (coordinates < 10) {
            return "#08f828"
        }
        else if (coordinates <= 30) {
            return "#b5fd0e"
        }
        else if (coordinates <= 60) {
            return "#ffcc33"
        }
        else if (coordinates <= 70) {
            return "#ffcc33"
        }
        else if (coordinates <= 90) {
            return "#ff6633"
        }
        else {
            return "#ff3333"
        }
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (earthquakeData, latlng) {
            return L.circle(latlng, {
                radius: radiusSize(earthquakeData.properties.mag),
                color: circleColor(earthquakeData.geometry.coordinates[2]),
                fillOpacity: 1
            });
        },
        onEachFeature: onEachFeature
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map
    var grayscalemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    
    // Create map
     L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 4,
        layers: [grayscalemap, earthquakes]
    });

}