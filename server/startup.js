function dropData() {
  Journals.remove({});
  Tags.remove({})
  Meteor.users.remove({});
}

function seedData() {
  var uid = Accounts.createUser({email: "mkbunday@gmail.com", password: "zen"});
  Journal.create({text: "#ILUVU, I made this note to #express my #luv for U.", uid: uid});
  Journal.create({text: "Do what thou wilt shall be the whole of the #law.", uid: uid});
  Journal.create({text: "Luv is the law, #luv under will.", uid: uid});
}

function resaveAll() {
  Journals.find({}).fetch().forEach(function(journal) {
    new Journal(journal).save();
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // dropData();
    // seedData();

    Journal.subscriptions();
    Tag.subscriptions();

    // resaveAll();

    Journals._ensureIndex({
      "text": "text"
    });

    Tags._ensureIndex({name: 1, uid: 1}, {unique: true});
  });

  Meteor.methods({
    totalWordCount: function() {
      return Journals.aggregate([
        {$project: {count: 1}},
        {$group: {_id: null, count: {$sum: "$count"}}}
      ])[0]['count'];
    }
  })
}