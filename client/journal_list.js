Template.journal_list.helpers({
  journals: function() {
    Meteor.subscribe("search", Session.get("searchVal"));
    if (Session.get("searchVal")) {
      return Journals.find({}, { sort: [["score", "desc"]] });
    } else {
      return Journals.find({});
    }
  },
  searchVal: function() {
    return Session.get("searchVal");
  }
});

Template.journal_list.rendered = function() {
  $('#search').focus();
}

Template.throttled_search = _.throttle(function(event) {
  Session.set("searchVal", $(event.target).val());
  console.log(Session.get("searchVal"));
}, 200)

Template.journal_list.events({
  'keyup #search': Template.throttled_search,
  'submit form': function(event) {
    event.preventDefault();
  }
})