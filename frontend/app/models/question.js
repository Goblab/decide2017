import DS from 'ember-data';

export default DS.Model.extend({
	category: DS.belongsTo('category'),
	title: DS.attr('string'),
	description: DS.attr('string'),
  	position: DS.belongsTo('position')
});
