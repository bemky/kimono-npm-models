'use strict';

module.exports = function(db, mongoose) {
  var Schema = mongoose.Schema;

  var UserMetricSchema = new Schema({
    date:String, //human readable date
    datetime:Date, //js date object
    dailyActiveUsers:Number,
    dailyNewActiveUsers:Number,
    dailySignups:Number,
    weeklyActiveUsers:Number,
    weeklyNewActiveUsers:Number,
    weeklySignups:Number,
    monthlyActiveUsers:Number,
    monthlyNewActiveUsers:Number,
    monthlySignups:Number
  });

  mongoose.model('UserMetric', UserMetricSchema);
  return db.model('UserMetric');
};