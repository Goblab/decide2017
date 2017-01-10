import DS from 'ember-data';

export default DS.Model.extend({
	question: DS.belongsTo('question'),
	candidate: DS.belongsTo('candidate'),	
	position: DS.belongsTo('position'),
	guest: DS.belongsTo('guest'),
	value: DS.attr('number'),
	comment: DS.attr('string'),
	dummy: DS.attr('string'),
	isGuest: DS.attr('boolean'),

	response: Ember.computed('value', function () {
		if (this.get('value') === 1) {
			return "Si";
		} else {
			if (this.get('value') === 2) {
				return "No";
			} else {
				return "No respondio";
			}
		} 
	})
});
