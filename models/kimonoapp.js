'use strict';

module.exports = function(db, mongoose) {
  var Schema = mongoose.Schema;

  var KimonoappSchema = new Schema({
    name: String, //Apps must have unique names
    human_name: String, //For humans
    appurl: String, //Auto generated
    description: String,
    createdby: String,
    userref: {type: Schema.Types.ObjectId, ref: 'User' },
    apikey: String,
    active: Boolean,
    createdon: Date,
    access: String, //Can be 'construction', 'public', 'private'
    settings: Object, // App settings selected by creator; Includes fields like Theme
    apis: Array //APIs is a 2-dimensional array. Like APIs (share the same collection structure) are listed on a row; Unike APIs are on different rows
  });
  
  mongoose.model('Kimonoapp', KimonoappSchema);
  return db.model('Kimonoapp');
};