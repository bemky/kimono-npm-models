'use strict';

module.exports = function(db, mongoose) {
  var Schema = mongoose.Schema;

  var CrawlUrlSchema = new Schema({
    apiid: String,
    url: String,
    idx: Number
  });

  mongoose.model('CrawlUrl', CrawlUrlSchema);
  return db.model('CrawlUrl');
};