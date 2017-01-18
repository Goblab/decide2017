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
	questionsResponsed: [],
	creating: false,

	currentQuestion: Ember.computed('currentQuestionIndex', 'questions', function () {
		return this.get('questions').objectAt(this.get('currentQuestionIndex'));
	}),

	currentIndex: Ember.computed('currentQuestionIndex', function () {
		return this.get('currentQuestionIndex') + 1;
	}),

	currentProgress: Ember.computed('currentQuestionIndex', function () {
		return this.get('currentQuestionIndex') * 10;
	}),

	currentAnswer: Ember.computed('currentQuestionIndex', 'answers', function () {
		var aw = null;
		var _this = this;
		this.get('answers').forEach(function (answer) {
			if (answer.get('question').get('id') == _this.get('currentQuestion').get('id')) {
				aw = answer;
			}
		});

		return aw;
	}),


	hasNextStep: Ember.computed('currentQuestionIndex', 'questions', function () {
		return (this.get('currentQuestionIndex') < (this.get('questions.length') - 1));
	}),



	actions: {

		resetGame: function () {
			this.set('isFinish', false);
			this.set('matchs', []);
			this.set('questionsResponsed', []);
			this.set('guest', null);
			this.get('manager').reset();			
		},


		newGame: function () {
			this.set('creating', true);
			this.set('isFinish', false);
			this.set('matchs', []);
			this.set('questionsResponsed', []);

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
			
			guest.save().then(function (guest) {
	 		    var promises = Ember.A();
 				answers.forEach(function (answer) {
				 	promises.push(answer.save());
				});

			    Ember.RSVP.Promise.all(promises).then(function(resolvedPromises){       
			    	_this.set('creating', false);
			    });    
				manager.set('guest', guest.get('id'));
				manager.set('currentQuestionIndex', 0);
				manager.save();
				_this.set('currentQuestionIndex', 0);
			});

		},

		responsed: function () {
			var _this = this;
			var matchs = [];
			var manager = this.get('manager');

			var questionsResponsed = this.get('questionsResponsed');


			questionsResponsed.push(Ember.Object.create({
				id: this.get('currentQuestion').get('id').toString(),
				question: this.get('currentQuestion'),
				value: this.get('currentAnswer').get('value')		
			}));
			_this.get('store').unloadAll('match-candidate');

			this.get('currentAnswer').save().then(function () {

				_this.get('store').find('match-candidate', _this.get('guest').get('id')).then(function (match) {

					match.get('candidates').forEach(function (candidate) {
						var mm = {};

						match.get('matchs').forEach(function (match) {
							if (match.candidate == candidate.get('id')) {
								mm = match;
							}				
						});

						mm.answers.forEach(function (answer) {
							var question = _this.get('questionsResponsed').findBy('id', answer.question.toString());
							if (question && answer.question == question.get('id')) {						
								answer.question = question.get('question');
								answer.guestValue = question.get('value');
								answer.guestValueString = question.get('value') == 1 ? 'si' : 'no';
								answer.valueString = answer.value == 1 ? 'si' : ( answer.value == 2 ? 'no' : 'no-respondio');

								if (answer.value && answer.value.toString() == question.get('value').toString()) {
									answer.success = true;
								} else {
									answer.success = false;
								}
							}
						});

						matchs.push(Ember.Object.create({
							candidate: candidate,
							percent: mm.percent,
							points: mm.points,
							answers: mm.answers
						}));

					});

					_this.set('matchs', []);
					_this.set('matchs', matchs);
										
					manager.set('currentQuestionIndex', _this.get('currentQuestionIndex'));
					manager.save();

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
				manager.save();
				this.set('isFinish', true);
			}
		},
	},


	didInsertElement: function () {
		var manager = this.get('manager');
		var store = this.get('store');
		var _this = this;
		var matchs = [];

		if (manager.get('guest')) {
			this.set('creating', true);

			
			store.find('guest', manager.get('guest')).then(function (guest) {
				guest.get('answers').then(function(answers) {
					var questionsResponsed = _this.get('questionsResponsed');

					answers.forEach(function (answer){
						if (answer.get('value')) {						
							questionsResponsed.push(Ember.Object.create({
								id: answer.get('question').get('id').toString(),
								question: answer.get('question'),
								value: answer.get('value')		
							}));
						}
					});
					

					_this.set('guest', guest)
					_this.set('answers', answers);
					_this.set('currentQuestionIndex', parseInt(manager.get('currentQuestionIndex')));
					_this.set('creating', false);					


					_this.get('store').find('match-candidate', _this.get('guest').get('id')).then(function (match) {
						match.get('candidates').forEach(function (candidate) {
							var mm = {};
							match.get('matchs').forEach(function (match) {
								if (match.candidate == candidate.get('id')) {
									mm = match;
								}				
							});

							mm.answers.forEach(function (answer) {
								var question = _this.get('questionsResponsed').findBy('id', answer.question.toString());
								if (question && answer.question == question.get('id')) {						
									answer.question = question.get('question');
									answer.guestValue = question.get('value');
									answer.guestValueString = question.get('value') == 1 ? 'si' : 'no';
									answer.valueString = answer.value == 1 ? 'si' : ( answer.value == 2 ? 'no' : 'no-respondio');

									if (answer.value && answer.value.toString() == question.get('value').toString()) {
										answer.success = true;
									} else {
										answer.success = false;
									}
								}
							});
							matchs.push(Ember.Object.create({
								candidate: candidate,
								percent: mm.percent,
								points: mm.points,
								answers: mm.answers
							}));
						});

						_this.set('matchs', matchs.sortBy('percent').reverse());
						
						if (_this.get('currentAnswer').get('value')) {
							_this.send('next');
						} 
					});					
				});
			});
		}
	},
});
