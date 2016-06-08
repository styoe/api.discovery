/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  index: function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    if (!email || !password) {
      return res.json(401, {err: 'email and password required'});
    }

    console.log(email, password);

    User.findOne({email: email}, function (err, user) {
      if (!user) {
        return res.json(401, {err: 'invalid email or password'});
      }

      User.comparePassword(password, user, function (err, valid) {
        if (err) {
          return res.json(403, {err: 'forbidden'});
        }

        if (!valid) {
          return res.json(401, {err: 'invalid email or password'});
        } else {
          res.json({
            user: user,
            token: jwToken.issue({id : user.id })
          });
        }
      });
    }) 
  },
  // set isAuthorized policy simply to check if user has valid token
  check: function(req, res){
    console.log('asd');
    return res.json(200, {message: 'Token valid'});
  }
};
