require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/BasemapToggle",
    "esri/widgets/BasemapGallery",
    "esri/layers/FeatureLayer"
  ], function(Map, MapView, BasemapToggle, BasemapGallery, FeatureLayer) {
  var map = new Map({
    basemap: "topo-vector"
  });
  var get = (url)=>{
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.withCredentials = true;
    Httpreq.open("GET",url,false);
    Httpreq.send();
    return Httpreq.responseText;
  }
  var json_obj = JSON.parse(get('http://localhost:5000/'));
  var view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-118.80500, 34.02700], // longitude, latitude
    zoom: 13
  });

  /*var basemapToggle = BasemapToggle({
    view: view,
    nextbaseMap: "satellite",
  })*/

  var basemapGallery = new BasemapGallery({ //toggles between the maps
    view: view,
    source: {
      portal:{
        url: "http://www.arcgis.com",
        useVectorBasemaps: true //huh? what does "Load vector tile basemaps"
      }
    }
  });
  var popupMonitors = {
        "title": "{LOCATION}",//"{LOCATION}",
        "content": "<b>Monitor #</b>{MONITOR_ID}<b> Long/lat:</b> {LON}{LAT}<br><b>NOx concentration:</b> {NOX_LEVELS}<br><b>SOx concentration:</b> {SOX_LEVELS}<br><b>Ozone concentration:</b> {OZONE_LEVELS}<br>"
      }//for some reason the trail name isn't quite working even though everything else does
  console.log("popupMonitors made")
  var monitorRenderer = { //individual node
        type: "simple",
        symbol: {
          type: "simple-marker",
        },
        visualVariables: [
          {
            type: "color",
            field: "NOX_LEVELS",
            stops: [
            {
              value: 4,
              color: "#F7F7F7",
              label: "100ppm or lower",
            },
            {
              value: 4.05,
              color: "#b35806",
              label: "300ppm or higher",
            },
          ]
        }],

      }
  console.log("monitorRenderer made")
  var monitorsLabel = {
    symbol: { //text labels
      type: "text",
      color: "#FFFFFF",
      haloColor: "5E8D74",
      haloSize: "2px",
    },
    font: {
            size: "12px",
            family: "Noto Sans",
            style: "italic",
            weight: "normal"
          },
    labelPlacement: "above-center",
    labelExpressionInfo: {
      expression: "$feature.LOCATION"
    }
  };
  for (var i = 0; i < json_obj["listOItems"].length; i++){
      url = json_obj["listOItems"][i].url
      console.log(url)
      var monitors = new FeatureLayer({
        url:url,
        outfields: ["LOCATION", "LON", "LAT"],
        popupTemplate: popupMonitors,
        renderer: monitorRenderer,
        labelingInfo: [monitorsLabel]
      })
      map.add(monitors)
  }
  console.log("trailheadsLabel made")
  var monitors = new FeatureLayer({
    url:"https://services9.arcgis.com/Rm2nGB5BTMeUprVI/arcgis/rest/services/time0/FeatureServer",
    outfields: ["TRL_NAME","LOCATION", "LON", "LAT", "BOX_LEVELS"],
    popupTemplate: popupMonitors,
    renderer: monitorRenderer,
    labelingInfo: [monitorsLabel]
  })
  map.add(monitors)
/*
  var trails = new FeatureLayer({
    url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
    renderer: monitorRenderer,
    opacity: 0.5,
  });
  map.add(trails, 0);
  var bikeTrailsRenderer = {
  type: "simple",
  symbol: {
    type: "simple-line",
    style: "short-dot",
    color: "#FF91FF",
    width: "6px",
    }
  };
  var bikeTrails = new FeatureLayer({
        url:
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
        renderer: bikeTrailsRenderer,
        definitionExpression: "USE_BIKE = 'YES'"
      });

      map.add(bikeTrails, 1);
  */
  view.ui.add(basemapGallery, "bottom-right");
});
