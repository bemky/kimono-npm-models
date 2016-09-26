'use strict';

module.exports = function(db, mongoose) {
  var Schema = mongoose.Schema;

  var NotificationSchema = new Schema({
    title: String,
    type: String,
    link: String,
    message: String
  });

  mongoose.model('Notification', NotificationSchema);
  return db.model('Notification');
};