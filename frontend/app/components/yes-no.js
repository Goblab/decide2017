import Ember from 'ember';

export default Ember.Component.extend({
	answer: null,


	yesSelected: Ember.computed('answer', 'answer.value', function (){
		var answer = this.get('answer');
		if (answer && answer.get('value') == 1) {
			return true;
		} else {
			return false;
		}
	}),

	noSelected: Ember.computed('answer.value', function () {
		var answer = this.get('answer');
		if (answer && answer.get('value') == 2) {
			return true;
		} else {
			return false;
		}
	}),

	actions: {
		yes: function () {
			if (this.get('answer')) {
				this.get('answer').set('value', 1);
				this.sendAction('onSelect');
			}		
		},

		no: function () {
			if (this.get('answer')) {
				this.get('answer').set('value', 2);
				this.sendAction('onSelect');
			}		
		}

	}
});
