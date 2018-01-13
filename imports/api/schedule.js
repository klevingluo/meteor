import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const ScheduleTemplate = new Mongo.Collection('schedule');

if (Meteor.isServer) {
  // This code only runs on the server
  // only publish schedule that are public or being to the current user
  Meteor.publish('schedule', function schedulePublication() {
    return ScheduleTemplate.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId},
      ],
    });
  });
}

Meteor.methods({
  'schedule.change'(day, schedule) {

    //Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const item = ScheduleTemplate.findOne({day: day})
    if (item) {
      ScheduleTemplate.remove(item._id);
    }

    ScheduleTemplate.insert({
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
      day: day,
      schedule: schedule,
    });
  },

  'schedule.deleteAll'() {
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    let item = ScheduleTemplate.findOne({})
    while (item) {
      ScheduleTemplate.remove(item._id);
      item = ScheduleTemplate.findOne({})
    }
  },
});
