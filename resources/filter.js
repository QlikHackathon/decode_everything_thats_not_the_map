function updateFilterBar (selections) {
  $('#filters-bar').empty()
  selections.forEach(item => {
    if (item.fieldName === 'Ocean Basins' || item.fieldName === 'Country') {
      var filters = item.qSelected.split(',')
      filters.forEach(filter => {
        $('#filters-bar').append(`<span class="filter"><a href="#" class="delete-filter"><img class="close-icon" src="resources/images/close.png"></a><span> ${filter} </span></span>`)
      })
    }
  })
}

function unclickFilter () {
app.field("Country").selectValues([clickedCountry], true, false)
}
