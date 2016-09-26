'use strict';

module.exports = function(db, mongoose) {
  var Schema = mongoose.Schema;

  var RTCallSchema = new Schema({
    a: String,                  //apiid
    u: Schema.Types.ObjectId,   //userid
    t: String,                  //type
    d: Date                     //date
  });

  mongoose.model('RTCall', RTCallSchema);
  return db.model('RTCall');
};