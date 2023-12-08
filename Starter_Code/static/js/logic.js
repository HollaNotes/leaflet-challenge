// Bring in data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url).then(function (data) {
  console.log(data.features);
  createFeatures(data.features);
});

// Create function for marker size
function markerSize(magnitude) {
  return Math.sqrt(magnitude) * 10; 
}

// Create function to determine marker color by depth
function chooseColor(depth) {
  if (depth < 10) {
    return "#ADF436";
  }
  else if (depth < 30) {
    return "#E0F436";
  }
  else if (depth < 50) {
    return "#F4E736";
  }
  else if (depth < 70) {
    return "#F4BD36";
  }
  else if (depth < 90) {
    return "#F48236";
  }
  else {
    return "#f44336";
  }
}


// Create map and layers
function createMap(earthquakes) {  
  // Create the base layer
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  // Create a baseMaps object
  let baseMaps = {
    "Street Map": street,
  };

  // Create an overlay object 
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [40, -100],
    zoom: 4.75,
    layers: [street, earthquakes]
  });
  
  // Create a layer control.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  
  // Add legend
  /*- https://gis.stackexchange.com/questions/193161/add-legend-to-leaflet-map
    - The solution for creating legends with colored boxes in Leaflet 
    was based on guidance provided by an AI language model from OpenAI, 
    which suggested customizing HTML elements within the legend control in 
    Leaflet using inline styles.*/

  let legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend');
    let depths = [-10, 10, 30, 50, 70, 90];
    let labels = [];

    // Loop through depth ranges and create labels
    for (let i = 0; i < depths.length; i++) {
      let depth = depths[i];
      let nextDepth = depths[i + 1];

      // Create labels for legend
      div.innerHTML +=
        '<i style="background:' + chooseColor(depth + 1) + '"></i> ' +
        depth + (nextDepth ? '&ndash;' + nextDepth + '<br>' : '+');
    }
    
    // Add style for legend
    div.style.backgroundColor = 'white'; // Set background color
    div.style.padding = '10px'; // Add padding
    div.style.border = '2px solid #ccc'; // Add border
    // Add more styles as needed

        // Style for the colored boxes
    div.querySelectorAll('i').forEach((box) => {
      box.style.width = '20px'; // Set width
      box.style.height = '20px'; // Set height
      box.style.display = 'inline-block'; // Display as inline block
      box.style.marginRight = '5px'; // Add some margin between box and text
      // Additional styles for the colored boxes
    });

    // Style for the labels
    div.querySelectorAll('span').forEach((label) => {
      label.style.verticalAlign = 'middle'; // Align labels vertically
      // Additional styles for the labels
    });


    return div;
  };

  legend.addTo(myMap); // Add legend to the map


}

// Create features function
function createFeatures(earthquakeData) {  
  // Marker and bindPopup onEachFeature  
  function onEachFeature(feature, layer) {
    // Set Variables and Arrays    
    let magnitude = feature.properties.mag; // controls size of marker
    let place = feature.properties.place;
    let depth = feature.geometry.coordinates[2]; // controls color (higher depth indicates darker color)

    // Set Pop Up Binding
    layer.bindPopup(`<h3>General Location of Earthquake: ${place} </br> Depth: ${depth} </br> Magnitude: ${magnitude}</h3>`);
  }

  // Create style for markers
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
  // GeoJSON layer - {earthquakeData} object 
  // onEachFeature -s once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
  });
  // Send earthquakes layer to the createMap function
  createMap(earthquakes);
}


