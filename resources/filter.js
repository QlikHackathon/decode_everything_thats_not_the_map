function updateFilterBar (selections) {
  $('#filters-bar').empty()
  selections.forEach(item => {
    if (item.fieldName !== 'Goal ID') {
      var filters = item.qSelected.split(',')
      filters.forEach(filter => {
        filter = filter.trim()
        $('#filters-bar').append(`<span class="filter"><a href="#" onclick="unclickFilter('${item.fieldName}', '${filter}')" class="delete-filter"><img class="close-icon" src="resources/images/close.png"></a><span> ${filter} </span></span>`)
      })
    }
  })
}

function unclickFilter(filterType, filterSelection) {
  app.field(filterType).selectValues([filterSelection], true, false)
}