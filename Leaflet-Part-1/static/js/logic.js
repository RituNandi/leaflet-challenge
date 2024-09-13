// Define the GeoJSON URL

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch the GeoJSON data with d3
d3.json(url).then(function(data) {
createFeatures(data.features);
});

function createFeatures(earthquakeData) {

function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}</h3><hr><p>${feature.properties.place}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
}

function pointToLayer(feature, latlng) {
    let depth = feature.geometry.coordinates[2];
    let magnitude = feature.properties.mag;

    // Style the circle marker
    let color = "";
    if (depth > 90) color = "#FF0D0D";
    else if (depth > 70) color = "#FF4E11";
    else if (depth > 50) color = "#FDB72A";
    else if (depth > 30) color = "#F7DB11";
    else if (depth > 10) color = "#DCF400";
    else color = "#A3F600";

    let radius = magnitude * 4;

    return L.circleMarker(latlng, {
    radius: radius,
    fillColor: color,
    color: "#000",
    weight: 0.5,
    opacity: 1,
    fillOpacity: 0.8
    });
}

// Create the GeoJSON layer
let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: pointToLayer,
    onEachFeature: onEachFeature
});

// Send the earthquakes layer to the createMap function
createMap(earthquakes);
}
function createMap(earthquakes) {
// Define streetmap and darkmap layers
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let darkmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Define a baseMaps object to hold our base layers
let baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
};

// Create an overlay object to hold our overlay
let overlayMaps = {
    Earthquakes: earthquakes
};

// Create the map
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, earthquakes]
});

// Create a layer control
// Pass in our baseMaps and overlayMaps
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// Create a legend
let legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let grades = [-10, 10, 30, 50, 70, 90];
    let colors = ["#A3F600", "#DCF400", "#F7DB11", "#FDB72A", "#FF4E11", "#FF0D0D"];

    // Loop through depth intervals and generate a label with a colored square for each interval
    for (let i = 0; i < grades.length; i++) {
    div.innerHTML +=
        '<i style="background:' + colors[i] + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(myMap);
}
