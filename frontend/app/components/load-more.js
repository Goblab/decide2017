export default Ember.Component.extend({
  loadText: 'Cargar mas',

  actions: {
  	next: function () {
	  	console.log('pepe');   
	    this.sendAction('action', this.get('infinityModel'));	  		
  	}
  }
});