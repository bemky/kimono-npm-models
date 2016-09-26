'use strict';

module.exports = function(db, mongoose) {
  var Schema = mongoose.Schema;

  var OrganizationSchema = new Schema({
    name: String
  });

  mongoose.model('Organization', OrganizationSchema);
  return db.model('Organization');
};