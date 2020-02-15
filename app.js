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
  var basemapToggle = new BasemapToggle({
          view: view,
          nextBasemap: "satellite"
  });
  var basemapGallery = new BasemapGallery({
          view: view,
          source: {
            portal: {
              url: "https://www.arcgis.com",
              useVectorBasemaps: false  // Load vector tile basemaps
            }
          }
        });
   view.ui.add(basemapGallery, "top-right");
});
