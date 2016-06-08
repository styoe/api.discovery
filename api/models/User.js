/**
 * User.js
 *
 * @description :: Main model for user
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */


// We don't want to store password with out encryption
var bcrypt = require('bcrypt');

module.exports = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    username: {
      type: 'string',
      required: 'true',
      unique: true
    },
    email: {
      type: 'email',
      unique: true
    },
    encryptedPassword: {
      type: 'string'
    },
    claimedPins:{
      collection: 'Pin',
      via: 'claimedBy'
    },
    // We don't wan't to send back encrypted password either
    toJSON: function () {
      var obj = this.toObject();
      delete obj.encryptedPassword;
      return obj;
    },
  },
  // Here we encrypt password before creating a User
  beforeCreate : function (values, next) {
    bcrypt.genSalt(10, function (err, salt) {
      if(err) return next(err);
      bcrypt.hash(values.password, salt, function (err, hash) {
        if(err) return next(err);
        values.encryptedPassword = hash;
        next();
      })
    })
  },

  comparePassword : function (password, user, cb) {
    bcrypt.compare(password, user.encryptedPassword, function (err, match) {

      if(err) cb(err);
      if(match) {
        cb(null, true);
      } else {
        cb(err);
      }
    })
  }
};

