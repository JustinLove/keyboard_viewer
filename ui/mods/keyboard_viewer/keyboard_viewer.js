define([
  'keyboard_viewer/ansi_104_qwerty',
  'keyboard_viewer/dragdrop',
], function(
  ansi_104_qwerty
) {
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

  var layout = ko.observable(expandLayout(ansi_104_qwerty))

  model.boards = ko.computed(function() {
    var boards = {
      'normal:': {},
      'build:normal:': {},
      'ctrl': {},
      'alt': {},
      'shift': {},
    }

    var cameraControls = []

    var addItem = function(item) {
      var combo = item.value()
      if (combo == '') return
      var parts = combo.split('+')
      var key = parts.pop()
      var board = parts.sort().join('+')

      if (board == '') board = 'normal:'
      if (item.options.set == 'terrain editor') board = 'terrain:' + board
      if (item.options.display_sub_group == '!LOC:free movement') board = 'freecam:' + board
      if (item.options.display_sub_group == '!LOC:build items') board = 'build:' + board

      boards[board] = boards[board] || {}
      boards[board][key] = item

      if (item.options.set == 'camera controls' && parts.length == 0) {
        cameraControls.push(item)
      }
    }

    model.keyboardSettingsItems().forEach(addItem)

    Object.keys(boards).forEach(function(board) {
      if (board.match('normal|build|terrain|freecam')) return
      cameraControls.forEach(function(item) {
        var parts = item.value().split('+')
        var key = parts.pop()
        var mod = Object.create(item)

        if (board.match('ctrl')) {
          if (item.title() == '!LOC:move left') {
            mod.title = ko.observable('Rotate Counter-Clockwise')
          }
          if (item.title() == '!LOC:move right') {
            mod.title = ko.observable('Rotate Clockwise')
          }
        }

        mod.ghost = true
        mod.value = ko.observable(board+'+'+key)
        addItem(mod)
      })
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
    obj.item && !obj.item.ghost && obj.item.clear()
  }

  var contextualAction = function() {
    if (this.item) {
      jumpToBinding.call(this)
    } else {
      model.comboToAssign(this.combo)
    }
  }

  var dropped = function(from) {
    if (this.item) {
      this.item.value(from.combo)
    }
    if (from.item) {
      from.item.value(this.combo)
    }
  }

  model.keyboards = ko.computed(function() {
    var boards = model.boards()
    return Object.keys(boards).map(function(layer){
      var prefix = layer.split(':').pop()
      if (prefix != '') {
        prefix = prefix + '+'
      }
      return {
        title: layer,
        classes: layer.replace(/[:+]/, ' '),
        rows: layout().map(function(row) {
          return row.map(function(key) {
            var item = boards[layer][key.mark]
            var kind = key.kind
            if (item) {
              if (item.ghost) {
                kind = kind + ' ghost'
              } else {
                kind = kind + ' set'
              }
            }
            return {
              combo: prefix + key.mark,
              mark: key.mark,
              kind: kind,
              fun: item && loc(item.title()),
              group: item && item.options.display_group,
              item: item,
              contextualAction: contextualAction,
              removeBinding: removeBinding,
              dropped: dropped,
            }
          })
        }),
      }
    })
  })
})
