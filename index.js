'use strict';

var debug = require('debug')('kim:models');
// mongoose.set('debug', true);

var Models = function(secret, db, mongoose) {
  var apiModel = require('./models/api')(db, mongoose);
  var apiVersionModel = require('./models/apiversion')(db, mongoose);
  var billingPlanModel = require('./models/billingplan')(db, mongoose);
  var callModel = require('./models/call')(db, mongoose);
  var crawlUrlModel = require('./models/crawlurl')(db, mongoose);
  var fileModel = require('./models/file')(db, mongoose);
  var incomingMailModel = require('./models/incomingmail')(db, mongoose);
  var inviteModel = require('./models/invite')(db, mongoose);
  var kimonoAppModel = require('./models/kimonoapp')(db, mongoose);
  var notificationModel = require('./models/notifications')(db, mongoose);
  var paidPlanSignupModel = require('./models/paidplansignup')(db, mongoose);
  var publicApiModel = require('./models/publicapi')(db, mongoose);
  var organizationModel = require('./models/organization')(db, mongoose);
  var profileModel = require('./models/profile')(db, mongoose);
  var rtCallModel = require('./models/rtcall')(db, mongoose);
  var serverErrorModel = require('./models/servererror')(db, mongoose);
  var supportTicketModel = require('./models/supportticket')(db, mongoose);
  var userModel = require('./models/user')(db, mongoose);
  var userMetricModel = require('./models/usermetric')(db, mongoose);
  var weeklyUserMetricModel = require('./models/weeklyusermetric')(db, mongoose);
  var blacklistModel = require('./models/blacklist.js')(db, mongoose);

  return {
    Api: require('./resources/apis')(db, mongoose),
    legacy: {
      Api: apiModel,
      ApiVersion: apiVersionModel,
      BillingPlan: billingPlanModel,
      Call: callModel,
      CrawlUrl: crawlUrlModel,
      File: fileModel,
      IncomingMail: incomingMailModel,
      Invite: inviteModel,
      Kimonoapp: kimonoAppModel,
      Notification: notificationModel,
      PaidPlanSignup: paidPlanSignupModel,
      PublicApi: publicApiModel,
      Profile: profileModel,
      Organization: organizationModel,
      RTCall: rtCallModel,
      ServerError: serverErrorModel,
      SupportTicket: supportTicketModel,
      User: userModel,
      UserMetric: userMetricModel,
      WeeklyUserMetric: weeklyUserMetricModel,
      Blacklist: blacklistModel
    }
  };
};

module.exports = function(secret, db) {
  // FIXME: Add permissions.
  if (!secret) { }

  var mongoose = db.base || db;

  db.on('error', function(err) {
    console.error('MongoDB error: %s', err.stack);
  });

  db.on('close', function(param1, param2) {
    debug('Closed:',param1, param2);
  });

  db.once('open', function () {
    db.db.collectionNames(function (err, names) {
      if (err) {
        console.error(err.stack);
      } else {
        // debug('Connected:',names);
      }
    });
  });

  return new Models(secret, db, mongoose);
};
