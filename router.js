Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function () {
  this.wait(Meteor.subscribe('tags'));
  this.render('journal_list');
});

Router.route('/j/:_id', function() {
  this.wait(Meteor.subscribe('journal', this.params._id));
  this.wait(Meteor.subscribe('tags', this.params._id));

  if (this.ready()) {
    this.render('journal_edit', {
      data: function() {
        var journal = Journal.findOne({_id: this.params._id});
        Session.set("journal", journal);
        return journal;
      }
    });
  } else {
    this.render("loading")
  }
})