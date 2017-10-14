// Input your config
var config = {
  host: 'playground.qlik.com',
  prefix: '/showcase/',
  port: '443',
  isSecure: true,
  rejectUnauthorized: false,
  appname: '0b0fc6d5-05ce-44d7-95aa-80d0680b3559'
}

function main() {
  require.config({
    baseUrl: (config.isSecure ? 'https://' : 'http://') + config.host + (config.port ? ':' + config.port : '') + config.prefix + 'resources'
  })

  /**
   * Load the entry point for the Capabilities API family
   * See full documention: http://help.qlik.com/en-US/sense-developer/Subsystems/APIs/Content/MashupAPI/qlik-interface-interface.htm
   */
  require(['js/qlik'], function (qlik) {
    // We're now connected

    // Suppress Qlik error dialogs and handle errors how you like.
    qlik.setOnError(function (error) {
      console.log("ERROR", error)
    })

    // Open a dataset on the server
    app = qlik.openApp(config.appname, config)
    let field = app.field("Goal ID")
    field.selectValues(["Goal 14"], false, true)
    field.lock()
    setupCountriesHyperCube();
    setupOceansHyperCube();
    createLeadEntityTypePieChart()
    createOceanBasinsPieChart()
    createLeadEntityPieChart()
    createTargetsPieChart()

    getEntityTypes()
    getEntity()
    createGoalsAndSDGTargets()
    createCommitmentList()
    console.log(app.selectionState())
  })
}

function createLeadEntityTypePieChart() {
  var listCols = [
    {
      qDef: { qFieldDefs: ['Lead entity type'] }
    },
    '=Count(distinct [Lead entity])'
  ]

  app.visualization.create('treemap', listCols, { title: 'Lead Entity Type Pie Chart' }).then(function (piechart) {
    piechart.show('lead-entity-type-pie-chart')
  })
}

function createLeadEntityPieChart() {
  var listCols = [
    {
      qDef: { qFieldDefs: ['Lead entity'] }
    },
    '=Count([OceanActionID])'
  ]

  app.visualization.create('treemap', listCols, { title: 'Lead Entity Pie Chart' }).then(function (piechart) {
    piechart.show('lead-entity-pie-chart')
  })
}
function createTargetsPieChart() {
  var listCols = [
    {
      qDef: {qFieldDefs: ['SDG Target']}
    },
    '=Count([OceanActionID])'
  ]
  app.visualization.create('treemap', listCols, {title: 'Targets Pie Charts'}).then(function (piechart) {
    piechart.show('targets-pie-chart')
  })
}

function createOceanBasinsPieChart() {
  var listCols = [
    {
      qDef: { qFieldDefs: ['Ocean Basins'] }
    },
    '=Count([OceanActionID])'
  ]

  app.visualization.create('treemap', listCols, {title: 'Ocean Basins Pie Chart'}).then(function (piechart) {
    piechart.show('ocean-basins-pie-chart')
  })
}

function createGoalsAndSDGTargets() {
  var hyperCubeDef = {
    qDimensions: [
      {
        qDef: {
          qFieldDefs: ['SDG Target'],
        }
      },
      {
        qDef: {
          qFieldDefs:['Target Icon']
        }
      }
    ],
    qMeasures: [
      {
        qDef: { qDef: '=Count([OceanActionID])' },
        qSortBy: { qSortByNumeric: -1 }
      },

   ],
    qInterColumnSortOrder : [2, 0 ,1],
    qInitialDataFetch: [
      {
        qTop: 0,
        qLeft: 0,
        qHeight: 3333,
        qWidth: 3
      }
    ]
  }
  app
    .createCube(hyperCubeDef, hypercube => {
      console.log('Basic Hypercube', hypercube.qHyperCube)
      let matrix = hypercube.qHyperCube.qDataPages[0].qMatrix
      var targets = document.getElementById("targets")
      targets.innerHTML=""
      console.log(matrix)
      matrix.forEach((row, index) => {
        var percentage = row[2].qNum / hypercube.qHyperCube.qGrandTotalRow[0].qNum;
        percentage = Math.round(percentage * 100);
        $(`#targets`).append(`<div class="kpiElements" id="target${index}"></div>`);
        $(`#target${index}`).append(`<h1>${row[0].qText}</h1>`);
        console.log(row[1].qText)
        $(`#target${index}`).append(`<img src="./resources/icons/${row[1].qText}.svg"></img>`);
        $(`#target${index}`).append(`<h3>${row[2].qText}</h3>`);
        $(`#target${index}`).append(`<h3>${percentage}%</h3>`);

      })
    })
}

function createGoalCountKpi (target) {
  var listCols = ["=Count({<[SDG Target]={'"+target+"'}>}OceanActionID)"]
  app.visualization.create('kpi', listCols, {
    title: target + ' Commitments',
    showTitles: true,
    showMeasureTitle: false
  }).then(function (kpi) {
    kpi.show('goals-count-kpi-' + target)
  })
}

function clearState(state) {
  state = state || '$'
  app.clearAll(false, state)
  //except for Goal 14
  app.field("Goal ID").selectValues(["Goal 14"], false, false)
}

function getEntityTypes() {
  var myField = app.field("Lead entity type")
  var listener = function() {
    var select = document.getElementById('entityTypeSelection')
    var val = select.value
    select.innerHTML = ""
    select.appendChild(createOption('', '--Select--'))
    myField.rows.forEach(function (row) {
      select.appendChild(createOption(row.qText))
    })
    select.value = val
    //myField.OnData.unbind(listener)
  }
  myField.OnData.bind(listener)
  myField.getData()
}

function getEntity() {
  var myField = app.field("Lead entity")
  var listener = function() {
    var select = document.getElementById('entitySelection')
    var val = select.value
    select.innerHTML=""
    select.appendChild(createOption('', '--Select--'))
    myField.rows.forEach(function (row) {
      select.appendChild(createOption(row.qText))
    })
    select.value = val
    //myField.OnData.unbind(listener)
  }
  myField.OnData.bind(listener)
  myField.getData()
}

function createOption(value, text) {
  var option = document.createElement('option')
  var name = document.createTextNode(text || value)
  option.setAttribute('value', value)
  option.appendChild(name)
  return option
}

function selectEntityTypes() {
  var select = document.getElementById('entityTypeSelection')
  if (select.value !== '') {
    app.field("Lead entity type").selectValues([select.value], false, true)
  }
}

function selectEntity() {
  var select = document.getElementById('entitySelection')
  if (select.value !== '') {
    app.field("Lead entity").selectValues([select.value], false, true)
  }
}

function createCommitmentList() {
  var hyperCubeDef = {
    qDimensions: [
      {
        qDef: {
          qFieldDefs: ['Title'],
          qSortCriterias: [{ qSortByAscii: 1 }]
        }
      },
      {
        qDef: {
          qFieldDefs: ['ActionID']
        }
      }
    ],
    qMeasures: [],
    qInitialDataFetch: [
      {
        qTop: 0,
        qLeft: 0,
        qHeight: 2000,
        qWidth: 2
      }
    ]
  }

  app.createCube(hyperCubeDef, hypercube => {
    let matrix = hypercube.qHyperCube.qDataPages[0].qMatrix
    matrix.forEach(row => {
      let anchor = $(
        `<a target='_blank' href='${row[0].qText}'>${row[0].qText}</a>`
      )
      let item = $(`<div class='list-group-item'></div>`)
      item.append(anchor)
      $('#commitmentList').append(item)
    })
  })
}
