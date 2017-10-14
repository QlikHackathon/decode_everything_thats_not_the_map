var app

function setupMapHyperCube() {
  var hyperCubeDef = {
    qDimensions: [
      { qDef: { qFieldDefs: ["Ocean Basins"] } }
    ],
    qMeasures: [
      { qDef: { qDef: "=Count(Title)" } }
    ],
    qInitialDataFetch: [{
      qTop: 0,
      qLeft: 0,
      qHeight: 3333,
      qWidth: 3
    }]
  }

  app.createCube(hyperCubeDef, function (hypercube) {
    console.log("Hypercube", hypercube.qHyperCube)

    const dataMatrix = hypercube.qHyperCube.qDataPages[0].qMatrix;
    const maxCommitment = hypercube.qHyperCube.qMeasureInfo[0].qMax;

    reloadMap(dataMatrix);
  })
}