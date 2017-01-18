import Ember from 'ember';

export default Ember.Route.extend({
  modelPath: 'alliance',

  model: function(params) {
	return Ember.RSVP.hash({
      alliance: this.store.find('alliance', params.alliance_id),
      candidates: this.store.query('candidate', {alliance: params.alliance_id, sort: "position ASC"}),
 	})  	
  },
});
