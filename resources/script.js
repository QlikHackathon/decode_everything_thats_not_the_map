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

    createPartnersList()
    createOceanBasinsPieChart()
  })
}


function createOceanBasinsPieChart () {
  var listCols = [
    // {'qDef': {'qDef': 'Sum( [OceanActionID] )', 'qLabel': 'Open Cases'}}
    {
      qDef: {qFieldDefs: ['Ocean Basins']}
    },
    '=Count([OceanActionID])'
  ]

  app.visualization.create('piechart', listCols, {title: 'Ocean Basins Pie Chart'}).then(function (piechart) {
    console.log(piechart)
    piechart.show('ocean-basins-pie-chart')
  })
}

function createPartnersList () {
  var listCols = [
    {
      qDef: { qFieldDefs: ['Ocean Basins'] }
    }
  ]

  app.visualization.create('table', listCols, {title: 'Partners List'}).then(function (list) {
    console.log(list)
    list.show('partners-list')
  })
}

function clearState (state) {
  state = state || '$'
  app.clearAll(false, state)
  console.log('State Cleared:', state)
}

function getFieldData() {
  var myField = app.field("Ocean Basins")
  var listener = function() {
    console.log('Data for Field:', myField)
    var select = document.getElementById('classesSelection')

    select.appendChild(createOption('', '--Select--'))
    myField.rows.forEach(function(row) {
      select.appendChild(createOption(row.qText))
    })
    myField.OnData.unbind(listener)
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

function selectField() {
  var select = document.getElementById('classesSelection')
  if (select.value !== '') {
    app.field("Ocean Basins").selectValues([select.value], false, true)
  }
}
