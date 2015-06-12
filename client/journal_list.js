Template.journal_list.helpers({
  journals: function() {
    Meteor.subscribe("search", Session.get("searchVal"));
    if (Session.get("searchVal")) {
      return Journals.find({}, { sort: [["score", "desc"]] });
    } else {
      return Journals.find({});
    }
  }
});

Template.journal_list.events({
  'submit form': function(event) {
    event.preventDefault();
    Session.set("searchVal", $(event.target).children('input').val())
    console.log(Session.get("searchVal"))
  }
})