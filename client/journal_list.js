Template.journal_list.helpers({
  journals: function() {
    Meteor.subscribe("search", Session.get("searchVal"));
    if (Session.get("searchVal")) {
      return Journals.find({}, { sort: [["score", "desc"]] });
    } else {
      return Journals.find({});
    }
  },
  totalWordCount: function() {
    return Session.get("totalWordCount");
  },
  searchVal: function() {
    return Session.get("searchVal");
  },
  settings: function() {
    return {
      position: "bottom",
      limit: 5,
      rules: [{
        token: '#',
        replacement: '#',
        collection: Tags,
        field: "name",
        template: Template.tag_preview
      }]
    }
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