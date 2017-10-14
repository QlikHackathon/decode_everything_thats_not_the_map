// Input your config
var config = {
  host: 'playground.qlik.com',
  prefix: '/showcase/',
  port: '443',
  isSecure: true,
  rejectUnauthorized: false,
  appname: '0b0fc6d5-05ce-44d7-95aa-80d0680b3559'
}

function main () {
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
    console.log('Connecting to appname: ' + config.appname)
    app = qlik.openApp(config.appname, config)
    console.log(app)
    let field = app.field("Goal ID")
    field.selectValues(["Goal 14"], false, true)
    field.lock()
    setupCountriesHyperCube();
    setupOceansHyperCube();
    createLeadEntityTypePieChart()
    createOceanBasinsPieChart()
    createLeadEntityPieChart()
    createTargetsPieChart()
    createGoalCountKpi("14.a")
    createGoalCountKpi("14.b")
    createGoalCountKpi("14.c")
    createGoalCountKpi("14.1")
    createGoalCountKpi("14.2")
    createGoalCountKpi("14.3")
    createGoalCountKpi("14.4")
    createGoalCountKpi("14.5")
    createGoalCountKpi("14.6")
    createGoalCountKpi("14.7")

    getEntityTypes()
    getEntity()
    console.log(app.selectionState())
  })
}

function createLeadEntityTypePieChart () {
  var listCols = [
    {
      qDef: {qFieldDefs: ['Lead entity type']}
    },
    '=Count(distinct [Lead entity])'
  ]

  app.visualization.create('treemap', listCols, {title: 'Lead Entity Type Pie Chart'}).then(function (piechart) {
    piechart.show('lead-entity-type-pie-chart')
  })
}

function createLeadEntityPieChart () {
  var listCols = [
    {
      qDef: {qFieldDefs: ['Lead entity']}
    },
    '=Count([OceanActionID])'
  ]

  app.visualization.create('treemap', listCols, {title: 'Lead Entity Pie Chart'}).then(function (piechart) {
    piechart.show('lead-entity-pie-chart')
  })
}
function createTargetsPieChart () {
  var listCols = [
    {
      qDef: {qFieldDefs: ['SDG Targets']}
    },
    '=Count([OceanActionID])'
  ]

  app.visualization.create('treemap', listCols, {title: 'Targets Pie Charts'}).then(function (piechart) {
    console.log(piechart)
    piechart.show('targets-pie-chart')
  })
}

function createOceanBasinsPieChart () {
  var listCols = [
    {
      qDef: {qFieldDefs: ['Ocean Basins']}
    },
    '=Count([OceanActionID])'
  ]

  app.visualization.create('treemap', listCols, {title: 'Ocean Basins Pie Chart'}).then(function (piechart) {
    console.log(piechart)
    piechart.show('ocean-basins-pie-chart')
  })
}

function createGoalCountKpi (target) {
  var listCols = ["=Count({<[SDG Targets]={'"+target+"'}>}OceanActionID)"]

  app.visualization.create('kpi', listCols, {
    title: target + ' Commitments',
    showTitles: true,
    showMeasureTitle: false
  }).then(function (kpi) {
    kpi.show('goals-count-kpi-'+target)
  })
}

function clearState (state) {
  state = state || '$'
  app.clearAll(false, state)
  //except for Goal 14
  app.field("Goal ID").selectValues(["Goal 14"], false, false)
  console.log('State Cleared:', state)
}

function getEntityTypes() {
  var myField = app.field("Lead entity type")
  var listener = function() {
    console.log('Getting entity types')
    var select = document.getElementById('entityTypeSelection')
    var val = select.value
    select.innerHTML=""
    select.appendChild(createOption('', '--Select--'))
    myField.rows.forEach(function(row) {
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
    console.log('Getting entity')
    var select = document.getElementById('entitySelection')
    var val = select.value
    select.innerHTML=""
    console.log(myField.rows)
    select.appendChild(createOption('', '--Select--'))
    myField.rows.forEach(function(row) {
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
