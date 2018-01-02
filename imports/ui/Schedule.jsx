// @flow
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Task from './Task.jsx';
import TimeBlock from './TimeBlock.jsx';
import { Appointments } from '../api/appointments.js';
import { NavDropdown, MenuItem, FormControl, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../api/tasks.js';
import { Week } from '../data/week.js';
import { withTracker } from 'meteor/react-meteor-data';

/**
 * An appointment that I've made with someone else, with a fixed start and end
 */
export type appointmentT = {
  text: string,   // the text for the appointment
  date: string,   // the date of the appointment
  start: number,  // the start time
  end: number,    // end time
  travel: number, // the travel time needed to get to the venue
  _id: string
}

/**
 * a task
 */
export type taskT = {
  text: string,   // the name of the task
  value: ?number, // the value of completing this task
  time: ?number,  // the amount of time, in 0.5 our increments needed to complete this task
  project: ?string, // the project that this task belongs to
  checked: boolean, // whether or not the task is done
  private: boolean,
  _id: string
}

/**
 * a 0.5 hour block of time, occupied by either an appointment or task
 */
export type timeBlockT = {
  time: number,       // the hour of the day
  default: ?string,   // the default activity for this time of day, 
                      //    probably not used execpt for mornings, evenings, and meals
  task: ?taskT,       // the task that is assigned to this block
  project: ?string,   // the project that is this block's priority
  appointement: ?appointmentT, // an appointment that has been assigned to this time block
}

/**
 * a list of timeblocks, with times in order
 */
export type scheduleT = timeBlockT[]

/** 
 * scheuleT's the come from the database with always have either the
 * default or project field filled out.
 */

/** 
 * Projects are not explicitly stored in the app, but consists of all
 * tasks whose project is that project
 */

/**
 * Every day, take the base schedule and apply all applicable appointments to
 * it, then fill the the empty spots with tasks until the.
 */

/**
 * When rendering a task, prioritize elements of projects in this order:
 *
 * 1. any appointments, and buttons for removing and rescheduling the appointment
 * 2. any presets, like sleep and morning rituals
 * 3. any tasks and the appropriate projects for such, and a button for removing the task
 * 4. prioritizing: and then the project name for the block
 */

/**
 * there are two modes for the schedule
 * 1 is the default mode, where timeblocks with the same displayed item,
 * appointment, or task, are collapsed, and the other is where all blocks are
 * displayed separately.
 * 2 in this mode, projects are dropdown and change the priority of the 
 * time block. 
 */

/**
 * adding appointments follows the iso date format, then start time, end time,
 * optionally travel time, then the description of the event.  this adds a travel and
 * event appointments.  If there is an existing appointment, an error is displayed.
 */

/**
 * in the task window, the active project is loaded, and the related tasks are
 * displayed, as well as the estimated completion time and the hours allocated
 * per week.  there is no hide completed button, and adding a task goes into
 * estimated mode, which bubbles all unestimated tasks to the top of the list
 * this is displated instead of the todo list title.
 */

/**
 * the eisenhower matrix:
 *
 * urgency              3   2   1
 * importance    asap
 *               blocking / time sensitive
 *               progress
 *               
 *
 */

type Props = {
  hour: String,
  tasks: Object[],
  appointments: Object[],
  incompleteCount: Number,
  currentUser: String,
  projects: string[]
}

type State = {
  collapse: boolean,
}

// Schedule component - represents the schedule component of the app
class Schedule extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      collapse: false
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the react ref
    let args = ReactDOM.findDOMNode(this.refs.eventInput).value
      .trim()
      .split(' ')
      .map(x => parseFloat(x) == x ? parseFloat(x) : x);

    if (args.length > 4) {
      args[3] = args.slice(3).join(' ');
    }

    // changing iso format to locale date format
    dateEls = args[0].split("-")
    args[0] = "" + parseInt(dateEls[1]) + "/" + parseInt(dateEls[2]) + "/" + dateEls[0]

    Meteor.call('appointments.insert', ...args);

    ReactDOM.findDOMNode(this.refs.eventInput).value = '';
  }

  prefillInput(event) {
    dt = new Date;
    ReactDOM.findDOMNode(this.refs.eventInput).value = dt.toISOString().split('T')[0]
  }

  renderEventForm() {
    return (
      <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
        <FormControl
          className="inline"
          type="text"
          ref="eventInput"
          placeholder="12/6/2017 23 23.5 clean up misc"
          onFocus={this.prefillInput.bind(this)}
        />
      </form> : ''
    )
  }

  /**
   * calculates the benefit per unit time of the task
   */
  getLeverage(task) {
    if (task.checked) {
      return -1;
    } else if (!task.utility || !task.time) {
      return 0;
    } else {
      return task.utility/task.time;
    }
  }

  /**
   * takes a schedule and assigns tasks to it
   */
  scheduleTasks(schedule, tasks) {
    let timetable = [];

    for (i=0; i<schedule.length; i++) {
      if (schedule[i].appointment) {
        timetable.push({
          time: schedule[i].time,
          appointment: schedule[i].appointment
        });
      } else if (schedule[i].task) {
        timetable.push({
          time: schedule[i].time,
          task: {project: 'preset', text: schedule[i].task}
        });
      } else {
        let task = tasks.filter(x => {
          return x.project && schedule[i].priority.includes(x.project) && x.time > 0;
        })[0] 
        if (task && task.time > 0) {
          timetable.push({
            time: schedule[i].time,
            task: task,
          });
          task.time = task.time - 1;
        } else {
          timetable.push({
            time: schedule[i].time,
            task: {text: schedule[i].priority[0], project: 'prioritizing'}
          });
        }
      }
    }
    if (!this.state.collapse) {
      for (i=0; i < timetable.length-1; i++) {
        remove = 
          timetable[i].appointment && timetable[i + 1].appointment &&
          timetable[i].appointment.text == timetable[i + 1].appointment.text;
        if (!remove) {
          remove = timetable[i].task && timetable[i + 1].task &&
            timetable[i].task.text == timetable[i + 1].task.text;
        }
        if (remove) {
          timetable.splice(i+1,1);
          i--;
        }
      }
    }
    return timetable
  }

  /**
   * gets the schedule for a given day
   */
  getDay(date) {
    let day = JSON.parse(JSON.stringify(Week.week[date.getDay()]));
    let dateString = date.toLocaleDateString().split('T')[0];
    let appts = this.props.appointments.filter(x => x.date == dateString);
    for (i in appts) {
      for (j = appts[i].start; j < appts[i].end; j = 0.5 + j) {
        let block = day.filter(x => x.time == j)[0];
        block.task = appts[i].task || appts[i].text;
        block.appointment = appts[i];
      }
    }
    return day;
  }

  toggleCollapse() {
    this.setState({
      collapse: !this.state.collapse
    });
  }

  renderCollapsedCheckbox() {
    return(
      <div>
        <FormControl
          bsSize="small"
          type="checkbox"
          readOnly
          checked={this.state.collapse}
          onClick={this.toggleCollapse.bind(this)}
        />
      </div>
    );
  }

  render() {
    let date = new Date();
    let tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    let date3date = new Date();
    date3date.setDate(tomorrowDate.getDate() + 2);

    let today = this.getDay(date).filter(x => x.time >= this.state.hour);
    let tomorrow = this.getDay(tomorrowDate);
    let date3 = this.getDay(date3date)

    let tasks = this.props.tasks.sort((a,b) => {
      let leva = this.getLeverage(a) 
      let levb = this.getLeverage(b) 
      if (leva > levb) {
        return -1;
      } else if (levb > leva) {
        return 1;
      } else if (a.text < b.text) {
        return 1;
      }
      return -1;
    });

    let today_sched = this.scheduleTasks(today, tasks);
    let tom_sched = this.scheduleTasks(tomorrow, tasks);
    let date3_sched = this.scheduleTasks(date3, tasks);

    return (
      <div className="container">
        { this.renderCollapsedCheckbox() }
        { this.renderEventForm() }
        { this.renderSchedule(today_sched, date, 'today') }
        { this.renderSchedule(tom_sched, tomorrowDate, 'tomorrow') }
        { this.renderSchedule(date3_sched, date3date, '2 days from now') }
      </div>
    );
  }

  removeAppointment(id) {
    Meteor.call('appointments.remove', id);
  }

  renderSchedule(schedule, date, header) {
    return(
      <div>
        <h2> {header}: {date.toLocaleDateString()}</h2>
        <table>
          <tbody>
            {
              schedule.map(x => {
                return (
                  <TimeBlock 
                    x={x}
                    editMode={this.state.collapse}
                    projects={this.props.projects}
                  />
                );
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
}

export default withTracker(props => {
  Meteor.subscribe('tasks');
  Meteor.subscribe('appointments');
  const tasks = Tasks.find({}, {sort: {createdAt: -1}}).fetch();
  const appointments = Appointments.find({}, {sort: {createdAt: -1}}).fetch();

  let time = new Date();
  let hour = time.getHours();
  if (time.getMinutes() > 30) {
    hour += 0.5;
  }

  return {
    hour: hour,
    tasks: tasks,
    appointments: appointments,
    incompleteCount: Tasks.find({ checked: {$ne: true} }).count(),
    currentUser: Meteor.user(),
  };
})(Schedule)
