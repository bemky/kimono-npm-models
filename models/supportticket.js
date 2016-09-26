'use strict';

module.exports = function(db, mongoose) {
  var Schema = mongoose.Schema;

  var SupportTicketSchema = new Schema({
    name: String,
    email: String,
    type: String,
    typeName: String,
    ticketid: String,
    message: String,
    createdon: Date,
    resolved: Boolean
  });

  mongoose.model('SupportTicket', SupportTicketSchema);
  return db.model('SupportTicket');
};