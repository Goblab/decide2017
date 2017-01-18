import Ember from 'ember';
import { Ability } from 'ember-can';
 
export default Ability.extend({
  session: Ember.inject.service('session'),

  canView: Ember.computed('session.account.isAdmin', function() {
  	return true;
    //return this.get('session.account.isAdmin');
  }),
});