'use strict';

var Api;
var ApiVersion;
var CrawlUrl;
var _ = require('lodash');
var async = require('async');
var debug = require('debug')('kim:models:api');

// FIXME: Remove this.
var allTags = ['food', 'crowdfunding', 'cryptocurrency', 'hockey', 'news','reference','search','community','business', 'banking', 'shopping', 'entertainment','media','sports','blogs','social networking','culture','technology','aggregator','software','science','movies','politics','money','finance','design','social','art','music','football','soccer','web design','jobs','baseball','games','basketball','computers','real estate','travel','maps','entrepreneurship','code','shoes','holidays','startups','books','fashion','investing','salaries','analytics','venture capital','rugby','economics','programming','auctions','weather','hotels','rentals','government','mobile','international','olympics','ecommerce'];

module.exports = function(db, mongoose) {
  var Schema = mongoose.Schema;

  var ApiSchema = new Schema({
    name: String, 
    id: { type: String, unique: true },
    targeturl: String,
    access: {type:String, default: 'public', enum: ['public','private']},
    metadata: Object,
    collections: Array,
    collectionNames: Array,
    apikeys: Array,
    active: Boolean,
    online: Boolean,
    meta: Boolean,
    apis: Array,
    userdata: Object,
    alwayssave: Boolean,
    disabled: {type: Boolean, default: false},
    filterFunction: {type: String, default: ''},
    delinquent: Boolean,
    callcount: Number,
    realtimecallcount: Number,
    attributes: Array,
    otherAttributes: Array,
    pendingnotification: String, //{type: String, enum: ['', 'changedFrequency', 'turnedOff', 'hasManualListCrawlProblem','hasSourceApiCrawlProblem']},
    createdon: Date,
    createdby: String,
    userref: {type: Schema.Types.ObjectId, ref: 'User' },
    frequency: {type: String, enum: [
      'manually',
      'realtime',
      'minutely',
      'fiveminutely',
      'quarterhourly',
      'halfhourly',
      'hourly',
      'daily',
      'weekly',
      'monthly'
    ]},
    // NOTE: must have standalone realtime property because != query can't be indexed.
    realtime: Boolean,
    lastrun: Date,
    lastcall: Date,
    userOverrideCollections: Boolean,
    nextrun: Date,
    pagescrawled: {type: Number, default: 0},
    status: String,
    cronrun:Date,
    alertemails:Array,
    organization: {type: Schema.Types.ObjectId, ref: 'Organization' },
    webhookuris:Array,
    firstClass:Boolean,
    corsdomains:Array,
    crawlwebhookuris:Array,
    lastrunstatus: String,
    lastsuccess: Date,
    newdata: Boolean,
    startday: {type: Number, min: 0, max: 31},
    results: Object,
    pages: Array,
    crawledurls: Array,
    lastversion: {type: Number, default: 0},
    versions: Array,
    instructions: {
      paginated: {type: Boolean, default: false},
      infiniteScrolling: {type: Boolean, default: false},
      nextPageRegex: {type:  String, default: ''},
      nextPageRegexObj: {type:  Object },
      nextPageSelector: {type: String, default: ''},
      generated: {type: Object, default: ''},
      limit: {type: Number, default: 1}, //FIXME: why was this defaulting to 0? that is totally WTF
      maxRows: {type: Number, default: 1}, //FIXME: why was this defaulting to 0? that is totally WTF
      type: {type: String, enum: ['linklist', 'linkapi', 'generation', 'single'], default: 'single'},
      api: {type: String, default: ''},
      collectionprop: {type: String, default: ''},
      urls: Object, // we don't type as an Array because Mongoose will insert an empty, screwing up our migration to CrawlUrls
      // https://github.com/LearnBoost/mongoose/issues/1335
      delay: {type: Number, default: 0}
    },
    authEnabled: {type: Boolean, default: false},
    authSelectors: Object,
    authUrl: String,
    credentials: {
      username: {type: String, default: ''},
      password: {type: String, default: ''}
    },
    tags: Array,
    rootDomain: String,
    clonedCount: {type: Number, default: 0},
    parentApiId: String
  }, {strict: true});

  // Enums
  ApiSchema.PAGINATION = 'pagination';
  ApiSchema.CRAWLING = 'crawling';

  //////////////
  // Validators
  //////////////

  ApiSchema.path('tags').validate(function (value) {
    return _.every(value, function (val){
      return allTags.indexOf(val) > -1;
    });
  }, 'invalid tags value'); 

  ApiSchema.path('name').validate(function (value) {
    return value.length > 0;
  }, 'invalid name'); 

  ApiSchema.path('targeturl').validate(function (value) {
    if(this.meta) {
      return !value || value.length === 0;
    } else {
      return value.length > 0;
    }
  }, 'invalid targeturl'); 

  ////////////////
  // Class Methods
  ////////////////

  ///////////////////
  // Instance Methods
  ///////////////////

  ///////////////////
  // Lifecycle hooks
  ///////////////////

  ApiSchema.pre('init', function(next, api) {

    CrawlUrl = CrawlUrl || db.model('CrawlUrl');
    Api = Api || db.model('Api');
    ApiVersion = ApiVersion || db.model('ApiVersion');

    function migrateInstructions(next) {
      if(!api.instructions || api.instructions == {}) {
        api.instructions = { type: 'single' };
      }
      else {
        if(api.instructions.type == 'paginate'){
          api.instructions.type = 'single';
          api.instructions.paginated = true;
        }
        
        // need to check paginated property to see if it's been migrated or not
        if(api.instructions.type == 'linklist' && api.instructions.linkapi && typeof api.instructions.paginated == 'undefined') {
          api.instructions.type = 'linkapi';
          api.instructions.api = api.instructions.linkapi;
          api.instructions.linkapi = undefined;
        }

        if(!api.instructions.collectionprop){
          api.instructions.collectionprop = '';
        }
      }

      next();
    }

    function migrateCrawlUrls(next) {

      if(!api.instructions || !api.instructions.urls) {
        next();
      }

      else if (!api.instructions.urls.length) {
        delete api.instructions.urls;
        next();
      }
      
      else {
        if (typeof api.instructions.urls == 'string') {
          api.instructions.urls = JSON.parse(api.instructions.urls.replace(/'/g,'"'));
        }

        var urls = api.instructions.urls.map(function(u){
          return new CrawlUrl({ apiid: api.id, url: u});
        });

        CrawlUrl.remove({apiid: api.id}, function(err, n) {
          if(err) { return next(err); }        

          CrawlUrl.create(urls, function(err) {
            if(err) { return next(err); }

            Api.update( { id:api.id }, { $unset: { 'instructions.urls': 1 } }, function(err) {
              if(err) { return next(err); }
              
              delete api.instructions.urls;
              next();
            });
          });
        });
      }
    }

    function migrateAttributesAndContext(next) {
      // migrate attributes/context
      _.each(api.collections, function(collection) {
        _.each(collection, function(property) {
          
          //FIXME: why is this happening?
          if(!property.hasOwnProperty('context')) return;

          // migration from old style attributes schema (pre-extractor refactor with shahmeer)
          if(!property.context.hasOwnProperty('textContent')) {
            property.context.textContent = true;
          }

          //migration from newer style attributes schema with bad json post from jquery $.ajax
          else if(property.context.textContent == 'true') {
            property.context.textContent = true;
          }
          else if(property.context.textContent == 'false') {
            property.context.textContent = false;
          }

          // migration from old style attributes schema (pre-extractor refactor with shahmeer)
          if(!property.context.hasOwnProperty('hiddenElements')) {
            property.context.hiddenElements = false;
          }

          //migration from newer style attributes schema with bad json post from jquery $.ajax
          else if(property.context.hiddenElements == 'true') {
            property.context.hiddenElements = true;
          }
          else if(property.context.hiddenElements == 'false') {
            property.context.hiddenElements = false;
          }

          _.each(property.context.attributes, function(v, k) {

            //migration from old style attributes schema (pre-extractor refactor with shahmeer)
            if(v == 'true'){
              property.context.attributes[k] = {
                attribute: k,
                value: true,
                regex: '/^()(.*?)()$/'
              };
            }
            else if(v == 'false'){
              property.context.attributes[k] = {
                attribute: k,
                value: false,
                regex: '/^()(.*?)()$/'
              };
            }

            //migration from newer style attributes schema with bad json post from jquery $.ajax
            else if(v.value == 'true') {
              v.value = true;
            }
            else if(v.value == 'false') {
              v.value = false;
            }
          });

        });
      });

      next();
    }
    
    function migrateStringifiedCollections(next) {
      if(typeof api.collections == 'string') {
        debug('Found collections of type string for a:', api.id);
        api.collections = JSON.parse(api.collections);
        api.collectionNames = JSON.parse(api.collectionNames);
        api.tags = JSON.parse(api.tags);
        Api.update({id:api.id},{$set:{
          collections: api.collections,
          collectionNames: api.collectionNames,
          tags: api.tags
        }}, function(err, n) {
          if(err) console.error(err.stack);
          next();
        });
      }
      else if(typeof api.collections == 'object' && typeof api.collections[0] == 'string') {
        debug('Found collections array with each collection of type string for a:', api.id);
        api.collections = JSON.parse(api.collections[0]);
        api.collectionNames = JSON.parse(api.collectionNames[0]);
        api.tags = JSON.parse(api.tags[0]);
        Api.update({id:api.id},{$set:{
          collections: api.collections,
          collectionNames: api.collectionNames,
          tags: api.tags
        }}, function(err, n) {
          if(err) console.error(err.stack);
          next();
        });
      }
      else {
        next();
      }
    }

    // pre-init migrations
    async.series([
      migrateInstructions,
      migrateCrawlUrls,
      migrateAttributesAndContext,
      migrateStringifiedCollections
    ],
    // done with migrations
    function(err) {
      next();
    });
    
  });

  ApiSchema.pre('save', function (next){
    this.realtime = this.frequency == 'realtime';
    if(this.instructions && this.instructions.urls) {
      this.setUrlList(this.instructions.urls, next);
      this.instructions.urls = undefined;
    } else {
      next();
    }
  });

  // NOTES -- things that were removed:
  // plugins: mongoose-lifecycle2
  // helpers: _useApiService, _useFullApiService, _fallBackToRows, _parseFields
  // class methods: getResults, addResults
  // instance methods: displayFrequency, updateMeta, applyProperty, applyUpdates, constructAlgoliaEntity

  mongoose.model('Api', ApiSchema);
  return db.model('Api');
};
