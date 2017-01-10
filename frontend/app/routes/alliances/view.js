import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  modelPath: 'alliance',

  model: function(params) {
	return Ember.RSVP.hash({
      alliance: this.store.find('alliance', params.alliance_id),
      candidates: this.store.query('candidate', {alliance: params.alliance_id}),
 	})  	
  },
});
