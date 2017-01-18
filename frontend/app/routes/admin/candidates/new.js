import Ember from 'ember';
import SaveModelMixin from '../../../mixins/candidates/save-model-mixin';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, SaveModelMixin, {
  modelPath: 'candidate',

  fonts: ['textual', 'interpretada', 'no-responde'],
  
  model: function() {
  	return Ember.RSVP.hash({
      alliances: this.store.findAll('alliance'),
      positions: this.store.findAll('position'),
      questions: this.store.findAll('question'),
      candidate: this.store.createRecord('candidate'),
    });  	    
  },

  setupController: function (controller, model) {
  	this._super(controller, model);
  	if (model.questions) {
  		model.answers = [];
  		var _this = this;
  		model.questions.forEach(function (question) {
			var as = _this.store.createRecord('answer', {
   				candidate: model.candidate,
   				position: model.candidate.get('position'),
   				question: question
   			});

   			model.answers.push(as);
   		});
      model.fonts = this.get('fonts');  		
  	}
  },
});
