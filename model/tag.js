Tags = new Meteor.Collection("tags");

Tags.allow({
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

Tag = function (o) {
  for (p in o) {
    this[p] = o[p]
  }
}

Tag.subscriptions = function() {
  Meteor.publish("tags", function() { 
    return Tags.find({uid: this.userId});
  });
}

Tag.create = function(o) {
  id = Tags.insert(o);
  o['_id'] = id;

  return new Tag(o);
}

Tag.findOne = function(o) {
  return new Tag(Tags.findOne(o));
}