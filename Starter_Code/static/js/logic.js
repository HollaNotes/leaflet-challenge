
// BRING IN GEOJSON ----------------------------------------------------------------
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url).then(function (data) {
  console.log(data.features);
  createFeatures(data.features);
});

// CREATE MAP -------------------------------------------------------------------
function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [40, -100],
    zoom: 4.75,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}


// ADDING IN LAYERS ----------------------------------------------------------------
function createFeatures(earthquakeData) {



  // onEachFeature  
  function onEachFeature(feature, layer) {
    // Set Variables
    let magnitude = feature.properties.mag;
    let place = feature.properties.place;
    let depth = feature.geometry.coordinates[2];
    let lat = feature.geometry.coordinates[0];
    let lon = feature.geometry.coordinates[1];
    let marker = L.marker([lat, lon]);
    // Set Pop Up Binding
    layer.bindPopup(`<h3>Place: ${place} </br> Depth: ${depth} </br> Magnitude: ${magnitude}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

  // L.circle for markers 
  function createCircleMarker(feature, latlng) {
    let options = {
    }
    return L.circleMarker(latlng, options);
  }
  // GeoJSON layer - features array -  earthquakeData object 
  // onEachFeature - once for each piece of data in the array.

  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);


}

// STYLIZE -----------------------------------------------------------------------
// Color
function chooseColor(mag) {

}

// LEGEND --------------------------------------------------------------------------
let legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
  // Set up variables


  div.innerHTML = legendInfo

  // go through each magnitude item to label and color the legend
  // push to labels array as list item

}



// HANDLER EVENTS ??

// ================================================================================
// MISC
//
//



//  ----------------------------- LEGEND STUFF?? -------------------------------
// Update the legend's innerHTML with the last updated time and station count.
// function updateLegend(time, stationCount) {
//     document.querySelector(".legend").innerHTML = [
//       "<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
//       "<p class='out-of-order'>Out of Order Stations: " + stationCount.OUT_OF_ORDER + "</p>",
//       "<p class='coming-soon'>Stations Coming Soon: " + stationCount.COMING_SOON + "</p>",
//       "<p class='empty'>Empty Stations: " + stationCount.EMPTY + "</p>",
//       "<p class='low'>Low Stations: " + stationCount.LOW + "</p>",
//       "<p class='healthy'>Healthy Stations: " + stationCount.NORMAL + "</p>"
//     ].join("");

