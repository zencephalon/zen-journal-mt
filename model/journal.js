Journals = new Meteor.Collection("journals");

Journals.allow({
  update: function() {
    return Permission.allow();
  },
  insert: function() {
    return Permission.allow();
  },
  remove: function() {
    return Permission.allow();
  }
});

Journal = function (o) {
  for (p in o) {
    this[p] = o[p]
  }
}

Journal.subscriptions = function() {
  Meteor.publish("journals", function() { return Journals.find({uid: this.userId}); });

  Meteor.publish("search", function(searchValue) {
    if (!searchValue) {
      return Journals.find({});
    }
    return Journals.find(
      { $text: {$search: searchValue} },
      {
        // `fields` is where we can add MongoDB projections. Here we're causing
        // each document published to include a property named `score`, which
        // contains the document's search rank, a numerical value, with more
        // relevant documents having a higher score.
        fields: {
          score: { $meta: "textScore" }
        },
        // This indicates that we wish the publication to be sorted by the
        // `score` property specified in the projection fields above.
        sort: {
          score: { $meta: "textScore" }
        }
      }
    );
  });
}

Journal.create = function(o) {
  _.defaults(o, {createdAt: new Date(), updatedAt: new Date()})
  id = Journals.insert(o);
  o['_id'] = id;

  return new Journal(o);
}