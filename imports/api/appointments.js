import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Appointments = new Mongo.Collection('appointments');

if (Meteor.isServer) {
  // This code only runs on the server
  // only publish appointment that are public or being to the current user
  Meteor.publish('appointments', function appointmentsPublication() {
    return Appointments.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId},
      ],
    });
  });
}

Meteor.methods({

  'appointments.insert'(date, start, end, text) {
    check(text, String);
    check(start, Number);
    check(start, Number);
    check(date, String);

    //Make sure the user is logged in before inserting a appointment
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Appointments.insert({
      text,
      date, 
      start,
      end,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },

  'appointments.remove'(apptId) {
    check(apptId, String);

    const appt = Appointments.findOne(apptId);
    if (appt.private && appt.owner !== this.userId) {
      // If the appointment
      throw new Meteor.Error('not-authorized');
    }

    Appointments.remove(apptId);
  },
});
