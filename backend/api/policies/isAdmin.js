module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  if (req.session.authenticated) {
  	var isAdmin = false;
  	User.findOne(req.session.user.id).exec(function get(err, user) {
  		
  		isAdmin = user.isAdmin;

	  	if (isAdmin) {
	    	return next();
	  	} else {
		  // User is not allowed
		  // (default res.forbidden() behavior can be overridden in `config/403.js`)
		  return res.forbidden('You are not permitted to perform this action.');
	  	}
  	});
  } else {
	  // User is not allowed
	  // (default res.forbidden() behavior can be overridden in `config/403.js`)
	  return res.forbidden('You are not permitted to perform this action.');

  }

};