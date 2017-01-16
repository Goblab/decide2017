import Ember from 'ember';
import InfinityRoute from "ember-infinity/mixins/route";


export default Ember.Route.extend(InfinityRoute, {
  perPageParam: 'limit',
  totalPagesParam: "meta.total",

  offset: Ember.computed('currentPage', '_perPage', function() {
    return this.get('currentPage') * this.get('_perPage');
  }),

  model() {
    return this.infinityModel('candidate', { limit: 10, skip: this.get('offset'), position: 1 });
  },

  actions: {
    remove: function(model) {
      if(confirm('Are you sure?')) {
        model.destroyRecord();
      }
    }
  },
});
