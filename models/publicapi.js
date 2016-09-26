'use strict';

module.exports = function(db, mongoose) {
  var Schema = mongoose.Schema;

  var SourceApiSchema = new Schema({
    name:String,
    source:String,
    id:String,
    idx:Number,
    apiref: {type: Schema.Types.ObjectId, ref: 'Api' }
  });

  var CollectionSchema = new Schema({
    _id:String,
    name:String,
    desc:String,
    type:String, //{api|source|user}
    idx:Number,
    propertydesc:Object
  });

  var PublicApiSchema = new Schema({
    name: String,
    id: String,
    desc: String,
    apis: [SourceApiSchema],
    collections: [CollectionSchema],
    active: Boolean,
    callcount: Number,
    createdon: Date,
    createdby: String,
    userref: {type: Schema.Types.ObjectId, ref: 'User' }
  });

  mongoose.model('PublicApi', PublicApiSchema);
  return db.model('PublicApi');
};