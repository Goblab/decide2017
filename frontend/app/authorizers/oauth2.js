import OAuth2Bearer from 'ember-simple-auth/authorizers/oauth2-bearer';

export default OAuth2Bearer.extend({
	authorize(data, block) {
	    const accessToken = data['access_token'];
	    block('access_token', `${accessToken}`);
	}	
});