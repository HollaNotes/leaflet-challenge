// TO DO: GO TO: LINE 41 TO FIX LEGEND
// BRING IN DATA ----------------------------------------------------------------
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url).then(function (data) {
  console.log(data.features);
  createFeatures(data.features);
});

function markerSize(magnitude) {
  return Math.sqrt(magnitude) * 10; // Does it need to be 50??
}

// Function to determine marker color by depth
function chooseColor(depth) {
  if (depth < 10) return "#ADF436";
  else if (depth < 30) return "#E0F436";
  else if (depth < 50) return "#F4E736";
  else if (depth < 70) return "#F4BD36";
  else if (depth < 90) return "#F48236";
  else return "#f44336";
}


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
    layers: [street, earthquakes]
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
        '<i style="background:' + chooseColor(depth + 1) + '"></i> ' +
        depth + (nextDepth ? '&ndash;' + nextDepth + '<br>' : '+');
    }
    return div;
  };


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
    for (let i = 0; i < feature.length; i++) {
      console.log("hi");
    }

    
    // Set Pop Up Binding
    layer.bindPopup(`<h3>General Location of Earthquake: ${place} </br> Depth: ${depth} </br> Magnitude: ${magnitude}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

  function createCircleMarker(feature, latlng) {
    let options = {
      radius: markerSize(feature.properties.mag),
      fillColor: chooseColor(feature.geometry.coordinates[2]),
      fillOpacity: 0.5,
      color: "black",
      stroke: true,
      weight: 1
    }
    return L.circleMarker(latlng, options);
  }
  // GeoJSON layer - [features] array -  {earthquakeData} object 
  // onEachFeature -s once for each piece of data in the array.
  // 
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
  });
  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);

  // L.circle for markers 

}


