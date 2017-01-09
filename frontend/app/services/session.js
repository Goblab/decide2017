import Ember from 'ember';
import DS from 'ember-data';
import SessionService from 'ember-simple-auth/services/session';

export default SessionService.extend({
  store: Ember.inject.service(),

  account: Ember.computed('data.authenticated.user_id', function() {
    const accountId = this.get('data.authenticated.user_id');
    if (!Ember.isEmpty(accountId)) {
      if (JSON.parse(localStorage.getItem('user'))) {
        var user = JSON.parse(localStorage.getItem('user'));
        user.id = accountId;
        return this.get('store').push(this.get('store').normalize('user', user));
      } else {
        var _this = this;
        return DS.PromiseObject.create({
          promise: this.get('store').find('user', accountId).then(function (user) {
            //_this.get('store').persist(obj);
            localStorage.setItem('user', JSON.stringify(user));
            return user;
          })
        });
      }
    } else {
      localStorage.setItem('user', null );
    }
  })
});