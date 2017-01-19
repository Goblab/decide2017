import Ember from 'ember';
import InfinityRoute from "ember-infinity/mixins/route";


export default Ember.Route.extend({

  model() {
    return this.get('store').query('candidate', { position: '587fb0f8460614a50761d775', sort: "name ASC"});
  },

  actions: {
    remove: function(model) {
      if(confirm('Are you sure?')) {
        model.destroyRecord();
      }
    }
  },
});
