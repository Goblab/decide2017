import Ember from 'ember';
import InfinityRoute from "ember-infinity/mixins/route";


export default Ember.Route.extend({

  model() {
    return this.get('store').query('candidate', { position: 1, sort: "name ASC"});
  },

  actions: {
    remove: function(model) {
      if(confirm('Are you sure?')) {
        model.destroyRecord();
      }
    }
  },
});
