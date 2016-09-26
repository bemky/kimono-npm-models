'use strict';

module.exports = function(db, mongoose) {
  var Schema = mongoose.Schema;

  var ProfileSchema = new Schema({
    name: String,
    org: String,
    plan: String,
    defaults: Object,
    limits: Object,
    ui: Object
  });

  mongoose.model('Profile', ProfileSchema);
  return db.model('Profile');
};