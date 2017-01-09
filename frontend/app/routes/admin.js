import Ember from 'ember';
import { CanMixin } from 'ember-can';

export default Ember.Route.extend(CanMixin, {
  beforeModel: function() {
    if (!this.can('view admin')) {
      this.transitionTo('index');
    }
  }  	
});
