define([
], function(
) {
  model.keyboardSettingPairs = ko.computed(function() {
    return model.keyboardSettingsItems().map(function(item) {
      var label = loc(item.title())
      return {
        label: label,
        value: label,
        item: item,
      }
    })
  })

  return {
    ready: function() {
      $("#function-finder-dialog").dialog({
        modal: true,
        autoOpen: false,
      });

      $('#function-finder').autocomplete({
        source: model.keyboardSettingPairs(),
        select: function(ev, ui) {
          console.log(this, ui.item.item)

          $("#function-finder-dialog").dialog('close')

          // clear input
          $(this).val('')
          return false
        },
      })

      model.keyboardSettingPairs.subscribe(function(newValue) {
        $('.function-finder').autocomplete("option", "source", newValue); 
      });
    },
    open: function() {
      $("#function-finder-dialog").dialog('open')
    },
  }
})
