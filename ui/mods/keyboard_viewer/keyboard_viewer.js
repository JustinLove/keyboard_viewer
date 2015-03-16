(function() {
  var vkboard_callback = function(char, id) {}
  var vkboard_norm

  var makeKeyboard = function(id) {
    return new VKeyboard(id,   // container's id, mandatory
                  vkboard_callback,// reference to callback function, mandatory
                                // (this & following parameters are optional)
                  true,         // create the arrow keys or not?
                  true,         // create up and down arrow keys?
                  false,        // reserved
                  true,         // create the numpad or not?
                  "",           // font name ("" == system default)
                  "24px",       // font size in px
                  "#0cc",       // font color
                  "#F00",       // font color for the dead keys
                  "#0D0D0D",       // keyboard base background color
                  "#222",       // keys' background color
                  "#CCC",       // background color of switched/selected item
                  "#777",       // border color
                  "#444",       // border/font color of "inactive" key
                                // (key with no value/disabled)
                  "#111",       // background color of "inactive" key
                                // (key with no value/disabled)
                  "#F77",       // border color of language selector's cell
                  false,         // show key flash on click? (false by default)
                  "#CC3300",    // font color during flash
                  "#FF9966",    // key background color during flash
                  "#CC3300",    // key border color during flash
                  true,        // embed VKeyboard into the page?
                  true,         // use 1-pixel gap between the keys?
                  0);           // index (0-based) of the initial layout
  }

  model.settingGroups().push("keyview");
  model.settingDefinitions().keyview = {title:"KeyView",settings:{}};
  $.get('coui://ui/mods/keyboard_viewer/keyboard_viewer.html', function(html) {
    var $section = $(html)
    $(".container_settings").append($section)
    ko.applyBindings(model, $section[0])

    var boards = {
      'normal': {},
      'ctrl': {},
      'alt': {},
      'shift': {},
    }
    ko.computed(function() {
      model.keyboardSettingsItems().forEach(function(item) {
        var combo = item.value()
        if (combo == '') return
        var parts = combo.split('+')
        var key = parts.pop()
        var board = parts.join('+')
        if (board == '') board = 'normal'
        if (board == 'shift+ctrl') board = 'ctrl+shift'
        boards[board] = boards[board] || {}
        boards[board][key] = item
      })
    })

    var $keyboards = $('.kbv_keyboards')
    for(var prefix in boards) {
      var id = 'vkeyboard_' + prefix.replace('+', '_')
      var $kb = $('<div class="sub-group-title">' + prefix + '</div><div id="' + id + '"></div>')
      $keyboards.append($kb)
      var vkb = makeKeyboard(id)
      $(vkb.Cntr).find('div div div div').each(function() {
        var $el = $(this)
        var item = boards[prefix][$el.text().toLowerCase()]
        if (item) {
          $el
            .css('background-color', '#088')
            //.attr('data-bind', "tooltip: '"+ loc(item.title()) +"'")
            //.attr('data-placement', "bottom")
            //.attr('title', loc(item.title()))
            .append('<div class="function">' + loc(item.title()) + '</div>')
        }
      })
      ko.applyBindings(model, $kb[0])
    }
  })
})()
