import Ember from 'ember';

export default Ember.Mixin.create({
  modelPath: '',

  actions: {
    save: function() {
      var route = this;
      var model = this.currentModel;
      
      if (this.get('modelPath')) {
        model = model[this.get('modelPath')]
      }

      model.save().then(function() {
        var rs = route.routeName.split('.');
        var returnRoute = '';
        for (var i = 0; i < (rs.length - 1); i++) {
          returnRoute += rs[i] + ".";
        }
        returnRoute += 'index';
        route.transitionTo(returnRoute);
      }, function() {
        console.log('Failed to save the model');
      });
    }
  },  
  deactivate: function() {
    var model = this.currentModel;
    
    if (this.get('modelPath')) {
      model = model[this.get('modelPath')]
    }    

    if (model) {
      model.rollbackAttributes();
    }
  }
});
