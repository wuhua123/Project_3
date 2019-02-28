// Plot the default route once the page loads
function init(){
  var defaultURL = "\eq_report";
  d3.json(`/${defaultURL}`, function(data){
    buildTable(data.year, data.country, data.mag, data.depth, data.latitude, data.longitude);
  });
}

/*d3.json(defaultURL, function(data){
  var data = [data];
  var layout = { margin: { t: 30, b: 100 } };
  Plotly.newPlot("map-id", data, layout);
});*/


function getData(route) {
    switch (route) {
    case "eq_report":    
      d3.json(`/${route}`, function(data){
        console.log(length(data.year));
        buildTable(data.year, data.country, data.mag, data.depth, data.latitude, data.longitude);
      });
      break;
        /*var year = data.year;
        var country = data.country;
        var mag = data.mag;
        var depth = data.depth;
        var latitude = data.latitude;
        var longitude = data.longitude;*/
        
      /*function buildTable(year, country, mag, depth, latitude, longitude) {
        var table = d3.select("#summary-table");
        var tbody = table.select("tbody");
        var trow;
        for (var i = 0; i < length(year); i++) {
          trow = tbody.append("tr");
          trow.append("td").text(year[i]);
          trow.append("td").text(country[i]);
          trow.append("td").text(mag[i]);
          trow.append("td").text(depth[i]);
          trow.append("td").text(latitude[i]);
          trow.append("td").text(longitude[i]);
      };*/
    case "country_chart":
      $('#map-id').empty();
      $('#table-id').empty();
      d3.json(`/${route}`,function(data){
        var data = [data];
        var layout = { margin: { t: 30, b: 100 } };
        Plotly.newPlot("map-id", data, layout);
      });
      break;
    case "distribution_map":
      $('#table-id').empty();
      var container = L.DomUtil.get('map-id');
      if(container != null){
        $( "#map-id" ).remove();
        var $newdiv1 = $( "<div id='map-id'></div>" ),
             newdiv2 = document.createElement( "div" ),
             existingdiv1 = document.getElementById( "marker-map-id" );
        $( "body" ).append( $newdiv1, [ newdiv2, existingdiv1 ] );
      };
      exist = $('#map-id').length;
      console.log(exist);
      d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(earthquakeData) {
        createFeatures(earthquakeData.features);
      });
      break;
    default:
      /*var eyeColor = ["Brown", "Brown", "Brown", "Brown", "Brown","Brown", "Brown", "Brown", "Green", "Green","Green",
        "Green", "Green", "Blue", "Blue", "Blue", "Blue", "Blue", "Blue"];
      var eyeFlicker = [26.8, 27.9, 23.7, 25, 26.3, 24.8, 25.7, 24.5, 26.4, 24.2, 28, 26.9, 
        29.1, 25.7, 27.2, 29.9, 28.5, 29.4, 28.3];

      // Create the Trace
      var trace1 = {
          x: eyeColor,
          y: eyeFlicker,
          type: "bar"
      };

       // Create the data array for the plot
      var data = [trace1];

       // Define the plot layout
      var layout = {
          title: "Eye Color vs Flicker",
          xaxis: { title: "Eye Color" },
          yaxis: { title: "Flicker Frequency" }
      };

      // Plot the chart to a div tag with id "bar-plot"
      //$('#plot-id').html('');
      Plotly.newPlot("plot-id", data, layout);*/
      console.log("Display Empty Page");
      break;
    };
};


//build table from last 100 years database records
function buildTable(year, country, mag, depth, latitude, longitude) {
  var table = d3.select("#summary-table");
  var tbody = table.select("tbody");
  var trow;
  for (var i = 0; i < length(year); i++) {
    trow = tbody.append("tr");
    trow.append("td").text(year[i]);
    trow.append("td").text(country[i]);
    trow.append("td").text(mag[i]);
    trow.append("td").text(depth[i]);
    trow.append("td").text(latitude[i]);
    trow.append("td").text(longitude[i]);
  };
};

function markerSize(magnitude) {
  return magnitude * 30000;
};

// Function to assign color depends on the Magnitude
function getColor(m) {

  var colors = ['lightgreen','yellowgreen','gold','orange','lightsalmon','tomato'];

  return  m > 5? colors[5]:
          m > 4? colors[4]:
          m > 3? colors[3]:
          m > 2? colors[2]:
          m > 1? colors[1]:
                 colors[0];
};

function createFeatures(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData,{
    // Give each feature a popup describing with information pertinent to it
    onEachFeature: function(feature, layer){
      layer.bindPopup("<h3 > Magnitude: "+ feature.properties.mag + 
      "</h3><h3>Location: " + feature.properties.place +
      "</h3><hr><h3>" + new Date(feature.properties.time) + "</h3>" );
    },

    pointToLayer: function(feature, latlng){
      return new L.circle(latlng,
      { radius: markerSize(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        fillOpacity: .8,
        color: 'grey',
        weight: .5
      })
    }    
  });

  createMap(earthquakes);
};  
  
function createMap(earthquakes) {

  // Define lightmap, outdoorsmap, and satelliemap layers
  let mapboxUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';
  let accessToken = 'pk.eyJ1IjoiY2FwMDE1NzAwIiwiYSI6ImNqZng1ZjBhbjQxMWozM21kZzkzNW1kdjAifQ.VdaKJu8FPaDob9yWS4kTSw';
  let lightmap = L.tileLayer(mapboxUrl, {id: 'mapbox.light', maxZoom: 20, accessToken: accessToken});
  let outdoorsmap = L.tileLayer(mapboxUrl, {id: 'mapbox.run-bike-hike', maxZoom: 20, accessToken: accessToken});
  let satellitemap = L.tileLayer(mapboxUrl, {id: 'mapbox.streets-satellite', maxZoom: 20, accessToken: accessToken});

  
  var tectonicPlates = new L.LayerGroup();
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json", function (plateData) {
    L.geoJSON(plateData,
      {
        color: 'orange',
        weight: 2
      })
      .addTo(tectonicPlates);
  });    

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Grayscle": lightmap,
    "Outdoors": outdoorsmap,
    "Satellite Map" : satellitemap
  };
  
  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic Plates": tectonicPlates
  };

    // Create our map, giving it the lightmap and earthquakes layers to display on load
  var myMap = L.map("map-id", {
    center: [39.8283, -98.5795],
    zoom: 3,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  
  // Create a legend to display information in the bottom right
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function(map) {

    var div = L.DomUtil.create('div','info legend'),
        magnitudes = [0,1,2,3,4,5],
        labels = [];

    div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>" 
    // loop through our density intervals and generate a label for each interval
    for (var i=0; i < magnitudes.length; i++){
      div.innerHTML +=
        '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' +
        magnitudes[i] + (magnitudes[i+1]?'&ndash;' + magnitudes[i+1] +'<br>': '+');
      }
      return div;
  };
  legend.addTo(myMap);
}

init();