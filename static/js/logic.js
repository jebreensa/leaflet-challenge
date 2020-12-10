// **Get your data set**
var query_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, create a geoJSON layer containing the features array and add a popup for each marker
    // then, send the layer to the createMap() function.
    var earthquakes = L.geoJSON(data.features, {
      onEachFeature : addPopup
    });
  
    createMap(earthquakes);
  });
  
  // Define streetmap and darkmap layers
 var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

 // Define a baseMaps object to hold our base layers
 var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

     features.forEach(function (data) {
        
        var geometry = data.geometry;
      
        var properties = data.properties;

        var magnitude = properties.mag
        var depth = geometry.coordinates[2];

        //creating circle marker
        var myCircle = L.circle([geometry.coordinates[1], geometry.coordinates[0]], {
            radius: magnitude * 20000,
            color: 'Green',
            fillColor: getColor(geometry.coordinates[2]),
            fillOpacity: .75,
            weight: 1
        }).bindPopup(`<h3>${properties.title}</h3><hr>
        <p>Magnitude:${magnitude}<br>
        Depth:${depth}</p>`).addTo(myMap);

    });


    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (myMap) {

        var div= L.DomUtil.create('depth', 'info legend'),
            depthArray = [-20, 20, 40, 60, 80, 100],
            labels = [];

    function getColor(depth) {
    return depth > 100 ? '#310645' :
    depth > 80 ? '#ca9bdf' :
    depth > 60 ? '#8c12c4' :
    depth > 40 ? '#f0de33' :
    depth > 20 ? '#a1f64c' :
    '#dcfcbc';

}

       for (var i = 0; i < depthArray.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depthArray[i] + 1) + '  "></i> ' + '&nbsp&nbsp&nbsp' +
                depthArray[i] + (depthArray[i + 1] ? '&ndash;' + depthArray[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap) 