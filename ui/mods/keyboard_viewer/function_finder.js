define([
], function(
) {
  model.keyboardSettingPairs = ko.computed(function() {
    return model.keyboardSettingsItems().map(function(item) {
      var label = loc(item.title())
      var existing = item.value()
      if (existing) {
        existing = ' (' + item.value() + ')'
      }
      return {
        label: label + existing,
        value: label,
        item: item,
      }
    })
  })

  model.comboToAssign = ko.observable()

  model.comboToAssign.subscribe(function(combo) {
    if (combo && combo != '') {
      $("#function-finder-dialog").dialog('open')
    } else {
      $("#function-finder-dialog").dialog('close')
    }
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
          ui.item.item.value(model.comboToAssign())

          model.comboToAssign(null)

          // clear input
          $(this).val('')
          return false
        },
      })

      model.keyboardSettingPairs.subscribe(function(newValue) {
        $('#function-finder').autocomplete("option", "source", newValue); 
      });
    },
    open: function() {
      $("#function-finder-dialog").dialog('open')
    },
  }
})
