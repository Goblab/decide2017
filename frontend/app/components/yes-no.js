import Ember from 'ember';

export default Ember.Component.extend({
	answer: null,

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
