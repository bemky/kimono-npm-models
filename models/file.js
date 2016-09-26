'use strict';

module.exports = function(db, mongoose) {
  var Schema = mongoose.Schema;

  var FileSchema = new Schema({
    uuid: String, 
    content: String,
    type: String
  });

  mongoose.model('File', FileSchema);
  return db.model('File');
};