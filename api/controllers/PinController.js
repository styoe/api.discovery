/**
 * PinController
 *
 * @description :: Server-side logic for managing Pins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('promise');

module.exports = {
  createDummyPins: function (req, res) {
    var promises = [];

    for( var i=0;i<10; i++){
      promises.push(
        new Promise(function(resolve, reject){
          Pin.create({
            name: Math.random().toString(36).substring(10),
            coordinates: [ 12+Math.random(), 10+Math.random() ],
            content: 'test',
            createdBy:1,
          }, function (err, Pin) {
            if (err) return reject(err);
            // console.log('Pin created: ', Pin);
            resolve();
          });
        })
      )
    }

    Promise.all(promises)
      .then(()=>res.json({ messsage: 'Pins created'}) )
      .catch((err)=>res.json(401, {err: err}));

  },

	getNearPins:function(req, res){
    console.log('getNearPins');

    if(!req.param('lat') || !req.param('lng')){
      return res.json({
        message: 'Please provide lat & lng'
      });
    }

    var coords = {
      lng: parseFloat(req.param('lng')) || 0,
      lat: parseFloat(req.param('lat')) || 0,
    };

    Pin.findNear(coords, function (err, results) {
      if (err) return res.negotiate(err);

      console.log(results);
      return res.json({pins: results});
    });

  }

};

