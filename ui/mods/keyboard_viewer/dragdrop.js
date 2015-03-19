define(function() {
  ko.bindingHandlers.data = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      $(element).data('data', valueAccessor())
    }
  }

  var dragging

  var startDragging = function(element) {
    $(document).on('mouseup', dragdrop.dragcancel)
    $(document).on('mousemove', dragdrop.dragmove)
    dragging = element
    $(element).addClass('dragged')
    $('body').addClass('dragmode')
  }

  var moveDragging = function(x, y) {
    $(dragging).offset({top: y - 10, left: x - 20})
  }

  var stopDragging = function() {
    $(document).off('mouseup', dragdrop.dragcancel)
    $(document).off('mousemove', dragdrop.dragmove)
    $(dragging).removeClass('dragged').removeAttr('style')
    $('body').removeClass('dragmode')
    dragging = null
  }

  var dragdrop = {
    dragstart: function() {
      startDragging(this)
    },
    dragmove: function(ev) {
      moveDragging(ev.clientX, ev.clientY)
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
      stopDragging()
    }
  }

  return dragdrop
})
