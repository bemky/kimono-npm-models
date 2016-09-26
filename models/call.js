'use strict';

module.exports = function(db, mongoose) {
  var Schema = mongoose.Schema;

  var CallSchema = new Schema({
    apiid: String,
    apikey: String,
    realtime: Boolean,
    date: Date,
    fromapp: Boolean,
    fromblock: Boolean,
    sochi: Boolean,
    papi: String,
    client: String,
    ip: String
  });

  mongoose.model('Call', CallSchema);
  return db.model('Call');
};