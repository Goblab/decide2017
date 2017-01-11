import DS from 'ember-data';

export default DS.Model.extend({
	candidates: DS.hasMany('candidate', {async: true}),
	matchs: DS.attr()
});
