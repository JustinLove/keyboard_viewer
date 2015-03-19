define(function() {
  ko.bindingHandlers.data = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      $(element).data('data', valueAccessor())
    }
  }

  var dragging

  return {
    dragstart: function() {
      dragging = this
    },
    dragend: function(ev) {
      if (dragging) {
        var from = $(dragging).data('data')
        var to = $(this).data('data')
        if (from && to && from != to) {
          to.dropped(from)
          ev.stopPropagation()
        }
      }
    },
    dragcancel: function() {
      dragging = null
    }
  }
})
