import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import InfinityRoute from "ember-infinity/mixins/route";


export default Ember.Route.extend(InfinityRoute, AuthenticatedRouteMixin, {

  perPageParam: 'limit',
  totalPagesParam: "meta.total",

  offset: Ember.computed('currentPage', '_perPage', function() {
    return this.get('currentPage') * this.get('_perPage');
  }),

  model() {
    return this.infinityModel('candidate', { limit: 20, skip: this.get('offset') });
  },

  actions: {
    remove: function(model) {
      if(confirm('Are you sure?')) {
        model.destroyRecord();
      }
    }
  },

});
