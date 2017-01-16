import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import InfinityRoute from "ember-infinity/mixins/route";


export default Ember.Route.extend(InfinityRoute, {
  
  perPageParam: "limit",     
  pageParam: "skip",               
  totalPagesParam: "meta.total",

  position: null,
  alliance: null,


  skip_page: function () {
    return (this.get("currentPage")  - 1) * this.get('_perPage');
  }.property('currentPage'),

  model: function () {

    return Ember.RSVP.hash({
      alliances: this.store.findAll('alliance'),
      positions: this.store.findAll('position'),
      candidates: this.infinityModel('candidate', {perPage: 20, startingPage: 1, modelPath: 'controller.candidates'}, { skip: "skip_page"}),
    });         
  },

  setupController: function (controller, model) {
    this._super(controller, model);
    controller.set('candidates', model.candidates);
  },

  actions: {
    remove: function(model) {
      if(confirm('Are you sure?')) {
        model.destroyRecord();
      }
    },

    filter: function () {
      var controller = this.get('controller');
      var q = {perPage: 20, startingPage: 1, modelPath: 'controller.candidates'};
      if (controller.get('alliance')) {
        q = {alliance: controller.get('alliance').get('id')}
      }
      controller.set('candidates', this.get('store').query('candidate', q));
    }
  },

});
