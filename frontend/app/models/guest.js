import DS from 'ember-data';

export default DS.Model.extend({
	position: DS.belongsTo('position'),
	answers: DS.hasMany('answers', {async: true})
});
