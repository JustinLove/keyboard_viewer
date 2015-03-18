(function() {
  var en_us_101_qwerty = [
    [
      ['esc', 'letter'],
      [null, 'letter gap'],
      ['f1', 'letter'],
      ['f2', 'letter'],
      ['f3', 'letter'],
      ['f4', 'letter'],
      [null, 'half gap'],
      ['f5', 'letter'],
      ['f6', 'letter'],
      ['f7', 'letter'],
      ['f8', 'letter'],
      [null, 'half gap'],
      ['f9', 'letter'],
      ['f10', 'letter'],
      ['f11', 'letter'],
      ['f12', 'letter'],
      [null, 'half gap'],
      ['printscr', 'letter long'],
      ['scrolllock', 'letter long'],
      ['pause', 'letter long'],
    ],
    [
      ['`', 'letter'],
      ['1', 'letter'],
      ['2', 'letter'],
      ['3', 'letter'],
      ['4', 'letter'],
      ['5', 'letter'],
      ['6', 'letter'],
      ['7', 'letter'],
      ['8', 'letter'],
      ['9', 'letter'],
      ['0', 'letter'],
      ['-', 'letter'],
      ['=', 'letter'],
      ['backspace', 'two long'],
      [null, 'half gap'],
      ['ins', 'letter long'],
      ['home', 'letter long'],
      ['pageup', 'letter long'],
      [null, 'half gap'],
      ['numlock', 'letter long'],
      ['/', 'letter'],
      ['*', 'letter'],
      ['-', 'letter'],
    ],
    [
      ['tab', 'onehalf'],
      ['q', 'letter'],
      ['w', 'letter'],
      ['e', 'letter'],
      ['r', 'letter'],
      ['t', 'letter'],
      ['y', 'letter'],
      ['u', 'letter'],
      ['i', 'letter'],
      ['o', 'letter'],
      ['p', 'letter'],
      ['[', 'letter'],
      [']', 'letter'],
      ['\\', 'onehalf'],
      [null, 'half gap'],
      ['del', 'letter long'],
      ['end', 'letter long'],
      ['pagedown', 'letter long'],
      [null, 'half gap'],
      ['7', 'letter'],
      ['8', 'letter'],
      ['9', 'letter'],
      ['+', 'tall'],
    ],
    [
      ['capslock', 'one34 long'],
      ['a', 'letter'],
      ['s', 'letter'],
      ['d', 'letter'],
      ['f', 'letter'],
      ['g', 'letter'],
      ['h', 'letter'],
      ['j', 'letter'],
      ['k', 'letter'],
      ['l', 'letter'],
      [';', 'letter'],
      ['\'', 'letter'],
      ['enter', 'two14'],
      [null, 'half gap'],
      [null, 'letter gap'],
      [null, 'letter gap'],
      [null, 'letter gap'],
      [null, 'half gap'],
      ['4', 'letter'],
      ['5', 'letter'],
      ['6', 'letter'],
    ],
    [
      ['shift', 'twohalf shift'],
      ['z', 'letter'],
      ['x', 'letter'],
      ['c', 'letter'],
      ['v', 'letter'],
      ['b', 'letter'],
      ['n', 'letter'],
      ['m', 'letter'],
      [',', 'letter'],
      ['.', 'letter'],
      ['/', 'letter'],
      ['shift', 'twohalf shift'],
      [null, 'half gap'],
      [null, 'letter gap'],
      ['up', 'letter long'],
      [null, 'letter gap'],
      [null, 'half gap'],
      ['1', 'letter'],
      ['2', 'letter'],
      ['3', 'letter'],
      ['enter', 'tall long'],
    ],
    [
      ['ctrl', 'onehalf ctrl'],
      ['meta', 'fn meta'],
      ['alt', 'fn alt'],
      ['space', 'spacebar'],
      ['alt', 'fn alt'],
      ['meta', 'fn meta'],
      ['menu', 'fn menu'],
      ['ctrl', 'fn ctrl'],
      [null, 'half gap'],
      ['left', 'letter long'],
      ['down', 'letter long'],
      ['right', 'letter long'],
      [null, 'half gap'],
      ['0', 'two'],
      ['.', 'letter'],
    ],
  ]

  var expandLayout = function(grid) {
    return grid.map(function(row) {
      return row.map(function(key) {
        return {
          mark: key[0],
          kind: key[1],
          fun: null,
        }
      })
    })
  }

  var layout = ko.observable(expandLayout(en_us_101_qwerty))

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

      if (board == '') board = 'normal'
      if (item.options.set == 'terrain editor') board = 'terrain:' + board
      if (item.options.display_sub_group == '!LOC(settings:free_movement.message):free movement') board = 'freecam:' + board
      if (item.options.display_sub_group == '!LOC(settings:build_items.message):build items') board = 'build:' + board

      boards[board] = boards[board] || {}
      boards[board][key] = item
    })

    return boards
  })

  var scrollToBinding = function(label) {
    $('.one-keybind > .label_cont > label').each(function() {
      if (this.innerHTML == label) {
        var $parent = $(this).parents('.one-keybind-group')
        $parent.scrollTop($(this).offset().top - $parent.offset().top)
      }
    })
  }

  var jumpToBinding = function() {
    if (!this.group) return
    var index = model.keybindGroupTitles().indexOf(this.group)
    if (index != -1) {
      model.activeKeyboardGroupIndex(index)
      model.activeSettingsGroupIndex(6)
      setTimeout(scrollToBinding, 500, this.fun)
    }
  }

  var removeBinding = function(obj, ev) {
    obj.item && obj.item.clear()
  }

  model.keyboards = ko.computed(function() {
    var boards = model.boards()
    return Object.keys(boards).map(function(prefix){
      return {
        title: prefix,
        classes: prefix.replace(/[:+]/, ' '),
        rows: layout().map(function(row) {
          return row.map(function(key) {
            var item = boards[prefix][key.mark]
            return {
              mark: key.mark,
              kind: key.kind + (item ? ' set' : ''),
              fun: item && loc(item.title()),
              group: item && item.options.display_group,
              item: item,
              jumpToBinding: jumpToBinding,
              removeBinding: removeBinding,
            }
          })
        }),
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
