/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var util = require( 'util' );

module.exports = {

	getFile: function (req, res) {
   		res.sendfile(req.path.substr(1));
	},

	upload: function (req, res) {
		// body...
		if(req.method === 'GET')
			return res.json({'status':'GET not allowed'});						
			//	Call to /upload via GET is error
		var uploadFile = req.file('file');
		var folder = req.body.folder;

	    uploadFile.upload({ dirname: '../../assets/' + folder}, function onUploadComplete (err, files) {				
	    //	Files will be uploaded to .tmp/uploads
	    																		
	    	if (err) return res.serverError(err);								
	    	//	IF ERROR Return and send 500 error with error
			files.forEach(function (file) {
				var path = file.fd.split('/');
				var assetIndex = path.indexOf('assets');
				var pathNew = '';
				for (var i = assetIndex; i < path.length; i++) {
					pathNew += path[i];
					if (i < (path.length - 1)) {
						pathNew += '/';
					}
				}				
				file.fd = pathNew;
			});
	    	res.json({status:200,file:files});
	    });		

		//res.forbidden('You are not permitted to perform this action.');
	},
};