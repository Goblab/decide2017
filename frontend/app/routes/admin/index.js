import Ember from 'ember';

export default Ember.Route.extend({
	model: function () {
	  	return Ember.RSVP.hash({
	      positions: this.store.findAll('position'),
	      alliances: this.store.findAll('alliance'),
	      questions: this.store.findAll('question'),
	    }) 		
	},

	actions: {
		process: function  () {
			var _this = this;
			var fr = new FileReader();
			var fileInputElement = document.getElementById("file");
			fr.readAsText(fileInputElement.files[0]);

			fr.onload = function () {
			    var allTextLines = fr.result.split(/\r\n|\n/);
			    var headers = allTextLines[0].split(';');
			    if (headers.length < 2) {
			    	headers = allTextLines[0].split(',');
			    }
			    var lines = [];

			    for (var i=1; i<allTextLines.length; i++) {	    	
			        var data = allTextLines[i].split(';');
			        if (data.length < 2)
			        	data = allTextLines[i].split(',');

			        if (data.length == headers.length) {
			            var tarr = Ember.Object.create({
			            	//lineNumber: i
			            });
			            for (var j=0; j<headers.length; j++) {
			                tarr.set(headers[j].toLowerCase(), data[j]);
			            }
			            lines.push(tarr);
			        }
			    }

			    var candidates = [];
			    var files = [];
			    var answers = [];

			    lines.forEach(function (line) {
			    	var candidate = _this.store.createRecord('candidate');
			    	candidate.set('name', line.get('nombre'));
			    	candidate.set('position', _this.currentModel.positions.findBy('id', line.get('cargo')));
			    	candidate.set('alliance', _this.currentModel.alliances.findBy('id', line.get('partido')));
			   		var newFile = _this.store.createRecord('asset', {path: 'assets/images/' + line.get('lista') + '/' + line.get('ced') + '.jpg', fileName: line.get('ced') + '.jpg', type: 'image/jpeg'});
			   		candidate.set('avatar', newFile);
			   		candidates.push(candidate);
			   		files.push(newFile);

			   		_this.currentModel.questions.forEach(function (question) {
			   			var as = _this.store.createRecord('answer', {
			   				candidate: candidate,
			   				position: candidate.get('position'),
			   				question: question
			   			});

			   			answers.push(as);
			   		});

			    });

				  var promises = Ember.A();
				  

				  files.forEach(function(file) {      
				      promises.push(file.save());
				  });

				  Ember.RSVP.Promise.all(promises).then(function(resolvedPromises){       
				      candidates.forEach(function(item) {
				          promises.push(item.save());     
				      });

				      Ember.RSVP.Promise.all(promises).then(function(resolvedPromises){
					      answers.forEach(function(item) {
					          promises.push(item.save());     
					      });

					      Ember.RSVP.Promise.all(promises).then(function(resolvedPromises){ 
					      	alert('Data Cargada');
					      });
					 });    
				 });			    



			    console.log(candidates);
			    console.log(files);
			    console.log(answers);
			};
		},
	}
});
