/**
 * Module dependencies
 */
var util = require( 'util' ),
  actionUtil = require( '../blueprints/_util/actionUtil' );

/**
 * Enable sideloading. Edit config/blueprints.js and add:
 *   ember: {
 *     sideload: true
 *   }
 * Defaults to false.
 *
 * @type {Boolean}
 */
var performSideload = (sails.config.blueprints.ember && sails.config.blueprints.ember.sideload);

/**
 * UserController.js 
 * 
 * @module      :: Controller
 * @description :: Provides the base user
 *                 actions used to make waterlock work.
 *                 
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = {
/**
	 * Find One Record
	 *
	 * get /:modelIdentity/:id
	 *
	 * An API call to find and return a single model instance from the data adapter
	 * using the specified id.
	 *
	 * Required:
	 * @param {Integer|String} id  - the unique id of the particular instance you'd like to look up *
	 *
	 * Optional:
	 * @param {String} callback - default jsonp callback param (i.e. the name of the js function returned)
	 */

	findOne: function findOneRecord( req, res ) {


	  var Model = actionUtil.parseModel( req );
	  var pk = actionUtil.requirePk( req );
	  var query = Guest.findOne( pk );

	  var candidatesMatchs = [];
	  var candidates = [];

	  query = actionUtil.populateEach( query, req );
	
	  query.populate('answers').exec( function found( err, matchingRecord ) {
	    if ( err ) return res.serverError( err );
	    if ( !matchingRecord ) return res.notFound( 'No record found with the specified `id`.' );

    	var guestResponseTotal = 0;

    	_.each(matchingRecord.answers, function (answer) {
    		if (answer.value && parseInt(answer.value) > 0) {
    			guestResponseTotal++;
    		}
    	});

	    var candidatesAnswerQuery = Answer.find().where({position: matchingRecord.position, isGuest: false}).exec(function found(err, matchingRecords) {


	    	_.each(matchingRecords, function (answer) {
		    	var picked = _.filter(candidatesMatchs, { 'id': answer.candidate } );
		    	var guestAnswer = _.filter(matchingRecord.answers, {question: answer.question});

	    		if (picked.length < 1) {
	    			picked = {id: answer.candidate, candidate: answer.candidate, points: 0, percent: 0, responsed: 0, answers: []};
	    			candidatesMatchs.push(picked);
	    		} else {
	    			picked = picked[0];
	    		}

	    		picked.answers.push(answer);
	    		
	    		if (answer.value && parseInt(answer.value) > 0) {
	    			picked.responsed++;
	    			if (guestAnswer[0]) {
	   					guestAnswer = guestAnswer[0];				
		    			if (guestAnswer.value == answer.value) {
		    				picked.points++;
		    				picked.percent = Math.floor((picked.points / guestResponseTotal * 100));
		    			}
	    			}
	    		}
		  	}); 


	    	var cm = _.sortBy(candidatesMatchs, 'percent');

	    	var end = cm.length + 2;
	    	if (end > 15) {
	    		end = 16;
	    	}

	    	cm = cm.reverse();
	    	
	    	cm = cm.slice(0, end);

	    	_.each(cm, function (c) {
	    		candidates.push(c.id);
	    	});

			res.ok({"match-candidate": {id: pk, candidates: candidates, matchs: cm}});
	    });
	  });
	}, 	
};

