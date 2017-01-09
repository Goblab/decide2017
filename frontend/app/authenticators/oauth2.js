import Ember from 'ember';
import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';

const {
  RSVP,
  isEmpty,
  run,
  computed,
  makeArray,
  assign: emberAssign,
  merge,
  A,
  testing,
  warn,
  keys: emberKeys
} = Ember;
const assign = emberAssign || merge;
const keys = Object.keys || emberKeys; //

export default OAuth2PasswordGrant.extend({
    serverTokenEndpoint: 'http://localhost:1337/auth/login',
    authorizationPrefix: null,
    tokenPropertyName: 'access_token',
    authorizationHeaderName: 'access_token',
    identificationField: 'email',

	authenticate(identification, password, scope = [], headers = {}) {
	    return new RSVP.Promise((resolve, reject) => {
	      const data                = { 'grant_type': 'password', email: identification, password };
	      const serverTokenEndpoint = this.get('serverTokenEndpoint');
	      const useResponse = this.get('rejectWithResponse');
	      const scopesString = makeArray(scope).join(' ');
	      if (!isEmpty(scopesString)) {
	        data.scope = scopesString;
	      }
	      this.makeRequest(serverTokenEndpoint, data, headers).then((response) => {
	        run(() => {
	          const expiresAt = this._absolutizeExpirationTime(response['expires_in']);
	          this._scheduleAccessTokenRefresh(response['expires_in'], expiresAt, response['refresh_token']);
	          if (!isEmpty(expiresAt)) {
	            response = assign(response, { 'expires_at': expiresAt });
	          }

	          resolve(response);
	        });
	      }, (response) => {
	        run(null, reject, useResponse ? response : response.responseJSON);
	      });
	    });
	},    
});