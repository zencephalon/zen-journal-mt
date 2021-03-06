Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function () {
  this.wait(Meteor.subscribe('tags'));
  this.wait(Meteor.subscribe("search", Session.get("searchVal")));

  Meteor.call("totalWordCount", function(error, result) {
    Session.set("totalWordCount", result);
  });
  this.render('journal_list');
});

Router.route('/all', function() {
  this.wait(Meteor.subscribe('journals'));

  this.render('journal_summary_list', {
    data: function() {
      return {
        journals: Journals.find({ uid: Meteor.userId() }, { sort: { createdAt: -1 } })
      }
    }
  })
})

Router.route('/dailies', function() {
  this.wait(Meteor.subscribe('dailies'));

  this.render('journal_summary_list', {
    data: function() {
      return {
        journals: Journals.find({ uid: Meteor.userId(), day: { $ne: null } }, { sort: { createdAt: -1 } })
      }
    }
  })
})

Router.route('/today', function() {
  this.wait(Meteor.subscribe('template'));
  this.wait(Meteor.subscribe('today'));

  if (this.ready()) {
    var template = Journal.findOne({ uid: Meteor.userId(), template: true })
    template = template._id ? template : Journal.createDefaultTemplate({ uid: Meteor.userId() })

    var daily = Journal.findOne({ uid: Meteor.userId(), day: new Date().toLocaleDateString() })
    daily = daily._id ? daily : Journal.createToday({ uid: Meteor.userId(), text: template.text })
    this.render('journal_edit', {
      data: function() {
        return daily
      }
    })
  } else {
    this.render("loading");
  }
});

Router.route('/template', function() {
  this.wait(Meteor.subscribe('template'));

  if (this.ready()) {
    var template = Journal.findOne({ uid: Meteor.userId(), template: true })
    template = template._id ? template : Journal.createDefaultTemplate({ uid: Meteor.userId() })
    this.render('journal_edit', {
      data: function() {
        return template
      }
    })
  } else {
    this.render("loading");
  }
});

Router.route('/j/new', function() {
  var journal = Journal.create({uid: Meteor.userId()});

  this.redirect('/j/' + journal._id);
});

Router.route('/j/:_id', function() {
  this.wait(Meteor.subscribe('journal', this.params._id));
  this.wait(Meteor.subscribe('tags'));

  if (this.ready()) {
    this.render('journal_edit', {
      data: function() {
        var journal = Journal.findOne({_id: this.params._id});
        return journal;
      }
    });
  } else {
    this.render("loading");
  }
})