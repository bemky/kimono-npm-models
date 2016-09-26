'use strict';

module.exports = function(db, mongoose) {
  var Schema = mongoose.Schema;

  var InviteSchema = new Schema({
    email: String,
    token: String,
    requestedon: Date,
    sent: Boolean,
    senton: Date,
    joined: Boolean,
    joinedon: Date
  });

  mongoose.model('Invite', InviteSchema);
  return db.model('Invite');
};