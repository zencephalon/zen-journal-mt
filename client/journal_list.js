Template.journal_list.helpers({
  journals: function() {
    return Journals.find();
  }
})