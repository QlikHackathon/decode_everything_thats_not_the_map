var minZoom = 1.8;
var maxZoom = 7;
var geoJson;

var mymap = L.map('mapid').setView([37.8, -96], minZoom);
mymap.options.minZoom = minZoom;
/*mymap.on('dragend', function(e) {
    if(geoJson != null)
        mymap.fitBounds(geoJson.getBounds());
});*/

$.getJSON("/resources/map.json", function(counrtyGeoJson){
  
  geoJson = L.geoJson(counrtyGeoJson, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(mymap)
  mymap.setMaxBounds(geoJson.getBounds());
  
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 7,
    id: 'mapbox.light',
    noWrap: true,
    continuousWorld: true,
    bounds: geoJson.getBounds(),
    maxBoundsViscosity: 1.0 //How much force you experience when going out of bounds
  }).addTo(mymap);
  
})

// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function (props) {
  console.log(props)
  this._div.innerHTML = '<h4>Commitments Count</h4>' + (props ?
    '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
    : 'Hover over a ocean basin');
};

info.addTo(mymap);

function getColor(d) {
  return d > 1000 ? '#800026' :
         d > 500  ? '#BD0026' :
         d > 200  ? '#E31A1C' :
         d > 100  ? '#FC4E2A' :
         d > 50   ? '#FD8D3C' :
         d > 20   ? '#FEB24C' :
         d > 10   ? '#FED976' :
                    '#FFEDA0';
}
function style(feature) {
  return {
    fillColor: "rgba(0,0,0,0)",
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: oceanCLicked
  });
}

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: '#666',
      fill: e.target.options.fill,
      fillColor: e.target.options.fillColor
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }

    info.update(layer.feature.properties);
  }


  function resetHighlight(e) {
    e.target.setStyle({
        weight: 2,
        color: "white",
        dashArray: '3',
        fill: e.target.options.fill,
        fillColor: e.target.options.fillColor
    });
    

    info.update();
  }

  function oceanCLicked(e) {
    //map.fitBounds(e.target.getBounds());
    console.log("Target is: " + e.target);
    
    let clickedOcean = e.target.feature.properties.NAME;
    if(e.target.isClicked == null) {
    e.target.isClicked = true;
    } else {
    e.target.isClicked = !e.target.isClicked;
    }
    
    if(e.target.isClicked) {
    e.target.setStyle({ fillColor: '#FF0000', fill: true});
    } else {
    e.target.setStyle({ fillColor: 'rgba(0,0,0,0)', fill: true});
    }    
  }

