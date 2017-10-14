var minZoom = 1.2;
var maxZoom = 7;
var geoJson;

var mymap = L.map('mapid').setView([37.8, -96], minZoom);
mymap.options.minZoom = minZoom;
/*mymap.on('dragend', function(e) {
    if(geoJson != null)
        mymap.fitBounds(geoJson.getBounds());
});*/

var oceanElements = [];

Promise.all([
  $.getJSON("/resources/map.json"),
  $.getJSON("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"),
]).then(([oceanGeoJson, worldGeoJson]) => {
  oceanGeoJson = L.geoJson(oceanGeoJson, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(mymap)
  mymap.setMaxBounds(oceanGeoJson.getBounds());

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: maxZoom,
    id: 'mapbox.light',
    noWrap: true,
    continuousWorld: true,
    bounds: oceanGeoJson.getBounds(),
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
  oceanElements.push(layer);
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
    let clickedOcean = e.target.feature.properties.NAME;
    console.log(clickedOcean);
    app.field("Ocean Basins").selectValues([clickedOcean], true, false)
    // if(e.target.isClicked == null) {
    //   e.target.isClicked = true;
    // } else {
    //   e.target.isClicked = !e.target.isClicked;
    // }
    //
    // if(e.target.isClicked) {
    //   e.target.setStyle({ fillColor: '#FF0000', fill: true});
    // } else {
    //   e.target.setStyle({ fillColor: 'rgba(0,0,0,0)', fill: true});
    // }
  }

  function reloadMap(oceans) {
    oceanElements.forEach(function(oceanElement) {
      if (isInCube(oceans, oceanElement.feature.properties.NAME)) {
        oceanElement.setStyle({ fillColor: '#FF0000', fill: true});
      } else {
        oceanElement.setStyle({ fillColor: 'rgba(0,0,0,0)', fill: true});
      }
    });
  }

  function isInCube(oceanCube, oceanName) {
    var found = false;
    oceanCube.forEach(function(ocean) {
      console.log(oceanName);
      console.log(ocean[0].qText);
      console.log(oceanName.toLowerCase() == ocean[0].qText.toLowerCase())
      if (oceanName.toLowerCase() == ocean[0].qText.toLowerCase()) {
        found = true
      }
    });
    return found;
  }
