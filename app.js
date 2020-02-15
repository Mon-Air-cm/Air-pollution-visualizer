require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/BasemapToggle",
    "esri/widgets/BasemapGallery"
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
  var basemapGallery = new BasemapGallery({
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
  view.ui.add(basemapGallery, "bottom-right");
});
