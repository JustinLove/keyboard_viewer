(function() {
  var vkboard_callback = function(char, id) {}
  var vkboard_norm

  var keymap = {
    'left': '<',
    'right': '>',
    'up': '/\\',
    'down': '\\/',
  }

  model.boards = ko.computed(function() {
    var boards = {
      'normal': {},
      'build:normal': {},
      'ctrl': {},
      'alt': {},
      'shift': {},
    }

    model.keyboardSettingsItems().forEach(function(item) {
      var combo = item.value()
      if (combo == '') return
      var parts = combo.split('+')
      var key = parts.pop()
      var board = parts.sort().join('+')

      key = keymap[key] || key

      if (board == '') board = 'normal'
      if (item.options.set == 'terrain editor') board = 'terrain:' + board
      if (item.options.display_sub_group == '!LOC(settings:free_movement.message):free movement') board = 'freecam:' + board
      if (item.options.display_sub_group == '!LOC(settings:build_items.message):build items') board = 'build:' + board

      boards[board] = boards[board] || {}
      boards[board][key] = item
    })

    return boards
  })

  model.keyboards = ko.computed(function() {
    var boards = model.boards()
    return Object.keys(boards).map(function(prefix){
      return {
        title: prefix,
        rows: [Object.keys(boards[prefix]).map(function(key) {
          return {
            mark: key,
            kind: 'letter',
            fun: loc(boards[prefix][key].title())
          }
        })]
      }
    })
  })

  model.settingGroups().push("keyview");
  model.settingDefinitions().keyview = {title:"KeyView",settings:{}};
  $.get('coui://ui/mods/keyboard_viewer/keyboard_viewer.html', function(html) {
    var $section = $(html)
    $(".container_settings").append($section)
    ko.applyBindings(model, $section[0])
  })
})()
