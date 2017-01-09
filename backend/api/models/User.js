/**
 * User
 *
 * @module      :: Model
 * @description :: This is the base user model
 * @docs        :: http://waterlock.ninja/documentation
 */


module.exports = {

  attributes: require('waterlock').models.user.attributes({
    
    /* e.g.
    nickname: 'string'
    */
    name: 'string',
    lastName: 'string',
    
    isAdmin: 'boolean',

    email: {
     type: 'string',
     unique: true,
     email: true
    },

    password: {
      type: 'string',
      protected: true
    },

    attempts: {
      collection: 'attempt',
      via: 'user',
      protected: true
    },

    jsonWebTokens: {
      collection: 'jwt',
      via: 'owner',
      protected: true
    },

    auth:{
      model: 'auth',
      protected: true
    },
 

  }),
  
  beforeCreate: require('waterlock').models.user.beforeCreate,
  beforeUpdate: require('waterlock').models.user.beforeUpdate,

  afterCreate: function (args, next) {
    var self = this;
    User.findOne(args.id).populate('auth').exec( function updated(err, instance) {
      if (!instance.auth) {
        Auth.create({user: args.id, email: args.email, password: args.password}).exec(function createAuth(err, authInstance) {
          instance.auth = authInstance.id;
          instance.password = '';
          instance.save(function () {
            //self.sendMail(args);
            next();
          })
        })
      } else {
        next();
      }
    });
  },


  afterUpdate: function (args, next) {
    User.findOne(args.id).populate('auth').exec( function updated(err, instance) {
        if (instance.auth && args.password) { 
          instance.auth.password = args.password;
          instance.auth.save(function save(err, auth) {
            next();
          });
        } else {
          next();
        }
    });
  },

  sendMail: function (args)  {

    var config = require('waterlock-local-auth').authConfig;

    var html = this.getHtmlEmail(args);


    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: config.createUser.mail.from, // sender address
        subject: config.createUser.mail.subject, // Subject line
        text: html, // plaintext body
        html: html // html body
    };

    mailOptions.to = args.email;

    var nodemailer = require('nodemailer');
    var mail = config.createUser.mail;
    var smtpTransport = nodemailer.createTransport(mail.options);
    smtpTransport.sendMail(mailOptions, this.mailCallback);
  },

  getHtmlEmail: function(args){
    var jade = require('jade');  
    var path = require('path');    
    var config = require('waterlock-local-auth').config;
    var authConfig = require('waterlock-local-auth').authConfig;
    if(typeof config === 'undefined'){
      throw 'No config file defined, try running [waterlock install config]';
    }

    var viewVars = authConfig.createUser.template.vars;
    viewVars.url = "http://irreversible.cc";
    viewVars.name = args.name;
    viewVars.lastName = args.lastName;
    viewVars.email = args.email;
    viewVars.password = args.password;

    var templatePath = path.normalize(__dirname+'../../'+authConfig.createUser.template.file);
    var html = jade.renderFile(templatePath, viewVars);

    return html;
  },

  /**
   * Callback for mailing operation
   * @param  {Object} error
   * @param  {Object} response
   */
  mailCallback: function(error, response){
     if(error){
          console.log(error);
      }else{
          console.log('Message sent: ' + response.message);
      }
  },
};
