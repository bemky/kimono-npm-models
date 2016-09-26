'use strict';

module.exports = function(db, mongoose) {
  var Schema = mongoose.Schema;

  var IncomingMailSchema = new Schema({
    uuid: String,
    userref: {type: Schema.Types.ObjectId, ref: 'User' },
    apiref: {type: Schema.Types.ObjectId, ref: 'Api' },
    apiid: String,
    html: String,
    toemail: Array,
    fromemail: Array,
    ccemail: Array,
    date: Date
  });

  mongoose.model('IncomingMail', IncomingMailSchema);
  return db.model('IncomingMail');
};