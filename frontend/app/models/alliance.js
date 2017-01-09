import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
	list: DS.attr('string'),
	avatar: DS.belongsTo('asset'),
});
