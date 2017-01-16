import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import InfinityRoute from "ember-infinity/mixins/route";


export default Ember.Route.extend(InfinityRoute, {
  
  perPageParam: "limit",     
  pageParam: "skip",               
  totalPagesParam: "meta.total",

  skip_page: function () {
    return this.get("currentPage") * this.get('_perPage');
  }.property('currentPage'),

  model: function () {
    return this.infinityModel('candidate', {perPage: 20, startingPage: 1, position: 1}, { skip: "skip_page"});
  },

  actions: {
    remove: function(model) {
      if(confirm('Are you sure?')) {
        model.destroyRecord();
      }
    }
  },

});
