$(document).ready(function() {
  populateList()
})

function populateList() {
  const listDisplay = $('.list')

  $.get('/list')
    .done(listRaw => {
      // listRaw is a list of objects that contain the list text
      const list = [] // create new array to store only the text

      listRaw.forEach(item => { // puts only the text for each item into an array
        list.push(item.item)
      })

      list.sort().forEach((item, index) => {
        const listLineDiv = $('<div></div>')
        const listNumber = $('<p></p>').text( (index + 1) + ') ' )
        const listItem = $('<p></p>').text(item) // create a list element with the item as the text

        const listLineClass = 'listLine'
        const individualLineIndicatorClass = listLineClass + ( index + 1 )
        const individualItemIndicatorClass = 'listItem' + ( index + 1 )

        listNumber.addClass(listLineClass + ' ' + individualLineIndicatorClass)
        listItem.addClass(listLineClass + ' ' + individualLineIndicatorClass + ' ' + individualItemIndicatorClass) // assigns a class to the element

        const removeButton = createRemoveButton(listLineClass, individualLineIndicatorClass, individualItemIndicatorClass) // adds a remove button that is hidden by default

        listLineDiv.append(listNumber)
        listLineDiv.append(listItem)
        listLineDiv.append(removeButton)

        listDisplay.append(listLineDiv)
      })

      $('.removeButton').hide()
    })
    .fail(xhr => {
      console.log('Error loading list items.', xhr.responseText)
    })
}

function createRemoveButton(listLineClass, individualLineIndicatorClass, individualItemIndicatorClass) {
  const removeButton = $('<button class="removeButton">Remove</button>')

  removeButton.addClass(listLineClass + ' ' + individualLineIndicatorClass)

  removeButton.on('click', function(event) {
    const individualLine = $('.' + individualLineIndicatorClass)
    const itemTextElement = $('.' + individualItemIndicatorClass)

    deleteItemFromDatabase(itemTextElement)

    individualLine.remove()
  })

  return removeButton
}

function deleteItemFromDatabase(itemTextElement) {
  const itemText = itemTextElement.html()
  const itemToDelete = {
    item: itemText
  }

  $.post({
    url: '/delete-item',
    data: JSON.stringify(itemToDelete),
    headers: {
      'content-type': 'application/json'
    }
  })
  .done(() => {

  })
  .fail(xhr => {
    console.log('Error submitting list item.', xhr.responseText)
  })
}

function submitNewItem() {
  const listItemSubmitted = $('#newListItem').val()
  const item = {
    item: listItemSubmitted
  }

  $.post({
    url: '/submit-item',
    data: JSON.stringify(item),
    headers: {
      'content-type': 'application/json'
    }
  })
    .done((data) => {
      const listDisplay = $('.list')
      listDisplay.empty()
      populateList()
    })
    .fail(xhr => {
      console.log('Error submitting list item.', xhr.responseText)
      alert('Item already in database!')
    })
}

function removeItems() {
  $('.removeButton').show()
  $('.removeOption').hide()
  $('.doneRemoving').show()
}

function hideRemoveOption() {
  $('.removeButton').hide()
  $('.removeOption').show()
  $('.doneRemoving').hide()
}
