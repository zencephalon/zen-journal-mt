Template.journal_edit.rendered = function() {
  var journal = Session.get("journal");
  $('#journal_text').val(journal.text);
}