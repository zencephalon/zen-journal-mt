Template.journal_edit.rendered = function() {
  var journal = Session.get("journal");
  $('#journal_text').val(journal.text);
}

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