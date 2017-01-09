/**
 * Candidate.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: 'string',
    lastName: 'strng',
    age: 'string',
    ced: 'string',
    web: 'string',
    twitter: 'string',
    facebook: 'string',
    birthdate: 'date',
    bio: 'string',
      
    avatar:{
      model: 'asset',
    },  

    alliance: {
        model: 'alliance'
    },

    position: {
    	model: 'position'
    },

    answers: {
        colection: 'answer',
        via: 'candidate'
    }
  }
};

