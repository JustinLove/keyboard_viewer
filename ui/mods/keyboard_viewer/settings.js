(function() {
  var config = require.s.contexts._.config
  config.waitSeconds = 0
  config.paths.keyboard_viewer = 'coui://ui/mods/keyboard_viewer'

  model.settingGroups().push("keyview");
  model.settingDefinitions().keyview = {title:"KeyView",settings:{}};
})()

require([
  'keyboard_viewer/dragdrop',
  'keyboard_viewer/keyboard_viewer'
], function(dragdrop) {
  $.get('coui://ui/mods/keyboard_viewer/keyboard_viewer.html', function(html) {
    var $section = $(html)
    $(".container_settings").append($section)
    ko.applyBindings(model, $section[0])

    $('.keyboard_viewer').on('mousedown', '.function', dragdrop.dragstart)
    $('.keyboard_viewer').on('mouseup', '.key', dragdrop.dragend)
    $('.keyboard_viewer').on('mouseup', dragdrop.dragcancel)
  })
})
