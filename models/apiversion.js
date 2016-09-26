'use strict';

var _ = require('lodash');

module.exports = function(db, mongoose) {
  var Schema = mongoose.Schema;

  var ApiVersionSchema = new Schema({
    _id: String,
    apiid: {type: String, default: ''},
    number: {type: Number, default: 0}, // mapped to apiversion property on the api object (i.e. data version -- only incremented when crawl/scrape was succesful for at least one url)
    date: {type: Date, default: Date.now},
    stats: {
      successful: {type: Number, default: 0},
      retried: {type: Number, default: 0},
      failed: {type: Number, default: 0},
      failedUrls: {type: Array, default: []},
      rows: {type: Number, default: 0},
      duration: {type: Number, default: 0} // milliseconds elapsed
    }
  });

  ///////////
  // Methods
  ///////////

  ////////////////////
  // Lifecycle Events
  ////////////////////

  ApiVersionSchema.post('init', function (apiVersion) {
    var urls = apiVersion.stats.failedUrls;
    if(urls) {
      var uniq = _.uniq(urls);
      if(urls.length != uniq.length) {
        apiVersion.stats.failedUrls = uniq;
      }
    }
  });

  mongoose.model('ApiVersion', ApiVersionSchema);
  return db.model('ApiVersion');
};