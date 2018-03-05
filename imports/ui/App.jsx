// @flow
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Schedule from './Schedule.jsx';
import Task from './Task.jsx';
import TaskList from './TaskList.jsx';
import { Appointments } from '../api/appointments.js';
import { ScheduleTemplate } from '../api/schedule.js';
import { Row, Col } from 'react-bootstrap';
import { FormControl, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../api/tasks.js';
import { withTracker } from 'meteor/react-meteor-data';
import type {appointmentT} from './Schedule.jsx';

type Props = {
  appointments: Array<appointmentT>,
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
   * takes a schedule and puts tasks into them
   */
  scheduleTasks(schedule, tasks: Array<taskT>, date : string) {
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
        if (task) {
          if (!task.timeleft) {
            task.timeleft = task.time
          }
          if (task.timeleft > 0) {
            timetable.push({
              time: schedule[i].time,
              task: task,
            });
            task.timeleft = task.timeleft - 1;
          }
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
    if (document.activeElement.nodeName != "INPUT") {
      switch(e.key) {
        case 'l':
          this.setState({
            activeWindow: (this.state.activeWindow + 1) % 3
          });
          break;
        case 'h':
          this.setState({
            activeWindow: (this.state.activeWindow - 1) % 3
          });
          break;
        case 'a':
          document.getElementById("appointment-input")[0].focus()
          break;
        case 'p':
          document.getElementById("project-input")[0].focus()
          break;
        case 't':
          document.getElementById("task-input")[0].focus()
          break;
        case 'o':
          //document.getElementsByClassName("rbt-input")[0].focus()
          break;
        default:
      }
    } else {
      switch(e.key) {
        case 'Escape':
          document.activeElement.blur()
        default:
      }
    }
  }

  changeSchedule(day, hour, priority) {
    let timetable = JSON.parse(JSON.stringify( this.props.schedule[day].schedule));
    timetable[hour*2].priority = [priority]
    Meteor.call('schedule.change', day, timetable);
  }

  /**
   * gets the schedule for a given day
   */
  getDay(date) {
    let timetable = this.props.schedule[date.getDay()];
    if (!timetable) {
      return [{time: 200,priority: ""}];
    }
    let day = JSON.parse(JSON.stringify(timetable.schedule));
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

    rubric = (<div>
      <ul>
        <li> <b> priorities</b></li>
      {Object.getOwnPropertyNames(window.priorities)
          .sort((a,b) => {return window.priorities[a] > window.priorities[b] ? -1 : 1})
          .map(x => {
            return (<li key={x}> {x} : {window.priorities[x]}</li>)
          })}
        </ul>
    </div>)


    let date = new Date();

    // start scheduling tasks

    let tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    let date3date = new Date();
    date3date.setDate(date3date.getDate() + 2);

    let today = this.getDay(date).filter(x => x.time >= this.state.hour);
    let tomorrow = this.getDay(tomorrowDate);
    let date3 = this.getDay(date3date)

    let tasks = JSON.parse(JSON.stringify(this.props.tasks)); 

    let today_sched = this.scheduleTasks(today, tasks, date.toLocaleString());
    let tom_sched = this.scheduleTasks(tomorrow, tasks, tomorrowDate.toLocaleString());
    let date3_sched = this.scheduleTasks(date3, tasks, date3date.toLocaleString());
    // end scheudlling tasks

    let schedule = [today_sched , tom_sched , date3_sched] 

    let windows = [
      (<Schedule 
        row={this.state.row}
        tasks={this.props.tasks}
        projects={projects}
        appointments={this.props.appointments}
        schedule={schedule}
        changeSchedule={this.changeSchedule.bind(this)}
      />),
      (<TaskList 
        row={this.state.row}
        tasks={tasks}
        projects={projects}
        project={today[0].priority}
        schedule={this.props.schedule}
      />),
      rubric
    ]

    return (
      <div>
        <link 
          rel="stylesheet" 
          href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css"
        />
        <Row>
          <Col sm={12} md={12} lg={4} xl={4}>
            {windows[(this.state.activeWindow + 0 + windows.length) % windows.length]}
          </Col>
          <Col sm={12} md={12} lg={4} xl={4}>
            {windows[(this.state.activeWindow + 1 + windows.length) % windows.length]}
          </Col>
          <Col sm={12} md={12} lg={4} xl={4}>
            {windows[(this.state.activeWindow + 2 + windows.length) % windows.length]}
          </Col>
        </Row>
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
  const appointments = Appointments.find({}, {sort: {date: 1}}).fetch();
  const schedule = ScheduleTemplate.find({}, {sort: {day: 1}}).fetch();

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

  let week = [0,1,2,3,4,5,6];
  let hours = [];
  for (let i=0; i< 24; i += 0.5) {
    hours.push(i);
  }
  let schedules = week.map(x => {
    return hours.map(h => {
      let search = 
        ScheduleTemplate.findOne( {time: h, day: x})
      priority = search ? search.priority[0] : null
      return {
        time: h,
        priority: priority,
      };
    })
  })

  times = {}
  window.schedule= schedule;
  for (day in schedule) {
    for (block in schedule[day].schedule) {
      if (schedule[day].schedule[block].priority) {
        project = schedule[day].schedule[block].priority;
        times[project] = (times[project] | 0) + 1;
      }
    }
  }
  window.priorities = times;

  return {
    appointments: appointments,
    tasks: tasks,
    incompleteCount: Tasks.find({ checked: {$ne: true} }).count(),
    currentUser: Meteor.user(),
    schedule: schedule,
  };
})(App)
