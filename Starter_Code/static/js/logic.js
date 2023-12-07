// TO DO: GO TO: LINE 41 TO FIX LEGEND
// BRING IN DATA ----------------------------------------------------------------
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url).then(function (data) {
  console.log(data.features);
  createFeatures(data.features);
});


// CREATE MAP & LAYERS ----------------------------------------------------------------
function createMap(earthquakes) {
  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
  };
  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };
  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [40, -100],
    zoom: 4.75,
    layers: [
      street,
      earthquakes
    ]
  });
  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Add legend LINES 42-76: Need to fix and make the legend work correctly. Make adjustments
  let legend = L.control({
    position: 'bottomright'
  });

  legend.onAdd = function (map) {
    let div = L.DomUtil.create("div", "info legend"),
      depths = [-10, 10, 30, 50, 70, 90],
      labels = [];

    // Loop through depth ranges and create labels
    for (let i = 0; i < depths.length; i++) {
      let depth = depths[i];
      let nextDepth = depths[i + 1];

      // Create labels for legend
      div.innerHTML +=
        '<i style="background:' + getColor(depth + 1) + '"></i> ' +
        depth + (nextDepth ? '&ndash;' + nextDepth + '<br>' : '+');
    }
    return div;
  };

  // Setting color to match size of depth
  function getColor(depth) {
    return depth > 90 ? '#f44336' :
      depth > 70 ? '#F48236' :
        depth > 50 ? '#F4BD36' :
          depth > 30 ? '#F4E736' :
            depth > 10 ? '#E0F436' :
              '#ADF436';
  }

  legend.addTo(myMap); // Add legend to the map

}


function createFeatures(earthquakeData) {
  // Marker and bindPopup ---------- onEachFeature  
  function onEachFeature(feature, layer) {
    // Set Variables and Arrays    
    let magnitude = feature.properties.mag; // controls size of marker
    let place = feature.properties.place;
    let depth = feature.geometry.coordinates[2]; // controls color (higher depth indicates darker color)
    let lat = feature.geometry.coordinates[0];
    let lon = feature.geometry.coordinates[1];
    let marker = L.marker([lat, lon]);
    let depth_meters = [];
    let latlng_coords = [];
    let mag_size = []
    //Loop through data to get magnitude, depth, lat, lon
    for (let i = 0; i < feature.properties.place.length; i++) {
      console.log("hi");
    }

    
    // Set Pop Up Binding
    layer.bindPopup(`<h3>General Location of Earthquake: ${place} </br> Depth: ${depth} </br> Magnitude: ${magnitude}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

  function createCircleMarker(feature, latlng) {
    let options = {
      color: "red", // TEMP: eventually needs to reflect depth
      radius: 2, // TEMP: eventually needs to reflect magnitude      
    }
    return L.circleMarker(latlng, options);
  }
  // GeoJSON layer - [features] array -  {earthquakeData} object 
  // onEachFeature - once for each piece of data in the array.
  // 
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
  });
  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);

  // L.circle for markers 
  function markerSize(mag) {
    return Math.sqrt(mag) * 50; // Does it need to be 50??
  }
}


