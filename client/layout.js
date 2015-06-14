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
}