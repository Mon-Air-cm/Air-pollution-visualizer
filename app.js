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
          type: "picture-marker",
          url: "https://services9.arcgis.com/Rm2nGB5BTMeUprVI/arcgis/rest/services/SampleCSVFile_2kb/FeatureServer",//a url linking to the arcGIS hosting the data and the information
        },
        visualVariables: [
          {
            type: "size",
            field: "TOTAL_PPM",
            stops: [
            {
              value: 100,
              color: "F7F7F7",
              label: "100ppm or lower"
            },
            {
              value: 300, // features where > 30% of the pop in poverty
              color: "b35806", // will be assigned this color (purple)
              label: "300ppm or higher" // label to display in the legend
            },
          ]
        }],
      }
  console.log("monitorRenderer made")
  var trailheadsLabel = {
    symbol: {
      test: "text",
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
  console.log("trailheadsLabel made")
  var monitors = new FeatureLayer({
    url:"https://services9.arcgis.com/Rm2nGB5BTMeUprVI/arcgis/rest/services/SampleCSVFile_2kb/FeatureServer",
    outfields: ["TRL_NAME","LOCATION", "LON", "LAT", "BOX_LEVELS"],
    popupTemplate: popupMonitors,
    renderer: monitorRenderer,
    labelingInfo: [trailheadsLabel]
  })
  map.add(monitors)
  var monitorRenderer = {
    type: "simple",
    symbol: {
          color: "#BA55D3",
          type: "simple-line",
          style: "solid"
        },
    visualVariables: [
          {
            type: "size",
            field: "ELEV_GAIN",
            minDataValue: 0,
            maxDataValue: 2300,
            minSize: "3px",
            maxSize: "7px"
          }
        ],
  }
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
  view.ui.add(basemapGallery, "bottom-right");
});
