/**
 * Answer.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  		position: {
  			model: 'position'
  		},

  		candidate: {
  			model: 'candidate'
  		},

  		guest: {
  			model: 'guest'
  		},

  		question: {
  			model: 'question'
  		},

  		value: 'string',

      comment: 'string',
      
  		dummy: 'string',

      isGuest: {
        type: 'boolean',
        defaultsTo: false
      }
  }
};

