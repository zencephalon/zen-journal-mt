Template.layout.rendered = function() {
  $('body').flowtype({
    minimum: 0,
    maximum: 1600,
    minFont: 12,
    maxFont: 42,
    fontRatio: 40,
    lineRatio: 1.45
  });

  Mousetrap.bind('alt+n', function() {
    Router.go('/j/new');
  });

  Mousetrap.bind('alt+f', function() {
    Router.go('/');
  })
}
