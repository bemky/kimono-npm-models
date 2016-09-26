'use strict';

module.exports = function(db, mongoose) {
  var Schema = mongoose.Schema;

  var BlacklistSchema = new Schema({
    url: String
  });

  mongoose.model('Blacklist', BlacklistSchema);
  return db.model('Blacklist');
};
