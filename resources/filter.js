function updateFilterBar (selections) {
  $('#filters-bar').empty()
  selections.forEach(item => {
    console.log(item)
    $('#filters-bar').append(`<span class="filter"><a href="#" class="delete-filter"><img class="close-icon" src="resources/images/close.png"></a><span> ${item.fieldName} </span></span>`)
  })
}

function unclickFilter () {
  
}
