Template.journal_edit.rendered = function() {
  var $journal_text = $('#journal_text');
  var $journal_title = $('#journal_title');
  $journal_title.val(this.data.title);
  $journal_text.val(this.data.text);
  $journal_text.autosize();
  $journal_text.focus();
}

Template.journal_edit.events({
  'keypress': function(e) {
    var $journal_text = $('#journal_text');
    var timer = Session.get("autosave_timer");
    var journal = Template.currentData();
    $journal_text.removeClass("saved");

    if (timer !== undefined) {
      clearTimeout(timer);
    }

    Session.set("autosave_timer", setTimeout(function() {
      $journal_text.addClass("saved");
      journal.save($journal_text.val(), $('#journal_title').val());
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
  },
  wordCount: function() {
    return this.count;
  }
});