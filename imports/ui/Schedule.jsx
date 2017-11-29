import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Task from './Task.jsx';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../api/tasks.js';
import { Week } from '../data/week.js';
import { withTracker } from 'meteor/react-meteor-data';

type Props = {
  tasks: Object[]
}

type State = {
}

// Schedule component - represents the whole app
class Schedule extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  getLeverage(task) {
    if (task.checked) {
      return -1;
    } else if (!task.utility || !task.time) {
      return 0;
    } else {
      return task.utility/task.time;
    }
  }

  scheduleTasks(schedule) {
    console.log(schedule)
    let tasks = this.props.tasks;

    tasks.sort((a,b) => {
      leva = this.getLeverage(a) 
      levb = this.getLeverage(b) 
      if (leva > levb) {
        return -1;
      } else if (levb > leva) {
        return 1
      }
      return 0
    });

    let timetable = [];

    let time = new Date();
    let hour = time.getHours();
    if (time.getMinutes() > 30) {
      hour += 0.5;
    }

    for (i=0; i<schedule.length; i++) {
      if (hour > schedule[i].time) {

      } else if (schedule[i].task) {
        timetable.push({
          time: schedule[i].time,
          task: schedule[i].task
        });
      } else {
        let task = tasks.filter(x => {
          return x.project && schedule[i].priority.includes(x.project);
        })[0] 
        if (task) {
          timetable.push({
            time: schedule[i].time,
            task: (<span> <b> [{task.project}]</b> {task.text}</span>)
          });
          if (task.time > 1) {
            task.time = task.time - 1;
          } else {
            tasks = tasks.filter(x => x.text != task.text);
          }
        } else {
          timetable.push({
            time: schedule[i].time,
            task: "[prioritizing] " + schedule[i].priority[0]
          });
        }
      }
    }
    return timetable
  }

  render() {

    date = new Date()
    hours = Week.getDay(date);
    timetable = this.scheduleTasks(hours);

    let time = new Date();
    let hour = time.getHours();
    if (time.getMinutes() > 30) {
      hour += 0.5;
    }

    return (
      <div className="container">
        <table>
          <tbody>
            {
              timetable.map(x => {
                return (
                  <tr 
                    key={x.time} 
                    className={x.time == hour ? "selected" : ""}
                    style={{border: "1px solid black"}}>
                    <td> {x.time}: </td>
                    <td> {x.task} </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default withTracker(props => {
  Meteor.subscribe('tasks');
  const tasks = Tasks.find({}, {sort: {createdAt: -1}}).fetch();

  return {
    tasks: tasks,
    incompleteCount: Tasks.find({ checked: {$ne: true} }).count(),
    currentUser: Meteor.user(),
  };
})(Schedule)
