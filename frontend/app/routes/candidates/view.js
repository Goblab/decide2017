import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  modelPath: 'candidate',

  model: function(params) {
	return Ember.RSVP.hash({
      answers: this.store.query('answer', {candidate: params.candidate_id}),
      candidate: this.store.find('candidate', params.candidate_id),
 	})  	
  },
});
