import Ember from 'ember';

export default Ember.Route.extend({
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
			    console.log(lines);
			};
		},
	}
});
