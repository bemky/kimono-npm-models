'use strict';

var bcrypt = require('bcrypt');
var async = require('async');
var authTypes = ['github', 'twitter', 'facebook', 'google'];
var Api;
var Kimonoapp;

module.exports = function(db, mongoose) {
  var Schema = mongoose.Schema;

  var UserSchema = new Schema({
    name: String,
    email: String,
    email_lower: String,
    referrer: {type: String},
    inviteemail: String,
    username: String,
    provider: {type: String, default: 'local'},
    createdon: { type: Date, default: Date.now },
    billingplan: String,
    customerid: String,
    cardonfile: String,
    stripetoken: String,
    current_period_start: Date,
    current_period_end: Date,
    realtimecallcount: Number,
    lastPresent: Date,
    lastActive: Date,
    apikey: String,
    securetoken: String,
    alert_seen: Boolean,
    detail_alert_seen: { type: Boolean, default: false },
    activeapicount: {type: Number, default: 0},
    activeappcount: {type: Number, default: 0},
    superuser: Boolean,
    permissions_level: {type: Number, default: 0, max: 3, min: 0},
    hashed_password: String,
    password_token: String,
    profile: {type: Schema.Types.ObjectId, ref: 'Profile' },
    currently_kimonifying: String,
    grandfathered_features: {
      auth: {type: Boolean, default: false},
      infiniteScrolling: {type: Boolean, default: false},
    },
    previously_emailed: {},
    facebook: {},
    twitter: {},
    github: {},
    google: {},
    alerts: {},
    disabled_emails: Object,
    lastEmail: Date,
    new_features: {}
  });

  ////////////
  // Virtuals
  ////////////

  UserSchema.virtual('password').set(function(password) {
    this._password = password;
    this.hashed_password = this.encryptPassword(password);
  }).get(function() {
      return this._password;
  });

  UserSchema.virtual('permissions').get(function() {
    return this.getPermissions();
  });

  //////////////
  // Validators
  //////////////

  var validatePresenceOf = function(value) {
      return value && value.length;
  };

  // the below 4 validations only apply if you are signing up traditionally
  UserSchema.path('name').validate(function(name) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return name.length;
  }, 'Name cannot be blank');

  UserSchema.path('email').validate(function(email) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

  UserSchema.path('username').validate(function(username) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return username.length;
  }, 'Username cannot be blank');

  UserSchema.path('hashed_password').validate(function(hashed_password) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashed_password.length;
  }, 'Password cannot be blank');      

  ///////////
  // Statics
  ///////////

  ///////////
  // Methods
  ///////////

  /**
   * Utility for encrpyting passwords
   * @password {string} password
   * 
   * @returns {string} encryped password
   */
  UserSchema.methods.encryptPassword = function(password) {
    if (!password) return '';
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  /**
   * Get serialized permissions a given user
   * 
   * @returns {object} user permissions
   */
  UserSchema.methods.getPermissions = function() {
    return {
      canEditAdvanced: this.permissions_level >= 1 || this.superuser,
      canSetPrivate: this.permissions_level >= 2 || this.superuser,
      canSetFilterFunction: this.permissions_level >= 3 || this.superuser,
      canSetJsTransform: true
    };
  };

  /**
   * Get count of active Apis for a given user
   * @user       {object} user
   * @callback   {function} callback with signature function(count) { ... }
   * 
   * @returns {null} null
   */
  UserSchema.methods.getActiveApis = function(callback) {
    Api = Api || db.model('Api');
    Api.count({ createdby: this._id, active: true }, function(err, c){
      callback(c);
    });
  };

  /**
   * Get count of active Apps for a given user
   * @user       {object} user
   * @callback   {function} callback with signature function(count) { ... }
   * 
   * @returns {null} null
   */
  UserSchema.methods.getActiveApps = function(callback) {
    Kimonoapp = Kimonoapp || db.model('Kimonoapp');
    Kimonoapp.count({ createdby: this._id, active: true }, function(err, c){
      callback(c);
    });
  };

  ////////////////////
  // Lifecycle Events
  ////////////////////

  UserSchema.pre('save', function(next) {
    var self = this;

    if(!self.isNew) { 
      return next(); 
    }

    async.series([
      function(next) {
        if(!validatePresenceOf(self.password) && authTypes.indexOf(self.provider) === -1) {
          next(new Error('Invalid password'));
        }
        else {
          next();
        }
      },
      function(next) {
        if(typeof self.activeapicount != 'number') {
          self.getActiveApis(function(count) {
            self.activeapicount = count;
            next();
          });
        }
        else {
          next();
        }
      },
      function(next) {
        if(typeof self.activeappcount != 'number') {
          self.getActiveApps(function(count) {
            self.activeappcount = count;
            next();
          });
        }
        else {
          next();
        }
      }
    ], next);
  });

  mongoose.model('User', UserSchema);
  return db.model('User');
};