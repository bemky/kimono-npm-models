'use strict';

module.exports = function(db, mongoose) {
  var Schema = mongoose.Schema;

  var BillingPlan = new Schema({
    name: String,
    planid: String,
    status: String,
    price: Number, //in cents
    minfrequency: String,
    apiallowance: Number,
    realtimecalls: Number,
    hascrawler: Boolean,
    hasalerts: Boolean,
    hasprivate: Boolean,
    haspostauth: Boolean,
    haspdf: Boolean,
    supporttime: Number //in days
  });

  mongoose.model('BillingPlan', BillingPlan);
  return db.model('BillingPlan');
};