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

  var trailsLayer = new FeatureLayer({
        url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0"
      });

  var parksLayer = new FeatureLayer({
          url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0"
        });
  map.add(trailsLayer, 0);
  map.add(parksLayer, 0);
  var monitorRenderer = { //individual node
        type: "simple",
        symbol: {
          type: "picture-marker",
          url: "something something url",//a url linking to the arcGIS hosting the data and the information
          width: "18px",
          height: "18px",
        }
      }
  var trailheadsLabel = {
    symbole: {
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
      expression: "$feature.TRL_NAME"
    }
  };
  var monitors = new FeatureLayer({
    url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
    renderer: monitorRenderer,
    labelingInfo: [trailheadsLabel]
  })
  map.add(trailheads);
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
    renderer: trailsRenderer,
    opacity: 0.5,
  });
  map.add(trails, 0);
  var bikeTrailsRenderer = {
  type: "simple",
  symbol: {
    type: "simple-line",
    style: "short-dot",
    color: "#FF91FF",
    width: "6px"
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
