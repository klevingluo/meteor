import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import Week from '../data/week.js';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Schedule from './Schedule.jsx';
import Task from './Task.jsx';
import TaskList from './TaskList.jsx';
import { Appointments } from '../api/appointments.js';
import { ScheduleTemplate } from '../api/schedule.js';
import { Col } from 'react-bootstrap';
import { FormControl, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../api/tasks.js';
import { withTracker } from 'meteor/react-meteor-data';

type Props = {
}

type State = {
  hour: number,
  row: number,
  activeWindow: number
}

// App component - represents the whole app
class App extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      activeWindow: 0,
      row: 0,
      hour: this.getHour()
    };
    window.onkeyup = this.handleKey.bind(this);
  }
  // update the time every minute
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      60000
    );
  }

  getHour() {
    let date = new Date();
    let hour = date.getHours();
    if (date.getMinutes() > 30) {
      hour += 0.5;
    }
    return hour;
  }

  tick() {
    this.setState({
      hour: this.getHour()
    })
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
   * takes a schedule and puts tasks into them
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
    return timetable
  }

  handleKey(e) {
    switch(e.key) {
      case 'ArrowRight':
        this.setState({
          activeWindow: (this.state.activeWindow + 1) % 3
        });
        break;
      case 'ArrowLeft':
        this.setState({
          activeWindow: (this.state.activeWindow - 1) % 3
        });
        break;
      case 'o':
        document.getElementsByClassName("rbt-input")[0].focus()
        break;
      default:
    }

  }

  rubric = (<div>
    <ul>
      <li> 
        <p>
          type <b> times </b> in console to see length 
          of projects and <b> priorities </b> to see time 
          allocated
        </p>
      </li>
      <li>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th> urgent </th>
              <th> time sensitive </th>
              <th> only waiting on me </th>
            </tr>
            <tr>
              <td><b>milestone</b></td>
              <td>21</td>
              <td>13</td>
              <td>8</td>
            </tr>
            <tr>
              <td><b>progress</b></td>
              <td>13</td>
              <td>8</td>
              <td>5</td>
            </tr>
            <tr>
              <td><b>small progress</b></td>
              <td>5</td>
              <td>3</td>
              <td>1</td>
            </tr>
          </tbody>
        </table>
      </li>
    </ul>
    <ul>
      <li>1: 30 min / brainless</li>
      <li>2: 1 hr / minor effort</li>
      <li>4: 2 hr / will take research</li>
      <li>8: 4 hr / not sure how to proceed</li>
      <li>16: 8 hr / not sure where to start</li>
      <li>64: 32 hr / hard for an expert, and I'm not one</li>
      <li>128: 64 hr / hard for an expert, and I'm clueless</li>
    </ul>
</div>)

  /**
   * gets the schedule for a given day
   */
  getDay(date) {
    let day = JSON.parse(JSON.stringify(Week.Week.week[date.getDay()]));
    let dateString = date.toLocaleDateString().split('T')[0];
    let appts = this.props.appointments.filter(x => x.date == dateString);
    for (i in appts) {
      for (j = appts[i].start; j < appts[i].end; j = 0.5 + j) {
        let block = day.filter(x => x.time == j)[0];
        if (block) {
          block.task = appts[i].task || appts[i].text;
          block.appointment = appts[i];
        }
      }
    }
    return day;
  }

  render() {

    let projects = [];
    let times = {};
    window.times = times;
    if (this.props.tasks) {
      projects = new Set();
      for (i in this.props.tasks) {
        project = this.props.tasks[i].project;
        if (project) {
          projects.add(project);
          times[project] = (times[project] | 0) + 1;
        }
      }
      projects = Array.from(projects);
    }

    let date = new Date();
    let hour = date.getHours();
    if (date.getMinutes() > 30) {
      hour += 0.5;
    }

    projs = this.getDay(date).filter(x => x.time >= this.state.hour);

    // start scheduling tasks

    let tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    let date3date = new Date();
    date3date.setDate(date3date.getDate() + 2);

    let today = this.getDay(date).filter(x => x.time >= this.state.hour);
    let tomorrow = this.getDay(tomorrowDate);
    let date3 = this.getDay(date3date)

    let tasks = JSON.parse(JSON.stringify(this.props.tasks)); 

    let today_sched = this.scheduleTasks(today, tasks);
    let tom_sched = this.scheduleTasks(tomorrow, tasks);
    let date3_sched = this.scheduleTasks(date3, tasks);
    // end scheudlling tasks
    
    let schedule = [today_sched , tom_sched , date3_sched] 

    let windows = [
      (<Schedule 
        row={this.state.row}
        tasks={this.props.tasks}
        projects={projects}
        schedule={schedule}
      />),
      (<TaskList 
        row={this.state.row}
        tasks={this.props.tasks}
        projects={projects}
        project={projs[0].priority}
      />),
      this.rubric
    ]

    return (
      <div>
        <link 
          rel="stylesheet" 
          href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css"
        />
        <Col sm={12} md={12} lg={4} xl={4}>
          {windows[(this.state.activeWindow + 0 + windows.length) % windows.length]}
        </Col>
        <Col sm={12} md={12} lg={4} xl={4}>
          {windows[(this.state.activeWindow + 1 + windows.length) % windows.length]}
        </Col>
        <Col sm={12} md={12} lg={4} xl={4}>
          {windows[(this.state.activeWindow + 2 + windows.length) % windows.length]}
        </Col>
      </div>
    );
  }
}

function tick() {
  let time = new Date();
  let hour = time.getHours();
  if (time.getMinutes() > 30) {
    hour += 0.5;
  }
  this.setState({
    hour: hour
  });
}


/**
 * calculates the benefit per unit time of the task
 */
function getLeverage(task) {
  if (task.checked) {
    return -1;
  } else if (!task.utility || !task.time) {
    return 0;
  } else {
    return task.utility/task.time;
  }
}

export default withTracker(props => {
  Meteor.subscribe('tasks');
  Meteor.subscribe('appointments');
  Meteor.subscribe('schedule');
  const appointments = Appointments.find({}, {sort: {createdAt: -1}}).fetch();
  const schedule = ScheduleTemplate.find({}, {sort: {createdAt: -1}}).fetch();

  const tasks = Tasks.find({}, {})
    .fetch()
    .sort((a,b) => {
      leva = getLeverage(a) 
      levb = getLeverage(b) 
      if (leva > levb) {
        return -1;
      } else if (levb > leva) {
        return 1;
      } else if (a.text < b.text) {
        return 1;
      }
      return -1;
    });

  return {
    appointments: appointments,
    tasks: tasks,
    incompleteCount: Tasks.find({ checked: {$ne: true} }).count(),
    currentUser: Meteor.user(),
    schedule: schedule,
  };
})(App)
