(function() {
  var config = require.s.contexts._.config
  config.waitSeconds = 0
  config.paths.keyboard_viewer = 'coui://ui/mods/keyboard_viewer'

  model.settingGroups().push("keyview");
  model.settingDefinitions().keyview = {title:"KeyView",settings:{}};

  define('jquery', function() {return jQuery})
})()

require([
  'keyboard_viewer/dragdrop',
  'keyboard_viewer/function_finder',
  'keyboard_viewer/keyboard_viewer'
], function(dragdrop, function_finder) {
  $.get('coui://ui/mods/keyboard_viewer/keyboard_viewer.html', function(html) {
    var $section = $(html)
    $(".container_settings").append($section)
    ko.applyBindings(model, $section[0])

    $('.keyboard_viewer').on('mousedown', '.set .function', dragdrop.dragstart)
    $('.keyboard_viewer').on('mouseup', '.key', dragdrop.dragend)

    function_finder.ready()
  })
})
