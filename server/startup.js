function dropData() {
  Journals.remove({});
  Meteor.users.remove({});
}

function seedData() {
  uid = Accounts.createUser({email: "mkbunday@gmail.com", password: "zen"});
  Journal.create({text: "ILUVU, I made this note to express my luv for U.", uid: uid});
  Journal.create({text: "Do what thou wilt shall be the whole of the law.", uid: uid});
  Journal.create({text: "Luv is the law, luv under will.", uid: uid});
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // dropData();
    // seedData();

    Journal.subscriptions();

    Journals._ensureIndex({
      "text": "text"
    });

    
  });
}