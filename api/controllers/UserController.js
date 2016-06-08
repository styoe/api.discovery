/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  create: function (req, res) {
    console.log(req.body);

    if (req.body.password !== req.body.confirmPassword) {
      return res.json(401, {err: 'Password doesn\'t match, What a shame!'});
    }

    var userExists = new Promise(function(resolve, reject){
      User.find({ email: req.body.email }).exec(function (err, users){
        if (err) {
          reject(res.negotiate(err));
        }
        resolve(users);
      });
    }).then(function(users){
      if(users.length){
        res.json(401, {err: 'User with that email already exists, What a shame!'});
      }else{
        User.create(req.body).exec(function (err, user) {
          if (err) {
            return res.json(err.status, {err: err});
          }
          // If user created successfuly we return user and token as response
          if (user) {
            // NOTE: payload is { id: user.id}
            res.json(200, {user: user, token: jwToken.issue({id: user.id})});
          }
        });
      }
    }).catch(function(err){
      throw err;
    });

  }
};
