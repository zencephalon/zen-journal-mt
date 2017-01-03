Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function () {
  this.wait(Meteor.subscribe('tags'));
  this.wait(Meteor.subscribe("search", Session.get("searchVal")));

  Meteor.call("totalWordCount", function(error, result) {
    Session.set("totalWordCount", result);
  });
  this.render('journal_list');
});

Router.route('/j/template', function() {
  this.wait(Meteor.subscribe('template'));

  if (this.ready()) {
    var template = Journal.findOne({ uid: Meteor.userId(), template: true })
    template = template._id ? template : Journal.createDefaultTemplate({ uid: Meteor.userId() })
    this.render('journal_edit', {
      data: function() {
        return template
      }
    })
  } else {
    this.render("loading");
  }
});

Router.route('/j/new', function() {
  var journal = Journal.create({uid: Meteor.userId()});

  this.redirect('/j/' + journal._id);
});

Router.route('/j/:_id', function() {
  this.wait(Meteor.subscribe('journal', this.params._id));
  this.wait(Meteor.subscribe('tags'));

  if (this.ready()) {
    this.render('journal_edit', {
      data: function() {
        var journal = Journal.findOne({_id: this.params._id});
        return journal;
      }
    });
  } else {
    this.render("loading");
  }
})