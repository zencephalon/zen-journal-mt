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
}

Journal.create = function(o) {
  _.defaults(o, {createdAt: new Date(), updatedAt: new Date()})
  id = Journals.insert(o);
  o['_id'] = id;

  return new Journal(o);
}