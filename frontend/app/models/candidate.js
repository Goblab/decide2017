import DS from 'ember-data';

export default DS.Model.extend({
	order: DS.attr('number'),
	name: DS.attr('string'),
	facebook: DS.attr('string'),
	twitter: DS.attr('string'),
	web: DS.attr('string'),
	bio: DS.attr('string'),
	ced: DS.attr('string'),
	birthdate: DS.attr('date'),
	position: DS.belongsTo('position'),
	alliance: DS.belongsTo('alliance'),
	avatar: DS.belongsTo('asset'),
});
