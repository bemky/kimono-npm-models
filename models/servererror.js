'use strict';

module.exports = function(db, mongoose) {
  var Schema = mongoose.Schema;

  var ServerErrorSchema = new Schema({
    url: String,
    description: String,
    detail: String,
    userid: {type: Schema.Types.ObjectId, ref: 'User' },
    lasterron: Date,
    apiid: String,
    errcount: Number,
    uuid: String
  });

  mongoose.model('ServerError', ServerErrorSchema);
  return db.model('ServerError');
};