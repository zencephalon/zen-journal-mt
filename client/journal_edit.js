Template.journal_edit.rendered = function() {
  var journal = Session.get("journal");
  $('#journal_text').val(journal.text);
  $('#journal_text').autosize();
}

Template.journal_edit.events({
  'keypress': function(e) {
    var target = $(e.target);

    var timer = Session.get("autosave_timer");
    target.removeClass("saved");

    if (timer !== undefined) {
      clearTimeout(timer);
    }

    Session.set("autosave_timer", setTimeout(function() {
      target.addClass("saved");
      var journal = new Journal(Session.get("journal"));
      journal.save($('#journal_text').val(), $('#journal_title').val());
    }, 1500));
  }
});

Template.journal_edit.helpers({
  settings: function() {
    return {
      position: "bottom",
      limit: 5,
      rules: [{
        token: '#',
        replacement: '#',
        collection: Tags,
        field: "name",
        template: Template.tag_preview
      }]
    }
  }
});