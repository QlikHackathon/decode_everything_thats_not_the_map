var minZoom = 2;
var maxZoom = 7;
var oceanGeoJson;
var worldGeoJson;

var mymap = L.map('mapid', {
  zoomDelta: 0.5,
  zoomSnap: 0,
}).setView([30, 2], minZoom).zoomIn(0.5)
mymap.options.minZoom = minZoom;
/*mymap.on('dragend', function(e) {

});*/

var oceanElements = [];
var countriesElement = [];

Promise.all([
  $.getJSON("/resources/oceans.json"),
  $.getJSON("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"),
]).then(([oceanGeoJson, worldGeoJson]) => {
  oceanGeoJson = L.geoJson(oceanGeoJson, {
    style: oceanStyle,
    onEachFeature: onEachOceanFeature
  }).addTo(mymap)
  mymap.setMaxBounds(oceanGeoJson.getBounds());

  worldGeoJson = L.geoJson(worldGeoJson, {
    style: () => ({color: 'transparent'}),
    onEachFeature: (feature, layer) => {
      layer.on({
        //mouseover: highlightOceanFeature,
        //mouseout: resetOceanHighlight,
        click: () => {
          let clickedCountry = feature.properties.name;
          app.field("Country").selectValues([clickedCountry], true, false)
        },
      });
      countriesElement.push(layer);
    },
  }).addTo(mymap)

  /*L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: maxZoom,
    id: 'mapbox.light',
    noWrap: true,
    continuousWorld: true,
    bounds: oceanGeoJson.getBounds(),
    maxBoundsViscosity: 1.0 //How much force you experience when going out of bounds
  }).addTo(mymap);*/

  L.tileLayer('https://api.mapbox.com/styles/v1/seriousben/cj8qk0fysal2b2ss27kmivp75/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2VyaW91c2JlbiIsImEiOiJjajhxam9kdnEwa2c5MndxcHBtcjZiZGlxIn0.sPq1wEDyoXKrPW-9ZjUnMA', {
    //maxZoom: maxZoom,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    noWrap: true,
    continuousWorld: true,
    bounds: oceanGeoJson.getBounds(),
    maxBoundsViscosity: 1.0 //How much force you experience when going out of bounds
  }).addTo(mymap);
  mymap.panTo(new L.LatLng(0, 0));
});

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
function oceanStyle(feature) {
  return {
    fillColor: "rgba(0,0,0,0)",
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };
}

function onEachOceanFeature(feature, layer) {
  layer.on({
    mouseover: highlightOceanFeature,
    mouseout: resetOceanHighlight,
    click: oceanCLicked
  });
  oceanElements.push(layer);
}

  function highlightOceanFeature(e) {
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


  function resetOceanHighlight(e) {
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

  function reloadOceansLayer(hypercube) {
    oceanElements.forEach(function(oceanElement) {
      if (isFeatureInCube(hypercube, oceanElement.feature.properties.NAME)) {
        oceanElement.setStyle({ fillColor: '#0077BE', fill: true});
      } else {
        oceanElement.setStyle({ fillColor: 'rgba(0,0,0,0)', fill: true});
      }
    });
  }

function reloadCountriesLayer(hypercube) {
  countriesElement.forEach(function(countryElement) {
    if (isFeatureInCube(hypercube, countryElement.feature.properties.name)) {
      countryElement.setStyle({ color: 'green' });
    } else {
      countryElement.setStyle({ color: 'transparent' });
    }
  });
}

  function isFeatureInCube(hypercube, featureName) {
    return hypercube.find((data) => {
      return featureName.toLowerCase() == data[0].qText.toLowerCase();
    });
  }
