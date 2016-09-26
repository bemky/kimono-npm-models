'use strict';

module.exports = function(db, mongoose) {
  var Schema = mongoose.Schema;

  var PaidPlanSignupSchema = new Schema({
    email: String,
    plan: String, //'pro'||'enterprise'
    features: Object,
    requestedon: Date
  });

  mongoose.model('PaidPlanSignup', PaidPlanSignupSchema);
  return db.model('PaidPlanSignup');
};