Journals = new Meteor.Collection("journals");

Journals.allow({
  insert: function (userId, doc) {
    return (userId && doc.uid === userId);
  },
  update: function (userId, doc, fields, modifier) {
    return doc.uid === userId;
  },
  remove: function (userId, doc) {
    return doc.uid === userId;
  },
  fetch: ['uid']
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
      return Journals.find({uid: this.userId}, {limit: 25, sort: {updatedAt: -1}});
    }
    return Journals.find(
      { $text: {$search: searchValue}, uid: this.userId },
      {
        fields: { score: { $meta: "textScore" } },
        sort: { score: { $meta: "textScore" } },
        limit: 25
      }
    );
  });
}

Journal.create = function(o) {
  _.defaults(o, {createdAt: new Date(), updatedAt: new Date(), tags: [], title: new Date().toString()});

  if (o['text']) {
    Journal.processTags(o['text'], o['uid']);
  }

  id = Journals.insert(o);
  o['_id'] = id;

  return new Journal(o);
}

Journal.prototype.update = function(update) {
  if (update === undefined) {
    o = {};
    for (p in this) {
      if (p != '_id') {
        o[p] = this[p];
      }
    }
    o['updatedAt'] = new Date();

    Journals.update(this._id, {"$set": o});
  } else {
    update['updatedAt'] = new Date();
    Journals.update(this._id, update);
  }
}

Journal.prototype.save = function(text, title) {
  this.tags = Journal.processTags(text, this.uid);
  this.text = text;
  this.title = title;
  this.update();
}

Journal.processTags = function(text, uid) {
  var tags = text.match(/#([A-Za-z0-9\-\_]+)/g);

  if (tags) {
    tags = tags.map(function(tag) {
      var tag = tag.slice(1);
      if (! Tags.findOne({name: tag, uid: uid})) {
        Tag.create({name: tag, uid: uid});
      }
      return tag;
    });
  }

  return tags;
}

Journal.findOne = function(o) {
  return new Journal(Journals.findOne(o));
}