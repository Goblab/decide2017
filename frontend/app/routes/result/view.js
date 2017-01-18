import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
	return this.store.find('guest', params.guest_id)
  },

  setupController: function (controller, model) {
  		this._super(controller, model);
  		controller.set('questionsResponsed', []);
  		var matchs = [];
  		var _this = this;

		model.get('answers').then(function(answers) {
			var questionsResponsed = controller.get('questionsResponsed');

			answers.forEach(function (answer){
				if (answer.get('value')) {						
					questionsResponsed.push(Ember.Object.create({
						id: answer.get('question').get('id').toString(),
						question: answer.get('question'),
						value: answer.get('value')		
					}));
				}
			});

			_this.get('store').find('match-candidate', model.get('id')).then(function (match) {
				match.get('candidates').forEach(function (candidate) {
					var mm = {};
					match.get('matchs').forEach(function (match) {
						if (match.candidate == candidate.get('id')) {
							mm = match;
						}				
					});

					mm.answers.forEach(function (answer) {
						var question = controller.get('questionsResponsed').findBy('id', answer.question.toString());
						if (question && answer.question == question.get('id')) {						
							answer.question = question.get('question');
							answer.guestValue = question.get('value');
							answer.guestValueString = question.get('value') == 1 ? 'si' : 'no';
							answer.valueString = answer.value == 1 ? 'si' : ( answer.value == 2 ? 'no' : 'no respondio');
							if (!answer.value) {
								answer.notResponsed = true;
							}
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
				controller.set('matchs', matchs.sortBy('percent').reverse());
			});					
		});
  },

});
