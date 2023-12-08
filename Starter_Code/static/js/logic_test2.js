// Set up URL
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Set up geoJSON request
d3.json(url).then(function (data) {
  console.log(data);
  createFeatures(data.features);
});

// Function to determine marker size
function markerSize(magnitude) {
  return magnitude * 15000;
};

// Function to determine marker color by depth
function chooseColor(depth) {
  if (depth < 10) return "#ADF436";
  else if (depth < 30) return "#E0F436";
  else if (depth < 50) return "#F4E736";
  else if (depth < 70) return "#F4BD36";
  else if (depth < 90) return "#F48236";
  else return "#f44336";
}

function createFeatures(earthquakeData) {

  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}
        </p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

    // Point to layer used to alter markers
    pointToLayer: function (feature, latlng) {

      // Determine the style of markers based on properties
      let markers = {
        radius: markerSize(feature.properties.mag),
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.5,
        color: "black",
        stroke: true,
        weight: 1
      }
      return L.circle(latlng, markers);
    }
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })


  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
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

  // Create legend 
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function (myMap) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4 style='text-align: center'>Legend by Depth (km)</h4>";
    div.innerHTML += '<i style="background: #64B5F6"></i><span>10 km or less</span><br>';
    div.innerHTML += '<i style="background: #43A047"></i><span>30 km or less</span><br>';
    div.innerHTML += '<i style="background: #FFF176"></i><span>50 km or less</span><br>';
    div.innerHTML += '<i style="background: #FB8C00"></i><span>70 km or less</span><br>';
    div.innerHTML += '<i style="background: #FF3300"></i><span>90 km or less</span><br>';
    div.innerHTML += '<i style="background: #B71C1C"></i><span>More than 90 km</span><br>';
    return div;
  };

  legend.addTo(myMap);
}