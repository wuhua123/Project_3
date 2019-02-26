// Plot the default route once the page loads
var defaultURL = "/country_chart";
d3.json(defaultURL, function(data){
  var data = [data];
  var layout = { margin: { t: 30, b: 100 } };
  Plotly.newPlot("map-id", data, layout);
});


function getData(route) {
    switch (route) {
    case "country_chart":
      $('#map-id').empty();
      d3.json(`/${route}`,function(data){
        var data = [data];
        var layout = { margin: { t: 30, b: 100 } };
        Plotly.newPlot("map-id", data, layout);
      });
      break;
    case "distribution_map":
      console.log("asking for map");
      break;
    }
  }