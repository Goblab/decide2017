import DS from 'ember-data';

export default DS.Model.extend({
	question: DS.belongsTo('question'),
	candidate: DS.belongsTo('candidate'),
	position: DS.belongsTo('position'),
	value: DS.attr('number'),
	comment: DS.attr('string')
});
