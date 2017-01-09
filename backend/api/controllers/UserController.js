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

module.exports = require('waterlock').actions.user({
  /* e.g.
    action: function(req, res){
  
    }
  */

  find: function findRecords(req, res) {
	  // Look up the model
	  var Model = actionUtil.parseModel( req );

	  /* ENABLE if needed ( see https://github.com/mphasize/sails-ember-blueprints/issues/3 )
	   * ----------------
	   * If an `id` param was specified, use the findOne blueprint action
	   * to grab the particular instance with its primary key === the value
	   * of the `id` param.   (mainly here for compatibility for 0.9, where
	   * there was no separate `findOne` action)
	   */
	  // if ( actionUtil.parsePk( req ) ) {
	  //  return require( './findone' )( req, res );
	  // }
	  var where;
	  if (req.query['query'] && req.query['query'] != '') {
		where = {
			or :[ 
                { like: { name: '%'+req.query['query']+'%' } }, { like: { lastName : '%'+req.query['query']+'%' }}, { like: {email: '%' + req.query['query'] + '%'}}
               ] 
           }
	  } else {
	  	//delete req.query['query'];
	  	//delete req.query.query;
	  	where = actionUtil.parseCriteria( req );
	  }

	  // Lookup for records that match the specified criteria
	  var query = Model.find()
	    .where( where )
	    .limit( actionUtil.parseLimit( req ) )
	    .skip( actionUtil.parseSkip( req ) )
	    .sort( actionUtil.parseSort( req ) );

	  query = actionUtil.populateEach( query, req );
	  query.exec( function found( err, matchingRecords ) {
	    if ( err ) return res.serverError( err );

	    // Only `.watch()` for new instances of the model if
	    // `autoWatch` is enabled.
	    if ( req._sails.hooks.pubsub && req.isSocket ) {
	      Model.subscribe( req, matchingRecords );
	      if ( req.options.autoWatch ) {
	        Model.watch( req );
	      }
	      // Also subscribe to instances of all associated models
	      _.each( matchingRecords, function ( record ) {
	        actionUtil.subscribeDeep( req, record );
	      } );
	    }

	    res.ok( actionUtil.emberizeJSON( Model, matchingRecords, req.options.associations, performSideload ) );
	  } );  	
  }
});