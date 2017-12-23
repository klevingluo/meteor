import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Schedule = new Mongo.Collection('schedule');

if (Meteor.isServer) {
  // This code only runs on the server
  // only publish schedule that are public or being to the current user
  Meteor.publish('schedule', function schedulePublication() {
    return Schedule.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId},
      ],
    });
  });
}

Meteor.methods({
  'schedule.change'(day, time, priority) {
  },
});
