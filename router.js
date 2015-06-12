Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function () {
  this.render('journal_list');
});

Router.route('/j/:_id', function() {
  this.wait(Meteor.subscribe('journal', this.params._id));

  this.render('journal_edit', {
    data: function() {
      var journal = Journals.findOne({_id: this.params._id});
      Session.set("journal", journal);
      return journal;
    }
  })
})