/**
 * Pin.js
 *
 * @description :: Main model for the map pin
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  identity: 'Pin',
  attributes: {
    name: {
      type: 'string',
      required: true,
    },
    content: {
      type: 'string',
      required: true,
    },
    coordinates: {
      type: 'json',
      required: true
    },
    createdBy: {
      model: 'User',
      required: true,
    },
    claimedBy: {
      collection: 'User',
      via: 'claimedPins'
    },
  },
  migrate: 'safe',

  /**
   * Find places closer than a certain distance (in km) from a specified location [ lng, lat ].
   * @param conditions
   * JSON object should look like this:
   * {
   *   lng: -72.213,
   *   lat: 45.012,
   * }
   *
   * @param callback (err, results)
   * Returns an array of results (ordered by increasing distance), it looks like this:
   * [
   *   {
   *   dis: 10.321,
   *   obj: { JSON object of Place }
   *   },
   *   {
   *   dis: 20.123,
   *   obj: { JSON object of Place }
   *   }
   *   .
   *   .
   * ]
   */
  findNear: function (coords, callback) {

    //https://gist.github.com/PascalAnimateur/b73617f0a27475fd4ccb

    Pin.native(function (err, collection) {
      if (err) return callback(err);

      collection.geoNear({
        type: "Point" ,
        coordinates: [ coords.lng, coords.lat ]
      }, {
        limit: 200,
        maxDistance: 300 * 1000.0,
        distanceMultiplier: 0.001,
        spherical : true
      }, function (err, places) {
        if (err) return callback(err);

        return callback(null, places.results);
      });
    });
  }
};

