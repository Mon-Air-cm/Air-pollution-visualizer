require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/BasemapToggle",
    "esri/widgets/BasemapGallery",
    "esri/widgets/LayerList",
    "esri/layers/FeatureLayer",
  ], function(Map, MapView, BasemapToggle, BasemapGallery, LayerList, FeatureLayer, MergeLayers) {
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
    center: [ -73.993, 40.73], // longitude, latitude
    zoom: 13
  });
/*
  var layerList = new LayerList({
  view: view
});
view.ui.add(layerList, {
  position: "top-left"
});*/

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
        "content": "<b>Monitor #</b>{MONITOR_ID}<b> Long/lat:</b> {LON}, {LAT}<br><b>NOx concentration:</b> {NOX_LEVELS}<br><b>SOx concentration:</b> {SOX_LEVELS}<br><b>Ozone concentration:</b> {OZONE_LEVELS}<br>"
      }//for some reason the trail name isn't quite working even though everything else does
  console.log("popupMonitors made")
  var no2Renderer = { //individual node
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
                     value: 3000,
                     color: "#e6b451",
                     label: "100ppm or lower",
                   },
                   {
                     value: 15000,
                     color: "#462525",
                     label: "300ppm or higher",
                   },
                 ]
               },{
               type: "size",
                 field: "NOX_LEVELS",
                 stops: [
                   { value: 3000, size: 1, label: "<15%" },
                   { value: 16000, size: 28, label: ">35%" }
                 ]},{
                    type: "opacity",
                      field: "NOX_LEVELS",
                      stops: [
                          { value: 3000, opacity: 0.3, label: "<15%" },
                          { value: 20000, opacity: 0.5, label: ">35%" }
                      ]}
                 ],

             }
   var so2Renderer = { //individual node
                 type: "simple",
                 symbol: {
                   type: "simple-marker",
                 },
                 visualVariables: [
                   {
                     type: "color",
                     field: "SOX_LEVELS",
                     stops: [
                     {
                       value: 3000,
                       color: "#f8ff38",
                       label: "100ppm or lower",
                     },
                     {
                       value: 15000,
                       color: "#a5a800",
                       label: "300ppm or higher",
                     },
                   ]
                 },{
                 type: "size",
                   field: "SOX_LEVELS",
                   stops: [
                     { value: 3000, size: 1, label: "<15%" },
                     { value: 16000, size: 28, label: ">35%" }
                   ]},{
                      type: "opacity",
                        field: "SOX_LEVELS",
                        stops: [
                          { value: 3000, opacity: 0.3, label: "<15%" },
                          { value: 20000, opacity: 0.5, label: ">35%" }
                        ]}
                   ],

               }
   var ozRenderer = { //individual node
                 type: "simple",
                 symbol: {
                   type: "simple-marker",
                 },
                 visualVariables: [
                   {
                     type: "color",
                     field: "OZONE_LEVELS",
                     stops: [
                     {
                       value: 3000,
                       color: "#51b9e6",
                       label: "100ppm or lower",
                     },
                     {
                       value: 15000,
                       color: "#100d5e",
                       label: "300ppm or higher",
                     },
                   ]
                 },{
                 type: "size",
                   field: "OZONE_LEVELS",
                   stops: [
                     { value: 3000, size: 1, label: "<15%" },
                     { value: 16000, size: 28, label: ">35%" }
                   ]},{
                      type: "opacity",
                        field: "OZONE_LEVELS",
                        stops: [
                          { value: 3000, opacity: 0.3, label: "<15%" },
                          { value: 20000, opacity: 0.5, label: ">35%" }
                        ]}
                   ],
/*sdfs*/
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

  function fadeVisibilityOn(layer) {
      let animating = true;
      let opacity = 0.0001;
      // fade layer's opacity from 0 to
      // whichever value the user has configured
      const finalOpacity = layer.opacity;
      // Start the animation by setting the layer's opacity to 0.
      layer.opacity = opacity;
      view.whenLayerView(layer).then(function(layerView){
        // Wait for tiles to finish loading before beginning the fade-in
        // transition. The layer view's 'updating' property is true when
        // data is being downloaded and tiles are drawing in the view
        // Waiting for this property to be false makes the fade-in transition
        // smoother (you don't see tiles) though it forces the user to wait
        // a little longer for the transition to start
        watchUtils.whenFalseOnce(layerView, "updating", function(updating){
          requestAnimationFrame(incrementOpacityByFrame);
    });

    // This function will fire on every frame before the browser repaints.
    function incrementOpacityByFrame() {
      // Stop the animation if the opacity has reached the same value
      // as the pre-defined finalOpacity
      if((opacity >= finalOpacity) && animating){
        animating = false;
        return;
      }

      // Increment the opacity and set the new value on the layer
      opacity += 0.05;
      layer.opacity = opacity;

      // Continue the animation at the next frame
      requestAnimationFrame(incrementOpacityByFrame);
    }
  });
}
  for (var i = 0; i < json_obj["listOItems"].length; i++){
      url = json_obj["listOItems"][i].url
      console.log(url)
      var monitorsNO2 = new FeatureLayer({
        url:url,
        outfields: ["LOCATION", "LON", "LAT"],
        renderer: no2Renderer,
      })
        var monitorsSO2 = new FeatureLayer({
              url:url,
              outfields: ["LOCATION", "LON", "LAT"],
              renderer: so2Renderer,
            })
        var monitorsOZ = new FeatureLayer({
                url:url,
                outfields: ["LOCATION", "LON", "LAT"],
                popupTemplate: popupMonitors,
                renderer: ozRenderer,
        });
      map.addMany([monitorsNO2,monitorsSO2,monitorsOZ])
  }
  console.log("trailheadsLabel made")
/*
  var monitors = new FeatureLayer({
    url:"https://services9.arcgis.com/Rm2nGB5BTMeUprVI/arcgis/rest/services/time0/FeatureServer",
    outfields: ["TRL_NAME","LOCATION", "LON", "LAT", "BOX_LEVELS"],
    popupTemplate: popupMonitors,
    renderer: monitorRenderer,
    labelingInfo: [monitorsLabel]
  })
  layerList.operationalItems.forEach(function(item){
  item.watch("visible", function(visible){
    console.log("visible")
    if(visible){
      fadeVisibilityOn(item.layer);
    }
  });
});*/
  var toggleVisibility = (onLayer, offLayer) =>{
    onLayer.visible = true;
    offLayer.visible = false;
  }



  //map.add(monitors)
  view.ui.add(basemapGallery, "bottom-right");
  map.layers.items.map((obj) => {
    obj.visible = false;
  })
  i = 1
  window.setInterval(function(){
    var maxlen = json_obj["listOItems"].length;
    var mapLayers = map.layers.items;
    var delArr = [i, i+1, i+2,];
    var addArr = [i+3, i+4, i+5,];
    addArr = addArr.map((j)=>{
      return j%maxlen
    })
    delArr = delArr.map((j)=>{
      return j%maxlen
    })
    for (var k = 0; k < 3; k++){ //each k is the pollutant
      toggleVisibility(mapLayers[addArr[k]], mapLayers[delArr[k]])
    };
    i+= 3;
    if (i>300){
      console.log(i)
      clearInterval();
    }
  }, 1000);
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
});
