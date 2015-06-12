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

  Meteor.publish("journal", function(_id) {
    return Journals.find({_id: _id});
  })

  Meteor.publish("search", function(searchValue) {
    if (!searchValue) {
      return Journals.find({});
    }
    return Journals.find(
      { $text: {$search: searchValue} },
      {
        fields: { score: { $meta: "textScore" } },
        sort: { score: { $meta: "textScore" } }
      }
    );
  });
}

Journal.create = function(o) {
  _.defaults(o, {createdAt: new Date(), updatedAt: new Date()});

  if (o['text']) {
    Journal.processTags(o['text'], o['uid']);
  }

  id = Journals.insert(o);
  o['_id'] = id;

  return new Journal(o);
}

Journal.processTags = function(text, uid) {
  tags = text.match(/#(\S+)/g).map(function(s) { return s.slice(1, -1) });
  tags.forEach(function(tag) {
    try {
      Tag.create({name: tag, uid: uid});
    } catch(e) {
    }
  })
}

Journal.findOne = function(o) {
  return new Journal(Journals.findOne(o));
}