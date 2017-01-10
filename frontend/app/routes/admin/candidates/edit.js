import Ember from 'ember';
import SaveModelMixin from '../../../mixins/candidates/save-model-mixin';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
export default Ember.Route.extend(SaveModelMixin, AuthenticatedRouteMixin, {
  modelPath: 'candidate',

  model: function(params) {
	return Ember.RSVP.hash({
      alliances: this.store.findAll('alliance'),
      positions: this.store.findAll('position'),
      answers: this.store.query('answer', {candidate: params.candidate_id}),
      candidate: this.store.find('candidate', params.candidate_id),
 	})  	
  },
});