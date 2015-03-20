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
      $('.function-finder').autocomplete({
        source: model.keyboardSettingPairs(),
        select: function(ev, ui) {
          console.log(this, ui.item.item)

          // clear input
          $(this).val('')
          return false
        },
      })

      model.keyboardSettingPairs.subscribe(function(newValue) {
        $('.function-finder').autocomplete("option", "source", newValue); 
      });
    },
  }
})
