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
  Meteor.publish("journals", function() {
    return Journals.find({uid: this.userId });
  })

  Meteor.publish("journal", function(_id) {
    return Journals.find({ _id: _id, uid: this.userId });
  })

  Meteor.publish("today", function() {
    return Journals.find({ day: new Date().toLocaleDateString(), uid: this.userId })
  })

  Meteor.publish("dailies", function() {
    return Journals.find({ day: { $exists: true }, uid: this.userId })
  })

  Meteor.publish("template", function() {
    return Journals.find({ uid: this.userId, template: true });
  })

  Meteor.publish("search", function(searchValue) {
    if (!searchValue) {
      return Journals.find({
        uid: this.userId,
        template: { $ne: true }
      }, {limit: 25, sort: {createdAt: -1}});
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
  _.defaults(o, {
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [],
    title: new Date().toString(),
    count: 0,
    text: "",
    template: false,
    day: null,
  });

  if (o['text']) {
    Journal.processTags(o['text'], o['uid']);
  }

  id = Journals.insert(o);
  o['_id'] = id;

  return new Journal(o);
}

Journal.createDefaultTemplate = function(o) {
  return Journal.create(_.defaults(o, {
    title: '__daily_journal_template__',
    template: true,
    text: 'ILUVU Aliza,',
  }))
}

Journal.createToday = function(o) {
  var d = new Date()
  return Journal.create(_.defaults(o, {
    title: d.toString().split(" ").slice(0, 4).join(" "),
    day: d.toLocaleDateString(),
  }))
}

Journal.countWords = function(text) {
  var regex = /\s+/gi;
  return text.trim().replace(regex, ' ').split(' ').length;
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
  if (text === undefined) {
    text = this.text;
  }
  if (title === undefined) {
    title = this.title;
  }
  this.tags = Journal.processTags(text, this.uid);
  this.count = Journal.countWords(text);
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