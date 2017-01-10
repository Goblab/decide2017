import Ember from 'ember';

export default Ember.Route.extend({
	model: function () {
	  	return Ember.RSVP.hash({
	      positions: this.store.findAll('position'),
	      questions: this.store.findAll('question'),
	    }) 		
	},	
});
