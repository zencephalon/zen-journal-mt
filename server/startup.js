if (Meteor.isServer) {
  Meteor.startup(function () {

    
    
    Journal.subscriptions();
  });
}