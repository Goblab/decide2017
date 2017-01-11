import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service('store'),
	manager: Ember.inject.service('quiz-manager'),
	candidatesAnwers: [],
	position: null,
	guest: null,

	questions: [],
	answers: [],
	isFinish: false,

	currentQuestion: Ember.computed('currentQuestionIndex', 'questions', function () {
		return this.get('questions').objectAt(this.get('currentQuestionIndex'));
	}),


	currentAnswer: Ember.computed('currentQuestionIndex', 'answers', function () {
		return this.get('answers').objectAt(this.get('currentQuestionIndex'));
	}),


	hasNextStep: Ember.computed('currentQuestionIndex', 'questions', function () {
		console.log(this.get('questions.length'));
		return (this.get('currentQuestionIndex') < (this.get('questions.length') - 1));
	}),


	matchCandidates: Ember.computed('isFinish', function () {
		return null;
	}),

	actions: {
		newGame: function () {
			var store = this.get('store');
			var manager = this.get('manager');

			var position = this.get('position');
			var answers = this.get('answers');

			var guest = store.createRecord('guest', {
				position: position,
			});

			this.get('questions').forEach(function (question) {
				var as = store.createRecord('answer', {
   					guest: guest,
   					position: position,
   					question: question,
   					isGuest: true
   				});
   				answers.push(as);
			});

			this.set('guest', guest);

			guest.save().then(function () {
				answers.forEach(function (answer) {
					answer.save();
				});
			});

			this.set('currentQuestionIndex', 0);
		},

		responsed: function () {
			var _this = this;
			this.get('currentAnswer').save();
			this.send('next');
			//this.get('store').query('answer', { position: this.get('position').get('id'), question: this.get('currentQuestion').get('id'), isGuest: false}).then(function (ans) {
			//	_this.set('candidateAnwers', ans);
			//});
		},
		
		next: function () {
			var manager = this.get('manager');
			if (this.get('hasNextStep')) {
				this.set('currentQuestionIndex', this.get('currentQuestionIndex') + 1);
			} else {
				this.set('isFinish', true);
			}
		},
	}
});
