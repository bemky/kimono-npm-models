'use strict';

module.exports = function(db, mongoose) {
  var Schema = mongoose.Schema;

  var WeeklyUserMetricSchema = new Schema({
    _id: String,
    start: Date,
    activeUsers: Number,
    signups: Number,
    newActiveUsers: Number,
    returningActiveUsers: Number
  });

  mongoose.model('WeeklyUserMetric', WeeklyUserMetricSchema);
  return db.model('WeeklyUserMetric');
};