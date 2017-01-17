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
	matchs: [],
	creating: false,

	currentQuestion: Ember.computed('currentQuestionIndex', 'questions', function () {
		return this.get('questions').objectAt(this.get('currentQuestionIndex'));
	}),


	currentAnswer: Ember.computed('currentQuestionIndex', 'answers', function () {
		return this.get('answers').objectAt(this.get('currentQuestionIndex'));
	}),


	hasNextStep: Ember.computed('currentQuestionIndex', 'questions', function () {
		return (this.get('currentQuestionIndex') < (this.get('questions.length') - 1));
	}),



	actions: {

		newGame: function () {
			this.set('creating', true);
			this.set('isFinish', false);
			this.set('matchs', []);

			var store = this.get('store');
			var manager = this.get('manager');

			var position = this.get('position');
			var answers = [];

			var guest = store.createRecord('guest', {
				position: position,
			});

			var _this = this;

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
			this.set('answers', answers);
			guest.save().then(function () {
	 		    var promises = Ember.A();
 				answers.forEach(function (answer) {
				 	promises.push(answer.save());
				});

			    Ember.RSVP.Promise.all(promises).then(function(resolvedPromises){       
			    	_this.set('creating', false);
			    });    
			});


			this.set('currentQuestionIndex', 0);
		},

		responsed: function () {
			var _this = this;
			var matchs = [];
			this.get('currentAnswer').save().then(function () {
				_this.get('store').find('match-candidate', _this.get('guest').get('id')).then(function (match) {
					match.get('candidates').forEach(function (candidate) {
						var mm = {};
						match.get('matchs').forEach(function (match) {
							if (match.candidate == candidate.get('id')) {
								mm = match;
							}				
						})
						matchs.push(Ember.Object.create({
							candidate: candidate,
							percent: mm.percent,
							points: mm.points
						}));
					});
					_this.set('matchs', matchs.sortBy('percent').reverse());
					_this.send('next');
				});
			});
			//this.send('next');
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
