import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  // This code only runs on the server
  // only publish tasks that are public or being to the current user
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId},
      ],
    });
  });
}

Meteor.methods({

  'tasks.insert'(text, project) {
    check(text, String);

    //Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
      project: project
    });
  },

  'tasks.remove'(taskId) {
    check(taskId, String);

    const task = Tasks.findOne(taskId);
    if (task.pricate && task.owner !== this.userId) {
      // If the task is private, make sure that only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Tasks.remove(taskId);
  },

  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);

    const task = Tasks.findOne(taskId);
    if (task.pricate && task.owner !== this.userId) {
      // If the task is private, make sure that only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, { $set: { checked: setChecked }});
  },

  'tasks.setProject'(taskId, project) {
    check(taskId, String);
    check(project, String);

    const task = Tasks.findOne(taskId);
    if (task.pricate && task.owner !== this.userId) {
      // If the task is private, make sure that only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, { $set: { project: project }});
  },

  'tasks.setTime'(taskId, time) {
    check(taskId, String);
    check(time, Number);

    const task = Tasks.findOne(taskId);
    if (task.pricate && task.owner !== this.userId) {
      // If the task is private, make sure that only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, { $set: { time: time }});
  },

  'tasks.setUtility'(taskId, utility) {
    check(taskId, String);
    check(utility, Number);

    const task = Tasks.findOne(taskId);
    if (task.pricate && task.owner !== this.userId) {
      // If the task is private, make sure that only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, { $set: { utility: utility }});
  },

  'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);

    const task = Tasks.findOne(taskId);

    // Make sure only the task owner can make a task private
    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, { $set: { private: setToPrivate} } );
  }

});
