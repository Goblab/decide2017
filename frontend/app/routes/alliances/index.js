import Ember from 'ember';

export default Ember.Route.extend({
  _listName: 'model',

  actions: {
    remove: function(model) {
      if(confirm('Are you sure?')) {
        model.destroyRecord();
      }
    }
  },
  model: function() {
    return this.store.query('alliance', {sort: "name ASC"});
  }
});
