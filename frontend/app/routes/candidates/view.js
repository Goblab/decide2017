import Ember from 'ember';
export default Ember.Route.extend({
  modelPath: 'candidate',

  model: function(params) {
	return Ember.RSVP.hash({
      answers: this.store.query('answer', {candidate: params.candidate_id, sort: 'question'}),
      candidate: this.store.find('candidate', params.candidate_id),
 	})  	
  },
});
