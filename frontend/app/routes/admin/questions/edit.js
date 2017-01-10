import Ember from 'ember';
import SaveModelMixin from '../../../mixins/roles/save-model-mixin';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
export default Ember.Route.extend(SaveModelMixin, AuthenticatedRouteMixin, {
  modelPath: 'question',

  model: function(params) {
	return Ember.RSVP.hash({
	  categories: this.store.findAll('category'),
      question: this.store.find('question', params.question_id),
 	})  	
  },	
});
