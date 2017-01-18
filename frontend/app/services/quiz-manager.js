import Ember from 'ember';

export default Ember.Service.extend({
	guest: null,
	answers : [],
	matchs: [],
	currentQuestionIndex: 0,

	init: function () {
 		if (localStorage.getItem('guest')) {
        	var guest = localStorage.getItem('guest');
        	this.set('guest', guest);
        }


 		if (localStorage.getItem('currentQuestionIndex')) {
        	var currentQuestionIndex = localStorage.getItem('currentQuestionIndex');
        	this.set('currentQuestionIndex', currentQuestionIndex);
        }                        
    },

	save: function () {
		localStorage.setItem('guest', this.get('guest'));
		localStorage.setItem('currentQuestionIndex', this.get('currentQuestionIndex'));
	},

	reset: function () {
		localStorage.removeItem('guest');
		localStorage.removeItem('currentQuestionIndex');
	}
});
