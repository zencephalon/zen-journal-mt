Template.layout.rendered = function() {
  $('body').flowtype({
    minimum: 0,
    maximum: 1600,
    minFont: 12,
    maxFont: 42,
    fontRatio: 40,
    lineRatio: 1.45
  });

  Mousetrap.bind('ctrl+n', function() {
    Router.go('/j/new');
  });

  Mousetrap.bind('ctrl+f', function() {
    Router.go('/');
  })

  Mousetrap.bind('ctrl+shift+f', function() {
    Router.go('/all');
  })

  Mousetrap.bind('ctrl+shift+j', function() {
    Router.go('/');
    setTimeout(function() {
      Router.go('/template');
    }, 100)
  })

  Mousetrap.bind('ctrl+alt+j', function() {
    Router.go('/dailies')
  })

  Mousetrap.bind('ctrl+j', function() {
    Router.go('/');
    setTimeout(function() {
      Router.go('/today');
    }, 100)
  })
}
